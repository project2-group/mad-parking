const express = require("express");
const Parking = require("../models/Parking");

const router = express.Router();


router.get('/', (req, res, next) => {
  const dataView = {
    title: 'madParking - Plazas de aparcamiento',
    header: 'home',
    search: true
  }

  res.render('index', {dataView});
});

// router.get('/search/:city?', (req, res, next) => {
//   const dataView = {
//     title: 'madParking - color' + req.params.city,
//     header: 'home'
//   }

//   res.render('index', {dataView});
// });



module.exports = router;
