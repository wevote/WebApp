
import { driver, expect, browser } from '@wdio/globals';
import ReadyPage from '../page_objects/ready.browser';
import BallotPage from '../page_objects/ballot.browser';

const waitTime = 5000;
const verifyAddressModal = async () => {
  await (BallotPage.getBallotAddressElement).click();
  await driver.pause(waitTime);

  await expect(BallotPage.getBallotModalTitleElement).toHaveText('Enter Your Address');
};
beforeEach(async function () {
  // @ts-ignore
  if (this.currentTest.title !== 'verifyBallotPageLinksNavigations') {
    // Skip for the specific test case
    await ReadyPage.load();
    await driver.maximizeWindow();
    await driver.pause(waitTime);
  }
});


async function getTextsfromElements (elements) {
  const text = [];
  for (const element of elements) {
    const elementText = await element.getText();
    text.push(elementText);
    console.log('text:', text);
  }
  return text;
}



describe('Ballot PageBrowser', async () => {
  // BallotLocation_001// WV-971 .
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
    await BallotPage.getBallotTopElement.click();
    await verifyAddressModal();
  });

  it('verifyBallotAddressModalClosesOnCancel', async () => {
    await BallotPage.getBallotTopElement.click();
    await expect(browser).toHaveUrl(expect.stringContaining('/ballot'));
    await BallotPage.getBallotAddressElement.click();
    await expect(BallotPage.getBallotModalTitleElement).toHaveText('Enter Your Address');

    await BallotPage.getBallotModalCancelElement.click();
    await expect(BallotPage.getBallotModalElement).not.toBeDisplayed();
  });

  it('verifyBallotAddressModalClosesOnBack', async () => {
    await expect(browser).toHaveUrl(expect.stringContaining('/ready'));
    await BallotPage.getBallotTopElement.click();
    await expect(browser).toHaveUrl(expect.stringContaining('/ballot'));

    await BallotPage.getBallotElectionNameElement.click();
    await BallotPage.getBallotModalChangeAddressElement.click();
    await expect(BallotPage.getBallotModalTitleElement).toHaveText('Enter Your Address');
    await expect(BallotPage.getBallotModalInputElement).toBeDisplayed();

    await browser.back();
    await expect(browser).toHaveUrl(expect.stringContaining('/ready'));
    await expect(BallotPage.getBallotModalElement).not.toBeDisplayed();
  });

  it('validateBallotModalUIComponents', async () => {
    await BallotPage.getBallotAddressElement.click();


    await expect(BallotPage.getBallotModalInputElement).toBeDisplayed();
    await BallotPage.getBallotModalInputElement.click();
    await expect(await BallotPage.getBallotModalInputElement.getAttribute('placeholder')).toBe('Street number, full address and ZIP...');
    await expect(BallotPage.getBallotModalSaveElement).toBeClickable();
    await expect(BallotPage.getBallotModalCancelElement).toBeClickable();
  });



  const addressData = {
    validAddress: {
      input: '345 Park Avenue, San Jose, CA, USA',
      expectSuggestion: true,
    },
    partialAddress: {
      input: '345 Park Avenue',
      expectSuggestion: true,
    },
    genericAddress: {
      input: 'Park Avenue',
      expectSuggestion: true,
    },

    emptyAddress: {
      input: '',
      expectSuggestion: false,
    },

    invalidAddress: {
      input: 'xyz123',
      expectSuggestion: false,
    },
  };

  // BallotLocation_007 ,BallotLocation_008 ,BallotLocation_009 ,BallotLocation_010 ,BallotLocation_011

  Object.entries(addressData).forEach(([label, data]) => {
    it(`verifyAddressFromAutocompleteDropdown  ${label}`, async () => {
      await BallotPage.getBallotAddressElement.click();
      await BallotPage.getBallotModalInputElement.addValue(data.input);
      await browser.pause(3000);
      let allSuggestions = [];
      if (data.expectSuggestion) {
        await browser.waitUntil(async () => {
          // @ts-ignore
          allSuggestions = BallotPage.getAutoCompleteAddressElements;
          return await allSuggestions.length > 0;
        }, {
          timeout: 5000,
          timeoutMsg: 'Autocomplete suggestions did not appear',
        });

        await browser.pause(1000);
        const inputValue = await BallotPage.getBallotModalInputElement.getValue();
        const promises = await allSuggestions.map(async (suggestion) => {
          console.log('allSuggestions:', await suggestion.getText());
          await expect(suggestion).toHaveText(expect.stringContaining(inputValue.split(' ')[0].trim()));
        });
        await Promise.all(promises).then(() => console.log('All suggestions contain the input value'));
      } else {
        const suggestions = BallotPage.getAutoCompleteAddressElements;
        await expect(await suggestions.length).toEqual(0);
      }

      await browser.keys('Tab');
      await expect(BallotPage.getBallotModalInputElement).toHaveValue(expect.stringContaining(data.input));
    });
  });

  // BallotLocation_012
  it('verifyAddressLocationFromAutocompleteDropdown', async () => {
    const validAdd = addressData.partialAddress;
    await BallotPage.getBallotAddressElement.click();
    await BallotPage.getBallotModalInputElement.addValue(validAdd.input);

    await browser.pause(1000);
    const suggestionsT = await BallotPage.getAutoCompleteAddressElements;
    await browser.waitUntil(async () => (suggestionsT.length) > 0,
      {
        timeout: 5000,
        timeoutMsg: 'Autocomplete suggestions did not appear',

      });
    const suggestions = await getTextsfromElements(suggestionsT);
    await browser.pause(3000);
    const locations = await BallotPage.getBallotAddressLocation;

    const locationTexts = await getTextsfromElements(locations);
    await browser.keys('Tab');
    const allContainExpectedLocation = suggestions.every((text) => locationTexts.some((location) => text.includes(location)));
    expect(allContainExpectedLocation).toBe(true);
  });

  // BallotLocation_015 //BallotLocation_017

  it('verifyKeyboardAccessibilityInAddressSuggestionsAndSelectedAddressInAddressInput', async () => {
    const validAdd = addressData.partialAddress;
    await BallotPage.getBallotAddressElement.click();
    await BallotPage.getBallotModalInputElement.addValue(validAdd.input);

    await browser.waitUntil(async () => {
      const suggestions = await BallotPage.getAutoCompleteAddressElements;
      return await suggestions.length > 0;
    }, {
      timeout: 10000,
      timeoutMsg: 'Autocomplete suggestions did not appear',
    });

    const suggestionsLen = await BallotPage.getAutoCompleteAddressElements.length;

    for (let i = 0; i < suggestionsLen; i++) {
      await browser.keys('ArrowDown');
      const activeElement = await BallotPage.getHighlightedAutoCompleteAddressElement;
      console.log('activeElement:', await activeElement.getText());
      const activeElementText = await activeElement.getText();
      await BallotPage.getBallotAddressElement.waitForDisplayed({ timeout: 5000 });
      const inputValue = await BallotPage.getBallotModalInputElement.getValue();
      await expect(activeElementText.slice(0, 15)).toBe(inputValue.slice(0, 15));
    }
    const firstSuggestion = await BallotPage.getAutoCompleteAddressElements[0];
    await firstSuggestion.click();
    const inputValue = await BallotPage.getBallotModalInputElement.getValue();
    await browser.pause(3000);
    await BallotPage.getBallotModalSaveElement.click();
    await BallotPage.getBallotAddressElement.waitForDisplayed({
      timeout: 10000,
      timeoutMsg: 'Ballot title did not appear after save',
    });
    await browser.pause(6000);
    const selectedAddress = await BallotPage.getBallotAddressElement.getText();
    await expect(selectedAddress.slice(0, 12)).toEqual(inputValue.slice(0, 12));
  });

  // BallotLocation_016
  it('verifyTabFunctionalityOfAddressModal', async () => {
    await BallotPage.getBallotAddressElement.click();
    // Press Tab repeatedly and check focus dynamically
    for (let i = 0; i < 5; i++) { // adjust count as per number of elements
      await browser.keys('Tab');
      const activeElementRef = await browser.getActiveElement();
      // Wrap it as a WebdriverIO element
      const activeElement = await browser.$(activeElementRef);
      // Now you can call element commands
      const tagName = await activeElement.getTagName();
      const isVisible = await activeElement.isDisplayed();
      console.log(`Tab ${i + 1}: tag=${tagName}, visible=${isVisible}`);
      await expect(isVisible).toBe(true);
    }
  });

  describe('Ballot Search', () => {
    const searchBallot = {
      success: true,
      google_civic_election_id: 2999999,
      ballot_item_list: [
        {
          kind_of_ballot_item: 'OFFICE',
          we_vote_id: 'wv01attorney',
          ballot_item_display_name: 'Attorney General',
          candidate_list: [
            { we_vote_id: 'wv01candbrown01', ballot_item_display_name: 'Alex Brown' },
            { we_vote_id: 'wv01candgreen01', ballot_item_display_name: 'Blair Green' },
          ],
        },
        {
          kind_of_ballot_item: 'OFFICE',
          we_vote_id: 'wv01governor',
          ballot_item_display_name: 'Governor',
          candidate_list: [
            { we_vote_id: 'wv01candattorney01', ballot_item_display_name: 'Glen Attorney' },
            { we_vote_id: 'wv01candhunter01', ballot_item_display_name: 'Henry Hunter' },
          ],
        },
      ],
    };
    const candidateNames = searchBallot.ballot_item_list.flatMap((office) => (
      office.candidate_list.map((candidate) => candidate.ballot_item_display_name)
    ));

    const mockBallotResponse = async (ballotResponse) => {
      await browser.execute((ballot) => {
        window.$.ajaxTransport('+*', (options) => {
          if (!options.url.includes('/voterBallotItemsRetrieve/')) return undefined;
          let responseTimer;
          return {
            send: (headers, complete) => {
              responseTimer = setTimeout(() => complete(200, 'OK', { json: ballot }), 0);
            },
            abort: () => clearTimeout(responseTimer),
          };
        });
      }, ballotResponse);
    };

    beforeEach(async () => {
      await mockBallotResponse(searchBallot);
      await BallotPage.getBallotTopElement.click();
      await Promise.all(candidateNames.map(async (name) => (
        expect(await BallotPage.getCandidateByText(name)).toBeDisplayed()
      )));
    });

    // Helper function
    const verifySearchResults = async (query, expectedCandidates) => {
      await BallotPage.getBallotSearchIconElement.click();
      await BallotPage.getBallotSearchInputElement.setValue(query);
      await browser.keys('Enter');

      await Promise.all(candidateNames.filter((candidate) => !expectedCandidates.includes(candidate)).map(async (candidate) => (
        expect(await BallotPage.getCandidateByText(candidate)).not.toBeDisplayed()
      )));
      await Promise.all(expectedCandidates.map(async (candidate) => (
        expect(await BallotPage.getCandidateByText(candidate)).toBeDisplayed()
      )));
    };

    it('verifyBallotSearchWithOfficeAndCandidateMatches', async () => {
      await verifySearchResults('Attorney', ['Alex Brown', 'Blair Green', 'Glen Attorney']);
    });

     it('verifyBallotSearchByOfficeName', async () => {
      await verifySearchResults('Attorney General', ['Alex Brown', 'Blair Green']);
    });

    it('verifyBallotSearchByCandidateName', async () => {
      await verifySearchResults('Glen Attorney', ['Glen Attorney']);
    });
  });
});
