const express = require('express');
const router  = express.Router();

const authRoutes = require('./auth');
router.use('/auth', authRoutes);
router.use('/search', require('./parking.routes'));


/* GET home page */
router.get('/', (req, res, next) => {
  const dataView = {
    title: 'madParking - Find parking in madrid',
    header: 'home'
  }

  res.render('index', {dataView});
});

router.get('/test', (req, res, next) => {
  const dataView = {
    title: 'madParking - Cocacola',
    header: 'home'
  }

  res.render("map/search-parking", {dataView});
});

module.exports = router;
