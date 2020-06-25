const { Router } = require('express');
const Bottle = require('../models/Bottle');
const Product = require('../models/Product');

module.exports = Router()
  .post('/', async(req, res, next) => {
    const foundProduct = await Product.findById(req.body.product);
    Bottle
      .create({ 
        product: foundProduct._id,
        remainingLiquid: foundProduct.size })
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
  .get('/totalLiquids', async(req, res, next) => {
    Bottle
      .totalLiquid()
      .then(totalLiquidRemaining => res.send(totalLiquidRemaining))
      .catch(next);
  })
  .get('/:id', (req, res, next) => {
    Bottle
      .findById(req.params.id)
      .populate('product')
      .then(bottles => res.send(bottles))
      .catch(next);
  })
  .patch('/:id', (req, res, next) => {
    Bottle
      .findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then(bottles => res.send(bottles))
      .catch(next);
  })
  .delete('/:id', (req, res, next) => {
    Bottle
      .findByIdAndDelete(req.params.id)
      .then(bottles => res.send(bottles))
      .catch(next);
  });
