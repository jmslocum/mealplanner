var Menu = require('../models/menu');
var Meal = require('../models/meal');
var dateUtils = require('../utils/dateUtils');
var config = require('../config/config');

exports.getAllMenus = function(req, res, next) {
  Menu.find({})
    .populate('menu_items.meal')
    .populate('menu_items.sides')
    .exec(function(error, records) {
      if (error) {
        return errorHandler(res, 500, 'Internal database error');
      }

      req.result = {
        success : true, 
        menus : records
      };

      return next();
    });
}

exports.getMenuById = function(req, res, next) {
  Menu.findById(req.params.id).exec(function(error, record) {
    if (error) {
      return errorHandler(res, 500, 'Internal database error');
    }

    req.result = {
      success : true,
      menu : record
    };

    return next();
  });
}

exports.generateNextWeekMenu = function(req, res, next) {
  var menu = generateNextWeekMenu(req.meals.meals);
  
  if (!menu) {
    return errorHandler(res, 500, 'Unable to generate menu');
  }

  menu.save(function(error) {
    if (error){
      return errorHandler(res, 500, 'Internal datebase error');
    }

    req.result = {
      success : true,
      menu : menu
    }

    return next();
  });
}

exports.getCurrentFullMenu = function(req, res, next) {
  var now = new Date();
  var start = dateUtils.getStartOfTheWeek(now);
  var end = dateUtils.getEndOfTheWeek(now);

  Menu.findOne({'start_date' : {'$gte' : start}, 'end_date' : {'$lte' : end}})
    .populate('menu_items.meal')
    .populate('menu_items.sides')
    .exec(function(error, record) {
      if (error){
        return errorHandler(res, 500, 'Internal database error');
      }

      if (!record){
        return errorHandler(res, 404, 'No records match date criteria');
      }

      req.result = {
        success : true,
        menu : record
      };

      return next();
    });
}

/**
 *  Using the current date, Find the next stored menu object. But if there
 *  is not one, return 404. 
 */
exports.getNextFullMenu = function(req, res, next) {
  var now = new Date();
  var start = dateUtils.getStartOfNextWeek(now);
  var end = dateUtils.getEndOfNextWeek(now);

  Menu.findOne({'start_date' : {'$gte' : start}, 'end_date' : {'$lte' : end}})
    .populate('menu_items.meal')
    .populate('menu_items.sides')
    .exec(function(error, record) {
      if (error){
        return errorHandler(res, 500, 'Internal database error');
      }

      if (!record){
        return errorHandler(res, 404, 'No records match date criteria');
      }

      req.result = {
        success : true,
        menu : record
      };

      return next();
    });
}

