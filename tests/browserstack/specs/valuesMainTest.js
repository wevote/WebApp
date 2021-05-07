const assert = require('assert');
const { simpleClick, selectClick, simpleTextInput, scrollIntoViewSimple, scrollIntoViewSelect, hiddenClick, clearTextInputValue, selectTextInput, hiddenTextInputNth , hiddenClickNth } = require('../utils');

const ANDROID_CONTEXT = 'WEBVIEW_org.wevote.cordova';
const IOS_CONTEXT = 'WEBVIEW_1';
const PAUSE_DURATION_MICROSECONDS = 250;
const PAUSE_DURATION_BALLOT_LOAD = 6000;
const { device, isAndroid, isCordovaFromAppStore, isMobileScreenSize, isIOS } = driver.config.capabilities;
const xssTest = '<script>alert(1)</script>';
const publicFigureOrOrganizationFollowSelector = '[id^=positionItemFollowToggleFollow-undefined-wv02org]';
const publicFigureOrOrganizationDropDownSelector = '[id^=positionItemFollowToggleDropdown-undefined-wv02org]';
const publicFigureOrOrganizationUnfollowSelector = '[id^=positionItemFollowToggleUnfollow-undefined-wv02org]';
const publicFigureOrOrganizationIgnoreSelector = '[id^=positionItemFollowToggleIgnore-undefined-wv02org]';
const publicFigureOrOrganizationUnignoreSelector = '[id^=positionItemFollowToggleStopIgnoring-undefined-wv02org]';
const organizationSection = '#mainContainer:nth-child(3)';

