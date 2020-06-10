const { Router } = require('express');
const Product = require('../models/Product');
const Bottle = require('../models/Bottle');

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
      .populate('bottles')
      .then(product => res.send(product.toJSON({ virtuals: true })))
      .catch(next);
  })


  .patch('/:id', (req, res, next) => {
    Product
      .findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then(product => res.send(product))
      .catch(next);
  })

  .delete('/:id', async(req, res, next) => {
    await Bottle.deleteMany({ product: req.params.id });

    Product
      .findByIdAndDelete(req.params.id)
      .then(product => res.send(product))
      .catch(next);
  });

// delete the product
// deleteMany, pass in an object with product in it. req.params.id
// find all bottles where product === req.params.id
