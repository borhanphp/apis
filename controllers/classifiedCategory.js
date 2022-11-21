const Category = require('../models/ccategory');
const Blog = require('../models/eblog.js');
const slugify = require('slugify');
const { errorHandler } = require('../helpers/dbErrorHandler');
const Classified = require('../models/classified');


function slugifi(text) {
    return text.toLowerCase().replace(text, text).replace(/^-+|-+$/g, '')
        .replace(/\s/g, '-').replace(/\-\-+/g, '-');

}

exports.create = (req, res) => {
    const { name, show, language } = req.body;
    let slug = slugifi(name) + Date.now();

    let category = new Category({ name, slug, show, language });

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
    Category.find({}).exec((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json(data);
    });
};

exports.allCat = (req, res) => {
    Category.find({show: "true", language: "bangla"}).exec((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json(data);
    });
};

exports.allCatEng = (req, res) => {
    Category.find({show: "true", language: "english"}).exec((err, data) => {
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

    Category.findOne({ slug }).exec((err, category) => {
        console.log(category);
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        // res.json(category);
        Classified.find({ category: category, language: "bangla", show: "true" })
            .sort({createdAt: -1})
            .populate('category', '_id name')
            .select('_id title slug body createdAt updatedAt')
            .exec((err, data) => {
                if (err) {
                    return res.status(400).json({
                        error: errorHandler(err)
                    });
                }
                res.json({ category: category, classified: data });
            });
    });
};

exports.readEng = (req, res) => {
    const slug = req.params.slug.toLowerCase();

    Category.findOne({ slug }).exec((err, category) => {
        console.log(category);
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        // res.json(category);
        Classified.find({ category: category, language: "english", show: "true" })
            .sort({createdAt: -1})
            .populate('category', '_id name')
            .select('_id title slug body createdAt updatedAt')
            .exec((err, data) => {
                if (err) {
                    return res.status(400).json({
                        error: errorHandler(err)
                    });
                }
                res.json({ category: category, classified: data });
            });
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

exports.getCategory = async (req, res) => {
    const category = await Category.find({});
    res.send(category);
}

  exports.saveCategory = (req, res) => {
    const { name, show, language } = req.body;
    let slug = slugifi(name) + Date.now();

    Category
        .create({ name, show, slug, language })
        .then(() => res.set(201).send("Added Successfully..."))
        .catch((err) => console.log(err));
    }

  exports.updateCategory = (req, res) => {
    const { _id, name, slug, show, language } = req.body;

    Category
        .findByIdAndUpdate(_id, { name, slug, show, language })
        .then(() => res.set(201).send("Updated Successfully..."))
        .catch((err) => console.log(err));
}

