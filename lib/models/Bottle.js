const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bottleSchema = new mongoose.Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product'
  },
  // in ml
  remainingLiquid: {
    type: Number,
    required: true
  }
},

{ timestamps: {
  createdAt: 'purchaseDate',
  updatedAt: 'lastPourDate'
} });

module.exports = mongoose.model('Bottle', bottleSchema);
