const express = require('express');
const router = express.Router();
const {
    create,
    list,
    listAllBlogsCategoriesTags,
    read,
    remove,
    update,
    photo,
    listRelated,
    listSearch,
    listByUser,
    lists,
    all,
    eonlycat,
    latest,
    escroll,
    scroll,
    eBlogPaginate
} = require('../controllers/eblog');

const { requireSignin, adminMiddleware, authMiddleware, canUpdateDeleteBlog } = require('../controllers/auth');
const eblog = require('../models/eblog');

router.post('/eblog', requireSignin, adminMiddleware, create);
router.get('/eblogs', list);
router.get('/eposts', lists);
router.get('/escroll', scroll);
router.get('/elatest', latest);
router.post('/eblogs-categories-tags', listAllBlogsCategoriesTags);
router.get('/eblog/:slug', read);
router.delete('/eblog/:slug', requireSignin, adminMiddleware, remove);
router.put('/eblog/:slug', requireSignin, adminMiddleware, update);
router.get('/eblog/photo/:slug', photo);
router.post('/eblogs/related', listRelated);
router.get('/eblogs/search', listSearch);
router.get('/enews', all);
router.get('/eonlycat', eonlycat);
router.get('/eblogpaginate', eBlogPaginate);


// auth user blog crud
// router.post('/user/blog', requireSignin, authMiddleware, create);
// router.get('/:username/blogs', listByUser);
// router.delete('/user/blog/:slug', requireSignin, authMiddleware, canUpdateDeleteBlog, remove);
// router.put('/user/blog/:slug', requireSignin, authMiddleware, canUpdateDeleteBlog, update);


// router.get('/posts', async (req, res) => {
//     const categories = req.query.cat;
    
//     try{
//         let posts;
//         if(categories){
//             posts = await blog.find({categories});
//         }else{
//             posts = await blog.find();
//         }

//         res.status(200).json(posts);
//     }catch (err){
//         res.status(400).json(err);
//     };
// });


router.get('/etest', async (req, res) => {
    const categories = req.query.cat;
    let limit = parseInt(req.query.limit);
    let skip = parseInt(req.query.skip);
    var sort = req.query.sort;
    var name = req.query.name;
    var obj = {}
    obj[name] = sort
    
    try{
        let posts;
        if(categories){
            posts = await eblog.find({categories})
            .populate('categories', '_id name slug')
            .sort(obj)
            .limit(limit)
            .skip(skip);
        }else{
            posts = await eblog.find();
        }

        res.status(200).json(posts);
    }catch (err){
        res.status(400).json(err);
    };
});

router.get('/elast', async (req, res) => {
    let limit = parseInt(req.query.limit);
    let skip = parseInt(req.query.skip);
    var sort = req.query.sort;
    var name = req.query.name;
    var obj = {}
    obj[name] = sort
    
    try{
        let posts;
        if(categories){
            posts = await eblog.find({})
            .populate('categories', '_id name slug')
            .sort(obj)
            .limit(limit)
            .skip(skip);
        }else{
            posts = await eblog.find();
        }

        res.status(200).json(posts);
    }catch (err){
        res.status(400).json(err);
    };
});





module.exports = router;
