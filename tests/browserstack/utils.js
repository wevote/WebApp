const fs = require('fs');

const PAUSE_DURATION_MICROSECONDS = 1250;

async function clearTextInputValue (elementIdName) {
  const clickableSelector = `#${elementIdName}`;
  const clickableItem = await $(clickableSelector);
  // const charactersToDelete = 1;
  // for (let i = 0; i <= charactersToDelete; i++) {
  //   // Delete 30 characters at a time. If we delete 1 at a time the Google location popover refills the input box too fast.
  //   await clickableItem.setValue('\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003');
  // }
  await clickableItem.setValue('\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003');
  await browser.pause(PAUSE_DURATION_MICROSECONDS);
}

function scrollThroughPage () {
  browser.setTimeout({ script: 60000 });
  browser.executeAsync((done) => {
    const SCROLL_INCREMENT_TIME_IN_MICROSECONDS = 1000;
    let scroll;
    if (!('scrollBehavior' in document.body.style)) {
      // scroll for Safari and Edge
      scroll = window.scrollTo;
    } else {
      // smoother scroll for Chrome, Firefox, Opera, Android Webview
      scroll = (top, left) => {
        window.scrollTo({
          top,
          left,
          behavior: 'smooth',
        });
      };
    }
    // scroll to top if not already there
    if (window.scrollY) {
      scroll(0, 0);
    }
    const lengthOfScroll = window.innerHeight - 50;
    const totalLengthToScroll = document.body.clientHeight - lengthOfScroll + 100;
    const totalScrollsNeeded = Math.ceil(totalLengthToScroll / lengthOfScroll);
    let numberOfScrollsCompleted = 0;
    const intervalId = window.setInterval(() => {
      if (numberOfScrollsCompleted < totalScrollsNeeded) {
        numberOfScrollsCompleted++;
        scroll(lengthOfScroll * numberOfScrollsCompleted);
      } else {
        window.clearInterval(intervalId);
        window.setTimeout(done, 1000);
      }
    }, SCROLL_INCREMENT_TIME_IN_MICROSECONDS);
  });
}

async function setNewAddress (elementIdName, addressValue) {
  const clickableSelector = `#${elementIdName}`;
  const clickableItem = await $(clickableSelector);
  await clickableItem.click();
  // Delete 30 characters, add new address, then enter key
  const addressConcatenation = `\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003${addressValue}\uE007`;
  await clickableItem.setValue(addressConcatenation);
  await browser.pause(PAUSE_DURATION_MICROSECONDS);
}

async function setNewAddressIOS (elementIdName, addressValue) {
  const clickableSelector = `#${elementIdName}`;
  const clickableItem = await $(clickableSelector);
  await clickableItem.click();
  // Delete 30 characters, add new address, then enter key
  const addressConcatenation = `\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003\uE003${addressValue}\uE007`;
  await clickableItem.setValue(addressConcatenation);
  await browser.pause(PAUSE_DURATION_MICROSECONDS);
}

async function simpleClick (elementIdName) {
  const clickableSelector = `#${elementIdName}`;
  const clickableItem = await $(clickableSelector);
  await clickableItem.click();
  await browser.pause(PAUSE_DURATION_MICROSECONDS);
}

async function simpleCloseBootstrapModal () {
  const clickableSelector = 'button[class="close"]';
  const clickableItem = await $(clickableSelector);
  await clickableItem.click();
  await browser.pause(PAUSE_DURATION_MICROSECONDS);
}

async function simpleTextInput (elementIdName, textValue) {
  const clickableSelector = `#${elementIdName}`;
  const clickableItem = await $(clickableSelector);
  await clickableItem.setValue(textValue);
  await browser.pause(PAUSE_DURATION_MICROSECONDS);
}

function writeToLog (message) {
  const time = (new Date(Date.now())).toISOString();
  const { name } = driver.config.capabilities;
  fs.appendFile('./browserstack.log', `${time} ${message} [${name}]\n`, (err) => {
    if (err) throw err;
  });
}

// await browser.performActions([{
//   type: 'pointer',
//   id: 'clickTopLeftCornerAction',
//   actions: [
//     { type: 'pointerMove', x, y },
//     { type: 'pointerDown', button: 0 },
//     { type: 'pointerUp', button: 0 },
//   ],
// }]).then(() => browser.releaseActions());

async function clickTopLeftCornerOfElement (selector) {
  const element = await $(selector);
  if (element.isW3C) {
    // need to figure out how to use webdriverio's performActions with BrowserStack
  } else {
    // JSON Wire Protocol
    await element.moveTo(1, 1);
    await element.positionClick();
  }
  await browser.pause(PAUSE_DURATION_MICROSECONDS);
}

module.exports = { clearTextInputValue, scrollThroughPage, simpleClick, clickTopLeftCornerOfElement, simpleCloseBootstrapModal, simpleTextInput, setNewAddress, setNewAddressIOS, writeToLog };
