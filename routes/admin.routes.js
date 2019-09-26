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
        parkingDetailsApi
        .getDetails(element.id_ayto)
        .then(details => {
            let data = details.data;
            let updatedAddress;
            let updatedAccesses = [];
            let updatedRates = [];
            let updatedparkingTypes = [];
            let updatedAccessType = [];
            let updatedPaymentType = [];
            let updatedAdditionalServices = [];
            let updatedInformation = [];
            if (data.general) {
              let newAddress;
              let newAreaCode;
              let newTown;
              if (data.general.address) {
                newAddress = data.general.address.trim();
              }
              if (data.general.areaCode && data.general.areaCode !== "      ") {
                newAreaCode = data.general.areaCode.trim();
              }
              if (data.general.town) {
                newTown = data.general.town.trim();
              }
              updatedAddress = {
                address: newAddress,
                areaCode: newAreaCode,
                town: newTown
              };
            }
            if (data.lstAccess) {
              data.lstAccess.forEach(element => {
                if (
                  element.name === "Vehículo" ||
                  element.name === "Ascensor para Vehículo"
                ) {
                  let address = element.address.trim();
                  if (element.longitude === "" || element.latitude === "") {
                    return;
                  } else if (element.longitude > -2 || element.latitude > 42) {
                    return;
                  } else if (
                    element.latitude.includes(",") ||
                    element.longitude.includes(",")
                  ) {
                    element.latitude = element.latitude
                      .replace(",", ".")
                      .trim();
                    element.longitude = element.longitude
                      .replace(",", ".")
                      .trim();
                  }
                  let location = {
                    type: "Point",
                    coordinates: [element.longitude, element.latitude]
                  };
                  updatedAccesses.push({
                    address: address,
                    location: location
                  });
                } else {
                  return;
                }
              });
            }
            if (data.lstRates) {
              data.lstRates.forEach(element => {
                let description = element.description;
                let rates = element.rate;
                let minutesStayInitation = element.minutesStayInitation;
                let minutesStayEnd = element.minutesStayEnd;
                updatedRates.push({
                  description: description,
                  rates: rates,
                  minutesStayInitation: minutesStayInitation,
                  minutesStayEnd: minutesStayEnd
                });
              });

              // console.log(data.lstFeatures)
              // console.log("---------------------------");
            }
            if (data.lstFeatures) {
              data.lstFeatures.forEach(element => {
                if (element.nameField === "Tipo plaza") {
                  let name = element.name;
                  let content = element.content;
                  updatedparkingTypes.push({ name: name, content: content });
                }
                if (element.nameField === "Tipo acceso") {
                  let name = element.name;
                  let content = element.content;
                  updatedAccessType.push({ name: name, content: content });
                }
                if (element.nameField === "Tipo pago") {
                  let name = element.name;
                  let content = element.content;
                  updatedPaymentType.push({ name: name, content: content });
                }
                if (element.nameField === "Servicios adicionales") {
                  let name = element.name;
                  let content = element.content;
                  updatedAdditionalServices.push({
                    name: name,
                    content: content
                  });
                }
                if (element.nameField === "Información") {
                  let name = element.name;
                  let content = element.content;
                  updatedInformation.push({ name: name, content: content });
                }
              });
            }
            Parking.findOneAndUpdate(
              { id_ayto: data.id},
              {
                $set: {
                  address: updatedAddress,
                  accesses: updatedAccesses,
                  rates: updatedRates,
                  parkingType: updatedparkingTypes,
                  accessType: updatedAccessType,
                  paymentType: updatedPaymentType,
                  additionalServices: updatedAdditionalServices,
                  information: updatedInformation
                }
              },
              { new: true }
            )
              .then(updatedParking => {
                return
                
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
    })
    .then(done => {
      res.redirect('/')
    })
    .catch((err) => console.log(err))
});

module.exports = router;
