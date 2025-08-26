import {$, driver, expect, browser } from '@wdio/globals';
import ReadyPage from '../page_objects/ready.page';
// import DonatePage from '../page_objects/donate.page';
import SignIn from '../page_objects/signin.page';
//import signinPage from '../page_objects/signin.page';
// import webAppConfig from '../../../src/js/config';
import { createRequire } from 'module';
import { error } from 'console';
//const require = createRequire(import.meta.url);

import fs from 'fs';
import assert from 'assert';
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
   await ReadyPage.load();
   await driver.pause(waitTime);
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
   await ReadyPage.wevoteLogo.findAndClick();
   await ReadyPage.viewUpcomingBallotButton.findAndClick();
   await driver.pause(waitTime);
   await expect(driver).not.toHaveUrl(expect.stringContaining('ready'));
 });


 // Ready_002 : In progress - locater issues
 it('Ready_002 :updateBallotAddress @BVT', async () => {
   console.log('Tcs : Ready_002 : updateBallotAddress');
   await ReadyPage.load();
   const baladd = await ReadyPage.ballotAddress.getText();
   console.log(`baladd:${baladd}`);
   await ReadyPage.updateBallotAddress('New York, NY, USA');
   await browser.pause(waitTime + 10000);
   const updatedBalAdd = await ReadyPage.ballotAddress.getText();
   console.log(`updated address:${updatedBalAdd}`);
   expect(updatedBalAdd).toContain('New York, NY, USA');
 });

 // Ready_003 - merged with ready_001

 // Ready_004
 it('Ready_004: toggleIssueFollowing - Follow/UnfollowPopular Topics', async () => {
   console.log('Tcs : Ready_004 : toggleIssueFollowing - Follow/UnfollowPopular Topics ');
   await ReadyPage.load();
   await ReadyPage.followFirstIssue();
   await driver.pause(waitTime);
   await expect(ReadyPage.toggleFollowMenuButtons).toBeElementsArrayOfSize(1);
   await ReadyPage.unfollowFirstIssue();
   await driver.pause(waitTime);
   await expect(ReadyPage.toggleFollowMenuButtons).toBeElementsArrayOfSize(0);
 });

 // Ready_005
 it('Ready_005: unfurlIssues - PopularIssues/ShowMoreIssues', async () => {
   console.log('Tcs : Ready_005 : unfurlIssues - PopularIssues/ShowMoreIssues');
   await ReadyPage.load();
   await driver.pause(waitTime);
   await expect(ReadyPage.followIssueButtons).toBeElementsArrayOfSize(6);
   await ReadyPage.unfurlIssues();
   await driver.pause(waitTime);
   await expect(ReadyPage.followIssueButtons).toBeElementsArrayOfSize({ gte: 6 });
 });


 // Ready_006
 it('Ready_006: toggleIntroduction - ShowMore-WeVoteHelpsYouList', async () => {
   console.log('Tcs : Ready_006 : toggleIntroduction - ShowMore-WeVoteHelpsYouList');
   await ReadyPage.load();
   await driver.waitUntil(async () => (ReadyPage.toggleIntroductionButton.isClickable()));
   await ReadyPage.toggleIntroductionButton.click();
   await driver.pause(waitTime);
   await expect(ReadyPage.introductionStepText).toBeElementsArrayOfSize(3);
 });


 // Ready_007
 it('Ready_007: toggleFinePrint - ShowMore-TheFinePrintList', async () => {
   console.log('Tcs : Ready_007 : toggleFinePrint - ShowMore-TheFinePrintList');
   await ReadyPage.load();
   await ReadyPage.toggleFinePrintButton.scrollIntoView();
   await driver.waitUntil(async () => (ReadyPage.toggleFinePrintButton.isClickable()));
   await ReadyPage.toggleFinePrintButton.click();
   await driver.pause(waitTime);
   await expect(ReadyPage.finePrintStepText).toBeElementsArrayOfSize(4);
 });


 // Ready_008 - signin testcases - moved to signin module
 // Ready_009 to Ready_020 ->Moving these testcases to FooterLinks :


