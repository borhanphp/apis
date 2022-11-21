const About = require('../models/aboutus');
const Contact = require('../models/contact');
const Advertise = require('../models/advertisement');
const Editor = require('../models/editor');
const formidable = require('formidable');
// const stripHtml = import('string-strip-html')
const _ = require('lodash');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.createAbout = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {

        const { title, body, email } = fields;

        let about = new About(); 
        about.title = title;
        about.body = body;
        about.email = email;

        about.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }

            res.json(result);
        });
    });
};

exports.getAbout =  async (req, res)=>{
    const data = await About.find().sort({createdAt: -1}).limit(1);
    res.json(data);
};



exports.createContact = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {

        const { title, body, email } = fields;

        let contact = new Contact(); 
        contact.title = title;
        contact.body = body;
        contact.email = email;

        contact.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.json(result);
        });
    });
};

exports.getContact =  async (req, res)=>{
    const data = await Contact.find().sort({createdAt: -1}).limit(1);
    res.json(data);
};


exports.createAdvertise = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {

        const { title, body, email } = fields;

        let advertise = new Advertise(); 
        advertise.title = title;
        advertise.body = body;
        advertise.email = email;

        advertise.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            } 
            res.json(result);
        });
    });
};

exports.getAds =  async (req, res)=>{
    const data = await Advertise.find().sort({createdAt: -1}).limit(1);
    res.json(data);
};



exports.createEditor = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {

        const { title, name, body, email } = fields;

        let editor = new Editor(); 
        editor.name = name;
        editor.title = title;
        editor.body = body;
        editor.email = email;

        editor.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }

            res.json(result);
        });
    });
};

exports.getEditor =  async (req, res)=>{
    const data = await Editor.find().sort({createdAt: -1}).limit(1);
    res.json(data);
};



