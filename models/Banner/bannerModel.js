const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema(
  {
    bannerImage: {
        type: String,
        default:
          "https://cdn.pixabay.com/photo/2017/08/25/13/36/code-geek-2680204_960_720.png",
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
    timestamps: true,
  }
);

//compile
module.exports = mongoose.model("Banner", bannerSchema);