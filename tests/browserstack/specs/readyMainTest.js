const { simpleClick, selectClick, simpleTextInput, selectTextInput, scrollIntoViewSimple, hiddenClickNth, hiddenSelectClick, hiddenClick } = require('../utils');

const PAUSE_DURATION_MICROSECONDS = 1250;
const ANDROID_CONTEXT = 'WEBVIEW_org.wevote.cordova';
const IOS_CONTEXT = 'WEBVIEW_1';

describe('Basic cross-platform We Vote test',  () => {
  it('should load the app or url', async () => {
    const { isCordova } = driver.config.capabilities;
    const xssTest = '<img src=javascript:alert("1")>';
    const enter = '\uE007';

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

    it('should enter an address', async () => {
      await simpleTextInput('editAddressOneHorizontalRowTextForMapSearch', `Oakland, CA 94501${enter}`); // Enter address
    });

    it('should search for candidates and opinions', async () => {
      await simpleTextInput('findCandidatesAndOpinionsSearch', `Biden${enter}`); // Enter address
      await browser.back();
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
    });

    it('should test "We Vote makes being a voter easier', async () => {
      await hiddenClickNth('showMoreReadyIntroductionCompressed', 2); // Click "Show More"
      await simpleClick('readMore'); // Click "More"
      await simpleClick('readMore'); // Click "More"
      await simpleClick('showLess'); // Click "Show Less"
      await simpleClick('showLess'); // Click "Show Less"
      await hiddenClickNth('showMoreReadyIntroductionCompressed', 2); // Click "Show More"
    });

    it('should test "Voting?" Section', async() => {
      await simpleClick('decideOnCandidatesButton'); // Click "Decide on candidates" Button
      await browser.back(); // Go back
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      await simpleClick('decideOnMeasuresButton'); // Click "Decide on candidates" Button
      await browser.back(); // Go back
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      await simpleClick('howItWorksButton'); // Click "How It Works" Button
      await simpleClick('annotatedSlideShowStep1Next'); // Click next
      await simpleClick('annotatedSlideShowStep2Next'); // Click next
      await simpleClick('annotatedSlideShowStep3Next'); // Click next
      await simpleClick('annotatedSlideShowStep4Next'); // Click next
      await simpleClick('howItWorksGetStartedDesktopButton'); // Click "Get Started"
      await simpleClick('profileCloseSignInModal'); // Click "X"
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

    it('should test Values To Follow', async () => {
      await scrollIntoViewSimple('verifyRegisteredInStateButton'); // Scroll to section
      await hiddenSelectClick('[id^="issueFollowButton"]'); // Follow a value
      await simpleClick('readMore'); // Click "More"
      await simpleClick('showLess'); // Click "Show Less"
      await hiddenClick('valuesToFollowPreviewShowMoreId'); // Click "Explore all values"
      await browser.back(); // Go back
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
    });

    it('should test "When and Where Will You Vote?" Section', async () => {
      await simpleClick('makeYourPlanNowButton'); // Click "Make Your Plan Now" Button
      await simpleClick('selectVotingRoughDate'); // Choose voting date
      await selectClick('option[value="asap"]'); // Choose "The day before election day"
      await simpleClick('selectApproximateTime'); // Choose time
      await selectClick('option[value="9:00 AM"]'); // Click "9:00 AM"
      await simpleClick('selectModeOfTransport'); // Choose mode of transport
      await selectClick('option[value="drive"]'); // Choose "drive"
      await simpleClick('selectLocationToDeliverBallot'); // Choose location to deliver ballot
      await selectClick('option[value="voting center"]'); // Choose "voting center"
      await simpleTextInput('enterVotingLocationAddress', xssTest); // Enter in address
      await simpleClick('findPollingLocationButton'); // Click "Find Voting Center"
      await browser.switchWindow(browser.getWindowHandle().toString()); // Switch back to ready page
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      await simpleClick('addedToCalendar'); // Click "I added this to my calendar"
      await simpleClick('addedToCalendar');
      await simpleClick('textMeReminder'); // Click "Please text me a reminder at:
      await selectTextInput('input[name="textMeReminderPhoneNumber"]', '8325839162'); // Enter in address
      await simpleClick('emailMeReminder'); // Click "Please email me a reminder at:"
      await selectTextInput('input[name="emailMeReminderEmailAddress"]', 'Luobrandon6@gmail.com'); // Enter in email address
      await simpleClick('yourPlanForVotingSaveButton'); // Click save
    });

 //   it('Are Your Friends Ready to Vote?', async () => {
 //     await simpleClick(''); // Click 
 //   });

  });
});
