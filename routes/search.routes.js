const express = require("express");
const Parking = require("../models/Parking");
const axios = require("axios");
const router = express.Router();






router.get('/', (req, res, next) => {
  const dataView = {
    title: 'madParking - Plazas de aparcamiento',
    header: 'home',
    search: true
  }

  res.render('index', {dataView});
});

router.get('/:id/details', (req, res, next) => {

  const dataView = {
    title: 'madParking - Plazas de aparcamiento',
    header: 'home',
    details: true,
    parking: req.params.id
  }

  res.render('index', {dataView});
});





module.exports = router;
