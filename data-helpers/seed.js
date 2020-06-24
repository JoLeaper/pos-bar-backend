const chance = require('chance').Chance();
const Product = require('../lib/models/Product');
const Bottle = require('../lib/models/Bottle');
const Order = require('../lib/models/Order');

module.exports = async({ products = 10, bottles = 50, orders = 20  } = {}) => {
  const productArray = await Promise.all([...Array(products)].map(async() => {
    return Product.create({
      name: chance.profession() + ' ' + chance.last() + ' Drink',  
      description: chance.paragraph({ sentences: 1 }),
      salePricePerMl: chance.floating({ fixed: 2 }),
      purchasePricePerBottle: chance.floating({ fixed: 2 }),
      size: chance.natural({ min: 1 })
    });
  }));

  await Promise.all([...Array(bottles)].map(async() => {
    const product = chance.pickone(productArray);
    return Bottle.create({
      product: product.id,
      remainingLiquid: chance.natural({ min: 1, max: product.size }),
      purchaseDate: chance.date(),
      lastPourDate: chance.date()
    });
  }));

  await Promise.all([...Array(orders)].map(async() => {
    const amount = chance.natural({ min: 1, max: 5 });
    return Order.create({
      invoice: chance.pickset(productArray, amount).map(product => {
        return {
          product: product.id,
          amount: chance.natural({ min: 1, max: 1000 })
        };
      }),
      totalSalePrice: chance.floating({ fixed: 2 }),
    });
  }));
};
