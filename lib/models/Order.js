const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
  invoice: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    // in mL
    amount: {
      type: Number,
      required: true
    }
  }],
  // static method OR lookup mongoose middleware.
  totalSalePrice: {
    type: Number,
    required: true
  },
},

{ timestamps: {
  createdAt: 'orderDate',
  updatedAt: 'orderUpdate'
} });

// orderSchema.methods.calculateSingleItemTotal = async
orderSchema.statics.calculateSingleItemPrice = async function(orderedAmount, orderedItem) {
  const Product = this.model('Product');
  const item = await Product.findById(orderedItem);
  const itemPrice = item.salePricePerMl;
  return orderedAmount * itemPrice;
};

orderSchema.statics.calculateTotalPrice = async function(invoice) {
  const allOrderedItems = await Promise.all(
    invoice.map(item => {
      return this.calculateSingleItemPrice(item.amount, item.product);
    })  
  );
  return await allOrderedItems.reduce((totalPrice, singleItemPrice) => {
    return totalPrice + singleItemPrice;
  }, 0);
};
module.exports = mongoose.model('Order', orderSchema);
