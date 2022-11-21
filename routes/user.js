const express = require('express');
const router = express.Router();
const { requireSignin, authMiddleware, adminMiddleware } = require('../controllers/auth');
const { create, read, publicProfile, update, photo, users, saveUser, updateUser, deleteUser, getUser, userCreate, userUpdate} = require('../controllers/user');

router.get('/user/create', requireSignin, authMiddleware, create);
router.get('/user/profile', requireSignin, authMiddleware, read);
router.get('/user/:username', publicProfile);
router.put('/user/update', requireSignin, authMiddleware, update);
router.get('/users', users);
router.get('/user/photo/:username', photo);

router.post('/user/save', saveUser);
router.get('/user/get', getUser);
router.post('/user/update', updateUser);
router.post('/user/delete', deleteUser);
router.post('/usercreate', userCreate);
router.put('/userupdate/:id', userUpdate);

module.exports = router;