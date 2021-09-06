var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send(req.params);
  // res.render('index', { title: 'Three Stamps Data Site' });
});

module.exports = router;
