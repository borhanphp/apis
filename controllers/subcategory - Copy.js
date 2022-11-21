const Subcategory = require('../models/subcategory');
const Category = require('../models/category');
const Blog = require('../models/blog.js');
const slugify = require('slugify');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.create = (req, res) => {

    function slugifi(text) {
        return text.toLowerCase().replace(text, text).replace(/^-+|-+$/g, '')
            .replace(/\s/g, '-').replace(/\-\-+/g, '-');
    
    }

    const { name, show, category } = req.body;

    let subcategory = new Subcategory({ name, show, category });
    let arrayOfCategories = category && category.split(',');
    subcategory.save((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        Subcategory.findByIdAndUpdate(data._id, { $push: { category: arrayOfCategories } }, { new: true }).exec(
            (err, data) => {
                if (err) {
                    return res.status(400).json({
                        error: errorHandler(err)
                    });
                } else {
                   res.json(data);
                }
            }
        );
    });
};

exports.list = (req, res) => {
    Subcategory.find({})
    .populate('category', '_id name slug')
    .exec((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json(data);
    });
};

exports.allCat = (req, res) => {
    Category.find({show: "true"}).exec((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json(data);
    });
};

exports.read = (req, res) => {
    const slug = req.params.slug.toLowerCase();

    Subcategory.findOne({ slug }).exec((err, subcategory) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        // res.json(category);
        Blog.find({ subcategories: subcategory })
            .sort({createdAt: -1})
            .populate('categories', '_id name slug')
            .populate('tags', '_id name slug')
            .populate('postedBy', '_id name')
            .select('_id title slug excerpt categories postedBy tags createdAt updatedAt')
            .exec((err, data) => {
                if (err) {
                    return res.status(400).json({
                        error: errorHandler(err)
                    });
                }
                res.json({ subcategory: subcategory, blogs: data });
            });
    });
};



// exports.read = async (req, res) => {
//     const slug = req.params.slug;
//     const limit = req.query.limit ? parseInt(req.query.limit) : 0;
//     const page = req.query.page ? parseInt(req.query.page) : 0;

   
//     const subcategory = await Subcategory.findOne({ slug }).select('_id');
//     const subcategoryId = subcategory?._id;
//     // console.log(categoryId);

    
//     const count = await Blog.countDocuments({ subcategories: subcategoryId });

//     Subcategory.findOne({ slug }).exec((err, subcategory) => {
        
//         if (err) {
//             return res.status(400).json({
//                 error: errorHandler(err)
//             });
//         }

     
//         let blog = Blog.find({ subcategories: subcategory, status: "published"})
//                     .limit(limit)
//                     .skip(page * limit)
//                     .sort({createdAt: -1})
//                     .select('_id title slug photo excerpt updatedAt')
                   


        

//         Promise.all([blog])
//             .then(data => {
//                 res.json({ subcategory: subcategory, blogs: data[0], count: count });
//             })
//             .catch(err => {
//                 res.status(400).json({
//                     error: errorHandler(err)
//                 });
//             });

          
//     });

 
// };

exports.remove = (req, res) => {
    const slug = req.params.slug.toLowerCase();

    Subcategory.findOneAndRemove({ slug }).exec((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json({
            message: 'Category deleted successfully'
        });
    });
    
};



exports.getCategory = async (req, res) => {
    const category = await Subcategory.find({});
    res.send(category);
}

  exports.saveCategory = (req, res) => {
    const { name, show, category } = req.body;

    Subcategory
        .create({ name, show, category })
        .then(() => res.set(201).send("Added Successfully..."))
        .catch((err) => console.log(err));
    }

  exports.updateCategory = (req, res) => {
    const { _id, name, show, category } = req.body;

    Subcategory
        .findByIdAndUpdate(_id, { name, show, category })
        .then(() => res.set(201).send("Updated Successfully..."))
        .catch((err) => console.log(err));
}

