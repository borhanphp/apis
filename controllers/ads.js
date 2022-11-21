const Ads = require('../models/ads');
const formidable = require('formidable');
const multer = require('multer');
// const stripHtml = import('string-strip-html')
const _ = require('lodash');
const { errorHandler } = require('../helpers/dbErrorHandler');
const fs = require('fs');

function slugifi(text) {
    return text.toLowerCase().replace(text, text).replace(/^-+|-+$/g, '')
        .replace(/\s/g, '-').replace(/\-\-+/g, '-');

}


exports.create = (req, res) => {
    const directory =  "./public/images";
        let form = new formidable.IncomingForm({
            uploadDir: directory,
            keepExtensions: true

    });
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'Image could not upload'
            });
        }

        const { title, link, alt, position, status, view} = fields;
       

        let ads = new Ads();
        ads.title = title;
        
        if(!alt || alt.length === 0){
            ads.alt = title;
        }else{
            ads.alt = alt;
        }
        
        ads.postedBy = req.user._id;
        ads.status = status;
        ads.link = link;
        ads.view = view;
        ads.position = position;
        ads.photo = files.photo.newFilename;

        ads.save((err, result) => {
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
    Ads.find({})
    .exec((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json(data);
    });
};

exports.adsPaginate = async (req, res) => {
    

    const limit = req.query.limit ? parseInt(req.query.limit) : 0;
    const page = req.query.page ? parseInt(req.query.page) : 0;
    const count = await Ads.countDocuments();



             Ads.find({})
                .limit(limit)
                .skip(limit * page)
                .sort({ createdAt: -1 })
                .select('_id title link position view photo alt createdAt updatedAt status')
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


  exports.topAds = async (req, res) => {
    Ads.find({status: "true", view: "bangla", position: "topbanner"})
    .limit(1)
    .sort({ createdAt: -1 })
    .select('_id link photo alt')
    .exec((err, data) => {
        if (err) {
            return res.json({
                error: errorHandler(err)
            });
        }
        res.json(data);
    });
}

exports.topAdsEng = async (req, res) => {
    Ads.find({status: "true", view: "english", position: "topbanner"})
    .limit(1)
    .sort({ createdAt: -1 })
    .select('_id link photo alt')
    .exec((err, data) => {
        if (err) {
            return res.json({
                error: errorHandler(err)
            });
        }
        res.json(data);
    });
}

exports.middleRightAds = async (req, res) => {
    Ads.find({status: "true", view: "bangla", position: "middleright"})
    .limit(1)
    .sort({ createdAt: -1 })
    .select('_id title link photo alt')
    .exec((err, data) => {
        if (err) {
            return res.json({
                error: errorHandler(err)
            });
        }
        res.json(data);
    });
}

exports.middleLongAds = async (req, res) => {
    Ads.find({status: "true", view: "bangla", position: "middlelong"})
    .limit(1)
    .sort({ createdAt: -1 })
    .select('_id title link photo alt')
    .exec((err, data) => {
        if (err) {
            return res.json({
                error: errorHandler(err)
            });
        }
        res.json(data);
    });
}

exports.middleRightsm = async (req, res) => {
    Ads.find({status: "true", view: "bangla", position: "middlerightsm"})
    .limit(1)
    .sort({ createdAt: -1 })
    .select('_id title link photo alt')
    .exec((err, data) => {
        if (err) {
            return res.json({
                error: errorHandler(err)
            });
        }
        res.json(data);
    });
}

exports.middleLeftsm = async (req, res) => {
    Ads.find({status: "true", view: "bangla", position: "middleleftsm"})
    .limit(1)
    .sort({ createdAt: -1 })
    .select('_id title link photo alt')
    .exec((err, data) => {
        if (err) {
            return res.json({
                error: errorHandler(err)
            });
        }
        res.json(data);
    });
}

exports.singlePostRight = async (req, res) => {
    Ads.find({status: "true", view: "bangla", position: "singlepostright"})
    .limit(1)
    .sort({ createdAt: -1 })
    .select('_id title link photo alt')
    .exec((err, data) => {
        if (err) {
            return res.json({
                error: errorHandler(err)
            });
        }
        res.json(data);
    });
}

exports.belowPost = async (req, res) => {
    Ads.find({status: "true", view: "bangla", position: "belowpost"})
        .limit(1)
        .sort({ createdAt: -1 })
        .select('_id title link photo alt')
        .exec((err, data) => {
            if (err) {
                return res.json({
                    error: errorHandler(err)
                });
            }
            res.json(data);
        });
}


exports.remove = (req, res) => {
    const slug = req.params.slug.toLowerCase();
    Ads.findOneAndRemove({ slug }).exec((err, data) => {
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

// exports.updateAds = (req, res) => {
//     const { _id, title, link, status, view, position, alt } = req.body;

//     Ads
//         .findByIdAndUpdate(_id, { title, link, status, view, position, alt })
//         .then(() => res.set(201).send("Updated Successfully..."))
//         .catch((err) => console.log(err));
// }

exports.deleteAds = (req, res) => {
    const { _id } = req.body;

    Ads
        .findByIdAndDelete(_id)
        .then(() => res.set(201).send("Deleted Successfully..."))
        .catch((err) => console.log(err));
}


const Storage = multer.diskStorage({
    destination:'./public/images',
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname);
    },
});

const ads = multer({
    storage:Storage
}).single('photo');

exports.updateAds = (req, res) => {
    const id = req.params.id;
    ads(req, res , (err)=>{
        if(err){
            console.log(err);
        }else{
           if(req.file){
            Ads.findByIdAndUpdate( id, {
                
                title: req.body.title,
                link: req.body.link,
                status: req.body.status,
                view: req.body.view,
                position: req.body.position,
                alt: req.body.alt,
                photo: req.file.filename
            })
            .then(()=>res.send("Successfully Updated"))
            .catch(err => console.log());
           }else{
            Ads.findByIdAndUpdate( id, {
               
                title: req.body.title,
                link: req.body.link,
                status: req.body.status,
                view: req.body.view,
                position: req.body.position,
                alt: req.body.alt
            })
            .then(()=>res.send("Successfully Updated"))
            .catch(err => console.log());
           }
            
        }
    })
}
