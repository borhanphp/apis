const express = require('express');
const router = express.Router();

// controllers
const { requireSignin, adminMiddleware } = require('../controllers/auth');
const { create, list, read, remove } = require('../controllers/etag');

// validators
const { runValidation } = require('../validators');
const { createTagValidator } = require('../validators/tag');

// only difference is methods not name 'get' | 'post' | 'delete'
router.post('/etag', create);
router.get('/etags', list);
router.get('/etag/:slug', read);
router.delete('/etag/:slug', requireSignin, adminMiddleware, remove);

module.exports = router;
