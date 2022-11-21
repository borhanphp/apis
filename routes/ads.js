const express = require('express');
const router = express.Router();
const { requireSignin, adminMiddleware, authMiddleware, canUpdateDeleteBlog } = require('../controllers/auth');
const {
    adsImg, 
    logoImg, 
    topRightImg, 
    homeRightImg, 
    homeMiddleLongImg, 
    homeMiddleFirstImg, 
    homeMiddleSecImg,
    belowPostImg,
    getLogo,
    getTopAds,
    gethomeRightImg,
    gethomeMiddleLongImg,
    gethomeMiddleFirstImg,
    gethomeMiddleSecImg,
    getbelowPostImg,
    footerLogo,
    getFooterLogo,
    footerAdd,
    getFooterAdd,
    socialLink,
    getSocial,
    getAddress,
    saveAddress,
    saveFootEmail,
    getFootEmail,
} = require('../controllers/adsController');

const {
    create,
    list,
    adsPaginate,
    topAds,
    topAdsEng,
    middleRightAds,
    middleLongAds,
    middleRightsm,
    middleLeftsm,
    singlePostRight,
    belowPost,
    remove,
    updateAds,
    deleteAds
} = require('../controllers/ads');


router.delete('/ads/:slug', requireSignin, adminMiddleware, remove);
router.post('/upload', requireSignin, adminMiddleware, adsImg);
router.post('/logo', requireSignin, adminMiddleware, logoImg);
router.post('/topbanner', requireSignin, adminMiddleware, topRightImg);
router.post('/home-right-img', requireSignin, adminMiddleware, homeRightImg);
router.post('/home-long-img', requireSignin, adminMiddleware, homeMiddleLongImg);
router.post('/home-first-img', requireSignin, adminMiddleware, homeMiddleFirstImg);
router.post('/home-sec-img', requireSignin, adminMiddleware, homeMiddleSecImg);
router.post('/below-post-ads', requireSignin, adminMiddleware, belowPostImg);
router.post('/footer-logo', requireSignin, adminMiddleware, footerLogo);
router.post('/footer-add', requireSignin, adminMiddleware, footerAdd);
router.post('/social-link', requireSignin, adminMiddleware, socialLink);

router.get('/getlogo', getLogo);
router.get('/get-top-ads', getTopAds);
router.get('/home-right-img', gethomeRightImg);
router.get('/home-long-img', gethomeMiddleLongImg);
router.get('/home-first-img', gethomeMiddleFirstImg);
router.get('/home-sec-img', gethomeMiddleSecImg);
router.get('/below-post-ads', getbelowPostImg);
router.get('/get-footer-logo', getFooterLogo);
router.get('/get-footer-add', getFooterAdd);
router.get('/get-social', getSocial);


router.post('/address/save', saveAddress);
router.get('/address/get', getAddress);


router.post('/footer-email/save', saveFootEmail);
router.get('/footer-email/get', getFootEmail);



router.post('/create-ads', requireSignin, adminMiddleware, create);
router.get('/all-ads', list);
router.get('/all-ads-paginate', adsPaginate);
router.get('/top-ads', topAds);
router.get('/top-ads-eng', topAdsEng);
router.get('/middle-right-ads', middleRightAds);
router.get('/middle-long-ads', middleLongAds);
router.get('/middle-right-sm', middleRightsm);
router.get('/middle-left-sm', middleLeftsm);
router.get('/single-post-right', singlePostRight);
router.get('/below-post', belowPost);

router.put('/update-ads/:id', updateAds);
router.post('/ads/delete', deleteAds);



module.exports = router;