const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/User");
const upload = require("./../configs/cloudinary.config");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const access = require("./../middlewares/access.mid");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

const transporter = require("./../configs/nodemailer.config");

router.get("/login", (req, res, next) => {
  if (req.query.error) {
    res.render("auth/login", {
      message: "Account not activated. Please check your email."
    });
  } else {
    res.render("auth/login", { message: req.flash("error") });
  }
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/auth/login",
    failureFlash: true,
    passReqToCallback: true
  })
);

router.get("/signup", (req, res, next) => {
  if (req.query.error) {
    res.render("auth/signup", { message: "User not found" });
  } else {
    res.render("auth/signup");
  }
});

router.post("/signup", upload.single("userPhoto"), (req, res, next) => {
  const { username, password, email } = req.body;
  let originalname;
  let url;
  if (req.file) {
    originalname = req.file.originalname;
    url = req.file.url;
  }
  if (username === "" || password === "" || email === "") {
    res.render("auth/signup", { message: "Indicate username and password" });
    return;
  }
  User.findOne({ email }, "email", (err, user) => {
    if (email !== null) {
      res.render("auth/signup", { message: "This user already exists" });
      return;
    }
  });
  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "This user already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const validationCode = crypto.randomBytes(20).toString("hex");
    console.log(url);
    const newUser = new User({
      username,
      password: hashPass,
      email,
      photo: {
        url,
        name: originalname
      },
      validationCode
    });

    newUser.save().then(newUser => {
      transporter
        .sendMail({
          from: "info@info.com",
          to: email,
          subject: `${username} welcome! :)`,
          html: `<a href="http://localhost:3000/auth/confirm/${validationCode}">Click here to activate your account</a>`
        })
        .then(() => res.redirect("/"))
        .catch(err => {
          console.log(err);
        })
        .catch(err => {
          console.log(err);
          res.render("auth/signup", { message: "Something went wrong" });
        });
    });
  });
});

router.get("/confirm/:confirmCode", (req, res, next) => {
  const token = req.params.confirmCode;
  User.findOneAndUpdate(
    { validationCode: token },
    { $set: { active: true } },
    { new: true }
  )
    .then(user => {
      if (user === null) {
        res.render("auth/activation", { user, error: true });
      }
      res.render("auth/activation", { user, ok: true });
    })
    .catch(() => {
      console.log(error);
    });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;