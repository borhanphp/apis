const express = require('express');
const router = express.Router();
const { saveReply, updateReply, getReply, create } = require('../controllers/reply');



router.post('/create-reply', create);
router.get('/get-reply', getReply);
router.post('/save-reply', saveReply);
router.post('/update-reply', updateReply);

module.exports = router;