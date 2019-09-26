const express = require('express');
const router  = express.Router();

router.use('/auth', require('./auth.routes'));
router.use('/search', require('./search.routes'));
router.use('/api', require('./api.routes'));
router.use('/admin', require('./admin.routes'))
router.use('/profile', require('./profile.routes'))

router.get('/', (req, res, next) => {
  const dataView = {
    title: 'madParking',
    header: 'home',
    home: true
  }

  res.render('index', {dataView, user: req.user});
});

module.exports = router;
