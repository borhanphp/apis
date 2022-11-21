const express = require('express');
const router = express.Router();
const { saveComment, updateComment, getComment, create, getComments, deleteComment, list } = require('../controllers/comments');



router.post('/create-comment', create);
router.get('/get-comment', getComment);
router.post('/save-comment', saveComment);
router.post('/update-comment', updateComment);

router.get('/allcomments', getComments);
router.post('/comment-delete', deleteComment);

router.get('/comments', list);

module.exports = router;