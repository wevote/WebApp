const { simpleClick, selectClick, simpleTextInput, selectTextInput, scrollIntoViewSimple } = require('../utils');
const PAUSE_DURATION_MICROSECONDS = 1500;
const ANDROID_CONTEXT = 'WEBVIEW_org.wevote.cordova';
const IOS_CONTEXT = 'WEBVIEW_1';

describe('Basic cross-platform We Vote test',  () => {
  it('should load the app so we can run tests', async () => {
    const { isCordova, isMobile } = driver.config.capabilities;
    const xssTest = '<img src=javascript:alert("1")>'
    
    if (isCordova) {
      // switch contexts and click through intro
      const contexts = await driver.getContexts();
      const context = contexts.includes(ANDROID_CONTEXT) ? ANDROID_CONTEXT : IOS_CONTEXT;
      await driver.switchContext(context);
      await selectClick('div[data-index="0"] .intro-story__btn--bottom'); // Click first next button
      await selectClick('div[data-index="1"] .intro-story__btn--bottom'); // Click second next button
      await selectClick('div[data-index="2"] .intro-story__btn--bottom'); // Click third next button
    } else {
      // navigate browser to WeVote QA site
      await browser.url('ready');
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
    }
      
    // //////////////////////
    // Test "Voting?" Section
    const parentWindowHandle = await browser.getWindowHandle(); // Get window handle
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick('howItWorksButton'); // Click "How It Works" Button
    await simpleClick('annotatedSlideShowStep1Next'); // Click next
    await simpleClick('annotatedSlideShowStep2Next'); // Click next
    await simpleClick('annotatedSlideShowStep3Next'); // Click next
    await simpleClick('annotatedSlideShowStep4Next'); // Click next
    await simpleClick('howItWorksGetStartedDesktopButton'); // Click "Get Started"
    await simpleClick('profileCloseSignInModal'); // Click "X"
    await simpleClick('whatsAPersonalizedScoreButton'); // Click "What's a personalized score?" Button
    await simpleClick('personalizedScoreIntroModalNextButton'); // Click "Say What?"
    await simpleClick('personalizedScoreIntroModalNextButton'); // Click "Next"
    await simpleClick('personalizedScoreIntroModalNextButton'); // Click "Tell Me!"
    await simpleClick('personalizedScoreIntroModalNextButton'); // Click "I'll Pretend"
    await simpleClick('personalizedScoreIntroModalNextButton'); // Click "Next"
    await simpleClick('personalizedScoreIntroModalNextButton'); // Click "Show"
    await simpleClick('closeYourPersonalizedScorePopover'); // Close personalized popover
    await simpleClick('personalizedScoreIntroModalNextButton'); // Click "Next"
    await simpleClick('popoverCloseButton'); // Close popover
    await simpleClick('closeYourPersonalizedScorePopover'); // Close personalized popover
    await simpleClick('personalizedScoreIntroModalNextButton'); // Click "Next"
    await simpleClick('closeYourPersonalizedScorePopover'); // Close personalized popover
    await simpleClick('personalizedScoreIntroModalNextButton'); // Click "Got it!"
    await simpleClick('personalizedScoreIntroModalNextButton'); // Click "All done!"
    await simpleClick('decideOnCandidatesButton'); // Click "Decide on candidates" Button
    await browser.back(); // Go back 
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick('makeYourPlanNowButton'); // Click "Make Your Plan Now" Button
    await simpleClick('selectVotingRoughDate'); // Choose voting date
    await selectClick('option[value="day-before"]'); // Choose "The day before election day"
    await simpleClick('selectApproximateTime'); // Choose time
    await selectClick('option[value="9:00 AM"]'); // Click "9:00 AM"
    await simpleClick('selectModeOfTransport'); // Choose mode of transport
    await selectClick('option[value="drive"]'); // Choose "drive"
    await simpleClick('selectLocationToDeliverBallot'); // Choose location to deliver ballot
    await selectClick('option[value="voting center"]'); // Choose "voting center"
    await simpleTextInput('enterVotingLocationAddress',xssTest); // Enter in address
    await simpleClick('findPollingLocationButton'); // Click "Find Voting Center"
    await browser.switchToWindow(parentWindowHandle); // Switch back to ready page
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick('addedToCalendar'); // Click "I added this to my calendar"
    await simpleClick('textMeReminder'); // Click "Please text me a reminder at:
    await selectTextInput('input[name="textMeReminderPhoneNumber"]',xssTest); // Enter in address
    await simpleClick('emailMeReminder'); // Click "Please email me a reminder at:"
    await selectTextInput('input[name="emailMeReminderEmailAddress"]',xssTest); // Enter in email address
    await simpleClick('yourPlanForVotingSaveButton'); // Click save
  });
});
