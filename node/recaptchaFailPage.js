const puppeteer = require('puppeteer');

// Invoke as WebApp % node ./node/recaptchaFailPage.js
// to fail recaptcha

const testReCaptcha = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto('https://wevote.us/more/donate');
};

testReCaptcha();
