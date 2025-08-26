/* eslint-disable no-await-in-loop */
/* eslint-disable no-use-before-define */
import { driver, browser, expect } from '@wdio/globals';
import CandidatesPage from '../page_objects/candidates.page';

const testDataPath = 'tests/browserstack_automation/testDataForScripts/';
import fs from 'fs';
import assert from 'assert';

const waitTime = 8000;

/* eslint-disable no-undef */
// This eslint-disable turns off warnings for describe() and it()

beforeEach(async () => {
  await CandidatesPage.load();
  await driver.pause(waitTime);
  // Below line to be commented out once defect #WV-943 is fixed.
  await CandidatesPage.stateSelect.selectByVisibleText('Hawaii');
  await driver.pause(waitTime);
});

afterEach(async () => {
  if (await browser.capabilities.browserName === 'safari') {
    await browser.execute(() => {
      document.cookie.split(';').forEach((c) => {
        document.cookie = c.replace(/^ +/, '').replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
      });
    });
  } else {
    await browser.deleteCookies();
  }
});

describe('Candidates Page', () => {
  // Candidates_001
  it('verifyAllStateNamesPresentforChooseState @BVT', async () => {
    await CandidatesPage.stateSelect.click();
    const options = await CandidatesPage.stateSelectOptions;
    const expectedStates = readTestDataStates('all');
    const actualStates = [];
    await options.forEach(async (option) => {
      const stateName = await option.getText();
      if (!stateName.includes('Choose state')) {
        actualStates.push(stateName);
      }
    });
    await expectedStates.forEach((state) => {
      assert(actualStates.includes(state), `State -> '${state}'  .. not found on the Choose state Dropdown Options .`);
    });
  });

  // Candidates_002
  const stateNamesRandomTC2 = readTestDataStates('random', 3);
  stateNamesRandomTC2.forEach((state) => {
    it('verifyTitleWhenStateSelected', async () => {
      const titleStr = ' Candidates - WeVote';
      console.log(`Running verifyTitleWhenStateSelected -> Using sate: ${state}`);
      await CandidatesPage.stateSelect.selectByVisibleText(state);
      await driver.pause(waitTime);
      const expectedTitle = state + titleStr;
      const actualTitle = await driver.getTitle();
      assert.equal(actualTitle, expectedTitle);
    });
  });

  // Candidates_003
  const stateNamesRandomTC3 = readTestDataStates('random', 3);
  const possibleHeaders = readTestDataAllPossibleHeaders();
  stateNamesRandomTC3.forEach((state) => {
    it('verifyHeadersMatchPossibleHeaders', async () => {
      console.log(`Running verifyHeadersMatchPossibleHeaders -> Using sate: ${state}`);
      await CandidatesPage.stateSelect.selectByVisibleText(state);
      await driver.pause(waitTime);
      const actualHeaders = await CandidatesPage.pageHeaders;
      await actualHeaders.forEach(async (header) => {
        const headerText = await header.getText();
        console.log(`Checking if Header found on page: '${headerText}' is one of the expected headers.`);
        assert(possibleHeaders.includes(headerText), `Header section -> '${headerText}'  .. does not match with any of the expected Headers -> [${possibleHeaders}]`);
      });
    });
  });

  // Candidates_004
  const stateNamesRandomTC4 = readTestDataStates('random', 3);
  stateNamesRandomTC4.forEach((state) => {
    it('verifyMandatoryHeaderPresent', async () => {
      console.log(`Running verifyMandatoryHeaderPresent -> Using sate: ${state}`);
      await CandidatesPage.stateSelect.selectByVisibleText(state);
      await driver.pause(waitTime);
      const actualHeaders = await CandidatesPage.pageHeaders;
      const actualHeadersText = [];
      await actualHeaders.forEach(async (header) => {
        actualHeadersText.push(await header.getText());
      });

      // Update 02/03/2025: Updating the check for mandatory headers, as per the latest update from Dale.
      // Expected: Atleast one of the headers should be present on the page.
      /* MandatoryHeaders.forEach((mandatoryHeader) => {
        console.log(`Checking if mandatory header '${mandatoryHeader}' is found on the page.`);
        assert(actualHeadersText.includes(mandatoryHeader), `Mandatory Header section -> '${mandatoryHeader}'  .. not found on the page..`);
      }); */
      let atleastOneHeaderFound = false;
      for (let i = 0; i < possibleHeaders.length; i++) {
        if (actualHeadersText.includes(possibleHeaders[i])) {
          atleastOneHeaderFound = true;
          console.log(`Atleast one of the possible headers found on the page: ${possibleHeaders[i]}`);
          break;
        }
      }
      assert.equal(atleastOneHeaderFound, true, 'None of the possible headers found on the page.');
    });
  });

  // Candidates_005, Candidates_006, Candidates_007, Candidates_008, Candidates_009
  const stateNamesRandomTC5 = readTestDataStates('random', 3);
  stateNamesRandomTC5.forEach((state) => {
    const errors = [];
    it('verifyCandidateCardHasSectionsDisplayed', async () => {
      console.log(`Running verifyCandidateCardHasSectionsDisplayed -> Using sate: ${state}`);
      await CandidatesPage.stateSelect.selectByVisibleText(state);
      await driver.pause(waitTime);
      const candidateCards = await CandidatesPage.candidateCardList;
      for (let i = 0; i < candidateCards.length; i++) {
        const card = candidateCards[i];
        // Update 02/03/2025: wait for 4 seconds for the data to get loaded, suggested by Dale 01/14/2025.
        await driver.waitUntil(async () =>  !(await card.getAttribute('id')).includes('Loading'), { timeout: 4000, timeoutMsg: 'Card Data not Loaded within expected duration of 4 seconds.' });
        const cardId = await card.getAttribute('id');
        const candidateNameDisplayed = await CandidatesPage.getCandidateCardCandidateName(cardId);
        const stateNameDisplayed = await CandidatesPage.getCandidateCardState(cardId);
        const partyNameDisplayed = await CandidatesPage.getCandidateCardPartyName(cardId);
        const officeNameDisplayed = (await CandidatesPage.getCandidateCardOffice(cardId));
        const candidateImage = await CandidatesPage.getCandidateCardImage(cardId);
        const imageDisplayed = await candidateImage.isDisplayed();
        const errMsgNoCandidateName = `Candidate Name not displayed for candidate card: ${cardId}`;
        const errMsgNoStateName = `State not displayed for candidate: ${candidateNameDisplayed}`;
        const errMsgNoPartyName = `Party not displayed for candidate: ${candidateNameDisplayed}`;
        const errMsgNoOfficeName = `Office not displayed for candidate: ${candidateNameDisplayed}`;
        const errMsgNoImage = `Candidate Image not displayed for candidate: ${candidateNameDisplayed}`;
        if (candidateNameDisplayed === null) errors.push(errMsgNoCandidateName);
        if (stateNameDisplayed === null) errors.push(errMsgNoStateName);
        if (partyNameDisplayed === null) errors.push(errMsgNoPartyName);
        if (officeNameDisplayed === null) errors.push(errMsgNoOfficeName);
        if (imageDisplayed === false) errors.push(errMsgNoImage);
      }
      if (errors.length > 0) {
        let errorsAll = '';
        for (let i = 0; i < errors.length; i++) {
          errorsAll += `${errors[i]}\n`;
        }
        throw new Error(errorsAll);
      }
    });
  });

  // Candidates_010, Candidates_011
  it('verifyChooseOpposeCandidateHoverMessage', async () => {
    const stateNameRandomTC10 = readTestDataStates('random', 1)[0];
    console.log(`Running verifyChooseOpposeCandidateHoverMessage using state ${stateNameRandomTC10}`);
    await CandidatesPage.stateSelect.selectByVisibleText(stateNameRandomTC10);
    await driver.pause(waitTime);
    const cardId = await getCandidateCardId();
    const chooseButton = await CandidatesPage.getCandidateCardChoose(cardId);
    const opposeButton = await CandidatesPage.getCandidateCardOppose(cardId);
    await driver.executeScript("arguments[0].scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });", [chooseButton]);
    await driver.executeScript("arguments[0].dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));", [chooseButton]);
    await driver.waitUntil(async () => CandidatesPage.supportTooltip.isDisplayed(), { timeout: 5000, timeoutMsg: 'Tooltip did not appear in time' });
    const supportTooltipText = await CandidatesPage.supportTooltip.getText();
    console.log(`Displayed Support Tooltiptext: ${supportTooltipText}`);
    const candidateName = await CandidatesPage.getCandidateCardCandidateName(cardId);
    const expectedSupportTooltipText = (readTooltipsText('SupportAdd')).replace('<Candidate>', candidateName);
    console.log(`Expected text: ${expectedSupportTooltipText}`);
    assert.equal(supportTooltipText, expectedSupportTooltipText);
    await driver.executeScript("arguments[0].dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));", [opposeButton]);
    await driver.waitUntil(async () => CandidatesPage.opposeTooltip.isDisplayed(), { timeout: 5000, timeoutMsg: 'Tooltip did not appear in time' });
    const opposeTooltipText = (await CandidatesPage.opposeTooltip.getText());
    console.log(`Displayed Oppose Tooltiptext: ${opposeTooltipText}`);
    const expectedOpposeTooltipText = (readTooltipsText('OpposeAdd')).replace('<Candidate>', candidateName);
    console.log(`Expected text: ${expectedOpposeTooltipText}`);
    assert.equal(opposeTooltipText, expectedOpposeTooltipText);
  });

  // Candidates_012
  it('verifyChooseCandidateButtonClick', async () => {
    const stateNameRandomTC10 = readTestDataStates('random', 1)[0];
    console.log(`Running verifyChooseCandidateButtonClick using state ${stateNameRandomTC10}`);
    await CandidatesPage.stateSelect.selectByVisibleText(stateNameRandomTC10);
    await driver.pause(waitTime);
    const cardId = await getCandidateCardId();
    const chooseButton = await CandidatesPage.getCandidateCardChoose(cardId);
    const opposeButton = await CandidatesPage.getCandidateCardOppose(cardId);
    await driver.executeScript("arguments[0].scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });", [chooseButton]);
    await chooseButton.click();
    await driver.pause(waitTime);
    await expect(chooseButton).not.toHaveText('Choose');
    await expect(opposeButton).not.toBePresent();
    await expect(chooseButton).toHaveText('Chosen');
    const helpWinButton = await CandidatesPage.getCandidateCardHelpWinButton(cardId);
    await expect(helpWinButton).toBeDisplayed();
    const expectedHelpWinText = readTooltipsText('HelpWinText');
    await expect(helpWinButton).toHaveText(expectedHelpWinText);
  });

  // Candidates_013
  it('verifyOpposeCandidateButtonClick', async () => {
    const stateNameRandomTC10 = readTestDataStates('random', 1)[0];
    console.log(`Running verifyOpposeCandidateButtonClick using state ${stateNameRandomTC10}`);
    await CandidatesPage.stateSelect.selectByVisibleText(stateNameRandomTC10);
    await driver.pause(waitTime);
    const cardId = await getCandidateCardId();
    const chooseButton = await CandidatesPage.getCandidateCardChoose(cardId);
    const opposeButton = await CandidatesPage.getCandidateCardOppose(cardId);
    await driver.executeScript("arguments[0].scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });", [chooseButton]);
    await opposeButton.click();
    await expect(chooseButton).not.toBePresent();
    await expect(opposeButton).not.toHaveText('Oppose');
    await expect(opposeButton).toHaveText('Opposed');
    const helpDefeatButton = await CandidatesPage.getCandidateCardHelpDefeatButton(cardId);
    await expect(helpDefeatButton).toBeDisplayed();
    const expectedHelpDefeatText = readTooltipsText('HelpDefeatText');
    await expect(helpDefeatButton).toHaveText(expectedHelpDefeatText);
  });

  // Candidates_014
  it('verifyChoosenCandidateHoverMessage', async () => {
    const stateNameRandomTC10 = readTestDataStates('random', 1)[0];
    console.log(`Running verifyChoosenCandidateHoverMessage using state ${stateNameRandomTC10}`);
    await CandidatesPage.stateSelect.selectByVisibleText(stateNameRandomTC10);
    await driver.pause(waitTime);
    const cardId = await getCandidateCardId();
    const chooseButton = await CandidatesPage.getCandidateCardChoose(cardId);
    const opposeButton = await CandidatesPage.getCandidateCardOppose(cardId);
    await driver.executeScript("arguments[0].scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });", [chooseButton]);
    await chooseButton.click();
    await driver.pause(waitTime);
    await CandidatesPage.scrollRight.moveTo();
    await driver.executeScript("arguments[0].dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));", [chooseButton]);
    await driver.waitUntil(async () => CandidatesPage.supportTooltip.isDisplayed(), { timeout: 5000, timeoutMsg: 'Tooltip did not appear in time' });
    const tooltipText = await CandidatesPage.supportTooltip.getText();
    const candidateName = await CandidatesPage.getCandidateCardCandidateName(cardId);
    const expectedTooltipText = readTooltipsText('SupportRemove').replace('<Candidate>', candidateName);
    await expect(tooltipText).toEqual(expectedTooltipText);
    await chooseButton.click();
    await expect(chooseButton).toHaveText('Choose');
    await expect(opposeButton).toBePresent();
    await expect(opposeButton).toHaveText('Oppose');
  });

  // Candidates_015
  it('verifyOpposedCandidateHoverMessage', async () => {
    const stateNameRandomTC10 = readTestDataStates('random', 1)[0];
    console.log(`Running verifyOpposedCandidateHoverMessage using state ${stateNameRandomTC10}`);
    await CandidatesPage.stateSelect.selectByVisibleText(stateNameRandomTC10);
    await driver.pause(waitTime);
    const cardId = await getCandidateCardId();
    const chooseButton = await CandidatesPage.getCandidateCardChoose(cardId);
    const opposeButton = await CandidatesPage.getCandidateCardOppose(cardId);
    await driver.executeScript("arguments[0].scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });", [chooseButton]);
    await opposeButton.click();
    await CandidatesPage.scrollRight.moveTo();
    await driver.executeScript("arguments[0].dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));", [opposeButton]);
    await driver.waitUntil(async () => CandidatesPage.opposeTooltip.isDisplayed(), { timeout: 5000, timeoutMsg: 'Tooltip did not appear in time' });
    const tooltipText = (await CandidatesPage.opposeTooltip.getText());
    const candidateName = await CandidatesPage.getCandidateCardCandidateName(cardId);
    const expectedTooltipText = readTooltipsText('OpposeRemove').replace('<Candidate>', candidateName);
    await expect(tooltipText).toEqual(expectedTooltipText);
    await opposeButton.click();
    await expect(chooseButton).toBePresent();
    await expect(chooseButton).toHaveText('Choose');
    await expect(opposeButton).toBePresent();
    await expect(opposeButton).toHaveText('Oppose');
  });

  // Candidates_016, // Candidates_017
  it('verifyCandidateLikeUnlikeHoverMessage @WV-1073', async () => {
    const stateNameRandomTC10 = readTestDataStates('random', 1)[0];
    const errors = [];
    console.log(`Running verifyCandidateLikeUnlikeHoverMessage using state ${stateNameRandomTC10}`);
    await CandidatesPage.stateSelect.selectByVisibleText(stateNameRandomTC10);
    await driver.pause(waitTime);
    const cardId = await getCandidateCardId();

    const likeIcon = await CandidatesPage.getCandidateCardLike(cardId);
    const dislikeIcon = await CandidatesPage.getCandidateCardDislike(cardId);
    const likeClr = await CandidatesPage.getCandidateCardLikeIcon(cardId);
    const dislikeClr = await CandidatesPage.getCandidateCardDislikeIcon(cardId);
    const chooseButton = await CandidatesPage.getCandidateCardChoose(cardId);
    const expectedTooltipTextLike = readTooltipsText('LikeCandidate');
    const expectedTooltipTextDislike = new RegExp(readTooltipsText('DislikeCandidate'));
    const expectedColor = readTooltipsText('LikeDislikeIconColor');
    const errMsgIncorrectLike = `Like tooltip does not match expected tooltip:\n${expectedTooltipTextLike}`;
    const errMsgIncorrectUnlike = `Unlike tooltip does not match expected tooltip:\n${expectedTooltipTextDislike.source.replace('/', '').replace(/\\/g, '').replace('^', '').replace('$', '')
      .replace('d+', '<N>')}`;

    await driver.executeScript("arguments[0].scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });", [chooseButton]);
    await driver.pause(waitTime/2);
    await likeIcon.moveTo();
    const likeIconColorAfter = ((await likeClr.getCSSProperty('fill')).value);
    await driver.executeScript("arguments[0].dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));", [likeClr]);
    await driver.waitUntil(async () => CandidatesPage.likeTooltip.isDisplayed(), { timeout: 5000, timeoutMsg: 'Like Tooltip did not appear in time' });
    const tooltipTextLike = await CandidatesPage.likeTooltip.getText();
    if (tooltipTextLike !== expectedTooltipTextLike) {
      errors.push(errMsgIncorrectLike);
    }
    if (likeIconColorAfter !== expectedColor && browser.capabilities.browserName === 'chrome') {
      errors.push(`Like Icon color not changed on mouse hover to: ${expectedColor}`);
    }

    await driver.pause(waitTime);
    await dislikeIcon.moveTo();
    const disLikeIconColorAfter = ((await dislikeClr.getCSSProperty('fill')).value);
    await driver.executeScript("arguments[0].dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));", [dislikeClr]);
    await driver.waitUntil(async () => CandidatesPage.dislikeTooltip.isDisplayed(), { timeout: 5000, timeoutMsg: 'Dislike Tooltip did not appear in time' });
    const tooltipTextDislike = await CandidatesPage.dislikeTooltip.getText();
    if (!tooltipTextDislike.match(expectedTooltipTextDislike)) {
      errors.push(errMsgIncorrectUnlike);
    }
    if (disLikeIconColorAfter !== expectedColor && browser.capabilities.browserName === 'chrome') {
      errors.push(`Dislike Icon color not changed on mouse hover to: ${expectedColor}`);
    }

    if (errors.length > 0) {
      let errorsAll = '';
      for (let i = 0; i < errors.length; i++) {
        errorsAll += `\n${errors[i]}`;
      }
      throw new Error(errorsAll);
    }
  });

    // Candidates_018
  it('verifyLikeCandidateClick @WV-1073', async () => {
    const stateNameRandomTC10 = readTestDataStates('random', 1)[0];
    console.log(`Running verifyLikeCandidateClick using state ${stateNameRandomTC10}`);
    await CandidatesPage.stateSelect.selectByVisibleText(stateNameRandomTC10);
    await driver.pause(waitTime);
    const cardId = await getCandidateCardId();
    const likeButton = await CandidatesPage.getCandidateCardLikeButton(cardId);
    const chooseButton = await CandidatesPage.getCandidateCardChoose(cardId);
    const signInButton = CandidatesPage.likeDislikeSignin;
    await driver.executeScript("arguments[0].scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });", [chooseButton]);
    await driver.pause(waitTime/2);
    await likeButton.click();
    await driver.pause(waitTime/2);
    await driver.waitUntil(async () => (await signInButton).isDisplayed(), { timeout: 5000, timeoutMsg: 'Sign In button did not appear within expected duration' });
    await expect(signInButton).toBeDisplayed();
  });

    // Candidates_019
  it('verifyDislikeCandidateClick @WV-1073', async () => {
    const stateNameRandomTC10 = readTestDataStates('random', 1)[0];
    console.log(`Running verifyDislikeCandidateClick using state ${stateNameRandomTC10}`);
    await CandidatesPage.stateSelect.selectByVisibleText(stateNameRandomTC10);
    await driver.pause(waitTime);
    const cardId = await getCandidateCardId();
    const dislikeButton = await CandidatesPage.getCandidateCardDislikeButton(cardId);
    const chooseButton = await CandidatesPage.getCandidateCardChoose(cardId);
    const signInButton = CandidatesPage.likeDislikeSignin;
    await driver.executeScript("arguments[0].scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });", [chooseButton]);
    await driver.pause(waitTime/2);
    await dislikeButton.click();
    await driver.pause(waitTime/2);
    await driver.waitUntil(async () => (await signInButton).isDisplayed(), { timeout: 5000, timeoutMsg: 'Sign In button did not appear within expected duration' });
    await expect(signInButton).toBeDisplayed();
  });

    // Candidates_020
  it('verifyCandidateNameClick @WV-1073', async () => {
    const stateNameRandomTC10 = readTestDataStates('random', 1)[0];
    console.log(`Running verifyCandidateNameClick using state ${stateNameRandomTC10}`);
    await CandidatesPage.stateSelect.selectByVisibleText(stateNameRandomTC10);
    await driver.pause(waitTime);
    const cardId = await getCandidateCardId();
    const candidate = await CandidatesPage.getCandidateCardCandidate(cardId);
    const candidateName = await candidate.getText();
    const expectedTitle = `${candidateName} - WeVote.US`;
    const nameFirst = candidateName.split(' ')[0];
    await candidate.click();
    await driver.pause(waitTime);
    const newTitle = await driver.getTitle();
    driver.waitUntil(async () => (browser.getUrl()).contains(nameFirst), { timeput: 4000, timeoutMsg: 'Candidate Page not opened within exected duration.' });
    await expect(newTitle).toMatch(expectedTitle);
  });

    // Candidates_021
  it('verifyCandidateImageClick @WV-1073', async () => {
    const stateNameRandomTC10 = readTestDataStates('random', 1)[0];
    console.log(`Running verifyCandidateImageClick using state ${stateNameRandomTC10}`);
    await CandidatesPage.stateSelect.selectByVisibleText(stateNameRandomTC10);
    await driver.pause(waitTime);
    const cardId = await getCandidateCardId();
    const candidateImage = await CandidatesPage.getCandidateCardImage(cardId);
    const candidateName = await CandidatesPage.getCandidateCardCandidateName(cardId);
    const expectedTitle = `${candidateName} - WeVote.US`;
    const nameFirst = candidateName.split(' ')[0];
    await candidateImage.click();
    await driver.pause(waitTime);
    const newTitle = await driver.getTitle();
    driver.waitUntil(async () => (browser.getUrl()).contains(nameFirst), { timeput: 4000, timeoutMsg: 'Candidate Page not opened within exected duration.' });
    await expect(newTitle).toMatch(expectedTitle);
  });



  // read All Possible Headers from candidatesPage_TC001.json
  function readTestDataAllPossibleHeaders () {
    const jsonObjH = JSON.parse(fs.readFileSync(`${testDataPath}candidatesPage_TDHeaders.json`));
    const possibleHeadersData = jsonObjH.map((i) => i.HeaderText);
    return possibleHeadersData;
  }
  // Update 02/03/2025: Commenting out this function as we are not checking mandatory headers now.
  // read Mandatory Headers from candidatesPage_TC001.json
  /* function readTestDataMandatoryHeaders () {
    const jsonObjH = JSON.parse(fs.readFileSync(`${testDataPath}candidatesPage_TDHeaders.json`));
    const MandatoryHeadersData = (jsonObjH.filter((header) => header.Mandatory === 'Y')).map((i) => i.HeaderText);
    return MandatoryHeadersData;
  } */

  // read stateNames from candidatesPage_TDStates.json, return n random states for test run
  function readTestDataStates (type, count) {
    const jsonObjSt = JSON.parse(fs.readFileSync(`${testDataPath}candidatesPage_TDStates.json`));
    const allStateNames = (jsonObjSt[0]).States;
    let testStates = [];
    if (type === 'all') {
      testStates = allStateNames;
    } else if (type === 'random') {
      for (let cnt = 0; cnt < count; cnt++) {
        testStates.push(allStateNames[Math.floor(Math.random() * allStateNames.length)]);
      }
    }
    return testStates;
  }

  // read tooltips text from candidatesPage_TDTooltips.json
  function readTooltipsText (type) {
    const jsonObjH = JSON.parse(fs.readFileSync(`${testDataPath}candidatesPage_TDTooltips.json`));
    const text = jsonObjH[0][type];
    return text;
  }

  async function getCandidateCardId () {
    const candidateCards = await CandidatesPage.candidateCardList;
    let selCard =  0;
    if (candidateCards.length >= 3) {
      selCard =  1;
    } else {
      selCard = candidateCards.length - 1;
    }
    const candidateCardRandom = candidateCards[selCard];
    await driver.waitUntil(async () =>  !(await candidateCardRandom.getAttribute('id')).includes('Loading'), { timeout: 4000, timeoutMsg: 'Card Data not Loaded within expected duration of 4 seconds.' });
    const candidateCardId = await candidateCardRandom.getAttribute('id');
    return candidateCardId;
  }
});
