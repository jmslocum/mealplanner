'use strict'

const mongoose = require('mongoose');

const config = require('../src/config/config');
const databaseConfig = require('../src/config/database');
const Meal = require('../src/models/meal');

module.exports.up = function (next) {
  mongoose.connect(databaseConfig.url).catch(function(error) {
    console.error('Failed to open database connection to ' + databaseConfig.url);
    next(error);
  });

  var pseudoMeals = config.pseudoMeals;
  var promises = [];

  for (let i = 0; i < pseudoMeals.length; i++) {
    var meal = new Meal({
      _id : pseudoMeals[i]._id,
      name : pseudoMeals[i].name,
      description : pseudoMeals[i].description,
      type : pseudoMeals[i].type
    });

    promises.push(writeMealToDatabase(meal));
  }

  Promise.all(promises).then((meals) => {
    for (let i = 0; i < meals.length; i++) {
      console.log(`Added ${meals[i].name}, id: ${meals[i]._id}`);
    }

    next()
  }, (error) => {
    next(error);
  })
  .catch((error) => {
    next(error);
  });
}

module.exports.down = function (next) {
  mongoose.connect(databaseConfig.url).catch(function(error) {
    console.error('Failed to open database connection to ' + databaseConfig.url);
    next(error);
  });

  var pseudoMeals = config.pseudoMeals;
  var promises = [];
  
  for (let i = 0; i < pseudoMeals.length; i++) {
    promises.push(removeMealFromDatabase(pseudoMeals[i]._id)); 
  }

  Promise.all(promises).then((meals) => {
    for (let i = 0; i < meals.length; i++) {
      console.log(`Removed ${meals[i].name}, id: ${meals[i]._id}`);
    }

    next()
  }, (error) => {
    next(error);
  })
  .catch((error) => {
    next(error);
  });
}

function writeMealToDatabase(meal) {
  return new Promise(function(resolve, reject) {
    meal.save(function(error) {
      if (error) {
        reject(error);
      }

      resolve(meal);
    });
  });
}

function removeMealFromDatabase(meal_id) {
  return new Promise(function(resolve, reject) {
    Meal.findByIdAndRemove(meal_id, function(error, meal) {
      if (error){
        reject(error);
      }

      if (meal) {
        resolve(meal);
      }

      reject(new Error('Unable to find meal with id: ' + meal_id));
    });
  });
}
