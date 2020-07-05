const { clearTextInputValue, clickTopLeftCornerOfElement, scrollIntoViewSimple, scrollIntoViewSelect, setNewAddress, setNewAddressAndroid, setNewAddressIOS, simpleClick, selectClick, simpleTextInput, selectTextInput } = require('../utils');

const assert = require('assert');

const PAUSE_DURATION_MICROSECONDS = 1250;
const ANDROID_CONTEXT = 'WEBVIEW_org.wevote.cordova';
const IOS_CONTEXT = 'WEBVIEW_1';

describe('Basic cross-platform We Vote test',  () => {
  it('should load the app so we can run various tests', async () => {
    const { twitterUserName, twitterPassword } = driver.config;
    const { device, browserName, isAndroid, isCordovaFromAppStore, isMobileScreenSize, isIOS } = driver.config.capabilities;
    const WEB_APP_ROOT_URL = driver.config.webAppRootUrl;
    if (isCordovaFromAppStore) {
      // switch contexts and click through intro
      const contexts = await driver.getContexts();
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      const context = contexts.includes(ANDROID_CONTEXT) ? ANDROID_CONTEXT : IOS_CONTEXT;
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      await driver.switchContext(context);
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      await selectClick('div[data-index="0"] .intro-story__btn--bottom'); // Click first next button
      await selectClick('div[data-index="1"] .intro-story__btn--bottom'); // Click second next button
      await selectClick('div[data-index="2"] .intro-story__btn--bottom'); // Click third next button
    } else {
      // navigate browser to WeVote QA site
      await browser.url('ready');
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
    }
    // //////////////////////
    // Sign in using Twitter, when in browser
    if (!isCordovaFromAppStore && twitterUserName && twitterPassword) {
      await simpleClick('signInHeaderBar'); // Clicks on Sign in
      await simpleClick('twitterSignIn-splitIconButton'); // Clicks on Twitter Sign in Button
      await simpleTextInput('username_or_email', twitterUserName); // Enter Username or Email id
      await simpleTextInput('password', twitterPassword); // Enter Password
      await simpleClick('allow'); // Clicks on Authorize App
//      const unusualLoginUsernameInput = await $('input[name="session[username_or_email]"]');
//      await browser.pause(PAUSE_DURATION_MICROSECONDS);
//      await unusualLoginUsernameInput.setValue(twitterUserName);
//      await browser.pause(PAUSE_DURATION_MICROSECONDS);
//      const unusualLoginPasswordInput = await $('input[name="session[password]"]');
//      await browser.pause(PAUSE_DURATION_MICROSECONDS);
//      await unusualLoginPasswordInput.setValue(twitterPassword);
//      await browser.pause(PAUSE_DURATION_MICROSECONDS);
//      const unusualLoginSubmit = await $('[data-testid="LoginForm_Login_Button"]');
//      await browser.pause(PAUSE_DURATION_MICROSECONDS);
//      await unusualLoginSubmit.click();
//      await browser.pause(PAUSE_DURATION_MICROSECONDS);
//      await simpleTextInput('challenge_response', ''); // Clicks on 'Confirmation Code'
//      await simpleClick('allow'); // Clicks on Authorize App
      await browser.pause(PAUSE_DURATION_MICROSECONDS * 9);
      await simpleClick('profileAvatarHeaderBar'); // Clicks on Setting
    }

    // //////////////////////
    // Check the positioning of the SignInModal when we click "Enter Email"
    if (isCordovaFromAppStore) {
      await simpleClick('signInHeaderBar'); // Clicks on Sign in
      await simpleClick('emailSignIn-splitIconButton'); // Clicks "Sign in with an email" button
      await simpleTextInput('enterVoterEmailAddress', 'test@gmail.com'); // Type input
      await simpleClick('voterEmailAddressEntrySendCode'); // Click Send Verification Code
      await simpleTextInput('digit1', '0');
      await simpleTextInput('digit2', '1');
      await simpleTextInput('digit3', '2');
      await simpleTextInput('digit4', '3');
      await simpleTextInput('digit5', '4');
      await simpleTextInput('digit6', '5');
      await simpleClick('emailVerifyButton'); // Click Verify
      await simpleClick('emailVerificationBackButton'); // Click back
//      await simpleClick('profileCloseSignInModal'); // Clicks on Sign Out
      await simpleTextInput('enterVoterEmailAddress', 'A'.repeat(1000)); // Type input
//      await simpleClick('changeEmailAddressButton'); // Click change email address
//      await simpleTextInput('enterVoterEmailAddress', "'@gmail.com") // Type input
//      await simpleClick('voterEmailAddressEntrySendCode') // Click Send Verification Code
//      await simpleClick('emailVerifyButton'); // Click Verify
//      await simpleClick('enterVoterEmailAddress') // Click input box
      await simpleClick('cancelEmailButton'); // Clicks the cancel button
    } else if (isAndroid && isMobileScreenSize) { // Android mobile browsers can't click this element without scrolling
      // Don't test
    } else {
      await simpleClick('signInHeaderBar'); // Clicks on Sign in
      await simpleClick('emailSignIn-splitIconButton'); // Clicks "Sign in with an email" button
      await simpleClick('enterVoterEmailAddress'); // Puts cursor in Email address text input
      await simpleClick('profileCloseSignInModal'); // Clicks on Sign Out
    }

		// //////////////////////
    // Check the positioning of the SignInModal when we click "Enter Phone"
    if (isCordovaFromAppStore && isAndroid) {
      await simpleClick('signInHeaderBar'); // Clicks on Sign in
      await simpleClick('smsSignIn-splitIconButton'); // Clicks "Sign in with a text" button
      await simpleTextInput('enterVoterPhone', '18004444444') // Inputs voter phone number
      await simpleClick('voterPhoneSendSMS'); // Clicks "Send Verification Code"
      await simpleTextInput("digit1", "0");
      await simpleTextInput("digit2", "1");
      await simpleTextInput("digit3", "2");
      await simpleTextInput("digit4", "3");
      await simpleTextInput("digit5", "4");
      await simpleTextInput("digit6", "5");
//      await selectClick('[name="VERIFY"]'); // Click Verify
//      await selectClick('[name="CHANGE PHONE NUMBER"]'); // Click change phone number
//      await simpleClick('enterVoterPhone') // Click input box
//      await simpleClick('voterPhoneSendSMS') // Click Send Verification Code
//      await selectClick('[name="BACK"]'); // Click Verify
//      await simpleClick('enterVoterPhone') // Click input box
//      await simpleClick('cancelVoterPhoneSendSMS'); // Clicks the cancel button
    } else  if (isAndroid && isMobileScreenSize) {  // Samsung mobile browsers can't click this element without scrolling
      // Don't test
    } else {
      await simpleClick('signInHeaderBar'); // Clicks on Sign in
      await simpleClick('enterVoterPhone'); // Puts cursor in Phone text input
      await simpleClick('profileCloseSignInModal'); // Clicks on X
    }

    await simpleClick('profilePopUpYourSettings');
    await simpleTextInput("first-name", "Hello how are you");
    await simpleTextInput("last-name", "I am great thanks");
    await simpleTextInput("organization-name", "I am really cool");
    await simpleTextInput("organizationWebsiteTextArea", "aHahahaha ");
    await simpleTextInput("organizationDescriptionTextArea", "Sup I'm gangsta");
    await simpleClick("edit");
    await selectClick('#securityAndSignIn span');
    await simpleTextInput("enterVoterPhone", "9723591212");
    await simpleClick('voterPhoneSendSMS');
    await simpleTextInput('enterVoterEmailAddress', 'test@gmail.com');
    await simpleClick('voterEmailAddressEntrySendCode');
    await simpleTextInput("digit1", "0");
    await simpleTextInput("digit2", "1");
    await simpleTextInput("digit3", "2");
    await simpleTextInput("digit4", "3");
    await simpleTextInput("digit5", "4");
    await simpleTextInput("digit6", "5");
    await simpleClick("emailVerifyButton");
    await simpleClick('codeVerificationDialog');
    await simpleClick('changeEmailAddressButton');
    await selectClick('=Send Verification Again');
    await simpleClick('emailVerificationBackButton');
    await simpleClick('notifications');
    await simpleClick('newsletterOptIn');
    await simpleClick('domain');
    await selectClick('=Site Text');
    await simpleTextInput('addTitleHereInput', '>script>alert("1")>/script>');
    await simpleTextInput("addIntroductionHereInput", "' or 1=1 -- -");
    await simpleClick('siteTextSaveButton');
    await simpleClick('sharing');
//    await simpleClick('hideWeVoteLogoSwitch'); // Switch is not clickable
    await scrollIntoViewSimple("settingsSharingInputBox");
    await simpleTextInput("settingsSharingInputBox", "' or 1=1 -- -");
    await simpleClick('cancelChosenSocialShareDescriptionButton');
//    await simpleClick('chosenPreventSharingOpinions'); // Switch is not clickable
    await scrollIntoViewSimple("subscriptionPlan");
    await simpleClick('subscriptionPlan');
    await simpleClick('changePlanButton');
    await simpleClick("profileClosePaidAccountUpgradeModal");
    await simpleClick('analytics');
    await simpleTextInput("googleAnalyticsTrackerInput", ">script>alert('1')>/script>");
    await simpleClick('googleAnalyticsTrackerInputCancel');
    await simpleTextInput("verifyWebmasterToolInput", ">meta name='>script>alert(1)>/script>'>");
    await simpleClick('verifyWebmasterToolCancelButton');
    await simpleTextInput("verifyWebmasterToolInput", ">meta name='>script>alert(1)>/script>'>");
    await simpleClick('verifyWebmasterToolSaveButton');
    await simpleClick('toolsForYourWebsite');
    await simpleClick('codeCopierInteractiveBallotTool');
    await selectClick('=Show Code');
    await selectClick('=Hide Code');
    await simpleTextInput("enterTwitterHandleInput", "@>script>alert('1')>/script>");
    await scrollIntoViewSimple('codeCopierVoterRegistrationTool');
    await simpleClick('codeCopierVoterRegistrationTool');

    await selectClick('=Show Code');
    await selectClick('=Hide Code');

    await simpleClick('codeCopierAbsenteeBallotTool');
    await selectClick('=Show Code');
    await selectClick('=Hide Code');
    await simpleClick('codeCopierCheckRegistrationStatusTool');
    await selectClick('=Show Code');
    await selectClick('=Hide Code');
    await simpleClick('codeCopierElectionReminderTool');
    await selectClick('=Show Code');
    await selectClick('=Hide Code');
    await scrollIntoViewSimple('selectVoterGuidesSideBarNewVoterGuide');
    await simpleClick('selectVoterGuidesSideBarNewVoterGuide');
    await simpleClick('profileCloseVoterGuideChooseElectionModal'); 
    await simpleClick('selectVotingGuidesSideBarLinkEdit');
    await browser.back();
    await simpleClick('selectVotingGuidesSideBarLinkPreview');
    await browser.back();
    await scrollIntoViewSelect('=Click to view example');
    await selectClick('.SelectVoterGuidesSideBar__Column-sc-12b71ji-2:nth-child(2) #selectVotingGuidesSideBarLinkEdit > .MuiButton-label');
    await browser.back();
    await selectClick('.SelectVoterGuidesSideBar__Column-sc-12b71ji-2:nth-child(2) #selectVotingGuidesSideBarLinkPreview > .MuiButton-label');
    await browser.back();

    await selectClick('.SelectVoterGuidesSideBar__Column-sc-12b71ji-2:nth-child(3) #selectVotingGuidesSideBarLinkEdit > .MuiButton-label');
    await browser.back();
    await selectClick('.SelectVoterGuidesSideBar__Column-sc-12b71ji-2:nth-child(3) #selectVotingGuidesSideBarLinkPreview > .MuiButton-label');
    await browser.back();
  });
});
