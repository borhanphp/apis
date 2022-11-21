const User = require('../models/User');
const multer = require('multer');
const Blog = require('../models/blog');
const _ = require('lodash');
const formidable = require('formidable');
const fs = require('fs');
const { errorHandler } = require('../helpers/dbErrorHandler');



exports.read = (req, res) => {
    req.profile.hashed_password = undefined;
    return res.json(req.profile);
};

exports.publicProfile = (req, res) => {
    let username = req.params.username;
    let user;
    let blogs;

    User.findOne({ username }).exec((err, userFromDB) => {
        if (err || !userFromDB) {
            return res.status(400).json({
                error: 'User not found'
            });
        }
        user = userFromDB;
        let userId = user._id;
        Blog.find({ postedBy: userId })
            .populate('categories', '_id name slug')
            .populate('tags', '_id name slug')
            .populate('postedBy', '_id name')
            .limit(10)
            .select('_id title slug excerpt categories tags postedBy createdAt updatedAt')
            .exec((err, data) => {
                if (err) {
                    return res.status(400).json({
                        error: errorHandler(err)
                    });
                }
                user.photo = undefined;
                user.hashed_password = undefined;
                res.json({
                    user,
                    blogs: data
                });
            });
    });
};

exports.update = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtension = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'Photo could not be uploaded'
            });
        }
        let user = req.profile;
        user = _.extend(user, fields);

        if (fields.password && fields.password.length < 6) {
            return res.status(400).json({
                error: 'Password should be min 6 characters long'
            });
        }

        if (files.photo) {
            if (files.photo.size > 10000000) {
                return res.status(400).json({
                    error: 'Image should be less than 1mb'
                });
            }
            user.photo.data = fs.readFileSync(files.photo.filepath);
            user.photo.contentType = files.photo.type;
        }

        user.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            user.hashed_password = undefined;
            user.salt = undefined;
            user.photo = undefined;
            res.json(user);
        });
    });
};


exports.create = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtension = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'Photo could not be uploaded'
            });
        }
        
        const { name, email, about, password, username, role } = fields;
        let profile = `${process.env.CLIENT_URL}/profile/${username}`;


        let user = new User();
        user.name = name;
        user.email = email;
        user.about = about;
        user.password = password;
        user.profile = profile;
        user.username = username;
        user.role = role;

        if (files.photo) {
            if (files.photo.size > 10000000) {
                return res.status(400).json({
                    error: 'Image should be less than 1mb'
                });
            }
            user.photo.data = fs.readFileSync(files.photo.filepath);
            user.photo.contentType = files.photo.type;
        }

        user.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
           
            res.json(result);
        });
    });
};

exports.photo = (req, res) => {
    const username = req.params.username;
    User.findOne({ username }).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User not found'
            });
        }
        if (user.photo.data) {
            res.set('Content-Type', user.photo.contentType);
            return res.send(user.photo.data);
        }
    });
};

exports.users = (req, res) => {
    User.find({}).exec((err, users) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json(users);
    });
}



// exports.getUser = async (req, res) => {
//     const users = await User.find({});
//     res.send(users);
// }

exports.getUser = (req, res) => {
    User.find({})
        .sort({ createdAt: -1 })
        .skip(0)
        .limit(100)
        .select('_id name username email about photo role createdAt updatedAt')
        .exec((err, data) => {
            if (err) {
                return res.json({
                    error: errorHandler(err)
                });
            }
            res.json(data);
        });
};

  exports.saveUser = (req, res) => {
    const { name, username, email, about, role, password } = req.body;

    User
    .create({ name, username, email, about, role, password })
        .then(() => res.set(201).send("Added Successfully..."))
        .catch((err) => console.log(err));
    }

  exports.updateUser = (req, res) => {
    const { _id, name, username, email, about, role, password } = req.body;

    User
        .findByIdAndUpdate(_id, { name, username, email, about, role, password })
        .then(() => res.set(201).send("Updated Successfully..."))
        .catch((err) => console.log(err));
}

exports.deleteUser = (req, res) => {
    const { _id } = req.body;

    User
        .findByIdAndDelete(_id)
        .then(() => res.set(201).send("Deleted Successfully..."))
        .catch((err) => console.log(err));
}


const Storage = multer.diskStorage({
    destination:'/public/images',
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname);
    },
});

const user = multer({
    storage:Storage
}).single('photo');


exports.userCreate = (req, res) => {
    user(req, res , (err)=>{
        if(err){
            console.log(err);
        }else{
            
            if(req.file){
            const newUser = new User({
                name: req.body.name,
                username: req.body.username,
                email: req.body.email,
                about: req.body.about,
                role: req.body.role,
                password: req.body.password,
                photo: req.file.filename,
            })

            newUser.save()
            .then(()=>res.send("Successfully created"))
            .catch(err => console.log());
        }else{
            const newUser = new User({
                name: req.body.name,
                username: req.body.username,
                email: req.body.email,
                about: req.body.about,
                role: req.body.role,
                password: req.body.password
            })

            newUser.save()
            .then(()=>res.send("Successfully created"))
            .catch(err => console.log());
        }
            
        }
    })
}

exports.userUpdate = (req, res) => {
    const id = req.params.id;
    user(req, res , (err)=>{
        if(err){
            console.log(err);
        }else{
           if(req.file){
            User.findByIdAndUpdate( id, {
                name: req.body.name,
                username: req.body.username,
                email: req.body.email,
                about: req.body.about,
                role: req.body.role,
                password: req.body.password,
                photo: req.file.filename,
            })
            .then(()=>res.send("Successfully Updated"))
            .catch(err => console.log());
           }else{
            User.findByIdAndUpdate( id, {
                name: req.body.name,
                username: req.body.username,
                email: req.body.email,
                about: req.body.about,
                role: req.body.role,
                password: req.body.password
            })
            .then(()=>res.send("Successfully Updated"))
            .catch(err => console.log());
           }
            
        }
    })
}



