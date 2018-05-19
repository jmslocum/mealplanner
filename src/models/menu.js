var mongoose = require('mongoose');

var menuSchema = mongoose.Schema({
  date_created : Date,
  date_modified : Date,
  start_date : Date, 
  end_date : Date,
  days_covered : Number,
  menu_items : [{
    day : String,
    date : Date,
    eat_out : Boolean,
    meal : {type : mongoose.Schema.Types.ObjectId, ref : 'Meal'},
    sides : [{type : mongoose.Schema.Types.ObjectId, ref : 'Meal'}]
  }]
});

module.exports = mongoose.model('Menu', menuSchema);
