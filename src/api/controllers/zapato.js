//!const zapatos = require('../../../products.json'); //me traigo el archivo con los datos de los zapatos

const Zapato = require('../models/zapato');

//POST Zapatos from json
const postZapatosScraper = async (req, res, next) => {
  try {
    console.log('hola');
    console.log(zapatos);
    /* const insertZapatos = {
      products: JSON.parse(zapatos)
    }; */
    await Zapato.insertMany(zapatos);
    console.log('heyyy');
  } catch (error) {
    return res.status(400).json(`No se han podido subir los datos ${error}`);
  }
};

//get zapatos
const getZapatos = async (req, res, next) => {
  try {
    const allZapatos = await Zapato.find();
    return res.status(200).json(allZapatos);
  } catch (error) {
    return res.status(400).json(`No se han podido subir los datos ${error}`);
  }
};

module.exports = { postZapatosScraper, getZapatos };
