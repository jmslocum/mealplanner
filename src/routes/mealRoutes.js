var express = require('express');
var router = express.Router();

var mealController = require('../controllers/mealController');

router.get('/new', function(req, res) { 
  var options = {
    showCancelButton : false
  };

  res.render('meal', options);
});

router.get('/edit', mealController.getAll, function(req, res) {
  var options = {
    difficultyNames : ['Freezer', 'Easy', 'Medium', 'Hard'],
    showCancelButton : true,
    meals : req.result.meals
  };

  res.render('edit-meal', options);
});

//--------------------------------------------
//Begin AJAX endpoints
//--------------------------------------------
router.post('/new', mealController.newMeal, function(req, res) {
  res.json(req.result);
});

router.get('/all', mealController.getAll, function(req, res) {
  res.json(req.result);
});

router.get('/meals', mealController.getAllMeals, function(req, res) {
  res.json(req.result);
});

router.get('/sides', mealController.getAllSides, function(req, res) {
  res.json(req.result);
});

router.get('/pseudo', mealController.getAllPseudoMeals, function(req, res) {
  res.json(req.result);
});

router.get('/:id', mealController.getMealById, function(req, res) {
  res.json(req.result);
});

router.post('/:id', mealController.updateMealById, function(req, res) {
  res.json(req.result);
});

router.delete('/:id', mealController.deleteMealById, function(req, res) {
  res.json(req.result);
});

module.exports = router;
