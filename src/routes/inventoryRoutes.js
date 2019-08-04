var express = require('express');
var router = express.Router();

var inventoryController = require('../controllers/inventoryController');

router.get('/new', (req, res) => {
  res.render('inventory', null);
});

router.get('/edit', (req, res) => {
  res.render('inventory', null);
});

//--------------------------------------------
//Begin AJAX endpoints
//--------------------------------------------
router.get('/all', inventoryController.getAll, (req, res) => {
  res.json(req.result);
});

router.post('/new', inventoryController.newItem, (req, res) => {
  res.json(req.result);
});

router.get('/:id', inventoryController.getItemById, (req, res) => {
  res.json(req.result);
});

router.post('/:id', inventoryController.updateItemById, (req, res) => {
  res.json(req.result);
});

router.delete('/:id', inventoryController.deleteItemById, (req, res) => {
  res.json(req.result);
});

module.exports = router;
