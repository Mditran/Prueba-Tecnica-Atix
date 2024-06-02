import puppeteer from "puppeteer";

async function openWebPage(){
    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 400
    })
    const page = await browser.newPage()
    
    await page.goto('https://www.adres.gov.co/consulte-su-eps')

    await browser.close()
}

//openWebPage()

async function captureScreenShot(){
    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 400
    })
    const page = await browser.newPage()
    
    await page.goto('https://www.adres.gov.co/consulte-su-eps')
    await page.screenshot({path:'example.png'})

    await browser.close()
}
//captureScreenShot()

async function navigateWebPage(){
    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 400
    })
    const page = await browser.newPage()
    
    await page.goto('https://quotes.toscrape.com/')
    await page.click('a[href="/login"]')
    await new Promise(r=> setTimeout(r, 5000))
    await page.screenshot({path:'example.png'})

    await browser.close()
}

//navigateWebPage()

async function navigateWebPage2() {
    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 400
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
    await frame.select('select[name="tipoDoc"]', 'TI'); // Por ejemplo, selecciona "Tarjeta de Identidad"
    
    // Esperar un tiempo para visualizar el cambio (5 segundos)
    await new Promise(r => setTimeout(r, 5000));
    
    // Tomar una captura de pantalla
    await page.screenshot({path: 'example.png'});
    
    await browser.close();
}

navigateWebPage2();