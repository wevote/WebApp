

import { driver, expect, browser } from '@wdio/globals';



import ReadyPage from '../page_objects/ready.page';
import BallotPage from '../page_objects/ballot.page';



const { describe, it } = require('mocha');

const waitTime = 5000;
const verifyAddressModal = async () => {
  await (BallotPage.getBallotAddressElement).click();
  await driver.pause(waitTime);

  await expect(BallotPage.getBallotModalTitleElement).toHaveText('Enter Your Address');
};
beforeEach(async function () {
  if (this.currentTest.title !== 'verifyBallotPageLinksNavigations') {
    // Skip for the specific test case
    await ReadyPage.load();
    await driver.maximizeWindow();
    await driver.pause(waitTime);
  }
});

describe('Ballot Page', async () => {

  //BallotLocation_001// WV-971 .
  it('verifyBallotPageLinksNavigations', async () => {
    await ReadyPage.load();
    await driver.maximizeWindow();
    await expect(BallotPage.getViewBallotElement).toBeClickable();
    await (BallotPage.getViewBallotElement).click();

    await expect(browser).toHaveUrl(expect.stringContaining('ballot'));
    await expect(BallotPage.getBallotTopElement).toBeClickable();
    await expect(browser).toHaveUrl(expect.stringContaining('ballot'));
  });

  it('verifyBallotAddressLinks', async () => {
    await verifyAddressModal();
    await (BallotPage.getBallotModalCloseElement).click();
    await (await BallotPage.getBallotTopElement).click();
    await verifyAddressModal();
  });

  it('validateBallotModalUIComponents', async () => {
    await BallotPage.getBallotAddressElement.click();


    await expect(BallotPage.getBallotModalInputElement).toBeDisplayed();
    await BallotPage.getBallotModalInputElement.click();
    await expect(await BallotPage.getBallotModalInputElement.getAttribute('placeholder')).toBe('Street number, full address and ZIP...');
    await expect(BallotPage.getBallotModalSaveElement).toBeClickable();
    await expect(await BallotPage.getBallotModalCancelElement).toBeClickable();

  });



  const addressData = {
    validAddress: {
      input: '345 Park Avenue, San Jose, CA, USA',
      expectSuggestion: true
    },
    partialAddress: {
      input: '345 Park Avenue',
      expectSuggestion: true
    },
    genericAddress: {
      input: 'Park Avenue',
      expectSuggestion: true
    },

    emptyAddress: {
      input: '',
      expectSuggestion: false
    },

    invalidAddress: {
      input: 'xyz123',
      expectSuggestion: false
    }
  };

  //BallotLocation_007 ,BallotLocation_008 ,BallotLocation_009 ,BallotLocation_010 ,BallotLocation_011 
  for (let [label, data] of Object.entries(addressData)) {
    it(`verifyAddressFromAutocompleteDropdown  ${label}`, async () => {

      await BallotPage.getBallotAddressElement.click();



      const addressInput = await BallotPage.getBallotModalInputElement.addValue(data.input);;
      await browser.pause(1000);
      browser.waitUntil(async () => {
        let suggestions = await BallotPage.getAutoCompleteAddressElements;//.map(element => element);//The issue arises because BallotPage.getAutoCompleteAddressElements returns an ElementArray, which is not directly assignable to a standard array. To fix this, you can use the .map() method to convert the ElementArray into a standard array.The issue arises because BallotPage.getAutoCompleteAddressElements returns an ElementArray, which is not directly assignable to a standard array. To fix this, you can use the .map() method to convert the ElementArray into a standard array.
        return (await suggestions.length) > 0;
      }, {
        timeout: 5000,
        timeoutMsg: 'Autocomplete suggestions did not appear',
      })

      let allSuggestions = await BallotPage.getAutoCompleteAddressElements;


      if (data.expectSuggestion) {

        await browser.pause(3000);

        await expect(allSuggestions.length).toBeGreaterThan(0);

        for (let suggestion of allSuggestions) {
          console.log('allSuggestions:', await suggestion.getText());
          // const suggestionText = (await suggestion.getText()).trim().toLowerCase();
          const inputValue = await BallotPage.getBallotModalInputElement.getValue();
          await expect(suggestion).toHaveText(expect.stringContaining(inputValue.split(',')[0].trim()));
          break;
          //await expect( allSuggestions[0]).toHaveText(expect.stringContaining(inputValue.split(',')[0].trim()));

        }//
      } else {
        await expect(allSuggestions.length).toBe(0);
      }

      await browser.keys('Tab');
      await expect(await BallotPage.getBallotModalInputElement).toHaveValue(expect.stringContaining(data.input));



    });

  };
  //BallotLocation_012
  it('verifyAddressLocationFromAutocompleteDropdown', async () => {


    const validAdd = addressData.partialAddress;
    await BallotPage.getBallotAddressElement.click();
    await BallotPage.getBallotModalInputElement.addValue(validAdd.input);

    await browser.pause(1000);
    await browser.waitUntil(async () => {

      let suggestionsT = await BallotPage.getAutoCompleteAddressElements;
      return (suggestionsT.length) > 0;
    },
      {
        timeout: 5000,
        timeoutMsg: 'Autocomplete suggestions did not appear',

      })

    let suggestionElements = await BallotPage.getAutoCompleteAddressElements;

    const suggestions = await getTextsfromElements(suggestionElements);

    const locations = await BallotPage.getBallotAddressLocation;

    const locationTexts = await getTextsfromElements(locations);
    await browser.keys('Tab');

    const allContainExpectedLocation = suggestions.every(text =>
      locationTexts.some(location => text.includes(location))
    );
    expect(allContainExpectedLocation).toBe(true);
  })

})

async function getTextsfromElements(elements) {
  const text = [];
  for (let element of elements) {
    text.push(await element.getText());

  }
  console.log('text:', text);
  return text;

}