const assert = require('assert');
const { clearTextInput, scrollIntoViewSimple, simpleClick, selectClick, simpleTextInput, selectTextInput } = require('../utils');

const ANDROID_CONTEXT = 'WEBVIEW_org.wevote.cordova';
const IOS_CONTEXT = 'WEBVIEW_';
const PAUSE_DURATION_MICROSECONDS = 3000;
const PAUSE_DURATION_BALLOT_LOAD = 6000;
const { device, browserName, isAndroid, isCordovaFromAppStore, isMobileScreenSize, isIOS } = driver.config.capabilities;
// Remember that tablets should be considered desktop screen size
const isDesktopScreenSize = !isMobileScreenSize;
const changeAddressHeaderBar = (isDesktopScreenSize) ? 'changeAddressOrElectionHeaderBarElection' : 'changeAddressOnlyHeaderBar';
const ballotBadgePlatformPrefixID = (isDesktopScreenSize) ? 'ballotBadgeDesktop' : 'ballotBadgeMobile';

let isChrome = false;
let isS8 = false;
let isGooglePixel3 = false;
let isTablet = false;

// Check if device capability is used
if (browserName) {
  isChrome = browserName.includes('Chrome');
}

if (device) {
  isS8 = device.includes('Samsung Galaxy S8');
  isGooglePixel3 = device.includes('Google Pixel 3');
  isTablet = device.includes('Tab');
}

const personalizedScoreSteps = 7;
const xssTest = '<script>alert(1)</script>';
const backspace = '\uE003';

