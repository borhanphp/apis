const Poll = require('../models/poll');
const multer = require('multer');
const formidable = require('formidable');
const { errorHandler } = require('../helpers/dbErrorHandler');
const _ = require('lodash');

exports.create = (req, res) => {
    const directory =  "./public/images";
        let form = new formidable.IncomingForm({
            uploadDir: directory,
            keepExtensions: true
        
    });
  form.keepExtensions = true;
  form.multiples = true;
  form.parse(req, (err, fields, files) => {

      const { title, body, show, view, slug } = fields;

      let page = new Poll();
      page.title = title;
      page.body = body;
      page.view = view;
      page.slug = title + Date.now();
      page.show = show;
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


exports.readAll = (req, res) => {
    Poll.find({})
        .sort({ createdAt: -1 })
        .skip(0)
        .limit(100)
        .select('_id title body slug yes no nocomments photo show view createdAt updatedAt')
        .exec((err, data) => {
            if (err) {
                return res.json({
                    error: errorHandler(err)
                });
            }
            res.json(data);
        });
};



exports.readBangla = (req, res) => {
    Poll.find({status: 'published', view: 'bangla'})
        .sort({ createdAt: -1 })
        .skip(0)
        .limit(2)
        .select('_id body yes no nocomments photo')
        .exec((err, data) => {
            if (err) {
                return res.json({
                    error: errorHandler(err)
                });
            }
            res.json(data);
        });
};

exports.readEnglish = (req, res) => {
    Poll.find({status: 'published', view: 'english'})
        .sort({ createdAt: -1 })
        .skip(0)
        .limit(3)
        .select('_id body yes no nocomments photo')
        .exec((err, data) => {
            if (err) {
                return res.json({
                    error: errorHandler(err)
                });
            }
            res.json(data);
        });
};


exports.updateYesPoll = (req, res) => {
    const { _id, yes} = req.body;


    Poll
        .findByIdAndUpdate(_id, { $inc: { yes: 1 }})
        .then(() => res.set(201).send("Updated Successfully..."))
        .catch((err) => console.log(err));
}

exports.updateNoPoll = (req, res) => {
    const { _id, no} = req.body;


    Poll
        .findByIdAndUpdate(_id, { $inc: { no: 1 }})
        .then(() => res.set(201).send("Updated Successfully..."))
        .catch((err) => console.log(err));
}

exports.updateNoComPoll = (req, res) => {
    const { _id, nocomments} = req.body;


    Poll
        .findByIdAndUpdate(_id, { $inc: { nocomments: 1 }})
        .then(() => res.set(201).send("Updated Successfully..."))
        .catch((err) => console.log(err));
}


// for decresing one value from the field value
exports.minusYesPoll = (req, res) => {
    const { _id, yes} = req.body;


    Poll
        .findByIdAndUpdate(_id, { $inc: { yes: -1 }})
        .then(() => res.set(201).send("Updated Successfully..."))
        .catch((err) => console.log(err));
}

exports.minusNoPoll = (req, res) => {
    const { _id, no} = req.body;


    Poll
        .findByIdAndUpdate(_id, { $inc: { no: -1 }})
        .then(() => res.set(201).send("Updated Successfully..."))
        .catch((err) => console.log(err));
}

exports.minusNoComPoll = (req, res) => {
    const { _id, nocomments} = req.body;


    Poll
        .findByIdAndUpdate(_id, { $inc: { nocomments: -1 }})
        .then(() => res.set(201).send("Updated Successfully..."))
        .catch((err) => console.log(err));
}

exports.updatePoll = (req, res) => {
    const { _id, title, body, show, view, photo } = req.body;
    console.log(photo)

    Poll
        .findByIdAndUpdate(_id, { title, body, show, view, $push:{ photo: photo} }, {new: true})
        .then(() => res.set(201).send("Updated Successfully..."))
        .catch((err) => console.log(err));
}




exports.deletePoll = (req, res) => {
    const { _id } = req.body;

    Poll
        .findByIdAndDelete(_id)
        .then(() => res.set(201).send("Deleted Successfully..."))
        .catch((err) => console.log(err));
}




exports.update = (req, res) => {
    const _id = req.params.query;

    Poll.findOne({ _id }).exec((err, oldBlog) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }

        let form = new formidable.IncomingForm();
        form.keepExtensions = true;

        form.parse(req, (err, fields, files) => {
         
            let slugBeforeMerge = oldBlog._id;
            oldBlog = _.merge(oldBlog, fields);
            oldBlog._id = slugBeforeMerge;

            if (files.photo) {
                oldBlog.photo = "/images/" + files.photo.newFilename;
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



const Storage = multer.diskStorage({
    destination:'./public/images',
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname);
    },
});

const poll = multer({
    storage:Storage
}).single('photo');


exports.pollCreate = (req, res) => {
    poll(req, res , (err)=>{
        if(err){
            console.log(err);
        }else{
            const newPoll = new Poll({
                
                body: req.body.body,
                show: req.body.show,
                view: req.body.view,
                photo: req.file.filename,
            })
            newPoll.save()
            .then(()=>res.send("Successfully created"))
            .catch(err => console.log());
        }
    })
}

exports.pollUpdate = (req, res) => {
    const id = req.params.id;
    poll(req, res , (err)=>{
        if(err){
            console.log(err);
        }else{
           if(req.file){
            Poll.findByIdAndUpdate( id, {
                
                body: req.body.body,
                show: req.body.show,
                view: req.body.view,
                photo: req.file.filename,
            })
            .then(()=>res.send("Successfully Updated"))
            .catch(err => console.log());
           }else{
            Poll.findByIdAndUpdate( id, {
               
                body: req.body.body,
                show: req.body.show,
                view: req.body.view,
            })
            .then(()=>res.send("Successfully Updated"))
            .catch(err => console.log());
           }
            
        }
    })
}



