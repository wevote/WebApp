const { scrollIntoViewSimple, simpleClick, selectClick, simpleTextInput, hiddenClick, hiddenSelectClick, hiddenSelectTextInput, hiddenTextInput } = require('../utils');

const WEBVIEW = 'WEBVIEW_';
const PAUSE_DURATION_MICROSECONDS = 3000;
const PAUSE_DURATION_BALLOT_LOAD = 6000;
const { device, isAndroid, isCordovaFromAppStore, isMobileScreenSize, isIOS } = driver.config.capabilities;
const enter = '\uE007';
// Remember that tablets should be considered desktop screen size
const isDesktopScreenSize = !isMobileScreenSize;
let ballotBadgePlatformPrefixID = (isDesktopScreenSize) ? 'ballotBadgeDesktop' : 'ballotBadgeMobile';

let isS8 = false;
let isGooglePixel3 = false;
let isTab = false;

if (device) {
  isS8 = device.includes('Samsung Galaxy S8');
  isGooglePixel3 = device.includes('Google Pixel 3');
  isTab = device.includes('Tab');
}

if (isTab) {
  ballotBadgePlatformPrefixID = 'ballotBadgeDesktop';
}

const xssTest = '<script>alert(1)</script>';
const xssTest2 = "@>script>alert('1')>/script>";
const sqlTest = '\' or 1=1 -- -';

