const mostProducts = [
  {
    '$unwind': {
      'path': '$invoice'
    }
  }, {
    '$group': {
      '_id': '$invoice.product', 
      'numOrders': {
        '$sum': 1
      }
    }
  }, {
    '$sort': {
      'numOrders': -1
    }
  }, 
  {
    '$limit': 1
  }
];

const dailySales = [
  {
    '$group': {
      '_id': '$orderDate', 
      'salePerDay': {
        '$sum': '$totalSalePrice'
      }, 
      'orderDate': {
        '$first': '$orderDate'
      }
    }
  }
];

const profitPerProduct = [
  
];


const totalLiquid = [

];

module.exports = {
  mostProducts,
  dailySales,
  profitPerProduct,
  totalLiquid
};
