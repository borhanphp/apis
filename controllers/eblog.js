const Blog = require('../models/eblog');
const Category = require('../models/ecategory');
const Tag = require('../models/etag');
const User = require('../models/User');
const formidable = require('formidable');
const slugify = require('slugify');
// const stripHtml = import('string-strip-html')
const _ = require('lodash');
const { errorHandler } = require('../helpers/dbErrorHandler');
const fs = require('fs');
const { smartTrim } = require('../helpers/blog');

exports.create = (req, res) => {
    
    const directory =  "/root/news/back/public/images";
    let form = new formidable.IncomingForm({
        uploadDir: directory,
        keepExtensions: true
    
});

form.keepExtensions = true;
form.multiples = true;
form.parse(req, (err, fields, files) => {
    //console.log(files);
    // var file = files['image'];
    // var newname=directory;
    // if (file.size) {
    //     newname=directory+"/"+file.name;
    // }
    // if (err) {
    //     return res.status(400).json({
    //         error: 'Image could not upload'
    //     });
    // }

    const { title, body, slug, mtitle, mdesc, categories, tags, status, featured, scrol, subcategories } = fields;

    if (!title || !title.length) {
        return res.status(400).json({
            error: 'title is required'
        });
    }

    /*if (!body || body.length < 200) {
        return res.status(400).json({
            error: 'Content is too short'
        });
    }*/

    if (!categories || categories.length === 0) {
        return res.status(400).json({
            error: 'At least one category is required'
        });
    }

    // if (!tags || tags.length === 0) {
    //     return res.status(400).json({
    //         error: 'At least one tag is required'
    //     });
    // }

    function slugifi(text) {
        return text.toLowerCase().replace(text, text).replace(/^-+|-+$/g, '')
            .replace(/\s/g, '-').replace(/\-\-+/g, '-');
    
    }

   

    let blog = new Blog();
    blog.title = title;
    blog.body = body;
    blog.excerpt = smartTrim(body, 200, ' ', ' ...');
    // blog.slug = slugifi(title);
    if(!slug || slug.length === 0){
        blog.slug = slugifi(title)
    }else{
        blog.slug = slug
    }

    
    // blog.mtitle = `${title} | ${process.env.APP_NAME}`;
    if(!mtitle || mtitle.length === 0){
        blog.mtitle = `${title} | ${process.env.APP_NAME}`
    }else{
        blog.mtitle = mtitle
    }

    // blog.mdesc = body.substring(0, 160);
    if(!mdesc || mdesc.length === 0){
        blog.mdesc = body.substring(0, 160)
    }else{
        blog.mdesc = mdesc
    }
    
    blog.postedBy = req.user._id;
    blog.status = status;
    blog.featured = featured;
    blog.scrol = scrol;
    blog.photo = files.photo.newFilename;
    // categories and tags
    let arrayOfCategories = categories && categories.split(',');
    let arrayOfSubcategories = subcategories && subcategories.split(',');
    let arrayOfTags = tags && tags.split(',');

    // if (files.photo) {
    //     if (files.photo.size > 10000000000) {
    //         return res.status(400).json({
    //             error: 'Image should be less then 1mb in size'
    //         });
    //     }
    //     blog.photo.data = fs.readFileSync(files.photo.filepath);
    //     blog.photo.contentType = files.photo.type;
    // }

    blog.save((err, result) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        // res.json(result);
        Blog.findByIdAndUpdate(result._id, { $push: { categories: arrayOfCategories } }, { new: true }).exec(
            (err, result) => {
                if (err) {
                    return res.status(400).json({
                        error: errorHandler(err)
                    });
                } else {
                    Blog.findByIdAndUpdate(result._id, { $push: { tags: arrayOfTags } }, { new: true }).exec(
                        (err, result) => {
                            if (err) {
                                return res.status(400).json({
                                    error: errorHandler(err)
                                });
                            } else {
                                Blog.findByIdAndUpdate(result._id, { $push: { subcategories: arrayOfSubcategories } }, { new: true }).exec(
                                    (err, result) => {
                                        if (err) {
                                            return res.status(400).json({
                                                error: errorHandler(err)
                                            });
                                        } else {
                                            res.json(result);
                                        }
                                    }
                                );
                            }
                        }
                    );
                }
            }
        );
    });
});
};

// list, listAllBlogsCategoriesTags, read, remove, update

exports.list = (req, res) => {
    Blog.find({})
        .populate('categories', '_id name slug')
        .populate('tags', '_id name slug')
        .populate('postedBy', '_id name username')
        .sort({ createdAt: -1 })
        .select('_id title slug excerpt categories tags postedBy createdAt updatedAt status featured scrol')
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
    Blog.find({status: 'published'})
        .populate('categories', '_id name slug')
        .populate('tags', '_id name slug')
        .populate('postedBy', '_id name username')
        .sort({ createdAt: -1 })
        .skip(0)
        .select('_id title slug excerpt categories tags postedBy createdAt updatedAt status featured scrol')
        .exec((err, data) => {
            if (err) {
                return res.json({
                    error: errorHandler(err)
                });
            }
            res.json(data);
        });
};


