const express = require('express');
const app = express();

app.use(express.json());

app.use('/api/v1/products', require('./routes/products'));
app.use('/api/v1/bottles', require('./routes/bottles'));
app.use('/api/v1/orders', require('./routes/orders'));

app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