exports.updateMenuMealItemsById = function(req, res, next) {
  Menu.findById(req.params.id).exec(function(error, record) {
    if (error){
      return errorHandler(res, 500, 'Internal database error');
    }

    if (!record){
      return errorHandler(res, 404, 'No records match id');
    }

    var menu = record;
    menu.date_modified = new Date();

    //TODO complete this function

    menu.save(function(error) {
      if (error) {
        return errorHandler(res, 500, 'Internal database error');
      }

      req.result = {
        success : true,
        menu : menu
      }
    }

  });
}

exports.deleteMenuById = function(req, res, next) {
  Menu.findByIdAndRemove(req.params.id).exec(function(error, record) {
    if (error) {
      return errorHandler(res, 500, 'Internal database error');
    }

    req.result = {
      success : true,
      menu : record
    }
  });
}

/**
 * Generate a week long menu using the current date and 
 * and a specified set of meals
 *
 * @return a Menu object with data populated
 */
function generateNextWeekMenu(meals) {
  var today = new Date();
  var start = dateUtils.getStartOfNextWeek(today);
  var end = dateUtils.getEndOfNextWeek(today);
  
  return generateMenuForDateRange(start, end, meals);
}

/**
 * Generate a week long menu for the current week, even if
 * we are already in it. 
 *
 * @return the Menu object with data populated
 */
function generateCurrentWeekMenu(meals) {
  var today = new Date();
  var start = dateUtils.getStartOfTheWeek(today);
  var end = dateUtils.getEndOfTheWeek(today);

  return generateMenuForDateRange(star, end, meals);
}

/**
 *  Generate a menu for the date range
 */
function generateMenuForDateRange(start, end, meals) {
  //initialize the menu object
  var weekMenu = new Menu();
  weekMenu.date_created = new Date();
  weekMenu.date_modified = weekMenu.date_created;
  weekMenu.start_date = start;
  weekMenu.end_date = end;
  weekMenu.days_covered = (end.getDate() - start.getDate()) + 1;
  weekMenu.menu_items = [];

  var sortedMeals = collectMeals(meals);

  //Generate the meal plan for the week
  var current = start;
  while(current.valueOf() <= end.valueOf()){
    var meal = selectMeal(current, sortedMeals);
    var sides = selectSides(meal, sortedMeals.sides);
    if (meal === null) {
      weekMenu.menu_items.push({
        date : current,
        eat_out : true,
        day : config.days[current.getDay()].name
      });
    }
    else {
      weekMenu.menu_items.push({
        date : current,
        meal : meal._id,
        sides : sides,
        day : config.days[current.getDay()].name
      });
    }

    current = dateUtils.tomorrow(current);
  }

  return weekMenu;
}

/**
 * Take all of the meals and group them into usable groups
 */
function collectMeals(meals) {
  var collection = {
    days : [[], [], [], [], [], [], []],
    difficulties : [[], [], [], []],
    sides : []
  };

  for (i = 0; i < meals.length; i++) {
    var meal = meals[i];
    if (meal.type === 'side'){
      collection.sides.push(meal);
    }
    else {
      collection.difficulties[meal.difficulty].push(meal);
      if (meal.perferred_days.length > 0){
        for (j = 0; j < meal.perferred_days.length; j++){
          var day = meal.perferred_days[j];
          collection.days[day].push(meal);
        }
      }
    }
  }

  return collection;
}

/**
 *  This will select a meal for the specified day based on the configuration criteria
 *  and some randomness. 
 */
function selectMeal(date, sortedMeals) {
  var day = date.getDay();
  var dayConfig = config.days[day];
  var difficulty = getDifficultyIndex(dayConfig.difficulty);
  var meal = null;

  //Should we just eat out?? 
  if (dayConfig.eat_out && meetsThreshold(config.selectionParameters.eat_out)){
    return null;
  }

  if (sortedMeals.days[day].length > 0){
    if (meetsThreshold(config.selectionParameters.use_perferred_days)) {
      var randomIndex = getRandomIndex(sortedMeals.days[day].length);
      meal = sortedMeals.days[day][randomIndex];
    }
    else {
      var randomIndex = getRandomIndex(sortedMeals.difficulties[difficulty].length);
      meal = sortedMeals.difficulties[difficulty][randomIndex];
    }
  }
  else {
    var randomIndex = getRandomIndex(sortedMeals.difficulties[difficulty].length);
    meal = sortedMeals.difficulties[difficulty][randomIndex];
  }

  return meal;
}

/**
 * This will select side dishes to go with our meal, it attempts to be as smart 
 * as it can to fulfill the required number of side dishes, while also not selecting
 * the same dish twice. If it cannot do this, it will simply select what it can and
 * return. If the meal or sides is null, then no sides are returned. 
 */
function selectSides(meal, sides) {
  if (!meal || !sides) {
    return [];
  }

  var sideDishes = [];
  var tries = 20;

  while(sideDishes.length < meal.number_of_sides && tries >= 0) {
    tries -= 1;
    if (meal.perferred_sides && meal.perferred_sides.length > 0 && 
        meetsThreshold(config.selectionParameters.use_perferred_side)) {
      let id = meal.perferred_sides[getRandomIndex(meal.perferred_sides.length)]._id;
      if (!sideDishes.includes(id)) {
        sideDishes.push(id);
      }
    }
    else if (sides.length > 0){
      let id = sides[getRandomIndex(sides.length)]._id;
      if (!sideDishes.includes(id)) {
        sideDishes.push(id);
      }
    }
  }

  return sideDishes;
}

/**
 * This will look up the difficuly index based on the string value for 
 * the difficulty. If non is found, it will just return easy
 */
function getDifficultyIndex(value) {
  for (i = 0; i < config.difficulties.length; i++) {
    if (config.difficulties[i].value === value) {
      return i;
    }
  }

  return 1;
}

/**
 * return true if we randomly select this option based on 
 * provided threshold value
 */
function meetsThreshold(t) {
  return (Math.random() <= t);
}

/**
 * Get a random number between 0 - max. 
 */
function getRandomIndex(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function errorHandler(res, statusCode, errorString) {
  res.statusCode = statusCode;
  response = {
    success : false,
    errors : [errorString]
  }

  return res.json(response);
}
