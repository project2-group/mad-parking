const express = require("express");
const Parking = require("../models/Parking");
const axios = require("axios");
const router = express.Router();
const access = require("./../middlewares/access.mid");

const Comment = require("./../models/Comment");

router.get('/', (req, res, next) => {
  const dataView = {
    title: 'madParking - Plazas de aparcamiento',
    header: 'home',
    search: true
  }
  res.render('index', {dataView, user: req.user});
});

// router.get('/:id/details', (req, res, next) => {

//   const dataView = {
//     title: 'madParking - Plazas de aparcamiento',
//     header: 'home',
//     details: true,
//     parking: req.params.id
//   }


//   res.render('index', {dataView});
// });

router.get("/details/:id", (req, res, next) => {
  Parking.findById(req.params._id)
    .populate({ path: "comments", populate: { path: "authorId" } })
    .then(parking => {
      const dataView = {
        title: 'madParking - Plazas de aparcamiento',
        header: 'home',
        details: true,
        parking: req.params.id
      }

      res.render("parking/detail", {
        parking, dataView
      });
    });
});

router.post("/details/add-review/:id", access.checkLogin,
  (req, res, next) => {
    let { text, assessment } = req.body;
    let { parkingid } = req.params;
    if (!content) {
      res.redirect("/search/details/add-review/?error=empty-fields");
      return;
    }
    
    Comment.create({
      text,
      assessment
    })
      .then(newComment => {
        console.log(newComment);
        Parking.findByIdAndUpdate(parkingid, { $push: { comments: newComment._id } }).then(commentAdded => {
          res.redirect(`/search/details/${parkingid}`);
          return;
        });
      })
      .catch(error => {
        console.log(error);
      });
  }
);

module.exports = router;
