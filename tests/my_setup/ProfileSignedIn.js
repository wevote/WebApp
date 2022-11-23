const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const localPathToDriver = '/Users/newuser/Downloads/chromedriver';
const service = new chrome.ServiceBuilder(localPathToDriver);

var assert = require('assert');

async function testSignIn() {
  // Start driver
  const driver = await new Builder()
      .forBrowser('chrome')
      //.addArguments('chrome.exe --user-data-dir="C:\\Users\\user_name\\AppData\\Local\\Google\\Chrome\\User Data"')
      .setChromeService(service)
      .build();

  try {
      // Load homepage in browser
      await driver.get('https://quality.wevote.us/');
      assert(await driver.getTitle() == 'Ready to Vote? - We Vote');

      // Set max element search time
      await driver.manage().setTimeouts({ implicit: 6000 });

      // Click on Sign In or Sign Up Button
      await driver.findElement(By.id('signInHeaderBar')).click();

      // Click on Sign In with Facebook option in modal
      await driver.findElement(By.xpath("//*[text() = 'Sign in with Facebook']")).click();

      // Check that the Settings page has loaded
      await driver.findElement(By.xpath("//*[text() = 'Name & Photo Settings']")).click();
      assert(await driver.getTitle() == 'Name & Photo Settings - We Vote');

      // Check if on correct page
      console.log("Sign In Test Passed");
  } finally {
      await driver.quit();
  }
}

testSignIn();
