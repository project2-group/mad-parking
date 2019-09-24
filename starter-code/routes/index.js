const express = require('express');
const router  = express.Router();

router.use('/auth', require('./auth'));
router.use('/search', require('./search'));

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
