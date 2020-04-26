const assert = require('assert');
const { simpleClick, simpleTextInput } = require('../utils');

const ANDROID_CONTEXT = 'WEBVIEW_org.wevote.cordova';
const IOS_CONTEXT = 'WEBVIEW_1';
const PAUSE_DURATION_MICROSECONDS = 1250;

async function selectClick (selector) {
  const element = await $(selector);
  if (await element.isClickable()) {
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await element.click();
  }
  await browser.pause(PAUSE_DURATION_MICROSECONDS);
}

async function search (clearSearchIconSelector, searchButtonSelector, searchBarId, searchValue) {
  await simpleTextInput(searchBarId, searchValue); // Input text into search bar
  await selectClick(clearSearchIconSelector); // Clear search bar
  await simpleTextInput(searchBarId, searchValue); // Input text into search bar
  await selectClick(searchButtonSelector); // Clicks search
}

async function readMore (selector) {
  const selected = await $(selector);
  const more = await selected.$('=More');
  if (await more.isClickable()) {
    await more.click();
  }
  await browser.pause(PAUSE_DURATION_MICROSECONDS);
  const showLess = await selected.$('=Show Less');
  if (await showLess.isClickable()) {
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await showLess.click();
  }
  await browser.pause(PAUSE_DURATION_MICROSECONDS);
}