describe('Basic cross-platform We Vote test', async () => {
  it('should load the app so we can run tests', async () => {
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
      await browser.url('ballot');
    }
  });

  it('should input our address', async () =>  {
    await browser.pause(PAUSE_DURATION_BALLOT_LOAD);
    if (!(isCordovaFromAppStore && isIOS)) {
      await simpleTextInput('editAddressOneHorizontalRowTextForMapSearch', ''); // Clear Location Input
      await simpleTextInput('editAddressOneHorizontalRowTextForMapSearch', 'Oakland, CA 94501'); // Enter address
      await simpleClick('editAddressOneHorizontalRowSaveButton'); // Click save
    } else {
      await simpleClick('ballotIfBallotDoesNotAppear');
      await hiddenClick('editAddressInPlaceModalEditButton');
      await clearTextInputValue('addressBoxText');
      await simpleTextInput('addressBoxText', 'Oakland, CA 94501');
      await simpleClick('addressBoxModalSaveButton');
    }
    await browser.pause(PAUSE_DURATION_BALLOT_LOAD);
  });

  it('should go to the values tab', async() => {
    if (!isMobileScreenSize) {
      await simpleClick('valuesTabHeaderBar');  // Desktop screen size - HEADER TABS
    } else {
      await simpleClick('valuesTabFooterBar');  // Mobile or tablet screen size - FOOTER ICONS
    }
  });

  it('should search for “President” in the “Find Opinions / Endorsements” box', async () => {
    await hiddenTextInputNth('#findCandidatesAndOpinionsSearch', 1, 'President');
    await hiddenClickNth('[class^="MuiButtonBase-root MuiIconButton-root jss"]', 1);
    await selectTextInput('[class^="MuiInputBase-input jss"]', ''); // Clear search box
    await simpleClick('backToLinkTabHeader'); // Clicks on "Back"
  });

  it('should test "Public Figures to Follow" section', async () => {
    await simpleClick('publicFiguresToFollowPreviewShowMoreId'); // Click "Find more public figures"
    await selectTextInput('[class^="MuiInputBase-input jss"]', 'AOC'); // Enters search query
    await browser.back(); // Return to values page
    await selectClick(publicFigureOrOrganizationFollowSelector); // Follow public figure
    await simpleClick('organizationOrPublicFigureLink'); // Click public figure link
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick('filterBaseFilters');
    await simpleClick('filterBaseFilters');
    await selectTextInput('[class^="MuiInputBase-input jss"]', 'Pence'); // Enters search query
    await selectTextInput('[class^="MuiInputBase-input jss"]', ''); // Enters search query
    await selectClick('.tab-item:nth-child(3) .tab.tab-default'); // Clicks "X Followers"
    await selectClick(publicFigureOrOrganizationFollowSelector); // Follow public figure
    await selectClick(publicFigureOrOrganizationDropDownSelector); // Click dropdown button
    await selectClick(publicFigureOrOrganizationUnfollowSelector); // Unfollow endorsement
    await selectClick(publicFigureOrOrganizationDropDownSelector); // Click dropdown button
    await selectClick(publicFigureOrOrganizationIgnoreSelector); // Click ignore button
    await simpleClick('readMore'); // Clicks "More"
    await simpleClick('showLess'); // Clicks "Show Less"
  });

  it('should return to the values page', async() => {
    await browser.back();
    await browser.back(); // Return to values page
  });

  it('should tests organizations to follow', async () => {
    await scrollIntoViewSimple('organizationsSection'); // Scrolls to "Organizations to Follow"
    await simpleClick('readMore'); // Clicks "More"
    await simpleClick('showLess'); // Clicks "Show Less"
    await simpleClick('organizationsToFollowPreviewShowMoreId'); // Clicks on "Find more organizations"
    await simpleClick('islandFilterOrganizations'); // Click organizations filter
    await simpleClick('islandFilterOrganizations');
    await hiddenClickNth('#islandFilterOrganizations', 1); // Click public figures filter
    await simpleClick('islandFilterBallotItems'); // Click ballot
    await simpleClick('islandFilterBallotItems');
    await hiddenClickNth('#islandFilterOrganizations', 1);
    await selectTextInput('[class^="MuiInputBase-input jss"]', 'Sierra'); // Enters search query
    await browser.back(); // Return to values page
    await scrollIntoViewSimple('organizationsSection'); // Scrolls to "Organizations to Follow"
    await selectClick(`${organizationSection} ${publicFigureOrOrganizationFollowSelector}`);
    await selectClick(`${organizationSection} #organizationOrPublicFigureLink`); // Click organization link
    await simpleClick('filterBaseFilters');
    await simpleClick('filterBaseFilters');
    await selectTextInput('[class^="MuiInputBase-input jss"]', 'Sierra'); // Enters search query
    await selectTextInput('[class^="MuiInputBase-input jss"]', ''); // Enters search query
    await selectClick('.tab-item:nth-child(3) .tab.tab-default'); // Clicks "X Followers"
    await selectClick(`${publicFigureOrOrganizationFollowSelector}`);
    await selectClick(`${publicFigureOrOrganizationDropDownSelector}`);
    await selectClick(`${publicFigureOrOrganizationUnfollowSelector}`);
    await selectClick(`${publicFigureOrOrganizationDropDownSelector}`);
    await selectClick(`${publicFigureOrOrganizationIgnoreSelector}`);
    await selectClick(`${publicFigureOrOrganizationDropDownSelector}`);
    await selectClick(`${publicFigureOrOrganizationUnignoreSelector}`);
    await simpleClick('readMore'); // Clicks "More"
    await simpleClick('showLess'); // Clicks "Show Less"
  });

  it('should return to the values page', async() => {
    await browser.back();
    await browser.back(); // Return to values page
  });

  it('should test "Values to Follow" section', async () => {
    await scrollIntoViewSimple('organizationsToFollowPreviewShowMoreId'); // Scrolls to "Find more organizations"
    await hiddenClickNth('[id^=issueFollowButton-]', 1); // Follow value
    await hiddenClickNth('#readMore', 1); // Clicks "More"
    await simpleClick('showLess'); // Clicks "Show Less"
    await simpleClick('toggle-button'); // Click dropdown button
    await simpleClick('unfollowValue'); // Unfollow value
    await hiddenClickNth('[id^=issueFollowButton-]', 1); // Follow value
    await hiddenClickNth('#valueListLink', 1); // Click value link
    await selectClick(publicFigureOrOrganizationFollowSelector); // Follow endorsement
    await selectClick(publicFigureOrOrganizationDropDownSelector); // Click dropdown button
    await selectClick(publicFigureOrOrganizationUnfollowSelector); // Unfollow endorsement
    await selectClick(publicFigureOrOrganizationDropDownSelector); // Click dropdown button
    await selectClick(publicFigureOrOrganizationFollowSelector); // Follow endorsement
    await selectClick(publicFigureOrOrganizationUnfollowSelector); // Unfollow endorsement
    await selectClick(publicFigureOrOrganizationDropDownSelector); // Click dropdown button
    await selectClick(publicFigureOrOrganizationIgnoreSelector); // Click ignore button
    await selectClick(publicFigureOrOrganizationDropDownSelector); // Click dropdown button
    await selectClick(publicFigureOrOrganizationUnignoreSelector); // Click unignore button
    await scrollIntoViewSimple('valuesListTitle'); // Scrolls to "Explore More Values"
    await selectClick('[id^=issueFollowButton-]'); // Follow value
    await simpleClick('valueListLink'); // Clicks on value
    await simpleClick('backToLinkTabHeader'); // Clicks on "Back"
    await simpleClick('backToLinkTabHeader'); // Clicks on "Back"
    await scrollIntoViewSimple('valuesToFollowPreviewShowMoreId'); // Scrolls to "Find more organizations"
    await hiddenClickNth('#valuesToFollowPreviewShowMoreId', 1); // Clicks "Explore all values"
    await selectClick('[id^=issueFollowButton-]'); // Follow value
    await simpleClick('toggle-button'); // Click dropdown button
    await simpleClick('unfollowValue'); // Unfollow value
    await simpleTextInput('search_input', xssTest); // Test for xss
    await simpleClick('search-clear'); // Clear search
    await simpleClick('backToLinkTabHeader'); // Clicks on "Back"
  });
});