describe('Cross browser automated testing', () => {
  // Run before any test
  before(async () => {
    if (isCordovaFromAppStore) {
      // ///////////////////////////////
      // For the apps downloadable from either the Apple App Store or Android Play Store,
      // click through the onboarding screens
      await browser.pause(PAUSE_DURATION_BALLOT_LOAD * 2);
      const contexts = await driver.getContexts();
      let webview = false;
      // eslint-disable-next-line
      for (const context of contexts) {
        if ((isAndroid && context.includes(ANDROID_CONTEXT)) || (isIOS && context.includes(IOS_CONTEXT))) {
          // eslint-disable-next-line no-await-in-loop
          await driver.switchContext(context);
          webview = true;
          break;
        }
      }
      assert(webview);
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      await selectClick('div[data-index="0"] .intro-story__btn--bottom'); // Click first next button
      await selectClick('div[data-index="1"] .intro-story__btn--bottom'); // Click second next button
      await selectClick('div[data-index="2"] .intro-story__btn--bottom'); // Click third next button
      await simpleClick('ballotTabFooterBar');  // Go to ballot
    } else {
      // ///////////////////////////////
      // For the website version, open our quality testing site
      await browser.url('ballot');
    }
  });

  it('should input our address', async () =>  {
    await browser.pause(PAUSE_DURATION_BALLOT_LOAD);
    await simpleTextInput('editAddressOneHorizontalRowTextForMapSearch', 'Oakland, CA 94501'); // Focus on Location Input
    await simpleClick('editAddressOneHorizontalRowSaveButton'); // Click save
    await browser.pause(PAUSE_DURATION_BALLOT_LOAD);
  });

  it('should click through how it works', async () =>  {
    if (!isAndroid || !isCordovaFromAppStore) { // Android doesn't do this
      if (isDesktopScreenSize) {
        await simpleClick('completeYourProfileDesktopButton'); // Click 'How it works'
        await simpleClick('annotatedSlideShowStep1Next'); // Click Next
        await simpleClick('annotatedSlideShowStep2Next'); // Click Next
        await simpleClick('annotatedSlideShowStep3Next'); // Click Next
        await simpleClick('annotatedSlideShowStep4Next'); // Click Next
        await simpleClick('howItWorksGetStartedDesktopButton'); // End of How it Works Modal
        await simpleClick('enterVoterEmailAddress'); // Puts cursor in Email address text input
        await simpleClick('profileCloseSignInModal'); // Clicks on Sign Out
        await simpleClick('completeYourProfileDesktopButton'); // Clicks on Choose Interests
        await selectClick('#valuesIntroModalValueList #issues-follow-container'); // select an interest
        await scrollIntoViewSimple('valuesIntroModalNext'); // Scrolls to Next button
        await simpleClick('valuesIntroModalNext'); // Close the Interests modal
        await simpleClick('completeYourProfileDesktopButton'); // Clicks on Learn More
      } else {
        await simpleClick('completeYourProfileMobileButton'); // clicks on How it works
        await simpleClick('annotatedSlideShowStep1Next');
        await simpleClick('annotatedSlideShowStep2Next');
        await simpleClick('annotatedSlideShowStep3Next');
        await simpleClick('annotatedSlideShowStep4Next');
        await simpleClick('howItWorksGetStartedDesktopButton'); // End of How it Works Modal
        await simpleClick('enterVoterEmailAddress'); // Puts cursor in Email address text input
        await simpleClick('profileCloseSignInModal'); // Clicks on Sign Out
        await simpleClick('completeYourProfileMobileButton'); // Clicks on Choose Interests
        await selectClick('#valuesIntroModalValueList #issues-follow-container'); // select an interest
        await scrollIntoViewSimple('valuesIntroModalNext'); // Scrolls to Next button
        await simpleClick('valuesIntroModalNext'); // Close the Interests modal
        await scrollIntoViewSimple('completeYourProfileMobileButton'); // Scrolls to Confirm Address
        await simpleClick('completeYourProfileMobileButton'); // Clicks on Confirm Address
        await simpleClick('addressBoxModalSaveButton'); // clicks on save button
        await simpleClick('profileCloseSelectBallotModal'); // Clicks on close
        await simpleClick('completeYourProfileMobileButton'); // Clicks on Learn More
      }
      for (let step = 0; step < personalizedScoreSteps; step++) {
        // eslint-disable-next-line no-await-in-loop
        await simpleClick('personalizedScoreIntroModalNextButton'); // Personalized Score Modal - 7 steps */
      }
      await simpleClick('popoverCloseButton'); // Close the popover before clicking on Next
      await simpleClick('personalizedScoreIntroModalNextButton'); // Clicks on Next
      await simpleClick('personalizedScoreIntroModalNextButton'); // Clicks on Next
      await simpleClick('personalizedScoreIntroModalNextButton'); // Clicks on Next
    }
  });

  it('should test "Address and Elections"', async() => {
    await simpleClick(changeAddressHeaderBar); // Click location icon
    if (!isTablet) { // element not interactable
      await simpleClick('editAddressInPlaceModalEditButton'); // Change address
      await simpleClick('addressBoxText'); // Change address
      await clearTextInput('addressBoxText'); // Clear address
      await simpleTextInput('addressBoxText', 'Oakland, CA 94501'); // Change address
      await simpleClick('addressBoxModalSaveButton'); // Click save
      await browser.pause(PAUSE_DURATION_BALLOT_LOAD);
    } else {
      await simpleClick('profileCloseSelectBallotModal'); // Close Address and Elections modal
    }
  });

  it('should switch to US 2018 Midterm Election', async() => {
    await simpleClick(changeAddressHeaderBar); // Click location icon
    await selectClick('button.SelectBallotModal__PriorButton-sc-1kby1m3-8.kPEgxg'); // Click on Prior
    await simpleClick('ballotElectionListWithFiltersButton-6000'); // Clicks on US 2018 Midterm Election
    await browser.pause(PAUSE_DURATION_BALLOT_LOAD);
  });

  it('should click on ballot filler badges at top of page', async() => {
    await simpleClick('ballotBadgeMobileAndDesktop-All'); // Go to the All Items tab
    await simpleClick(`${ballotBadgePlatformPrefixID}-Local`);
    await simpleClick(`${ballotBadgePlatformPrefixID}-State`);
    await simpleClick(`${ballotBadgePlatformPrefixID}-Federal`);
    await simpleClick(`${ballotBadgePlatformPrefixID}-Measure`);
  });

  it('should visit measure page', async() => {
    await selectClick('[id^=measureItemCompressedChoiceYes-]'); // Click on first measure
    if (!isAndroid || !isCordovaFromAppStore) { // Element not interactable
      await selectClick('[id^=itemActionBarYesButton-measureItem-ballotItemSupportOpposeComment-]'); // Click on vote yes
      await simpleClick('profileCloseItemActionBar'); // Click close for pop up
      await selectClick('[id^=itemActionBarNoButton-measureItem-ballotItemSupportOpposeComment-]'); // Click on vote no
      await selectClick('[id^=itemActionBarNoButton-measureItem-ballotItemSupportOpposeComment-]'); // Undo opposition
      await selectClick('[id^=itemPositionStatementActionBarTextArea-]'); // Click on text area
      await selectTextInput('[id^=itemPositionStatementActionBarTextArea-]', xssTest); // Write something in Text Area
      await selectClick('[id^=itemPositionStatementActionBarSave-]'); // Click on save button
      await selectClick('[id^=itemPositionStatementActionBarEdit-]'); // Click on edit button
      await selectTextInput('[id^=itemPositionStatementActionBarTextArea-]', `${backspace}`.repeat(25)); // clear text area
      await selectClick('[id^=itemPositionStatementActionBarSave-]'); // Click on save button
    }
  });

  it('should open position display filters', async() => {
    await simpleClick('filterBaseFilters');
    await simpleClick('filterBaseFilters');
  });

  it('should follow and unfollow and endorsing organization of measure', async() => {
    if (!isCordovaFromAppStore) { // no selector on app (iOS) or element not interactable (Android)
      await selectClick('[id^=positionItemFollowToggleFollow-]'); // Follow organization
      if (isS8 || isGooglePixel3) {
        await scrollIntoViewSimple('readMore'); // Scroll down slightly
      }
      await selectClick('[id^=positionItemFollowToggleDropdown-]');
      await selectClick('[id^=positionItemFollowToggleUnfollow-]'); // Unfollow organization
    }
  });

  it('should go back', async() => {
    await simpleClick('backToLinkTabHeader');
    await browser.pause(PAUSE_DURATION_BALLOT_LOAD);
  });

  it('should visit the federal page', async() => {
    await simpleClick(`${ballotBadgePlatformPrefixID}-Federal`); // Go to federal
    await selectClick('[id^=officeItemCompressedCandidateImageAndName-]'); // Clicks the first candidate
    if (!isAndroid || !isCordovaFromAppStore) { // element not interactable
      await selectClick('[id^=itemActionBarSupportButton-candidateItem-]'); // Support the candidate
      await selectClick('[id^=itemActionBarOpposeButton-candidateItem-]'); // Oppose the candidate
      await selectClick('[id^=itemActionBarOpposeButton-candidateItem-]'); // Undo opposition
      await selectClick('[id^=itemPositionStatementActionBarTextArea-]'); // Clicks on text area
      await selectTextInput('[id^=itemPositionStatementActionBarTextArea-]', xssTest); // Write something in Text Area
      await selectClick('[id^=itemPositionStatementActionBarSave-]'); // Click on save button
      await selectClick('[id^=itemPositionStatementActionBarEdit-]'); // Click on edit button
      await selectClick('[id^=itemPositionStatementActionBarTextArea-]'); // Clicks on text area
      await selectTextInput('[id^=itemPositionStatementActionBarTextArea-]', `${backspace}`.repeat(25)); // clear text area
      await selectClick('[id^=itemPositionStatementActionBarSave-]'); // Click on save button
    }
  });

  it('should follow and unfollow an endorsing organization of candidate', async() => {
    if (!isCordovaFromAppStore) { // no selector on app (iOS) or element not interactable (Android)
      await selectClick('[id^=positionItemFollowToggleFollow-]'); // Follow organization
      if (isChrome) {
        await selectClick('[id^=positionItemFollowToggleFollow-]'); // Need to click twice on Chrome
      }
      if (isS8 || isGooglePixel3) {
        await scrollIntoViewSimple('readMore'); // Scroll down slightly
      }
      await selectClick('[id^=positionItemFollowToggleDropdown-]');
      await selectClick('[id^=positionItemFollowToggleUnfollow-]'); // Unfollow organization
    }
  });

  it('should visit organization page from candidate page', async() => {
    if (!isCordovaFromAppStore) { // no selector on app (iOS) or element not interactable (Android)
      await selectClick('[id*=-LinkToEndorsingOrganization-]'); // Click on the link to organization's page
      await selectClick('[id^=positionItemFollowToggleFollow-]'); // Follow organization
      await selectClick('[id^=positionItemFollowToggleDropdown-]');
      await selectClick('[id^=positionItemFollowToggleUnfollow-]'); // Unfollow organization
      await selectClick('[id^=positionItemFollowToggleDropdown-]');
      await selectClick('[id^=positionItemFollowToggleIgnore-]'); // Ignore organization
      await selectClick('[id^=positionItemFollowToggleDropdown-]');
      await selectClick('[id^=positionItemFollowToggleStopIgnoring-]'); // Unignore organization
      await simpleClick('backToLinkTabHeader'); // Go back to candidate page
    }
  });

  it('should go back', async() => {
    await simpleClick('backToLinkTabHeader');
    await browser.pause(PAUSE_DURATION_BALLOT_LOAD);
  });

  it('should go to the values tab', async() => {
    if (isDesktopScreenSize) {
      await simpleClick('valuesTabHeaderBar');  // Desktop screen size - HEADER TABS
    } else {
      await simpleClick('valuesTabFooterBar');  // Mobile or tablet screen size - FOOTER ICONS
    }
  });

  it('should go to the friends tab', async() => {
    if (isDesktopScreenSize) {
      await simpleClick('friendsTabHeaderBar');  // Desktop screen size - HEADER TABS
    } else {
      await simpleClick('friendsTabFooterBar');  // Mobile or tablet screen size - FOOTER ICONS
    }
    await simpleTextInput('EmailAddress', 'automated_voter1@WeVote.info');
    await selectClick('.card-main');
    await simpleClick('friendsNextButton');
  });

  it('should go to the ready tab', async() => {
    if (isDesktopScreenSize) {
      await simpleClick('readyTabHeaderBar');  // Desktop screen size - HEADER TABS
    } else {
      await simpleClick('readyTabFooterBar');  // Mobile screen size - FOOTER ICONS
    }
  });

  it('should go back to the ballot tab', async() => {
    if (isDesktopScreenSize) {
      await simpleClick('ballotTabHeaderBar');  // Desktop screen size - HEADER TABS
    } else {
      await simpleClick('ballotTabFooterBar');  // Mobile or tablet screen size - FOOTER ICONS
    }
  });
});
