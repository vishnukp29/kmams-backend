const expressAsyncHandler = require("express-async-handler");
const crypto = require("crypto");
const fs = require("fs");
const nodemailer = require("nodemailer");
const generateToken = require("../config/Token/generateToken");
const User = require("../models/User/userModel");
const validateMongodbId = require("../utils/validateMongodbId");
const cloudinaryUploadImg = require("../utils/cloudinary");
const { sendMailHelper } = require("../utils/sendMailHelper");

// User Registration
const userRegister = expressAsyncHandler(async (req, res) => {
  // Check if user is already registered
  const userExists = await User.findOne({ email: req.body.email });
  if (userExists) throw new Error("User Already registered");
  console.log(req.body);
  try {
    const user = await User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phoneNum: req.body.phoneNum,
      password: req.body.password,
    });
    res.json(user);
  } catch (error) {
    res.json(error);
  }
});

// User Login
const loginUser = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  console.log(email,'======email');
  console.log(password,'======password');
  
  //check if user exists
  const userFound = await User.findOne({ email }); 

  //Check if password is match
  if (userFound && (await userFound.isPasswordMatched(password))) {
    res.json({
      _id: userFound?._id,
      firstName: userFound?.firstName,
      lastName: userFound?.lastName,
      email: userFound?.email,
      phoneNum:userFound?.phoneNum,
      profilePicture: userFound?.profilePicture,
      isAdmin: userFound?.isAdmin,
      token: generateToken(userFound?._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid Login Credentials");
  }
});

// Fetch Users
const fetchUsers = expressAsyncHandler(async (req, res) => {
  try {
    const users = await User.find({})
    res.json(users);
  } catch (error) {
    res.json(error);
  }
});

// User Details
const userDetails = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);

  try {
    const user = await User.findById(id);
    res.json(user);
  } catch (error) {
    res.json(error);
  }
});

// User Profile
const userProfile = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  const loginUserId = req?.user?._id?.toString();

  try {
    const myProfile = await User.findById(id)
    res.json(myProfile);
  } catch (error) {
    res.json(error);
  }
});

// Update profile
const updateProfile = expressAsyncHandler(async (req, res) => {
  const { _id } = req?.user;

  validateMongodbId(_id);
  const user = await User.findByIdAndUpdate(
    _id,
    {
      firstName: req?.body?.firstName,
      lastName: req?.body?.lastName,
      email: req?.body?.email,
      phoneNum: req?.body?.phoneNum,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.json(user);
});

// Update Password
const updatePassword = expressAsyncHandler(async (req, res) => {
  // Destructure the login user
  const { _id } = req.user;
  const { password } = req.body;
  validateMongodbId(_id);
  const user = await User.findById(_id);
  if (password) {
    user.password = password;
    const updatedUser = await user.save();
    res.json(updatedUser);
  }
  res.json(user);
});

//Profile photo upload
const profilePhotoUpload = expressAsyncHandler(async (req, res) => {

  //1. Get the Path to image
  const localPath = `public/images/profile/${req.file.filename}`;

  //2.Upload to cloudinary
  const imgUploaded = await cloudinaryUploadImg(localPath);

  //Find the login user
  const { _id } = req.user; 
  
  const foundUser = await User.findByIdAndUpdate( 
    _id,
    {
      profilePicture: imgUploaded?.url,
    },
    { new: true }
  );
  
   //remove the saved img
   fs.unlinkSync(localPath);
   res.json(foundUser);
});


module.exports= {
    userRegister,
    loginUser,
    userProfile,
    updateProfile,
    updatePassword,
    profilePhotoUpload,
    fetchUsers,
    userDetails,
}
