const express = require('express');
const router = express.Router();
const { create, list, read, remove, allCat, saveCategory, updateCategory, getCategory, allSubCat } = require('../controllers/subcategory');

// validators
const { runValidation } = require('../validators');
const { categoryCreateValidator } = require('../validators/category');
const { requireSignin, adminMiddleware } = require('../controllers/auth');

router.post('/subcategory', create);
router.get('/subcategories', list);
router.get('/allsubcat', allSubCat);
router.get('/subcat', allCat);
router.get('/subcategory/:slug', read);
router.delete('/subcategory/:slug', requireSignin, adminMiddleware, remove);

router.get('/get-scat', getCategory);
router.post('/save-scat', saveCategory);
router.post('/update-scat', updateCategory);

module.exports = router;