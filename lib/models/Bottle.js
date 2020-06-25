const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { totalLiquid } = require('./order-aggregations');

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

bottleSchema.statics.totalLiquid = async function() {
  return this.aggregate(totalLiquid);
};

module.exports = mongoose.model('Bottle', bottleSchema);
