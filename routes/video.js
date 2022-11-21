const express = require('express');
const router = express.Router();
const {
    create,
    list,
    listAllBlogsCategoriesTags,
    read,
    remove,
    update,
    listRelated,
    listSearch,
    lists,
    latest,
    images,
    readEng,
    listsEng,
    readUp,
} = require('../controllers/video');

const { requireSignin, adminMiddleware, authMiddleware, canUpdateDeleteBlog } = require('../controllers/auth');
const blog = require('../models/video');

router.post('/video', requireSignin, adminMiddleware, create);
router.get('/videos', list);
router.get('/allvideos', lists); // front bangla news api
router.get('/allvideoseng', listsEng); // front english news api
router.get('/images', images);
router.get('/latest', latest);
router.post('/blogs-categories-tags', listAllBlogsCategoriesTags);
router.get('/video/:slug', read);
router.get('/evideo/:slug', readEng);
router.get('/upvideo/:slug', readUp);
router.delete('/video/:slug', requireSignin, adminMiddleware, remove);
router.put('/video/:slug', update);
router.post('/blogs/related', listRelated);
router.get('/blogs/search', listSearch);






module.exports = router;
