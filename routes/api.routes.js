const express = require("express");
const Parking = require("../models/Parking");
const ParkingApi = require("../models/apiHandlers/parkingHandler");

const parkingApi = new ParkingApi(
  "https://datos.madrid.es/egob/catalogo/50027-2069413-AparcamientosOcupacionYServicios.json"
);
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

router.get("/parkingsForMarkers", (req, res, next) => {
  Parking.find().then(allParkings => {
    res.json(allParkings);
  });
});

router.get("/parking/:id", (req, res, next) => {
  Parking.find({ id_ayto: req.params.id })
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      console.log(err);
    });
 });

module.exports = router;
