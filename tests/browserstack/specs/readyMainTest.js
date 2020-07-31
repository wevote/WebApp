const { simpleClick, selectClick, simpleTextInput, selectTextInput, hiddenSelectClick, hiddenTextInputNth, hiddenClickNth, hiddenSelectTextInput, getHtml, scrollIntoViewSimple } = require('../utils');

const PAUSE_DURATION_MICROSECONDS = 1250;
const WEBVIEW = 'WEBVIEW_';
const xssTest = '<img src=javascript:alert("1")>';
const enter = '\uE007';
const { isAndroid, isIOS, isCordovaFromAppStore } = driver.config.capabilities;
let webview_context;

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
        webview_context = contexts[1];
      } else {
        await browser.deleteSession();
      }
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      await selectClick('div[data-index="0"] .intro-story__btn--bottom'); // Click first next button
      await selectClick('div[data-index="1"] .intro-story__btn--bottom'); // Click second next button
      await selectClick('div[data-index="2"] .intro-story__btn--bottom'); // Click third next button
    } else {
      // navigate browser to WeVote QA site
      await browser.maximizeWindow();
      await browser.url('ready');
      await browser.pause(PAUSE_DURATION_MICROSECONDS * 5);
    }
  });

  it('should enter an address', async () => {
    await simpleTextInput('editAddressOneHorizontalRowTextForMapSearch', `Oakland, CA 94501`); // Enter address
    await simpleClick('editAddressOneHorizontalRowSaveButton');
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
  });

  it('should search for candidates and opinions', async () => {
    if (isCordovaFromAppStore && isIOS) {
      await hiddenSelectTextInput('[class^="MuiInputBase-input FindOpinionsForm-inputDefaultLarge-"]', 'President');
      await hiddenSelectClick('[class^="MuiButtonBase-root MuiIconButton-root FindOpinionsForm-iconButtonRoot-"]');
    } else {
      await hiddenTextInputNth('[id^=findCandidatesAndOpinionsSearch]', 2, 'President');
      await selectClick('[id^=findCandidatesAndOpinionsIconClick-]');
    }
    await browser.back();
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
  });

  it('should test "We Vote makes being a voter easier', async () => {
    await simpleClick('showMoreReadyIntroductionCompressed'); // Click "Show More"
    await simpleClick('readMore'); // Click "More"
    await simpleClick('readMore'); // Click "More"
    await simpleClick('showLess'); // Click "Show Less"
    await simpleClick('showLess'); // Click "Show Less"
    await simpleClick('showMoreReadyIntroductionCompressed', 2); // Click "Show More"
  });

  it('should test "Voting?" Section', async() => {
    await scrollIntoViewSimple('showMoreReadyIntroductionCompressed');
    await simpleClick('decideOnCandidatesButton'); // Click "Decide on candidates" Button
    await browser.back(); // Go back
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    if (isCordovaFromAppStore && isIOS) {
      await selectClick('[class^="MuiButtonBase-root MuiButton-root MuiButton-outlined"]'); // Click "Decide on measures" Button
    } else {
      await simpleClick('decideOnMeasuresButton'); // Click "Decide on measures" Button
    }
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await browser.back(); // Go back
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick('howItWorksButton'); // Click "How It Works" Button
    await simpleClick('annotatedSlideShowStep1Next'); // Click next
    await simpleClick('annotatedSlideShowStep2Next'); // Click next
    await simpleClick('annotatedSlideShowStep3Next'); // Click next
    await simpleClick('annotatedSlideShowStep4Next'); // Click next
    await simpleClick('howItWorksGetStartedDesktopButton'); // Click "Get Started"
    await simpleClick('profileCloseSignInModal'); // Click "X"
    if (isCordovaFromAppStore) {
      await simpleClick('readyTabFooterBar');
      await scrollIntoViewSimple('showMoreReadyIntroductionCompressed');
    }
    await simpleClick('showMoreBallotButtons'); // Click "show more"
    await simpleClick('whatsAPersonalizedScoreButton'); // Click "What's a personalized score?" Button
    await simpleClick('personalizedScoreIntroModalNextButton'); // Click "Say What?"
    await simpleClick('personalizedScoreIntroModalNextButton'); // Click "Next"
    await simpleClick('personalizedScoreIntroModalNextButton'); // Click "Tell Me!"
    await simpleClick('personalizedScoreIntroModalNextButton'); // Click "I'll Pretend"
    await simpleClick('personalizedScoreIntroModalNextButton'); // Click "Next"
    await simpleClick('personalizedScoreIntroModalNextButton'); // Click "Show"
    await simpleClick('personalizedScoreIntroModalNextButton'); // Click "Next"
    await simpleClick('popoverCloseButton'); // Close popover
    await simpleClick('personalizedScoreIntroModalNextButton'); // Click "Next"
    await simpleClick('personalizedScoreIntroModalNextButton'); // Click "Got it!"
    await simpleClick('personalizedScoreIntroModalNextButton'); // Click "All done!"
  });

