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
