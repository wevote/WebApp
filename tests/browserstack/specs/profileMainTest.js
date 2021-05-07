const { clearTextInputValue, scrollIntoViewSimple, scrollIntoViewSelect, simpleClick, selectClick, simpleTextInput, hiddenClick, selectTextInput, scrollDown, getHtml } = require('../utils');

const PAUSE_DURATION_MICROSECONDS = 1250;
const WEBVIEW = 'WEBVIEW_';
const { voterDeviceId, twitterUserName, twitterPassword } = driver.config;
const { os_version, isAndroid, isCordovaFromAppStore, isIOS } = driver.config.capabilities;
const sqlTest = "' or 1=1 -- -";
const xssTest = '>script>alert("1")>/script>';
const xssTest2 = "@>script>alert('1')>/script>";
const xssTest3 = '">meta name=\'>script>alert(1)>/script>\'>"';

const isMojave = os_version.includes('Mojave');
const isCatalina = os_version.includes('Catalina');


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
        await browser.deleteSession()
        }
        await browser.pause(PAUSE_DURATION_MICROSECONDS);
        await selectClick('div[data-index="0"] .intro-story__btn--bottom'); // Click first next button
        await selectClick('div[data-index="1"] .intro-story__btn--bottom'); // Click second next button
        await selectClick('div[data-index="2"] .intro-story__btn--bottom'); // Click third next button
        } else {
        // navigate browser to WeVote QA site
        await browser.maximizeWindow();
        await browser.url('ready');
        await browser.pause(PAUSE_DURATION_MICROSECONDS);
        }
    });

    it('should sign in with email', async () =>  {
        await simpleClick('signInHeaderBar'); // Clicks on Sign in
        if (isCordovaFromAppStore) {
        await simpleClick('emailSignIn-splitIconButton');
        }
        await simpleTextInput('enterVoterEmailAddress', 'automated_voter1@WeVote.info'); // Type input
        await hiddenClick('voterEmailAddressEntrySendCode'); // Click Send Verification Code
        await simpleTextInput('digit1', '0');
        await simpleTextInput('digit2', '1');
        await simpleTextInput('digit3', '2');
        await simpleTextInput('digit4', '3');
        await simpleTextInput('digit5', '4');
        await simpleTextInput('digit6', '5');
        await simpleClick('emailVerifyButton'); // Click Verify
        await simpleClick('changeEmailAddressButton');
        //await simpleClick('emailVerificationBackButton'); // Click back
        await simpleTextInput('enterVoterEmailAddress', xssTest); // Type input
        if (isMojave) {
        await simpleClick('profileCloseSignInModal');
        } else {
        await hiddenClick('cancelEmailButton'); // Clicks the cancel button
        }
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
        await simpleTextInput('enterVoterPhone', xssTest3); // Type input
        await simpleClick('cancelVoterPhoneSendSMS'); // Clicks the cancel button
        });

    it('should test notifications', async () => {
    await simpleClick('headerNotificationMenuIcon'); // Click notification icon
    await simpleClick('notificationsHeader');
    await selectClick('.u-cursor--pointer.u-link-color'); // Click add email address
    await simpleTextInput('enterVoterEmailAddress', 'automated_voter1@WeVote.info');
    await simpleClick('voterEmailAddressEntrySendCode');
    await simpleTextInput("digit1", "5");
    await simpleTextInput("digit2", "4");
    await simpleTextInput("digit3", "3");
    await simpleTextInput("digit4", "2");
    await simpleTextInput("digit5", "1");
    await simpleTextInput("digit6", "5");
    await simpleClick('emailVerifyButton'); // Click verify
    await simpleClick('changeEmailAddressButton'); // Click change email address
    await simpleClick('enterVoterEmailAddress'); // Click text box
    await simpleClick('cancelEmailButton'); // Cancel
    await selectClick('=Send Verification Again'); // Send verification again
    await simpleTextInput("digit1", "9");
    await simpleTextInput("digit2", "8");
    await simpleTextInput("digit3", "7");
    await simpleTextInput("digit4", "6");
    await simpleTextInput("digit5", "5");
    await simpleTextInput("digit6", "4");
    await simpleClick('emailVerificationBackButton'); // Back
    await selectClick('a svg'); // Delete email
    await simpleClick('backToLinkTabHeader');
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

  it('should test settings page', async () => {
    if (isCordovaFromAppStore) {
      await browser.deleteSession();
    }
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
    await simpleClick('toolsForYourWebsite');

    await selectClick('[id^=codeCopierInteractiveBallotTool]');
    await selectClick('[id^=codeCopierInteractiveBallotTool] ~ div.u-stack--sm a:nth-child(1)');
    await selectClick('[id^=codeCopierInteractiveBallotTool] ~ div.u-stack--sm a:nth-child(1)');

    await selectTextInput('[id^=enterTwitterHandleInput]', xssTest2);
    await selectTextInput('[id^=enterTwitterHandleInput]', '');

    await scrollIntoViewSelect('=Attributions');
    await selectClick('[id^=codeCopierVoterRegistrationTool]');
    await selectClick('[id^=codeCopierVoterRegistrationTool] ~ div.u-stack--sm a:nth-child(1)');
    await selectClick('[id^=codeCopierVoterRegistrationTool] ~ div.u-stack--sm a:nth-child(1)');
    await selectClick('[id^=codeCopierAbsenteeBallotTool]');
    await selectClick('[id^=codeCopierAbsenteeBallotTool] ~ div.u-stack--sm a:nth-child(1)');
    await selectClick('[id^=codeCopierAbsenteeBallotTool] ~ div.u-stack--sm a:nth-child(1)');

    await scrollIntoViewSelect('[id^=codeCopierVoterRegistrationTool]');
    await selectClick('[id^=codeCopierCheckRegistrationStatusTool]');
    await selectClick('[id^=codeCopierCheckRegistrationStatusTool] ~ div.u-stack--sm a:nth-child(1)');
    await selectClick('[id^=codeCopierCheckRegistrationStatusTool] ~ div.u-stack--sm a:nth-child(1)');
    await selectClick('[id^=codeCopierElectionReminderTool]');
    await selectClick('[id^=codeCopierElectionReminderTool] ~ div.u-stack--sm a:nth-child(1)');
    await selectClick('[id^=codeCopierElectionReminderTool] ~ div.u-stack--sm a:nth-child(1)');

    await selectClick('=check out the Vote.org premium tools.');
    await browser.switchWindow(browser.getWindowHandle().toString()); // Switch back to settings page

    await scrollIntoViewSimple('notifications');
    await simpleClick('selectVoterGuidesSideBarNewVoterGuide');
    if (!isCatalina) {
      await simpleClick('profileCloseVoterGuideChooseElectionModal');
    }
    await selectClick('=Click to view example');
    await browser.switchWindow(browser.getWindowHandle().toString()); // Switch back to settings page
    await browser.deleteSession();
  });
});
