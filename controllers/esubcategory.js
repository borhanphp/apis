const Subcategory = require('../models/esubcategory');
const Category = require('../models/ecategory');
const Blog = require('../models/eblog.js');
const slugify = require('slugify');
const { errorHandler } = require('../helpers/dbErrorHandler');

function slugifi(text) {
    return text.toLowerCase().replace(text, text).replace(/^-+|-+$/g, '')
        .replace(/\s/g, '-').replace(/\-\-+/g, '-');

}

exports.create = (req, res) => {

   
    const { name, show, ecategory } = req.body;
    let slug = slugifi(name);

    let subcategory = new Subcategory({ name, slug, show, ecategory });
    let arrayOfCategories = ecategory && ecategory.split(',');
    subcategory.save((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        Subcategory.findByIdAndUpdate(data._id, { $push: { ecategory: arrayOfCategories } }, { new: true }).exec(
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
    .populate('ecategory', '_id name slug')
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
    const { name, show, ecategory } = req.body;
    let slug = slugifi(name).toLowerCase();

    Subcategory
        .create({ name, show, slug, ecategory })
        .then(() => res.set(201).send("Added Successfully..."))
        .catch((err) => console.log(err));
    }

  exports.updateCategory = (req, res) => {
    const { _id, name, show, ecategory } = req.body;

    Subcategory
        .findByIdAndUpdate(_id, { name, show, ecategory })
        .then(() => res.set(201).send("Updated Successfully..."))
        .catch((err) => console.log(err));
}
