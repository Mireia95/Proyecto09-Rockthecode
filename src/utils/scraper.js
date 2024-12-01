const puppeteer = require('puppeteer');
const fs = require('fs');

//creo función scraper que me eprmite abrir una pagina de una instancia del broser, y reocger datos
const scraper = async (url) => {
  //abro una instancia del navegador
  const browser = await puppeteer.launch({
    headless: false,
    ignoreHTTPSErrors: true
  });

  //abro una nueva pagina en la URL que le paso como parametro a la funcion
  const page = await browser.newPage();
  await page.goto(url);

  //seteo la resolución de la pantalla porque si no la veo pequeñisima
  await page.setViewport({
    width: 1000,
    height: 1024
  });

  //espero 10 segundos para que aparezca el pop up de ofertas.
  //si no aparece seguimos
  setTimeout(async () => {
    const popUp = await page.$('#wps-overlay-close-button');
    if (popUp) {
      page.click('#wps-overlay-close-button');
    } else {
      console.log('no hay pop up de descuento');
    }
  }, 10000);

  //cookies
  await page.waitForSelector('#onetrust-banner-sdk');
  const buttonCookie = await page.$('#onetrust-reject-all-handler');
  if (buttonCookie) {
    await buttonCookie.click();
  }

  //creo array vacío: añadiré luego cada producto con sus propriedades name, price y img
  const arrayProducts = [];

  //veo que los productos se cargan de 35 en 35. Creo variable para coger estos productos
  let dataProduct = 0;

  getProducts(dataProduct, arrayProducts, page, browser);
  //!await browser.close();
};

//funcion que se repite: guarda los datos de productos por cada pagina cargada
const getProducts = async (dataProduct, arrayProducts, page, browser) => {
  //recogo los divs con los productos
  const arrayDivsProducts = await page.$$(`[data-start="${dataProduct}"]`);
  console.log('ejecutando getProducts');

  //ciclo for para recoger los datos de todos los productos que tengo en arrayDivsProducts
  for (const product of arrayDivsProducts) {
    let image = await product.$eval('meta', (el) => el.content);
    /* uso meta para encontrar la URL de la imagen, porque la pagina ha usado la etiqueta <picture>, cargando asi una imagen según la resolución de la pantalla. Si cogia el src de la img no conseguía que se me guardase la ruta exacta. Por eso uso meta */

    //recojo el name del producto
    let name = await product.$eval(
      '.product-tile-title.product-tile__title.pdp-link.line-item-limited.line-item-limited--2',
      (el) => el.textContent
    );

    //recogo el price del producto
    //en la pagina algunos productos tienen descuentos, y el precio original no está, teniendo asi otra clase
    //con un ciclo if me aseguro de que el producto tenga precio original. Si devuelve null, entonces busco el precio con la oferta

    let priceOriginal; //original price

    let priceOffer; // price con oferta

    let price; //price final

    priceOriginal = await product.$(
      '.product-tile-price-standard.product-tile__price--standard'
    );

    if (!priceOriginal) {
      priceOffer = await product.$eval(
        '.product-tile-price-new.product-tile__price--new',
        (el) => el.textContent
      );

      price = priceOffer;
    } else {
      price = await priceOriginal.evaluate((el) => el.textContent);
    }

    const objectProduct = {
      name,
      image,
      price
    };

    arrayProducts.push(objectProduct);
  }

  //intento cargar mas zapatos
  //esta pagina no tiene paginas de productos, si no que carga mas productos al hacer scroll. He investigado de como hacerlo:

  //recogo height de mi pagina
  const mainProducts = await page.$eval(
    '.row.product-grid.no-gutters',
    (el) => el.scrollHeight
  );
  /* podemos pasar a page.evaluate una función y parametros que usará en esta funcion. En mi caso le pasaré como parametro el height de la pagina (viewportHeight)  */
  await page.evaluate(
    (mainProducts) => window.scrollBy(0, mainProducts),
    mainProducts
  );

  //los productos que se cargan tienen el data-start que va de 35 en 35. Ejemplo los primeros son 0, luego 35, luego 71, luego 107...
  if (dataProduct === 0) {
    dataProduct += 35;
  } else {
    dataProduct += 36;
  }

  console.log(dataProduct);

  //chequeo en un limite de 5 segundos, si estan los nuevos productos. si están seguimos. Si no quiere decir que hemos llegado al final de la pagina
  try {
    const newProduct = await page.waitForSelector(
      `[data-start="${dataProduct}"]`,
      { timeout: 10000 }
    );
  } catch (error) {
    console.log('ACABADO!!!');
    console.log(arrayProducts.length);
    //una vez recogidos todos los datos creo un archivo json usando "fs"
    fs.writeFile('./products.json', JSON.stringify(arrayProducts), (error) => {
      if (error) {
        console.log('Error en cargar los datos');
      } else {
        console.log('Datos pasados a json');
      }
    });
    //!browser.close();
    //!ERROR: si lo ejecuto peta. Porqué?
  }

  //si hay mas productos sigo cogiendo los datos y llamo de nuevo la funcion getProducts
  const newDivProducts = await page.$$(`[data-start="${dataProduct}"]`);

  if (newDivProducts.length > 0) {
    console.log(arrayProducts.length);
    getProducts(dataProduct, arrayProducts, page);
  }
};

module.exports = { scraper };
