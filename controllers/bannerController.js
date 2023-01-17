const expressAsyncHandler = require("express-async-handler");
const fs = require("fs");
const Banner = require("../models/Banner/bannerModel");
const validateMongodbId = require("../utils/validateMongodbId");
const cloudinaryUploadImg = require("../utils/cloudinary");
const { errorHandler } = require("../middlewares/errorHandler");

// Add Banner
const addBanner = expressAsyncHandler(async (req, res) => {
  const { _id } = req.user;

  //1. Get the Path to img
  const bannerLocalPath = `public/images/banner/${req.files.bannerImageFilename}`;
  console.log( bannerLocalPath, "Local path");

  //2.Upload to cloudinary
  const bannerUploaded = await cloudinaryUploadImg(bannerLocalPath);

  console.log(req.body, "=========request");
  try {
    const banner = await Banner.create({
        bannerImage: bannerUploaded?.url,
    });

    //Remove uploaded img
    fs.unlinkSync(bannerLocalPath);
    res.json(banner);
  } catch (error) {
    res.json(error);
  }
});

//Fetch all Banners
const fetchBanners = expressAsyncHandler(async (req, res) => {
  try {
    const banners = await Banner.find({});
    res.json(banners);
  } catch (error) {
    res.json(error);
  }
});

// Delete Banners
const deleteBanner = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  console.log(req.user.id, "userid");
  validateMongodbId(id);
  try {
    const banner = await Banner.findByIdAndDelete(id);
    res.json(banner);
  } catch (error) {
    res.json(error);
  }
});

module.exports = {
  addBanner,
  fetchBanners,
  deleteBanner
};
