const express = require("express");
const Parking = require("../models/Parking");

const router = express.Router();

// router.get("/parkings", (req, res, next) => {
//   Parking.find().then(allParkings => {
//     res.json(allParkings);
//   });
// });

router.get("/", (req, res, next) => {

  const dataView = {
    title: 'madParking - Cocacola',
    header: 'home'
  }
  // Parking.find({})
  //   .then(allParkings => res.render("search/search-parking", { allParkings, dataView }))
  //   .catch(error => next(error));
  Parking.find().then(allParkings => {
    res.json({parkings: allParkings, dataview: dataView});
  });
});

// router.get("/:id", (req, res, next) => {
//   Parking.findById(req.params.id)
//     .then(parkingDetail => res.render("detail", { parkingDetail }))
//     .catch(error => next(error));
// });

module.exports = router;
