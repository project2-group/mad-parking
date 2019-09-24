const express = require("express");
const router = express.Router();
const ParkingApi = require("../models/apiHandlers/parkingHandler");
const Parking = require("../models/Parking");

const parkingApi = new ParkingApi(
  "https://webmint.munimadrid.es/MTPAR_RSINFO/restInfoParking/listParking"
);

router.get("/update-parkings", (req, res, next) => {
  parkingApi
    .getParkings()
    .then(allParkings => {
      allParkings.data.forEach(element => {
        Parking.findOne({ id_ayto: element.id }).then(parkingFound => {
          if (parkingFound) {
            if (element.longitude === "" || element.latitude === "") {
              return;
            } else if (element.longitude > -2 || element.latitude > 42) {
              return;
            } else if (
              element.latitude.includes(",") > 0 ||
              element.longitude.includes(",") > 0
            ) {
              element.latitude = element.latitude.replace(",", ".");
            }
            Parking.findOneAndUpdate(
              { id_ayto: element.id },
              {
                $set: {
                  id_ayto: element.id,
                  location: {
                    type: "Point",
                    coordinates: [element.longitude, element.latitude]
                  }
                }
              },
              { new: true }
            )
              .then(updatedParking => {
                return;
              })
              .catch(err => {
                console.log(err);
              });
          } else {
            if (element.longitude === "" || element.latitude === "") {
              return;
            } else if (element.longitude > -2 || element.latitude > 42) {
              return;
            } else if (
              element.latitude.includes(",") > 0 ||
              element.longitude.includes(",") > 0
            ) {
              element.latitude = element.latitude.replace(",", ".");
            }
            Parking.create({
              id_ayto: element.id,
              location: {
                type: "Point",
                coordinates: [element.longitude, element.latitude]
              }
            });
          }
        });
      });
    })
    .then(() => {
      res.redirect("/");
    })
    .catch(err => {
      console.log(err);
    });
});

module.exports = router;
