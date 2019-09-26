const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/User");
const upload = require("./../configs/cloudinary.config");

router.get("/", checkLogin, (req, res) => {
  res.render("");
})

router.get("/update/:id", [checkLogin, upload.single("userPhoto")], (req, res) => {
  let picName = req.file.originalname;
  let url = req.file.url;

  User.findOneAndUpdate(
    { _id: req.params.id },
    { photo: {
      url,
      name: picName
    }, },
    { new: true })
  .then(userUpdated => {userUpdated}
  );
})
