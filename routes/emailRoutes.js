const express = require("express");
const { sendEmailMsg } = require("../controllers/emailController");

const authMiddleware = require("../middlewares/AuthMiddleware");
const emailRoutes = express.Router();

emailRoutes.post("/", authMiddleware, sendEmailMsg);

module.exports = emailRoutes;
