import { $, driver, expect, browser } from '@wdio/globals';
import ReadyPage from '../page_objects/ready.page.js';
import PopulateData from '../testDataForScripts/populateStateandCandidateData.js';

const assert = require('assert');
const { describe, it } = require('mocha');

const waitTime = 8000;

/* eslint-disable no-undef */
// This eslint-disable turns off warnings for describe() and it()
// We don't need those warnings, because describe() and it() are available at runtime
// https://webdriver.io/docs/pageobjects

describe('WhosRunningForOfficePage', function() {
  this.timeout(9999999);
  const dataRead = new PopulateData();
  it('CheckStateUrlLinks', async () => {
    await ReadyPage.load();
    await driver.pause(waitTime);
    console.log('ready page opened');
    const standcandidatelist = dataRead.getStateAndCandidatesList();
    // console.log(`State and Candidates list: ${JSON.stringify(standcandidatelist)}`);
    // console.log(typeof standcandidatelist);
    const stName = standcandidatelist.map((item) => item.stateName);
    const stUrl = standcandidatelist.map((item) => item.stateURL);
    const stTitle = standcandidatelist.map((item) => item.stateTitle);
    const stAbb = standcandidatelist.map((item) => item.stateAbb);


    /*console.log(`state names: ${stName}`);
    console.log(`state urls :${stUrl}`);
    console.log(`state titles :${stTitle}`);
    console.log(`state abbreviations :${stAbb}`);*/

    for (let k = 0; k < stName.length; k++) {
      try {
        console.log(`state name from data file: ${stName[k]}`);
        await driver.pause(waitTime);
        await $(`//a[@href="/${stName[k]}-candidates/cs/"]`).click();
        await driver.pause(waitTime);
        console.log(`state url from data file: ${stUrl[k]}`);
        await expect(browser).toHaveUrl(expect.stringContaining(stUrl[k]));
        await driver.pause(waitTime);
        console.log(`state title from data file: ${stTitle[k]}`);
        await expect(browser).toHaveTitle(expect.stringContaining(stTitle[k]));
        await driver.pause(waitTime);
        const stSelectBox = await $('#outlined-age-native-simple');
        const visibleText = await stSelectBox.getValue();
        console.log(`selected state in drop down:${visibleText}`);
        assert.equal(visibleText, stAbb[k], `Error: Actual state: ${visibleText} diff from expected state:${stAbb[k]}`);
      } catch (ex) {
        console.log(`Error : ${ex}`);
        continue;
      }
    }
  });
});
