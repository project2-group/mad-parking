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
            let updatedparkingTypes = {
              total: undefined,
              pmr: false,
              electric: false,
              motorbike: false,
              bike: false
            };
            let updatedPaymentType = {
              cash: false,
              card: false,
              mobile: false
            };
            let updatedAdditionalServices = {
              bathroom: false,
              adaptedBathroom: false,
              elevator: false,
              automatedPayment: false,
              cashier: false,
              camera: false,
              info: false,
              carWash: false
            };
            let updatedmaxHeight;
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
            }
            if (data.lstFeatures) {
              data.lstFeatures.forEach(element => {
                if (element.nameField === "Tipo plaza") {
                  switch (element.name) {
                    case "Total":
                      updatedparkingTypes.total = element.content;
                      break;
                    case "PMR":
                      if (element.content > 0) {
                        updatedparkingTypes.pmr = true;
                      }
                      break;
                    case "Normal":
                      break;
                    case "Motocicleta":
                      if (element.content > 0) {
                        updatedparkingTypes.motorbike = true;
                      }
                      break;
                    case "Eléctrica":
                      if (element.content > 0 || element.content === "SI") {
                        updatedparkingTypes.electric = true;
                      }
                      break;
                  }
                }
                if (element.nameField === "Tipo acceso") {
                  if (element.name === "PMR") {
                    updatedAccessType.pmr = true;
                  }
                }
                if (element.nameField === "Tipo pago") {
                  switch (element.name) {
                    case "Pago con tarjeta":
                      if (element.content !== "") {
                        updatedPaymentType.card = true;
                      }
                      break;
                    case "Pago en efectivo":
                      if (element.content !== "") {
                        updatedPaymentType.cash = true;
                      }
                      break;
                    case "Pago desde móvil":
                      if (element.content !== "") {
                        updatedPaymentType.mobile = true;
                      }
                      break;
                  }
                }
                if (element.nameField === "Servicios adicionales") {
                  switch (element.name) {
                    case "Aseos":
                    case "Aseos accesibles":
                      updatedAdditionalServices.bathroom = true;
                      break;
                    case "Aseos accesibles":
                      updatedAdditionalServices.adaptedBathroom = true;
                      break;
                    case "Ascensores salida calle":
                    case "Escaleras adaptadas":
                      if (
                        element.content === "SI" ||
                        element.content === "SÍ"
                      ) {
                        updatedAdditionalServices.elevator = true;
                      }
                      break;
                    case "Cajero central presencial":
                      if (element.content !== "") {
                        updatedAdditionalServices.cashier = true;
                      }
                      break;
                    case "Cajero automático tarjeta y metálico":
                      if (element.content !== "") {
                        updatedAdditionalServices.automatedPayment = true;
                      }
                      break;
                    case "Recarga vh eléctrico":
                      updatedparkingTypes.electric = true;
                      break;
                    case "Grabación de matrículas (E/S)":
                    case "CCTV":
                      updatedAdditionalServices.camera = true;
                      break;
                    case "Información a usuarios":
                      updatedAdditionalServices.info = true;
                      break;
                    case "Aparcamiento para bicicletas":
                      updatedparkingTypes.bike = true;
                      break;
                    case "Lavadero":
                      updatedAdditionalServices.carWash = true;
                      break;
                  }
                }
                if (element.nameField === "Información") {
                  updatedmaxHeight = element.content
                }
              });
            }
            Parking.findOneAndUpdate(
              { id_ayto: data.id },
              {
                $set: {
                  address: updatedAddress,
                  accesses: updatedAccesses,
                  rates: updatedRates,
                  parkingType: updatedparkingTypes,
                  paymentType: updatedPaymentType,
                  additionalServices: updatedAdditionalServices,
                  maxHeight: updatedmaxHeight
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
          .catch(err => console.log(err.toJSON));
      });
    })
    .catch(err => {
      console.log(err);
    })
    .then(done => {
      res.redirect("/");
    })
    .catch(err => console.log(err));
});

module.exports = router;
