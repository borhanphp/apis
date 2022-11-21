const multer = require('multer');
const adsModel = require('../models/adsModel');
const topLogoModel = require('../models/topLogoModel');
const topRightModel = require('../models/topRightModel');
const homeRightAdsModel = require('../models/homeRightAdsModel');
const homeMiddleLongAdsModel = require('../models/homeMiddleLongAdsModel');
const homeMiddleFirstAdsModel = require('../models/homeMiddleFirstAdsModel');
const homeMiddleSecAdsModel = require('../models/homeMiddleSecAdsModel');
const belowPostAdsModel = require('../models/belowPostAdsModel');
const footerLogoModel = require('../models/footerLogo');
const footerAddressModel = require('../models/footerAddressModel');
const socialLinkModel = require('../models/socialLinkModel')
const footerEmail = require('../models/footerEmail')
const fs = require('fs');

// image upload logic


const Storage = multer.diskStorage({
    destination:'uploads',
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname);
    },
});

const upload = multer({
    storage:Storage
}).single('ads');


exports.adsImg = (req, res) => {
    upload(req, res , (err)=>{
        if(err){
            console.log(err);
        }else{
            const newImage = new adsModel({
                name: req.body.name,
                image:{
                    data:req.file.filename,
                    contentType:'image/png'
                }
            })
            newImage.save()
            .then(()=>res.send("Successfully uploaded"))
            .catch(err => console.log());
        }
    })
}



// top main logo controller


const topLogo = multer({
    storage:Storage
}).single('logo');


exports.logoImg = (req, res) => {
    topLogo(req, res , (err)=>{
        if(err){
            console.log(err);
        }else{
            const newImage = new topLogoModel({
                name: req.body.name,
                image:{
                    data: fs.readFileSync("uploads/" + req.file.filename),
                    contentType:'image/png'
                }
            })
            newImage.save()
            .then(()=>res.send("Successfully uploaded"))
            .catch(err => console.log());
        }
    })
};


exports.getLogo =  async (req, res)=>{
    const logo = await topLogoModel.find().sort({createdAt: -1}).limit(1);
    res.json(logo);
};


// top right ads banner


const topRightBanner = multer({
    storage:Storage
}).single('ads');


exports.topRightImg = (req, res) => {
    topRightBanner(req, res , (err)=>{
        if(err){
            console.log(err);
        }else{
            const newImage = new topRightModel({
                name: req.body.name,
                url: req.body.url,
                image:{
                    data: fs.readFileSync("uploads/" + req.file.filename),
                    contentType:'image/png'
                }
            })
            newImage.save()
            .then(()=>res.send("Successfully uploaded"))
            .catch(err => console.log());
        }
    })
};

exports.getTopAds =  async (req, res)=>{
    const data = await topRightModel.find().sort({createdAt: -1}).limit(1);
    res.json(data);
};


// home page middle right ads banner


const homeRightBanner = multer({
    storage:Storage
}).single('ads');


exports.homeRightImg = (req, res) => {
    homeRightBanner(req, res , (err)=>{
        if(err){
            console.log(err);
        }else{
            const newImage = new homeRightAdsModel({
                name: req.body.name,
                url: req.body.url,
                image:{
                    data: fs.readFileSync("uploads/" + req.file.filename),
                    contentType:'image/png'
                }
            })
            newImage.save()
            .then(()=>res.send("Successfully uploaded"))
            .catch(err => console.log());
        }
    })
};

exports.gethomeRightImg =  async (req, res)=>{
    const data = await homeRightAdsModel.find().sort({createdAt: -1}).limit(1);
    res.json(data);
};




// home page middle long ads banner


const homeMiddleLongBanner = multer({
    storage:Storage
}).single('ads');


exports.homeMiddleLongImg = (req, res) => {
    homeMiddleLongBanner(req, res , (err)=>{
        if(err){
            console.log(err);
        }else{
            const newImage = new homeMiddleLongAdsModel({
                name: req.body.name,
                url: req.body.url,
                image:{
                    data: fs.readFileSync("uploads/" + req.file.filename),
                    contentType:'image/png'
                }
            })
            newImage.save()
            .then(()=>res.send("Successfully uploaded"))
            .catch(err => console.log());
        }
    })
};

exports.gethomeMiddleLongImg =  async (req, res)=>{
    const data = await homeMiddleLongAdsModel.find().sort({createdAt: -1}).limit(1);
    res.json(data);
};



// home page middle below first ads banner


const homeFirstBanner = multer({
    storage:Storage
}).single('ads');