exports.scroll = (req, res) => {
    Blog.find({status: 'published', scrol: 'yes'})
        .populate('categories', '_id name slug')
        .populate('tags', '_id name slug')
        .populate('postedBy', '_id name username')
        .sort({ createdAt: -1 })
        .skip(0)
        .select('_id title slug excerpt categories tags postedBy createdAt updatedAt status featured scrol')
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
    Blog.find({status: 'published', featured: "yes"})
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




exports.listAllBlogsCategoriesTags = (req, res) => {
    let limit = req.body.limit ? parseInt(req.body.limit) : 10;
    let skip = req.body.skip ? parseInt(req.body.skip) : 0;

    let blogs;
    let categories;
    let tags;

    Blog.find({status: 'published'})
        .populate('categories', '_id name slug')
        .populate('tags', '_id name slug')
        .populate('postedBy', '_id name username profile')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('_id title slug excerpt categories tags postedBy createdAt updatedAt status featured scrol')
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
    Blog.findOne({ slug, status: 'published' })
        // .select("-photo")
        .populate('categories', '_id name slug')
        .populate('tags', '_id name slug')
        .populate('postedBy', '_id name username')
        .select('_id title photo body slug mtitle mdesc categories tags postedBy createdAt updatedAt status featured scrol')
        .exec((err, data) => {
            if (err) {
                return res.json({
                    error: errorHandler(err)
                });
            }
            res.json(data);
        });
};

exports.remove = (req, res) => {
    const slug = req.params.slug.toLowerCase();
    Blog.findOneAndRemove({ slug }).exec((err, data) => {
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

exports.update = (req, res) => {
    const slug = req.params.slug.toLowerCase();

    Blog.findOne({ slug }).exec((err, oldBlog) => {
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

        form.parse(req, (err, fields, files) => {
            if (err) {
                return res.status(400).json({
                    error: 'Image could not upload'
                });
            }

            let slugBeforeMerge = oldBlog.slug;
            oldBlog = _.merge(oldBlog, fields);
            oldBlog.slug = slugBeforeMerge;

            const { body, desc, categories, tags } = fields;

            if (body) {
                oldBlog.excerpt = smartTrim(body, 320, ' ', ' ...');
                // oldBlog.desc = stripHtml(body.substring(0, 160)).result;
            }

            if (categories) {
                oldBlog.categories = categories.split(',');
            }

            if (tags) {
                oldBlog.tags = tags.split(',');
            }

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
            res.set('Content-Type', blog.photo.contentType);
            return res.send(blog.photo.data);
        });
};



exports.listRelated = (req, res) => {
    // console.log(req.body.blog);
    let limit = req.body.limit ? parseInt(req.body.limit) : 3;
    const { _id, categories } = req.body.blog;

    Blog.find({ _id: { $ne: _id }, categories: { $in: categories }, status: 'published' })
        .limit(limit)
        .sort({createdAt: -1})
        .populate('postedBy', '_id name username profile')
        .select('title slug excerpt postedBy createdAt updatedAt')
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
                status: 'published', $or: [{ title: { $regex: search, $options: 'i' } }, { body: { $regex: search, $options: 'i' } }]
            },
            (err, blogs) => {
                if (err) {
                    return res.status(400).json({
                        error: errorHandler(err)
                    });
                }
                res.json(blogs);
            }
        ).select('-body');
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
        Blog.find({ postedBy: userId, status: 'published' })
            .populate('categories', '_id name slug')
            .populate('tags', '_id name slug')
            .populate('postedBy', '_id name username')
            .select('_id title slug postedBy createdAt updatedAt')
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



  exports.eonlycat = async (req, res) => {
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


// exports.eBlogPaginate = async (req, res) => {
    

//     // const limit = req.query.limit ? parseInt(req.query.limit) : 0;
//     // const page = req.query.page ? parseInt(req.query.page) : 0;
//     // const count = await Blog.countDocuments();



//             Blog.find({})
//                 // .limit(limit)
//                 // .skip(limit * page)
//                 .populate('categories', '_id name slug')
//                 .populate('subcategories', '_id name category slug')
//                 .populate('tags', '_id name slug')
//                 .populate('postedBy', '_id name username')
//                 .sort({ createdAt: -1 })
//                 .select('_id title slug excerpt categories tags postedBy createdAt updatedAt featured scrol status')
//                 .exec((err, data) => {
//                     if (err) {
//                         return res.json({
//                             error: errorHandler(err)
//                         });
//                     }
//                     res.json(data);
//                 });

              
   
//   }


  exports.eBlogPaginate = async (req, res) => {

    const limit = req.query.limit ? parseInt(req.query.limit) : 0;
    const page = req.query.page ? parseInt(req.query.page) : 0;
    const count = await Blog.countDocuments();

    Blog.find({})
        .limit(limit)
        .skip(limit * page)
        .populate('categories', '_id name slug')
        .populate('tags', '_id name slug')
        .populate('postedBy', '_id name username')
        .sort({ createdAt: -1 })
        .select('_id title slug excerpt categories tags postedBy createdAt updatedAt status featured scrol')
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
};



