const express = require("express");
const Parking = require("../models/Parking");

const router = express.Router();

router.get("/parkings", (req, res, next) => {
  Parking.find().then(allParkings => {
    res.json(allParkings);
  });
});

router.get("/map", (req, res, next) => {
  Parking.find({})
    .then(allParkings => res.render("map", { allParkings }))
    .catch(error => next(error));
});

router.get("/:id", (req, res, next) => {
  Parking.findById(req.params.id)
    .then(parkingDetail => res.render("detail", { parkingDetail }))
    .catch(error => next(error));
});

module.exports = router;
