var express = require('express');
var router = express.Router();
var imageController = require('../controllers/imageController');

router.get('/', imageController.getImages, function(req, res) {
  res.json(req.images);
});

router.get('/:image_id', imageController.getImageById, function(req, res) {
  res.json(req.image);
});

router.post('/upload', imageController.saveImage, function(req, res) {
  res.json(req.image);
});

module.exports = router;
