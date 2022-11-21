const express = require('express');
const router = express.Router();
const { create, list, read, remove, allCat, saveCategory, updateCategory, getCategory } = require('../controllers/ecategory');

// validators
const { runValidation } = require('../validators');
const { categoryCreateValidator } = require('../validators/category');
const { requireSignin, adminMiddleware } = require('../controllers/auth');

router.post('/ecategory', categoryCreateValidator, runValidation, requireSignin, adminMiddleware, create);
router.get('/ecategories', list);
router.get('/eallcat', allCat);
router.get('/ecategory/:slug', read);
router.delete('/ecategory/:slug', requireSignin, adminMiddleware, remove);

router.get('/get-ecat', getCategory);
router.post('/save-ecat', saveCategory);
router.post('/update-ecat', updateCategory);

module.exports = router;