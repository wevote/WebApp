const assert = require('assert');
const { clearTextInputValue, clickTopLeftCornerOfElement, scrollIntoViewSimple, scrollThroughPage, setNewAddress, setNewAddressAndroid, setNewAddressIOS, simpleClick, simpleCloseBootstrapModal, simpleTextInput, stopScript } = require('../utils');

async function search(clearSearchIconSelector, searchButtonSelector, searchBarId, searchValue) {
    await simpleTextInput(searchBarId, searchValue); // Input text into search bar
	await selectClick(clearSearchIconSelector); // Clear search bar
    await simpleTextInput(searchBarId, searchValue); // Input text into search bar
	await selectClick(searchButtonSelector); // Clicks search
}

async function followValue(followButtonId, dropDownMenuId, unfollowButtonSelector) {
    await simpleClick(followButtonId); // Clicks on "Follow"
    await simpleClick(dropDownMenuId); // Clicks on dropdown menu 
	var unfollowButton = await $(unfollowButtonSelector);
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

async function readMore() {
	await selectClick('a[href="#"]');
	await selectClick('a[href="#"]');
}

async function selectClick(selector) {
	var selected = await $(selector);
	await selected.click();
	await browser.pause(PAUSE_DURATION_MICROSECONDS);
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
	const repFredericaWilsonId = 'wv02org54001';
	const sqlInjectionTest = '\' or 1=1 -- -';
	const unfollowButtonSelector = 'li.MuiButtonBase-root.MuiListItem-root.MuiMenuItem-root.MuiMenuItem-gutters';
    const clearSearchIconSelector = 'img[src="/img/glyphicons-halflings-88-remove-circle.svg"]';

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

    await browser.pause(PAUSE_DURATION_MICROSECONDS * 4);

    // //////////////////////
    // Test "Values to Follow" section 
	await followValue('issueFollowButton', 'toggle-button', unfollowButtonSelector); // Follows and unfollows value
    await simpleClick('valuesToFollowPreviewShowMoreId'); // Clicks on "Explore all values"
	await followValue('issueFollowButton', 'toggle-button', unfollowButtonSelector); // Follows and unfollows value
	await search(clearSearchIconSelector, 'i.fas.fa-search', 'search_input', sqlInjectionTest); // tests search functionality
    await simpleClick('backToLinkTabHeader'); // Clicks on "Back"
	await selectClick('a.u-no-underline'); // Clicks on value
	await followValue('issueFollowButton', 'toggle-button', unfollowButtonSelector); // Follows and unfollows value
//	await selectClick('a[href="repwilson"]'); // Clicks on Rep. Frederica Wilson
//  await simpleClick('backToLinkTabHeader'); // Clicks on "Back"
//	await followOrganizationOrPublicFigure(repFredericaWilsonId); // Follows and unfollows Rep. Frederica Wilson
//	await ignore(repfredericawilsonid); // ignore and unignore rep. frederica wilson 
//	await scrollIntoViewSimple(`positionItemFollowToggleFollow-undefined-${repFredericaWilsonId}`); // Scrolls to organization
//  await selectClick('div.ValuesList__Column-sc-6mkcdy-1.hvFIIz.col.col-12.col-md-6.u-stack--lg'); // Follows value
//	await selectClick('a.u-no-underline'); // Clicks on value
    await simpleClick('backToLinkTabHeader'); // Clicks on "Back"
    await simpleClick('backToLinkTabHeader'); // Clicks on "Back"

    // //////////////////////
    // Test "Public Figures to Follow" section 
	await scrollIntoViewSimple('valuesToFollowPreviewShowMoreId'); // Scrolls to organization
	await followOrganizationOrPublicFigure(elonMuskId); // Follows and unfollows Elon Musk
	await ignore(elonMuskId); // Ignore and unignore Elon Musk
	await readMore(); // Clicks more and show less
	await simpleClick('publicFiguresToFollowPreviewShowMoreId'); // Click "Explore more public figures"
    await simpleClick('backToLinkTabHeader'); // Clicks on "Back"
	await scrollIntoViewSimple('valuesToFollowPreviewShowMoreId'); // Scrolls to organization
	await selectClick('a[href="/johnlegend"]'); // Click John Legend 
    await browser.url('https://quality.wevote.us/values'); // Return to values page

    // //////////////////////
    // Tests endorsements and twitter sign in 
	if (isDesktopScreenSize) { 								// Only for desktop
		await simpleClick('twitterSignIn-splitIconButton'); // Clicks on "Find Public Opinions"
        await browser.url('https://quality.wevote.us/values'); // Return to values page
		await simpleClick('undefined-splitIconButton'); // Clicks on "Add Endorsements"
        await browser.url('https://quality.wevote.us/values'); // Return to values page
	}

    // //////////////////////
    // Tests organizations to follow
	await scrollIntoViewSimple(`positionItemFollowToggleFollow-undefined-${rollingStoneId}`); // Scrolls to organization
	await followOrganizationOrPublicFigure(`${rollingStoneId}`); // Follows and unfollows Elon Musk
	await ignore(rollingStoneId); // Ignore and unignore Rolling Stone
    await simpleClick('organizationsToFollowPreviewShowMoreId'); // Clicks on "Explore more organizations"
    await simpleClick('backToLinkTabHeader'); // Clicks on "Back"
	await readMore(); // Clicks more and show less
	await selectClick('a[href="/rollingstone"]'); // Click on Rolling Stone
    await simpleClick('backToLinkTabHeader'); // Clicks on "Back"

    assert(true);
  });
});

