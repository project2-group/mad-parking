const express = require("express");
const router = express.Router();
const ParkingApi = require("../models/apiHandlers/parkingHandler");
const Parking = require("../models/Parking");

const parkingApi = new ParkingApi(
  "https://webmint.munimadrid.es/MTPAR_RSINFO/restInfoParking/listParking"
);

router.get("/update-parkings", (req, res, next) => {
  Parking.deleteMany()
    .then(
      parkingApi.getParkings().then(allParkings => {
        allParkings.data.forEach(element => {
          Parking.create({
            id_ayto: element.id,
            location: {
              type: "Point",
              coordinates: [element.longitude, element.latitude]
            }
          })
            .then(() => res.redirect('/'))
            .catch(error => console.log(error));
        });
      })
    )
    .catch(error => console.log(error));
});

module.exports = router;
