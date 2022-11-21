const express = require('express');
const router = express.Router();
const { 
    signup,
    signin,
    signout,
    requireSignin,
    forgotPassword,
    resetPassword,
    preSignup,} = require('../controllers/auth');

//validator
const {runValidation} = require('../validators');
const {
    userSignupValidator,
    userSigninValidator,
    forgotPasswordValidator,
    resetPasswordValidator
} = require('../validators/auth');

router.post('/signup', userSignupValidator, requireSignin, signup);
router.post('/signin', userSigninValidator, runValidation, signin);
router.get('/signout', signout);
router.put('/forgot-password', forgotPasswordValidator, runValidation, forgotPassword);
router.put('/reset-password', resetPasswordValidator, runValidation, resetPassword);



// router.get('/secret', requireSignin, (req, res) =>{
//     res.json({
//         user: req.user
//     });
// });

module.exports = router;