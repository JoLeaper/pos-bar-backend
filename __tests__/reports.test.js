require('../data-helpers/data-helpers');
const collection = require('./connect');
const request = require('supertest');
const app = require('../lib/app');

describe('aggregation routes', () => {
  it('finds the most ordered product', () => {
    return request(app).
      get('/api/v1/orders/mostProducts')
      .then(res => {
        expect(res.body).toEqual({
          product: expect.any(),
          numOrders: expect.anyNumber()
        });
        
      });
  });
  it('finds the daily sales', () => {
    return request(app).
      get('/api/v1/orders/mostProducts')
      .then(res => {
        expect(res.body).toEqual({
          day: expect.any(),
          saleAmount: expect.anyNumber()
        });
      });
  });
  it('profit per product', () => {
    return request(app).
      get('/api/v1/orders/mostProducts')
      .then(res => {
        expect(res.body).toEqual({
          product: expect.any(),
          profit: expect.any(Number)
        });
      });
  });

  it('total available liquid for each product', () => {
    return request(app).
      get('/api/v1/orders/mostProducts')
      .then(res => {
        expect(res.body).toEqual({
          product: expect.any(),
          totalLiquid: expect.any(Number)
        });
      });
  });
});

// the most ordered product
// daily sales
// profit per product
// the total available liquid for each product
