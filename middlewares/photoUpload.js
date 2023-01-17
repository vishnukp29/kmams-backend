const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const { log } = require("console");

//storage
const multerStorage = multer.memoryStorage();

//file type checking
const multerFilter = (req, file, cb) => {
  //check file type
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    //rejected files
    cb(
      {
        message: "Unsupported file format",
      },
      false
    );
  }
};

const pictureUpload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fileSize: 1000000 },
});

//Image Resizing for Profile Picture
const profilePhotoResize = async (req, res, next) => {
  //check if there is no file
  if (!req.file) return next();
  req.file.filename = `user-${Date.now()}-${req.file.originalname}`;

  await sharp(req.file.buffer)
    .resize(250, 250)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(path.join(`public/images/profile/${req.file.filename}`));
  next();
};

//Image Resizing for Profile Picture
const banerImageResize = async (req, res, next) => {
  //check if there is no file
  if (!req.files) return next();
  req.files.bannerImageFilename = `user-${Date.now()}-${req.files.bannerImage[0].originalname}`;

  await sharp(req.files.bannerImage[0].buffer)
    .resize(250, 250)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(path.join(`public/images/banner/${req.files.bannerImageFilename}`));
  next();
};

//Image Resizing for Shop images
const shopImageResize = async (req, res, next) => {
  //check if there is no file
  if (!req.files) return next();
  req.files.shopImageFilename = `user-${Date.now()}-${req.files.shopImage[0].originalname}`;

  await sharp(req.files.shopImage[0].buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(path.join(`public/images/shop/${req.files.shopImageFilename}`)); 
  
  next();
};

//Image Resizing for Certificate images
const certImageResize = async (req, res, next) => {
  //check if there is no file
  if (!req.files) return next();
  req.files.estCertificateFilename = `user-${Date.now()}-${req.files.estCertificate[0].originalname}`;
  
  const img = req.files.estCertificate[0].buffer
  await sharp(img)
    .toFormat('jpeg')
		.jpeg({ quality: 100 })
    .toFile(path.join(`public/images/certificate/${req.files.estCertificateFilename}`));
  next();
};

module.exports = {
  pictureUpload,
  profilePhotoResize,
  shopImageResize,
  certImageResize,
  banerImageResize,
};
