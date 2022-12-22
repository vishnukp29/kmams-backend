const express = require("express");
const {
  registerShop,
  fetchShops,
  fetchSingleShop,
  deleteShop,
  updateShop,
  newShops
} = require("../controllers/shopController");
const authMiddleware = require("../middlewares/AuthMiddleware");
const {
  pictureUpload,
  shopImageResize,
  certImageResize,
} = require("../middlewares/photoUpload");

const shopRoutes = express.Router();

shopRoutes.post(
  "/shop-join",
  authMiddleware,
  pictureUpload.fields([{name:"estCertificate", maxCount: 1},{name:"shopImage", maxCount: 1}]),
  certImageResize,
  shopImageResize,
  registerShop
);

shopRoutes.get("/", fetchShops);
shopRoutes.get("/newly", newShops);
shopRoutes.get("/:id", fetchSingleShop);
shopRoutes.put("/:id", authMiddleware, updateShop);
shopRoutes.delete("/:id", authMiddleware, deleteShop);

module.exports = shopRoutes;
