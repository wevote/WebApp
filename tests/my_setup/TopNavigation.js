const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const localPathToDriver = '/Users/newuser/Downloads/chromedriver';
const service = new chrome.ServiceBuilder();

var assert = require('assert');

async function openWeVoteHomeLogoTest() {
  let testPassed = false;
  const driver = await new Builder()
      .forBrowser('chrome')
      .setChromeService(service)
      .build();

  await driver.manage().setTimeouts({ implicit: 6000 });

  // Helper function to test that the WeVote Logo navigates to the ready page
  const testLogoNavigationFromPage = async (url) => {
      await driver.get(url);

      // Click on We Vote logo and navigate to page
      await driver.findElement(By.id('logoHeaderBar')).click();

      // Check that the Ready Page has loaded
      await driver.findElement(By.xpath("//*[text()[contains(.,'We Vote')]]")).click();
      assert(await driver.getCurrentUrl() == 'https://quality.wevote.us/ready');
  }

  try {
      // Click on WeVote logo from multiple pages
      await testLogoNavigationFromPage('https://quality.wevote.us/ballot');
      await testLogoNavigationFromPage('https://quality.wevote.us/friends');
      await testLogoNavigationFromPage('https://quality.wevote.us/more/donate');

      testPassed = true;
  } finally {
      await driver.quit();
      console.log(`openWeVoteHomeLogoTest Test: ${testPassed ? "Passed" : "Failed"}`);
  }
}

async function openBallotTabTest() {
  let testPassed = false;
  const driver = await new Builder()
      .forBrowser('chrome')
      .setChromeService(service)
      .build();

  try {
      await driver.get('https://quality.wevote.us/');
      await driver.manage().setTimeouts({ implicit: 6000 });

      // Click on Ballot Tab and navigate to page
      await driver.findElement(By.id('ballotTabHeaderBar')).click();

      // Check that the Ballot Page has loaded
      await driver.findElement(By.xpath("//*[text()[contains(.,'General Election')]]")).click();
      assert(await driver.getCurrentUrl() == 'https://quality.wevote.us/ballot');

      testPassed = true;
  } finally {
      await driver.quit();
      console.log(`openBallotTab Test: ${testPassed ? "Passed" : "Failed"}`);
  }
}

async function openSignInModalTest() {
  let testPassed = false;
  const driver = await new Builder()
      .forBrowser('chrome')
      .setChromeService(service)
      .build();

  try {
      await driver.get('https://quality.wevote.us/');
      await driver.manage().setTimeouts({ implicit: 6000 });

      // Click on Sign In or Sign Up Button
      await driver.findElement(By.id('signInHeaderBar')).click();

      // Check that the Sign In or Sign Up modal has loaded
      await driver.findElement(By.className('SignInOptionsPanelWrapper-sc-1lkbv5m-2 diPRqT'));

      testPassed = true;
  } finally {
      await driver.quit();
      console.log(`openSignInModalTest Test: ${testPassed ? "Passed" : "Failed"}`);
  }
}

async function openFriendsTabTest() {
  let testPassed = false;
  const driver = await new Builder()
      .forBrowser('chrome')
      .setChromeService(service)
      .build();

  try {
      await driver.get('https://quality.wevote.us/');
      await driver.manage().setTimeouts({ implicit: 6000 });

      // Click on Friends Tab and navigate to page
      await driver.findElement(By.id('friendsTabHeaderBar')).click();

      // Check that the Friends Page has loaded
      await driver.findElement(By.xpath("//*[text()[contains(.,'Remind 3 of your friends')]]")).click();
      assert(await driver.getCurrentUrl() == 'https://quality.wevote.us/friends');

      testPassed = true;
  } finally {
      await driver.quit();
      console.log(`openFriendsTab Test: ${testPassed ? "Passed" : "Failed"}`);
  }
}

async function openHowItWorksModalTest() {
  let testPassed = false;
  const driver = await new Builder()
      .forBrowser('chrome')
      .setChromeService(service)
      .build();

  try {
      await driver.get('https://quality.wevote.us/');
      await driver.manage().setTimeouts({ implicit: 6000 });

      // Click on How It Works Tab
      await driver.findElement(By.id('howItWorksTabHeaderBar')).click();

      // Check that the How It Works modal has loaded
      await driver.findElement(By.className('ModalTitleArea-sc-1rpx53i-0 ibcRTY'));

      testPassed = true;
  } finally {
      await driver.quit();
      console.log(`openHowItWorksModal Test: ${testPassed ? "Passed" : "Failed"}`);
  }
}

async function openDonateTabTest() {
  let testPassed = false;
  const driver = await new Builder()
      .forBrowser('chrome')
      .setChromeService(service)
      .build();

  try {
      await driver.get('https://quality.wevote.us/');
      await driver.manage().setTimeouts({ implicit: 6000 });

      // Click on Donate Tab and navigate to page
      await driver.findElement(By.id('donateTabHeaderBar')).click();

      // Check that the Donate Page has loaded
      await driver.findElement(By.xpath("//*[text()[contains(.,'Donate to Support We Vote')]]")).click();
      assert(await driver.getCurrentUrl() == 'https://quality.wevote.us/more/donate');

      testPassed = true;
  } finally {
      await driver.quit();
      console.log(`openDonateTab Test: ${testPassed ? "Passed" : "Failed"}`);
  }
}


// Run tests
openWeVoteHomeLogoTest();
openBallotTabTest();
openSignInModalTest();
openFriendsTabTest();
openHowItWorksModalTest();
openDonateTabTest();
