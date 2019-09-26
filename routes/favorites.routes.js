const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/User");
const Parking = require("../models/Parking");

router.get("/", checkLogin, (req, res) => {
  res.render("favorites");
})

router.post("/add-parking/:id", checkLogin, (req, res) => {

  User.findByIdAndUpdate(parking._id, { $push: { favoriteParkings: newParking._id }}).then(parkingAdded => {
    res.redirect(`/`);
    return;
  });

});
