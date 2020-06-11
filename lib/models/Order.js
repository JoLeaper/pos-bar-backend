const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
  invoice: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    amount: {
      type: Number,
      required: true
    }
  }],
  totalSalePrice: {
    type: Number,
    required: true
  },
},

{ timestamps: {
  createdAt: 'orderDate',
  updatedAt: 'orderUpdate'
} });

module.exports = mongoose.model('Order', orderSchema);
