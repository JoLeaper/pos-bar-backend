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

// working functions
orderSchema.statics.findAndSortBottles = async function(orderedItem) {
  const bottles = await Bottle.find({ product: orderedItem });
  return bottles.sort((a, b) => (a.remainingLiquid > b.remainingLiquid) ? 1 : -1);
};

orderSchema.statics.updateBottle = async function(bottleId, newAmount) {
  return Bottle.findByIdAndUpdate(bottleId, { remainingLiquid: newAmount }, { new: true });
};

orderSchema.statics.deleteEmptyBottle = async function(bottleId) {
  return Bottle.findByIdAndDelete(bottleId);
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

orderSchema.statics.updateAndDeleteBottles = async function(invoice) {
  // this is where the bottles that need to be updated are stored
  const bottlesToUpdate = [];
  const bottlesToDelete = [];

  // establish if updating needs to happen
  let needsUpdate = false;
  let amountLeftToPour;

  // going through each item recorded on the invoice
  invoice.forEach(async orderedItem => {
    // getting all the bottles for that orderedItem
    const sortedBottles = await this.findAndSortBottles(orderedItem.product);

    // establish how much amount of the drink needs to be poured
    amountLeftToPour = orderedItem.amount;

    // go through each of the sorted bottles 
    sortedBottles.forEach(bottle => {
      // determine if the bottle should be updated or deleted
      if(bottle.remainingLiquid >= amountLeftToPour) {
        const newBottleAmount = bottle.remainingLiquid - amountLeftToPour;
        bottlesToUpdate.push({
          id: bottle._id,
          newBottleAmount: newBottleAmount
        });
        needsUpdate = true;
      } else {
        amountLeftToPour -= bottle.remainingLiquid;
        bottlesToDelete.push({ id: bottle._id });
      }
    });

    if(needsUpdate) {
      bottlesToUpdate.map(async bottle => await this.updateBottle(bottle.id, bottle.newBottleAmount));
      bottlesToDelete.map(async bottle => await this.deleteEmptyBottle(bottle.id));
    } else {
      const error = new Error('not enough supply');
      error.status = 400;
      throw error;
    }
  });
};

module.exports = mongoose.model('Order', orderSchema);
