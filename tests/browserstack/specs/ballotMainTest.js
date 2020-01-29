const assert = require('assert');
const { scrollThroughPage, clickTopLeftCornerOfElement, setNewAddress, setNewAddressAndroid, setNewAddressIOS, simpleClick, simpleCloseBootstrapModal, simpleTextInput, clearTextInputValue } = require('../utils');

const ANDROID_CONTEXT = 'WEBVIEW_org.wevote.cordova';
const IOS_CONTEXT = 'WEBVIEW_1';
const PAUSE_DURATION_MICROSECONDS = 1250;
const PAUSE_DURATION_BALLOT_LOAD = 6000;
const PAUSE_DURATION_REVIEW_RESULTS = 3000;

describe('Basic cross-platform We Vote test',  () => {
  it('can visit the different pages in the app', async () => {
    const { twitterUserName, twitterPassword } = driver.config;
    const { isAndroid, isCordovaFromAppStore, isMobileScreenSize, isIOS } = driver.config.capabilities;
    const isDesktopScreenSize = !isMobileScreenSize;

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
    // // Check the positioning of the SignInModal when we click "Enter Phone"
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick('signInHeaderBar'); // Clicks on Sign in
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick('enterVoterPhone'); // Puts cursor in Phone text input
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick('profileCloseSignInModal'); // Clicks on Sign Out
    await browser.pause(PAUSE_DURATION_MICROSECONDS);

    // // //////////////////////
    // // Check the positioning of the SignInModal when we click "Enter Email"
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick('signInHeaderBar'); // Clicks on Sign in
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick('enterVoterEmailAddress'); // Puts cursor in Email address text input
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick('profileCloseSignInModal'); // Clicks on Sign Out
    await browser.pause(PAUSE_DURATION_MICROSECONDS);

    // //////////////////////
    // Change Address
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick('changeAddressHeaderBar'); // Open the "Change Address" modal
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick('profileCloseSelectBallotModal');
    await browser.pause(PAUSE_DURATION_MICROSECONDS);

    // //////////////////////
    // We want to start by setting the location, which will automatically choose the next upcoming election for that address
    await simpleClick('changeAddressHeaderBar'); // Opens the "Enter Your Full Address" link
    await browser.pause(PAUSE_DURATION_MICROSECONDS);

    if (isIOS && isCordovaFromAppStore) {
      await setNewAddressIOS('addressBoxText', 'Redmond, WA 98052'); // Sets the text for the address box and hits enter
    } else if (isAndroid && isCordovaFromAppStore) {
      await setNewAddressAndroid('addressBoxText', 'Redmond, WA 98052'); // Sets the text for the address box and hits enter
    } else {
      await setNewAddress('addressBoxText', 'Redmond, WA 98052'); // Sets the text for the address box and hits enter
    }
    await browser.pause(PAUSE_DURATION_BALLOT_LOAD);

    // //////////////////////
    // Next we want to switch to a known election
    await simpleClick('changeAddressHeaderBar'); // Opens the Enter Your Full Address link
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick('ballotElectionListWithFiltersShowPriorElections');
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick('ballotElectionListWithFiltersButton-6000'); // Clicks on US 2018 Midterm Election
    await browser.pause(PAUSE_DURATION_MICROSECONDS);

    // Click on ballot filter badges at top of page
    await simpleClick('ballotBadge-State');
    await simpleClick('ballotBadge-Measure');
    await simpleClick('ballotBadge-Local');
    await simpleClick('ballotBadge-Federal');

    // //////////////////////
    // Visit Measure Page
    await simpleClick('ballotBadge-Measure'); // Click on Measure Page
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick('measureItemCompressedChoiceYes-wv02meas779'); // Click on Yes on 19
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    const voteYesButtonId = 'itemActionBarYesButton-measureItem-ballotItemSupportOpposeComment-wv02meas779-desktopVersion-wv02meas779';
    browser.execute((id) => {
      document.getElementById(id).click();
    }, voteYesButtonId); // Click on Voting Yes
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick('profileCloseItemActionBar'); // Click on Close Pop Up of Voting Yes
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick('itemPositionStatementActionBarTextArea-wv02meas779-measureItem-desktop-fromBallotItemSupportOpposeComment-wv02meas779'); // Click on TextArea
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await clearTextInputValue('itemPositionStatementActionBarTextArea-wv02meas779-measureItem-desktop-fromBallotItemSupportOpposeComment-wv02meas779',''); // Clear Text on TextArea
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleTextInput('itemPositionStatementActionBarTextArea-wv02meas779-measureItem-desktop-fromBallotItemSupportOpposeComment-wv02meas779','Commenting in measure to check'); // Write something on TextArea
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick('itemPositionStatementActionBarSave-wv02meas779-measureItem-desktop-fromBallotItemSupportOpposeComment-wv02meas779'); // Click on Save Button
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    const voteNoButtonId = 'itemActionBarNoButton-measureItem-ballotItemSupportOpposeComment-wv02meas779-desktopVersion-wv02meas779';
    browser.execute((id) => {
      document.getElementById(id).click();
    }, voteNoButtonId); // Click on Voting No
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick('itemPositionStatementActionBarEdit-wv02meas779-measureItem-desktop-fromBallotItemSupportOpposeComment-wv02meas779'); // Clicks on Edit Button
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await clearTextInputValue('itemPositionStatementActionBarTextArea-wv02meas779-measureItem-desktop-fromBallotItemSupportOpposeComment-wv02meas779',' '); // Clear Text on TextArea
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick('itemPositionStatementActionBarSave-wv02meas779-measureItem-desktop-fromBallotItemSupportOpposeComment-wv02meas779'); // Click on Save Button
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    const voteNoButton = 'itemActionBarNoButton-measureItem-ballotItemSupportOpposeComment-wv02meas779-desktopVersion-wv02meas779';
    browser.execute((id) => {
      document.getElementById(id).click();
    }, voteNoButton); // Click on Voting No again (to unset)
    // Open position display filters
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick('filterBaseFilters');
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    // Scroll down the page so the sticky header appears
    // scrollThroughPage();
    // const stickyYesButton = 'itemActionBarYesButton-measureStickyHeader-ballotItemSupportOpposeComment-wv02meas779-desktopVersion-wv02meas779';
    // browser.execute((id) => {
    //   document.getElementById(id).click();
    // }, stickyYesButton); // Click on Sticky Header Yes

    // await browser.pause(PAUSE_DURATION_MICROSECONDS);
    // await simpleClick('itemPositionStatementActionBarTextArea-wv02meas779-measureStickyHeader-desktop-fromBallotItemSupportOpposeComment-wv02meas779'); // Click on TextArea
    // await browser.pause(PAUSE_DURATION_MICROSECONDS);
    // await clearTextInputValue('itemPositionStatementActionBarTextArea-wv02meas779-measureStickyHeader-desktop-fromBallotItemSupportOpposeComment-wv02meas779',' '); // Clear Text on TextArea
    // await browser.pause(PAUSE_DURATION_MICROSECONDS);
    // await simpleTextInput('itemPositionStatementActionBarTextArea-wv02meas779-measureStickyHeader-desktop-fromBallotItemSupportOpposeComment-wv02meas779','Commenting in measure to check'); // Write something on TextArea
    // await browser.pause(PAUSE_DURATION_MICROSECONDS);
    // await simpleClick('itemPositionStatementActionBarSave-wv02meas779-measureStickyHeader-desktop-fromBallotItemSupportOpposeComment-wv02meas779'); // Clcik on Save Button
    // await browser.pause(PAUSE_DURATION_MICROSECONDS);
    // const stickyNoButton = 'itemActionBarNoButton-measureStickyHeader-ballotItemSupportOpposeComment-wv02meas779-desktopVersion-wv02meas779';
    // browser.execute((id) => {
    // document.getElementById(id).click();
    // }, stickyNoButton); // Click on Sticky Header No

    // //////////////////////
    // Visit the candidate page for Maria Cantwell
    await simpleClick('ballotBadge-Federal');
    await simpleClick('officeItemCompressedCandidateImageAndName-wv02cand53902'); // Clicks the candidate

    // Open and close Value "Common sense gun reform"
    await simpleClick('candidateItem-wv02cand53902-valueIconAndText-wv02issue37'); // Clicks to OPEN the issue icon
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick('candidateItem-wv02cand53902-valueIconAndText-wv02issue37'); // Clicks to CLOSE the issue icon

    // //////////////////////
    // Test Following an organization endorsing this candidate
    // await simpleClick('positionItemFollowToggleFollow-wv02org21454');
    // await simpleClick('positionItemFollowToggleFollowDropdown-wv02org21454');
    // await simpleClick('positionItemFollowToggleDropdown-wv02org21454');
    // await simpleClick('positionItemFollowToggleUnfollow-wv02org21454');
    // await simpleClick('backToLinkTabHeader'); // Clicks the back Ballot button
    // await browser.pause(PAUSE_DURATION_MICROSECONDS);

    // //////////////////////
    // Visit the candidate Maria Cantwell for choose, oppose, comment and save
    if (isDesktopScreenSize) {
      await simpleClick('officeItemCompressedCandidateImageAndName-wv02cand53902'); // Clicks the candidate Maria Cantwell
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      const chooseButtonId = 'itemActionBarSupportButton-candidateItem-desktopIssuesComment-ballotItemSupportOpposeComment-wv02cand53902-desktopVersion-wv02cand53902';
      browser.execute((id) => {
        document.getElementById(id).click();
      }, chooseButtonId); // Choose the candidate
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      await simpleClick('profileCloseItemActionBar');
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      const opposeButtonId = 'itemActionBarOpposeButton-candidateItem-desktopIssuesComment-ballotItemSupportOpposeComment-wv02cand53902-desktopVersion-wv02cand53902';
      browser.execute((id) => {
        document.getElementById(id).click();
      }, opposeButtonId); // oppose the candidate
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      const choosButtonId = 'itemActionBarSupportButton-candidateItem-desktopIssuesComment-ballotItemSupportOpposeComment-wv02cand53902-desktopVersion-wv02cand53902';
      browser.execute((id) => {
        document.getElementById(id).click();
      }, choosButtonId); // Choose the candidate
      await simpleClick('itemPositionStatementActionBarTextArea-wv02cand53902-candidateItem-desktopIssuesComment-desktop-fromBallotItemSupportOpposeComment-wv02cand53902');
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      await clearTextInputValue('itemPositionStatementActionBarTextArea-wv02cand53902-candidateItem-desktopIssuesComment-desktop-fromBallotItemSupportOpposeComment-wv02cand53902');
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      await simpleTextInput('itemPositionStatementActionBarTextArea-wv02cand53902-candidateItem-desktopIssuesComment-desktop-fromBallotItemSupportOpposeComment-wv02cand53902', 'I am trying to comment');
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      await clearTextInputValue('itemPositionStatementActionBarTextArea-wv02cand53902-candidateItem-desktopIssuesComment-desktop-fromBallotItemSupportOpposeComment-wv02cand53902');
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      await simpleTextInput('itemPositionStatementActionBarTextArea-wv02cand53902-candidateItem-desktopIssuesComment-desktop-fromBallotItemSupportOpposeComment-wv02cand53902', 'Succeeded in deleting and rewriting the test');
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      await simpleClick('itemPositionStatementActionBarSave-wv02cand53902-candidateItem-desktopIssuesComment-desktop-fromBallotItemSupportOpposeComment-wv02cand53902'); // save the text
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      await simpleClick('positionItemFollowToggleFollow-wv02org1360');
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      // await simpleClick('positionItemFollowToggleFollowDropdown-wv02org1360');
      // await browser.pause(PAUSE_DURATION_MICROSECONDS);
      // await simpleClick('positionItemFollowToggleDropdown-wv02org1360');
      // await browser.pause(PAUSE_DURATION_MICROSECONDS);
      // await simpleClick('positionItemFollowToggleUnfollow-wv02org1360');
      // await browser.pause(PAUSE_DURATION_MICROSECONDS);
      await simpleClick('backToLinkTabHeader');
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
    } else {
      if (isCordovaFromAppStore) {
        await simpleClick('officeItemCompressedCandidateInfo-wv02cand53902'); // Clicks the candidate Maria Cantwell
      } else {
        await simpleClick('officeItemCompressedCandidateImageAndName-wv02cand53902'); // Clicks the candidate Maria Cantwell
      }
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      await simpleClick('itemActionBarSupportButton-candidateItem-mobileIssuesComment-ballotItemSupportOpposeComment-wv02cand53902-mobileVersion-wv02cand53902'); // Choose the candidate
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      await simpleClick('profileCloseItemActionBar');
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      await simpleClick('itemActionBarOpposeButton-candidateItem-mobileIssuesComment-ballotItemSupportOpposeComment-wv02cand53902-mobileVersion-wv02cand53902'); // oppose the candidate
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      await simpleClick('itemPositionStatementActionBarTextArea-wv02cand53902-candidateItem-mobileIssuesComment-mobile-fromBallotItemSupportOpposeComment-wv02cand53902');
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      await clearTextInputValue('itemPositionStatementActionBarTextArea-wv02cand53902-candidateItem-mobileIssuesComment-mobile-fromBallotItemSupportOpposeComment-wv02cand53902');
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      await simpleTextInput('itemPositionStatementActionBarTextArea-wv02cand53902-candidateItem-mobileIssuesComment-mobile-fromBallotItemSupportOpposeComment-wv02cand53902', 'I am trying to comment');
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      await clearTextInputValue('itemPositionStatementActionBarTextArea-wv02cand53902-candidateItem-mobileIssuesComment-mobile-fromBallotItemSupportOpposeComment-wv02cand53902');
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      await simpleTextInput('itemPositionStatementActionBarTextArea-wv02cand53902-candidateItem-mobileIssuesComment-mobile-fromBallotItemSupportOpposeComment-wv02cand53902', 'Successful in deleting nad rewriting the test');
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      const saveButtonId = 'itemPositionStatementActionBarSave-wv02cand53902-candidateItem-mobileIssuesComment-mobile-fromBallotItemSupportOpposeComment-wv02cand53902';
      browser.execute((id) => {
        document.getElementById(id).click();
      }, saveButtonId); // save the candidate
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      // await simpleClick('itemPositionStatementActionBarSave-wv02cand53902-candidateItem-mobileIssuesComment-mobile-fromBallotItemSupportOpposeComment-wv02cand53902'); // save the text
      await simpleClick('backToLinkTabHeader');
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
    }

    // //////////////////////
    // Visit an organization Voter Guide
    // await browser.pause(PAUSE_DURATION_MICROSECONDS);
    // await simpleClick('positionItemFollowToggleFollow-wv02org1360'); // Follow the Organisation
    // await browser.pause(PAUSE_DURATION_MICROSECONDS);
    // await simpleClick('positionItemFollowToggleFollowDropdown-wv02org1360');
    // await browser.pause(PAUSE_DURATION_MICROSECONDS);
    // await simpleClick('positionItemFollowToggleDropdown-wv02org1360');
    // await browser.pause(PAUSE_DURATION_MICROSECONDS);
    // await simpleClick('positionItemFollowToggleUnfollow-wv02org1360');
    // await browser.pause(PAUSE_DURATION_MICROSECONDS);

    // //////////////////////
    // Visit the office page
    // await simpleClick('officeItemCompressedShowMoreFooter-wv02off19922'); // Clicks Show More link
    // await simpleClick('backToLinkTabHeader'); // Clicks the back Ballot button
    // await simpleClick('officeItemCompressedTopNameLink-wv02off19866'); // Clicks Office Item link
    // await simpleClick('backToLinkTabHeader'); // Clicks the back Ballot button

    // Build out path that goes through a ballot
    // await simpleClick('allItemsCompletionLevelTab'); // Go to the All Items tab
    // await simpleClick('Embed'); // Go to the embed tab

    // //////////////////////
    // Visit Measure Page
    await simpleClick('ballotBadge-Measure'); // Click on Measure Page
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    if (isDesktopScreenSize) {
      // Measure Page Desktop
      await simpleClick('measureItemCompressedChoiceYes-wv02meas779'); // Click on Yes on 19
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      const voteYesButtonId = 'itemActionBarYesButton-measureItem-ballotItemSupportOpposeComment-wv02meas779-desktopVersion-wv02meas779';
      browser.execute((id) => {
        document.getElementById(id).click();
      }, voteYesButtonId); // Click on Voting Yes
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      // await simpleClick('profileCloseItemActionBar'); // Click on Close Pop Up of Voting Yes // not able to find this element on web page -Poonam
      // await browser.pause(PAUSE_DURATION_MICROSECONDS);
      await simpleClick('itemPositionStatementActionBarTextArea-wv02meas779-measureItem-desktop-fromBallotItemSupportOpposeComment-wv02meas779'); // Click on TextArea //
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      await clearTextInputValue('itemPositionStatementActionBarTextArea-wv02meas779-measureItem-desktop-fromBallotItemSupportOpposeComment-wv02meas779', ' '); // Clear Text on TextArea
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      await simpleTextInput('itemPositionStatementActionBarTextArea-wv02meas779-measureItem-desktop-fromBallotItemSupportOpposeComment-wv02meas779', 'Commenting in measure to check'); // Write something on TextArea
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      await simpleClick('itemPositionStatementActionBarSave-wv02meas779-measureItem-desktop-fromBallotItemSupportOpposeComment-wv02meas779'); // Clcik on Save Button
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      const voteNoButtonId = 'itemActionBarNoButton-measureItem-ballotItemSupportOpposeComment-wv02meas779-desktopVersion-wv02meas779';
      browser.execute((id) => {
        document.getElementById(id).click();
      }, voteNoButtonId); // Click on Voting No
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      // await simpleClick('itemPositionStatementActionBarEdit-wv02meas779-measureItem-desktop-fromBallotItemSupportOpposeComment-wv02meas779'); // Clicks on Edit Button - not visible-Poonam
      // await browser.pause(PAUSE_DURATION_MICROSECONDS);
      // await clearTextInputValue('itemPositionStatementActionBarTextArea-wv02meas779-measureItem-desktop-fromBallotItemSupportOpposeComment-wv02meas779',' '); // Clear Text on TextArea
      // await browser.pause(PAUSE_DURATION_MICROSECONDS);
      // await simpleClick('itemPositionStatementActionBarSave-wv02meas779-measureItem-desktop-fromBallotItemSupportOpposeComment-wv02meas779'); // Click on Save Button
      // await browser.pause(PAUSE_DURATION_MICROSECONDS);
      const voteNoButton = 'itemActionBarNoButton-measureItem-ballotItemSupportOpposeComment-wv02meas779-desktopVersion-wv02meas779';
      browser.execute((id) => {
        document.getElementById(id).click();
      }, voteNoButton); // Click on Voting No again (to unset)
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      // await simpleClick('filterBaseFilters'); // was crashing because it couldn't find filterBaseFilters
      // await browser.pause(PAUSE_DURATION_MICROSECONDS);
      //
      // scrollThroughPage();   // script is failing to scroll down
      //
      // const stickyYesButton = 'itemActionBarYesButton-measureStickyHeader-ballotItemSupportOpposeComment-wv02meas779-desktopVersion-wv02meas779';
      // browser.execute((id) => {
      //  document.getElementById(id).click();
      // }, stickyYesButton); // Click on Sticky Header Yes
      // await browser.pause(PAUSE_DURATION_MICROSECONDS);
      // await simpleClick('itemPositionStatementActionBarTextArea-wv02meas779-measureStickyHeader-desktop-fromBallotItemSupportOpposeComment-wv02meas779'); // Click on TextArea
      // await browser.pause(PAUSE_DURATION_MICROSECONDS);
      // await clearTextInputValue('itemPositionStatementActionBarTextArea-wv02meas779-measureStickyHeader-desktop-fromBallotItemSupportOpposeComment-wv02meas779',' '); // Clear Text on TextArea
      // await browser.pause(PAUSE_DURATION_MICROSECONDS);
      // await simpleTextInput('itemPositionStatementActionBarTextArea-wv02meas779-measureStickyHeader-desktop-fromBallotItemSupportOpposeComment-wv02meas779','Commenting in measure to check'); // Write something on TextArea
      // await browser.pause(PAUSE_DURATION_MICROSECONDS);
      // await simpleClick('itemPositionStatementActionBarSave-wv02meas779-measureStickyHeader-desktop-fromBallotItemSupportOpposeComment-wv02meas779'); // Clcik on Save Button
      // await browser.pause(PAUSE_DURATION_MICROSECONDS);
      // const stickyNoButton = 'itemActionBarNoButton-measureStickyHeader-ballotItemSupportOpposeComment-wv02meas779-desktopVersion-wv02meas779';
      // browser.execute((id) => {
      // document.getElementById(id).click();
      // }, stickyNoButton); // Click on Sticky Header No
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      await simpleClick('backToLinkTabHeader'); // Click Back to Ballot
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
    } else {
      // Measure Page Mobile
    }

    await browser.pause(PAUSE_DURATION_REVIEW_RESULTS);

    // Go to the Values tab
    if (isDesktopScreenSize) {
      // Desktop screen size - HEADER TABS
      await simpleClick('valuesTabHeaderBar');
      await simpleClick('valuesToFollowPreviewShowMoreId');// Clicks on the link to show more public figures/organizations
      await simpleClick('backToLinkTabHeader');
      await simpleClick('publicFiguresToFollowPreviewShowMoreId');
      await simpleClick('backToLinkTabHeader');
      await simpleClick('organizationsToFollowPreviewShowMoreId');
      await simpleClick('backToLinkTabHeader');

    } else {
      // Mobile or tablet screen size - FOOTER ICONS
      await simpleClick('valuesTabFooterBar');
    }

    await browser.pause(PAUSE_DURATION_REVIEW_RESULTS);

    //
    // Go to the My Friends tab // DALE: FRIENDS TEMPORARILY DISABLED
    // if (isDesktopScreenSize) {
    //   // Desktop screen size - HEADER TABS
    //   await simpleClick('friendsTabHeaderBar');
    // } else {
    //   // Mobile or tablet screen size - FOOTER ICONS
    //   await simpleClick('friendsTabFooterBar');
    // }
    // await simpleTextInput('friend1EmailAddress','filipfrancetic@gmail.com');
    // await simpleClick('friendsAddAnotherInvitation');
    // await simpleClick('friendsNextButton');
    //
    // await browser.pause(PAUSE_DURATION_REVIEW_RESULTS);

    // Go to the Vote tab
    if (isDesktopScreenSize) {
      // Desktop screen size - HEADER TABS
      await simpleClick('voteTabHeaderBar');
    } else {
      // Mobile or tablet screen size - FOOTER ICONS
      await simpleClick('voteTabFooterBar');
    }

    await browser.pause(PAUSE_DURATION_REVIEW_RESULTS);

    // Go back to the Ballot tab
    if (isDesktopScreenSize) {
      // Desktop screen size - HEADER TABS
      await simpleClick('ballotTabHeaderBar');
    } else {
      // Mobile or tablet screen size - FOOTER ICONS
      await simpleClick('ballotTabFooterBar');
    }

    await browser.pause(PAUSE_DURATION_REVIEW_RESULTS);

    // //////////////////////
    // Review the full length of the page
    // await scrollThroughPage(); // Scroll to the bottom of the ballot page
    // TODO: We will need a way to scroll back to the top of the page for the tab navigation to work in Desktop

    await browser.pause(PAUSE_DURATION_REVIEW_RESULTS);

    // // Open sign in modal, then close it by pressing button
    // await simpleClick('signInHeaderBar');
    // await simpleClick('profileCloseSignInModal');
    //
    // // Open sign in modal, then close it by clicking/tapping outside of modal
    // // NOTE: having trouble doing this with W3C Web Driver protocol, so skip for now
    // if (!browser.isW3C) {
    //   await simpleClick('signInHeaderBar');
    //   await clickTopLeftCornerOfElement('div[role="document"]');
    // }
    // // If keyboard is available, open sign in modal and close by hitting escape key
    // if (!isAndroid && !isIOS) {
    //   await simpleClick('signInHeaderBar');
    //   browser.keys(['Escape']);
    // }

    assert(true);
  });
});
