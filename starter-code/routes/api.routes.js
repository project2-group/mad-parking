const express = require("express");
const Parking = require("../models/Parking");

const router = express.Router();

router.get("/parkings", (req, res, next) => {

  const dataView = {
    title: 'madParking - Buscador de plazas de aparcamiento',
    header: 'home'
  }
 
  Parking.find().then(allParkings => {
    res.json({parkings: allParkings, dataview: dataView});
  });
});

module.exports = router;
