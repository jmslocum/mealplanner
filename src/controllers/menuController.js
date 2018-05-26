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
  Menu.findById(req.params.id)
    .populate('menu_items.meal')
    .populate('menu_items.sides')
    .exec(function(error, record) {
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
  var menu = generateNextWeekMenu(req.result.meals);
  
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

exports.getNextFullMenuForHomepage = function(req, res, next) {
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

      req.result = {
        success : true,
        menu : record
      };

      return next();
    });
}

exports.updateMenuMealItemsByDay = function(req, res, next) {
  Menu.findById(req.params.id).exec(function(error, record) {
    if (error){
      return errorHandler(res, 500, 'Internal database error');
    }

    if (!record){
      return errorHandler(res, 404, 'No records match id');
    }
    
    var day = req.params.day;
    var menu = record;
    menu.date_modified = new Date();

    //TODO Fix this hard-codeing by added pseudo meals. 
    if (req.body.mealId == '1000') {
      menu.menu_items[day].eat_out = true;
      menu.menu_items[day].meal = null;
      menu.menu_items[day].sides = [];
    }
    else {
      menu.menu_items[day].eat_out = false;
      menu.menu_items[day].meal = req.body.mealId; 
      menu.menu_items[day].sides = req.body.sideIds;
    }

    menu.save(function(error) {
      if (error) {
        return errorHandler(res, 500, 'Internal database error');
      }

      req.result = {
        success : true,
        menu : menu
      };

      return next();
    });
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

    return next();
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
  weekMenu.days_covered = getDaysBetweenDates(start, end) + 1;
  weekMenu.menu_items = [];

  var sortedMeals = collectMeals(meals);

  //Generate the meal plan for the week
  var current = start;
  var lastmeal = null;
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
    lastmeal = meal;
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
  var meal = null;

  //Should we just eat out?? 
  if (dayConfig.eat_out && meetsThreshold(config.selectionParameters.eat_out)){
    return null;
  }

  while(!meal) {
    var difficulty = getRandomIndex(getDifficultyIndex(dayConfig.difficulty)) + 1;
    
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
  
  var sidesCopy = JSON.parse(JSON.stringify(sides));
  var sideDishes = new Set();
  var remainingTries = 5;

  while(sideDishes.size < meal.number_of_sides && remainingTries > 0) {
    remainingTries -= 1;

    if (meal.perferred_sides && meal.perferred_sides.length > 0 && 
        meetsThreshold(config.selectionParameters.use_perferred_side)) {

      let id = meal.perferred_sides[getRandomIndex(meal.perferred_sides.length)]._id;

      sideDishes.add(id);
    }
    else if (sides.length > 0){
      let id = sides[getRandomIndex(sides.length)]._id;

      sideDishes.add(id);
    }
  }

  return Array.from(sideDishes);
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

function getDaysBetweenDates(startDate, endDate) {
  var diff = endDate - startDate;
  return (Math.floor(diff / (1000 * 60 * 60 * 24)));
}
