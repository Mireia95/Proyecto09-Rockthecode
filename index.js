//const fs = require('fs'); //para guardar los datos en json
require('dotenv').config();
const zapatosRouter = require('./src/api/routes/zapato');

const express = require('express');
const { connectDB } = require('./src/config/db');

const app = express();

connectDB();
app.use(express.json());

app.use('/api/v1', zapatosRouter);

app.use('*', (req, res, next) => {
  return res.status(404).json('Route not found');
});

app.listen(3000, () => {
  console.log('Servidor levantado en http://localhost:3000');
});
