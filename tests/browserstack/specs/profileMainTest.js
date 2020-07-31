const { assert } = require('assert');
const { clearTextInputValue, scrollIntoViewSimple, scrollIntoViewSelect, simpleClick, selectClick, simpleTextInput, hiddenClick, selectTextInput } = require('../utils');

const PAUSE_DURATION_MICROSECONDS = 1250;
const WEBVIEW = 'WEBVIEW_';
const { voterDeviceId, twitterUserName, twitterPassword } = driver.config;
const { isAndroid, isCordovaFromAppStore, isIOS } = driver.config.capabilities;
const sqlTest = "' or 1=1 -- -";
const xssTest = '>script>alert("1")>/script>';
const xssTest2 = "@>script>alert('1')>/script>";
const xssTest3 = '">meta name=\'>script>alert(1)>/script>\'>"';

describe('Cross browser automated testing', async () => {
  // Run before any test
  before(async () => {
    if (isCordovaFromAppStore) {
      // For the apps downloadable from either the Apple App Store or Android Play Store,
      // click through the onboarding screens
      const contexts = await driver.getContexts();
      if (contexts[1].includes(WEBVIEW)) {
        await driver.switchContext(contexts[1]);
        await driver.setOrientation('LANDSCAPE');
        await driver.setOrientation('PORTRAIT');
      } else {
        await assert(false);
      }
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

  it('should sign in with email', async () =>  {
    await simpleClick('signInHeaderBar'); // Clicks on Sign in
    if (isCordovaFromAppStore) {
      await simpleClick('emailSignIn-splitIconButton');
    }
    await simpleTextInput('enterVoterEmailAddress', 'test@gmail.com'); // Type input
    await hiddenClick('voterEmailAddressEntrySendCode'); // Click Send Verification Code
    await simpleTextInput('digit1', '0');
    await simpleTextInput('digit2', '1');
    await simpleTextInput('digit3', '2');
    await simpleTextInput('digit4', '3');
    await simpleTextInput('digit5', '4');
    await simpleTextInput('digit6', '5');
    await simpleClick('emailVerifyButton'); // Click Verify
    await simpleClick('emailVerificationBackButton'); // Click back
    await simpleTextInput('enterVoterEmailAddress', 'A'.repeat(200)); // Type input
    await hiddenClick('cancelEmailButton'); // Clicks the cancel button
  });

  it('should sign in with phone', async () => {
    await simpleClick('signInHeaderBar'); // Clicks on Sign in
    if (isCordovaFromAppStore) {
      await simpleClick('smsSignIn-splitIconButton');
    }
    await simpleTextInput('enterVoterPhone', '15005550006'); // Inputs voter phone number
    await simpleClick('voterPhoneSendSMS'); // Clicks "Send Verification Code"
    await simpleTextInput("digit1", "0");
    await simpleTextInput("digit2", "1");
    await simpleTextInput("digit3", "2");
    await simpleTextInput("digit4", "3");
    await simpleTextInput("digit5", "4");
    await simpleTextInput("digit6", "5");
    await hiddenClick('emailVerifyButton'); // Click Verify
    await simpleClick('emailVerificationBackButton'); // Click back
    await simpleTextInput('enterVoterPhone', 'A'.repeat(200)); // Type input
    await simpleClick('cancelVoterPhoneSendSMS'); // Clicks the cancel button
    await browser.deleteSession();
  });

//  it('should set the cookie', async () =>  {
//    await browser.pause(PAUSE_DURATION_MICROSECONDS);
//    if (isCordovaFromAppStore && isIOS) {
//      await browser.setCookies({ name: 'voter_device_id', value: voterDeviceId, domain: '.^filecookies^' });
//      await simpleClick('readyTabFooterBar');
//    } else {
//      await browser.url('https://wevote.us/');
//      await browser.setCookies({ name: 'voter_device_id', value: voterDeviceId, domain: '.wevote.us' });
//      await browser.url('ready');
//    }
//    await browser.pause(PAUSE_DURATION_MICROSECONDS);
//  });

//  it('should sign in with twitter', async () =>  {
//    if (twitterUserName && twitterPassword) {
//      await simpleClick('signInHeaderBar'); // Clicks on Sign in
//      if (isCordovaFromAppStore && isIOS) {
//        // Bug
//        const twitterSignIn = await $('#twitterSignIn-splitIconButton');
//        const twitterX = await twitterSignIn.getLocation('x');
//        const twitterY = await twitterSignIn.getLocation('y');
//        await browser.touchAction({ action: 'tap', x: twitterX, y: twitterY });
//      } else {
//        await simpleClick('twitterSignIn-splitIconButton'); // Clicks on Twitter Sign in Button
//      }
//      if (isCordovaFromAppStore && isAndroid) {
//        await driver.switchContext('NATIVE_APP');
//        const username_or_email = await $('//android.widget.EditText[@resource-id="username_or_email"]');
//        await username_or_email.setValue(twitterUserName);
//        const password = await $('//android.widget.EditText[@resource-id="password"]');
//        await password.setValue(twitterPassword);
//        const allow = await $('//android.widget.Button[@resource-id="allow"]');
//        await allow.click();
//        const challenge_response = await $('//android.widget.EditText[@resource-id="challenge_response"]');
//        await challenge_response.setValue('4696256077');
//        const email_challenge_submit = await $('//android.widget.Button[@resource-id="email_challenge_submit"]');
//        await email_challenge_submit.click();
//        await driver.switchContext('WEBVIEW_org.wevote.cordova');
//      } else {
//        await simpleTextInput('username_or_email', twitterUserName); // Enter Username or Email id
//        await simpleTextInput('password', twitterPassword); // Enter Password
//        await simpleClick('allow'); // Clicks on Authorize App
//      }
//      await selectTextInput('input[name="session[username_or_email]"]', twitterUserName);
//      await selectTextInput('input[name="session[password]"]', twitterPassword);
//      await selectClick('[data-testid="LoginForm_Login_Button"]');
//      await simpleTextInput('challenge_response', ''); // Clicks on 'Confirmation Code'
//      await simpleClick('allow'); // Clicks on Authorize App
//    }
//  });

//  it('should test settings page', async () => {
//    await browser.pause(PAUSE_DURATION_MICROSECONDS * 10);
//    await hiddenClick('profileAvatarHeaderBar'); // Clicks on Setting
//    await hiddenClick('#profilePopUpYourSettings > button');
//    await simpleTextInput("first-name", 'A'.repeat(200));
//    await simpleTextInput("last-name", xssTest);
//    await simpleTextInput("organization-name", sqlTest);
//    await simpleTextInput("organizationWebsiteTextArea", 'A'.repeat(200));
//    await simpleTextInput("organizationDescriptionTextArea", xssTest);
//    await simpleClick("edit");
//    await selectClick('#securityAndSignIn span');
//    await simpleTextInput("enterVoterPhone", "15005550006");
//    await simpleClick('voterPhoneSendSMS');
//    await simpleTextInput('enterVoterEmailAddress', 'automated_voter1@WeVote.info');
//    await simpleClick('voterEmailAddressEntrySendCode');
//    await simpleTextInput("digit1", "0");
//    await simpleTextInput("digit2", "1");
//    await simpleTextInput("digit3", "2");
//    await simpleTextInput("digit4", "3");
//    await simpleTextInput("digit5", "4");
//    await simpleTextInput("digit6", "5");
//    await simpleClick("emailVerifyButton");
//    await simpleClick('codeVerificationDialog');
//    await simpleClick('changeEmailAddressButton');
//    await selectClick('=Send Verification Again');
//    await simpleClick('emailVerificationBackButton');
//    await simpleClick('notifications');
//    await simpleClick('newsletterOptIn');
//    await simpleClick('domain');
//    await selectClick('=Site Text');
//    await simpleTextInput('addTitleHereInput', xssTest);
//    await simpleTextInput("addIntroductionHereInput", sqlTest);
//    await simpleClick('siteTextSaveButton');
//    await simpleClick('sharing');
//  //    await simpleClick('hideWeVoteLogoSwitch'); // Switch is not clickable
//    await scrollIntoViewSimple("settingsSharingInputBox");
//    await simpleTextInput("settingsSharingInputBox", sqlTest);
//    await simpleClick('cancelChosenSocialShareDescriptionButton');
//  //    await simpleClick('chosenPreventSharingOpinions'); // Switch is not clickable
//    await scrollIntoViewSimple("subscriptionPlan");
//    await simpleClick('subscriptionPlan');
//    await simpleClick('changePlanButton');
//    await simpleClick("profileClosePaidAccountUpgradeModal");
//    await simpleClick('analytics');
//    await simpleTextInput("googleAnalyticsTrackerInput", xssTest);
//    await simpleClick('googleAnalyticsTrackerInputCancel');
//    await simpleTextInput("verifyWebmasterToolInput", xssTest3);
//    await simpleClick('verifyWebmasterToolCancelButton');
//    await simpleTextInput("verifyWebmasterToolInput", xssTest3);
//    await simpleClick('verifyWebmasterToolSaveButton');
//    await simpleClick('toolsForYourWebsite');
//
//    await simpleClick('codeCopierInteractiveBallotTool');
//    await selectClick('#codeCopierInteractiveBallotTool ~ div.u-stack--sm a:nth-child(1)');
//    await selectClick('#codeCopierInteractiveBallotTool ~ div.u-stack--sm a:nth-child(1)');
//
//    await simpleTextInput("enterTwitterHandleInput", xssTest2);
//    await clearTextInputValue("enterTwitterHandleInput", xssTest2);
//
//    await scrollIntoViewSelect('=Attributions');
//    await simpleClick('codeCopierVoterRegistrationTool');
//    await selectClick('#codeCopierVoterRegistrationTool ~ div.u-stack--sm a:nth-child(1)');
//    await selectClick('#codeCopierVoterRegistrationTool ~ div.u-stack--sm a:nth-child(1)');
//
//    await scrollIntoViewSelect('=Attributions');
//    await simpleClick('codeCopierAbsenteeBallotTool');
//    await selectClick('#codeCopierAbsenteeBallotTool ~ div.u-stack--sm a:nth-child(1)');
//    await selectClick('#codeCopierAbsenteeBallotTool ~ div.u-stack--sm a:nth-child(1)');
//
//    await scrollIntoViewSimple('codeCopierVoterRegistrationTool');
//    await simpleClick('codeCopierCheckRegistrationStatusTool');
//    await selectClick('#codeCopierCheckRegistrationStatusTool ~ div.u-stack--sm a:nth-child(1)');
//    await selectClick('#codeCopierCheckRegistrationStatusTool ~ div.u-stack--sm a:nth-child(1)');
//
//    await scrollIntoViewSimple('codeCopierVoterRegistrationTool');
//    await simpleClick('codeCopierElectionReminderTool');
//    await selectClick('#codeCopierElectionReminderTool ~ div.u-stack--sm a:nth-child(1)');
//    await selectClick('#codeCopierElectionReminderTool ~ div.u-stack--sm a:nth-child(1)');
//
//    await scrollIntoViewSimple('selectVoterGuidesSideBarNewVoterGuide');
//    await simpleClick('selectVoterGuidesSideBarNewVoterGuide');
//    await simpleClick('profileCloseVoterGuideChooseElectionModal');
//    await scrollIntoViewSelect('=Click to view example');
//  });
});
