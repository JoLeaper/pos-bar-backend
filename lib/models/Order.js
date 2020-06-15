const mongoose = require('mongoose');
const Bottle = require('../models/Bottle');
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

orderSchema.statics.findAndSortBottles = async function(orderedItem) {
  const Bottle = this.model('Bottle');
  const bottles = await Bottle.find({ product: orderedItem });
  return bottles.sort((a, b) => (a.remainingLiquid > b.remainingLiquid) ? 1 : -1);
};

orderSchema.statics.deleteEmptyBottle = async function(bottleId) {
  await Bottle.findByIdAndDelete(bottleId);
};

orderSchema.statics.updateBottle = async function(newAmount, bottleId) {
  await Bottle.findByIdAndUpdate(bottleId, { remainingLiquid: newAmount }, { new: true });
};

orderSchema.statics.updateBottles = async function(orderedAmount, orderedItem) {
  const sortedBottles = await this.findAndSortBottles(orderedItem);

  let amountLeft = orderedAmount;

  sortedBottles.forEach(bottle => {
    if(bottle.remainingLiquid - amountLeft > 0) {
      this.updateBottle((bottle.remainingLiquid - amountLeft), bottle._id);
      return;
    } else {
      this.deleteEmptyBottle(bottle._id);
      amountLeft += -bottle.remainingLiquid; 
    }
  });

};

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
