const express = require('express');
const router  = express.Router();

const authRoutes = require('./auth');
router.use('/auth', authRoutes);


/* GET home page */
router.get('/', (req, res, next) => {
  const dataView = {
    title: 'madParking - Find parking in madrid',
    header: 'home'
  }

  res.render('index', {dataView});
});

module.exports = router;