describe('Cross browser automated testing', async () => {
  // Run before any test
  before(async () => {
    if (isCordovaFromAppStore) {
      // For the apps downloadable from either the Apple App Store or Android Play Store,
      // click through the onboarding screens
      const contexts = await driver.getContexts();
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      if (await contexts[1].includes(WEBVIEW)) {
        await driver.switchContext(contexts[1]);
      } else {
        await browser.deleteSession();
      }
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      await driver.setOrientation('LANDSCAPE');
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      await driver.setOrientation('PORTRAIT');
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      await selectClick('div[data-index="0"] .intro-story__btn--bottom'); // Click first next button
      await selectClick('div[data-index="1"] .intro-story__btn--bottom'); // Click second next button
      await selectClick('div[data-index="2"] .intro-story__btn--bottom'); // Click third next button
    } else {
      // For the website version, open our quality testing site
      await browser.url('ballot');
    }
  });

  it('should go to the ready tab', async() => {
    await browser.pause(PAUSE_DURATION_BALLOT_LOAD);
    if (isDesktopScreenSize) {
      await simpleClick('readyTabHeaderBar');
    } else {
      await simpleClick('readyTabFooterBar');  // Click ready tab
    }
  });

  it('should input our address', async () =>  {
    await simpleTextInput('editAddressOneHorizontalRowTextForMapSearch', `Oakland, CA 94501${enter}`); // Focus on Location Input
    //await simpleClick('editAddressOneHorizontalRowSaveButton'); // Click save
    await browser.pause(PAUSE_DURATION_BALLOT_LOAD);
  });

  it('should go to the ballot tab', async() => {
    if (isDesktopScreenSize) {
      await simpleClick('ballotTabHeaderBar');
    } else {
      await simpleClick('ballotTabFooterBar');  // Click ballot tab
    }
  });

  it('should click through how it works', async () =>  {
    if (!(isAndroid && isCordovaFromAppStore) || isTab) { // Not on Android or iPhone Mobile App
      if (isDesktopScreenSize || isIOS || isTab) {
        await hiddenClick('completeYourProfileDesktopButton'); // Click 'How it works'
        await simpleClick('annotatedSlideShowStep1Next'); // Click Next
        await simpleClick('annotatedSlideShowStep2Next'); // Click Next
        await simpleClick('annotatedSlideShowStep3Next'); // Click Next
        await simpleClick('annotatedSlideShowStep4Next'); // Click Next
        await simpleClick('howItWorksGetStartedDesktopButton'); // End of How it Works Modal
        await simpleClick('profileCloseSignInModal'); // Clicks on "X"
      } else {
        await simpleClick('completeYourProfileMobileButton'); // clicks on How it works
        await simpleClick('annotatedSlideShowStep1Next');
        await simpleClick('annotatedSlideShowStep2Next');
        await simpleClick('annotatedSlideShowStep3Next');
        await simpleClick('annotatedSlideShowStep4Next');
        await simpleClick('howItWorksGetStartedDesktopButton'); // End of How it Works Modal
        await simpleClick('profileCloseSignInModal'); // Clicks on "X"
      }
    }
  });

  it('should test "Address and Elections"', async () => {
    if (isCordovaFromAppStore) {
      await hiddenClick('changeAddressOnlyHeaderBar');
    } else {
      await simpleClick('ballotTitleHeaderSelectBallotModal');
    }
    await selectClick('button.SelectBallotModal__PriorButton-sc-1kby1m3-8.kPEgxg'); // Click on Prior
    await simpleClick('ballotElectionListWithFiltersButton-6000'); // Clicks on US 2018 Midterm Election
    await browser.pause(PAUSE_DURATION_BALLOT_LOAD);
  });

  it('should click through choose interests', async () =>  {
    if (!(isAndroid && isCordovaFromAppStore) || isTab) { // Not on Android or iPhone Mobile App
      if (isDesktopScreenSize || isIOS || isTab) {
        await hiddenClick('completeYourProfileDesktopButton'); // Clicks on Choose Interests
        await selectClick('#valuesIntroModalValueList [id^=issueFollowButton]'); // select an interest
        await scrollIntoViewSimple('valuesIntroModalNext'); // Scrolls to Next button
        await simpleClick('valuesIntroModalNext'); // Close the Interests modal
      } else {
        await simpleClick('completeYourProfileMobileButton'); // Clicks on Choose Interests
        await selectClick('#valuesIntroModalValueList #issues-follow-container'); // select an interest
        await scrollIntoViewSimple('valuesIntroModalNext'); // Scrolls to Next button
        await simpleClick('valuesIntroModalNext'); // Close the Interests modal
        await scrollIntoViewSimple('completeYourProfileMobileButton'); // Scrolls to Confirm Address
        await simpleClick('completeYourProfileMobileButton'); // Clicks on Confirm Address
        await simpleClick('addressBoxModalSaveButton'); // clicks on save button
        await simpleClick('profileCloseSelectBallotModal'); // Clicks on close
      }
    }
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
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await hiddenSelectClick('[id^=positionItemFollowToggleFollow-]'); // Follow organization
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await hiddenSelectClick('[id^=positionItemFollowToggleDropdown-]');
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await hiddenSelectClick('[id^=positionItemFollowToggleUnfollow-]'); // Unfollow organization
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await hiddenSelectClick('[id^=positionItemFollowToggleDropdown-]');
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await hiddenSelectClick('[id^=positionItemFollowToggleIgnore-]'); // Ignore organization
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await hiddenSelectClick('[id^=positionItemFollowToggleDropdown-]');
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await hiddenSelectClick('[id^=positionItemFollowToggleStopIgnoring-]'); // Unignore organization
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
  });

  it('should go to the values tab', async() => {
    await simpleClick('backToLinkTabHeader'); // Go back to candidate page
    await simpleClick('backToLinkTabHeader');
    await browser.pause(PAUSE_DURATION_BALLOT_LOAD);
    if (isDesktopScreenSize) {
      await simpleClick('valuesTabHeaderBar');
    } else {
      await simpleClick('valuesTabFooterBar');  // Click values tab
    }
  });

  it('should go to the news tab', async() => {
    if (isDesktopScreenSize) {
      await simpleClick('activityTabHeaderBar');
      await simpleTextInput('EmailAddress-sidebar', 'automated_voter1@WeVote.info');
      await simpleTextInput('friendFirstName-sidebar', xssTest);
      await simpleTextInput('friendLastName-sidebar', sqlTest);
      await simpleTextInput('addFriendsMessage-sidebar', xssTest2);
      await selectClick('friendsNextButton-sidebar');
    } else {
      await simpleClick('newsTabFooterBar');  // Click friends tab
    }
    await browser.deleteSession();
  });
});
