var mongoose = require('mongoose');

var daySchema = mongoose.Schema({
  name : String, 
  difficulty : String, 
  eat_out : Boolean
});

module.exports = mongoose.model('Day', daySchema);
