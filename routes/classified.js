const express = require('express');
const router = express.Router();

const { requireSignin, adminMiddleware, authMiddleware, canUpdateDeleteBlog } = require('../controllers/auth');
const {
    createAbout, 
    createAdvertise,
    createContact,
    createEditor,
    getAbout,
    getAds,
    getEditor,
    getContact
   
} = require('../controllers/page');

const {createClassified, getClassified, read, getMetrimony, getFlat, getSecurity, allclassified, getClassifiedEng, remove, update} = require('../controllers/classified');




router.post('/add-about', requireSignin, adminMiddleware, createAbout);
router.post('/add-contact', requireSignin, adminMiddleware, createContact);
router.post('/add-editor', createEditor);
router.post('/add-ads', requireSignin, adminMiddleware, createAdvertise);



router.get('/get-about', getAbout);
router.get('/get-ads', getAds);
router.get('/get-editor', getEditor);
router.get('/get-contact', getContact);

router.post('/add-classified', requireSignin, adminMiddleware, createClassified);
router.get('/get-classified', getClassified);
router.get('/get-classifiedeng', getClassifiedEng);
router.get('/allclassified', allclassified);
router.get('/get-matrimony', getMetrimony);
router.get('/get-flat', getFlat);
router.get('/get-security', getSecurity);
router.get('/classified/:slug', read);
router.delete('/classified/:slug', remove);
router.put('/classified/:slug', update);





module.exports = router;