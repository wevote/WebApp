import {$, driver, expect, browser } from '@wdio/globals';
import ReadyPage from '../page_objects/ready.page.mobileappIOS';
// import DonatePage from '../page_objects/donate.page';
import SignIn from '../page_objects/signin.page';
//import signinPage from '../page_objects/signin.page';
// import webAppConfig from '../../../src/js/config';
import { createRequire } from 'module';
import { error } from 'console';
//const require = createRequire(import.meta.url);

const fs = require('fs');
//const { AppiumDriver } = require('@appium/appium');
//const { capabilities } = require('../config/wdio.config'); 
const assert = require('assert');
const testDataPath = 'tests/browserstack_automation/testDataForScripts/';


const waitTime = 8000;


/* eslint-disable no-undef */
// This eslint-disable turns off warnings for describe() and it()
// We don't need those warnings, because describe() and it() are available at runtime
// https://webdriver.io/docs/pageobjects


describe('ReadyPage',  function () {
  this.timeout(9999999); 
  
 // Ready_001 and Ready_003
 it('Ready_001 and Ready_003:verifyElectionCountDownRedirect and verifyViewYourBallotRedirect', async () => {
   console.log('Tcs : Ready_001 and Ready_003 : verifyElectionCountDownRedirect and verifyViewYourBallotRedirect');
   //await ReadyPage.load();
   //await driver.pause(waitTime);
   /* await driver.waitUntil(async () => (ReadyPage.electionCountDownTitle.isClickable()));
   await ReadyPage.electionCountDownTitle.click();
   await driver.pause(waitTime + 2000);
   await browser.pause(1000);
   const handles = await browser.getWindowHandles();
   if (handles.length > 1) {
     console.log(`Switching to the second tab with handle: ${handles[1]}`);
     await browser.switchToWindow(handles[1]);


     // Validate the title of the new tab
     await expect(browser).toHaveTitle('Ballot - WeVote');
   } else {
     throw new Error('Second tab is not available.');
   }
   const currentUrl = await driver.getUrl();
   console.log(currentUrl);
   await driver.switchWindow('Ballot - WeVote');
   await driver.pause(waitTime);
   await expect(driver).not.toHaveUrl(expect.stringContaining('ready'));
   console.log('Verified verifyElectionCountDownRedirect');
   */
   await ReadyPage.wevoteLogo.click();
   await ReadyPage.headerFollowPopularTopics.isDisplayed();
   await ReadyPage.viewUpcomingBallotButton.click();
   await driver.pause(waitTime);
   expect(ReadyPage.ballotShareButton).toBeDisplayed(); 
   const ballotShareButton = await ReadyPage.ballotShareButton;
   // Check if the element is found
   const name = await ballotShareButton.getAttribute('name');
   console.log('Element name:', name); 
   expect(name).toBe('Share');

 });


 // Ready_002 : In progress - locater issues
 it('Ready_002 :updateBallotAddress', async () => {
  console.log('Tcs : Ready_002 : updateBallotAddress');
  //await ReadyPage.load();
  const baladd = await ReadyPage.ballotAddress.getText();
  console.log(`baladd:${baladd}`);
 // await  ReadyPage.ballotAddress.click();
  await browser.pause(waitTime + 10000);
  await ReadyPage.updateBallotAddress('New York, NY, USA');
  await browser.pause(waitTime);
  await ReadyPage.wevoteLogo.click();
  await browser.pause(waitTime);
  const updatedBalAdd = await ReadyPage.ballotAddress.getText();
  console.log(`updated address:${updatedBalAdd}`);
  expect(updatedBalAdd).toContain('New York, NY, USA');
});

 // Ready_003 - merged with ready_001

 // Ready_004
 it('Ready_004: toggleIssueFollowing - Follow/UnfollowPopular Topics', async () => {
   console.log('Tcs : Ready_004 : toggleIssueFollowing - Follow/UnfollowPopular Topics ');
   //await ReadyPage.load();
   await ReadyPage.followFirstIssue.click();
   await driver.pause(waitTime);
   await expect(ReadyPage.toggleFollowDropdown).toExist;
   await ReadyPage.toggleFollowDropdown.click();
   await driver.pause(waitTime);
   await ReadyPage.unfollowIssueButton.click();
   await expect(ReadyPage.followFirstIssue).toExist;  
 
 });

 // Ready_005
 it('Ready_005: unfurlIssues - PopularIssues/ShowMoreIssues', async () => {
   console.log('Tcs : Ready_005 : unfurlIssues - PopularIssues/ShowMoreIssues');
   //await ReadyPage.load();
   await driver.pause(waitTime);
   await expect(ReadyPage.followIssueButtons).toBeElementsArrayOfSize(6);
   await ReadyPage.popularTopicsShowMoreButton.click();
   await driver.pause(waitTime);
   console.log('total popular topics after clicking show more button:'+ (await ReadyPage.followIssueButtons.length).toString());
   await expect(ReadyPage.followIssueButtons).toBeElementsArrayOfSize({ gte: 6 });
 });



});