// Ready_021
it('Ready_021: check Alert msgs - Follow Popular Topics', async () => {
 console.log('Tcs : Ready_021 : check Alert msgs - Follow Popular Topics');
 await ReadyPage.load();
 await ReadyPage.followFirstIssue();
 const alertText = await ReadyPage.followAlertMsg;
 await alertText.waitForDisplayed();
 const text = await alertText.getText();
 console.log('Alert Text displayed: '+text);
 expect(text).toMatch(/now following/i); // Case-insensitive
 });


// Ready_022
it('Ready_022: check Alert msgs - Unfollow Popular Topics', async () => {
 console.log('Tcs : Ready_022 : check Alert msgs - Unfollow Popular Topics');
 await ReadyPage.load();
 await ReadyPage.followFirstIssue();
 await driver.pause(waitTime-3000);
 await expect(ReadyPage.toggleFollowMenuButtons).toBeElementsArrayOfSize(1);
 await driver.pause(waitTime-3000);
 await ReadyPage.unfollowFirstIssue();
 const alertText1 = await ReadyPage.unfollowAlertMsg;
 await alertText1.waitForDisplayed();
 const text1 = await alertText1.getText();
 console.log('unfollow Alert Text displayed: '+text1);
 expect(text1).toMatch(/you've stopped following/i); // Case-insensitive
 });




// Ready_023
it('Ready_023: Verify Text and links -> we vote helps you - Be ready to vote', async () => {
 console.log('Tcs : Ready_023 : Verify Text and links -> we vote helps you - Be ready to vote');
 await ReadyPage.load();
 await driver.pause(waitTime);
 await ReadyPage.weVoteHelpsYouMenuItem1.click();
 await driver.pause(waitTime);
 const text = await ReadyPage.weVoteHelpsYouMenuItem1Text.getText();
 console.log("menu item1 text: "+text);
 if(text!="")
 {
 const links = await ReadyPage.weVoteHelpsYouMenuItem1Text.$$("a");

       // Extract the href attributes of all links
       const hrefs = [];
       for (const link of links) {
         //await ReadyPage.weVoteHelpsYouMenuItem1.click();
          //console.log('Link :', link);
           const href = await link.getAttribute("href");
           hrefs.push(href);
           console.log(`Link Text: ${text}, Href: ${href}`);
           await browser.execute(() => window.scrollBy(0, 700));
           await browser.pause(waitTime);
           // Click the link
           await link.click();
           await browser.pause(waitTime);

           // Wait for navigation and verify the new URL
           const currentUrl = await browser.getUrl();
           console.log(`Navigated to: ${currentUrl}`);
           expect(currentUrl).toContain(href); // Or specific validation

           // Navigate back if needed
           await browser.back();
           await browser.pause(waitTime);
           await browser.execute(() => window.scrollBy(0, 300));
           await ReadyPage.weVoteHelpsYouMenuItem1.click();
       }

       // Print the links
       console.log("Extracted Links:", hrefs);
       expect(hrefs.length).toBeGreaterThan(0); // Ensure links exist

       //check for 'Enter Your Address' link
       await ReadyPage.enterYourAddressLink.click();
       const headerText= await ReadyPage.enterYourAddressWindowHeader.getText();
       expect(headerText).toEqual('Enter Your Address');
       console.log('header text:'+ headerText);
 }
 else{
   console.log("ERROR: Menu item text cannot be empty");
 }

});


// Ready_024
it('Ready_024: Verify Text and links -> we vote helps you - Be confident in your choices', async () => {
 console.log('Tcs : Ready_024: Verify Text and links -> we vote helps you - Be confident in your choices');
 await ReadyPage.load();
 await driver.pause(waitTime);
 await ReadyPage.weVoteHelpsYouMenuItem2.click();
 await driver.pause(waitTime);
 const text = await ReadyPage.weVoteHelpsYouMenuItem2Text.getText();
 console.log("menu item1 text: "+text);
 if(text!="")
 {
        await browser.execute(() => window.scrollBy(0, 700));
       //check for 'twitter signin ' link
       await ReadyPage.linkToTwitterAcct.click();
       await browser.pause(waitTime);
       const twitterSignInButton= await SignIn.signInWithXTextElement.isDisplayed();
       console.log('twitterSignInButton displayed? :'+ twitterSignInButton);
       await SignIn.signInWithXTextElement.waitForDisplayed({ timeout: 5000 });
       const text = await SignIn.signInWithXTextElement.getText();
       console.log(`Element Text: ${text}`);
       // Assert the text
       expect(text).toBe('Sign in with X');


 }
 else{
   console.log("ERROR: Menu item text cannot be empty");
 }

});


// Ready_025
it('Ready_025: Verify Text and links -> we vote helps you - Help friends & amplify your impact', async () => {
 console.log('Tcs : Ready_025: Verify Text and links -> we vote helps you - Help friends & amplify your impact');
 await ReadyPage.load();
 await driver.pause(waitTime);
 await browser.execute(() => window.scrollBy(0, 700));
 //await driver.pause(waitTime);
 await ReadyPage.weVoteHelpsYouMenuItem3.click();
 await driver.pause(waitTime);
 const text = await ReadyPage.weVoteHelpsYouMenuItem3Text.getText();
 console.log("menu item1 text: "+text);
 if(text!="")
 {
 const links = await ReadyPage.weVoteHelpsYouMenuItem3Text.$$("a");


       // Extract the href attributes of all links
       const hrefs = [];
       for (const link of links) {
         //await ReadyPage.weVoteHelpsYouMenuItem1.click();
           const href = await link.getAttribute("href");
           hrefs.push(href);
           //console.log(`Link Text: ${text}, Href: ${href}`);

           await browser.execute(() => window.scrollBy(0, 300));
           await browser.pause(waitTime);
           // Click the link
           await link.click();
           await browser.pause(waitTime);


           // Wait for navigation and verify the new URL
           const currentUrl = await browser.getUrl();
           console.log(`Navigated to: ${currentUrl}`);
           expect(currentUrl).toContain(href); // Or specific validation


           // Navigate back
           await browser.back();
           await driver.pause(waitTime);
           await browser.execute(() => window.scrollBy(0, 600));
           await ReadyPage.weVoteHelpsYouMenuItem3.click();
           await driver.pause(waitTime);
       }
 }
 else{
   console.log("ERROR: Menu item text cannot be empty");
 }

});


// Ready_026
it('Ready_026: Verify Text and links -> The fine print: You cannot cast your vote electronically', async () => {
 console.log('Tcs : Ready_026 : Verify Text and links -> The fine print: You cannot cast your vote electronically');
 await ReadyPage.load();
 await driver.pause(waitTime);
 await browser.execute(() => window.scrollBy(0, 600));
 await ReadyPage.finePrintMenuItema.click();
 await driver.pause(waitTime);
 const text = await ReadyPage.readyFinePrintStepTexta.getText();
 console.log("menu item1 text: "+text);
 expect(text).toExist();
 if(text!="")
 {
   console.log("PASS: The text is not blank");
 }
 else{
   console.log("ERROR: Menu item text cannot be empty");
 }

});


// Ready_027
it('Ready_027: Verify Text and links -> The fine print: WeVote does not represent a government entity', async () => {
 console.log('Tcs : Ready_027 : Verify Text and links -> The fine print: WeVote does not represent a government entity');
 await ReadyPage.load();
 await driver.pause(waitTime);
 await browser.execute(() => window.scrollBy(0, 600));
 await ReadyPage.finePrintMenuItemb.click();
 await driver.pause(waitTime);
 const text = await ReadyPage.readyFinePrintStepTextb.getText();
 console.log("menu item1 text: "+text);
 expect(text).toExist();
 if(text!="")
 {
   console.log("PASS: The text is not blank");
 }
 else{
   console.log("ERROR: Menu item text cannot be empty");
 }

});


// Ready_028
it('Ready_028: Verify Text and links -> The fine print: - Please make sure you are registered to vote', async () => {
 console.log('Tcs : Ready_028 : Verify Text and links -> The fine print: - Please make sure you are registered to vote');
 await ReadyPage.load();
 //await driver.pause(waitTime);
 await browser.execute(() => window.scrollBy(0, 600));
 await ReadyPage.finePrintMenuItemc.click();
 await driver.pause(waitTime);
 const text = await ReadyPage.readyFinePrintStepTextc.getText();
 console.log("menu item1 text: "+text);
 expect(text).toExist();
 if(text!="")
 {
   console.log("PASS: The text is not blank");
 }
 else{
   console.log("ERROR: Menu item text cannot be empty");
 }

});


// Ready_029
it('Ready_029: Verify Text and links -> The fine print:- How your data is used & protected ', async () => {
 console.log('Tcs : Ready_029: Verify Text and links -> The fine print:- How your data is used & protected');
 await ReadyPage.load();
 await driver.pause(waitTime);
 await browser.execute(() => window.scrollBy(0, 600));
 await ReadyPage.finePrintMenuItemd.click();
 await driver.pause(waitTime);
 const text = await ReadyPage.readyFinePrintStepTextd.getText();
 console.log("menu item1 text: "+text);
 if(text!="")
 {
 const links = await ReadyPage.readyFinePrintStepTextd.$$("a");


       // Extract the href attributes of all links
       const hrefs = [];
       for (const link of links) {
         //await ReadyPage.weVoteHelpsYouMenuItem1.click();
           const href = await link.getAttribute("href");
           hrefs.push(href);
           //console.log(`Link Text: ${text}, Href: ${href}`);

           await browser.execute(() => window.scrollBy(0, 600));
           await driver.pause(waitTime);
           // Click the link
           await link.click();
           await browser.pause(waitTime);


           // Wait for navigation and verify the new URL
           const currentUrl = await browser.getUrl();
           console.log(`Navigated to: ${currentUrl}`);
           expect(currentUrl).toContain(href); // Or specific validation


           // Navigate back
           await browser.back();
           await browser.execute(() => window.scrollBy(0, 600));
           await driver.pause(waitTime);
           await ReadyPage.finePrintMenuItemd.click();
       }
 }
 else{
   console.log("ERROR: Menu item text cannot be empty");
 }

});

// Ready_030, Ready_031
it('Ready_030,Ready_31: Verify tooltip msgs on pointing to topic name, topic icon', async () => {
 console.log('Tcs : Ready_030,Ready_31: Verify tooltip msgs on pointing to topic name, topic icon');
 // Read topics from the JSON file
 const popTopics = JSON.parse(fs.readFileSync(`${testDataPath}popularTopics.json`, 'utf8')).topics1;
  // Function to point to an element and verify the tooltip
 async function pointToElementAndVerifyTooltip(selectorType, selectorValue) {
   let elementXPath;
   let tooltipSelector;
   var element1;
   try{
      // calling fn to find the topic element
     element1=await findTopicElement(selectorType, selectorValue) ;
      // Check if the element or its parent/grandparent is a link
     let parentElement = await element1.parentElement();  // Get the parent element
     let grandParentElement = parentElement ? await parentElement.parentElement() : null;  // Get the grandparent element if possible

     // Check if parent or grandparent is an anchor <a> tag
     const isLink = (await parentElement.getTagName() === 'a') || (grandParentElement && await grandParentElement.getTagName() === 'a');

     // Assert if the element is inside a link
     assert.strictEqual(isLink, true, `${selectorValue} should be inside a link, but it's not.`);
     console.log(`${selectorValue} is a link: ${isLink}`);


     // Hover over the element to trigger the tooltip
     driver.pause(waitTime);
     await element1.moveTo();
     expect(ReadyPage.topicToolTipMsg).toExist();
     const ttmsg = await ReadyPage.topicToolTipMsg.getText();
     console.log('ttmsg:' + ttmsg);
   } catch (error) {
     console.error(`Error interacting with element: ${elementXPath}`, error);
   }
 }
  // Iterate through the topics and test the function
 for (const topic of popTopics) {
   try {
     // For h3 elements, we use the selectorType 'h3' and the topic name
     console.log('Checking tooltip for topic: ' + topic);
     await pointToElementAndVerifyTooltip('h3', topic);
      // For img elements, we use the selectorType 'img' and the topic name
     console.log('Checking tooltip for topic Image: ' + topic);
     await pointToElementAndVerifyTooltip('img', topic);
   } catch (topicError) {
     // Log the error but continue with the next topic
     console.error(`Error processing topic: ${topic}`, topicError);
   }
 }
});




// Ready_032
it('Ready_032: Verify popular topics and the icons are a link', async () => {
 console.log('Tcs : Ready_032 : Verify popular topics and the icons are a link');
 // Read topics from the JSON file
 const popTopics = JSON.parse(fs.readFileSync(`${testDataPath}popularTopics.json`, 'utf8')).topics1;
  // Function to point to an element and verify the tooltip
 async function pointToElementAndVerifyLink(selectorType, selectorValue) {
   let elementXPath;
   var element1;
   try{
   // calling fn to find the topic element
   element1=await findTopicElement(selectorType, selectorValue);

   // Check if the element or its parent/grandparent is a link
   let parentElement = await element1.parentElement();  // Get the parent element
   let grandParentElement = parentElement ? await parentElement.parentElement() : null;  // Get the grandparent element if possible

   // Check if parent or grandparent has an anchor <a> tag
   const isLink = (await parentElement.getTagName() === 'a') || (grandParentElement && await grandParentElement.getTagName() === 'a');

   // Assert if the element is inside a link
   assert.strictEqual(isLink, true, `${selectorValue} should be inside a link, but it's not.`);
   console.log(`${selectorValue} is a link: ${isLink}`);


   } catch (error) {
     console.error(`Error interacting with element: ${elementXPath}`, error);
   }
 }
  // Iterate through the topics and test the function
 for (const topic of popTopics) {
   try {
     // For h3 elements, we use the selectorType 'h3' and the topic name
     console.log('Checking link for topic :  ' + topic);
     await pointToElementAndVerifyLink('h3', topic);
      // For img elements, we use the selectorType 'img' and the topic name
     console.log('Checking link for topic Image: ' + topic);
     await pointToElementAndVerifyLink('img', topic);
   } catch (topicError) {
     // Log the error but continue with the next topic
     console.error(`Error processing topic: ${topic}`, topicError);
   }
 }
});


// Ready_033
it('Ready_033: Verify followers text and tooltip for every topic', async () => {
 console.log('Tcs : Ready_033: Verify followers text and tooltip for every topic');
 // Read topics from the JSON file
 const popTopics = JSON.parse(fs.readFileSync(`${testDataPath}popularTopics.json`, 'utf8')).topics1;


 // Function to point to an element and verify the tooltip
 async function pointToElementAndVerifyFollowersTextTooltip(selectorType, selectorValue) {
   let elementXPath;
   let tooltipSelector;
   var element1;


   try{
   // calling fn to find the topic element
   element1=await findTopicElement(selectorType, selectorValue);

   // Now, check for the followers text for the specific topic
   // XPath for followers element under the same topic card
   let followersXPath = `//h3[@id="${selectorValue}_topicName"]/ancestor::div[contains(@class, 'IssueCardWrapper-sc')]/div[contains(@class, 'IssueAdvocatesAndFollowersWrapper-sc-169wgaf-5')]/span/div[@id="followers"]`;
   const followersElement = await $(followersXPath);

   if (await followersElement.isExisting()) {
    const followersText = await followersElement.getText();
     console.log(`Followers for ${selectorValue}: ${followersText}`);
      // You can also verify if the followers text is in the expected format
     assert.ok(followersText.match(/\d{1,3}(?:,\d{3})*/), `Invalid followers text format for ${selectorValue}: ${followersText}`);
   } else {
     console.log(`Followers text not found for ${selectorValue}`);
   }
    // Hover over the element to trigger the tooltip
   await followersElement.moveTo();


 console.log(`Hovering over followers element for topic: ${selectorValue}`);
 await followersElement.moveTo();


 // Now, wait for the tooltip to appear. Tooltip is inside a div with class 'tooltip-inner'.
 const tooltipXPath = `//div[contains(@class, 'tooltip-inner')]`;
 const tooltipElement = await $(tooltipXPath);


 // Wait until the tooltip is visible
 await tooltipElement.waitForExist({ timeout: 5000 });
 await tooltipElement.waitForDisplayed({ timeout: 5000 });


 // Retrieve the tooltip text
 const tooltipText = await tooltipElement.getText();
 console.log(`Tooltip Text on followers for ${selectorValue}: ${tooltipText}`);


 // Generate the expected tooltip message
 const expectedTooltipMessage = `Follow ${selectorValue} to improve your personalized score, up-and-down your ballot.`;


 // Verify the tooltip message
 assert.strictEqual(tooltipText.includes(selectorValue), true, `Expected tooltip message to contain "${expectedTooltipMessage}", but got "${tooltipText}"`);        } catch (error) {
 console.error(`Error interacting with followers for topic: ${selectorValue}`, error);
   }
 }


 // Iterate through the topics and test the function
 for (const topic of popTopics) {
   try {
     // For h3 elements, we use the selectorType 'h3' and the topic name
     console.log('Checking followers tooltip for topic: ' + topic);
     await pointToElementAndVerifyFollowersTextTooltip('h3', topic);


     // For img elements, we use the selectorType 'img' and the topic name
     console.log('Checking followers tooltip for topic Image: ' + topic);
     await pointToElementAndVerifyFollowersTextTooltip('img', topic);
   } catch (topicError) {
     // Log the error but continue with the next topic
     console.error(`Error processing topic: ${topic}`, topicError);
   }
 }
});


// Ready_034
it('Ready_034: Verify endorsements text and link for every topic', async () => {

 console.log('Tcs : Ready_034: Verify endorsements text and link for every topic');
 const popTopics = JSON.parse(fs.readFileSync(`${testDataPath}popularTopics.json`, 'utf8')).topics1;


//Function to point to an endorsement and verify text and tooltip
 async function pointToElementAndVerifyEndorsementsTextTooltip(selectorType, selectorValue) {

 let elementXPath;
 let tooltipSelector;
 var element1;


 // Function to extract endorsements count and link for a given topic
 // Function to find the topic element (h3 or img)
 element1= await findTopicElement(selectorType, selectorValue);
 driver.pause(waitTime);


   // Adjusted XPath for finding the issue card
   const issueCardXPath = `//h3[@id="${selectorValue}_topicName"]/ancestor::div[contains(@class, 'IssueCardWrapper-sc-169wgaf-1')]`;
   const issueCard = await $(issueCardXPath); // Locate the issue card for this specific topic


   // Check if the issue card was found
   if (!(await issueCard.isExisting())) {
     throw new Error(`Issue card for "${selectorValue}" not found.`);
   }


   const linkElement = await issueCard.$('a.u-no-underline');
   const linkHref = await linkElement.getAttribute('href');
   console.log(`Link for ${selectorValue}: ${linkHref}`);


   const endorsementsElement1 = await issueCard.$('div.LinkedOrganizationCountWrapper-sc-169wgaf-13');
   const endorsementsText = await endorsementsElement1.getText();
   const endorsementsCount = await parseEndorsementsCount(endorsementsText.replace(/\D/g, ''));
   console.log(`Endorsements for ${selectorValue}: ${endorsementsCount}`);


   assert.ok(linkHref, `No link found for ${selectorValue}`);
   assert.ok(endorsementsCount > 0, `Endorsements count should be greater than 0 for ${selectorValue}`);


   //calling fn to check for tooltip
   await hoverOverEndorsementsAndGetTooltip(endorsementsElement1,selectorValue);
 }
 // Iterate through the topics and test the function
 for (const topic of popTopics) {
   try {
     // For h3 elements, we use the selectorType 'h3' and the topic name
     console.log('Checking endorsements for topic: ' + topic);
     await pointToElementAndVerifyEndorsementsTextTooltip('h3', topic);


     // For img elements, we use the selectorType 'img' and the topic name
     //console.log('Checking endorsements for topic Image: ' + topic);
     //await pointToElementAndVerifyEndorsementsTextTooltip('img', topic);
   } catch (topicError) {
     // Log the error but continue with the next topic
     console.error(`Error processing topic: ${topic}`, topicError);
   }
 }
 });




// Ready_035
it('Ready_035: Verify count of topics displayed with showMore link', async () => {
 console.log('Tcs : Ready_035: Verify count of topics displayed with showMore link');
 try {

   var h3ElementsSelector;
   // Function to collect h3 elements with 'topicName' in their id
   async function collectH3TopicIds() {
       const h3Elements = await browser.$$(`${h3ElementsSelector}`);

       // Initialize an array to store the IDs
       const h3TopicIds = [];


       for (let i = 0; i < h3Elements.length; i++) {
           const id = await h3Elements[i].getAttribute('id');
           if (id) {
               h3TopicIds.push(id);
           }
       }
       return h3TopicIds;
   }


   // Scenario Configuration
   const scenarios = [
       {
           description: 'Scenario 1: Clicking on "Show More" link',
           shouldClickShowMore: true,
           expectedLength: 36
       },
       {
           description: 'Scenario 2: Without clicking "Show More" link',
           shouldClickShowMore: false,
           expectedLength: 6
       }
   ];


   // Iterate through each scenario and run the corresponding actions
   for (const scenario of scenarios) {
       console.log(scenario.description);
       // Navigate to the target page
    await ReadyPage.load();
    await driver.pause(waitTime);


    // Shortened XPath to find all h3 elements with an id containing 'topicName'
    h3ElementsSelector = "//h3[contains(@id, 'topicName')]";


       // Click the "Show More" button if the scenario requires it
       if (scenario.shouldClickShowMore) {
           const showMoreButton = await browser.$('#showMoreLink');
           if (await showMoreButton.isExisting()) {
               console.log('Clicking "Show More" to load more topics...');
               await showMoreButton.click();
               await browser.pause(waitTime);  // Pause to wait for topics to load
           } else {
               console.log('"Show More" link not found!');
           }
       }


       // Collect topic IDs
       const h3TopicIds = await collectH3TopicIds();
       console.log(`Number of H3 IDs found: ${h3TopicIds.length}`);


       // Assert the length of the collected IDs matches the expected length
       assert.strictEqual(h3TopicIds.length, scenario.expectedLength, `Expected ${scenario.expectedLength} IDs, but found ${h3TopicIds.length}.`);
       console.log(`Assertion passed for ${scenario.description}\n`);
   }


} catch (error) {
   console.error('Error:', error);


}


});
//******************************************************************************************/

// Function to find the topic element (h3 or img)
async function findTopicElement(selectorType, selectorValue) {
  let elementXPath;

 try{
  if (selectorType === 'img') {
    elementXPath = `//img[@alt="${selectorValue}"]`;
  } else if (selectorType === 'h3') {
    if (selectorValue.includes("'")) {
      elementXPath = `//h3[contains(normalize-space(text()), concat('${selectorValue.split("'").join("', \"'\", '")}'))]`;
    } else {
      elementXPath = `//h3[contains(normalize-space(text()), "${selectorValue}")]`;
    }

  } else {
    throw new Error('Unsupported selector type. Use "img" or "h3".');
  }

  console.log(`Searching for element with XPath: ${elementXPath}`);

  await ReadyPage.load();
  await driver.pause(waitTime);
  await browser.execute(() => window.scrollBy(0, 300));
  await driver.pause(waitTime);

  let element = await $(elementXPath);
  let foundElement = await element.isExisting();
  let retryCount = 0;
  const maxRetries = 3;


  while (!foundElement && retryCount < maxRetries) {
    console.log(`Retry ${retryCount + 1}: Scrolling to load more topics...`);


    // Click "Show More" if available
    const showMoreButton = await $('#showMoreLink');
    if (await showMoreButton.isExisting()) {
      console.log('Clicking "Show More" button...');
      await showMoreButton.click();
      await driver.pause(waitTime);
    }


    // Scroll the page
    await browser.execute(() => window.scrollBy(0, 600));
    await driver.pause(waitTime);


    // Reattempt to find the element after scrolling or clicking "Show More"
    element = await $(elementXPath);
    foundElement = await element.isExisting();


    retryCount++;
  }

  if (!foundElement) {
    throw new Error(`Could not find topic "${selectorValue}" after ${maxRetries} retries.`);
  }

  console.log(`Element for ${selectorValue} found.`);
  console.log(`Element text: ` + await element.getText());

  return element;
}catch{
  throw new Error('Test Failed unknown error'+error);
}
 }


//********************************************************************************** */
// Function to hover over the endorsements link and retrieve the tooltip
async function hoverOverEndorsementsAndGetTooltip(endorsementsElement1,selectorValue1) {
 await endorsementsElement1.moveTo();
 console.log(`Hovering over endorsements link for topic`);


 // Wait for the tooltip to appear
 const tooltipXPath = `//div[contains(@class, 'tooltip-inner')]`;
 const tooltipElement = await $(tooltipXPath);
 // Retrieve the tooltip text
const tooltipText = await tooltipElement.getText();
console.log(`endorsement Tooltip for ${selectorValue1}: ${tooltipText}`);


// Generate the expected tooltip message
const expectedTooltipMatch = tooltipText.match(/See endorsements from \d+ advocates/);


// Verify the tooltip message
//assert.strictEqual(tooltipText.includes(selectorValue1), true, `Expected tooltip message to contain "${expectedTooltipMessage}", but got "${tooltipText}"`);


assert.strictEqual(
 expectedTooltipMatch !== null,
 true,
 `Tooltip message mismatch. Expected part of "See endorsements from X advocates", but got "${tooltipText}"`
);
}


//*********************************************************************************************************/
async function parseEndorsementsCount(endorsementsText) {
 // Remove any non-numeric characters except '.' and 'K', 'M' (to handle decimals and shorthand)
 const numericValue = endorsementsText.replace(/[^\d.KM]/g, '').trim();
 // Handle cases for 'K' and 'M' for thousands and millions
 if (numericValue.includes('K')) {
     // Remove 'K' and multiply by 1000
     const number = parseFloat(numericValue.replace('K', '')) * 1000;
     return Math.round(number); // Round to handle decimals (e.g., 47.5K -> 47500)
 } else if (numericValue.includes('M')) {
     // Remove 'M' and multiply by 1000000
     const number = parseFloat(numericValue.replace('M', '')) * 1000000;
     return Math.round(number); // Round to handle decimals (e.g., 1.5M -> 1500000)
 } else {
     // If there's no 'K' or 'M', just parse the number as it is
     return parseInt(numericValue);
 }
}


//**************************************************************************************** */




});



