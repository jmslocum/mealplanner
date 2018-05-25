var express = require('express');
var router = express.Router();

var mealController = require('../controllers/mealController');
var menuController = require('../controllers/menuController');
var dateFormat = require('dateformat');

router.get('/', menuController.getAllMenus, function(req, res) {
  var options = {
    menus : req.result.menus,
    dateformat : dateFormat
  };

  res.render('menu', options);
});

router.get('/edit/:id', menuController.getMenuById, function(req, res) {
   var options = {
    menu : req.result.menu,
    dateformat : dateFormat
  };

  res.render('edit-menu', options);
});

router.get('/new/week', 
    mealController.getAll, 
    menuController.generateNextWeekMenu, 
    function(req, res) {
  res.json(req.result);
});

router.get('/all', menuController.getAllMenus, function(req, res) {
  res.json(req.result);
});

router.get('/current', menuController.getCurrentFullMenu, function(req, res) {
  res.json(req.result);
});

router.get('/next', menuController.getNextFullMenu, function(req, res) {
  res.json(req.result);
});

router.delete('/:id', menuController.deleteMenuById, function(req, res) {
  res.json(req.result);
});

router.post('/:id/meal/:day', menuController.updateMenuMealItemsByDay, function(req, res) {
  res.json(req.result);
});

router.get('/:id', menuController.getMenuById, function(req, res) {
  res.json(req.result);
});

module.exports = router;
