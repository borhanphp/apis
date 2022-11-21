const Video = require('../models/video');
const Category = require('../models/category');
const Subcategory = require('../models/subcategory');
const Tag = require('../models/tag');
const User = require('../models/User');
const formidable = require('formidable');
const slugify = require('slugify');
// const stripHtml = import('string-strip-html')
const _ = require('lodash');
const { errorHandler } = require('../helpers/dbErrorHandler');
const fs = require('fs');
const { smartTrim } = require('../helpers/blog');
const process = require('process');

exports.create = (req, res) => {
    
        const directory =  "/root/news/back/public/images";
        let form = new formidable.IncomingForm({
            uploadDir: directory,
            keepExtensions: true
        
    });
    
    
    form.multiples = true;
    form.parse(req, (err, fields, files) => {
        // console.log(files);

        const { title, videoid, view, body, slug, mtitle, mdesc, status } = fields;

        if (!title || !title.length) {
            return res.status(400).json({
                error: 'title is required'
            });
        }

        function slugifi(text) {
            return text.toLowerCase().replace(text, text).replace(/^-+|-+$/g, '')
                .replace(/\s/g, '-').replace(/\-\-+/g, '-');
        
        }

       

        let video = new Video();
        video.title = title;
        video.videoid = videoid;
        video.view = view;
        if (body){
            video.body = body;
        }else {
            video.body = "Sorry There Is No Content";
        }
        // blog.slug = slugifi(title);
        if(!slug || slug.length === 0){
            video.slug = slugifi(title)
        }else{
            video.slug = slug
        }

        
        // blog.mtitle = `${title} | ${process.env.APP_NAME}`;
        if(!mtitle || mtitle.length === 0){
            video.mtitle = `${title} | ${process.env.APP_NAME}`
        }else{
            video.mtitle = mtitle
        }

        // blog.mdesc = body.substring(0, 160);
        if(!mdesc || mdesc.length === 0){
            video.mdesc = title
        }else{
            video.mdesc = mdesc
        }
        
        video.postedBy = req.user._id;
        video.status = status;
        video.photo = files.photo.newFilename;

        video.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.json(result);
        });
    });
};



exports.list = (req, res) => {
    Video.find({})
        .populate('postedBy', '_id name username')
        .sort({ createdAt: -1 })
        .select('_id title slug videoid view photo createdAt updatedAt status')
        .exec((err, data) => {
            if (err) {
                return res.json({
                    error: errorHandler(err)
                });
            }
            res.json(data);
        });
};

exports.lists = (req, res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 10;
    Video.find({status: 'published', view: "bangla"})
        .populate('postedBy', '_id name username')
        .sort({ createdAt: -1 })
        .skip(0)
        .limit(limit)
        .select('_id title slug photo')
        .exec((err, data) => {
            if (err) {
                return res.json({
                    error: errorHandler(err)
                });
            }
            res.json(data);
        });
};

exports.listsEng = (req, res) => {
    Video.find({status: 'published', view: "english"})
        .populate('postedBy', '_id name username')
        .sort({ createdAt: -1 })
        .skip(0)
        .limit(10)
        .select('_id title slug photo')
        .exec((err, data) => {
            if (err) {
                return res.json({
                    error: errorHandler(err)
                });
            }
            res.json(data);
        });
};


exports.allPosts = (req, res) => {
    Video.find({})
        .populate('categories', '_id name slug')
        .populate('subcategories', '_id name category slug')
        .populate('tags', '_id name slug')
        .populate('postedBy', '_id name username')
        .sort({ createdAt: -1 })
        .skip(0)
        .limit(100)
        .select('_id title slug categories tags postedBy photo createdAt updatedAt featured scrol status')
        .exec((err, data) => {
            if (err) {
                return res.json({
                    error: errorHandler(err)
                });
            }
            res.json(data);
        });
};

exports.sidenews = (req, res) => {
    Video.find({status: 'published'})
        .sort({ createdAt: -1 })
        .skip(0)
        .limit(10)
        .select('_id title slug')
        .exec((err, data) => {
            if (err) {
                return res.json({
                    error: errorHandler(err)
                });
            }
            res.json(data);
        });
};

exports.images = (req, res) => {
    Video.find({})
        .populate('_id')
        .sort({ createdAt: -1 })
        .skip(0)
        .limit(100)
        .select('_id photo')
        .exec((err, data) => {
            if (err) {
                return res.json({
                    error: errorHandler(err)
                });
            }
            res.json(data);
        });
};

