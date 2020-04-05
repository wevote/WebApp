const assert = require('assert');
const { clearTextInputValue, clickTopLeftCornerOfElement, scrollIntoViewSimple, scrollThroughPage, setNewAddress, setNewAddressAndroid, setNewAddressIOS, simpleClick, simpleCloseBootstrapModal, simpleTextInput, stopScript } = require('../utils');

const ANDROID_CONTEXT = 'WEBVIEW_org.wevote.cordova';
const IOS_CONTEXT = 'WEBVIEW_1';
const PAUSE_DURATION_MICROSECONDS = 1250;
const PAUSE_DURATION_BALLOT_LOAD = 6000;
const PAUSE_DURATION_REVIEW_RESULTS = 3000;

describe('Basic cross-platform We Vote test',  () => {
  it('should load the app so we can run various tests', async () => {
    const {twitterUserName, twitterPassword} = driver.config;
    const {isAndroid, isCordovaFromAppStore, isMobileScreenSize, isIOS} = driver.config.capabilities;
    const isDesktopScreenSize = !isMobileScreenSize;
    const platformPrefixID = (isDesktopScreenSize) ? 'desktop' : 'mobile';
    const changeAddressHeaderBarID = (isDesktopScreenSize) ? 'changeAddressOrElectionHeaderBar' : 'changeAddressOnlyHeaderBar';
    const ballotBadgePlatformPrefixID = (isDesktopScreenSize) ? 'ballotBadgeDesktop' : 'ballotBadgeMobile';
    const measureToTestOnBallotID = 'wv02meas604';
    const organizationToFollowOnMeasureBallotID = 'wv01org14';
    const candidateToTestOnBallotID = 'wv02cand40208';
    const organizationToFollowOnCandidateBallotID = 'wv02org11971';

    if (isCordovaFromAppStore) {
      // switch contexts and click through intro
      await browser.pause(PAUSE_DURATION_BALLOT_LOAD);
      await browser.pause(PAUSE_DURATION_BALLOT_LOAD);
      const contexts = await driver.getContexts();
      const context = contexts.includes(ANDROID_CONTEXT) ? ANDROID_CONTEXT : IOS_CONTEXT;
      await driver.switchContext(context);
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      const firstNextButton = await $('div[data-index="0"] .intro-story__btn--bottom');
      await firstNextButton.click();
      await browser.pause(PAUSE_DURATION_REVIEW_RESULTS);
      const secondNextButton = await $('div[data-index="1"] .intro-story__btn--bottom');
      await secondNextButton.click();
      await browser.pause(PAUSE_DURATION_REVIEW_RESULTS);
      const thirdNextButton = await $('div[data-index="2"] .intro-story__btn--bottom');
      await thirdNextButton.click();
      await browser.pause(PAUSE_DURATION_REVIEW_RESULTS);
    } else {
      // navigate browser to WeVote QA site
      await browser.url('https://quality.wevote.us/ballot');
    }

    await browser.pause(PAUSE_DURATION_BALLOT_LOAD);
    await browser.pause(PAUSE_DURATION_BALLOT_LOAD);
    await browser.pause(PAUSE_DURATION_BALLOT_LOAD);

    // await scrollDownPage();
    // JavascriptExecutor js = (JavascriptExecutor) driver;
    // js.executeScript("window.scrollBy(0,250)", "");
    // await driver.scroll(0, 100);
    // driver.touchScroll({
    //   el: browser,
    //   xOffset: 10,
    //   yOffset: 100
    // });
    // await driver.scroll(0, 250);

    // await scrollIntoViewSimple('ballotSummaryFooter-showMoreBallotItems'); // Scroll to the "Show More Ballot Items" header at bottom of page
    const clickableItem = await $('ballotSummaryFooter-showMoreBallotItems');
    await clickableItem.scrollIntoView();
    await browser.pause(PAUSE_DURATION_MICROSECONDS);

    // ballotRoute-topOfBallot

    // // Stop/Exit the script here for now
    // assert(true);
    // await stopScript(driver);

    // // //////////////////////
    // // Sign in using Twitter, when in browser
    if (!isCordovaFromAppStore && twitterUserName && twitterPassword) {
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      await simpleClick('signInHeaderBar'); // Clicks on Sign in
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      await simpleClick('twitterSignIn-splitIconButton'); // Clicks on Twitter Sign in Button
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      await simpleTextInput('username_or_email', twitterUserName); // Enter Username or Email id
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      await simpleTextInput('password', twitterPassword); // Enter Password
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      await simpleClick('allow'); // Clicks on Authorize App
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      await simpleClick('profileAvatarHeaderBar'); // Clicks on Setting
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      await simpleClick('profilePopUpSignOut'); // Clicks on Sign Out
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
    }

    // // //////////////////////
    // // Check the positioning of the SignInModal when we click "Enter Email"
    await simpleClick('signInHeaderBar'); // Clicks on Sign in
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    if (isCordovaFromAppStore) {
      await simpleClick('emailSignIn-splitIconButton'); // Clicks "Sign in with an email" button
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      await simpleClick('cancelEmailButton'); // Clicks the cancel button
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
    } else {
      await simpleClick('enterVoterEmailAddress'); // Puts cursor in Email address text input
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      await simpleClick('profileCloseSignInModal'); // Clicks on Sign Out
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
    }

    // // //////////////////////
    // // Check the positioning of the SignInModal when we click "Enter Phone"
    await simpleClick('signInHeaderBar'); // Clicks on Sign in
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    if (isCordovaFromAppStore) {
      await simpleClick('smsSignIn-splitIconButton'); // Clicks "Sign in with a text" button
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      await simpleClick('cancelVoterPhoneSendSMS'); // Clicks the cancel button
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
    } else {
      await simpleClick('enterVoterPhone'); // Puts cursor in Phone text input
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      await simpleClick('profileCloseSignInModal'); // Clicks on Sign Out
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
    }

    // //////////////////////
    // Test "Change Address" Modal
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick(changeAddressHeaderBarID); // Open the "Change Address" modal
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick('profileCloseSelectBallotModal'); // Close the "Change Address" modal
    await browser.pause(PAUSE_DURATION_MICROSECONDS);

    // //////////////////////
    // Set the location, which will automatically choose the next upcoming election for that address
    await simpleClick(changeAddressHeaderBarID); // Opens the "Enter Your Full Address" link
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    if (isIOS && isCordovaFromAppStore) {
      await setNewAddressIOS('addressBoxText', 'Oakland, CA 94501'); // Sets the text for the address box and hits enter
    } else if (isAndroid && isCordovaFromAppStore) {
      await setNewAddressAndroid('addressBoxText', 'Oakland, CA 94501'); // Sets the text for the address box and hits enter
    } else {
      await setNewAddress('addressBoxText', 'Oakland, CA 94501'); // Sets the text for the address box and hits enter
    }
    await browser.pause(PAUSE_DURATION_BALLOT_LOAD);
    await simpleClick('addressBoxModalSaveButton'); // Clicks "Save"
    await browser.pause(PAUSE_DURATION_BALLOT_LOAD);

    // //////////////////////
    // Switch to a known election
    if (isDesktopScreenSize) {
      await simpleClick('changeAddressOrElectionHeaderBar'); // Open the "Change Address" modal
    } else {
      await simpleClick('ballotTitleHeaderSelectBallotModal'); // Opens the Ballot modal
    }
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick('ballotElectionListWithFiltersShowPriorElections'); // Clicks on "Show Prior Elections"
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick('ballotElectionListWithFiltersButton-6000'); // Clicks on US 2018 Midterm Election
    await browser.pause(PAUSE_DURATION_BALLOT_LOAD);

    // //////////////////////
    // Click on ballot filter badges at top of page
    await simpleClick(`${ballotBadgePlatformPrefixID}-State`);
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick(`${ballotBadgePlatformPrefixID}-Measure`);
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick(`${ballotBadgePlatformPrefixID}-Local`);
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick(`${ballotBadgePlatformPrefixID}-Federal`);
    await browser.pause(PAUSE_DURATION_MICROSECONDS);

    // //////////////////////
    // Visit Measure Page
    if (isCordovaFromAppStore) {
      // TODO Find how to select Measure Badge on Cordova
    } else {
      await simpleClick(`${ballotBadgePlatformPrefixID}-Measure`);  // Click on Measure Badge
    }
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick(`measureItemCompressedChoiceYes-${measureToTestOnBallotID}`); // Click on measure
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    const voteYesButtonId = `itemActionBarYesButton-measureItem-ballotItemSupportOpposeComment-${measureToTestOnBallotID}-${platformPrefixID}Version-${measureToTestOnBallotID}`; // ID of "Yes" button
    await simpleClick(voteYesButtonId);     // Click on "Yes" button
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    // Click on Close Pop Up of Voting Yes
    // The very first time a Yes or No option is clicked, we open a popover that explains Friends vs. Public
    // If you try to close this popover with "profileCloseItemActionBar" later in the script, it won't be able to find this id
    await simpleClick('profileCloseItemActionBar');
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick(`itemPositionStatementActionBarTextArea-${measureToTestOnBallotID}-measureItem-${platformPrefixID}-fromBallotItemSupportOpposeComment-${measureToTestOnBallotID}`); // Click on TextArea
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await clearTextInputValue(`itemPositionStatementActionBarTextArea-${measureToTestOnBallotID}-measureItem-${platformPrefixID}-fromBallotItemSupportOpposeComment-${measureToTestOnBallotID}`, ''); // Clear Text on TextArea
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleTextInput(`itemPositionStatementActionBarTextArea-${measureToTestOnBallotID}-measureItem-${platformPrefixID}-fromBallotItemSupportOpposeComment-${measureToTestOnBallotID}`, 'Commenting in measure to check'); // Write something on TextArea
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick(`itemPositionStatementActionBarSave-${measureToTestOnBallotID}-measureItem-${platformPrefixID}-fromBallotItemSupportOpposeComment-${measureToTestOnBallotID}`); // Click on Save Button
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    const voteNoButtonId = `itemActionBarNoButton-measureItem-ballotItemSupportOpposeComment-${measureToTestOnBallotID}-${platformPrefixID}Version-${measureToTestOnBallotID}`; // ID of "No" button
    await simpleClick(voteNoButtonId);  // Click on "No" button
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick(`itemPositionStatementActionBarEdit-${measureToTestOnBallotID}-measureItem-${platformPrefixID}-fromBallotItemSupportOpposeComment-${measureToTestOnBallotID}`); // Clicks on Edit Button
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await clearTextInputValue(`itemPositionStatementActionBarTextArea-${measureToTestOnBallotID}-measureItem-${platformPrefixID}-fromBallotItemSupportOpposeComment-${measureToTestOnBallotID}`, ' '); // Clear Text on TextArea
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick(`itemPositionStatementActionBarSave-${measureToTestOnBallotID}-measureItem-${platformPrefixID}-fromBallotItemSupportOpposeComment-${measureToTestOnBallotID}`); // Click on Save Button
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick(voteNoButtonId);
    await browser.pause(PAUSE_DURATION_MICROSECONDS);

    // //////////////////////
    // Open position display filters
    await simpleClick('filterBaseFilters');
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick('filterBaseFilters');
    await browser.pause(PAUSE_DURATION_MICROSECONDS);

    // //////////////////////
    // Follow an endorsing organization of measure
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick(`positionItemFollowToggleFollow-${platformPrefixID}-${organizationToFollowOnMeasureBallotID}`);
    await browser.pause(PAUSE_DURATION_MICROSECONDS);

    // //////////////////////
    // Unfollow that endorsing organization of measure
    await simpleClick(`positionItemFollowToggleDropdown-${platformPrefixID}-${organizationToFollowOnMeasureBallotID}`);
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick(`positionItemFollowToggleUnfollow-${platformPrefixID}-${organizationToFollowOnMeasureBallotID}`);
    await browser.pause(PAUSE_DURATION_MICROSECONDS);

    // //////////////////////
    // Test sticky header
    // await browser.pause(PAUSE_DURATION_MICROSECONDS);
    // const stickyYesButton = `itemActionBarYesButton-measureStickyHeader-ballotItemSupportOpposeComment-${measureToTestOnBallotID}-${platformPrefixID}Version-${measureToTestOnBallotID}`;  // ID of sticky header "Yes" button
    // scrollThroughPage();
    // await browser.pause(PAUSE_DURATION_MICROSECONDS);
    // await simpleClick(stickyYesButton); // Click on Sticky Header Yes
    // await browser.pause(PAUSE_DURATION_MICROSECONDS);
    // await simpleClick(`itemPositionStatementActionBarTextArea-${measureToTestOnBallotID}-measureStickyHeader-${platformPrefixID}-fromBallotItemSupportOpposeComment-${measureToTestOnBallotID}`); // Click on TextArea
    // await browser.pause(PAUSE_DURATION_MICROSECONDS);
    // await clearTextInputValue(`itemPositionStatementActionBarTextArea-${measureToTestOnBallotID}-measureStickyHeader-${platformPrefixID}-fromBallotItemSupportOpposeComment-${measureToTestOnBallotID}`,' '); // Clear Text on TextArea
    // await browser.pause(PAUSE_DURATION_MICROSECONDS);
    // await simpleTextInput(`itemPositionStatementActionBarTextArea-${measureToTestOnBallotID}-measureStickyHeader-${platformPrefixID}-fromBallotItemSupportOpposeComment-${measureToTestOnBallotID}`,'Commenting in measure to check'); // Write something on TextArea
    // await browser.pause(PAUSE_DURATION_MICROSECONDS);
    // await simpleClick(`itemPositionStatementActionBarSave-${measureToTestOnBallotID}-measureStickyHeader-${platformPrefixID}-fromBallotItemSupportOpposeComment-${measureToTestOnBallotID}`); // Click on Save Button
    // await browser.pause(PAUSE_DURATION_MICROSECONDS);
    // const stickyNoButton = `itemActionBarNoButton-measureStickyHeader-ballotItemSupportOpposeComment-${measureToTestOnBallotID}-${platformPrefixID}Version-${measureToTestOnBallotID}`;  // ID of sticky header "Yes" button
    // scrollThroughPage();
    // await browser.pause(PAUSE_DURATION_MICROSECONDS);
    // await simpleClick(stickyNoButton); // Click on Sticky Header "No"
    // await browser.pause(PAUSE_DURATION_MICROSECONDS);

    // //////////////////////
    // Go back to ballot
    await simpleClick('backToLinkTabHeader');
    await browser.pause(PAUSE_DURATION_MICROSECONDS);

    // //////////////////////
    // Visit the candidate page
    if (isCordovaFromAppStore) {
      // TODO find how to select ballotBadge-Federal on Cordova
    } else {
      await simpleClick(`${ballotBadgePlatformPrefixID}-Federal`);
    }
    await simpleClick(`officeItemCompressedCandidateImageAndName-${candidateToTestOnBallotID}`); // Clicks the candidate
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    const chooseButtonId = `itemActionBarSupportButton-candidateItem-${platformPrefixID}IssuesComment-ballotItemSupportOpposeComment-${candidateToTestOnBallotID}-${platformPrefixID}Version-${candidateToTestOnBallotID}`;
    await simpleClick(chooseButtonId);  // Choose the candidate
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    // await simpleClick('profileCloseItemActionBar');
    // await browser.pause(PAUSE_DURATION_MICROSECONDS);
    const opposeButtonId = `itemActionBarOpposeButton-candidateItem-${platformPrefixID}IssuesComment-ballotItemSupportOpposeComment-${candidateToTestOnBallotID}-${platformPrefixID}Version-${candidateToTestOnBallotID}`;
    await simpleClick(opposeButtonId); // oppose the candidate
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick(`itemPositionStatementActionBarTextArea-${candidateToTestOnBallotID}-candidateItem-${platformPrefixID}IssuesComment-${platformPrefixID}-fromBallotItemSupportOpposeComment-${candidateToTestOnBallotID}`);  // Clicks on TextArea
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await clearTextInputValue(`itemPositionStatementActionBarTextArea-${candidateToTestOnBallotID}-candidateItem-${platformPrefixID}IssuesComment-${platformPrefixID}-fromBallotItemSupportOpposeComment-${candidateToTestOnBallotID}`);  // Clears TextArea
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleTextInput(`itemPositionStatementActionBarTextArea-${candidateToTestOnBallotID}-candidateItem-${platformPrefixID}IssuesComment-${platformPrefixID}-fromBallotItemSupportOpposeComment-${candidateToTestOnBallotID}`, 'I am trying to comment');  // Writes in TextArea
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick(`itemPositionStatementActionBarSave-${candidateToTestOnBallotID}-candidateItem-${platformPrefixID}IssuesComment-${platformPrefixID}-fromBallotItemSupportOpposeComment-${candidateToTestOnBallotID}`); // Saves the text
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick(`itemPositionStatementActionBarEdit-${candidateToTestOnBallotID}-candidateItem-${platformPrefixID}IssuesComment-${platformPrefixID}-fromBallotItemSupportOpposeComment-${candidateToTestOnBallotID}`); // Edit the text
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await clearTextInputValue(`itemPositionStatementActionBarTextArea-${candidateToTestOnBallotID}-candidateItem-${platformPrefixID}IssuesComment-${platformPrefixID}-fromBallotItemSupportOpposeComment-${candidateToTestOnBallotID}`);  // Clears TextArea
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleTextInput(`itemPositionStatementActionBarTextArea-${candidateToTestOnBallotID}-candidateItem-${platformPrefixID}IssuesComment-${platformPrefixID}-fromBallotItemSupportOpposeComment-${candidateToTestOnBallotID}`, 'Succeeded in deleting and rewriting the test');  // Writes to TextArea
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await clearTextInputValue(`itemPositionStatementActionBarTextArea-${candidateToTestOnBallotID}-candidateItem-${platformPrefixID}IssuesComment-${platformPrefixID}-fromBallotItemSupportOpposeComment-${candidateToTestOnBallotID}`);  // Clears TextArea
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick(`itemPositionStatementActionBarSave-${candidateToTestOnBallotID}-candidateItem-${platformPrefixID}IssuesComment-${platformPrefixID}-fromBallotItemSupportOpposeComment-${candidateToTestOnBallotID}`); // Saves the text
    await browser.pause(PAUSE_DURATION_MICROSECONDS);

    // //////////////////////
    // Follow an endorsing organization of candidate
    await simpleClick(`positionItemFollowToggleFollow-${platformPrefixID}-${organizationToFollowOnCandidateBallotID}`);
    await browser.pause(PAUSE_DURATION_MICROSECONDS);

    // //////////////////////
    // Unfollow an endorsing organization of candidate
    await simpleClick(`positionItemFollowToggleDropdown-${platformPrefixID}-${organizationToFollowOnCandidateBallotID}`);
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick(`positionItemFollowToggleUnfollow-${platformPrefixID}-${organizationToFollowOnCandidateBallotID}`);
    await browser.pause(PAUSE_DURATION_MICROSECONDS);

    // //////////////////////
    // Visit organization page from candidate page
    await simpleClick(`${platformPrefixID}-LinkToEndorsingOrganization-${organizationToFollowOnCandidateBallotID}`); // Click on the link to organization's page
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick(`positionItemFollowToggleFollow-${platformPrefixID}-${organizationToFollowOnCandidateBallotID}`); // Follow organization
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick(`positionItemFollowToggleIgnore-${platformPrefixID}-${organizationToFollowOnCandidateBallotID}`); // Ignore organization
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick(`positionItemFollowToggleStopIgnoring-${platformPrefixID}-${organizationToFollowOnCandidateBallotID}`); // Stop ignoring organization
    await browser.pause(PAUSE_DURATION_MICROSECONDS);

    // //////////////////////
    // Go back to ballot
    await simpleClick('backToLinkTabHeader');
    await browser.pause(PAUSE_DURATION_MICROSECONDS);

    // //////////////////////
    // Visit the office page
    await simpleClick('officeItemCompressedShowMoreFooter-wv02off19866'); // Clicks Show More link
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick('backToLinkTabHeader'); // Clicks the back Ballot button
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick('officeItemCompressedTopNameLink-wv02off19913'); // Clicks Office Item link
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick('backToLinkTabHeader'); // Clicks the back Ballot button

    // //////////////////////
    // Build out path that goes through a ballot
    await simpleClick('ballotBadgeMobileAndDesktop-All'); // Go to the All Items tab
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick('Embed'); // Go to the embed tab
    await browser.pause(PAUSE_DURATION_MICROSECONDS);

    // //////////////////////
    // Go to the Values tab
    if (isDesktopScreenSize) {
      await simpleClick('valuesTabHeaderBar');  // Desktop screen size - HEADER TABS
    } else {
      await simpleClick('valuesTabFooterBar');  // Mobile or tablet screen size - FOOTER ICONS
    }
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick('valuesToFollowPreviewShowMoreId'); // Clicks on the link to show more values
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick('backToLinkTabHeader');
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick('publicFiguresToFollowPreviewShowMoreId');  // Clicks on the link to show more public figures
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick('backToLinkTabHeader');
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick('organizationsToFollowPreviewShowMoreId');  // Clicks on the link to show more organizations
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick('backToLinkTabHeader');
    await browser.pause(PAUSE_DURATION_REVIEW_RESULTS);

    // //////////////////////
    // Go to the My Friends tab // DALE: FRIENDS TEMPORARILY DISABLED
    // if (isDesktopScreenSize) {
    //   await simpleClick('friendsTabHeaderBar');  // Desktop screen size - HEADER TABS
    // } else {
    //   await simpleClick('friendsTabFooterBar');  // Mobile or tablet screen size - FOOTER ICONS
    // }
    // await simpleTextInput('friend1EmailAddress','filipfrancetic@gmail.com');
    // await simpleClick('friendsAddAnotherInvitation');
    // await simpleClick('friendsNextButton');
    // await browser.pause(PAUSE_DURATION_REVIEW_RESULTS);

    // //////////////////////
    // Go to the Vote tab
    if (isDesktopScreenSize) {
      await simpleClick('voteTabHeaderBar');  // Desktop screen size - HEADER TABS
    } else {
      await simpleClick('voteTabFooterBar');  // Mobile screen size - FOOTER ICONS
    }
    await browser.pause(PAUSE_DURATION_REVIEW_RESULTS);

    // //////////////////////
    // Go back to the Ballot tab
    if (isDesktopScreenSize) {
      await simpleClick('ballotTabHeaderBar');  // Desktop screen size - HEADER TABS
    } else {
      await simpleClick('ballotTabFooterBar');  // Mobile or tablet screen size - FOOTER ICONS
    }
    await browser.pause(PAUSE_DURATION_REVIEW_RESULTS);

    // //////////////////////
    // Review the full length of the page
    // await scrollThroughPage(); // Scroll to the bottom of the ballot page
    // TODO: We will need a way to scroll back to the top of the page for the tab navigation to work in Desktop

    await browser.pause(PAUSE_DURATION_REVIEW_RESULTS);

    assert(true);
  });
});
