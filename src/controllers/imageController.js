var Image = require('../models/image');

const IMAGE_PATH = './public/images/';

exports.getImages = function(req, res, next) {
  Image.find({}).exec(function(err, records) {
    if (err) {
      res.statusCode = 500;
      return res.json({'errors' : ['Database error']});
    }
    
    var images = [];
    for (let image of records) {
      var imageResponse = {
        image_id : image._id,
        image_url : image.image_url
      }

      images.push(imageResponse);
    } 

    req.images = {
      success : true,
      image_count : records.length,
      images : images
    }

    return next();
  });
}

exports.saveImage = function(req, res, next) {
  if (!req.files) {
    res.statusCode = 400;
    return res.json({'errors' : ['Bad request, there was no uploaded file']});
  }

  let imageFile = req.files.imageFile;
  imageFile.mv(IMAGE_PATH + imageFile.name, function(error) {
    if (error) {
      res.statusCode = 500;
      return res.json({'errors' : ['Unable to save image file to disk']});
    }
  });
  
  var image = new Image({
    name : imageFile.name,
    path : IMAGE_PATH + imageFile.name,
    image_url : '/images/' + imageFile.name
  });

  image.save(function(error) {
    if (error) {
      res.statusCode = 500;
      return res.json({'errors' : ['Database error']});
    }

    req.image = {
      success : true,
      image_id : image._id,
      image_url : image.image_url
    };

    return next();
  });
}

exports.getImageById = function(req, res, next) {
  Image.findById(req.params.image_id).exec(function(error, record) {
    if (error){
      res.statusCode = 500;
      return res.json({'errors' : ['Database error']});
    }

    if (!record) {
      res.statusCode = 404;
      return res.json({'errors' : ['Record not found']});
    }

    var image = {
      success : true,
      image_id : record._id,
      image_url : record.image_url
    }

    req.image = image;
    return next();
  });
}

exports.deleteImageById = function(req, res, next) {
  Image.findByIdAndRemove(req.params.id, function(error, record) {
    if (error) {
      return errorHandler(res, 500, 'Internal database error');
    }

    if (record) {
      fs.unlink(record.path, function(error) {
        if (error){
          return errorHandler(res, 500, 'Image removed from database, but unable to delete file asset');
        }

        req.image = {
          success : true,
          image_id : record._id
        };

        return next();
      });
    }
    else {
      return errorHandler(res, 404, 'Image record not found');
    }
  });
}

function errorHandler(res, statusCode, errorString) {
  res.statusCode = statusCode;
  response = {
    success : false,
    errors : [errorString]
  }

  return res.json(response);
}
