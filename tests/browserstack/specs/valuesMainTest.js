const assert = require('assert');
const { clearTextInputValue, clickTopLeftCornerOfElement, scrollIntoViewSimple, scrollThroughPage, setNewAddress, setNewAddressAndroid, setNewAddressIOS, simpleClick, simpleCloseBootstrapModal, simpleTextInput, stopScript } = require('../utils');

async function follow() {
		href="/value/affordable_housing"

const ANDROID_CONTEXT = 'WEBVIEW_org.wevote.cordova';
const IOS_CONTEXT = 'WEBVIEW_1';
const PAUSE_DURATION_MICROSECONDS = 1250; describe('Basic cross-platform We Vote test',  () => {
  it('should load the app so we can run various tests', async () => {
    const { twitterUserName, twitterPassword } = driver.config;
    const { device, isAndroid, isCordovaFromAppStore, isMobileScreenSize, isIOS } = driver.config.capabilities;
    const isDesktopScreenSize = !isMobileScreenSize;
    const platformPrefixID = (isDesktopScreenSize) ? 'desktop' : 'mobile';
    const isOnePlus = device.includes('OnePlus');
    const isSamsung = device.includes('Samsung');
	const organizationToFollowID = 'wv02org57143';
	const publicFigureToFollowID = 'wv02org62651';
	const publicFigure2ToFollowID = 'wv02org53184';
	const sqlInjectionTest = await '\' or 1=1 -- -';

    if (isCordovaFromAppStore) {
      // ///////////////////////////////
      // For the apps downloadable from either the Apple App Store or Android Play Store,
      // click through the onboarding screens
      await browser.pause(PAUSE_DURATION_MICROSECONDS * 2);
      const contexts = await driver.getContexts();
      const context = contexts.includes(ANDROID_CONTEXT) ? ANDROID_CONTEXT : IOS_CONTEXT;
      await driver.switchContext(context);
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      const firstNextButton = await $('div[data-index="0"] .intro-story__btn--bottom');
      await firstNextButton.click();
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      const secondNextButton = await $('div[data-index="1"] .intro-story__btn--bottom');
      await secondNextButton.click();
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      const thirdNextButton = await $('div[data-index="2"] .intro-story__btn--bottom');
      await thirdNextButton.click();
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
    } else {
      // ///////////////////////////////
      // For the website version, open our quality testing site
      await browser.url('https://localhost:3000/values');
    }

    await browser.pause(PAUSE_DURATION_MICROSECONDS * 3);

    // //////////////////////
    // Test "Values to Follow" section 
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick('issueFollowButton'); // Clicks on "Follow"
    await browser.pause(PAUSE_DURATION_MICROSECONDS * 2);
    await simpleClick('toggle-button'); // Clicks on dropdown menu 
    await browser.pause(PAUSE_DURATION_MICROSECONDS * 2);
	var unfollowButton = await $('li.MuiButtonBase-root.MuiListItem-root.MuiMenuItem-root.MuiMenuItem-gutters.MuiListItem-gutters.MuiListItem-button');
    await unfollowButton.click(); // Clicks on "Unfollow"
    await browser.pause(PAUSE_DURATION_MICROSECONDS);

    await simpleClick('valuesToFollowPreviewShowMoreId'); // Clicks on "Explore all values"
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick('issueFollowButton'); // Clicks on "Follow"
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick('toggle-button'); // Clicks on dropdown menu
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
	unfollowButton = await $('li.MuiButtonBase-root.MuiListItem-root.MuiMenuItem-root.MuiMenuItem-gutters.MuiListItem-gutters.MuiListItem-button');
    await unfollowButton.click(); // Clicks on "Unfollow"
    await browser.pause(PAUSE_DURATION_MICROSECONDS);

    await simpleTextInput('search_input', `${sqlInjectionTest}`); // Input text into search bar
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    var clearSearchIcon = await $('img[src="/img/glyphicons-halflings-88-remove-circle.svg"]');
    await clearSearchIcon.click(); // Clicks on clear icon
    await browser.pause(PAUSE_DURATION_MICROSECONDS);

    await simpleTextInput('search_input', `${sqlInjectionTest}`); // Input text into search bar
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
	var searchButton = await $('i.fas.fa-search');
    await searchButton.click(); // Clicks on search button
    await browser.pause(PAUSE_DURATION_MICROSECONDS);

    await simpleClick('backToLinkTabHeader'); // Clicks on "Back"
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    
	var valueLink = await $('a[href="/value/affordable_housing"');
	await valueLink.click(); // Click link to value
	

    // //////////////////////
    // Test "Public Figures to Follow" section 
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick(`positionItemFollowToggleFollow-undefined-${publicFigureToFollowID}`); // Clicks on "Follow"
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick(`positionItemFollowToggleDropdown-undefined-${publicFigureToFollowID}`); // Clicks on dropdown menu
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick(`positionItemFollowToggleUnfollow-undefined-${publicFigureToFollowID}`); // Clicks on "Unfollow"
    await browser.pause(PAUSE_DURATION_MICROSECONDS);

    await simpleClick(`positionItemFollowToggleDropdown-undefined-${publicFigureToFollowID}`); // Clicks on dropdown menu
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick(`positionItemFollowToggleIgnore-undefined-${publicFigureToFollowID}`); // Clicks on "Ignore"
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick(`positionItemFollowToggleDropdown-undefined-${publicFigureToFollowID}`); // Clicks on dropdown menu
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick(`positionItemFollowToggleStopIgnoring-undefined-${publicFigureToFollowID}`); // Clicks on "Stop Ignoring"
    await browser.pause(PAUSE_DURATION_MICROSECONDS);

    // //////////////////////
    // Tests endorsements and twitter sign in 
	if (isDesktopScreenSize) { 								// Only for desktop
		await simpleClick('twitterSignIn-splitIconButton'); // Clicks on "Find Public Opinions"
		await browser.pause(PAUSE_DURATION_MICROSECONDS);

		await simpleClick('undefined-splitIconButton'); // Clicks on "Add Endorsements"
		await browser.pause(PAUSE_DURATION_MICROSECONDS);
	}

    // //////////////////////
    // Tests organizations to follow
	await scrollIntoViewSimple(`positionItemFollowToggleFollow-undefined-${organizationToFollowID}`); // Scrolls to organization
    await simpleClick(`positionItemFollowToggleFollow-undefined-${organizationToFollowID}`); // Clicks on "Follow"
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick(`positionItemFollowToggleDropdown-undefined-${organizationToFollowID}`); // Clicks on dropdown menu
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick(`positionItemFollowToggleUnfollow-undefined-${organizationToFollowID}`); // Clicks on "Unfollow"
    await browser.pause(PAUSE_DURATION_MICROSECONDS);

    await simpleClick(`positionItemFollowToggleDropdown-undefined-${organizationToFollowID}`); // Clicks on dropdown menu
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick(`positionItemFollowToggleIgnore-undefined-${organizationToFollowID}`); // Clicks on "Ignore"
    await browser.pause(PAUSE_DURATION_MICROSECONDS);

    await simpleClick(`positionItemFollowToggleDropdown-undefined-${organizationToFollowID}`); // Clicks on dropdown menu
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick(`positionItemFollowToggleStopIgnoring-undefined-${organizationToFollowID}`); // Clicks on "Stop Ignoring"
    await browser.pause(PAUSE_DURATION_MICROSECONDS);

    // //////////////////////
    // Tests "Explore more organizations" page
    await simpleClick('organizationsToFollowPreviewShowMoreId'); // Clicks on "Explore more organizations"
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
	
    await simpleClick(`positionItemFollowToggleFollow-undefined-${publicFigure2ToFollowID}`); // Clicks on "Follow"
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick(`positionItemFollowToggleDropdown-undefined-${publicFigure2ToFollowID}`); // clicks on dropdown menu
    await browser.pause(pause_duration_microseconds);
    await simpleClick(`positionItemFollowToggleUnfollow-undefined-${publicFigure2ToFollowID}`); // clicks on "Unfollow" 
    await browser.pause(pause_duration_microseconds);

    await simpleClick(`positionItemFollowToggleDropdown-undefined-${publicFigure2ToFollowID}`); // clicks on dropdown menu
    await browser.pause(pause_duration_microseconds);
    await simpleClick(`positionItemFollowToggleIgnore-undefined-${publicFigure2ToFollowID}`); // clicks on "Ignore" 
    await browser.pause(pause_duration_microseconds);

    await simpleClick(`positionItemFollowToggleDropdown-undefined-${publicFigure2ToFollowID}`); // clicks on dropdown menu
    await browser.pause(pause_duration_microseconds);
    await simpleClick(`positionItemFollowToggleStopIgnoring-undefined-${publicFigure2ToFollowID}`); // clicks on "Stop Ignoring" 
    await browser.pause(pause_duration_microseconds);

    await simpleTextInput('search_input', `${sqlInjectionTest}`); // Input text into search bar
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
	await clearSearchIcon.click(); // Clear search bar

    await simpleTextInput('search_input', `${sqlInjectionTest}`); // Input text into search bar
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await searchButton.click(); // Clicks search 
    await browser.pause(PAUSE_DURATION_MICROSECONDS);

    await simpleClick('backToLinkTabHeader'); // Clicks on "Back"
    await browser.pause(PAUSE_DURATION_MICROSECONDS);

    assert(true);
  });
});
