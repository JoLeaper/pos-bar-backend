const { Router } = require('express');
const Order = require('../models/Order');

module.exports = Router()
  .post('/', async(req, res, next) => {
    const salePrice = await Order.calculateTotalPrice(req.body);

    Order.updateAndDeleteBottles(req.body)
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

  .get('/mostProducts', async(req, res, next) => {
    Order
      .mostProducts()
      .then(mostProductsOrdered => res.send(mostProductsOrdered))
      .catch(next);
  })
  .get('/dailySales', async(req, res, next) => {
    Order
      .dailySales()
      .then(dailyOrderSales => res.send(dailyOrderSales))
      .catch(next);
  })
  .get('/profitsPerProduct', async(req, res, next) => {
    Order
      .profitsPerProduct()
      .then(profitsPerProductOrdered => res.send(profitsPerProductOrdered))
      .catch(next);
  })
  .get('/totalLiquid', async(req, res, next) => {
    Order
      .mostProducts()
      .then(totalLiquidRemaining => res.send(totalLiquidRemaining))
      .catch(next);
  })
  
  .get('/:id', async(req, res, next) => {
    Order
      .findById(req.params.id)
      .then(order => res.send(order))
      .catch(next);
  });
