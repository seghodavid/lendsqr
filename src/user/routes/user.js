const express = require('express');

const userController = require('../controller/user')
const isAuth = require('../../middleware/auth')

const router = express.Router();

router.post('/register', userController.createUser)

router.delete('/user/:id', isAuth , userController.deleteUser)

router.post('/login', userController.login)

router.get('/find', isAuth, userController.getAllUsers)

router.get('/find/:id', isAuth, userController.getOneUser)

router.patch('/user', isAuth,  userController.updateUser)


module.exports = router