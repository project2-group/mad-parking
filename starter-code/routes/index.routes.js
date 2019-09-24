const express = require('express');
const router  = express.Router();

router.use('/auth', require('./auth.routes'));
router.use('/search', require('./search.routes'));
router.use('/api', require('./api.routes'));
router.use('/admin', require('./routes/admin.routes'))

router.get('/', (req, res, next) => {
  const dataView = {
    title: 'madParking',
    header: 'home'
  }

  res.render('index', {dataView});
});

module.exports = router;
