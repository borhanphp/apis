const express = require('express');
const router = express.Router();
const { create, list, read, remove, allCat, readall, allCat2, update, updateCat,
    saveCategory, updateCategory, getCategory
} = require('../controllers/category');

// validators
const { runValidation } = require('../validators');
const { categoryCreateValidator } = require('../validators/category');
const { requireSignin, adminMiddleware } = require('../controllers/auth');

router.post('/category', categoryCreateValidator, runValidation, requireSignin, adminMiddleware, create);
router.get('/categories', list);
router.get('/allcat', allCat);
router.get('/category/:slug', read);
// router.get('/update/:slug', update);
router.put('/update', updateCat);
router.get('/ucategory/:slug', readall);
router.get('/allcat2', allCat2);
router.delete('/category/:slug', requireSignin, adminMiddleware, remove);

router.get('/get-cat', getCategory);
router.post('/save-cat', saveCategory);
router.post('/update-cat', updateCategory);

module.exports = router;