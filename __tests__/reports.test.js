require('../data-helpers/data-helpers');
const collection = require('./connect');
const request = require('supertest');
const app = require('../lib/app');

describe('aggregation routes', () => {
  it('finds the most ordered product', () => {
    return collection().aggregate(mostProducts)
      .toArray()
      .then(([{ product, numOrders }]) => {
        expect(product).toEqual(expect.any());
        expect(numOrders).toEqual(expect.any(Number));
      });
  });
  it('finds the daily sales', () => {
    return collection().aggregate(dailySales)
      .toArray()
      .then(([{ day, salesAmount }]) => {
        expect(day).toEqual(expect.any());
        expect(salesAmount).toEqual(expect.any(Number));
      });
  });
  it('profit per product', () => {
    return collection().aggregate(profitPerProduct)
      .toArray()
      .then(([{ product, profit }]) => {
        expect(product).toEqual(expect.any());
        expect(profit).toEqual(expect.any(Number));
      });
  });
  it('total available liquid for each product', () => {
    return collection().aggregate(totalLiquid)
      .toArray()
      .then(([{ product, totalLiquid }]) => {
        expect(product).toEqual(expect.any());
        expect(totalLiquid).toEqual(expect.any(Number));
      });
  });
  
});

// the most ordered product
// daily sales
// profit per product
// the total available liquid for each product
