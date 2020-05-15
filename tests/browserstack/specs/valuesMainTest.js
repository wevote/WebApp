const { simpleClick, simpleTextInput, scrollIntoViewSimple } = require('../utils');

const ANDROID_CONTEXT = 'WEBVIEW_org.wevote.cordova';
const IOS_CONTEXT = 'WEBVIEW_1';
const PAUSE_DURATION_MICROSECONDS = 250;

describe('Basic cross-platform We Vote test',  () => {
  it('should load the app so we can run tests', async () => {
    const { isCordovaFromAppStore, isMobileScreenSize } = driver.config.capabilities;
    const WEB_APP_ROOT_URL = driver.config.webAppRootUrl;
    const isDesktopScreenSize = !isMobileScreenSize;
    const xssTest = '<script>alert(1)</script>';
    const publicFigureOrOrganizationFollowSelector = '[id^=positionItemFollowToggleFollow-undefined-wv02org]';
    const publicFigureOrOrganizationDropDownSelector = '[id^=positionItemFollowToggleDropdown-undefined-wv02org]';
    const publicFigureOrOrganizationUnfollowSelector = '[id^=positionItemFollowToggleUnfollow-undefined-wv02org]';
    const publicFigureOrOrganizationIgnoreSelector = '[id^=positionItemFollowToggleIgnore-undefined-wv02org]';
    const publicFigureOrOrganizationUnignoreSelector = '[id^=positionItemFollowToggleStopIgnoring-undefined-wv02org]';
    const organizationSection = '#mainContainer:nth-child(4)';

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
      await browser.url(`${WEB_APP_ROOT_URL}/values`);
    }

    await browser.pause(PAUSE_DURATION_MICROSECONDS * 5);

    // //////////////////////
    // Test "Values to Follow" section
    await simpleClick('issueFollowButton'); // Follow value
    await simpleClick('toggle-button'); // Click dropdown button
    await simpleClick('unfollowValue'); // Unfollow value
    await simpleClick('valueLink'); // Clicks on value
    await simpleClick('issueFollowButton'); // Follow value
    await simpleClick('toggle-button'); // Click dropdown button
    await simpleClick('unfollowValue'); // Unfollow value
    const noEndorsementsCheck = await $('#noEndorsements');
    if (await noEndorsementsCheck.isExisting()) { // Check for Endorsements
      const returnUrl = await browser.getUrl(); // Get current url
      await simpleClick('addEndorsements'); // Click "Add Endorsements"
      await browser.url(returnUrl); // Return to previous page
    } else {
      const publicFigureOrOrganizationFollow = await $(publicFigureOrOrganizationFollowSelector);
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      await publicFigureOrOrganizationFollow.click(); // Follow endorsement
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      const publicFigureOrOrganizationDropDown = await $(publicFigureOrOrganizationDropDownSelector);
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      await publicFigureOrOrganizationDropDown.click(); // Click dropdown button
      await browser.pause(PAUSE_DURATION_MICROSECONDS * 2);
      const publicFigureOrOrganizationUnfollow = await $(publicFigureOrOrganizationUnfollowSelector);
      await browser.pause(PAUSE_DURATION_MICROSECONDS * 2);
      await publicFigureOrOrganizationUnfollow.click(); // Unfollow endorsement
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      await publicFigureOrOrganizationDropDown.click(); // Click dropdown button
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      await publicFigureOrOrganizationFollow.click(); // Follow endorsement
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      await publicFigureOrOrganizationDropDown.click(); // Click dropdown button
      await browser.pause(PAUSE_DURATION_MICROSECONDS * 2);
      await publicFigureOrOrganizationUnfollow.click(); // Unfollow endorsement
      await browser.pause(PAUSE_DURATION_MICROSECONDS * 2);
      await publicFigureOrOrganizationDropDown.click(); // Click dropdown button
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      const publicFigureOrOrganizationIgnore = await $(publicFigureOrOrganizationIgnoreSelector);
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      await publicFigureOrOrganizationIgnore.click(); // Click ignore button
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      await publicFigureOrOrganizationDropDown.click(); // Click dropdown button
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      const publicFigureOrOrganizationUnignore = await $(publicFigureOrOrganizationUnignoreSelector);
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      await publicFigureOrOrganizationUnignore.click(); // Click "Unignore"
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      await simpleClick('readMore'); // Clicks "More"
      await simpleClick('showLess'); // Clicks "Show Less"
    }
    await scrollIntoViewSimple('valuesListTitle'); // Scrolls to "Explore More Values"
    const valueFollow = await $$('issueFollowButton')[1];
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    if (valueFollow) {
      await valueFollow.click(); // Follow value
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      await simpleClick('toggle-button'); // Click dropdown button // click dropdown button
      await simpleClick('unfollowValue'); // Unfollow value
    }
    await simpleClick('valueListLink'); // Clicks on value
    await simpleClick('backToLinkTabHeader'); // Clicks on "Back"
    await simpleClick('backToLinkTabHeader'); // Clicks on "Back"
    await simpleClick('valuesToFollowPreviewShowMoreId'); // Clicks on "Explore all values"
    await simpleClick('issueFollowButton'); // Follow value
    await simpleClick('toggle-button'); // Click dropdown button
    await simpleClick('unfollowValue'); // Unfollow value
    await simpleTextInput('search_input', xssTest); // Test for xss
    await simpleClick('search-clear'); // Clear search
    await simpleTextInput('search_input', xssTest); // Test for xss
    await simpleClick('search'); // Click search icon
    await simpleClick('backToLinkTabHeader'); // Clicks on "Back"

    // //////////////////////
    // Test "Public Figures to Follow" section
    await scrollIntoViewSimple('publicFiguresSection'); // Scrolls to "Public Figures to Follow"
    await browser.pause(PAUSE_DURATION_MICROSECONDS * 10);
    await simpleClick('publicFiguresToFollowPreviewShowMoreId'); // Click "Explore more public figures"
    await simpleClick('backToLinkTabHeader'); // Clicks on "Back"
    await scrollIntoViewSimple('publicFiguresSection'); // Scrolls to "Public Figures to Follow"
    let publicFigureOrOrganizationFollow = await $(publicFigureOrOrganizationFollowSelector);
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await publicFigureOrOrganizationFollow.click(); // Follow endorsement
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    const publicFigureOrOrganizationDropDown = await $(publicFigureOrOrganizationDropDownSelector);
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await publicFigureOrOrganizationDropDown.click(); // Click dropdown button
    await browser.pause(PAUSE_DURATION_MICROSECONDS * 2);
    const publicFigureOrOrganizationUnfollow = await $(publicFigureOrOrganizationUnfollowSelector);
    await browser.pause(PAUSE_DURATION_MICROSECONDS * 2);
    await publicFigureOrOrganizationUnfollow.click(); // Unfollow endorsement
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await publicFigureOrOrganizationDropDown.click(); // Click dropdown button
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await publicFigureOrOrganizationFollow.click(); // Follow endorsement
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await publicFigureOrOrganizationDropDown.click(); // Click dropdown button
    await browser.pause(PAUSE_DURATION_MICROSECONDS * 2);
    await publicFigureOrOrganizationUnfollow.click(); // Unfollow endorsement
    await browser.pause(PAUSE_DURATION_MICROSECONDS * 2);
    await publicFigureOrOrganizationDropDown.click(); // Click dropdown button
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    const publicFigureOrOrganizationIgnore = await $(publicFigureOrOrganizationIgnoreSelector);
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await publicFigureOrOrganizationIgnore.click(); // Click ignore button
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await publicFigureOrOrganizationDropDown.click(); // Click dropdown button
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    const publicFigureOrOrganizationUnignore = await $(publicFigureOrOrganizationUnignoreSelector);
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await publicFigureOrOrganizationUnignore.click(); // Click "Unignore"
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick('readMore'); // Clicks "More"
    await simpleClick('showLess'); // Clicks "Show Less"
    await simpleClick('organizationOrPublicFigureLink'); // Click public figure link
    await browser.url(`${WEB_APP_ROOT_URL}/values`); // Return to values page
    await scrollIntoViewSimple('publicFiguresSection'); // Scrolls to "Public Figures to Follow"

    // //////////////////////
    // Tests endorsements and twitter sign in
    if (isDesktopScreenSize) {                 // Only for desktop
      await simpleClick('twitterSignIn-splitIconButton'); // Clicks on "Find Public Opinions"
      await browser.url(`${WEB_APP_ROOT_URL}/values`); // Return to values page
      await simpleClick('undefined-splitIconButton'); // Clicks on "Add Endorsements"
      await browser.url(`${WEB_APP_ROOT_URL}/values`); // Return to values page
    }

    // //////////////////////
    // Tests organizations to follow
    await scrollIntoViewSimple('organizationsSection'); // Scrolls to "Organizations to Follow"
    await simpleClick('readMore'); // Clicks "More"
    await simpleClick('showLess'); // Clicks "Show Less"
    const organizationOrPublicFigureLink = await $(`${organizationSection} #organizationOrPublicFigureLink`);
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await organizationOrPublicFigureLink.click(); // Click organization link
    await browser.url(`${WEB_APP_ROOT_URL}/values`); // Return to values page
    await scrollIntoViewSimple('publicFiguresSection'); // Scrolls to "Public Figures to Follow"
    await scrollIntoViewSimple('organizationsSection'); // Scrolls to "Organizations to Follow"
    publicFigureOrOrganizationFollow = await $(`${organizationSection} ${publicFigureOrOrganizationFollowSelector}`);
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await publicFigureOrOrganizationFollow.click(); // Follow endorsement
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick('organizationsToFollowPreviewShowMoreId'); // Clicks on "Explore more organizations"
    await simpleClick('backToLinkTabHeader'); // Clicks on "Back"
    /*  Use if organization does not disappear after clicking follow */
    //  publicFigureOrOrganizationDropDown = await $(`${organizationSection} ${publicFigureOrOrganizationDropDownSelector}`);
    //  await browser.pause(PAUSE_DURATION_MICROSECONDS);
    //  await publicFigureOrOrganizationDropDown.click(); // Click dropdown button
    //  await browser.pause(PAUSE_DURATION_MICROSECONDS * 2);
    //  publicFigureOrOrganizationUnfollow = await $(`${organizationSection} ${publicFigureOrOrganizationUnfollowSelector}`);
    //  await browser.pause(PAUSE_DURATION_MICROSECONDS * 2);
    //  await publicFigureOrOrganizationUnfollow.click(); // Unfollow endorsement
    //  await browser.pause(PAUSE_DURATION_MICROSECONDS);
    //  await publicFigureOrOrganizationDropDown.click(); // Click dropdown button
    //  await browser.pause(PAUSE_DURATION_MICROSECONDS);
    //  await publicFigureOrOrganizationFollow.click(); // Follow endorsement
    //  await browser.pause(PAUSE_DURATION_MICROSECONDS);
    //  await publicFigureOrOrganizationDropDown.click(); // Click dropdown button
    //  await browser.pause(PAUSE_DURATION_MICROSECONDS * 2);
    //  await publicFigureOrOrganizationUnfollow.click(); // Unfollow endorsement
    //  await browser.pause(PAUSE_DURATION_MICROSECONDS * 2);
    //  await publicFigureOrOrganizationDropDown.click(); // Click dropdown button
    //  await browser.pause(PAUSE_DURATION_MICROSECONDS);
    //  publicFigureOrOrganizationIgnore = await $(`${organizationSection} ${publicFigureOrOrganizationIgnoreSelector}`);
    //  await browser.pause(PAUSE_DURATION_MICROSECONDS);
    //  await publicFigureOrOrganizationIgnore.click(); // Click ignore button
    //  await browser.pause(PAUSE_DURATION_MICROSECONDS);
    //  await publicFigureOrOrganizationDropDown.click(); // Click dropdown button
    //  await browser.pause(PAUSE_DURATION_MICROSECONDS);
    //  publicFigureOrOrganizationUnignore = await $(`${organizationSection} ${publicFigureOrOrganizationUnignoreSelector}`);
    //  await browser.pause(PAUSE_DURATION_MICROSECONDS);
    //  await publicFigureOrOrganizationUnignore.click(); // Click "Unignore"
    //  await browser.pause(PAUSE_DURATION_MICROSECONDS);
  });
});

