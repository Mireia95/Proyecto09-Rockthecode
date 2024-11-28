const { postZapatosScraper, getZapatos } = require('../controllers/zapato');

const zapatosRouter = require('express').Router();

zapatosRouter.post('/zapatosScraper', postZapatosScraper);
zapatosRouter.get('/zapatos', getZapatos);

module.exports = zapatosRouter;
