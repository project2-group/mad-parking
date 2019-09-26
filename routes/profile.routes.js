const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/User");
const upload = require("./../configs/cloudinary.config");
const access = require("./../middlewares/access.mid");

router.get("/", access.checkLogin, (req, res) => {
  const dataView = {
    auth: true
  };
  User.findById(req.user._id)
    .then(userFound => {
      res.render("profile/profile", { userFound, dataView });
    })
    .catch(err => {
      console.log(err);
    });
});
router.get("/update", access.checkLogin, (req, res) => {
  const dataView = {
    auth: true
  };
  User.findById(req.user._id)
    .then(userFound => {
      res.render("profile/update", { userFound, dataView });
    })
    .catch(err => {
      console.log(err);
    });
});

router.post(
  "/update/:id",
  [access.checkLogin, upload.single("userPhoto")],
  (req, res, next) => {
    const { username, email } = req.body;
    let originalname;
    let url;
    if (req.file) {
      originalname = req.file.originalname;
      url = req.file.url;
      User.findOneAndUpdate(
        { _id: req.user._id },
        {
          $set: {
            username: username,
            email: email,
            photo: {
              url: url,
              name: originalname
            }
          }
        },
        { new: true }
      ). then(() => {res.redirect('/')})
      .catch ((err)=> {console.log(err)})
    } else {
      User.findOneAndUpdate(
        { _id: req.user._id },
        {
          $set: {
            username: username,
            email: email
          }
        },
        { new: true }
      ). then(() => {res.redirect('/')})
      .catch ((err)=> {console.log(err)})
    }
  }
);

module.exports = router;

