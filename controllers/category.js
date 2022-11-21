const Category = require('../models/category');
const Blog = require('../models/blog');
const slugify = require('slugify');
const { errorHandler } = require('../helpers/dbErrorHandler');
const Subcategory = require('../models/subcategory');

exports.create = (req, res) => {
    const { name, show} = req.body;
   let slug = slugify(name).toLowerCase();
   

    let category = new Category({ name, slug, show });

    category.save((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json(data);
    });
};



exports.list = (req, res) => {
    Category.find({})
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


exports.allCat2 = (req, res) => {
    Category.find({}).exec((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json(data);
    });
};

exports.read = async (req, res) => {
    const slug = req.params.slug.toLowerCase();
    const limit = req.query.limit ? parseInt(req.query.limit) : 0;
    const page = req.query.page ? parseInt(req.query.page) : 0;

   
    const category = await Category.findOne({ slug }).select('_id');
    const categoryId = category?._id;
    // console.log(categoryId);

    
    const count = await Blog.countDocuments({ categories: categoryId });

    Category.findOne({ slug }).exec((err, category) => {
        
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }

     
        let blog = Blog.find({ categories: category, status: "published"})
                    .limit(limit)
                    .skip(page * limit)
                    .sort({createdAt: -1})
                    .select('_id title slug photo excerpt updatedAt')
                   


        let subcategory = Subcategory.find({ category: category})
                            .sort({createdAt: -1})
                            .populate('category', '_id name slug')
                            .select('_id title name slug');

        Promise.all([blog, subcategory])
            .then(data => {
                res.json({ category: category, blogs: data[0], subcategory: data[1], count: count });
            })
            .catch(err => {
                res.status(400).json({
                    error: errorHandler(err)
                });
            });

          
    });

 
};

exports.subcat = (req, res) => {
    const slug = req.params.slug.toLowerCase();

    Category.findOne({ slug })
        .populate('subcategory', '_id name slug show')
        .exec((err, category) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }


        let blog = Blog.find({ categories: category, status: "published"})
                    .sort({createdAt: -1})
                    .populate('categories', '_id name slug')
                    .populate('subcategories', '_id name slug')
                    .populate('tags', '_id name slug')
                    .populate('postedBy', '_id name')
                    .select('_id title slug excerpt categories photo postedBy tags createdAt updatedAt');

        let subcategory = Subcategory.find({ category: category})
                            .sort({createdAt: -1})
                            .populate('category', '_id name slug')
                            .select('_id title name slug');

        Promise.all([blog, subcategory])
            .then(data => {
                res.json({ category: category, blogs: data[0], subcategory: data[1] });
            }).catch(err => {
                res.status(400).json({
                    error: errorHandler(err)
                });
            });
       

    });
};

exports.readall = (req, res) => {
    const slug = req.params.slug.toLowerCase();

    Category.findOne({ slug }).exec((err, category) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json(category);
    });
};

exports.remove = (req, res) => {
    const slug = req.params.slug.toLowerCase();

    Category.findOneAndRemove({ slug }).exec((err, data) => {
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

exports.update = (req, res) => {

    const slug = req.params.slug.toLowerCase();

    Category.findOneAndUpdate({ slug }).exec((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json({
            message: 'Category deleted successfully'
        });
    });


    // const { name, show} = req.body;


    // data.save((err, data) => {
    //     if (err) {
    //         return res.status(400).json({
    //             error: errorHandler(err)
    //         });
    //     }
    //     res.json(data);
    // });
};


exports.updateCat = async (req, res) => {
    
    const name = req.body.name;
    const show = req.body.show;
    const id = req.body.id;
    try {
       await Category.findById( id, (err, cat) => { 
        cat.name = name;
        cat.show = show;
        cat.save();
    });
    } catch (error) {
      res.status(500).send(error.message);
    }
  };


  exports.getCategory = async (req, res) => {
    const category = await Category.find({});
    res.send(category);
}

  exports.saveCategory = (req, res) => {
    const { name, show, slug } = req.body;

    Category
        .create({ name, show, slug })
        .then(() => res.set(201).send("Added Successfully..."))
        .catch((err) => console.log(err));
    }

  exports.updateCategory = (req, res) => {
    const { _id, name, slug, show } = req.body;

    Category
        .findByIdAndUpdate(_id, { name, slug, show })
        .then(() => res.set(201).send("Updated Successfully..."))
        .catch((err) => console.log(err));
}

