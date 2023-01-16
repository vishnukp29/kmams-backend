const expressAsyncHandler = require("express-async-handler");
const fs = require("fs");
const Shop = require('../models/Shop/shopModel')
const User = require("../models/User/userModel");
const validateMongodbId = require("../utils/validateMongodbId");
const cloudinaryUploadImg = require("../utils/cloudinary");
const { errorHandler } = require("../middlewares/errorHandler");


// Register Shop
const registerShop = expressAsyncHandler(async (req, res) => {
    const { _id } = req.user;

    //1. Get the Path to img
    const certLocalPath = `public/images/certificate/${req.files.estCertificateFilename}`;
    console.log(certLocalPath,'Local path'); 

    const imgLocalPath = `public/images/shop/${req.files.shopImageFilename}`;
    console.log(imgLocalPath,'img Path');
    
    //2.Upload to cloudinary
    const imgUploaded = await cloudinaryUploadImg(certLocalPath);
    const shopImgUploaded = await cloudinaryUploadImg(imgLocalPath);

    console.log(req.body,'=========request');
    try {
      const shop = await Shop.create({
        ...req.body,
        estCertificate: imgUploaded?.url,
        shopImage: shopImgUploaded?.url,
        user: _id,
      });

      //update user shop count
		  await User.findByIdAndUpdate(
        _id,
        { $inc: { shopCount: 1 } },
        { new: true } 
		  );

      //Remove uploaded img
      fs.unlinkSync(certLocalPath);
      res.json(shop);

    } catch (error) {
      res.json(error);
    }
  });


//Fetch all Shops
const fetchShops = expressAsyncHandler(async (req, res) => {
  try {
    const shops = await Shop.find({})
      res.json(shops);
  } catch (error) {
    res.json(error)
  }
});

//Fetch Approved Shops
const fetchApprovedShops = expressAsyncHandler(async (req, res) => {
  try {
    const shops = await Shop.find({"isApproved":true})
      res.json(shops);
  } catch (error) {
    res.json(error)
  }
});

  //Fetch new Shops
  const newShops = expressAsyncHandler(async (req, res) => {
    try {
      const shops = await Shop.find({}).sort({createdAt:-1}).limit(3)
        res.json(shops);
    } catch (error) {
      res.json(error)
    }
  });

//Fetch a single Shop
const fetchSingleShop = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const shop = await Shop.findById(id)
    res.json(shop);
  } catch (error) {
    res.json(error)
  }
});

// Delete Shop
 
const deleteShop = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  console.log(req.user.id,'userid');
  validateMongodbId(id);
  try {
    const shop = await Shop.findByIdAndDelete(id);
    //update user Shop count
    await User.findByIdAndUpdate(
      {_id:req.user.id},
      { $inc: { shopCount: -1 } },
      { new: true } 
    );
    res.json(shop);
  } catch (error) { 
    res.json(error); 
  }
  
});

// Update Shop Details
const updateShop = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);

  try {
    const shop = await Shop.findByIdAndUpdate(
      id, 
      {
        ...req.body,
        user: req.user?._id,
      },
      {
        new: true,
      }
    );
    res.json(shop); 
  } catch (error) {
    res.json(error);
  }
});

// Approve Shop
const toggleApproveShop = expressAsyncHandler(async (req, res) => {

  if (req.user.isAdmin=== false) {
    return res.status(403).json({
      success:false,
      message:"Unautherized Access"
    })
  }
  console.log(req.body,"======body");
  //1.Find the post to be liked
  const { shopId } = req.body;
  const shop = await Shop.findById(shopId);
  if(!shop){
    return res.status(403).json({
      success:false,
      message:"shop not found"
    })
  }
  
  //2. Find the login user
  const loginUserId = req?.user?._id;
  let message
  if(shop.isApproved){
    message = "shop denied"
  }else{
    message = "shop Approved"
  }

  const approved = await Shop.findByIdAndUpdate(shopId,{
    isApproved:!shop.isApproved
  },{new:true});

  res.status(201).json({
    success:true,
    message,
    approved
  }) 
});



module.exports = {
    registerShop,
    fetchShops,
    newShops,
    fetchSingleShop,
    deleteShop,
    updateShop, 
    toggleApproveShop,
    fetchApprovedShops
}
  
