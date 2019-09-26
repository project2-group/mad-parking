const express = require("express");
const Parking = require("../models/Parking");
const axios = require("axios");
const router = express.Router();
const access = require("./../middlewares/access.mid");






router.get('/', (req, res, next) => {
  const dataView = {
    title: 'madParking - Plazas de aparcamiento',
    header: 'home',
    search: true
  }
  
  res.render('index', {dataView, user: req.user});
});

router.get('/:id/details', (req, res, next) => {

  const dataView = {
    title: 'madParking - Plazas de aparcamiento',
    header: 'home',
    details: true,
    search: true,
    parking: req.params.id
  }

  res.render('index', {dataView});
});





module.exports = router;
