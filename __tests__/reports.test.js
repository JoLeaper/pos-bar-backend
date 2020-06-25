require('../data-helpers/data-helpers');
const request = require('supertest');
const app = require('../lib/app');

describe('aggregation routes', () => {
  it('finds the most ordered product', () => {
    return request(app).
      get('/api/v1/orders/mostProducts')
      .then(res => {
        expect(res.body[0]).toEqual({
          _id: expect.anything(),
          numOrders: expect.any(Number)
        });
        
      });
  });

  it.only('finds the daily sales', () => {
    return request(app).
      get('/api/v1/orders/dailySales')
      .then(res => {
        expect(res.body).toEqual({
          day: expect.anything(),
          saleAmount: expect.any(Number)
        });
      });
  });

  it('profit per product', () => {
    return request(app).
      get('/api/v1/orders/profitPerProduct')
      .then(res => {
        expect(res.body).toEqual({
          product: expect.anything(),
          profit: expect.any(Number)
        });
      });
  });

  it('total available liquid for each product', () => {
    return request(app).
      get('/api/v1/orders/totalLiquid')
      .then(res => {
        expect(res.body).toEqual({
          product: expect.anything(),
          totalLiquid: expect.any(Number)
        });
      });
  });
});

// the most ordered product
// daily sales
// profit per product
// the total available liquid for each product
