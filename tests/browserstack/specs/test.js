const assert = require('assert');

describe('Basic cross-platform WeVote test',  () => {
  it('can visit the different pages in the app', async () => {
    const isCordova = !!driver.getContexts;
    if (isCordova) {
      // switch contexts and click through intro
      await driver.switchContext('WEBVIEW_org.wevote.cordova');
      const firstNextButton = await $('.background--image2 .btn.btn-lg');
      await firstNextButton.click();
      const secondNextButton = await $('.background--image4 .btn.btn-lg');
      await secondNextButton.click();
      const thirdNextButton = await $('.background--image5 .btn.btn-lg');
      await thirdNextButton.click();
      await browser.pause(1000);
    } else {
      // navigate browser to WeVote QA site
      await browser.url('https://quality.wevote.us/');

    }
    const valuesButtonSelector = (isCordova) ? 'span=Values' : 'button[id="valuesTabHeaderBar"]';
    const valuesButton =
      await $(valuesButtonSelector);
    await valuesButton.click();
    await browser.pause(1000);
    assert(true);
  });
});
