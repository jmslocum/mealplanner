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
      item_id : item._id,
      item : item
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
  Item.findById(req.params.id)
    .populate('images')
    .exec((error, record) => {
      if (error) {
        return errorHandler(res, 500, 'Internal database error');
      }

      req.result = {
        success : true,
        item_count : 1,
        item : record
      };

      return next();
    });
}

exports.updateItemById = function(req, res, next) {
  Item.findById(req.params.id)
    .exec((error, record) => {
      if (error) {
        return errorHandler(res, 500, 'Internal database error');
      }

      if (record) {
        //Only update count data
        record.count = req.body.count;

        record.save((error) => {
          if (error) {
            return errorHandler(res, 500, 'Internal database error');
          }

          req.result = {
            success : true,
            item_id : record._id,
            count : record.count
          };

          return next();
        });
      }
      else {
        return errorHandler(res, 404, 'Inventory item not found');
      }
    });
}

exports.deleteItemById = function(req, res, next) {
  Item.findByIdAndRemove(req.params.id, (error, record) => {
    if (error) {
      return errorHandler(res, 500, "Internal database error");
    }

    if (record) {
      req.result = {
        success : true,
        item_count : 1,
        item : record
      };

      return next();
    }
    else {
      return errorHandler(res, 404, 'Unable to find inventory item with id: ' + req.params.id);
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

