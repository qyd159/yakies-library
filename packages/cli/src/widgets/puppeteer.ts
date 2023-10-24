import puppeteer from 'puppeteer';

export default function (args) { 

async function run() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.google.com');
    await page.screenshot({path: 'screenshot.png'});
    await browser.close();
}

run();

 }
