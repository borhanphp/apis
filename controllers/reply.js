
const Reply = require('../models/reply');
const { errorHandler } = require('../helpers/dbErrorHandler');



exports.create = (req, res) => {

  const { name, reply, commentId } = req.body;

  let com = new Reply({ name, reply, commentId  });
  com.save((err, data) => {
      if (err) {
          return res.status(400).json({
              error: errorHandler(err)
          });
      }
    res.json(data);
  });
};



exports.getReply = async (req, res) => {
    const comment = await Reply.find({});
    res.send(comment);
}

  exports.saveReply = (req, res) => {
    const { name, comment, approved, postid } = req.body;

    Reply
        .create({ name, comment, approved, postid })
        .then(() => res.set(201).send("Added Successfully..."))
        .catch((err) => console.log(err));
    }

  exports.updateReply = (req, res) => {
    const { _id, name, description, approved } = req.body;

    Reply
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