describe('Basic cross-platform We Vote test',  () => {
  it('should load the app so we can run letious tests', async () => {
    const { isCordovaFromAppStore, isMobileScreenSize } = driver.config.capabilities;
    const isDesktopScreenSize = !isMobileScreenSize;

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

    const dropDownButton = 'button.dropdown-toggle.issues-follow-btn__dropdown';
    const followButton = 'button.issues-follow-btn__main.issues-follow-btn--blue';
    const unfollow = 'button.dropdown-item.issues-follow-btn__menu-item:first-child';
    const ignore = 'button.dropdown-item.issues-follow-btn__menu-item:nth-of-type(2)';
    const unignore = 'span.d-print-none button';
    const link = 'a.u-no-underline';
    const mainContentColumn = 'div.col-sm-12.col-md-8';
    const mainContainer = 'div.opinions-followed__container';
    const childCard = 'div.card-child.card-child--not-followed';
    const clearSearchIconSelector = 'img[src="/img/glyphicons-halflings-88-remove-circle.svg"]';
    const sqlInjectionTest = '\' or 1=1 -- -';

    const section = `${mainContentColumn} ${mainContainer}`;
    const publicFigureSection = `${section}:nth-last-child(2) `;
    const organizationSection = `${section}:last-child `;
    const publicFigureCards = publicFigureSection + childCard;
    const organizationCards = organizationSection + childCard;
    const publicFigureFollowButton = publicFigureSection + followButton;
    const organizationFollowButton = organizationSection + followButton;
    const publicFigureDropDownButton = publicFigureSection + dropDownButton;
    const organizationDropDownButton = organizationSection + dropDownButton;
    const publicFigureUnfollow = publicFigureSection + unfollow;
    const organizationUnfollow = organizationSection + unfollow;
    const publicFigureIgnore = publicFigureSection + ignore;
    const organizationIgnore = organizationSection + ignore;
    const publicFigureUnignore = publicFigureSection + unignore;
    const organizationUnignore = organizationSection + unignore;
    const publicFigureLink = publicFigureSection + link;
    const organizationLink = organizationSection + link;

    // //////////////////////
    // Test "Values to Follow" section
    await simpleClick('issueFollowButton'); // Follow value
    await simpleClick('toggle-button');
    await selectClick('li=Unfollow'); // Unfollow value
    await selectClick('a.u-no-underline'); // Clicks on value
    await simpleClick('issueFollowButton'); // Follow value
    await simpleClick('toggle-button');
    await selectClick('li=Unfollow'); // Unfollow value
    const noEndorsementsCheck = await $('p*=no endorsements');
    if (await noEndorsementsCheck.getText()) { // Check for Endorsements
      const valueSelector = await $('div.ValuesList__Column-sc-6mkcdy-1:first-child button');
      await valueSelector.click(); // Follows first value
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      const valueLink = await $('div.ValuesList__Column-sc-6mkcdy-1:first-child a');
      await valueLink.click(); // Clicks on first value
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
    } else {
      const firstEndorsementFollowButton = await $(followButton);
      await firstEndorsementFollowButton.click(); // Follows first endorsement
      const firstEndorsementDropDownButton = await $(dropDownButton);
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
    }
    await simpleClick('backToLinkTabHeader'); // Clicks on "Back"
    await simpleClick('backToLinkTabHeader'); // Clicks on "Back"
    await simpleClick('valuesFollowedPreviewShowMoreId'); // Clicks on "Explore all values"
    await simpleClick('issueFollowButton'); // Follow value
    await simpleClick('toggle-button');
    await selectClick('li=Unfollow'); // Unfollow value
    await search(clearSearchIconSelector, 'i.fas.fa-search', 'search_input', sqlInjectionTest); // tests search functionality
    await simpleClick('backToLinkTabHeader'); // Clicks on "Back"

    // //////////////////////
    // Test "Public Figures to Follow" section
    let publicFigureHeader = await $('h2=Public Figures to Follow');
    await publicFigureHeader.scrollIntoView(); // Scrolls to "Public Figures to Follow"
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    await simpleClick('publicFiguresToFollowPreviewShowMoreId'); // Click "Explore more public figures"
    await simpleClick('backToLinkTabHeader'); // Clicks on "Back"
    publicFigureHeader = await $('h2=Public Figures to Follow');
    await publicFigureHeader.scrollIntoView(); // Scrolls to "Public Figures to Follow"
    const publicFigureRecommendations = await $(publicFigureCards);
    if (await publicFigureRecommendations.waitForExist({ timeout: 5000 })) { // Check for recommendations
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      await selectClick(publicFigureFollowButton); // Follow first public figure
      await selectClick(publicFigureDropDownButton);
      await selectClick(publicFigureUnfollow); // Unfollow first public figure
      await selectClick(publicFigureDropDownButton);
      await selectClick(publicFigureIgnore); // Ignore first public figure
      await selectClick(publicFigureDropDownButton);
      await selectClick(publicFigureUnignore); // Unignore first public figure
      await readMore(publicFigureSection); // Clicks more and show less
      await selectClick(publicFigureLink); // Clicks first public figure's link
      await browser.url('https://quality.wevote.us/values');
    }

    // //////////////////////
    // Tests endorsements and twitter sign in
    if (isDesktopScreenSize) {                 // Only for desktop
      await simpleClick('twitterSignIn-splitIconButton'); // Clicks on "Find Public Opinions"
      await browser.url('https://quality.wevote.us/values');
      await simpleClick('undefined-splitIconButton'); // Clicks on "Add Endorsements"
      await browser.url('https://quality.wevote.us/values');
    }

    // //////////////////////
    // Tests organizations to follow
    await simpleClick('organizationsToFollowPreviewShowMoreId'); // Clicks on "Explore more organizations"
    await simpleClick('backToLinkTabHeader'); // Clicks on "Back"
    publicFigureHeader = await $('h2=Public Figures to Follow');
    await publicFigureHeader.scrollIntoView(); // Scrolls to "Public Figures to Follow"
    let organizationsHeader = await $('h2=Organizations to Follow');
    await organizationsHeader.scrollIntoView(); // Scrolls to "Organizations to Follow"
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    const organizationRecommendations = await $(organizationCards);
    await browser.pause(PAUSE_DURATION_MICROSECONDS);
    if (await organizationRecommendations.isExisting()) { // Check for recommendations
      await browser.pause(PAUSE_DURATION_MICROSECONDS);
      await readMore(organizationSection); // Clicks more and show less
      await selectClick(organizationFollowButton); // Follow first organization
      if (await organizationRecommendations.isExisting()) { // Check for recommendations
        await selectClick(organizationDropDownButton);
        await selectClick(organizationUnfollow); // Unfollow first organization
        await selectClick(organizationDropDownButton);
        await selectClick(organizationIgnore); // Ignore first organization
        await selectClick(organizationDropDownButton);
        await selectClick(organizationUnignore); // Unignore first organization
        await selectClick(organizationLink); // Clicks first organization's link
        await browser.url('https://quality.wevote.us/values');
        publicFigureHeader = await $('h2=Public Figures to Follow');
        await publicFigureHeader.scrollIntoView(); // Scrolls to "Public Figures to Follow"
        organizationsHeader = await $('h2=Organizations to Follow');
        await organizationsHeader.scrollIntoView(); // Scrolls to "Organizations to Follow"
      }
    }

    assert(true);
  });
});