//    it('should test "Registered to Vote?" Section', async () => {
//      await simpleClick('verifyRegisteredInStateButton'); // Click "Verify You Are Registered in your State"
//      await simpleTextInput('outlined-age-native-simple', 'CA'); // Select California
//    });

//  it('should test Values To Follow', async () => {
//    await scrollIntoViewSimple('verifyRegisteredInStateButton'); // Scroll to section
//    await hiddenSelectClick('[id^="issueFollowButton"]'); // Follow a value
//    await simpleClick('readMore'); // Click "More"
//    await simpleClick('showLess'); // Click "Show Less"
//    await hiddenClick('valuesToFollowPreviewShowMoreId'); // Click "Explore all values"
//    await browser.back(); // Go back
//    await browser.pause(PAUSE_DURATION_MICROSECONDS);
//  });

  it('should test "When and Where Will You Vote?" Section', async () => {
    await simpleClick('makeYourPlanNowButton'); // Click "Make Your Plan Now" Button
    await simpleClick('selectVotingRoughDate'); // Choose voting date
    if (isCordovaFromAppStore && isIOS) {
      await driver.switchContext('NATIVE_APP');
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      let options = await $('//XCUIElementTypePickerWheel');
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      await options.addValue('The day before election day');
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      await driver.switchContext(webview_context);
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      await simpleClick('selectApproximateTime'); // Choose time
      await driver.switchContext('NATIVE_APP');
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      options = await $('//XCUIElementTypePickerWheel');
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      await options.addValue('9:00 AM');
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      await driver.switchContext(webview_context);
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      await simpleClick('selectModeOfTransport'); // Choose mode of transport
      await driver.switchContext('NATIVE_APP');
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      options = await $('//XCUIElementTypePickerWheel');
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      await options.addValue('drive');
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      await driver.switchContext(webview_context);
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      await simpleClick('selectLocationToDeliverBallot'); // Choose location to deliver ballot
      await driver.switchContext('NATIVE_APP');
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      options = await $('//XCUIElementTypePickerWheel');
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      await options.addValue('voting center');
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      await driver.switchContext(webview_context);
    } else if (isAndroid && isCordovaFromAppStore) {
      await driver.switchContext('NATIVE_APP');
      await browser.pause(PAUSE_DURATION_MICROSECONDS);

      const selectVotingRoughDate = await $('//android.widget.CheckedTextView[@text="The day before election day"]');
      await browser.pause(PAUSE_DURATION_MICROSECONDS);

      await selectVotingRoughDate.click();
      await browser.pause(PAUSE_DURATION_MICROSECONDS);

      await driver.switchContext(webview_context);
      await browser.pause(PAUSE_DURATION_MICROSECONDS);

      await simpleClick('selectApproximateTime'); // Choose time

      await driver.switchContext('NATIVE_APP');
      await browser.pause(PAUSE_DURATION_MICROSECONDS);

      const selectApproximateTime = await $('//android.widget.CheckedTextView[@text="9:00 AM"]'); // Click "9:00 AM"
      await browser.pause(PAUSE_DURATION_MICROSECONDS);

      await selectApproximateTime.click();
      await browser.pause(PAUSE_DURATION_MICROSECONDS);

      await driver.switchContext(webview_context);
      await browser.pause(PAUSE_DURATION_MICROSECONDS);

      await simpleClick('selectModeOfTransport'); // Choose mode of transport

      await driver.switchContext('NATIVE_APP');
      await browser.pause(PAUSE_DURATION_MICROSECONDS);

      const selectModeOfTransport = await $('//android.widget.CheckedTextView[@text="drive"]'); // Choose "drive"
      await browser.pause(PAUSE_DURATION_MICROSECONDS);

      await selectModeOfTransport.click();
      await browser.pause(PAUSE_DURATION_MICROSECONDS);

      await driver.switchContext(webview_context);
      await browser.pause(PAUSE_DURATION_MICROSECONDS);

      await simpleClick('selectLocationToDeliverBallot'); // Choose location to deliver ballot

      await driver.switchContext('NATIVE_APP');
      await browser.pause(PAUSE_DURATION_MICROSECONDS);

      const selectLocationToDeliverBallot = await $('//android.widget.CheckedTextView[@text="voting center"]');
      await browser.pause(PAUSE_DURATION_MICROSECONDS);

      await selectLocationToDeliverBallot.click();
      await browser.pause(PAUSE_DURATION_MICROSECONDS);

      await driver.switchContext(webview_context);
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
    } else {
      await hiddenSelectClick('option[value="asap"]'); // Choose ""
      await simpleClick('selectApproximateTime'); // Choose time
      await browser.keys(`9:00 AM${enter}`); // Click "9:00 AM"
      await simpleClick('selectModeOfTransport'); // Choose mode of transport
      await browser.keys(`drive${enter}`); // Choose "drive"
      await simpleClick('selectLocationToDeliverBallot'); // Choose location to deliver ballot
      await browser.keys(`voting center${enter}`); // Choose "voting center"
    }
    await simpleTextInput('enterVotingLocationAddress', xssTest); // Enter in address
    await simpleClick('findPollingLocationButton'); // Click "Find Voting Center"
    if (isCordovaFromAppStore && isIOS) {
      await driver.switchContext('NATIVE_APP');
      const done = await $('//XCUIElementTypeButton[@name="Done"]'); // Click done
      await done.click(); // Click done
      await driver.switchContext(webview_context);
    } else if (isCordovaFromAppStore && isAndroid) {
      await driver.switchContext('NATIVE_APP');
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      const close = await $('//android.widget.ImageButton[@resource-id="com.android.chrome:id/close_button"]');
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      await close.click(); // Click X
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      await driver.switchContext(webview_context);
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
    } else {
      await browser.switchWindow(browser.getWindowHandle().toString()); // Switch back to ready page
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      await simpleClick('addedToCalendar'); // Click "I added this to my calendar"
      await simpleClick('addedToCalendar');
      await simpleClick('textMeReminder'); // Click "Please text me a reminder at:
      await selectTextInput('input[name="textMeReminderPhoneNumber"]', '15005550006'); // Enter in address
      await simpleClick('emailMeReminder'); // Click "Please email me a reminder at:"
      await selectTextInput('input[name="emailMeReminderEmailAddress"]', 'Luobrandon6@gmail.com'); // Enter in email address
    }
    await simpleClick('yourPlanForVotingSaveButton'); // Click save
    await browser.deleteSession();
  });

//   it('Are Your Friends Ready to Vote?', async () => {
//     await simpleClick(''); // Click 
//   });

});
