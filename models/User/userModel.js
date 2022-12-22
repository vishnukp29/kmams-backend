const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First Name is Required"],
    },
    lastName: {
      type: String,
      required: [true, "Last Name is Required"],
    },
    profilePicture: {
      type: String, 
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    },
    email: {
      type: String,
      required: [true, "Email is Required"],
    },
    phoneNum: {
      type: Number,
      required: [true, "Please Enter your Mobile Number"],
      minLength: [10, "Mobile Number should have 10 charectors"],
      unique: false,
    },
    password: {
      type: String,
      required: [true, "Please add a password"], 
    },
    role: {
      type: String,
      enum: ["Admin", "Guest", "Retailer"],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    shopCount: {
      type: Number,
      default: 0,
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

//virtual method to populate registered Shops
userSchema.virtual("shops", {
  ref: "Shop",
  foreignField: "user",
  localField: "_id",
});

//Hash Password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Match Password
userSchema.methods.isPasswordMatched = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

//Password reset/forget
userSchema.methods.createPasswordResetToken = async function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 30 * 60 * 1000; //10 minutes
  return resetToken;
};

module.exports = mongoose.model("User", userSchema);