const { Router } = require('express');
const Product = require('../models/Product');

module.exports = Router()
  .post('/', (req, res, next) => {
    Product
      .create(req.body)
      .then(product => res.send(product))
      .catch(next);
  })
  .get('/', (req, res, next) => {
    Product
      .find()
      .select({
        _id: true,
        name: true
      })
      .then(product => res.send(product))
      .catch(next);
  })
  .get('/:id', (req, res, next) => {
    Product
      .findById(req.params.id)
      .then(product => res.send(product))
      .catch(next);
  })
  .patch('/:id', (req, res, next) => {
    Product
      .findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then(product => res.send(product))
      .catch(next);
  })

  .delete('/:id', (req, res, next) => {
    Product
      .findByIdAndDelete(req.params.id)
      .then(product => res.send(product))
      .catch(next);
  });
