const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    maxlength: 200
  },
  // measured in USD
  salePricePerMl: {
    type: Number,
    required: true,
  },
  // measured in USD
  purchasePricePerBottle: {
    type: Number,
    required: true
  },
  // measured in ML
  size: {
    type: Number,
    required: true
  },

});

productSchema.virtual('bottles', {
  ref: 'Bottle',
  localField: '_id',
  foreignField: 'product'
});

productSchema.virtual('orders', {
  ref: 'Order',
  localField: '_id',
  foreignField: 'product'
});

module.exports = mongoose.model('Product', productSchema);
