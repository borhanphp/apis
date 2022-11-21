const Classified = require('../models/classified');
const Contact = require('../models/contact');
const Advertise = require('../models/advertisement');
const Editor = require('../models/editor');
const formidable = require('formidable');
// const stripHtml = import('string-strip-html')
const _ = require('lodash');
const { errorHandler } = require('../helpers/dbErrorHandler');


function slugifi(text) {
    return text.toLowerCase().replace(text, text).replace(/^-+|-+$/g, '')
        .replace(/\s/g, '-').replace(/\-\-+/g, '-');

}

exports.createClassified = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {

        const { title, body, slug, language, category, show } = fields;

        let page = new Classified(); 
        page.title = title;
        page.body = body;
        if (slug) {
            page.slug = slug + Date.now();
        }else{
            page.slug = slugifi(title) + Date.now();
        }
        page.language = language;
        page.category = category;
        page.show = show;
        page.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }

            res.json(result);
        });
    });
};

exports.getClassified =  async (req, res)=>{
    const data = await Classified.find({show: "true", language: "bangla"}).sort({createdAt: -1});
    res.json(data);
};

exports.getClassifiedEng =  async (req, res)=>{
    const data = await Classified.find({show: "true", language: "english"}).sort({createdAt: -1});
    res.json(data);
};

exports.read = (req, res) => {
    const slug = req.params.slug.toLowerCase();
    Classified.findOne({ slug })
        // .select("-photo")
        .select('_id title body slug language show category postedBy createdAt updatedAt')
        .exec((err, data) => {
            if (err) {
                return res.json({
                    error: errorHandler(err)
                });
            }
            res.json(data);
        });
};

exports.getMetrimony = (req, res) => {
    Classified.find({matrimony: 'true'}).sort({createdAt: -1})
        .select('_id title body slug postedBy createdAt updatedAt')
        .exec((err, data) => {
            if (err) {
                return res.json({
                    error: errorHandler(err)
                });
            }
            res.json(data);
        });
};

exports.getFlat = (req, res) => {
    Classified.find({flat: 'true'}).sort({createdAt: -1})
        .select('_id title body slug postedBy createdAt updatedAt')
        .exec((err, data) => {
            if (err) {
                return res.json({
                    error: errorHandler(err)
                });
            }
            res.json(data);
        });
};

exports.getSecurity = (req, res) => {
    Classified.find({security: 'true'}).sort({createdAt: -1})
        .select('_id title body slug postedBy createdAt updatedAt')
        .exec((err, data) => {
            if (err) {
                return res.json({
                    error: errorHandler(err)
                });
            }
            res.json(data);
        });
};


exports.allclassified = async (req, res) => {
    

    const limit = req.query.limit ? parseInt(req.query.limit) : 0;
    const page = req.query.page ? parseInt(req.query.page) : 0;
    const count = await Classified.countDocuments();



    await  Classified.find({})
                .limit(limit)
                .skip(limit * page)
                .sort({ createdAt: -1 })
                .select('_id title slug body show language category postedBy createdAt updatedAt')
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


//   exports.update = (req, res) => {
//     const { _id, name, slug, show } = req.body;

//     Classified
//         .findByIdAndUpdate(_id, { name, slug, show })
//         .then(() => res.set(201).send("Updated Successfully..."))
//         .catch((err) => console.log(err));
// }


exports.update = (req, res) => {
    const slug = req.params.slug.toLowerCase();

    Classified.findOne({ slug }).exec((err, oldBlog) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }

        let form = new formidable.IncomingForm();
        form.keepExtensions = true;

        form.parse(req, (err, fields, files) => {
         
            let slugBeforeMerge = oldBlog.slug;
            oldBlog = _.merge(oldBlog, fields);
            oldBlog.slug = slugBeforeMerge;



            oldBlog.save((err, result) => {
                if (err) {
                    return res.status(400).json({
                        error: errorHandler(err)
                    });r
                }
                // result.photo = undefined;
                res.json(result);
            });
        });
    });
};


exports.remove = (req, res) => {
    const slug = req.params.slug.toLowerCase();
    Classified.findOneAndRemove({ slug }).exec((err, data) => {
        if (err) {
            return res.json({
                error: errorHandler(err)
            });
        }
        res.json({
            message: 'Deleted successfully'
        });
    });
};





