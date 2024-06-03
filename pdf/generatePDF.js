import puppeteer from "puppeteer";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtener el nombre de archivo y directorio en módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function generatePdf({ tipoDocumento,numeroDocumento, captchaText }) {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: {
            width: 1366,
            height: 768,
            deviceScaleFactor: 1,
            isMobile: true,
            hasTouch: false,
            isLandscape: false,
        },
        timeout: 120000,
        dumpio: true
    });
    const page = await browser.newPage();
    
    await page.goto('https://www.adres.gov.co/consulte-su-eps');
    
    // Esperar a que el iframe esté disponible
    await page.waitForSelector('iframe');
    
    // Obtener el contenido del iframe
    const elementHandle = await page.$('iframe');
    const frame = await elementHandle.contentFrame();
    
    // Esperar a que el selector esté disponible dentro del iframe
    await frame.waitForSelector('select[name="tipoDoc"]');
    
    // Hacer clic en el selector dentro del iframe
    await frame.click('select[name="tipoDoc"]');

    // Seleccionar una opción del dropdown
    await frame.select('select[name="tipoDoc"]', tipoDocumento); // Por ejemplo, selecciona "Tarjeta de Identidad"
    
    // Esperar a que los inputs estén disponibles dentro del iframe
    await frame.waitForSelector('input[name="txtNumDoc"]');
    await new Promise(r => setTimeout(r, 5000));
    
    console.log(numeroDocumento);
    // Ingresar el número de documento en el input correspondiente
    await frame.type('input[name="txtNumDoc"]', numeroDocumento);
    await new Promise(r => setTimeout(r, 5000));
    
    await frame.waitForSelector('input[name="Capcha$CaptchaTextBox"]');
    // Manejar el captcha
    const captchaImageSrc = await frame.evaluate(() => {
        const captchaImage = document.querySelector('img[id="Capcha_CaptchaImageUP"]');
        return captchaImage ? captchaImage.src : null;
    });

    if (captchaImageSrc) {
        console.log('Captcha encontrado. Ingrese el texto del captcha manualmente.');
        await frame.type('input[name="Capcha$CaptchaTextBox"]', captchaText);
    } else {
        console.log('No se encontró el captcha.');
    }

    await new Promise(r => setTimeout(r, 10000));

    const newPagePromise = new Promise(x => browser.once('targetcreated', target => x(target.page())));
    // Hacer clic en el botón "Consultar"
    await frame.click('input[name="btnConsultar"]');
    
    const newPage = await newPagePromise;

    // Crear las rutas absolutas para los archivos
    const imgDir = path.resolve(__dirname, '../img');
    const htmlDir = path.resolve(__dirname, '../html');

    // Asegurarse de que los directorios existen
    if (!fs.existsSync(imgDir)) {
        fs.mkdirSync(imgDir, { recursive: true });
    }
    if (!fs.existsSync(htmlDir)) {
        fs.mkdirSync(htmlDir, { recursive: true });
    }

    const imgFilePath = path.join(imgDir, `${tipoDocumento} ${numeroDocumento}.png`);
    const htmlFilePath = path.join(htmlDir, `${tipoDocumento} ${numeroDocumento}.html`);

    // Guardar la captura de pantalla
    await newPage.screenshot({ path: imgFilePath, fullPage: true });
    console.log(`Imagen guardada en: ${imgFilePath}`);

    // Obtener el contenido HTML
    const pageHTML = await newPage.content();

    try {
        fs.writeFileSync(htmlFilePath, pageHTML);
        console.log(`Archivo HTML guardado exitosamente en: ${htmlFilePath}`);
    } catch (error) {
        console.error('Error al guardar el archivo HTML:', error);
    }
    await browser.close();
}
