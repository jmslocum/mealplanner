var express = require('express');
var router = express.Router();

const menuController = require('../controllers/menuController');

module.exports = router;

router.get('/', menuController.getNextFullMenuForHomepage, function(req, res) {
  var options = {
    menu : req.result.menu,
    dateformat : require('dateformat')
  }
  res.render('index', options);
});
