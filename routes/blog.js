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
    listSearch2,
    listByUser,
    lists,
    all,
    latest,
    onlycat,
    onlysub,
    images,
    scroll,
    sidenews,
    allPosts,
    getPosts,
    pageTest,
    imagePaginate,
    listSearchDashboard
} = require('../controllers/blog');

const { requireSignin, adminMiddleware, authMiddleware, canUpdateDeleteBlog } = require('../controllers/auth');
const blog = require('../models/blog');

router.post('/blog', requireSignin, adminMiddleware, create);
router.get('/blogs', list);
router.get('/posts', lists);
router.get('/images', images);
router.get('/latest', latest);
router.post('/blogs-categories-tags', listAllBlogsCategoriesTags);
router.get('/blog/:slug', read);
router.delete('/blog/:slug', requireSignin, adminMiddleware, remove);
router.put('/blog/:slug', requireSignin, adminMiddleware, update);
router.get('/blog/photo/:slug', photo);
router.post('/blogs/related', listRelated);
router.get('/blogs/search', listSearch);
router.get('/blogs/searching', listSearch2);
router.get('/blogs/searchdashboard', listSearchDashboard);
router.get('/news', all);
router.get('/onlycat', onlycat);
router.get('/onlysub', onlysub);
router.get('/scroll', scroll);
router.get('/sidenews', sidenews);
router.get('/allposts', allPosts);
router.get('/getposts', getPosts);
router.get('/pagetest', pageTest);
router.get('/imagepaginate', imagePaginate);



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


router.get('/test', async (req, res) => {
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
            posts = await blog.find({categories})
            .populate('categories', '_id name slug')
            .sort(obj)
            .limit(limit)
            .skip(skip);
        }else{
            posts = await blog.find();
        }

        res.status(200).json(posts);
    }catch (err){
        res.status(400).json(err);
    };
});

router.get('/last', async (req, res) => {
    let limit = parseInt(req.query.limit);
    let skip = parseInt(req.query.skip);
    var sort = req.query.sort;
    var name = req.query.name;
    var obj = {}
    obj[name] = sort
    
    try{
        let posts;
        if(categories){
            posts = await blog.find({})
            .populate('categories', '_id name slug')
            .sort(obj)
            .limit(limit)
            .skip(skip);
        }else{
            posts = await blog.find();
        }

        res.status(200).json(posts);
    }catch (err){
        res.status(400).json(err);
    };
});





module.exports = router;