exports.homeMiddleFirstImg = (req, res) => {
    homeFirstBanner(req, res , (err)=>{
        if(err){
            console.log(err);
        }else{
            const newImage = new homeMiddleFirstAdsModel({
                name: req.body.name,
                url: req.body.url,
                image:{
                    data: fs.readFileSync("uploads/" + req.file.filename),
                    contentType:'image/png'
                }
            })
            newImage.save()
            .then(()=>res.send("Successfully uploaded"))
            .catch(err => console.log());
        }
    })
};

exports.gethomeMiddleFirstImg =  async (req, res)=>{
    const data = await homeMiddleFirstAdsModel.find().sort({createdAt: -1}).limit(1);
    res.json(data);
};



// home page middle below second ads banner


const homeSecBanner = multer({
    storage:Storage
}).single('ads');


exports.homeMiddleSecImg = (req, res) => {
    homeSecBanner(req, res , (err)=>{
        if(err){
            console.log(err);
        }else{
            const newImage = new homeMiddleSecAdsModel({
                name: req.body.name,
                url: req.body.url,
                image:{
                    data: fs.readFileSync("uploads/" + req.file.filename),
                    contentType:'image/png'
                }
            })
            newImage.save()
            .then(()=>res.send("Successfully uploaded"))
            .catch(err => console.log());
        }
    })
};

exports.gethomeMiddleSecImg =  async (req, res)=>{
    const data = await homeMiddleSecAdsModel.find().sort({createdAt: -1}).limit(1);
    res.json(data);
};





// below post ads banner


const belowPostBanner = multer({
    storage:Storage
}).single('ads');


exports.belowPostImg = (req, res) => {
    belowPostBanner(req, res , (err)=>{
        if(err){
            console.log(err);
        }else{
            const newImage = new belowPostAdsModel({
                name: req.body.name,
                url: req.body.url,
                image:{
                    data: fs.readFileSync("uploads/" + req.file.filename),
                    contentType:'image/png'
                }
            })
            newImage.save()
            .then(()=>res.send("Successfully uploaded"))
            .catch(err => console.log());
        }
    })
};

exports.getbelowPostImg =  async (req, res)=>{
    const data = await belowPostAdsModel.find().sort({createdAt: -1}).limit(1);
    res.json(data);
};


// footer logo


const footerLogo = multer({
    storage:Storage
}).single('ads');


exports.footerLogo = (req, res) => {
    footerLogo(req, res , (err)=>{
        if(err){
            console.log(err);
        }else{
            const newImage = new footerLogoModel({
                image:{
                    data: fs.readFileSync( "uploads/" + req.file.filename),
                    contentType:'image/png'
                }
            })
            newImage.save()
            .then(()=>res.send("Successfully uploaded"))
            .catch(err => console.log());
        }
    })
};



exports.getFooterLogo =  async (req, res)=>{
    const data = await footerLogoModel.find().sort({createdAt: -1}).limit(1);
    res.json(data);
};


// footer address


const footerAdd = multer({
    storage:Storage
}).single('ads');


exports.footerAdd = (req, res) => {
    footerAdd(req, res , (err)=>{
        if(err){
            console.log(err);
        }else{
            const newImage = new footerAddressModel({
                name: req.body.name
            })
            newImage.save()
            .then(()=>res.send("Successfully Added"))
            .catch(err => console.log());
        }
    })
};

exports.getFooterAdd =  async (req, res)=>{
    const data = await footerAddressModel.find().sort({createdAt: -1}).limit(1);
    res.json(data);
};


// footer address
exports.saveAddress = (req, res) => {
    const { address } = req.body;

    footerAddressModel
    .create({ address })
        .then(() => res.set(201).send("Added Successfully..."))
        .catch((err) => console.log(err));
    }

exports.getAddress = async (req, res) => {
    const address = await footerAddressModel.find({}).sort({createdAt: -1}).limit(1);
    res.send(address);
}

// footer email
exports.saveFootEmail = (req, res) => {
    const { email } = req.body;

    footerEmail
    .create({ email })
        .then(() => res.set(201).send("Added Successfully..."))
        .catch((err) => console.log(err));
    }

exports.getFootEmail = async (req, res) => {
    const email = await footerEmail.find({}).sort({createdAt: -1}).limit(1);
    res.send(email);
}



// Social link


const socialLink = multer({
    storage:Storage
}).single('ads');


exports.socialLink = (req, res) => {
    socialLink(req, res , (err)=>{
        if(err){
            console.log(err);
        }else{
            const newImage = new socialLinkModel({
                facebook: req.body.facebook,
                twitter: req.body.twitter,
                instagram: req.body.instagram,
                youtube: req.body.youtube,
                linkedin: req.body.linkedin
            })
            newImage.save()
            .then(()=>res.send("Successfully Added"))
            .catch(err => console.log());
        }
    })
};

exports.getSocial =  async (req, res)=>{
    const data = await socialLinkModel.find().sort({createdAt: -1}).limit(1);
    res.json(data);
};



