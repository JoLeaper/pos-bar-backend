const { Router } = require('express');
const Bottle = require('../models/Bottle');
const Product = require('../models/Product');
const Order = require('../models/Order');

module.exports = Router()
  .post('/', async(req, res, next) => {
    const salePrice = await Order.calculateTotalPrice(req.body);
    await Order.updateBottles(req.body[0].amount, req.body[0].product);
    
    Order
      .create({ 
        invoice: req.body,
        totalSalePrice: salePrice })
      .then(order => res.send(order))
      .catch(next);
  })
  .get('/', async(req, res, next) => {
    Order
      .find()
      .select({ 
        _id: true, 
        createdAt: true })
      .then(order => res.send(order))
      .catch(next);
  });
