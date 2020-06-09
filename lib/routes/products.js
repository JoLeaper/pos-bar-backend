const { Router } = require('express');
const Product = require('../models/Product');

module.exports = Router()
    .post('/', (req, res, next) => {
        Product
            .create(req.body)
            .then(product => res.send(product))
            .catch(next);
    });
