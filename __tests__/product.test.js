const { MongoMemoryServer } = require('mongodb-memory-server');
const mongod = new MongoMemoryServer();
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect');

const request = require('supertest');
const app = require('../lib/app');
const Product = require('../lib/models/Product');

describe('pos-bar-backend routes', () => {
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

    it('creates a new product via post', () => {
        return request(app)
            .post('/')
            .send({
                name: 'Captain Morgan Spiced Rum',
                description: 'US Virgin Islands- Mixes aromas of marshmallow, light toffee and light spiced honey, leading into a molasses-centric flavor. Ideal for spicing up tropical cocktails or mixed with cola.',
                salePricePerMl: 0.02,
                purchasePricePerBottle: 14.99,
                size: 750
            })
            .then(res => {
                expect(res.body).toEqual({
                    _id: expect.anything(),
                    name: 'Captain Morgan Spiced Rum',
                    description: 'US Virgin Islands- Mixes aromas of marshmallow, light toffee and light spiced honey, leading into a molasses-centric flavor. Ideal for spicing up tropical cocktails or mixed with cola.',
                    salePricePerMl: 0.02,
                    purchasePricePerBottle: 14.99,
                    size: 750,
                    __v: 0
                });
            });
    });

    // it('gets all the products we offer (id and name only)', () => {

    // });

    // it('gets a specific product by id with details', () => {

    // });

    // it('updates information about the product', () => {

    // });

    // it('deletes a product in case it is discontinued', () => {

    // });
});