exports.latest = async (req, res) => {
    Video.find({featured: "yes", status: 'published'})
        .sort({ createdAt: -1 })
        .skip(0)
        .limit(10)
        .select('_id title slug excerpt photo')
        .exec((err, data) => {
            if (err) {
                return res.json({
                    error: errorHandler(err)
                });
            }
            res.json(data);
        });
};

exports.getPosts = async (req, res) => {
    Video.find({})
         .sort({ createdAt: -1 })
         .skip(0)
         .limit(100)
         .select('_id title slug excerpt photo')
         .exec((err, data) => {
             if (err) {
                 return res.json({
                     error: errorHandler(err)
                 });
             }
             res.json(data);
         });
 };

exports.scroll = async (req, res) => {
    Video.find({scrol: "yes", status: 'published'})
         .populate('categories', '_id name slug')
         .populate('subcategories', '_id name category slug')
         .populate('tags', '_id name slug')
         .populate('postedBy', '_id name username')
         .sort({ createdAt: -1 })
         .skip(0)
         .limit(10)
         .select('_id title slug excerpt categories tags postedBy createdAt updatedAt featured scrol status')
         .exec((err, data) => {
             if (err) {
                 return res.json({
                     error: errorHandler(err)
                 });
             }
             res.json(data);
         });
 };


exports.onlycat = async (req, res) => {
    const categories = req.query.cat;
    
    try{
        let posts;
        if(categories){
            posts = await Blog.find({categories, status: 'published'})
            .populate('categories', '_id name slug')
            .sort({ createdAt: -1 })
            .limit(16)
            .skip(0)
            .select('_id title slug excerpt photo');
        }else{
            posts = await Blog.find();
        }

        res.status(200).json(posts);
    }catch (err){
        res.status(400).json(err);
    };
};

exports.listAllBlogsCategoriesTags = (req, res) => {
    let limit = req.body.limit ? parseInt(req.body.limit) : 10;
    let skip = req.body.skip ? parseInt(req.body.skip) : 0;

    let blogs;
    let categories;
    let tags;

    Blog.find({})
        .populate('categories', '_id name slug')
        .populate('tags', '_id name slug')
        .populate('postedBy', '_id name username profile')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('_id title slug excerpt photo categories tags postedBy createdAt updatedAt featured scrol status')
        .exec((err, data) => {
            if (err) {
                return res.json({
                    error: errorHandler(err)
                });
            }
            blogs = data; // blogs
            // get all categories
            Category.find({}).exec((err, c) => {
                if (err) {
                    return res.json({
                        error: errorHandler(err)
                    });
                }
                categories = c; // categories
                // get all tags
                Tag.find({}).exec((err, t) => {
                    if (err) {
                        return res.json({
                            error: errorHandler(err)
                        });
                    }
                    tags = t;
                    // return all blogs categories tags
                    res.json({ blogs, categories, tags, size: blogs.length });
                });
            });
        });
};




exports.read = (req, res) => {
    const slug = req.params.slug.toLowerCase();
    let video = Video.findOne({ slug })
        // .select("-photo")
        .populate('postedBy', '_id name username')
        .select('_id title body slug photo videoid createdAt updatedAt');

        

    Promise.all([video]).then(([data]) => {
        res.json(data);
    }
    ).catch(err => {
        res.json({
            error: errorHandler(err)
        });
    }
    );

};


exports.readBng = (req, res) => {
    const slug = req.params.slug.toLowerCase();
    let video = Video.findOne({ slug , status: 'published', view: "bangla"})
        // .select("-photo")
        .populate('postedBy', '_id name username')
        .select('_id title body slug photo videoid createdAt updatedAt');

        

    Promise.all([video]).then(([data]) => {
        res.json(data);
    }
    ).catch(err => {
        res.json({
            error: errorHandler(err)
        });
    }
    );

};

exports.readEng = (req, res) => {
    const slug = req.params.slug.toLowerCase();
    let video = Video.findOne({ slug , status: 'published', view: "english"})
        // .select("-photo")
        .populate('postedBy', '_id name username')
        .select('_id title body slug photo videoid createdAt updatedAt');

        

    Promise.all([video]).then(([data]) => {
        res.json(data);
    }
    ).catch(err => {
        res.json({
            error: errorHandler(err)
        });
    }
    );

};


