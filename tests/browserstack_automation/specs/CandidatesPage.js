/* eslint-disable no-await-in-loop */
/* eslint-disable no-use-before-define */
import { driver } from '@wdio/globals';
import CandidatesPage from '../page_objects/candidates.page';

const testDataPath = 'tests/browserstack_automation/testDataForScripts/';
const fs = require('fs');
const assert = require('assert');

const waitTime = 8000;

/* eslint-disable no-undef */
// This eslint-disable turns off warnings for describe() and it()

describe('Candidates Page', () => {
  // Candidates_001
  it('verifyAllStateNamesPresentforChooseState', async () => {
    await CandidatesPage.load();
    await driver.pause(waitTime);
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
      await CandidatesPage.load();
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
      CandidatesPage.load();
      await driver.pause(waitTime);
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
      CandidatesPage.load();
      await driver.pause(waitTime);
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

  // Candidates_005, Candidates_006, Candidates_007, Candidates_008
  const stateNamesRandomTC5 = readTestDataStates('random', 3);
  stateNamesRandomTC5.forEach((state) => {
    const errors = [];
    it('verifyCandidateCardHasSectionsDisplayed', async () => {
      console.log(`Running verifyCandidateCardHasSectionsDisplayed -> Using sate: ${state}`);
      CandidatesPage.load();
      await driver.pause(waitTime);
      await CandidatesPage.stateSelect.selectByVisibleText(state);
      await driver.pause(waitTime);
      const candidateCards = await CandidatesPage.CandidateCardList;
      for (let i = 0; i < candidateCards.length; i++) {
        const card = candidateCards[i];
        // Update 02/03/2025: wait for 4 seconds for the data to get loaded, suggested by Dale 01/14/2025.
        await driver.waitUntil(async () =>  !(await card.getAttribute('id')).includes('Loading'), { timeout: 4000, timeoutMsg: 'Card Data not Loaded within expected duration of 4 seconds.' });
        const cardId = await card.getAttribute('id');
        const candidateNameDisplayed = await CandidatesPage.getCandidateCardCandidateName(cardId);
        const stateNameDisplayed = await CandidatesPage.getCandidateCardState(cardId);
        const partyNameDisplayed = await CandidatesPage.getCandidateCardPartyName(cardId);
        const officeNameDisplayed = (await CandidatesPage.getCandidateCardOffice(cardId));
        const errMsgNoCandidateName = `Candidate Name not displayed for candidate card: ${cardId}`;
        const errMsgNoStateName = `State not displayed for candidate: ${candidateNameDisplayed}`;
        const errMsgNoPartyName = `Party not displayed for candidate: ${candidateNameDisplayed}`;
        const errMsgNoOfficeName = `Office not displayed for candidate: ${candidateNameDisplayed}`;
        if (candidateNameDisplayed === null) errors.push(errMsgNoCandidateName);
        if (stateNameDisplayed === null) errors.push(errMsgNoStateName);
        if (partyNameDisplayed === null) errors.push(errMsgNoPartyName);
        if (officeNameDisplayed === null) errors.push(errMsgNoOfficeName);
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
});
