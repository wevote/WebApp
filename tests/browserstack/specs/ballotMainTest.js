const assert = require('assert');
const { clearTextInputValue, scrollIntoViewSimple, simpleClick, selectClick, simpleTextInput, selectTextInput, hiddenClick, hiddenSelectClick, hiddenSelectTextInput } = require('../utils');

const ANDROID_CONTEXT = 'WEBVIEW_org.wevote.cordova';
const IOS_CONTEXT = 'WEBVIEW_';
const PAUSE_DURATION_MICROSECONDS = 3000;
const PAUSE_DURATION_BALLOT_LOAD = 6000;
const { device, isAndroid, isCordovaFromAppStore, isMobileScreenSize, isIOS } = driver.config.capabilities;
// Remember that tablets should be considered desktop screen size
const isDesktopScreenSize = !isMobileScreenSize;
let ballotBadgePlatformPrefixID = (isDesktopScreenSize) ? 'ballotBadgeDesktop' : 'ballotBadgeMobile';

let isS8 = false;
let isGooglePixel3 = false;
let isiPhone = false;
let isiPad = false;
let isTab = false;

if (device) {
  isS8 = device.includes('Samsung Galaxy S8');
  isGooglePixel3 = device.includes('Google Pixel 3');
  isiPad = device.includes('iPad');
  isiPhone = device.includes('iPhone');
  isTab = device.includes('Tab');
}

if (isTab) {
  ballotBadgePlatformPrefixID = 'ballotBadgeDesktop';
}

const personalizedScoreSteps = 7;
const xssTest = '<script>alert(1)</script>';

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
    if (!(isCordovaFromAppStore && isIOS)) {
      await simpleTextInput('editAddressOneHorizontalRowTextForMapSearch', 'Oakland, CA 94501'); // Focus on Location Input
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

  it('should click through how it works', async () =>  {
    if (!((isAndroid || isiPhone) && isCordovaFromAppStore) || isTab) { // Not on Android or iPhone Mobile App
      if (isDesktopScreenSize || isiPad || isTab) {
        await simpleClick('completeYourProfileDesktopButton'); // Click 'How it works'
        await simpleClick('annotatedSlideShowStep1Next'); // Click Next
        await simpleClick('annotatedSlideShowStep2Next'); // Click Next
        await simpleClick('annotatedSlideShowStep3Next'); // Click Next
        await simpleClick('annotatedSlideShowStep4Next'); // Click Next
        await simpleClick('howItWorksGetStartedDesktopButton'); // End of How it Works Modal
        await simpleClick('profileCloseSignInModal'); // Clicks on "X"
        await simpleClick('completeYourProfileDesktopButton'); // Clicks on Choose Interests
        await selectClick('#valuesIntroModalValueList [id^=issueFollowButton]'); // select an interest
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
        await simpleClick('profileCloseSignInModal'); // Clicks on "X"
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
    if (isCordovaFromAppStore) {
      await hiddenClick('changeAddressOnlyHeaderBar');
    } else {
      await simpleClick('ballotTitleHeaderSelectBallotModal');
    }
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
    await hiddenSelectClick('[id^=itemActionBarYesButton-measureItem-ballotItemSupportOpposeComment-]'); // Click yes
    await simpleClick('profileCloseItemActionBar'); // Click close for pop up
    await hiddenSelectClick('[id^=itemActionBarNoButton-measureItem-ballotItemSupportOpposeComment-]'); // Click no
    await hiddenSelectClick('[id^=itemActionBarNoButton-measureItem-ballotItemSupportOpposeComment-]'); // Undo
    await hiddenSelectClick('[id^=itemPositionStatementActionBarTextArea-]'); // Click on text area
    await hiddenSelectTextInput('[id^=itemPositionStatementActionBarTextArea-]', xssTest); // Write something in Text Area
    await hiddenSelectClick('[id^=itemPositionStatementActionBarSave-]'); // Click on save button
    await hiddenSelectTextInput('[id^=itemPositionStatementActionBarTextArea-]', ''); // clear text area
    await hiddenSelectClick('[id^=itemPositionStatementActionBarSave-]'); // Click on save button
  });

  it('should open position display filters', async() => {
    await simpleClick('filterBaseFilters');
    await simpleClick('filterBaseFilters');
  });

  it('should follow and unfollow and endorsing organization of measure', async() => {
    await hiddenSelectClick('[id^=positionItemFollowToggleFollow-]'); // Follow organization
    await hiddenSelectClick('[id^=positionItemFollowToggleDropdown-]');
    await hiddenSelectClick('[id^=positionItemFollowToggleUnfollow-]'); // Unfollow organization
    if (isS8 || isGooglePixel3) {
      await scrollIntoViewSimple('readMore'); // Scroll down slightly
    }
  });

  it('should go back', async() => {
    await simpleClick('backToLinkTabHeader');
    await browser.pause(PAUSE_DURATION_BALLOT_LOAD);
  });

  it('should visit the federal page', async() => {
    await hiddenClick(`${ballotBadgePlatformPrefixID}-Federal`); // Go to federal
    await selectClick('[id^=officeItemCompressedCandidateImageAndName-]'); // Clicks the first candidate
    await hiddenSelectClick('[id^=itemActionBarSupportButton-candidateItem-]'); // Support the candidate
    await hiddenSelectClick('[id^=itemActionBarOpposeButton-candidateItem-]'); // Oppose the candidate
    await hiddenSelectClick('[id^=itemActionBarOpposeButton-candidateItem-]'); // Undo opposition
    await hiddenSelectClick('[id^=itemPositionStatementActionBarSave-]'); // Clicks on text area
    await hiddenSelectTextInput('[id^=itemPositionStatementActionBarTextArea-]', xssTest); // Write something in Text Area
    await hiddenSelectClick('[id^=itemPositionStatementActionBarSave-]'); // Click on save button
    await hiddenSelectTextInput('[id^=itemPositionStatementActionBarTextArea-]', ''); // Clear text area
    await hiddenSelectClick('[id^=itemPositionStatementActionBarSave-]'); // Click on save button
  });

  it('should follow and unfollow an endorsing organization of candidate', async() => {
    await hiddenSelectClick('[id^=positionItemFollowToggleFollow-]'); // Follow organization
    if (isS8 || isGooglePixel3) {
      await scrollIntoViewSimple('readMore'); // Scroll down slightly
    }
    await hiddenSelectClick('[id^=positionItemFollowToggleDropdown-]');
    await hiddenSelectClick('[id^=positionItemFollowToggleUnfollow-]'); // Unfollow organization
  });

  it('should visit organization page from candidate page', async() => {
    await hiddenSelectClick('[id*=-LinkToEndorsingOrganization-]'); // Click on the link to organization's page
    await hiddenSelectClick('[id^=positionItemFollowToggleFollow-]'); // Follow organization
    await hiddenSelectClick('[id^=positionItemFollowToggleDropdown-]');
    await hiddenSelectClick('[id^=positionItemFollowToggleUnfollow-]'); // Unfollow organization
    await hiddenSelectClick('[id^=positionItemFollowToggleDropdown-]');
    await hiddenSelectClick('[id^=positionItemFollowToggleIgnore-]'); // Ignore organization
    await hiddenSelectClick('[id^=positionItemFollowToggleDropdown-]');
    await hiddenSelectClick('[id^=positionItemFollowToggleStopIgnoring-]'); // Unignore organization
  });

  it('should go to the values tab', async() => {
    await simpleClick('backToLinkTabHeader'); // Go back to candidate page
    await simpleClick('backToLinkTabHeader');
    await browser.pause(PAUSE_DURATION_BALLOT_LOAD);
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
