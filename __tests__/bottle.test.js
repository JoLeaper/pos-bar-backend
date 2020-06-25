const { MongoMemoryServer } = require('mongodb-memory-server');
const mongod = new MongoMemoryServer();
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect');

const request = require('supertest');
const app = require('../lib/app');
const Product = require('../lib/models/Product');
const Bottle = require('../lib/models/Bottle');

describe('product routes', () => {
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

  it('creates a new bottle via post', async() => {
    const captainMorgan = await Product.create({
      name: 'Captain Morgan Spiced Rum',
      description: 'US Virgin Islands- Mixes aromas of marshmallow, light toffee and light spiced honey, leading into a molasses-centric flavor. Ideal for spicing up tropical cocktails or mixed with cola.',
      salePricePerMl: 0.02,
      purchasePricePerBottle: 14.99,
      size: 750
    });
    return request(app)
      .post('/api/v1/bottles')
      .send({
        product: captainMorgan._id
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          product: captainMorgan._id.toString(),
          remainingLiquid: captainMorgan.size,
          purchaseDate: expect.any(String),
          lastPourDate: expect.any(String),
          __v: 0
        });
      });
  });

  it('gets all the available bottles', async() => {
    const captainMorgan = await Product.create({
      name: 'Captain Morgan Spiced Rum',
      description: 'US Virgin Islands- Mixes aromas of marshmallow, light toffee and light spiced honey, leading into a molasses-centric flavor. Ideal for spicing up tropical cocktails or mixed with cola.',
      salePricePerMl: 0.02,
      purchasePricePerBottle: 14.99,
      size: 750
    });

    const jackDaniels = await Product.create({
      name: 'Jack Daniels',
      description: 'idk anything about alcohol',
      salePricePerMl: 0.02,
      purchasePricePerBottle: 19.99,
      size: 1000
    });

    await Bottle.create({
      product: captainMorgan._id,
      remainingLiquid: captainMorgan.size,
    },
    {
      product: captainMorgan._id,
      remainingLiquid: captainMorgan.size,
    },
    {
      product: jackDaniels._id,
      remainingLiquid: jackDaniels.size,
    },
    );
    return request(app)
      .get('/api/v1/bottles')
      .then(res => {
        expect(res.body).toEqual([{
          _id: expect.anything(),
          product: captainMorgan._id.toString(),
        },
        {
          _id: expect.anything(),
          product: captainMorgan._id.toString(),
        },
        {
          _id: expect.anything(),
          product: jackDaniels._id.toString(),
        }]);
      });
  });

  it('gets the details of a bottle by populating product information', async() => {
    const captainMorgan = await Product.create({
      name: 'Captain Morgan Spiced Rum',
      description: 'US Virgin Islands- Mixes aromas of marshmallow, light toffee and light spiced honey, leading into a molasses-centric flavor. Ideal for spicing up tropical cocktails or mixed with cola.',
      salePricePerMl: 0.02,
      purchasePricePerBottle: 14.99,
      size: 750
    });

    const bottle1 = await Bottle.create({
      product: captainMorgan._id,
      remainingLiquid: captainMorgan.size,
      purchaseDate: new Date(),
      lastPourDate: new Date()
    },
    );
    return request(app)
      .get(`/api/v1/bottles/${bottle1._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          product: {
            _id: captainMorgan._id.toString(),
            name: 'Captain Morgan Spiced Rum',
            description: 'US Virgin Islands- Mixes aromas of marshmallow, light toffee and light spiced honey, leading into a molasses-centric flavor. Ideal for spicing up tropical cocktails or mixed with cola.',
            salePricePerMl: 0.02,
            purchasePricePerBottle: 14.99,
            size: 750,
            __v: 0
          },
          remainingLiquid: bottle1.remainingLiquid,
          purchaseDate: expect.any(String),
          lastPourDate: expect.any(String),
          __v: 0
        });
      });
  });

  it('updates how much liquid is left in the bottle', async() => {
    const captainMorgan = await Product.create({
      name: 'Captain Morgan Spiced Rum',
      description: 'US Virgin Islands- Mixes aromas of marshmallow, light toffee and light spiced honey, leading into a molasses-centric flavor. Ideal for spicing up tropical cocktails or mixed with cola.',
      salePricePerMl: 0.02,
      purchasePricePerBottle: 14.99,
      size: 750
    });

    const bottle1 = await Bottle.create({
      product: captainMorgan._id,
      remainingLiquid: captainMorgan.size,
      purchaseDate: new Date(),
      lastPourDate: new Date()
    },
    );

    return request(app)
      .patch(`/api/v1/bottles/${bottle1._id}`)
      .send({ remainingLiquid: 200 })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          product: captainMorgan._id.toString(),
          remainingLiquid: 200,
          purchaseDate: expect.any(String),
          lastPourDate: expect.any(String),
          __v: 0
        });
      });
  });

  it('deletes a bottle from the inventory', async() => {
    const captainMorgan = await Product.create({
      name: 'Captain Morgan Spiced Rum',
      description: 'US Virgin Islands- Mixes aromas of marshmallow, light toffee and light spiced honey, leading into a molasses-centric flavor. Ideal for spicing up tropical cocktails or mixed with cola.',
      salePricePerMl: 0.02,
      purchasePricePerBottle: 14.99,
      size: 750
    });

    const bottle1 = await Bottle.create({
      product: captainMorgan._id,
      remainingLiquid: captainMorgan.size,
      purchaseDate: new Date(),
      lastPourDate: new Date()
    },
    );

    return request(app)
      .delete(`/api/v1/bottles/${bottle1._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          product: captainMorgan._id.toString(),
          remainingLiquid: expect.any(Number),
          purchaseDate: expect.any(String),
          lastPourDate: expect.any(String),
          __v: 0
        });
      });
  });
});
