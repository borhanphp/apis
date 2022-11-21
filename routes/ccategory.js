const express = require('express');
const router = express.Router();
const { create, list, read, remove, allCat, readall, allCat2, update, updateCat,
    saveCategory, updateCategory, getCategory, subcat, allCatEng, readEng
} = require('../controllers/classifiedCategory');

// validators
const { runValidation } = require('../validators');
const { categoryCreateValidator } = require('../validators/category');
const { requireSignin, adminMiddleware } = require('../controllers/auth');

// router.post('/ccategory', categoryCreateValidator, runValidation, requireSignin, adminMiddleware, create);
router.get('/ccategories', list);
router.get('/callcat', allCat);
router.get('/callcateng', allCatEng);
router.get('/ccategory/:slug', read);
router.get('/eccategory/:slug', readEng);
// router.get('/csubcat/:slug', subcat);
// // router.get('/update/:slug', update);
// router.put('/cupdate', updateCat);
// router.get('/cucategory/:slug', readall);
// router.get('/callcat2', allCat2);
// router.delete('/ccategory/:slug', requireSignin, adminMiddleware, remove);

router.get('/cget-cat', getCategory);
router.post('/csave-cat', saveCategory);
router.post('/cupdate-cat', updateCategory);

module.exports = router;