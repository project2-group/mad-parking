const express = require("express");
const router = express.Router();
const ParkingApi = require("../models/apiHandlers/parkingHandler");
const Parking = require("../models/Parking");

const parkingApi = new ParkingApi(
  "https://webmint.munimadrid.es/MTPAR_RSINFO/restInfoParking/listParking"
);
const parkingDetailsApi = new ParkingApi(
  "https://datos.madrid.es/egob/catalogo/50027-2069413-AparcamientosOcupacionYServicios.json"
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
                  },
                  nickName: element.name
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
            console.log(element.name);
            Parking.create({
              id_ayto: element.id,
              location: {
                type: "Point",
                coordinates: [element.longitude, element.latitude]
              },
              nickName: element.name
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

router.get("/update-parkingDetails", (req, res, next) => {
  Parking.find()
    .then(allParkings => {
      allParkings.forEach(element => {
        console.log(element.id_ayto);
        parkingDetailsApi
          .getDetails(element.id_ayto)
          .then(details => {
            //Insert data validations for model
            Parking.findOneAndUpdate(
              { id_ayto: details.id_ayto },
              {
                $set: {
                  contact: {
                    address: {
                      address: String,
                      areaCode: String,
                      town: String
                    },
                    phone: {type: Number},
                    email: {type: String, match: [EMAIL_PATTERN, "this is not a correct email"]},
                    web: {type: String}
                  },
                  accesses: [{
                    address: String,
                    location: { type: { type: String }, coordinates: [Number] }
                  }],
                  schedule: String,
                  rates: [{
                    description: String,
                    rate: Number
                  }],
                  parkingType: [{
                    name: String,
                    content: String
                  }],
                  accessType: [{
                    name: String,
                    content: String
                  }],
                  paymentType: [{
                    name: String,
                    content: String
                  }],
                  additionalServices: [{
                    name: String,
                    content: String
                  }],
                  information: [{
                    name: String,
                    content: String
                  }]










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
          })
          .catch(err => console.log(err));
      });
    })
    .catch(err => {
      console.log(err);
    });
});

module.exports = router;
