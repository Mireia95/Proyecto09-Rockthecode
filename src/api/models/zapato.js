const mongoose = require('mongoose');

//creo schema
const schemaZapato = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: String, required: true }
  },
  {
    timestamps: true,
    collection: 'zapatos'
  }
);

//creo modelo
const Zapato = mongoose.model('zapatos', schemaZapato, 'zapatos');

//exporto modelo
module.exports = Zapato;
