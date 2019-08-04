var Item = require('../models/inventoryItem');

/************************************************
 * Begin public middleware functions
 ************************************************/
exports.newItem = function(req, res, next) {
  let item = new Item({
    name: req.body.name,
    images: req.body.images,
    count: req.body.count
  });

  item.save((error) => {
    if (error) {
      return errorHandler(res, 500, 'Internal database error');
    }

    req.result = {
      success : true,
      item_id : item._id
    };

    return next();
  });
}

exports.getAll = function(req, res, next) {
  Item.find({})
    .sort({'name' : 'asc'})
    .populate('images')
    .exec((error, records) => {
      if (error) {
        return errorHandler(res, 500, 'Internal database error');
      }

      req.result = {
        success : true,
        item_count : records.length,
        items : records
      };

      return next();
    });
}

exports.getItemById = function(req, res, next) {
    return next();
}

exports.updateItemById = function(req, res, next) {
    return next();
}

exports.deleteItemById = function(req, res, next) {
    return next();
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

