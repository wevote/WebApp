const assert = require('assert');
const { simpleClick, simpleTextInput, scrollIntoViewSimple } = require('../utils');

const ANDROID_CONTEXT = 'WEBVIEW_org.wevote.cordova';
const IOS_CONTEXT = 'WEBVIEW_1';
const PAUSE_DURATION_MICROSECONDS = 1250;

describe('Basic cross-platform We Vote test',  () => {
  it('should load the app so we can run letious tests', async () => {
    const { isCordovaFromAppStore, isMobileScreenSize } = driver.config.capabilities;
    const isDesktopScreenSize = !isMobileScreenSize;
    const sqlInjectionTest = '\' or 1=1 -- -';

    if (isCordovaFromAppStore) {
    // ///////////////////////////////
    // For the apps downloadable from either the Apple App Store or Android Play Store,
    // click through the onboarding screens
      await browser.pause(PAUSE_DURATION_MICROSECONDS * 2);
      const contexts = await driver.getContexts();
      const context = contexts.includes(ANDROID_CONTEXT) ? ANDROID_CONTEXT : IOS_CONTEXT;
      await driver.switchContext(context);
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      const firstNextButton = await $('div[data-index="0"] .intro-story__btn--bottom');
      await firstNextButton.click();
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      const secondNextButton = await $('div[data-index="1"] .intro-story__btn--bottom');
      await secondNextButton.click();
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      const thirdNextButton = await $('div[data-index="2"] .intro-story__btn--bottom');
      await thirdNextButton.click();
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
    } else {
    // ///////////////////////////////
    // For the website version, open our quality testing site
      await browser.url('https://quality.wevote.us/values');
    }

    await browser.pause(PAUSE_DURATION_MICROSECONDS);

    // //////////////////////
    // Test "Values to Follow" section
    await simpleClick('issueFollowButton'); // Follow value
    await simpleClick('toggle-button'); // Click dropdown button
    await simpleClick('unfollowValue'); // Unfollow value
    await simpleClick('valueLink'); // Clicks on value
    await simpleClick('issueFollowButton'); // Follow value
    await simpleClick('toggle-button'); // Click dropdown button
    await simpleClick('unfollowValue'); // Unfollow value
    const noEndorsementsCheck = await $('noEndorsements');
    if (await noEndorsementsCheck.isExisting()) { // Check for Endorsements
	  let returnUrl = await browser.getUrl(); // Get current url
	  await simpleClick('addEndorsements'); // Click "Add Endorsements" 
	  await browser.url(returnUrl); // Return to previous page
    } else {
	  await simpleClick('organizationOrPublicFigureFollow'); // Follow endorsement
	  await simpleClick('organizationOrPublicFigureDropDown'); // Click dropdown button
	  await simpleClick('organizationOrPublicFigureUnfollow'); // Unfollow endorsement
	  await simpleClick('organizationOrPublicFigureDropDown'); // Click dropdown button
	  await simpleClick('organizationOrPublicFigureFollowDropDown'); // Click "Follow" 
	  await simpleClick('organizationOrPublicFigureDropDown'); // Click dropdown button
	  await simpleClick('organizationOrPublicFigureUnfollow'); // Unfollow endorsement
	  await simpleClick('organizationOrPublicFigureDropDown'); // Click dropdown button
	  await simpleClick('organizationOrPublicFigureIgnore'); // Ignore endorsement
	  await simpleClick('organizationOrPublicFigureDropDown'); // Click dropdown button
	  await simpleClick('organizationOrPublicFigureUnignore'); // Unignore endorsement 
    }
	await scrollIntoViewSimple('valuesListTitle'); // Scrolls to "Explore More Values"
	await simpleClick('issueFollowButton'); // Follow value
	await simpleClick('toggle-button'); // Click dropdown button // click dropdown button
	await simpleClick('unfollowValue'); // Unfollow value
	await simpleClick('valuesListLink'); // Clicks on value 
	await simpleClick('backToLinkTabHeader'); // Clicks on "Back"
	await simpleClick('backToLinkTabHeader'); // Clicks on "Back"
    await simpleClick('valuesFollowedPreviewShowMoreId'); // Clicks on "Explore all values"
    await simpleClick('issueFollowButton'); // Follow value
    await simpleClick('toggle-button'); // Click dropdown button
	await simpleClick('unfollowValue'); // Unfollow value
	await simpleClick('search_input'); // Focus on search bar 
	await simpleTextInput(sqlInjectionTest); // Test for sql injection 
	await simpleClick('search-clear'); // Clear search
	await simpleClick('search_input'); // Focus on search bar 
	await simpleTextInput(sqlInjectionTest); // Test for sql injection 
	await simpleClick('search'); // Click search icon  
    await simpleClick('backToLinkTabHeader'); // Clicks on "Back"

    // //////////////////////
    // Test "Public Figures to Follow" section
    await scrollIntoViewSimple('publicFiguresSection'); // Scrolls to "Public Figures to Follow"
	await simpleClick('organizationOrPublicFigureFollow'); // Follow public figure
	await simpleClick('organizationOrPublicFigureDropDown'); // Click dropdown button
	await simpleClick('organizationOrPublicFigureUnfollow'); // Unfollow public figure
	await simpleClick('organizationOrPublicFigureDropDown'); // Click dropdown button
	await simpleClick('organizationOrPublicFigureFollowDropDown'); // Click "Follow" 
	await simpleClick('organizationOrPublicFigureDropDown'); // Click dropdown button
	await simpleClick('organizationOrPublicFigureUnfollow'); // Unfollow public figure
	await simpleClick('organizationOrPublicFigureDropDown'); // Click dropdown button
	await simpleClick('organizationOrPublicFigureIgnore'); // Ignore public figure
	await simpleClick('organizationOrPublicFigureDropDown'); // Click dropdown button
	await simpleClick('organizationOrPublicFigureUnignore'); // Unignore public figure 
	await simpleClick('readMore'); // Clicks "More"
	await simpleClick('showLess'); // Clicks "Show Less"
	await simpleClick('organizationOrPublicFigureLink'); // Click public figure link
	await browser.url('https://quality.wevote.us/values'); // Return to values page
    await scrollIntoViewSimple('publicFiguresSection'); // Scrolls to "Public Figures to Follow"
    await simpleClick('publicFiguresToFollowPreviewShowMoreId'); // Click "Explore more public figures"
    await simpleClick('backToLinkTabHeader'); // Clicks on "Back"
    await scrollIntoViewSimple('publicFiguresSection'); // Scrolls to "Public Figures to Follow"

    // //////////////////////
    // Tests endorsements and twitter sign in
    if (isDesktopScreenSize) {                 // Only for desktop
      await simpleClick('twitterSignIn-splitIconButton'); // Clicks on "Find Public Opinions"
      await browser.url('https://quality.wevote.us/values'); // Return to values page 
      await simpleClick('undefined-splitIconButton'); // Clicks on "Add Endorsements"
      await browser.url('https://quality.wevote.us/values'); // Return to values page
    }

    // //////////////////////
    // Tests organizations to follow
    await scrollIntoViewSimple('organizationSection'); // Scrolls to "Organizations to Follow"
	await simpleClick('organizationOrPublicFigureFollow'); // Follow organization
	await simpleClick('organizationOrPublicFigureDropDown'); // Click dropdown button
	await simpleClick('organizationOrPublicFigureUnfollow'); // Unfollow organization
	await simpleClick('organizationOrPublicFigureDropDown'); // Click dropdown button
	await simpleClick('organizationOrPublicFigureFollowDropDown'); // Click "Follow" 
	await simpleClick('organizationOrPublicFigureDropDown'); // Click dropdown button
	await simpleClick('organizationOrPublicFigureUnfollow'); // Unfollow organization
	await simpleClick('organizationOrPublicFigureDropDown'); // Click dropdown button
	await simpleClick('organizationOrPublicFigureIgnore'); // Ignore organization
	await simpleClick('organizationOrPublicFigureDropDown'); // Click dropdown button
	await simpleClick('organizationOrPublicFigureUnignore'); // Unignore organization 
	await simpleClick('readMore'); // Clicks "More"
	await simpleClick('showLess'); // Clicks "Show Less"
	await simpleClick('organizationOrPublicFigureLink'); // Click organization link
	await browser.url('https://quality.wevote.us/values'); // Return to values page
    await scrollIntoViewSimple('organizationSection'); // Scrolls to "Organizations to Follow"
    await simpleClick('organizationsToFollowPreviewShowMoreId'); // Clicks on "Explore more organizations"
    await simpleClick('backToLinkTabHeader'); // Clicks on "Back"
  });
});

