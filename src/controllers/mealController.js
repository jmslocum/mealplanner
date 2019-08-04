var Meal = require('../models/meal');

/************************************************
 * Begin public middleware functions
 ************************************************/
exports.newMeal = function(req, res, next) {
  var meal = new Meal({
    name : req.body.name,
    description : req.body.description,
    type : req.body.type,
    images : req.body.images,
    difficulty : req.body.difficulty,
    perferred_sides : req.body.perferredSides,
    number_of_sides : req.body.numberOfSides,
    perferred_days : req.body.perferredDays
  });

  meal.save(function(error) {
    if (error) {
      return errorHandler(res, 500, 'Internal database error');
    }
    
    req.result = {
      success : true,
      meal_id : meal._id
    };

    return next();
  });
}

exports.getAll = function(req, res, next) {
  Meal.find({})
    .sort({'name' : 'asc'})
    .populate('images')
    .populate('perferred_sides')
    .exec(function(error, records) {
      if (error) {
        return errorHandler(res, 500, 'Internal database error');
      }

      var meals = [];
      for (let record of records) {
        meals.push(record);
      }

      req.result = {
        success : true,
        meal_count : records.length,
        meals : meals
      };

      return next();
    });
}

exports.getAllMeals = function(req, res, next) {
  Meal.find({'type' : 'meal'})
    .sort({'name' : 'asc'})
    .populate('images')
    .exec(function(error, records) {
      if(error) {
        return errorHandler(res, 500, 'Internal database error');
      }

      req.result = {
        success : true, 
        meal_count : records.length,
        meals : records
      };

      return next();
    });
}

exports.getAllSides = function(req, res, next) {
  Meal.find({'type' : 'side'})
    .sort({'name' : 'asc'})
    .populate('images')
    .exec(function(error, records) {
      if(error) {
        return errorHandler(res, 500, 'Internal database error');
      }

      req.result = {
        success : true, 
        meal_count : records.length,
        meals : records
      };

      return next();
    });
}

exports.getAllPseudoMeals = function(req, res, next) {
  Meal.find({'type': 'pseudo'})
    .sort({'name' : 'asc'})
    .populate('images')
    .exec(function(error, records) {
      if (error) {
        return errorHandler(res, 500, 'Internal database error');
      }

      req.result = {
        success : true, 
        meal_count : records.length,
        meals : records
      };

      return next();
    });
}

exports.getAllMealsAndSides = function(req, res, next) {
  Meal.find({})
    .sort('type')
    .populate('images')
    .exec(function(error, records) {
      var meals = [];
      var sides = [];

      if (error) {
        return errorHandler(res, 500, 'Internal database error');
      }

      for (let record of records) {
        if (record.type === 'meal') {
          meals.push(record);
        }
        else if (record.type === 'side') {
          sides.push(record);
        }
      }

      req.result = {
        success : true,
        meal_count : records.length,
        meals : meals,
        sides : sides
      };

      return next();
    });
}

exports.getMealById = function(req, res, next) {
  Meal.findById(req.params.id)
    .populate('images')
    .populate('perferred_sides')
    .exec(function(error, record) {
      if(error) {
        return errorHandler(res, 500, 'Internal database error');
      }

      req.result = {
        success : true,
        meal_count : 1,
        meal : record
      };

      return next();
    });
}

exports.updateMealById = function(req, res, next) {
  Meal.findById(req.params.id).exec(function(error, meal) {
    if (error) {
      return errorHandler(res, 500, 'Internal database error');
    }

    if (meal){
      meal.name = req.body.name;
      meal.description = req.body.description;
      meal.type = req.body.type;
      meal.images = req.body.images;
      meal.difficulty = req.body.difficulty;
      meal.perferred_sides = req.body.perferredSides;
      meal.number_of_sides = req.body.numberOfSides;
      meal.perferred_days = req.body.perferredDays;

      meal.save(function(error) {
        if (error) {
          console.log(error);
          return errorHandler(res, 500, 'Internal database error');
        }

        req.result = {
          success : true,
          meal_id : meal._id
        };

        return next();
      });
    }
    else {
      return errorHandler(res, 404, 'Meal not found');
    }
  });
}

exports.deleteMealById = function(req, res, next) {
  Meal.findByIdAndRemove(req.params.id, function(error, meal) {
    if (error) {
      return errorHandler(res, 500, 'Internal database error');
    }

    if (meal) {
      //TODO - delete all of the images
      if (meal.type === 'side') {
        Meal.find({'perferred_sides' : meal._id}, function(error, meals) {
          for (let m of meals) {
            m.perferred_sides = removeMealIdFromSidesArray(m.perferred_sides, meal._id);  
            m.save();
          }
        });
      }

      req.result = {
        success : true,
        meal_count : 1,
        meal : meal
      };

      return next();
    }
    else {
      return errorHandler(res, 404, 'Unable to find meal with id: ' + req.params.id);
    }
  });
}

/***************************************************************
 * Begin the private helper funcitons, these functions assist the
 * other controller functions
 ***************************************************************/
function errorHandler(res, statusCode, errorString) {
  res.statusCode = statusCode;
  result = {
    success : false,
    errors : [errorString]
  }

  return res.json(result);
}

function removeMealIdFromSidesArray(sides, id) {
  var newSides = [];

  for (var i = 0; i < sides.length; i++){
    if (sides[i] !== id){
      newSides.push(sides[i]);
    }
  }

  return newSides;
}
