const express = require('express');
const router  = express.Router();

router.use('/auth', require('./auth'));
router.use('/search', require('./search'));
router.use('/api', require('./api.routes'));


router.get('/', (req, res, next) => {
  const dataView = {
    title: 'madParking',
    header: 'home'
  }

  res.render('index', {dataView});
});

module.exports = router;
