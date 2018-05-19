var mongoose = require('mongoose');

var mealSchema = mongoose.Schema({
  name : String,
  description : String,
  type : String,
  images : [{type: mongoose.Schema.Types.ObjectId, ref : 'Image'}],
  difficulty : Number, 
  perferred_sides : [{type : mongoose.Schema.Types.ObjectId, ref : 'Meal'}],
  number_of_sides : Number,
  perferred_days : [Number]
});

module.exports = mongoose.model('Meal', mealSchema);
