
const Comment = require('../models/comment');
const { errorHandler } = require('../helpers/dbErrorHandler');



exports.create = (req, res) => {

  const { name, comment, approved, postId } = req.body;

  let com = new Comment({ name, comment, approved, postId  });
  com.save((err, data) => {
      if (err) {
          return res.status(400).json({
              error: errorHandler(err)
          });
      }
    res.json(data);
  });
};


exports.list = (req, res) => {
  Comment.find({})
      .sort({ createdAt: -1 })
      .populate('postId', '_id title slug')
      .select('_id comment postId name approved updatedAt createdAt')
      .exec((err, data) => {
          if (err) {
              return res.json({
                  error: errorHandler(err)
              });
          }
          res.json(data);
      });
};



exports.getComment = async (req, res) => {
    const comment = await Comment.find({});
    res.send(comment);
}

  exports.saveComment = (req, res) => {
    const { name, comment, approved, postid } = req.body;

    Comment
        .create({ name, comment, approved, postid })
        .then(() => res.set(201).send("Added Successfully..."))
        .catch((err) => console.log(err));
    }

  exports.updateComment = (req, res) => {
    const { _id, name, description, approved } = req.body;

    Comment
        .findByIdAndUpdate(_id, { name, description, approved })
        .then(() => res.set(201).send("Updated Successfully..."))
        .catch((err) => console.log(err));
}

exports.deleteComment = (req, res) => {
    const { _id } = req.body;

    Comment
        .findByIdAndDelete(_id)
        .then(() => res.set(201).send("Deleted Successfully..."))
        .catch((err) => console.log(err));
}

exports.getComments = async (req, res) => {
    

  const limit = req.query.limit ? parseInt(req.query.limit) : 0;
  const page = req.query.page ? parseInt(req.query.page) : 0;
  const count = await Comment.countDocuments();



  Comment.find({})
              .limit(limit)
              .skip(limit * page)
              .sort({createdAt: -1})
              .populate('postId', '_id title slug')
              .select('_id comment postId name approved')
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