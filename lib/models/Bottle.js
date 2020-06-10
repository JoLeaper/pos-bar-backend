const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bottleSchema = new mongoose.Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product'
  },
  // in ml
  remainingLiquid: {
    type: Schema.Types.Number,
    ref: 'Product'
  },
  purchaseDate: {
    type: Date,
    required: true
  },
  lastPourDate: {
    type: Date,
    required: true
  }
});

module.exports = mongoose.model('Bottle', bottleSchema);
