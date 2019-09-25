const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const SALT_WORK_FACTOR = 10;

// const PASSWORD_PATTERN = /(?=.\d)(?=.[a-z])(?=.*[A-Z]).{6,}/;
const EMAIL_PATTERN = /^(([^<>()\[\]\.,;:\s@\“]+(\.[^<>()\[\]\.,;:\s@\“]+)*)|(\“.+\“))@(([^<>()[\]\.,;:\s@\“]+\.)+[^<>()[\]\.,;:\s@\“]{2,})$/i;

const userSchema = new Schema(
  {
    username: { type: String, unique: true },
    password: {
      type: String,
      required: true,
      // match: [PASSWORD_PATTERN, "this is not a correct password"]
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
      match: [EMAIL_PATTERN, "this is not a correct email"]
    },
    photo: {
      url: {type: String, default: "./../public/images/ef3b3605aeefde1f05bcfa2f74e84329.png"},
      name: {type: String, default: "avatar"}
    },
    validationCode: { type: String, unique: true },
    active: {type: Boolean, default: false},
    googleID: String,
    favoriteParkings: [{ type : Schema.Types.ObjectId, ref: 'Parking' }]
  },
  {
    timestamps: true
  }
);

userSchema.methods.checkPassword = function(password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
