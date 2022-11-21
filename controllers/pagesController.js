const Page = require('../models/page');
const Contact = require('../models/contact');
const Advertise = require('../models/advertisement');
const Editor = require('../models/editor');
const formidable = require('formidable');
// const stripHtml = import('string-strip-html')
const _ = require('lodash');
const { errorHandler } = require('../helpers/dbErrorHandler');
const blog = require('../models/blog');



function slugifi(text) {
    return text.toLowerCase().replace(text, text).replace(/^-+|-+$/g, '')
        .replace(/\s/g, '-').replace(/\-\-+/g, '-');

}

exports.createPage = (req, res) => {
    const directory =  "/root/news/back/public/images";
    let form = new formidable.IncomingForm({
        uploadDir: directory,
        keepExtensions: true
    
});

    form.keepExtensions = true;
    form.multiples = true;
    form.parse(req, (err, fields, files) => {

        const { title, body, slug, footermenu, view, mainmenu, topmenu, none } = fields;

        let page = new Page(); 
        page.title = title;
        page.body = body;

        if(slug){
            page.slug = slug + Date.now();
        }else{
            page.slug = slugifi(title) + Date.now();
        }
        page.view = view;
        page.footermenu = footermenu;
        page.mainmenu = mainmenu;
        page.topmenu = topmenu;
        page.none = none;
        page.photo = files.photo.newFilename;
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

exports.getPage =  async (req, res)=>{
    const data = await Page.find().sort({createdAt: -1});
    res.json(data);
};


exports.getTopMenu = async (req, res) => {
    const data = await Page.find({topmenu: true, view: "bangla"}).sort({createdAt: -1});
    res.json(data);
}

exports.getTopMenuEng = async (req, res) => {
    const data = await Page.find({topmenu: true, view: "english"}).sort({createdAt: -1});
    res.json(data);
}

exports.getFooterMenu = async (req, res) => {
    const data = await Page.find({footermenu: true, view: 'bangla'}).sort({createdAt: -1});
    res.json(data);
}

exports.getFooterMenuEng = async (req, res) => {
    const data = await Page.find({footermenu: true, view: 'english'}).sort({createdAt: -1});
    res.json(data);
}

exports.getMainMenu = async (req, res) => {
    const data = await Page.find({mainmenu: true}).sort({createdAt: -1});
    res.json(data);
}

exports.read = (req, res) => {
    const slug = req.params.slug.toLowerCase();
    Page.findOne({ slug })
        .select('_id title photo view body slug footermenu mainmenu topmenu none')
        .exec((err, data) => {
            if (err) {
                return res.json({
                    error: errorHandler(err)
                });
            }
            res.json(data);
        });
};


exports.update = (req, res) => {
    const slug = req.params.slug.toLowerCase();

    Page.findOne({ slug }).exec((err, page) => {
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

            let slugBeforeMerge = page.slug;
            page = _.merge(page, fields);
            page.slug = slugBeforeMerge;
    
            const { title, body, slug, footermenu, view, mainmenu, topmenu, none } = fields;
            
            page.title = title;
            page.body = body;
            page.slug = slug;
            page.view = view;
            page.footermenu = footermenu;
            page.mainmenu = mainmenu;
            page.topmenu = topmenu;
            page.none = none;

            if(files.photo) {
                page.photo = files.photo.newFilename;
            }

            page.save((err, result) => {
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



exports.remove = (req, res) => {
    const slug = req.params.slug.toLowerCase();
    Page.findOneAndRemove({ slug }).exec((err, data) => {
        if (err) {
            return res.json({
                error: errorHandler(err)
            });
        }
        res.json({
            message: 'Page deleted successfully'
        });
    });
};