exports.readUp = (req, res) => {
    const slug = req.params.slug.toLowerCase();
    let video = Video.findOne({ slug })
        // .select("-photo")
        .populate('postedBy', '_id name username')
        .select('_id title body mtitle mdesc slug videoid view photo createdAt updatedAt status');

        

    Promise.all([video]).then(([data]) => {
        res.json(data);
    }
    ).catch(err => {
        res.json({
            error: errorHandler(err)
        });
    }
    );

};

exports.remove = (req, res) => {
    const slug = req.params.slug.toLowerCase();
    Video.findOneAndRemove({ slug }).exec((err, data) => {
        if (err) {
            return res.json({
                error: errorHandler(err)
            });
        }
        res.json({
            message: 'Blog deleted successfully'
        });
    });
};

// exports.update = (req, res) => {
//     const slug = req.params.slug.toLowerCase();

//     Video.findOne({ slug }).exec((err, video) => {
//         if (err) {
//             return res.status(400).json({
//                 error: errorHandler(err)
//             });
//         }

//         let form = new formidable.IncomingForm();
//         form.keepExtensions = true;

//         form.parse(req, (err, fields, files) => {
//             // console.log(files);
//             let slugBeforeMerge = video.slug;
//             video = _.merge(video, fields);
//             video.slug = slugBeforeMerge;

//             const { title, videoid, view, body, slug, mtitle, mdesc, status } = fields;
    
         
           
    
//             video.title = title;
//             video.videoid = videoid;
//             video.view = view;
            
//             video.body = body;
            
          
//             video.slug = slug
           
//             video.mtitle = mtitle
           
//             video.mdesc = mdesc
//             video.status = status;
//             video.photo = "/images/" + files.photo.newFilename;
    
//             video.save((err, result) => {
//                 if (err) {
//                     return res.status(400).json({
//                         error: errorHandler(err)
//                     });
//                 }
//                 res.json(result);
//             });
//         });
//     });
// };

exports.update = (req, res) => {
    const slug = req.params.slug.toLowerCase();

    Video.findOne({ slug }).exec((err, oldBlog) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }

        const directory =  "/root/news/back/public/images";
        let form = new formidable.IncomingForm({
            uploadDir: directory,
            keepExtensions: true
		});
        form.keepExtensions = true;

        form.parse(req, (err, fields, files) => {
         
            let slugBeforeMerge = oldBlog.slug;
            oldBlog = _.merge(oldBlog, fields);
            oldBlog.slug = slugBeforeMerge;

            if(files.photo) {
                oldBlog.photo = files.photo.newFilename;
            }

            oldBlog.save((err, result) => {
                if (err) {
                    return res.status(400).json({
                        error: errorHandler(err)
                    });
                }
                // result.photo = undefined;
                res.json(result);
            });
        });
    });
};


exports.photo = (req, res) => {
    const slug = req.params.slug.toLowerCase();
    Blog.findOne({ slug })
        .select('photo')
        .exec((err, blog) => {
            if (err || !blog) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            // res.set('Content-Type', blog.photo.contentType);
            return res.send(blog.photo);
        });
};

// exports.images = (req, res) => {
//     Blog.find({})
//         .exec((err, image) => {
//             if (err || !image) {
//                 return res.status(400).json({
//                     error: errorHandler(err)
//                 });
//             }
//             res.set('Content-Type', image.photo.contentType);
//             return res.send(image.photo.data);
//         });
// };




// exports.images =  async (req, res)=>{
//     const image = await Blog.find().sort({createdAt: -1});
//     res.json(image);
// };


exports.listRelated = (req, res) => {
    // console.log(req.body.blog);
    let limit = req.body.limit ? parseInt(req.body.limit) : 4;
    const { _id, categories } = req.body.blog;

    Blog.find({ _id: { $ne: _id }, categories: { $in: categories } })
        .limit(limit)
        .sort({createdAt: -1})
        .populate('postedBy', '_id name username profile')
        .select('title slug excerpt photo postedBy createdAt updatedAt')
        .exec((err, blogs) => {
            if (err) {
                return res.status(400).json({
                    error: 'Blogs not found'
                });
            }
            res.json(blogs);
        });
};

