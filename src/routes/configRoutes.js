var express = require('express');
var router = express.Router();
var configController = require('../controllers/configController');

router.get('/days', configController.getDays, function(req, res) {
  res.json(req.days);
});

router.get('/difficulties', configController.getDifficulties, function(req, res) {
  res.json(req.difficulties);
});

router.get('/mealtypes', configController.getMealTypes, function(req, res) {
  res.json(req.mealTypes);
});

router.get('/all', configController.getAllConfigs, function(req, res) {
  res.json(req.config);
});

module.exports = router;
