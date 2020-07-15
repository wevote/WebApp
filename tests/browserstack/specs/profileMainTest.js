const assert = require('assert');
const { scrollIntoViewSimple, scrollIntoViewSelect, simpleClick, selectClick, simpleTextInput, selectTextInput} = require('../utils');

const PAUSE_DURATION_MICROSECONDS = 1250;
const ANDROID_CONTEXT = 'WEBVIEW_org.wevote.cordova';
const IOS_CONTEXT = 'WEBVIEW_';
const { twitterUserName, twitterPassword } = driver.config;
const { isAndroid, isCordovaFromAppStore, isMobileScreenSize, isIOS} = driver.config.capabilities;

describe('Cross browser automated testing',  () => {
  before(async () => {
    if (isCordovaFromAppStore) {
      // switch contexts and click through intro
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
    } else {
      // navigate browser to WeVote QA site
      await browser.url('ready');
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
    }
  });

  it('should sign in with twitter', async () =>  {
    if (twitterUserName && twitterPassword) {
//      await simpleClick('signInHeaderBar'); // Clicks on Sign in
//      await simpleClick('twitterSignIn-splitIconButton'); // Clicks on Twitter Sign in Button
//      await simpleTextInput('username_or_email', twitterUserName); // Enter Username or Email id
//      await simpleTextInput('password', twitterPassword); // Enter Password
//      await simpleClick('allow'); // Clicks on Authorize App
//      await selectTextInput('input[name="session[username_or_email]"]', twitterUserName);
//      await selectTextInput('input[name="session[password]"]', twitterPassword);
//      await selectClick('[data-testid="LoginForm_Login_Button"]');
//      await simpleTextInput('challenge_response', ''); // Clicks on 'Confirmation Code'
//      await simpleClick('allow'); // Clicks on Authorize App
    }
  });

  it('should sign in with email', async () =>  {
    if (isCordovaFromAppStore) {
      await simpleClick('signInHeaderBar'); // Clicks on Sign in
      await simpleClick('emailSignIn-splitIconButton'); // Clicks "Sign in with an email" button
      await simpleTextInput('enterVoterEmailAddress', 'test@gmail.com'); // Type input
      await simpleClick('voterEmailAddressEntrySendCode'); // Click Send Verification Code
      // Speed up entering digits
      await simpleTextInput('digit1', '0');
      await simpleTextInput('digit2', '1');
      await simpleTextInput('digit3', '2');
      await simpleTextInput('digit4', '3');
      await simpleTextInput('digit5', '4');
      await simpleTextInput('digit6', '5');
      await simpleClick('emailVerifyButton'); // Click Verify
      await simpleClick('emailVerificationBackButton'); // Click back
//      await simpleClick('profileCloseSignInModal'); // Clicks on Sign Out
      await simpleTextInput('enterVoterEmailAddress', 'A'.repeat(500)); // Type input
//      await simpleClick('changeEmailAddressButton'); // Click change email address
//      await simpleTextInput('enterVoterEmailAddress', "'@gmail.com") // Type input
//      await simpleClick('voterEmailAddressEntrySendCode') // Click Send Verification Code
//      await simpleClick('emailVerifyButton'); // Click Verify
//      await simpleClick('enterVoterEmailAddress') // Click input box
      await simpleClick('cancelEmailButton'); // Clicks the cancel button
    } else if (!isAndroid || !isMobileScreenSize) { // Android mobile browsers can't click this element without scrolling
      await simpleClick('signInHeaderBar'); // Clicks on Sign in
      await simpleClick('emailSignIn-splitIconButton'); // Clicks "Sign in with an email" button
      await simpleClick('enterVoterEmailAddress'); // Puts cursor in Email address text input
      await simpleClick('profileCloseSignInModal'); // Clicks on Sign Out
    }
  });

  it('should sign in with phone', async () => {
    if (isCordovaFromAppStore) {
      await simpleClick('signInHeaderBar'); // Clicks on Sign in
      await simpleClick('smsSignIn-splitIconButton'); // Clicks "Sign in with a text" button
      await simpleTextInput('enterVoterPhone', '18004444444'); // Inputs voter phone number
      await simpleClick('voterPhoneSendSMS'); // Clicks "Send Verification Code"
      // Speed up entering digits
      await simpleTextInput("digit1", "0");
      await simpleTextInput("digit2", "1");
      await simpleTextInput("digit3", "2");
      await simpleTextInput("digit4", "3");
      await simpleTextInput("digit5", "4");
      await simpleTextInput("digit6", "5");
      await simpleClick('emailVerifyButton'); // Click Verify
      if (!isIOS || !isCordovaFromAppStore) { // change phone number button can't be located
        await simpleClick('changeEmailAddressButton'); // Click change phone number
        await simpleClick('enterVoterPhone'); // Click input box
        await simpleClick('voterPhoneSendSMS'); // Click Send Verification Code
      }
      await simpleClick('emailVerificationBackButton'); // Click back
      await simpleClick('enterVoterPhone'); // Click input box
      await simpleClick('cancelVoterPhoneSendSMS'); // Clicks the cancel button
    } else {
      await simpleClick('signInHeaderBar'); // Clicks on Sign in
      await simpleClick('smsSignIn-splitIconButton'); // Clicks "Sign in with a text" button
      await simpleClick('enterVoterPhone'); // Puts cursor in Phone text input
      await simpleClick('cancelVoterPhoneSendSMS'); // Clicks the cancel button
    }
  });

  it('should test settings page', async () => {
    assert(await $$('#profileAvatarHeaderBar').length);
    await simpleClick('profileAvatarHeaderBar'); // Clicks on Setting
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
    // Speed up entering digits
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
