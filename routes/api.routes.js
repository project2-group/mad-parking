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
const Comment = require("./../models/Comment");

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

router.get("/parking/add-review/:id", (req, res, next) => {
  Parking.find({ id_ayto: req.params.id })
    // .populate({ path: "comments", populate: { path: "authorId" } })
    .then(data => {
      const dataView = {
        title: "madParking - Buscador de plazas de aparcamiento",
        header: "home"
      };
      res.render("profile/comments", { data, dataView });
    })
    .catch(err => {
      console.log(err);
    });
});

//PENDIENTE DE ARREGLAR
// router.post("/parking/add-review", (req, res, next) => {
//   const { text, assessment, id } = req.body;
//   const newComment = new Comment({
//     authorID: req.user.id,
//     text,
//     assessment
//   });
//   newComment
//     .save()
//     .then(comment => {
//       Parking.findById(id)
//         .then(parkingFound => {
//           parkingFound.comments.push(comment.id);
//         })
//         .catch(err => console.log(err));
//     })
//     .catch(err => console.log(err));
// });

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
