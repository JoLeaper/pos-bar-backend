const { Router } = require('express');
const Bottle = require('../models/Bottle');

module.exports = Router()
  .post('/', (req, res, next) => {
    Bottle
      .create(req.body)
      .then(bottle => res.send(bottle))
      .catch(next);
  })
  .get('/', (req, res, next) => {
    Bottle
      .find()
      .select({
        _id: true,
        product: true
      })
      .then(bottles => res.send(bottles))
      .catch(next);
  })
  .get('/:id', (req, res, next) => {
    Bottle
      .findById(req.params.id)
      .populate('product')
      .then(bottles => res.send(bottles))
      .catch(next);
  });
