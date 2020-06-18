const { Router } = require('express');
const Bottle = require('../models/Bottle');
const Product = require('../models/Product');
const Order = require('../models/Order');

module.exports = Router()
  .post('/', async(req, res, next) => {
    const salePrice = await Order.calculateTotalPrice(req.body);
    Order.updateBottles(req.body[0].amount, req.body[0].product)
      .then(() => {
        return Order.create({ 
          invoice: req.body,
          totalSalePrice: salePrice });
      })
      .then(order => res.send(order))
      .catch(next);
  })
  .get('/', async(req, res, next) => {
    Order
      .find()
      .select({
        _id: true,
        orderDate: true
      })
      .then(order => res.send(order))
      .catch(next);
  })
  .get('/:id', async(req, res, next) => {
    Order
      .findById(req.params.id)
      .then(order => res.send(order))
      .catch(next);
  });
