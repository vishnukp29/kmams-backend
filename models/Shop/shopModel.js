const mongoose = require("mongoose");

const shopSchema = new mongoose.Schema(
  {
    ownerName: {
        type: String,
        required: [true, "Owner Name is required"],
    },
    shopName: {
        type: String,
        required: [true, "Shop Name is Required"],
    },
    shopDescription: {
      type: String,
      required: [true, "Shop Description is Required"],
  },
    shopAddress: {
      type: String,
      required: [true, "Shop Address is required"],
      
    },
    estCertificate: { 
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2017/08/25/13/36/code-geek-2680204_960_720.png",
    },
    mobileNum: {
        type: Number,
        required: [true, "Please Enter your Mobile Number"],
        minLength: [10, "Mobile Number should have 10 charactors"],
        unique: false,
    },
    mail: {
        type: String,
        required: [true, "Owner Email is required"],
    },
    shopImage: {
        type: String,
        default:
          "https://cdn.pixabay.com/photo/2017/08/25/13/36/code-geek-2680204_960_720.png",
    },
    shopLocation : {
        type: String,
        required: [true, "Shop Location is Required"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Shop Owner is required"], 
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    isDenied: {
      type: Boolean,
      default: false,
    },
    approve: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    deny: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
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
module.exports = mongoose.model("Shop", shopSchema);