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
            .post('/api/v1/products')
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

    it('gets all the products we offer (id and name only)', () => {
        return Product.create({
            name: 'Captain Morgan Spiced Rum',
            description: 'US Virgin Islands- Mixes aromas of marshmallow, light toffee and light spiced honey, leading into a molasses-centric flavor. Ideal for spicing up tropical cocktails or mixed with cola.',
            salePricePerMl: 0.02,
            purchasePricePerBottle: 14.99,
            size: 750,
        })
            .then(() => request(app).get('/api/v1/products'))
            .then(res => {
                expect(res.body).toEqual([{
                    _id: expect.anything(),
                    name: 'Captain Morgan Spiced Rum'
                }]);
            });
    });

    it('gets a specific product by id with details', async() => {
        const captainMorgan = await Product.create({
            name: 'Captain Morgan Spiced Rum',
            description: 'US Virgin Islands- Mixes aromas of marshmallow, light toffee and light spiced honey, leading into a molasses-centric flavor. Ideal for spicing up tropical cocktails or mixed with cola.',
            salePricePerMl: 0.02,
            purchasePricePerBottle: 14.99,
            size: 750,
        });
        return request(app).get(`/api/v1/products/${captainMorgan._id}`)
            .then(res => {
                expect(res.body).toEqual([{
                    _id: captainMorgan._id,
                    name: 'Captain Morgan Spiced Rum',
                    description: 'US Virgin Islands- Mixes aromas of marshmallow, light toffee and light spiced honey, leading into a molasses-centric flavor. Ideal for spicing up tropical cocktails or mixed with cola.',
                    salePricePerMl: 0.02,
                    purchasePricePerBottle: 14.99,
                    size: 750,
                    __v: 0
                }]);
            });

    });

    // it('updates information about the product', () => {

    // });

    // it('deletes a product in case it is discontinued', () => {

    // });
});
