const PAUSE_DURATION_MICROSECONDS = 1250;

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

async function simpleClick (elementIdName) {
  const clickableSelector = `#${elementIdName}`;
  const clickableItem = await $(clickableSelector);
  await clickableItem.click();
  await browser.pause(PAUSE_DURATION_MICROSECONDS);
}

module.exports = { scrollThroughPage, simpleClick };
