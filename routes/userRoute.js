const express = require('express');

const {loginUser
    ,userProfile
    ,userRegister
    ,updateProfile 
    ,updatePassword
    ,profilePhotoUpload
    ,fetchUsers
    ,userDetails} = require('../controllers/userController')

const authMiddleware = require('../middlewares/AuthMiddleware')
const { pictureUpload,profilePhotoResize} = require('../middlewares/photoUpload')

const userRoutes=express.Router()

userRoutes.post('/register',userRegister)
userRoutes.post('/login',loginUser)
userRoutes.get('/',authMiddleware,fetchUsers)
userRoutes.put('/updatepassword',authMiddleware,updatePassword)
userRoutes.put('/profilephoto',authMiddleware, pictureUpload.single('image'),profilePhotoResize,profilePhotoUpload)
userRoutes.put('/',authMiddleware,updateProfile)

userRoutes.get('/:id',authMiddleware,userDetails)
userRoutes.get('/profile/:id',authMiddleware,userProfile)


module.exports=userRoutes 