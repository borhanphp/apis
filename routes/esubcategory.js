const express = require('express');
const router = express.Router();
const { create, list, read, remove, allCat, saveCategory, updateCategory, getCategory} = require('../controllers/esubcategory');

// validators
const { runValidation } = require('../validators');
const { categoryCreateValidator } = require('../validators/category');
const { requireSignin, adminMiddleware } = require('../controllers/auth');

router.post('/esubcategory', create);
router.get('/esubcategories', list);
router.get('/esubcat', allCat);
router.get('/esubcategory/:slug', read);
router.delete('/esubcategory/:slug', requireSignin, adminMiddleware, remove);

router.get('/get-escat', getCategory);
router.post('/save-escat', saveCategory);
router.post('/update-escat', updateCategory);


module.exports = router;