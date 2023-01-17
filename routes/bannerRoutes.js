const express = require("express");
const {addBanner, fetchBanners, deleteBanner} = require("../controllers/bannerController");
const authMiddleware = require("../middlewares/AuthMiddleware");
const {
  pictureUpload,
  banerImageResize
} = require("../middlewares/photoUpload");

const bannerRoutes = express.Router();

bannerRoutes.post(
  "/add-banner",
  authMiddleware,
  pictureUpload.single('bannerImage'),
  banerImageResize,
  addBanner
);

bannerRoutes.get("/", fetchBanners);
bannerRoutes.delete("/:id", authMiddleware, deleteBanner);

module.exports = bannerRoutes;
