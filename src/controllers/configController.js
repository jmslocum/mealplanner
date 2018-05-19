var config = require('../config/config');

exports.getDays = function(req, res, next) {
  req.days = config.days; 
  return next();
}

exports.getDifficulties = function(req, res, next) {
  req.difficulties = config.difficulties;
  return next();
}

exports.getMealTypes = function(req, res, next) {
  req.mealTypes = config.mealTypes;
  return next();
}

exports.getAllConfigs = function(req, res, next) {
  req.config = {
    days : config.days,
    difficulties : config.difficulties,
    mealTypes : config.mealTypes
  }
  return next();
}
