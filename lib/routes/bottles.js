const { Router } = require('express');
const Bottle = require('../models/Bottle');

module.exports = Router()
    .post('/', (req, res, next) => {
        Bottle
            .create(req.body)
            .then(bottle => res.send(bottle))
            .catch(next);
    })