const express = require('express');
const { create, 
    readBangla, 
    readEnglish, 
    updateYesPoll, 
    updateNoPoll, 
    updateNoComPoll, 
    readAll, 
    pollcreate, 
    pollread, 
    pollAdd, 
    getPoll,
    minusYesPoll,
    minusNoPoll,
    minusNoComPoll, 
    updatePoll,
    update,
    pollCreate,
    pollUpdate,
    deletePoll} = require('../controllers/pollController');
const router = express.Router();




router.post('/create-poll', create);
router.post('/yes-poll-update', updateYesPoll);
router.post('/no-poll-update', updateNoPoll);
router.post('/nocom-poll-update', updateNoComPoll);
router.get('/get-poll-bangla', readBangla);
router.get('/get-poll-english', readEnglish);
router.get('/all-polls', readAll);


router.post('/yes-poll-minus', minusYesPoll);
router.post('/no-poll-minus', minusNoPoll);
router.post('/nocom-poll-minus', minusNoComPoll);


router.post('/delete-poll', deletePoll);
router.post('/poll/update', updatePoll);
router.put('/poll-update/:_id', update);
router.post('/pollcreate', pollCreate);
router.put('/pollupdate/:id', pollUpdate);



module.exports = router;