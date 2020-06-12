const { Router } = require('express');
const Bottle = require('../models/Bottle');
const Product = require('../models/Product');
const Order = require('../models/Order');

module.exports = Router()
  .post('/', async(req, res, next) => {
    // console.log('0000000000000000000000000000000000', req.body, '0000000000000000000000000000');
    const salePrice = await Order.calculateTotalPrice(req.body);
    Order
      .create({ 
        invoice: req.body,
        totalSalePrice: salePrice })
      .then(order => res.send(order))
      .catch(next);
  });
