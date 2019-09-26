const express = require("express");
const Parking = require("../models/Parking");
const ParkingApi = require("../models/apiHandlers/parkingHandler");

const parkingApi = new ParkingApi(
  "https://datos.madrid.es/egob/catalogo/50027-2069413-AparcamientosOcupacionYServicios.json"
);
const parkingDetailsApi = new ParkingApi(
  "https://datos.madrid.es/egob/catalogo/50027-2069413-AparcamientosOcupacionYServicios.json"
);
const router = express.Router();

router.get("/parkings", (req, res, next) => {
  const dataView = {
    title: "madParking - Buscador de plazas de aparcamiento",
    header: "home"
  };
  Parking.find().then(allParkings => {
    res.json({ parkings: allParkings, dataview: dataView });
  });
});

router.get("/parkingsForMarkers", (req, res, next) => {
  updateFreeSpots();
  Parking.find().then(allParkings => {
    res.json(allParkings);
  });
});

router.get("/parking/:id", (req, res, next) => {
  updateFreeSpots();
  Parking.find({ id_ayto: req.params.id })
    .populate({ path: "comments", populate: { path: "authorId" } })
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      console.log(err);
    });
});

function updateFreeSpots() {
  Parking.updateMany(
    {},
    { $set: { availableParking: false, availableSpots: null } },
    { new: true }
  )
    .then(deletedInfo => {
      Parking.find()
        .then(parkings => {
          parkings.forEach(element => {
            parkingDetailsApi.getDetails(element.id_ayto).then(details => {
              let availableParkingUpd = false;
              let availableSpotsUpd;
              if (details.data.lstOccupation) {
                availableSpotsUpd = details.data.lstOccupation[0].free;
              }
              if (availableSpotsUpd > 10) {
                availableParkingUpd = true;
              }
              Parking.findOneAndUpdate(
                { id_ayto: details.data.id },
                {
                  $set: {
                    availableParking: availableParkingUpd,
                    availableSpots: availableSpotsUpd
                  }
                },
                { new: true }
              )
                .then(updatedParking => {
                  return;
                })
                .catch(err => console.log(err.code));
            });
          });
        })
        .catch(err => console.log(err.code));
    })
    .catch(err => console.log(err.code));
}

module.exports = router;
