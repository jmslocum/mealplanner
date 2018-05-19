var mongoose = require('mongoose');

var imageSchema = mongoose.Schema({
  name : String,
  path : String,
  image_url : String,
});

module.exports = mongoose.model('Image', imageSchema);
