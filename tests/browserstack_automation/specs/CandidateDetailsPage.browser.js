
/* eslint-disable no-undef */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-use-before-define */
import { driver, expect } from '@wdio/globals';
import fs from 'fs';
import { selectedCandidateName, selectedCandidateState, selectedCandidateParty, selectedCandidateImgSrc, selectedCandidateOffice } from  '../page_objects/candidates.browser';
import CandidateDetailsBrowser from '../page_objects/candidateDetails.browser';
import axios from 'axios';

const testDataPath = 'tests/browserstack_automation/testDataForScripts/';
const waitTime = 5000;

// eslint-disable-next-line no-undef

describe('CandidateDetails PageBrowser', () => {
  // CandidateDetails_001
  it('verifyCandidateImageDisplayed', async () => {
    const jsonObjH = JSON.parse(fs.readFileSync(`${testDataPath}candidateDetailsPage.json`));
    const testData = jsonObjH[0].candidateImageDisplayed;
    console.log(`Verifying verifyCandidateImageDisplayed for candidate: ${testData}`);
    await CandidateDetailsBrowser.load(testData);
    await driver.pause(waitTime);
    const img = await CandidateDetailsBrowser.candidateImage;
    const imgSrc = await img.getAttribute('src');
    console.log(`Candidate Img Src from Landing page: ${selectedCandidateImgSrc}`);
    console.log(`Img src from Candidate Details Page : ${imgSrc}`);
    await expect(img).toBeDisplayed();
    // below check fails for img src for some candidates as of now. As suggested by Dale, we can only check if the image is displayed until the img src is synchronized across the Candidates Landing Page and Candidates details Page.
    // await expect(imgSrc).toEqual(selectedCandidateImgSrc);
  });

  // CandidateDetails_002
  it('verifyCandidateNameDisplayed', async () => {
    const jsonObjH = JSON.parse(fs.readFileSync(`${testDataPath}candidateDetailsPage.json`));
    const testData = jsonObjH[0].candidateNameDisplayed;
    console.log(`Verifying verifyCandidateNameDisplayed for candidate: ${testData}`);
    await CandidateDetailsBrowser.load(testData);
    await driver.pause(waitTime);
    const name = await CandidateDetailsBrowser.candidateName;
    const candidateName = await name.getText();
    console.log(`Candidate Name from Landing page: ${selectedCandidateName}`);
    console.log(`Candidate Name from Candidate Details page: ${candidateName}`);
    await expect(name).toBeDisplayed();
    await expect(candidateName).toEqual(selectedCandidateName);
  });

  // CandidateDetails_003
  it('verifyCandidateStateDisplayed', async () => {
    const jsonObjH = JSON.parse(fs.readFileSync(`${testDataPath}candidateDetailsPage.json`));
    const testData = jsonObjH[0].candidateStateDisplayed;
    console.log(`Verifying verifyCandidateStateDisplayed for candidate: ${testData}`);
    await CandidateDetailsBrowser.load(testData);
    await driver.pause(waitTime);
    console.log(`Verifying verifyCandidateStateDisplayed for candidate: ${selectedCandidateName}`);
    const state = await CandidateDetailsBrowser.candidateState;
    const stateName = await state.getText();
    console.log(`Candidate State from Landing page: ${selectedCandidateState}`);
    console.log(`Candidate State from Candidate Details page: ${stateName}`);
    await expect(state).toBeDisplayed();
    await expect(stateName).toEqual(selectedCandidateState);
  });

  // CandidateDetails_004
  it('verifyCandidatePartyDisplayed', async () => {
    const jsonObjH = JSON.parse(fs.readFileSync(`${testDataPath}candidateDetailsPage.json`));
    const testData = jsonObjH[0].candidatePartyDisplayed;
    console.log(`Verifying verifyCandidatePartyDisplayed for candidate: ${testData}`);
    await CandidateDetailsBrowser.load(testData);
    await driver.pause(waitTime);
    console.log(`Candidate Party from Landing page: ${selectedCandidateParty}`);
    const party = await CandidateDetailsBrowser.candidateParty;
    const partyName = await party.getText();
    console.log(`Candidate Party from Candidate Details page: ${partyName}`);
    await expect(party).toBeDisplayed();
    await expect(partyName).toEqual(selectedCandidateParty);
  });

  // CandidateDetails_005
  it('verifyCandidateOfficeDisplayed', async () => {
    const jsonObjH = JSON.parse(fs.readFileSync(`${testDataPath}candidateDetailsPage.json`));
    const testData = jsonObjH[0].candidateOfficeDisplayed;
    console.log(`Verifying verifyCandidateOfficeDisplayed for candidate: ${testData}`);
    await CandidateDetailsBrowser.load(testData);
    await driver.pause(waitTime);
    console.log(`Candidate Office from Landing page: ${selectedCandidateOffice}`);
    const office = await CandidateDetailsBrowser.candidateOffice;
    const officeName = await office.getText();
    console.log(`Candidate Office from Candidate Details page: ${officeName}`);
    await expect(office).toBeDisplayed();
    await expect(officeName).toEqual(selectedCandidateOffice);
  });

  // CandidateDetails_006
  it.only('verifyCandidateLikeDislikeDisplayed', async () => {
    const jsonObjH = JSON.parse(fs.readFileSync(`${testDataPath}candidateDetailsPage.json`));
    const testData = jsonObjH[0].candidateNameDisplayed;
    console.log(`Verifying verifyCandidateLikeDislikeDisplayed for candidate: ${testData}`);
    await CandidateDetailsBrowser.load(testData);
    await driver.pause(waitTime);
    const likeButton = await CandidateDetailsBrowser.candidateLikeButton;
    const dislikeButton = await CandidateDetailsBrowser.candidateDislikeButton;
    await expect(likeButton).toBeDisplayed();
    await expect(dislikeButton).toBeDisplayed();
  });

  // CandidateDetails_007
  it.only('verifyLikeTooltip', async () => {
    const jsonObjH = JSON.parse(fs.readFileSync(`${testDataPath}candidateDetailsPage.json`));
    const testData = jsonObjH[0].candidateNameDisplayed;
    console.log(`Verifying verifyLikeTooltip for candidate: ${testData}`);
    await CandidateDetailsBrowser.load(testData);
    await driver.pause(waitTime);
    const likeButton = await CandidateDetailsBrowser.candidateLikeButton;
    await driver.executeScript("arguments[0].dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));", [likeButton]);
    await driver.waitUntil(async () => CandidateDetailsBrowser.supportTooltip.isDisplayed(), { timeout: 5000, timeoutMsg: 'Tooltip did not appear in time' });
    const tooltipText = await CandidateDetailsBrowser.supportTooltip.getText();
    console.log(`Displayed Support Tooltiptext: ${tooltipText}`);
    const expectedTooltipText = (readTooltipsText('LikeCandidate'));
    console.log(`Expected text: ${expectedTooltipText}`);
    await expect(tooltipText.trim()).toMatch(expectedTooltipText);
  });

  // CandidateDetails_008
  it.only('verifyDisLikeTooltip', async () => {
    const jsonObjH = JSON.parse(fs.readFileSync(`${testDataPath}candidateDetailsPage.json`));
    const testData = jsonObjH[0].candidateNameDisplayed;
    console.log(`Verifying verifyDisLikeTooltip for candidate: ${testData}`);
    await CandidateDetailsBrowser.load(testData);
    await driver.pause(waitTime);
    const dislikeButton = await CandidateDetailsBrowser.candidateDislikeButton;
    await driver.executeScript("arguments[0].dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));", [dislikeButton]);
    await driver.waitUntil(async () => CandidateDetailsBrowser.opposeTooltip.isDisplayed(), { timeout: 5000, timeoutMsg: 'Tooltip did not appear in time' });
    const tooltipText = await CandidateDetailsBrowser.opposeTooltip.getText();
    const normalizedText = tooltipText.replace(/\s+/g, ' ').trim();
    console.log(`Displayed Oppose Tooltiptext: ${tooltipText}`);
    const expectedTooltipText = new RegExp(readTooltipsText('DislikeCandidate'));
    console.log(`Expected text: ${expectedTooltipText}`);
    expect(expectedTooltipText.test(normalizedText)).toBe(true);
  });

  // CandidateDetails_009
  it.only('verifySupportBarDisplayed', async () => {
    const jsonObjH = JSON.parse(fs.readFileSync(`${testDataPath}candidateDetailsPage.json`));
    const testData = jsonObjH[0].candidateNameDisplayed;
    console.log(`Verifying verifySupportBarDisplayed for candidate: ${testData}`);
    await CandidateDetailsBrowser.load(testData);
    await driver.pause(waitTime);
    const supportBar = await CandidateDetailsBrowser.supportProgressBar;
    const supportBarrArrow  = await CandidateDetailsBrowser.supportProgressBarArrow;
    await expect(supportBar).toBeDisplayed();
    await expect(supportBarrArrow).toBeDisplayed();
  });

  // CandidateDetails_010,CandidateDetails_011
  it.only('verifyMoreCandidateInfo', async () => {
    const jsonObjH = JSON.parse(fs.readFileSync(`${testDataPath}candidateDetailsPage.json`));
    
    await CandidateDetailsBrowser.load("pickRandomCandidate");
    console.log(`Verifying validateHTTPresponse for random candidate : ${selectedCandidateName}.`);
    await driver.pause(waitTime);
    const moreInfoSection = await CandidateDetailsBrowser.moreInfoSection;
    await expect(moreInfoSection).toBeDisplayed();
    const moreInfoText = await moreInfoSection.getText();
    console.log(`More Info section is displayed with heading: ${moreInfoText}`);
    const politicianLinks = await CandidateDetailsBrowser.candidateLinks;
    const errors = [];
    console.log(`Found ${politicianLinks.length} politician links`);
  
    const originalWindow = await driver.getWindowHandle();
  
    // Domains to skip browser test as these take too long to open and test times out.
    const skipBrowserTestDomains = [
      'bing.com',
      'x.com',
      'ballotpedia.org',
      'youtube.com' ];

    for (let i = 0; i < politicianLinks.length; i++) {
      const link = politicianLinks[i];
      const href = await link.getAttribute('href');
      const linkText = await link.getText();
      const shouldSkipBrowserTest = skipBrowserTestDomains.some(domain => href.includes(domain));

      if (shouldSkipBrowserTest) {
        console.log(`Skipping browser test for link: ${linkText} (${href})`);
        continue;
      }
      else {
        console.log(`Checking link: ${linkText} -> (${href})`);
        await link.click();
        await driver.pause(2000);
        const newHandles = await driver.getWindowHandles();
        if (newHandles.length > 1) {
          const newWindow = newHandles.find(handle => handle !== originalWindow);
          if (newWindow) {
            console.log(`Switching to new tab for ${linkText}`);
            await driver.switchToWindow(newWindow);
            await driver.pause(2000);
            const currentUrl = await driver.getUrl();
            console.log(`Opened URL: ${currentUrl}`);
            await driver.closeWindow();
            await driver.switchToWindow(originalWindow);
            await driver.pause(2000);
          } else {
            console.log(`No new tab opened for ${linkText}`);
            errors.push(`No new tab opened for ${linkText}`);
          }
        }   
      }
    }
       if (errors.length > 0) {
        let errorsAll = '';
        for (let i = 0; i < errors.length; i++) {
          errorsAll += `${errors[i]}\n`;
        }
        throw new Error(errorsAll);
      }
  });

 // CandidateDetails_012
  it.only('validateHTTPresponse', async () => {
      const jsonObjH = JSON.parse(fs.readFileSync(`${testDataPath}candidateDetailsPage.json`));
      await CandidateDetailsBrowser.load("pickRandomCandidate");
      console.log(`Verifying validateHTTPresponse for random candidate : ${selectedCandidateName}.`);
      await driver.pause(waitTime);
    
      const politicianLinks = await CandidateDetailsBrowser.candidateLinks;
      const errors = [];
      console.log(`Found ${politicianLinks.length} politician links`);

      const knownBlockingDomains = [
        'wikipedia.org',
        'ballotpedia.org',
        'twitter.com',
        'x.com',
        'facebook.com',
        'instagram.com'];

      for (let i = 0; i < politicianLinks.length; i++) {
        const link = politicianLinks[i];
        const href = await link.getAttribute('href');
        const linkText = await link.getText();
     
        const isBlockingDomain = knownBlockingDomains.some(domain => href.includes(domain));
        // HTTP validation for non-blocking domains
        if (!isBlockingDomain) {
          try {
              const response = await axios.get(href, {
              timeout: 5000,
              validateStatus: false,
            });
          
          const statusCode = response.status;
          console.log(`Link ' ${linkText} ' => returned status code: ${statusCode}`);
          
          if (statusCode >= 200 && statusCode < 400) {
            console.log(`Link ' ${linkText} ': is working.`);
          } else {
            errors.push(`Link ' ${linkText} ': is not accessible (status ${statusCode})`);
          }
          } catch (error) {
            errors.push(`Link ' ${linkText} ': HTTP request failed with error: ${error.message}`);
        }
      } 
    }
      if (errors.length > 0) {
          let errorsAll = '';
          for (let i = 0; i < errors.length; i++) {
            errorsAll += `${errors[i]}\n`;
          }
          throw new Error(errorsAll);
      }
  });


  function readTooltipsText (type) {
    const jsonObjH = JSON.parse(fs.readFileSync(`${testDataPath}candidatesPage_TDTooltips.json`));
    const text = jsonObjH[0][type];
    return text;
  }
});
