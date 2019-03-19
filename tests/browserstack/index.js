const { Builder, By, until } = require('selenium-webdriver');
const browserStackConfig = require('./config');

const capabilities = {
  browserName: 'Chrome',
  browser_version: '72.0',
  os: 'Windows',
  os_version: '7',
  'browserstack.user': browserStackConfig.BROWSERSTACK_USER,
  'browserstack.key': browserStackConfig.BROWSERSTACK_KEY,
};
async function runTests () {
  const driver = await new Builder()
    .usingServer('http://hub-cloud.browserstack.com/wd/hub')
    .withCapabilities(capabilities)
    .build();
  try {
    await driver.get('https://quality.wevote.us/');
    const settingsButton =
        await driver.wait(until.elementLocated(By.css("button[title='Settings']")), 100000);
    await settingsButton.click();
    await driver.sleep(2000);
  } finally {
    await driver.quit();
  }
}

runTests();
