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

async function readMore() {
	await selectClick('=More');
	await selectClick('=Show Less');
}

async function selectClick(selector) {
	var selected = await $(selector);
	await selected.click();
	await browser.pause(PAUSE_DURATION_MICROSECONDS);
}

const ANDROID_CONTEXT = 'WEBVIEW_org.wevote.cordova';
const IOS_CONTEXT = 'WEBVIEW_1';
const PAUSE_DURATION_MICROSECONDS = 3000; 
describe('Basic cross-platform We Vote test',  () => { it('should load the app so we can run various tests', async () => {
    const { twitterUserName, twitterPassword } = driver.config;
    const { device, isAndroid, isCordovaFromAppStore, isMobileScreenSize, isIOS } = driver.config.capabilities;
    const isDesktopScreenSize = !isMobileScreenSize;
    const platformPrefixID = (isDesktopScreenSize) ? 'desktop' : 'mobile';
    const isOnePlus = device.includes('OnePlus');
    const isSamsung = device.includes('Samsung');

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

    await browser.pause(PAUSE_DURATION_MICROSECONDS);

	const dropDown = 'button.issues-follow-btn__dropdown.issues-follow-btn--white:first-of-type';
	const follow = 'button.issues-follow-btn__main.issues-follow-btn--blue:first-of-type'; 
	const unfollow = 'button.dropdown-item.issues-follow-btn.issues-follow-btn__menu-item:first-of-type';
	const ignore = 'button.dropdown-item.issues-follow-btn.issues-follow-btn__menu-item:nth-child(2)';

    // //////////////////////
    // Test "Values to Follow" section 
	const unfollowButtonSelector = 'li.MuiButtonBase-root.MuiListItem-root.MuiMenuItem-root.MuiMenuItem-gutters';
	await followValue('issueFollowButton', 'toggle-button', unfollowButtonSelector); // Follows and unfollows value
    await simpleClick('valuesToFollowPreviewShowMoreId'); // Clicks on "Explore all values"
	await followValue('issueFollowButton', 'toggle-button', unfollowButtonSelector); // Follows and unfollows value
    const clearSearchIconSelector = 'img[src="/img/glyphicons-halflings-88-remove-circle.svg"]';
	const sqlInjectionTest = '\' or 1=1 -- -';
	await search(clearSearchIconSelector, 'i.fas.fa-search', 'search_input', sqlInjectionTest); // tests search functionality
    await simpleClick('backToLinkTabHeader'); // Clicks on "Back"
	await selectClick('a.u-no-underline'); // Clicks on value
	await followValue('issueFollowButton', 'toggle-button', unfollowButtonSelector); // Follows and unfollows value
	const noEndorsementsCheck = await $('p*=no endorsements');
	if(noEndorsementsCheck.getText()) { // Check for Endorsements
			const valueSelector = await $('div.ValuesList__Column-sc-6mkcdy-1:first-child button');
			await valueSelector.click(); // Follows first value
			await browser.pause(PAUSE_DURATION_MICROSECONDS);
			const valueLink = await $('div.ValuesList__Column-sc-6mkcdy-1:first-child a');
			await valueLink.click(); // Clicks on first value
			await browser.pause(PAUSE_DURATION_MICROSECONDS);
			await simpleClick('backToLinkTabHeader'); // Clicks on "Back"
			await simpleClick('backToLinkTabHeader'); // Clicks on "Back"
	} else {
			const firstEndorsementFollowButton = await $(follow);
			await firstEndorsementFollowButton.click(); // Follows first endorsement
			const firstEndorsementDropDownButton = await $(dropDown);
			await firstEndorsementDropDownButton.click(); // Clicks drop down button 
			const firstEndorsementUnfollowButton = await $(unfollow);
			await firstEndorsementUnfollowButton.click(); // Unfollows first endorsement
			await firstEndorsementDropDownButton.click(); // Clicks drop down button 
			const firstEndorsementIgnoreButton = await $(ignore);
			await firstEndorsementIgnoreButton.click(); // Ignores first endorsement
			await firstEndorsementDropDownButton.click(); // Clicks drop down button 
			await firstEndorsementIgnoreButton.click(); // Unignores first endorsement
			const valueSelector = await $('.ValuesList__Row-sc-6mkcdy-0 .ValuesList__Column-sc-6mkcdy-1:first-child').$('button');
			await valueSelector.click(); // Follows first value
			const valueLink = await $('.ValuesList__Row-sc-6mkcdy-0 .ValuesList__Column-sc-6mkcdy-1:first-child').$('<a>');
			await valueLink.click(); // Clicks on first value
			await simpleClick('backToLinkTabHeader'); // Clicks on "Back"
			await simpleClick('backToLinkTabHeader'); // Clicks on "Back"
			await simpleClick('toggle-button'); // Clicks on dropdown menu 
			unfollowButton = await $(unfollowButtonSelector);
			await unfollowButton.click(); // Clicks on "Unfollow"
			await browser.pause(PAUSE_DURATION_MICROSECONDS);
	}

    // //////////////////////
    // Test "Public Figures to Follow" section 
	const publicFigureHeader = await $('h2=Public Figures to Follow');
	publicFigureHeader.scrollIntoView(); // Scrolls to "Public Figures to Follow"
	await browser.pause(PAUSE_DURATION_MICROSECONDS);
	if (browser.findElements('css selector', follow)) { // Check for recommendations 
			await browser.pause(PAUSE_DURATION_MICROSECONDS);
			const publicFigureFollowButton = await $(follow);
			await publicFigureFollowButton.click(); // Follow first public figure
			const publicFigureDropDownButton = await $(dropDown);
			await publicFigureDropDownButton.click(); // Click dropdown button
			const publicFigureUnfollowButton = await $(unfollow);
			await publicFigureUnfollowButton.click(); // Unfollows first public figure 
			await publicFigureDropDownButton.click(); // Click dropdown button
			const publicFigureIgnoreButton = await $(ignore);
			await publicFigureIgnoreButton.click(); // Ignores first public figure
			await publicFigureDropDownButton.click(); // Click dropdown button
			await publicFigureIgnoreButton.click(); // Unignores first public figure
			await readMore(); // Clicks more and show less
	}
	await simpleClick('publicFiguresToFollowPreviewShowMoreId'); // Click "Explore more public figures"
	await simpleClick('backToLinkTabHeader'); // Clicks on "Back"
	await scrollIntoViewSimple('valuesToFollowPreviewShowMoreId'); // Scrolls to organization
	const firstPublicFigureLink = await $('h2.PublicFiguresToFollowPreview__SectionTitle-sc-1ked900-0 a:first-of-type');
	await firstPublicFigureLink.click(); // Click first public profile link
	await simpleClick('valuesTabFooterBar'); // Return to values tab


    // //////////////////////
    // Tests endorsements and twitter sign in 
	if (isDesktopScreenSize) { 								// Only for desktop
		await simpleClick('twitterSignIn-splitIconButton'); // Clicks on "Find Public Opinions"
		await simpleClick('valuesTabFooterBar'); // Return to values tab
		await simpleClick('undefined-splitIconButton'); // Clicks on "Add Endorsements"
		await simpleClick('valuesTabFooterBar'); // Return to values tab
	}

    // //////////////////////
    // Tests organizations to follow
	const organizationsHeader = await $('h2=Organizations to Follow');
	organizationsHeader.scrollIntoView(); // Scrolls to "Organizations to Follow"
	await browser.pause(PAUSE_DURATION_MICROSECONDS);
	if (browser.findElements('css selector', follow)) { // Checks if there are recommendations
			const firstOrganizationFollowButton = await $('button.MuiButton-root.MuiButton-text:first-of-type');
			await firstOrganizationFollowButton.click(); // Follow first organization 
			const firstOrganizationDropDownButton = await $('button.MuiButton-root.MuiButton-text.dropdown-toggle:first-of-type');
			await firstOrganizationDropDownButton.click(); // Click dropdown button
			const firstOrganizationUnfollowButton = await $('button.MuiButton-root.MuiButton-text.dropdown-item:first-of-type'); 
			await firstOrganizationUnfollowButton.click(); // Unfollows first organization 
			await firstOrganizationDropDownButton.click(); // Click dropdown button
			const firstOrganizationIgnoreButton = await $('button.MuiButton-root.MuiButton-text.dropdown-toggle:nth-child(2)');
			await firstOrganizationIgnoreButton.click(); // Clicks ignore button
			await firstOrganizationDropDownButton.click(); // Click dropdown button
			await firstOrganizationIgnoreButton.click(); // Clicks "Stop Ignoring"
	}
    await simpleClick('organizationsToFollowPreviewShowMoreId'); // Clicks on "Explore more organizations"
    await simpleClick('backToLinkTabHeader'); // Clicks on "Back"
	await readMore(); // Clicks more and show less
	const firstOrganizationLink = await $('h2.OrganizationsToFollowPreview__SectionTitle-lnpgt8-0.eWxngq a:first-of-type');
	await firstOrganizationLink.click(); // Click first organization's link
    await simpleClick('backToLinkTabHeader'); // Clicks on "Back"

    assert(true);
  });
});

