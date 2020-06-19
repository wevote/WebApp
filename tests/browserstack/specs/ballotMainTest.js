const { clearTextInputValue, clickTopLeftCornerOfElement, scrollIntoViewSimple, setNewAddress, setNewAddressAndroid, setNewAddressIOS, simpleClick, selectClick, simpleTextInput, selectTextInput } = require('../utils');

const ANDROID_CONTEXT = 'WEBVIEW_org.wevote.cordova';
const IOS_CONTEXT = 'WEBVIEW_1';
const PAUSE_DURATION_MICROSECONDS = 3000;
const PAUSE_DURATION_BALLOT_LOAD = 6000;
const PAUSE_DURATION_REVIEW_RESULTS = 3000;

describe('Basic cross-platform We Vote test',  () => {
  it('should load the app so we can run various tests', async () => {
    const { twitterUserName, twitterPassword } = driver.config;
    const { device, browserName, isAndroid, isCordovaFromAppStore, isMobileScreenSize, isIOS } = driver.config.capabilities;
    const WEB_APP_ROOT_URL = driver.config.webAppRootUrl;
    const isDesktopScreenSize = !isMobileScreenSize;
    const platformPrefixID = (isDesktopScreenSize) ? 'desktop' : 'mobile';
    const changeAddressHeaderBarID = (isDesktopScreenSize) ? 'changeAddressOrElectionHeaderBarElection' : 'changeAddressOnlyHeaderBar';
    const ballotBadgePlatformPrefixID = (isDesktopScreenSize) ? 'ballotBadgeDesktop' : 'ballotBadgeMobile';
    let isChrome = false;
    let isSafari = false;
    let isJ7Prime = false;
    let isS8 = false;
    let isGooglePixel3 = false;
    let isiPad6 = false;
    let isiPhone6S = false;
    // Check if device capability is used
    if (browserName) {
      isChrome = browserName.includes('Chrome');
      isSafari = browserName.includes('Safari');
    }
    if (device) {
      isJ7Prime = device.includes('Samsung Galaxy J7 Prime');
      isS8 = device.includes('Samsung Galaxy S8');
      isGooglePixel3 = device.includes('Google Pixel 3');
      isiPad6 = device.includes('iPad 6th');
      isiPhone6S = device.includes('iPhone 6S');
    }
    const personalizedScoreSteps = 7;
    const xssTest = '<script>alert(1)</script>';
    const backspace = '\uE003';
    const enter = '\uE007';

    if (isCordovaFromAppStore) {
      // ///////////////////////////////
      // For the apps downloadable from either the Apple App Store or Android Play Store,
      // click through the onboarding screens
      await browser.pause(PAUSE_DURATION_BALLOT_LOAD);
      await browser.pause(PAUSE_DURATION_BALLOT_LOAD);
      const contexts = await driver.getContexts();
      const context = contexts.includes(ANDROID_CONTEXT) ? ANDROID_CONTEXT : IOS_CONTEXT;
      await driver.switchContext(context);
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      await selectClick('div[data-index="0"] .intro-story__btn--bottom'); // Click first next button
      await selectClick('div[data-index="1"] .intro-story__btn--bottom'); // Click second next button
      await selectClick('div[data-index="2"] .intro-story__btn--bottom'); // Click third next button
    } else {
      // ///////////////////////////////
      // For the website version, open our quality testing site
      await browser.url('ballot');
    }

    // //////////////////////
    // Click through the How It Works
    await browser.pause(PAUSE_DURATION_BALLOT_LOAD);
    await clearTextInputValue('editAddressOneHorizontalRowTextForMapSearch'); // Clear location
    await simpleTextInput('editAddressOneHorizontalRowTextForMapSearch', `Oakland, CA 94501${enter}`); // Focus on Location Input Box
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
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
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      await selectClick('#valuesIntroModalValueList #issues-follow-container'); // select an interest
      await scrollIntoViewSimple('valuesIntroModalNext'); // Scrolls to Next button
      await simpleClick('valuesIntroModalNext'); // Close the Interests modal
      await simpleClick('completeYourProfileDesktopButton'); // Clicks on Learn More
    } else if (!isAndroid) {
      await simpleClick('completeYourProfileMobileButton'); // clicks on How it works
      await simpleClick('annotatedSlideShowStep1Next');
      await simpleClick('annotatedSlideShowStep2Next');
      await simpleClick('annotatedSlideShowStep3Next');
      await simpleClick('annotatedSlideShowStep4Next');
      await simpleClick('howItWorksGetStartedDesktopButton'); // End of How it Works Modal
      await simpleClick('enterVoterEmailAddress'); // Puts cursor in Email address text input
      await simpleClick('profileCloseSignInModal'); // Clicks on Sign Out
      await simpleClick('completeYourProfileMobileButton'); // Clicks on Choose Interests
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
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

    // //////////////////////
    // Sign in using Twitter, when in browser
    if (!isCordovaFromAppStore && twitterUserName && twitterPassword) {
      // await simpleClick('signInHeaderBar'); // Clicks on Sign in
      // await simpleClick('twitterSignIn-splitIconButton'); // Clicks on Twitter Sign in Button
      // await simpleTextInput('username_or_email', twitterUserName); // Enter Username or Email id
      // await simpleTextInput('password', twitterPassword); // Enter Password
      // await simpleClick('allow'); // Clicks on Authorize App
      // await browser.pause(PAUSE_DURATION_MICROSECONDS);
      // const unusualLoginUsernameInput = await $('input[name="session[username_or_email]"]');
      // await browser.pause(PAUSE_DURATION_MICROSECONDS);
      // await unusualLoginUsernameInput.setValue(twitterUserName);
      // await browser.pause(PAUSE_DURATION_MICROSECONDS);
      // const unusualLoginPasswordInput = await $('input[name="session[password]"]');
      // await browser.pause(PAUSE_DURATION_MICROSECONDS);
      // await unusualLoginPasswordInput.setValue(twitterPassword);
      // await browser.pause(PAUSE_DURATION_MICROSECONDS);
      // const unusualLoginSubmit = await $('[data-testid="LoginForm_Login_Button"]');
      // await browser.pause(PAUSE_DURATION_MICROSECONDS);
      // await unusualLoginSubmit.click();
      // await browser.pause(PAUSE_DURATION_MICROSECONDS);
      // await simpleTextInput('challenge_response', ''); // Clicks on 'Confirmation Code'
      // await simpleClick('allow'); // Clicks on Authorize App
      // await simpleClick('profileAvatarHeaderBar'); // Clicks on Setting
      // await simpleClick('profilePopUpSignOut'); // Clicks on Sign Out
    }

    // //////////////////////
    // Check the positioning of the SignInModal when we click "Enter Email"
    if (isCordovaFromAppStore) {
      await simpleClick('signInHeaderBar'); // Clicks on Sign in
      await simpleClick('emailSignIn-splitIconButton'); // Clicks "Sign in with an email" button
      await simpleClick('cancelEmailButton'); // Clicks the cancel button
    } else if (isAndroid && isMobileScreenSize) { // Android mobile browsers can't click this element without scrolling
      // Don't test
    } else {
      await simpleClick('signInHeaderBar'); // Clicks on Sign in
      await simpleClick('enterVoterEmailAddress'); // Puts cursor in Email address text input
      await simpleClick('profileCloseSignInModal'); // Clicks on Sign Out
    }

    // //////////////////////
    // Check the positioning of the SignInModal when we click "Enter Phone"
    if (isCordovaFromAppStore) {
      await simpleClick('signInHeaderBar'); // Clicks on Sign in
      await simpleClick('smsSignIn-splitIconButton'); // Clicks "Sign in with a text" button
      await simpleClick('cancelVoterPhoneSendSMS'); // Clicks the cancel button
    } else  if (isAndroid && isMobileScreenSize) {  // Samsung mobile browsers can't click this element without scrolling
      // Don't test
    } else {
      await simpleClick('signInHeaderBar'); // Clicks on Sign in
      await simpleClick('enterVoterPhone'); // Puts cursor in Phone text input
      await simpleClick('profileCloseSignInModal'); // Clicks on X
    }

    // //////////////////////
    // Open/close "Change Address" Modal in the very top header bar
    // (as opposed to changing the election next to the election name)
    if (!isiPad6) {
      await simpleClick(changeAddressHeaderBarID); // Open the "Change Address" modal
    } else {
      await simpleClick('changeAddressOrElectionHeaderBarText'); // Open the "Change Address" modal
    }
    await simpleClick('profileCloseSelectBallotModal'); // Close the "Change Address" modal

    // //////////////////////
    // Open "Change Address" Modal in the very top header bar, and adjust the voter's address
    // await simpleClick(changeAddressHeaderBarID); // Opens the "Enter Your Full Address" link
    // await simpleClick('span.EditAddressInPlace__EditAddressPreview-sc-34r5yb-0.gxSnRd'); // Click Address
    // if (isIOS && isCordovaFromAppStore) {
    //   await setNewAddressIOS('addressBoxText', 'Oakland, CA 94501'); // Sets the text for the address box and hits enter
    // } else if (isAndroid && isCordovaFromAppStore) {
    //   await setNewAddressAndroid('addressBoxText', 'Oakland, CA 94501'); // Sets the text for the address box and hits enter
    // } else {
    //   await setNewAddress('addressBoxText', 'Oakland, CA 94501'); // Sets the text for the address box and hits enter
    // }
    // await browser.pause(PAUSE_DURATION_BALLOT_LOAD);
    // await simpleClick('addressBoxModalSaveButton'); // Clicks "Save"

    // //////////////////////
    // Switch to a known election so we can test using existing candidates and measures
    if (isDesktopScreenSize) {
      await simpleClick('changeAddressOrElectionHeaderBarElection'); // Open the "Change Address" modal
    } else {
      await simpleClick('ballotTitleHeaderSelectBallotModal'); // Opens the Ballot modal
    }
    await selectClick('button.MuiButtonBase-root.MuiButton-root.MuiButton-outlined.SelectBallotModal__PriorButton-sc-1kby1m3-8.kPEgxg.MuiButton-outlinedPrimary'); // Click on prior
    await simpleClick('ballotElectionListWithFiltersButton-6000'); // Clicks on US 2018 Midterm Election
    await browser.pause(PAUSE_DURATION_BALLOT_LOAD);

    // //////////////////////
    // Click on ballot filter badges at top of page
    await simpleClick(`${ballotBadgePlatformPrefixID}-State`);
    await simpleClick('ballotBadgeMobileAndDesktop-All'); // Go to the All Items tab
    await simpleClick(`${ballotBadgePlatformPrefixID}-Local`);
    await simpleClick(`${ballotBadgePlatformPrefixID}-Federal`);
    await simpleClick(`${ballotBadgePlatformPrefixID}-Measure`);

    // //////////////////////
    // Visit Measure Page
    await selectClick('[id^=measureItemCompressedChoiceYes-]'); // Click on first measure
    if (!isChrome && !isAndroid && !isIOS) { // Element not interactable on Chrome or Android
      await selectClick('[id^=itemActionBarYesButton-measureItem-ballotItemSupportOpposeComment-]'); // Click on vote yes
      await simpleClick('profileCloseItemActionBar'); // Click close for pop up
      await selectClick('[id^=itemActionBarNoButton-measureItem-ballotItemSupportOpposeComment-]'); // Click on vote no
      await selectClick('[id^=itemActionBarNoButton-measureItem-ballotItemSupportOpposeComment-]'); // Undo opposition
    }
    if (!isAndroid && !isIOS) { // measure text area is not interactable in android
      await selectClick('[id^=itemPositionStatementActionBarTextArea-]'); // Click on text area
      await selectTextInput('[id^=itemPositionStatementActionBarTextArea-]', xssTest); // Write something in Text Area
      await selectClick('[id^=itemPositionStatementActionBarSave-]'); // Click on save button
      if (!isSafari) {  // accommodates a bug in iOS and Safari --> "Save" button isn't working as intended
        await selectClick('[id^=itemPositionStatementActionBarEdit-]'); // Click on edit button
      }
      await selectTextInput('[id^=itemPositionStatementActionBarTextArea-]', `${backspace}`.repeat(30)); // clear text area
      await selectClick('[id^=itemPositionStatementActionBarSave-]'); // Click on save button
    }

    // //////////////////////
    // Open position display filters
    await simpleClick('filterBaseFilters');
    await simpleClick('filterBaseFilters');

    // //////////////////////
    // Follow and unfollow an endorsing organization of measure
    if (!isSafari && !isJ7Prime) { // bug on OS X
      await selectClick(`[id^=positionItemFollowToggleFollow-${platformPrefixID}-]`); // Follow organization
      if (isS8 || isGooglePixel3) {
        await scrollIntoViewSimple('readMore'); // Scroll down slightly
      }
      await selectClick(`[id^=positionItemFollowToggleDropdown-${platformPrefixID}-]`);
      await selectClick(`[id^=positionItemFollowToggleUnfollow-${platformPrefixID}-]`); // Unfollow organization
    }

    // //////////////////////
    // Go back to ballot
    await simpleClick('backToLinkTabHeader');
    await browser.pause(PAUSE_DURATION_BALLOT_LOAD);
    // //////////////////////
    // Visit the federal page
    await simpleClick(`${ballotBadgePlatformPrefixID}-Federal`); // Go to federal
    await selectClick('[id^=officeItemCompressedCandidateImageAndName-]'); // Clicks the first candidate
    if (!isChrome && !isAndroid && !isIOS) { // Support and oppose button are not interactable on Chrome and Android
      await selectClick(`[id^=itemActionBarSupportButton-candidateItem-${platformPrefixID}IssuesComment-]`); // Support the candidate
      // await simpleClick('profileCloseItemActionBar'); // Click close for pop up
      await selectClick(`[id^=itemActionBarOpposeButton-candidateItem-${platformPrefixID}IssuesComment-]`); // Oppose the candidate
      await selectClick(`[id^=itemActionBarOpposeButton-candidateItem-${platformPrefixID}IssuesComment-]`); // Undo opposition
    }
    if (!isAndroid && !isIOS) { // text area not interactable on Android
      await selectClick('[id^=itemPositionStatementActionBarTextArea-]'); // Clicks on text area
      await selectTextInput('[id^=itemPositionStatementActionBarTextArea-]', xssTest); // Write something in Text Area
      await selectClick('[id^=itemPositionStatementActionBarSave-]'); // Click on save button
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      if (!isSafari) { // accommodates a bug in Safari --> "Save" button isn't working as intended
        await selectClick('[id^=itemPositionStatementActionBarEdit-]'); // Click on edit button
      }
      await selectClick('[id^=itemPositionStatementActionBarTextArea-]'); // Clicks on text area
      await selectTextInput('[id^=itemPositionStatementActionBarTextArea-]', `${backspace}`.repeat(30)); // clear text area
      await selectClick('[id^=itemPositionStatementActionBarSave-]'); // Click on save button
    }

    // //////////////////////
    // Follow and unfollow an endorsing organization of candidate
    if (!isSafari && !isJ7Prime) { // Bug in Safari where Follow Button does not work
      await selectClick(`[id^=positionItemFollowToggleFollow-${platformPrefixID}-]`); // Follow organization
      if (isChrome || isiPhone6S) {
        await selectClick(`[id^=positionItemFollowToggleFollow-${platformPrefixID}-]`); // Need to click twice on Chrome
      }
      if (isS8 || isGooglePixel3) {
        await scrollIntoViewSimple('readMore'); // Scroll down slightly
      }
      await selectClick(`[id^=positionItemFollowToggleDropdown-${platformPrefixID}-]`);
      await selectClick(`[id^=positionItemFollowToggleUnfollow-${platformPrefixID}-]`); // Unfollow organization
    }

    // //////////////////////
    // Visit organization page from candidate page
    if (!isS8 && !isJ7Prime && !isSafari) {
      await selectClick(`[id^=${platformPrefixID}-LinkToEndorsingOrganization-]`); // Click on the link to organization's page
      await selectClick(`[id^=positionItemFollowToggleFollow-${platformPrefixID}-]`); // Follow organization
      await selectClick(`[id^=positionItemFollowToggleDropdown-${platformPrefixID}-]`);
      await selectClick(`[id^=positionItemFollowToggleIgnore-${platformPrefixID}-]`); // Ignore organization
      await selectClick(`[id^=positionItemFollowToggleDropdown-${platformPrefixID}-]`);
      await selectClick(`[id^=positionItemFollowToggleStopIgnoring-${platformPrefixID}-]`); // Unignore organization
      await simpleClick('backToLinkTabHeader'); // Go back to candidate page
    }

    // //////////////////////
    // Click on a candidate to open the right-side candidate sliding drawer, and then close the sliding drawer
    // both 1) by clicking in the gray area of the page to the left, and 2) by clicking the "x"
    // TODO

    // TODO Click on Personalized Score and Organization's Opinion boxes (to open the modals)

    // TODO Click on All endorsements page, Following, Followers
    // Go back to ballot
    await simpleClick('backToLinkTabHeader');

    // //////////////////////
    // Build out path that goes through a ballot
    await simpleClick('ballotBadgeMobileAndDesktop-All'); // Go to the All Items tab
    // await simpleClick('Embed'); // Go to the embed tab

    // //////////////////////
    // Go to the Values tab
    // TODO Only run this while NOT signed in
    if (isDesktopScreenSize) {
      await simpleClick('valuesTabHeaderBar');  // Desktop screen size - HEADER TABS
    } else {
      await simpleClick('valuesTabFooterBar');  // Mobile or tablet screen size - FOOTER ICONS
    }

    // //////////////////////
    // Go to the My Friends tab
    if (isDesktopScreenSize) {
      await simpleClick('friendsTabHeaderBar');  // Desktop screen size - HEADER TABS
    } else {
      await simpleClick('friendsTabFooterBar');  // Mobile or tablet screen size - FOOTER ICONS
    }
    // await simpleTextInput('friend1EmailAddress','filipfrancetic@gmail.com');
    // await simpleClick('friendsAddAnotherInvitation');
    // await simpleClick('friendsNextButton');

    // //////////////////////
    // Go to the Vote tab
    // if (isDesktopScreenSize) {
    //   await simpleClick('voteTabHeaderBar');  // Desktop screen size - HEADER TABS
    // } else {
    //   await simpleClick('voteTabFooterBar');  // Mobile screen size - FOOTER ICONS
    // }

    // //////////////////////
    // Go back to the Ballot tab
    if (isDesktopScreenSize) {
      await simpleClick('ballotTabHeaderBar');  // Desktop screen size - HEADER TABS
    } else {
      await simpleClick('ballotTabFooterBar');  // Mobile or tablet screen size - FOOTER ICONS
    }
  });
});
