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

router.get("/:id", (req, res, next) => {
  parkingApi.getDetails(req.params.id)
  .then(data => {
    res.json(data.data);
  })
  .catch((err) => {console.log(err)})
});

module.exports = router;
