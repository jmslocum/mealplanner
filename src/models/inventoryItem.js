var mongoose = require('mongoose');

var inventoryItemSchema = mongoose.Schema({
  name : String,
  images : [{type: mongoose.Schema.Types.ObjectId, ref : 'Image'}],
  count : {type: Number, default: 1}
});

module.exports = mongoose.model('InventoryItem', inventoryItemSchema);
