const assert = require('assert');
const { clearTextInputValue, clickTopLeftCornerOfElement, scrollIntoViewSimple, scrollThroughPage, setNewAddress, setNewAddressAndroid, setNewAddressIOS, simpleClick, simpleCloseBootstrapModal, simpleTextInput, stopScript } = require('../utils');

async function search(clearSearchIcon, searchButton, searchBarId, searchValue) {
    await simpleTextInput(searchBarId, searchValue); // Input text into search bar
	await clearSearchIcon.click(); // Clear search bar
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleTextInput(searchBarId, searchValue); // Input text into search bar
    await searchButton.click(); // Clicks search 
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
}

async function followValue(followButtonId, dropDownMenuId, unfollowButtonSelector) {
    await simpleClick(followButtonId); // Clicks on "Follow"
    await simpleClick(dropDownMenuId); // Clicks on dropdown menu 
	unfollowButton = await $(unfollowButtonSelector);
    await unfollowButton.click(); // Clicks on "Unfollow"
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
}

async function followOrganizationOrPublicFigure(elementId) {
	await simpleClick(`positionItemFollowToggleFollow-undefined-${elementId}`); // Clicks on Follow
	await simpleClick(`positionItemFollowToggleDropdown-undefined-${elementId}`); // Clicks on dropdown menu
	await simpleClick(`positionItemFollowToggleUnfollow-undefined-${elementId}`); // Clicks on Unfollow
}

async function ignore(elementId) {
    await simpleClick(`positionItemFollowToggleDropdown-undefined-${elementId}`); // Clicks on dropdown menu
    await simpleClick(`positionItemFollowToggleIgnore-undefined-${elementId}`); // Clicks on "Ignore"
    await simpleClick(`positionItemFollowToggleDropdown-undefined-${elementId}`); // Clicks on dropdown menu
    await simpleClick(`positionItemFollowToggleStopIgnoring-undefined-${elementId}`); // Clicks on "Stop Ignoring"
}

const ANDROID_CONTEXT = 'WEBVIEW_org.wevote.cordova';
const IOS_CONTEXT = 'WEBVIEW_1';
const PAUSE_DURATION_MICROSECONDS = 5000; 

describe('Basic cross-platform We Vote test',  () => {
  it('should load the app so we can run various tests', async () => {
    const { twitterUserName, twitterPassword } = driver.config;
    const { device, isAndroid, isCordovaFromAppStore, isMobileScreenSize, isIOS } = driver.config.capabilities;
    const isDesktopScreenSize = !isMobileScreenSize;
    const platformPrefixID = (isDesktopScreenSize) ? 'desktop' : 'mobile';
    const isOnePlus = device.includes('OnePlus');
    const isSamsung = device.includes('Samsung');
	const rollingStoneId = 'wv02org57143';
	const elonMuskId = 'wv02org62651';
	const johnLegendId = 'wv02org53184';
	const sqlInjectionTest = '\' or 1=1 -- -';
	const unfollowButtonSelector = 'li.MuiButtonBase-root.MuiListItem-root.MuiMenuItem-root.MuiMenuItem-gutters.MuiListItem-gutters';

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
      await browser.url('https://quality.wevote.us/values');
    }

    await browser.pause(PAUSE_DURATION_MICROSECONDS * 3);

    // //////////////////////
    // Test "Values to Follow" section 
	await followValue('issueFollowButton', 'toggle-button', unfollowButtonSelector); // Follows and unfollows value
    await simpleClick('valuesToFollowPreviewShowMoreId'); // Clicks on "Explore all values"
	await followValue('issueFollowButton', 'toggle-button', unfollowButtonSelector); // Follows and unfollows value
	var searchButton = await $('i.fas.fa-search');
    var clearSearchIcon = await $('img[src="/img/glyphicons-halflings-88-remove-circle.svg"]');
	await search(clearSearchIcon, searchButton, 'search_input', `${sqlInjectionTest}`); // tests search functionality
    await simpleClick('backToLinkTabHeader'); // Clicks on "Back"
	var valueLink = await $('a.u-no-underline');
	await valueLink.click(); // Click link to value
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
	await followValue('issueFollowButton', 'toggle-button', unfollowButtonSelector); // Follows and unfollows value

    await simpleClick('backToLinkTabHeader'); // Clicks on "Back"
    await simpleClick('backToLinkTabHeader'); // Clicks on "Back"

    // //////////////////////
    // Test "Public Figures to Follow" section 
	await scrollIntoViewSimple('valuesToFollowPreviewShowMoreId'); // Scrolls to organization
	await followOrganizationOrPublicFigure(elonMuskId); // Follows and unfollows Elon Musk
	await ignore(elonMuskId); // Ignore and unignore Elon Musk
	var publicFigureLink = await $('a[href="/elonmusk"]');
	await publicFigureLink.click();
	await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick('backToLinkTabHeader'); // Clicks on "Back"
	var more = await $('a[href="#"]');
	await more.click();
	await browser.pause(PAUSE_DURATION_MICROSECONDS);
	var showLess = await $('a[href="#"]');
	await moreLink.click();
	await browser.pause(PAUSE_DURATION_MICROSECONDS);

    // //////////////////////
    // Tests endorsements and twitter sign in 
	if (isDesktopScreenSize) { 								// Only for desktop
		await simpleClick('twitterSignIn-splitIconButton'); // Clicks on "Find Public Opinions"
		await simpleClick('undefined-splitIconButton'); // Clicks on "Add Endorsements"
	}

    // //////////////////////
    // Tests organizations to follow
	await scrollIntoViewSimple(`positionItemFollowToggleFollow-undefined-${rollingStoneId}`); // Scrolls to organization
	await followOrganizationOrPublicFigure(`${rollingStoneId}`); // Follows and unfollows Elon Musk
	await ignore(rollingStoneId); // Ignore and unignore Rolling Stone
    await simpleClick('organizationsToFollowPreviewShowMoreId'); // Clicks on "Explore more organizations"
    await simpleClick('backToLinkTabHeader'); // Clicks on "Back"

    assert(true);
  });
});

