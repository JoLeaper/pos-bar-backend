const { MongoMemoryServer } = require('mongodb-memory-server');
const mongod = new MongoMemoryServer();
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect');

const request = require('supertest');
const app = require('../lib/app');
const Product = require('../lib/models/Product');
const Bottle = require('../lib/models/Bottle');
const Order = require('../lib/models/Order');

describe('order routes', () => {
  beforeAll(async() => {
    const uri = await mongod.getUri();
    return connect(uri);
  });
  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });
  afterAll(async() => {
    await mongoose.connection.close();
    return mongod.stop();
  });

  it('creates a new order via post', async() => {
    const captainMorgan = await Product.create({
      name: 'Captain Morgan Spiced Rum',
      description: 'US Virgin Islands- Mixes aromas of marshmallow, light toffee and light spiced honey, leading into a molasses-centric flavor. Ideal for spicing up tropical cocktails or mixed with cola.',
      salePricePerMl: 0.02,
      purchasePricePerBottle: 14.99,
      size: 750
    });
    return request(app)
      .post('/api/v1/orders')
      .send([{
        product: captainMorgan._id,
        amount: 30
      }])
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          invoice: [{
            _id: expect.any(String),
            product: captainMorgan.id,
            amount: 30
          }],
          totalSalePrice: 0.6,
          orderDate: expect.any(String),
          orderUpdate: expect.any(String),
          __v: 0
        });
      });
  });

  it('verifies that the bottles are updated', async() => {
    const captainMorgan = await Product.create({
      name: 'Captain Morgan Spiced Rum',
      description: 'US Virgin Islands- Mixes aromas of marshmallow, light toffee and light spiced honey, leading into a molasses-centric flavor. Ideal for spicing up tropical cocktails or mixed with cola.',
      salePricePerMl: 0.02,
      purchasePricePerBottle: 14.99,
      size: 750
    });
    const bottle1 = await Bottle.create({
      product: captainMorgan._id,
      remainingLiquid: 300
    });
    const bottle2 = await Bottle.create({
      product: captainMorgan._id,
      remainingLiquid: captainMorgan.size
    });

    await request(app)
      .post('/api/v1/orders')
      .send([{
        product: captainMorgan._id,
        amount: 1000
      }])
      .then(res => res.body);

    return request(app)
      .get(`/api/v1/bottles/${bottle2._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: bottle2._id.toString(),
          product: {
            _id: captainMorgan._id.toString(),
            name: 'Captain Morgan Spiced Rum',
            description: 'US Virgin Islands- Mixes aromas of marshmallow, light toffee and light spiced honey, leading into a molasses-centric flavor. Ideal for spicing up tropical cocktails or mixed with cola.',
            salePricePerMl: 0.02,
            purchasePricePerBottle: 14.99,
            size: 750,
            __v: 0
          },
          remainingLiquid: 50,
          purchaseDate: expect.any(String),
          lastPourDate: expect.any(String),
          __v: 0
        });
      });
  });

  it('verifies that the bottles are deleted', async() => {
    const captainMorgan = await Product.create({
      name: 'Captain Morgan Spiced Rum',
      description: 'US Virgin Islands- Mixes aromas of marshmallow, light toffee and light spiced honey, leading into a molasses-centric flavor. Ideal for spicing up tropical cocktails or mixed with cola.',
      salePricePerMl: 0.02,
      purchasePricePerBottle: 14.99,
      size: 750
    });
    const bottle1 = await Bottle.create({
      product: captainMorgan._id,
      remainingLiquid: 300
    });
    const bottle2 = await Bottle.create({
      product: captainMorgan._id,
      remainingLiquid: captainMorgan.size
    });

    await request(app)
      .post('/api/v1/orders')
      .send([{
        product: captainMorgan._id,
        amount: 1000
      }])
      .then(res => res.body);

    return request(app)
      .get('/api/v1/bottles/')
      .then(res => {
        expect(res.body).toEqual([{
          _id: bottle2._id.toString(),
          product: captainMorgan._id.toString(),
        }]);
      });
  });
  it('gets all the orders', async() => {
    const captainMorgan = await Product.create({
      name: 'Captain Morgan Spiced Rum',
      description: 'US Virgin Islands- Mixes aromas of marshmallow, light toffee and light spiced honey, leading into a molasses-centric flavor. Ideal for spicing up tropical cocktails or mixed with cola.',
      salePricePerMl: 0.02,
      purchasePricePerBottle: 14.99,
      size: 750
    });

    Order.create({
      invoice: [{
        product: captainMorgan._id,
        amount: 1000
      }],
      totalSalePrice: 1000
    },
    {
      invoice: [{
        product: captainMorgan._id,
        amount: 1000
      }],
      totalSalePrice: 1000
    }
    );

    return request(app)
      .get('/api/v1/orders/')
      .then(res => {
        expect(res.body).toEqual([{
          _id: expect.any(String),
          orderDate: expect.any(String),
        },
        {
          _id: expect.any(String),
          orderDate: expect.any(String),
        }]);
      });
  });

});
