const express = require('express');
const router = express.Router();

const { requireSignin, adminMiddleware, authMiddleware, canUpdateDeleteBlog } = require('../controllers/auth');
const {createPage, getPage, getFooterMenu, getMainMenu, getTopMenu, read, update, remove, getTopMenuEng, getFooterMenuEng} = require('../controllers/pagesController');




router.post('/add-page', requireSignin, adminMiddleware, createPage);
router.get('/get-page', getPage);
router.get('/topmenu', getTopMenu);
router.get('/mainmenu', getMainMenu);
router.get('/footermenu', getFooterMenu);
router.get('/footermenueng', getFooterMenuEng);
router.get('/site-pages/:slug', read);
router.put('/page/:slug', update);
router.delete('/page/:slug', remove);

router.get('/topmenu-eng', getTopMenuEng);


module.exports = router;