//
exports.listSearch = (req, res) => {
    console.log(req.query);
    const { search } = req.query;
    if (search) {
        Blog.find(
            {
                $or: [{ title: { $regex: search, $options: 'i' } }, { body: { $regex: search, $options: 'i' } }]
            },
            (err, blogs) => {
                if (err) {
                    return res.status(400).json({
                        error: errorHandler(err)
                    });
                }
                res.json(blogs);
            }
        ).select('-photo -body');
    }
};

exports.listSearch2 = (req, res) => {
    console.log(req.query);
    const { search } = req.query;
    if (search) {
        Blog.find(
            {
                $or: [{ title: { $regex: search, $options: 'i' } }]
            },
            (err, blogs) => {
                if (err) {
                    return res.status(400).json({
                        error: errorHandler(err)
                    });
                }
                res.json(blogs);
            }
        ).select('-photo -body');
    }
};

exports.listByUser = (req, res) => {
    User.findOne({ username: req.params.username }).exec((err, user) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        let userId = user._id;
        Blog.find({ postedBy: userId })
            .populate('categories', '_id name slug')
            .populate('tags', '_id name slug')
            .populate('postedBy', '_id name username')
            .select('_id title slug postedBy createdAt photo updatedAt')
            .exec((err, data) => {
                if (err) {
                    return res.status(400).json({
                        error: errorHandler(err)
                    });
                }
                res.json(data);
            });
    });
};


exports.all = async (req, res) => {
    const categories = req.query.cat;
    let limit = parseInt(req.query.limit);
    let skip = parseInt(req.query.skip);
    var sort = req.query.sort;
    var name = req.query.name;
    var obj = {}
    obj[name] = sort

    
    await Blog
    .find({categories})
    .populate('categories', '_id name slug')
    .sort(obj)
    .limit(limit)
    .skip(skip)
    .exec((err, blogs) => {
        if(err){
            res.status(404).send({
                message: err,
                data: []
            });
        }else {
            res.status(200).send({
                message: 'OK',
                data: blogs
            });
        }
    });
  };

//   exports.allImages = (req, res) => {
//     Blog.find({})
//         .populate('categories', '_id name slug')
//         .populate('tags', '_id name slug')
//         .populate('postedBy', '_id name username')
//         .sort({ createdAt: -1 })
//         .skip(0)
//         .limit(3)
//         .select('_id title slug excerpt categories tags postedBy createdAt updatedAt')
//         .exec((err, data) => {
//             if (err) {
//                 return res.json({
//                     error: errorHandler(err)
//                 });
//             }
//             res.json(data);
//         });
// };

exports.pageTest = async (req, res) => {
    

    const limit = req.query.limit ? parseInt(req.query.limit) : 0;
    const page = req.query.page ? parseInt(req.query.page) : 0;
    const count = await Video.countDocuments();



    await  Video.find({})
                .limit(limit)
                .skip(limit * page)
                .populate('postedBy', '_id name username')
                .sort({ createdAt: -1 })
                .select('_id title slug excerpt categories tags postedBy createdAt updatedAt featured scrol status')
                .exec((err, data) => {
                    if (err) {
                        return res.json({
                            error: errorHandler(err)
                        });
                    }
                    res.set('Access-Control-Expose-Headers', 'X-Total-Count')
                    res.set('X-Total-Count', count)
                    res.json(data);
                });
   
  }

  exports.searchBlog = async (req, res) => {
    

    const limit = req.query.limit ? parseInt(req.query.limit) : 0;
    const page = req.query.page ? parseInt(req.query.page) : 0;
    const count = await Blog.countDocuments();



         Blog.find({})
                .limit(limit)
                .skip(limit * page)
                .populate('categories', '_id name slug')
                .populate('subcategories', '_id name category slug')
                .populate('tags', '_id name slug')
                .populate('postedBy', '_id name username')
                .sort({ createdAt: -1 })
                .select('_id title slug excerpt categories tags postedBy createdAt updatedAt featured scrol status')
                .exec((err, data) => {
                    if (err) {
                        return res.json({
                            error: errorHandler(err)
                        });
                    }
                    res.set('Access-Control-Expose-Headers', 'X-Total-Count')
                    res.set('X-Total-Count', count)
                    res.json(data);
                });
   
  }

  exports.updateVideo = (req, res) => {
    const { _id, name, slug, show } = req.body;

    Video
        .findByIdAndUpdate(_id, { name, slug, show })
        .then(() => res.set(201).send("Updated Successfully..."))
        .catch((err) => console.log(err));
}





