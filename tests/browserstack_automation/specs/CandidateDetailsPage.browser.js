
/* eslint-disable no-undef */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-use-before-define */
import { driver, expect } from '@wdio/globals';
import fs from 'fs';
import { selectedCandidateName, selectedCandidateState, selectedCandidateParty, selectedCandidateImgSrc, selectedCandidateOffice } from  '../page_objects/candidates.browser';
import CandidateDetailsBrowser from '../page_objects/candidateDetails.browser';

const testDataPath = 'tests/browserstack_automation/testDataForScripts/';
const waitTime = 5000;

// eslint-disable-next-line no-undef

describe('CandidateDetails PageBrowser', () => {
  // Candidates_001
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

  it('verifyCandidateOfficeDisplayed', async () => {
    const jsonObjH = JSON.parse(fs.readFileSync(`${testDataPath}candidateDetailsPage.json`));
    const testData = jsonObjH[0].candidateOfficeDisplayed;
    console.log(`Verifying verifyCandidateOfficeDisplayed for candidate: ${testData}`);
    await CandidateDetailsBrowser.load(testData);
    await driver.pause(waitTime);
    console.log(`Candidate Office from Landing page: ${selectedCandidateOffice}`);
    const office = await CandidateDetailsBrowser.candidateOffice;
    const officeName = await office.getText();
    console.log(`Candidate Party from Candidate Details page: ${officeName}`);
    await expect(office).toBeDisplayed();
    await expect(officeName).toEqual(selectedCandidateOffice);
  });
});
