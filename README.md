# RTC - PROYECTO 09

## _WEB SCRAPING_

El proyecto utiliza la libreria puppeteer para hacer el web scraping: "npm run scraper" para ejecutar

Hacemos scraper de la web "https://eu.puma.com/es/es/mujer/calzado"

## Script utils/scraper.js :

La funcion "scraper" recoge todos los datos de los productos.
La funcion "getProducts" se encarga de recoger los datos y se repite dentro la función "scraper" por cada página de productos
Guardamos el precio, el nombre y la imagen del producto

Al recoger todos los datos, se genera un archivo llamado products.json, con todos los datos guardados

## Subir datos en una BBDD

El proyecto levanta un servidor usando la libreria Express. Me conecto a la base de datos de Mongo Atlas mediante mongoose.

Creo la coleccion "zapatos"

Subo los datos del archivo "products.json" a través de una petición POST, usando "insertMany"

El servidor está levandado en el puerto 3000.
La ruta para la coleccion es:

- http://localhost:3000/api/v1/

### Endpoints para la colección zapatos:

| PETICIÓN | NOMBRE             | RUTA            | DESCRIPCIÓN                                                    |
| -------- | ------------------ | --------------- | -------------------------------------------------------------- |
| GET      | getZapatos         | /zapatos        | devuelve todos los zapatos de mi coleccion.                    |
| POST     | postZapatosScraper | /zapatosScraper | para subir los datos del archivo products.json del web scraper |

**Mireia**
