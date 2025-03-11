import { driver, expect } from '@wdio/globals';
import ReadyPage from '../page_objects/ready.page';
import TopicsPage from '../page_objects/topics.page';
import ProfilePage from '../page_objects/profile.page';

const waitTime = 5000;

/* eslint-disable no-undef */
// This eslint-disable turns off warnings for describe() and it()
// We don't need those warnings, because describe() and it() are available at runtime
// https://webdriver.io/docs/pageobjects

describe('TopicsPage', () => {
  // Ready_001

  it('verifyProChoiceTopicsPageLoads', async () => {

    await ReadyPage.login();
    await ReadyPage.load();
    await driver.pause(waitTime);
    await driver.waitUntil(async () => (ReadyPage.getProChoiceLinkElement.isClickable()));
    await ReadyPage.getProChoiceLinkElement.click();
    await driver.waitUntil(async () => {
      // Add condition to check for the expected URL
      const currentUrl = await driver.getUrl();
      console.log(currentUrl);
      return currentUrl.includes('pro-choice');
    }, {
      timeout: 10000,
      timeoutMsg: 'Expected URL to contain "pro-choice" not found, timeout after 10000ms',
    });
    await driver.switchWindow('Pro-choice - WeVote');
    await driver.pause(waitTime);
    await expect(driver).toHaveTitle(expect.stringContaining('Pro-choice - WeVote'));
    // Checking Follow and Unfollow buttons

    const circleIcon = await (TopicsPage.getProChoiceCircleIconElement).isExisting();
    if (!circleIcon) {
      await driver.waitUntil(async () => (TopicsPage.getProChoiceFollowElement.isClickable()));
      await TopicsPage.getProChoiceFollowElement.click();
    }
    await driver.waitUntil(async () => (TopicsPage.getProChoiceDropdownButtonElement.isClickable()));
    await TopicsPage.getProChoiceDropdownButtonElement.click();
    await driver.waitUntil(async () => (TopicsPage.getProChoiceUnfollowElement.isClickable()));
    await TopicsPage.getProChoiceUnfollowElement.click();
    // verify follow button appears
    await expect(TopicsPage.getProChoiceFollowElement).toBeDisplayed();

    await driver.waitUntil(async () => (TopicsPage.avatar.isClickable()));
    await TopicsPage.avatar.click();

    await driver.waitUntil(async () => (ProfilePage.getSignOutElement.isClickable()));
    await ProfilePage.getSignOutElement.click();

  });

  it('verifyProLifePageLoads', async () => {

    await ReadyPage.login();
    await ReadyPage.load();
    await driver.pause(waitTime);
    await driver.waitUntil(async () => (ReadyPage.getProLifeLinkElement.isClickable()));
    await ReadyPage.getProLifeLinkElement.click();
    await driver.waitUntil(async () => {
      // Add condition to check for the expected URL
      const currentUrl = await driver.getUrl();
      console.log(currentUrl);
      return currentUrl.includes('pro-life');
    }, {
      timeout: 10000,
      timeoutMsg: 'Expected URL to contain "pro-life" not found, timeout after 10000ms',
    });
    await driver.switchWindow('Pro-life - WeVote');
    await driver.pause(waitTime);
    await expect(driver).toHaveTitle(expect.stringContaining('Pro-life - WeVote'));
    // Checking Follow and Unfollow buttons
    const circleIcon = await (TopicsPage.getProLifeCircleIconElement).isExisting();
    if (!circleIcon) {
      await driver.waitUntil(async () => (TopicsPage.getProLifeFollowElement.isClickable()));
      await TopicsPage.getProLifeFollowElement.click();
    }
    await driver.waitUntil(async () => (TopicsPage.getProLifeDropdownButtonElement.isClickable()));
    await TopicsPage.getProLifeDropdownButtonElement.click();
    await driver.waitUntil(async () => (TopicsPage.getProLifeUnfollowElement.isClickable()));
    await TopicsPage.getProLifeUnfollowElement.click();
    // verify follow button appears
    await expect(TopicsPage.getProLifeFollowElement).toBeDisplayed();

    await driver.waitUntil(async () => (TopicsPage.avatar.isClickable()));
    await TopicsPage.avatar.click();

    await driver.waitUntil(async () => (ProfilePage.getSignOutElement.isClickable()));
    await ProfilePage.getSignOutElement.click();

  });

  it('verifyDemocraticClubsTopicsPageLoads', async () => {

    await ReadyPage.login();
    await ReadyPage.load();
    await driver.pause(waitTime);
    await driver.waitUntil(async () => (ReadyPage.getDemocraticClubsLinkElement.isClickable()));
    await ReadyPage.getDemocraticClubsLinkElement.click();
    await driver.waitUntil(async () => {
      // Add condition to check for the expected URL
      const currentUrl = await driver.getUrl();
      console.log(currentUrl);
      return currentUrl.includes('democratic_clubs');
    }, {
      timeout: 10000,
      timeoutMsg: 'Expected URL to contain "democratic_clubs" not found, timeout after 10000ms',
    });
    await driver.switchWindow('Democratic Clubs - WeVote');
    await driver.pause(waitTime);
    await expect(driver).toHaveTitle(expect.stringContaining('Democratic Clubs - WeVote'));
    // Checking Follow and Unfollow buttons
    const circleIcon = await (TopicsPage.getDemocraticClubsCircleIconElement).isExisting();
    if (!circleIcon) {
      await driver.waitUntil(async () => (TopicsPage.getDemocraticClubsFollowElement.isClickable()));
      await TopicsPage.getDemocraticClubsFollowElement.click();
    }
    await driver.waitUntil(async () => (TopicsPage.getDemocraticClubsDropdownButtonElement.isClickable()));
    await TopicsPage.getDemocraticClubsDropdownButtonElement.click();
    await driver.waitUntil(async () => (TopicsPage.getDemocraticClubsUnfollowElement.isClickable()));
    await TopicsPage.getDemocraticClubsUnfollowElement.click();
    // verify follow button appears
    await expect(TopicsPage.getDemocraticClubsFollowElement).toBeDisplayed();

    await driver.waitUntil(async () => (TopicsPage.avatar.isClickable()));
    await TopicsPage.avatar.click();

    await driver.waitUntil(async () => (ProfilePage.getSignOutElement.isClickable()));
    await ProfilePage.getSignOutElement.click();

  });

  it('verifyRepublicanClubsPageLoads', async () => {

    await ReadyPage.login();
    await ReadyPage.load();
    await driver.pause(waitTime);
    await driver.waitUntil(async () => (ReadyPage.getRepublicanClubsLinkElement.isClickable()));
    await ReadyPage.getRepublicanClubsLinkElement.click();
    await driver.waitUntil(async () => {
      // Add condition to check for the expected URL
      const currentUrl = await driver.getUrl();
      console.log(currentUrl);
      return currentUrl.includes('republican_clubs');
    }, {
      timeout: 10000,
      timeoutMsg: 'Expected URL to contain "republican_clubs" not found, timeout after 10000ms',
    });
    await driver.switchWindow('Republican Clubs - WeVote');
    await driver.pause(waitTime);
    await expect(driver).toHaveTitle(expect.stringContaining('Republican Clubs - WeVote'));
    // Checking Follow and Unfollow buttons
    const circleIcon = await (TopicsPage.getRepublicanClubsCircleIconElement).isExisting();
    if (!circleIcon) {
      await driver.waitUntil(async () => (TopicsPage.getRepublicanClubsFollowElement.isClickable()));
      await TopicsPage.getRepublicanClubsFollowElement.click();
    }
    await driver.waitUntil(async () => (TopicsPage.getRepublicanClubsDropdownButtonElement.isClickable()));
    await TopicsPage.getRepublicanClubsDropdownButtonElement.click();
    await driver.waitUntil(async () => (TopicsPage.getRepublicanClubsUnfollowElement.isClickable()));
    await TopicsPage.getRepublicanClubsUnfollowElement.click();
    // verify follow button appears
    await expect(TopicsPage.getRepublicanClubsFollowElement).toBeDisplayed();

    await driver.waitUntil(async () => (TopicsPage.avatar.isClickable()));
    await TopicsPage.avatar.click();

    await driver.waitUntil(async () => (ProfilePage.getSignOutElement.isClickable()));
    await ProfilePage.getSignOutElement.click();

  });

  it('verifyClimateChangePageLoads', async () => {

    await ReadyPage.login();
    await ReadyPage.load();
    await driver.pause(waitTime);
    await driver.waitUntil(async () => (ReadyPage.getClimateChangeLinkElement.isClickable()));
    await ReadyPage.getClimateChangeLinkElement.click();
    await driver.waitUntil(async () => {
      // Add condition to check for the expected URL
      const currentUrl = await driver.getUrl();
      console.log(currentUrl);
      return currentUrl.includes('climate_change');
    }, {
      timeout: 10000,
      timeoutMsg: 'Expected URL to contain "climate_change" not found, timeout after 10000ms',
    });
    await driver.switchWindow('Climate Change - WeVote');
    await driver.pause(waitTime);
    await expect(driver).toHaveTitle(expect.stringContaining('Climate Change - WeVote'));
    // Checking Follow and Unfollow buttons
    const circleIcon = await (TopicsPage.getClimateChangeCircleIconElement).isExisting();
    if (!circleIcon) {
      await driver.waitUntil(async () => (TopicsPage.getClimateChangeFollowElement.isClickable()));
      await TopicsPage.getClimateChangeFollowElement.click();
    }
    await driver.waitUntil(async () => (TopicsPage.getClimateChangeDropdownButtonElement.isClickable()));
    await TopicsPage.getClimateChangeDropdownButtonElement.click();
    await driver.waitUntil(async () => (TopicsPage.getClimateChangeUnfollowElement.isClickable()));
    await TopicsPage.getClimateChangeUnfollowElement.click();
    // verify follow button appears
    await expect(TopicsPage.getClimateChangeFollowElement).toBeDisplayed();

    await driver.waitUntil(async () => (TopicsPage.avatar.isClickable()));
    await TopicsPage.avatar.click();

    await driver.waitUntil(async () => (ProfilePage.getSignOutElement.isClickable()));
    await ProfilePage.getSignOutElement.click();

  });

  it('verifyLGBTQPageLoads', async () => {

    await ReadyPage.login();
    await ReadyPage.load();
    await driver.pause(waitTime);
    await driver.waitUntil(async () => (ReadyPage.getLGBTQLinkElement.isClickable()));
    await ReadyPage.getLGBTQLinkElement.click();
    await driver.waitUntil(async () => {
      // Add condition to check for the expected URL
      const currentUrl = await driver.getUrl();
      console.log(currentUrl);
      return currentUrl.includes('lgbtq');
    }, {
      timeout: 10000,
      timeoutMsg: 'Expected URL to contain "lgbtq" not found, timeout after 10000ms',
    });
    await driver.switchWindow('LGBTQ - WeVote');
    await driver.pause(waitTime);
    await expect(driver).toHaveTitle(expect.stringContaining('LGBTQ - WeVote'));
    // Checking Follow and Unfollow buttons
    const circleIcon = await (TopicsPage.getLGBTQCircleIconElement).isExisting();
    if (!circleIcon) {
      await driver.waitUntil(async () => (TopicsPage.getLGBTQFollowElement.isClickable()));
      await TopicsPage.getLGBTQFollowElement.click();
    }
    await driver.waitUntil(async () => (TopicsPage.getLGBTQDropdownButtonElement.isClickable()));
    await TopicsPage.getLGBTQDropdownButtonElement.click();
    await driver.waitUntil(async () => (TopicsPage.getLGBTQUnfollowElement.isClickable()));
    await TopicsPage.getLGBTQUnfollowElement.click();
    // verify follow button appears
    await expect(TopicsPage.getLGBTQFollowElement).toBeDisplayed();

    await driver.waitUntil(async () => (TopicsPage.avatar.isClickable()));
    await TopicsPage.avatar.click();

    await driver.waitUntil(async () => (ProfilePage.getSignOutElement.isClickable()));
    await ProfilePage.getSignOutElement.click();

  });

  /*
  it('verifyDemocraticPartyPoliticiansPageLoads', async () => {

    await ReadyPage.login();
    await ReadyPage.load();
    await driver.pause(waitTime);
    await driver.waitUntil(async () => (ReadyPage.getShowMoreLinkElement.isClickable()));
    await ReadyPage.getShowMoreLinkElement.click();
    await driver.waitUntil(async () => (ReadyPage.getDemocraticPartyPoliticiansLinkElement.isClickable()));
    await ReadyPage.getDemocraticPartyPoliticiansLinkElement.click();
    await driver.waitUntil(async () => {
      // Add condition to check for the expected URL
      const currentUrl = await driver.getUrl();
      console.log(currentUrl);
      return currentUrl.includes('democratic_party_politicians');
    }, {
      timeout: 10000,
      timeoutMsg: 'Expected URL to contain "democratic_party_politicians" not found, timeout after 10000ms',
    });
    await driver.switchWindow('Democratic Party Politicians - WeVote');
    await driver.pause(waitTime);
    await expect(driver).toHaveTitle(expect.stringContaining('Democratic Party Politicians - WeVote'));
    // Checking Follow and Unfollow buttons
    const circleIcon = await (TopicsPage.getDemocraticPartyPoliticiansCircleIconElement).isExisting();
    if (!circleIcon) {
      await driver.waitUntil(async () => (TopicsPage.getDemocraticPartyPoliticiansFollowElement.isClickable()));
      await TopicsPage.getDemocraticPartyPoliticiansFollowElement.click();
    }
    await driver.waitUntil(async () => (TopicsPage.getDemocraticPartyPoliticiansDropdownButtonElement.isClickable()));
    await TopicsPage.getDemocraticPartyPoliticiansDropdownButtonElement.click();
    await driver.waitUntil(async () => (TopicsPage.getDemocraticPartyPoliticiansUnfollowElement.isClickable()));
    await TopicsPage.getDemocraticPartyPoliticiansUnfollowElement.click();
    // verify follow button appears
    await expect(TopicsPage.getDemocraticPartyPoliticiansFollowElement).toBeDisplayed();

    await driver.waitUntil(async () => (TopicsPage.avatar.isClickable()));
    await TopicsPage.avatar.click();

    await driver.waitUntil(async () => (ProfilePage.getSignOutElement.isClickable()));
    await ProfilePage.getSignOutElement.click();

  });

  it('verifyRepublicanPartyPoliticiansPageLoads', async () => {

    await ReadyPage.login();
    await ReadyPage.load();
    await driver.pause(waitTime);
    await driver.waitUntil(async () => (ReadyPage.getShowMoreLinkElement.isClickable()));
    await ReadyPage.getShowMoreLinkElement.click();
    await driver.waitUntil(async () => (ReadyPage.getRepublicanPartyPoliticiansLinkElement.isClickable()));
    await ReadyPage.getRepublicanPartyPoliticiansLinkElement.click();
    await driver.waitUntil(async () => {
      // Add condition to check for the expected URL
      const currentUrl = await driver.getUrl();
      console.log(currentUrl);
      return currentUrl.includes('republican_party_politicians');
    }, {
      timeout: 10000,
      timeoutMsg: 'Expected URL to contain "republican_party_politicians" not found, timeout after 10000ms',
    });
    await driver.switchWindow('Republican Party Politicians - WeVote');
    await driver.pause(waitTime);
    await expect(driver).toHaveTitle(expect.stringContaining('Republican Party Politicians - WeVote'));
    // Checking Follow and Unfollow buttons
    const circleIcon = await (TopicsPage.getRepublicanPartyPoliticiansCircleIconElement).isExisting();
    if (!circleIcon) {
      await driver.waitUntil(async () => (TopicsPage.getRepublicanPartyPoliticiansFollowElement.isClickable()));
      await TopicsPage.getRepublicanPartyPoliticiansFollowElement.click();
    }
    await driver.waitUntil(async () => (TopicsPage.getRepublicanPartyPoliticiansDropdownButtonElement.isClickable()));
    await TopicsPage.getRepublicanPartyPoliticiansDropdownButtonElement.click();
    await driver.waitUntil(async () => (TopicsPage.getRepublicanPartyPoliticiansUnfollowElement.isClickable()));
    await TopicsPage.getRepublicanPartyPoliticiansUnfollowElement.click();
    // verify follow button appears
    await expect(TopicsPage.getRepublicanPartyPoliticiansFollowElement).toBeDisplayed();

    await driver.waitUntil(async () => (TopicsPage.avatar.isClickable()));
    await TopicsPage.avatar.click();

    await driver.waitUntil(async () => (ProfilePage.getSignOutElement.isClickable()));
    await ProfilePage.getSignOutElement.click();

  });
*/

  it('verifyProgressiveValuesPageLoads', async () => {

    await ReadyPage.login();
    await ReadyPage.load();
    await driver.pause(waitTime);
    await driver.waitUntil(async () => (ReadyPage.getShowMoreLinkElement.isClickable()));
    await ReadyPage.getShowMoreLinkElement.click();
    await driver.waitUntil(async () => (ReadyPage.getProgressiveValuesLinkElement.isClickable()));
    await ReadyPage.getProgressiveValuesLinkElement.click();
    await driver.waitUntil(async () => {
      // Add condition to check for the expected URL
      const currentUrl = await driver.getUrl();
      console.log(currentUrl);
      return currentUrl.includes('progressive_values');
    }, {
      timeout: 10000,
      timeoutMsg: 'Expected URL to contain "progressive_values" not found, timeout after 10000ms',
    });
    await driver.switchWindow('Progressive Values - WeVote');
    await driver.pause(waitTime);
    await expect(driver).toHaveTitle(expect.stringContaining('Progressive Values - WeVote'));
    // Checking Follow and Unfollow buttons
    const circleIcon = await (TopicsPage.getProgressiveValuesCircleIconElement).isExisting();
    if (!circleIcon) {
      await driver.waitUntil(async () => (TopicsPage.getProgressiveValuesFollowElement.isClickable()));
      await TopicsPage.getProgressiveValuesFollowElement.click();
    }
    await driver.waitUntil(async () => (TopicsPage.getProgressiveValuesDropdownButtonElement.isClickable()));
    await TopicsPage.getProgressiveValuesDropdownButtonElement.click();
    await driver.waitUntil(async () => (TopicsPage.getProgressiveValuesUnfollowElement.isClickable()));
    await TopicsPage.getProgressiveValuesUnfollowElement.click();
    // verify follow button appears
    await expect(TopicsPage.getProgressiveValuesFollowElement).toBeDisplayed();

    await driver.waitUntil(async () => (TopicsPage.avatar.isClickable()));
    await TopicsPage.avatar.click();

    await driver.waitUntil(async () => (ProfilePage.getSignOutElement.isClickable()));
    await ProfilePage.getSignOutElement.click();

  });

  it('verifyConservativeValuesPageLoads', async () => {

    await ReadyPage.login();
    await ReadyPage.load();
    await driver.pause(waitTime);
    await driver.waitUntil(async () => (ReadyPage.getShowMoreLinkElement.isClickable()));
    await ReadyPage.getShowMoreLinkElement.click();
    await driver.waitUntil(async () => (ReadyPage.getConservativeValuesLinkElement.isClickable()));
    await ReadyPage.getConservativeValuesLinkElement.click();
    await driver.waitUntil(async () => {
      // Add condition to check for the expected URL
      const currentUrl = await driver.getUrl();
      console.log(currentUrl);
      return currentUrl.includes('conservative_values');
    }, {
      timeout: 10000,
      timeoutMsg: 'Expected URL to contain "conservativee_values" not found, timeout after 10000ms',
    });
    await driver.switchWindow('Conservative Values - WeVote');
    await driver.pause(waitTime);
    await expect(driver).toHaveTitle(expect.stringContaining('Conservative Values - WeVote'));
    // Checking Follow and Unfollow buttons
    const circleIcon = await (TopicsPage.getConservativeValuesCircleIconElement).isExisting();
    if (!circleIcon) {
      await driver.waitUntil(async () => (TopicsPage.getConservativeValuesFollowElement.isClickable()));
      await TopicsPage.getConservativeValuesFollowElement.click();
    }
    await driver.waitUntil(async () => (TopicsPage.getConservativeValuesDropdownButtonElement.isClickable()));
    await TopicsPage.getConservativeValuesDropdownButtonElement.click();
    await driver.waitUntil(async () => (TopicsPage.getConservativeValuesUnfollowElement.isClickable()));
    await TopicsPage.getConservativeValuesUnfollowElement.click();
    // verify follow button appears
    await expect(TopicsPage.getConservativeValuesFollowElement).toBeDisplayed();

    await driver.waitUntil(async () => (TopicsPage.avatar.isClickable()));
    await TopicsPage.avatar.click();

    await driver.waitUntil(async () => (ProfilePage.getSignOutElement.isClickable()));
    await ProfilePage.getSignOutElement.click();

  });

  it('verifyCommonSenseGunReformPageLoads', async () => {

    await ReadyPage.login();
    await ReadyPage.load();
    await driver.pause(waitTime);
    await driver.waitUntil(async () => (ReadyPage.getShowMoreLinkElement.isClickable()));
    await ReadyPage.getShowMoreLinkElement.click();
    await driver.waitUntil(async () => (ReadyPage.getCommonSenseGunReformLinkElement.isClickable()));
    await ReadyPage.getCommonSenseGunReformLinkElement.click();
    await driver.waitUntil(async () => {
      // Add condition to check for the expected URL
      const currentUrl = await driver.getUrl();
      console.log(currentUrl);
      return currentUrl.includes('common_sense_gun_reform');
    }, {
      timeout: 10000,
      timeoutMsg: 'Expected URL to contain "common_sense_gun_reform" not found, timeout after 10000ms',
    });
    await driver.switchWindow('Common Sense Gun Reform - WeVote');
    await driver.pause(waitTime);
    await expect(driver).toHaveTitle(expect.stringContaining('Common Sense Gun Reform - WeVote'));
    // Checking Follow and Unfollow buttons
    const circleIcon = await (TopicsPage.getCommonSenseGunReformCircleIconElement).isExisting();
    if (!circleIcon) {
      await driver.waitUntil(async () => (TopicsPage.getCommonSenseGunReformFollowElement.isClickable()));
      await TopicsPage.getCommonSenseGunReformFollowElement.click();
    }
    await driver.waitUntil(async () => (TopicsPage.getCommonSenseGunReformDropdownButtonElement.isClickable()));
    await TopicsPage.getCommonSenseGunReformDropdownButtonElement.click();
    await driver.waitUntil(async () => (TopicsPage.getCommonSenseGunReformUnfollowElement.isClickable()));
    await TopicsPage.getCommonSenseGunReformUnfollowElement.click();
    // verify follow button appears
    await expect(TopicsPage.getCommonSenseGunReformFollowElement).toBeDisplayed();

    await driver.waitUntil(async () => (TopicsPage.avatar.isClickable()));
    await TopicsPage.avatar.click();

    await driver.waitUntil(async () => (ProfilePage.getSignOutElement.isClickable()));
    await ProfilePage.getSignOutElement.click();

  });

  it('verifyGun2ndAmendmentRightsPageLoads', async () => {

    await ReadyPage.login();
    await ReadyPage.load();
    await driver.pause(waitTime);
    await driver.waitUntil(async () => (ReadyPage.getShowMoreLinkElement.isClickable()));
    await ReadyPage.getShowMoreLinkElement.click();
    await driver.waitUntil(async () => (ReadyPage.getGun2ndAmendmentRightsLinkElement.isClickable()));
    await ReadyPage.getGun2ndAmendmentRightsLinkElement.click();
    await driver.waitUntil(async () => {
      // Add condition to check for the expected URL
      const currentUrl = await driver.getUrl();
      console.log(currentUrl);
      return currentUrl.includes('gun__2nd_amendment_rights');
    }, {
      timeout: 10000,
      timeoutMsg: 'Expected URL to contain "gun__2nd_amendment_rights" not found, timeout after 10000ms',
    });
    await driver.switchWindow('Gun / 2nd Amendment Rights - WeVote');
    await driver.pause(waitTime);
    await expect(driver).toHaveTitle(expect.stringContaining('Gun / 2nd Amendment Rights - WeVote'));
    // Checking Follow and Unfollow buttons
    const circleIcon = await (TopicsPage.getGun2ndAmendmentRightsCircleIconElement).isExisting();
    if (!circleIcon) {
      await driver.waitUntil(async () => (TopicsPage.getGun2ndAmendmentRightsFollowElement.isClickable()));
      await TopicsPage.getGun2ndAmendmentRightsFollowElement.click();
    }
    await driver.waitUntil(async () => (TopicsPage.getGun2ndAmendmentRightsDropdownButtonElement.isClickable()));
    await TopicsPage.getGun2ndAmendmentRightsDropdownButtonElement.click();
    await driver.waitUntil(async () => (TopicsPage.getGun2ndAmendmentRightsUnfollowElement.isClickable()));
    await TopicsPage.getGun2ndAmendmentRightsUnfollowElement.click();
    // verify follow button appears
    await expect(TopicsPage.getGun2ndAmendmentRightsFollowElement).toBeDisplayed();

    await driver.waitUntil(async () => (TopicsPage.avatar.isClickable()));
    await TopicsPage.avatar.click();

    await driver.waitUntil(async () => (ProfilePage.getSignOutElement.isClickable()));
    await ProfilePage.getSignOutElement.click();

  });

  it('verifyAffordableHousingPageLoads', async () => {

    await ReadyPage.login();
    await ReadyPage.load();
    await driver.pause(waitTime);
    await driver.waitUntil(async () => (ReadyPage.getShowMoreLinkElement.isClickable()));
    await ReadyPage.getShowMoreLinkElement.click();
    await driver.waitUntil(async () => (ReadyPage.getAffordableHousingLinkElement.isClickable()));
    await ReadyPage.getAffordableHousingLinkElement.click();
    await driver.waitUntil(async () => {
      // Add condition to check for the expected URL
      const currentUrl = await driver.getUrl();
      console.log(currentUrl);
      return currentUrl.includes('affordable_housing');
    }, {
      timeout: 10000,
      timeoutMsg: 'Expected URL to contain "affordable_housing" not found, timeout after 10000ms',
    });
    await driver.switchWindow('Affordable Housing - WeVote');
    await driver.pause(waitTime);
    await expect(driver).toHaveTitle(expect.stringContaining('Affordable Housing - WeVote'));
    // Checking Follow and Unfollow buttons
    const circleIcon = await (TopicsPage.getAffordableHousingCircleIconElement).isExisting();
    if (!circleIcon) {
      await driver.waitUntil(async () => (TopicsPage.getAffordableHousingFollowElement.isClickable()));
      await TopicsPage.getAffordableHousingFollowElement.click();
    }
    await driver.waitUntil(async () => (TopicsPage.getAffordableHousingDropdownButtonElement.isClickable()));
    await TopicsPage.getAffordableHousingDropdownButtonElement.click();
    await driver.waitUntil(async () => (TopicsPage.getAffordableHousingUnfollowElement.isClickable()));
    await TopicsPage.getAffordableHousingUnfollowElement.click();
    // verify follow button appears
    await expect(TopicsPage.getAffordableHousingFollowElement).toBeDisplayed();

    await driver.waitUntil(async () => (TopicsPage.avatar.isClickable()));
    await TopicsPage.avatar.click();

    await driver.waitUntil(async () => (ProfilePage.getSignOutElement.isClickable()));
    await ProfilePage.getSignOutElement.click();

  });

  it('verifyVotingRightsAndEducationPageLoads', async () => {

    await ReadyPage.login();
    await ReadyPage.load();
    await driver.pause(waitTime);
    await driver.waitUntil(async () => (ReadyPage.getShowMoreLinkElement.isClickable()));
    await ReadyPage.getShowMoreLinkElement.click();
    await driver.waitUntil(async () => (ReadyPage.getVotingRightsAndEducationLinkElement.isClickable()));
    await ReadyPage.getVotingRightsAndEducationLinkElement.click();
    await driver.waitUntil(async () => {
      // Add condition to check for the expected URL
      const currentUrl = await driver.getUrl();
      console.log(currentUrl);
      return currentUrl.includes('voting_rights__education');
    }, {
      timeout: 10000,
      timeoutMsg: 'Expected URL to contain "voting_rights__education" not found, timeout after 10000ms',
    });
    await driver.switchWindow('Voting Rights & Education - WeVote');
    await driver.pause(waitTime);
    await expect(driver).toHaveTitle(expect.stringContaining('Voting Rights & Education - WeVote'));
    // Checking Follow and Unfollow buttons
    const circleIcon = await (TopicsPage.getVotingRightsAndEducationCircleIconElement).isExisting();
    if (!circleIcon) {
      await driver.waitUntil(async () => (TopicsPage.getVotingRightsAndEducationFollowElement.isClickable()));
      await TopicsPage.getVotingRightsAndEducationFollowElement.click();
    }
    await driver.waitUntil(async () => (TopicsPage.getVotingRightsAndEducationDropdownButtonElement.isClickable()));
    await TopicsPage.getVotingRightsAndEducationDropdownButtonElement.click();
    await driver.waitUntil(async () => (TopicsPage.getVotingRightsAndEducationUnfollowElement.isClickable()));
    await TopicsPage.getVotingRightsAndEducationUnfollowElement.click();
    // verify follow button appears
    await expect(TopicsPage.getVotingRightsAndEducationFollowElement).toBeDisplayed();

    await driver.waitUntil(async () => (TopicsPage.avatar.isClickable()));
    await TopicsPage.avatar.click();

    await driver.waitUntil(async () => (ProfilePage.getSignOutElement.isClickable()));
    await ProfilePage.getSignOutElement.click();

  });

  it('verifyCommunitiesOfColorPageLoads', async () => {

    await ReadyPage.login();
    await ReadyPage.load();
    await driver.pause(waitTime);
    await driver.waitUntil(async () => (ReadyPage.getShowMoreLinkElement.isClickable()));
    await ReadyPage.getShowMoreLinkElement.click();
    await driver.waitUntil(async () => (ReadyPage.getCommunitiesOfColorLinkElement.isClickable()));
    await ReadyPage.getCommunitiesOfColorLinkElement.click();
    await driver.waitUntil(async () => {
      // Add condition to check for the expected URL
      const currentUrl = await driver.getUrl();
      console.log(currentUrl);
      return currentUrl.includes('communities_of_color');
    }, {
      timeout: 10000,
      timeoutMsg: 'Expected URL to contain "communities_of_color" not found, timeout after 10000ms',
    });
    await driver.switchWindow('Communities of Color - WeVote');
    await driver.pause(waitTime);
    await expect(driver).toHaveTitle(expect.stringContaining('Communities of Color - WeVote'));
    // Checking Follow and Unfollow buttons
    const circleIcon = await (TopicsPage.getCommunitiesOfColorCircleIconElement).isExisting();
    if (!circleIcon) {
      await driver.waitUntil(async () => (TopicsPage.getCommunitiesOfColorFollowElement.isClickable()));
      await TopicsPage.getCommunitiesOfColorFollowElement.click();
    }
    await driver.waitUntil(async () => (TopicsPage.getCommunitiesOfColorDropdownButtonElement.isClickable()));
    await TopicsPage.getCommunitiesOfColorDropdownButtonElement.click();
    await driver.waitUntil(async () => (TopicsPage.getCommunitiesOfColorUnfollowElement.isClickable()));
    await TopicsPage.getCommunitiesOfColorUnfollowElement.click();
    // verify follow button appears
    await expect(TopicsPage.getCommunitiesOfColorFollowElement).toBeDisplayed();

    await driver.waitUntil(async () => (TopicsPage.avatar.isClickable()));
    await TopicsPage.avatar.click();

    await driver.waitUntil(async () => (ProfilePage.getSignOutElement.isClickable()));
    await ProfilePage.getSignOutElement.click();

  });

  it('verifyAnimalsAndWildlifePageLoads', async () => {

    await ReadyPage.login();
    await ReadyPage.load();
    await driver.pause(waitTime);
    await driver.waitUntil(async () => (ReadyPage.getShowMoreLinkElement.isClickable()));
    await ReadyPage.getShowMoreLinkElement.click();
    await driver.waitUntil(async () => (ReadyPage.getAnimalsAndWildlifeLinkElement.isClickable()));
    await ReadyPage.getAnimalsAndWildlifeLinkElement.click();
    await driver.waitUntil(async () => {
      // Add condition to check for the expected URL
      const currentUrl = await driver.getUrl();
      console.log(currentUrl);
      return currentUrl.includes('animals__wildlife');
    }, {
      timeout: 10000,
      timeoutMsg: 'Expected URL to contain "animals__wildlife" not found, timeout after 10000ms',
    });
    await driver.switchWindow('Animals & Wildlife - WeVote');
    await driver.pause(waitTime);
    await expect(driver).toHaveTitle(expect.stringContaining('Animals & Wildlife - WeVote'));
    // Checking Follow and Unfollow buttons
    const circleIcon = await (TopicsPage.getAnimalsAndWildlifeCircleIconElement).isExisting();
    if (!circleIcon) {
      await driver.waitUntil(async () => (TopicsPage.getAnimalsAndWildlifeFollowElement.isClickable()));
      await TopicsPage.getAnimalsAndWildlifeFollowElement.click();
    }
    await driver.waitUntil(async () => (TopicsPage.getAnimalsAndWildlifeDropdownButtonElement.isClickable()));
    await TopicsPage.getAnimalsAndWildlifeDropdownButtonElement.click();
    await driver.waitUntil(async () => (TopicsPage.getAnimalsAndWildlifeUnfollowElement.isClickable()));
    await TopicsPage.getAnimalsAndWildlifeUnfollowElement.click();
    // verify follow button appears
    await expect(TopicsPage.getAnimalsAndWildlifeFollowElement).toBeDisplayed();

    await driver.waitUntil(async () => (TopicsPage.avatar.isClickable()));
    await TopicsPage.avatar.click();

    await driver.waitUntil(async () => (ProfilePage.getSignOutElement.isClickable()));
    await ProfilePage.getSignOutElement.click();

  });

  it('verifyImmigrationRightsPageLoads', async () => {

    await ReadyPage.login();
    await ReadyPage.load();
    await driver.pause(waitTime);
    await driver.waitUntil(async () => (ReadyPage.getShowMoreLinkElement.isClickable()));
    await ReadyPage.getShowMoreLinkElement.click();
    await driver.waitUntil(async () => (ReadyPage.getImmigrationRightsLinkElement.isClickable()));
    await ReadyPage.getImmigrationRightsLinkElement.click();
    await driver.waitUntil(async () => {
      // Add condition to check for the expected URL
      const currentUrl = await driver.getUrl();
      console.log(currentUrl);
      return currentUrl.includes('immigration_rights');
    }, {
      timeout: 10000,
      timeoutMsg: 'Expected URL to contain "immigration_rights" not found, timeout after 10000ms',
    });
    await driver.switchWindow('Immigration Rights - WeVote');
    await driver.pause(waitTime);
    await expect(driver).toHaveTitle(expect.stringContaining('Immigration Rights - WeVote'));
    // Checking Follow and Unfollow buttons
    const circleIcon = await (TopicsPage.getImmigrationRightsCircleIconElement).isExisting();
    if (!circleIcon) {
      await driver.waitUntil(async () => (TopicsPage.getImmigrationRightsFollowElement.isClickable()));
      await TopicsPage.getImmigrationRightsFollowElement.click();
    }
    await driver.waitUntil(async () => (TopicsPage.getImmigrationRightsDropdownButtonElement.isClickable()));
    await TopicsPage.getImmigrationRightsDropdownButtonElement.click();
    await driver.waitUntil(async () => (TopicsPage.getImmigrationRightsUnfollowElement.isClickable()));
    await TopicsPage.getImmigrationRightsUnfollowElement.click();
    // verify follow button appears
    await expect(TopicsPage.getImmigrationRightsFollowElement).toBeDisplayed();

    await driver.waitUntil(async () => (TopicsPage.avatar.isClickable()));
    await TopicsPage.avatar.click();

    await driver.waitUntil(async () => (ProfilePage.getSignOutElement.isClickable()));
    await ProfilePage.getSignOutElement.click();

  });

  it('verifyCriminalJusticeReformPageLoads', async () => {

    await ReadyPage.login();
    await ReadyPage.load();
    await driver.pause(waitTime);
    await driver.waitUntil(async () => (ReadyPage.getShowMoreLinkElement.isClickable()));
    await ReadyPage.getShowMoreLinkElement.click();
    await driver.waitUntil(async () => (ReadyPage.getCriminalJusticeReformLinkElement.isClickable()));
    await ReadyPage.getCriminalJusticeReformLinkElement.click();
    await driver.waitUntil(async () => {
      // Add condition to check for the expected URL
      const currentUrl = await driver.getUrl();
      console.log(currentUrl);
      return currentUrl.includes('criminal_justice_reform');
    }, {
      timeout: 10000,
      timeoutMsg: 'Expected URL to contain "criminal_justice_reform" not found, timeout after 10000ms',
    });
    await driver.switchWindow('Criminal Justice Reform - WeVote');
    await driver.pause(waitTime);
    await expect(driver).toHaveTitle(expect.stringContaining('Criminal Justice Reform - WeVote'));
    // Checking Follow and Unfollow buttons
    const circleIcon = await (TopicsPage.getCriminalJusticeReformCircleIconElement).isExisting();
    if (!circleIcon) {
      await driver.waitUntil(async () => (TopicsPage.getCriminalJusticeReformFollowElement.isClickable()));
      await TopicsPage.getCriminalJusticeReformFollowElement.click();
    }
    await driver.waitUntil(async () => (TopicsPage.getCriminalJusticeReformDropdownButtonElement.isClickable()));
    await TopicsPage.getCriminalJusticeReformDropdownButtonElement.click();
    await driver.waitUntil(async () => (TopicsPage.getCriminalJusticeReformUnfollowElement.isClickable()));
    await TopicsPage.getCriminalJusticeReformUnfollowElement.click();
    // verify follow button appears
    await expect(TopicsPage.getCriminalJusticeReformFollowElement).toBeDisplayed();

    await driver.waitUntil(async () => (TopicsPage.avatar.isClickable()));
    await TopicsPage.avatar.click();

    await driver.waitUntil(async () => (ProfilePage.getSignOutElement.isClickable()));
    await ProfilePage.getSignOutElement.click();

  });

  it('verifyReducingMoneyInPoliticsPageLoads', async () => {

    await ReadyPage.login();
    await ReadyPage.load();
    await driver.pause(waitTime);
    await driver.waitUntil(async () => (ReadyPage.getShowMoreLinkElement.isClickable()));
    await ReadyPage.getShowMoreLinkElement.click();
    await driver.waitUntil(async () => (ReadyPage.getReducingMoneyInPoliticsLinkElement.isClickable()));
    await ReadyPage.getReducingMoneyInPoliticsLinkElement.click();
    await driver.waitUntil(async () => {
      // Add condition to check for the expected URL
      const currentUrl = await driver.getUrl();
      console.log(currentUrl);
      return currentUrl.includes('reducing_money_in_politics');
    }, {
      timeout: 10000,
      timeoutMsg: 'Expected URL to contain "reducing_money_in_politics" not found, timeout after 10000ms',
    });
    await driver.switchWindow('Reducing Money in Politics - WeVote');
    await driver.pause(waitTime);
    await expect(driver).toHaveTitle(expect.stringContaining('Reducing Money in Politics - WeVote'));
    // Checking Follow and Unfollow buttons
    const circleIcon = await (TopicsPage.getReducingMoneyInPoliticsCircleIconElement).isExisting();
    if (!circleIcon) {
      await driver.waitUntil(async () => (TopicsPage.getReducingMoneyInPoliticsFollowElement.isClickable()));
      await TopicsPage.getReducingMoneyInPoliticsFollowElement.click();
    }
    await driver.waitUntil(async () => (TopicsPage.getReducingMoneyInPoliticsDropdownButtonElement.isClickable()));
    await TopicsPage.getReducingMoneyInPoliticsDropdownButtonElement.click();
    await driver.waitUntil(async () => (TopicsPage.getReducingMoneyInPoliticsUnfollowElement.isClickable()));
    await TopicsPage.getReducingMoneyInPoliticsUnfollowElement.click();
    // verify follow button appears
    await expect(TopicsPage.getReducingMoneyInPoliticsFollowElement).toBeDisplayed();

    await driver.waitUntil(async () => (TopicsPage.avatar.isClickable()));
    await TopicsPage.avatar.click();

    await driver.waitUntil(async () => (ProfilePage.getSignOutElement.isClickable()));
    await ProfilePage.getSignOutElement.click();

  });

  it('verifySocialSecurityAndMedicarePageLoads', async () => {

    await ReadyPage.login();
    await ReadyPage.load();
    await driver.pause(waitTime);
    await driver.waitUntil(async () => (ReadyPage.getShowMoreLinkElement.isClickable()));
    await ReadyPage.getShowMoreLinkElement.click();
    await driver.waitUntil(async () => (ReadyPage.getSocialSecurityAndMedicareLinkElement.isClickable()));
    await ReadyPage.getSocialSecurityAndMedicareLinkElement.click();
    await driver.waitUntil(async () => {
      // Add condition to check for the expected URL
      const currentUrl = await driver.getUrl();
      console.log(currentUrl);
      return currentUrl.includes('social_security__medicare');
    }, {
      timeout: 10000,
      timeoutMsg: 'Expected URL to contain "social_security__medicare" not found, timeout after 10000ms',
    });
    await driver.switchWindow('Social Security & Medicare - WeVote');
    await driver.pause(waitTime);
    await expect(driver).toHaveTitle(expect.stringContaining('Social Security & Medicare - WeVote'));
    // Checking Follow and Unfollow buttons
    const circleIcon = await (TopicsPage.getSocialSecurityAndMedicareCircleIconElement).isExisting();
    if (!circleIcon) {
      await driver.waitUntil(async () => (TopicsPage.getSocialSecurityAndMedicareFollowElement.isClickable()));
      await TopicsPage.getSocialSecurityAndMedicareFollowElement.click();
    }
    await driver.waitUntil(async () => (TopicsPage.getSocialSecurityAndMedicareDropdownButtonElement.isClickable()));
    await TopicsPage.getSocialSecurityAndMedicareDropdownButtonElement.click();
    await driver.waitUntil(async () => (TopicsPage.getSocialSecurityAndMedicareUnfollowElement.isClickable()));
    await TopicsPage.getSocialSecurityAndMedicareUnfollowElement.click();
    // verify follow button appears
    await expect(TopicsPage.getSocialSecurityAndMedicareFollowElement).toBeDisplayed();

    await driver.waitUntil(async () => (TopicsPage.avatar.isClickable()));
    await TopicsPage.avatar.click();

    await driver.waitUntil(async () => (ProfilePage.getSignOutElement.isClickable()));
    await ProfilePage.getSignOutElement.click();

  });

  it('verifyReducingStudentDebtPageLoads', async () => {

    await ReadyPage.login();
    await ReadyPage.load();
    await driver.pause(waitTime);
    await driver.waitUntil(async () => (ReadyPage.getShowMoreLinkElement.isClickable()));
    await ReadyPage.getShowMoreLinkElement.click();
    await driver.waitUntil(async () => (ReadyPage.getReducingStudentDebtLinkElement.isClickable()));
    await ReadyPage.getReducingStudentDebtLinkElement.click();
    await driver.waitUntil(async () => {
      // Add condition to check for the expected URL
      const currentUrl = await driver.getUrl();
      console.log(currentUrl);
      return currentUrl.includes('reducing_student_debt');
    }, {
      timeout: 10000,
      timeoutMsg: 'Expected URL to contain "reducing_student_debt" not found, timeout after 10000ms',
    });
    await driver.switchWindow('Reducing Student Debt - WeVote');
    await driver.pause(waitTime);
    await expect(driver).toHaveTitle(expect.stringContaining('Reducing Student Debt - WeVote'));
    // Checking Follow and Unfollow buttons
    const circleIcon = await (TopicsPage.getReducingStudentDebtCircleIconElement).isExisting();
    if (!circleIcon) {
      await driver.waitUntil(async () => (TopicsPage.getReducingStudentDebtFollowElement.isClickable()));
      await TopicsPage.getReducingStudentDebtFollowElement.click();
    }
    await driver.waitUntil(async () => (TopicsPage.getReducingStudentDebtDropdownButtonElement.isClickable()));
    await TopicsPage.getReducingStudentDebtDropdownButtonElement.click();
    await driver.waitUntil(async () => (TopicsPage.getReducingStudentDebtUnfollowElement.isClickable()));
    await TopicsPage.getReducingStudentDebtUnfollowElement.click();
    // verify follow button appears
    await expect(TopicsPage.getReducingStudentDebtFollowElement).toBeDisplayed();

    await driver.waitUntil(async () => (TopicsPage.avatar.isClickable()));
    await TopicsPage.avatar.click();

    await driver.waitUntil(async () => (ProfilePage.getSignOutElement.isClickable()));
    await ProfilePage.getSignOutElement.click();

  });

  it('verifyMarijuanaLegalizationPageLoads', async () => {

    await ReadyPage.login();
    await ReadyPage.load();
    await driver.pause(waitTime);
    await driver.waitUntil(async () => (ReadyPage.getShowMoreLinkElement.isClickable()));
    await ReadyPage.getShowMoreLinkElement.click();
    await driver.waitUntil(async () => (ReadyPage.getMarijuanaLegalizationLinkElement.isClickable()));
    await ReadyPage.getMarijuanaLegalizationLinkElement.click();
    await driver.waitUntil(async () => {
      // Add condition to check for the expected URL
      const currentUrl = await driver.getUrl();
      console.log(currentUrl);
      return currentUrl.includes('marijuana_legalization');
    }, {
      timeout: 10000,
      timeoutMsg: 'Expected URL to contain "marijuana_legalization" not found, timeout after 10000ms',
    });
    await driver.switchWindow('Marijuana Legalization - WeVote');
    await driver.pause(waitTime);
    await expect(driver).toHaveTitle(expect.stringContaining('Marijuana Legalization - WeVote'));
    // Checking Follow and Unfollow buttons
    const circleIcon = await (TopicsPage.getMarijuanaLegalizationCircleIconElement).isExisting();
    if (!circleIcon) {
      await driver.waitUntil(async () => (TopicsPage.getMarijuanaLegalizationFollowElement.isClickable()));
      await TopicsPage.getMarijuanaLegalizationFollowElement.click();
    }
    await driver.waitUntil(async () => (TopicsPage.getMarijuanaLegalizationDropdownButtonElement.isClickable()));
    await TopicsPage.getMarijuanaLegalizationDropdownButtonElement.click();
    await driver.waitUntil(async () => (TopicsPage.getMarijuanaLegalizationUnfollowElement.isClickable()));
    await TopicsPage.getMarijuanaLegalizationUnfollowElement.click();
    // verify follow button appears
    await expect(TopicsPage.getMarijuanaLegalizationFollowElement).toBeDisplayed();

    await driver.waitUntil(async () => (TopicsPage.avatar.isClickable()));
    await TopicsPage.avatar.click();

    await driver.waitUntil(async () => (ProfilePage.getSignOutElement.isClickable()));
    await ProfilePage.getSignOutElement.click();

  });

  it('verifyLowIncomeAndUnemploymentPageLoads', async () => {

    await ReadyPage.login();
    await ReadyPage.load();
    await driver.pause(waitTime);
    await driver.waitUntil(async () => (ReadyPage.getShowMoreLinkElement.isClickable()));
    await ReadyPage.getShowMoreLinkElement.click();
    await driver.waitUntil(async () => (ReadyPage.getLowIncomeAndUnemploymentLinkElement.isClickable()));
    await ReadyPage.getLowIncomeAndUnemploymentLinkElement.click();
    await driver.waitUntil(async () => {
      // Add condition to check for the expected URL
      const currentUrl = await driver.getUrl();
      console.log(currentUrl);
      return currentUrl.includes('low_income__unemployment');
    }, {
      timeout: 10000,
      timeoutMsg: 'Expected URL to contain "low_income__unemployment" not found, timeout after 10000ms',
    });
    await driver.switchWindow('Low Income & Unemployment - WeVote');
    await driver.pause(waitTime);
    await expect(driver).toHaveTitle(expect.stringContaining('Low Income & Unemployment - WeVote'));
    // Checking Follow and Unfollow buttons
    const circleIcon = await (TopicsPage.getLowIncomeAndUnemploymentCircleIconElement).isExisting();
    if (!circleIcon) {
      await driver.waitUntil(async () => (TopicsPage.getLowIncomeAndUnemploymentFollowElement.isClickable()));
      await TopicsPage.getLowIncomeAndUnemploymentFollowElement.click();
    }
    await driver.waitUntil(async () => (TopicsPage.getLowIncomeAndUnemploymentDropdownButtonElement.isClickable()));
    await TopicsPage.getLowIncomeAndUnemploymentDropdownButtonElement.click();
    await driver.waitUntil(async () => (TopicsPage.getLowIncomeAndUnemploymentUnfollowElement.isClickable()));
    await TopicsPage.getLowIncomeAndUnemploymentUnfollowElement.click();
    // verify follow button appears
    await expect(TopicsPage.getLowIncomeAndUnemploymentFollowElement).toBeDisplayed();

    await driver.waitUntil(async () => (TopicsPage.avatar.isClickable()));
    await TopicsPage.avatar.click();

    await driver.waitUntil(async () => (ProfilePage.getSignOutElement.isClickable()));
    await ProfilePage.getSignOutElement.click();

  });

  it('verifyHomelessWellBeingPageLoads', async () => {

    await ReadyPage.login();
    await ReadyPage.load();
    await driver.pause(waitTime);
    await driver.waitUntil(async () => (ReadyPage.getShowMoreLinkElement.isClickable()));
    await ReadyPage.getShowMoreLinkElement.click();
    await driver.waitUntil(async () => (ReadyPage.getHomelessWellBeingLinkElement.isClickable()));
    await ReadyPage.getHomelessWellBeingLinkElement.click();
    await driver.waitUntil(async () => {
      // Add condition to check for the expected URL
      const currentUrl = await driver.getUrl();
      console.log(currentUrl);
      return currentUrl.includes('homeless_well-being');
    }, {
      timeout: 10000,
      timeoutMsg: 'Expected URL to contain "homeless_well-being" not found, timeout after 10000ms',
    });
    await driver.switchWindow('Homeless Well-Being - WeVote');
    await driver.pause(waitTime);
    await expect(driver).toHaveTitle(expect.stringContaining('Homeless Well-Being - WeVote'));
    // Checking Follow and Unfollow buttons
    const circleIcon = await (TopicsPage.getHomelessWellBeingCircleIconElement).isExisting();
    if (!circleIcon) {
      await driver.waitUntil(async () => (TopicsPage.getHomelessWellBeingFollowElement.isClickable()));
      await TopicsPage.getHomelessWellBeingFollowElement.click();
    }
    await driver.waitUntil(async () => (TopicsPage.getHomelessWellBeingDropdownButtonElement.isClickable()));
    await TopicsPage.getHomelessWellBeingDropdownButtonElement.click();
    await driver.waitUntil(async () => (TopicsPage.getHomelessWellBeingUnfollowElement.isClickable()));
    await TopicsPage.getHomelessWellBeingUnfollowElement.click();
    // verify follow button appears
    await expect(TopicsPage.getHomelessWellBeingFollowElement).toBeDisplayed();

    await driver.waitUntil(async () => (TopicsPage.avatar.isClickable()));
    await TopicsPage.avatar.click();

    await driver.waitUntil(async () => (ProfilePage.getSignOutElement.isClickable()));
    await ProfilePage.getSignOutElement.click();

  });

  it('verifyBicyclingPageLoads', async () => {

    await ReadyPage.login();
    await ReadyPage.load();
    await driver.pause(waitTime);
    await driver.waitUntil(async () => (ReadyPage.getShowMoreLinkElement.isClickable()));
    await ReadyPage.getShowMoreLinkElement.click();
    await driver.waitUntil(async () => (ReadyPage.getBicyclingLinkElement.isClickable()));
    await ReadyPage.getBicyclingLinkElement.click();
    await driver.waitUntil(async () => {
      // Add condition to check for the expected URL
      const currentUrl = await driver.getUrl();
      console.log(currentUrl);
      return currentUrl.includes('bicycling');
    }, {
      timeout: 10000,
      timeoutMsg: 'Expected URL to contain "bicycling" not found, timeout after 10000ms',
    });
    await driver.switchWindow('Bicycling - WeVote');
    await driver.pause(waitTime);
    await expect(driver).toHaveTitle(expect.stringContaining('Bicycling - WeVote'));
    // Checking Follow and Unfollow buttons
    const circleIcon = await (TopicsPage.getBicyclingCircleIconElement).isExisting();
    if (!circleIcon) {
      await driver.waitUntil(async () => (TopicsPage.getBicyclingFollowElement.isClickable()));
      await TopicsPage.getBicyclingFollowElement.click();
    }
    await driver.waitUntil(async () => (TopicsPage.getBicyclingDropdownButtonElement.isClickable()));
    await TopicsPage.getBicyclingDropdownButtonElement.click();
    await driver.waitUntil(async () => (TopicsPage.getBicyclingUnfollowElement.isClickable()));
    await TopicsPage.getBicyclingUnfollowElement.click();
    // verify follow button appears
    await expect(TopicsPage.getBicyclingFollowElement).toBeDisplayed();

    await driver.waitUntil(async () => (TopicsPage.avatar.isClickable()));
    await TopicsPage.avatar.click();

    await driver.waitUntil(async () => (ProfilePage.getSignOutElement.isClickable()));
    await ProfilePage.getSignOutElement.click();

  });

  it('verifySecuringOurBordersPageLoads', async () => {

    await ReadyPage.login();
    await ReadyPage.load();
    await driver.pause(waitTime);
    await driver.waitUntil(async () => (ReadyPage.getShowMoreLinkElement.isClickable()));
    await ReadyPage.getShowMoreLinkElement.click();
    await driver.waitUntil(async () => (ReadyPage.getSecuringOurBordersLinkElement.isClickable()));
    await ReadyPage.getSecuringOurBordersLinkElement.click();
    await driver.waitUntil(async () => {
      // Add condition to check for the expected URL
      const currentUrl = await driver.getUrl();
      console.log(currentUrl);
      return currentUrl.includes('securing_our_borders');
    }, {
      timeout: 10000,
      timeoutMsg: 'Expected URL to contain "securing_our_borders" not found, timeout after 10000ms',
    });
    await driver.switchWindow('Securing Our Borders - WeVote');
    await driver.pause(waitTime);
    await expect(driver).toHaveTitle(expect.stringContaining('Securing Our Borders - WeVote'));
    // Checking Follow and Unfollow buttons
    const circleIcon = await (TopicsPage.getSecuringOurBordersCircleIconElement).isExisting();
    if (!circleIcon) {
      await driver.waitUntil(async () => (TopicsPage.getSecuringOurBordersFollowElement.isClickable()));
      await TopicsPage.getSecuringOurBordersFollowElement.click();
    }
    await driver.waitUntil(async () => (TopicsPage.getSecuringOurBordersDropdownButtonElement.isClickable()));
    await TopicsPage.getSecuringOurBordersDropdownButtonElement.click();
    await driver.waitUntil(async () => (TopicsPage.getSecuringOurBordersUnfollowElement.isClickable()));
    await TopicsPage.getSecuringOurBordersUnfollowElement.click();
    // verify follow button appears
    await expect(TopicsPage.getSecuringOurBordersFollowElement).toBeDisplayed();

    await driver.waitUntil(async () => (TopicsPage.avatar.isClickable()));
    await TopicsPage.avatar.click();

    await driver.waitUntil(async () => (ProfilePage.getSignOutElement.isClickable()));
    await ProfilePage.getSignOutElement.click();

  });

  it('verifyWomensEqualityPageLoads', async () => {

    await ReadyPage.login();
    await ReadyPage.load();
    await driver.pause(waitTime);
    await driver.waitUntil(async () => (ReadyPage.getShowMoreLinkElement.isClickable()));
    await ReadyPage.getShowMoreLinkElement.click();
    await driver.waitUntil(async () => (ReadyPage.getWomensEqualityLinkElement.isClickable()));
    await ReadyPage.getWomensEqualityLinkElement.click();
    await driver.waitUntil(async () => {
      // Add condition to check for the expected URL
      const currentUrl = await driver.getUrl();
      console.log(currentUrl);
      return currentUrl.includes('women\'s_equality');
    }, {
      timeout: 10000,
      timeoutMsg: 'Expected URL to contain "women\'s_equality" not found, timeout after 10000ms',
    });
    await driver.switchWindow('Women\'s Equality - WeVote');
    await driver.pause(waitTime);
    await expect(driver).toHaveTitle(expect.stringContaining('Women\'s Equality - WeVote'));
    // Checking Follow and Unfollow buttons
    const circleIcon = await (TopicsPage.getWomensEqualityCircleIconElement).isExisting();
    if (!circleIcon) {
      await driver.waitUntil(async () => (TopicsPage.getWomensEqualityFollowElement.isClickable()));
      await TopicsPage.getWomensEqualityFollowElement.click();
    }
    await driver.waitUntil(async () => (TopicsPage.getWomensEqualityDropdownButtonElement.isClickable()));
    await TopicsPage.getWomensEqualityDropdownButtonElement.click();
    await driver.waitUntil(async () => (TopicsPage.getWomensEqualityUnfollowElement.isClickable()));
    await TopicsPage.getWomensEqualityUnfollowElement.click();
    // verify follow button appears
    await expect(TopicsPage.getWomensEqualityFollowElement).toBeDisplayed();

    await driver.waitUntil(async () => (TopicsPage.avatar.isClickable()));
    await TopicsPage.avatar.click();

    await driver.waitUntil(async () => (ProfilePage.getSignOutElement.isClickable()));
    await ProfilePage.getSignOutElement.click();

  });

  it('verifyGreenPartyClubsPageLoads', async () => {

    await ReadyPage.login();
    await ReadyPage.load();
    await driver.pause(waitTime);
    await driver.waitUntil(async () => (ReadyPage.getShowMoreLinkElement.isClickable()));
    await ReadyPage.getShowMoreLinkElement.click();
    await driver.waitUntil(async () => (ReadyPage.getGreenPartyClubsLinkElement.isClickable()));
    await ReadyPage.getGreenPartyClubsLinkElement.click();
    await driver.waitUntil(async () => {
      // Add condition to check for the expected URL
      const currentUrl = await driver.getUrl();
      console.log(currentUrl);
      return currentUrl.includes('green_party_clubs');
    }, {
      timeout: 10000,
      timeoutMsg: 'Expected URL to contain "green_party_clubs" not found, timeout after 10000ms',
    });
    await driver.switchWindow('Green Party Clubs - WeVote');
    await driver.pause(waitTime);
    await expect(driver).toHaveTitle(expect.stringContaining('Green Party Clubs - WeVote'));
    // Checking Follow and Unfollow buttons
    const circleIcon = await (TopicsPage.getGreenPartyClubsCircleIconElement).isExisting();
    if (!circleIcon) {
      await driver.waitUntil(async () => (TopicsPage.getGreenPartyClubsFollowElement.isClickable()));
      await TopicsPage.getGreenPartyClubsFollowElement.click();
    }
    await driver.waitUntil(async () => (TopicsPage.getGreenPartyClubsDropdownButtonElement.isClickable()));
    await TopicsPage.getGreenPartyClubsDropdownButtonElement.click();
    await driver.waitUntil(async () => (TopicsPage.getGreenPartyClubsUnfollowElement.isClickable()));
    await TopicsPage.getGreenPartyClubsUnfollowElement.click();
    // verify follow button appears
    await expect(TopicsPage.getGreenPartyClubsFollowElement).toBeDisplayed();

    await driver.waitUntil(async () => (TopicsPage.avatar.isClickable()));
    await TopicsPage.avatar.click();

    await driver.waitUntil(async () => (ProfilePage.getSignOutElement.isClickable()));
    await ProfilePage.getSignOutElement.click();

  });

  it('verifyLibertarianClubsPageLoads', async () => {

    await ReadyPage.login();
    await ReadyPage.load();
    await driver.pause(waitTime);
    await driver.waitUntil(async () => (ReadyPage.getShowMoreLinkElement.isClickable()));
    await ReadyPage.getShowMoreLinkElement.click();
    await driver.waitUntil(async () => (ReadyPage.getLibertarianClubsLinkElement.isClickable()));
    await ReadyPage.getLibertarianClubsLinkElement.click();
    await driver.waitUntil(async () => {
      // Add condition to check for the expected URL
      const currentUrl = await driver.getUrl();
      console.log(currentUrl);
      return currentUrl.includes('libertarian_clubs');
    }, {
      timeout: 10000,
      timeoutMsg: 'Expected URL to contain "libertarian_clubs" not found, timeout after 10000ms',
    });
    await driver.switchWindow('Libertarian Clubs - WeVote');
    await driver.pause(waitTime);
    await expect(driver).toHaveTitle(expect.stringContaining('Libertarian Clubs - WeVote'));
    // Checking Follow and Unfollow buttons
    const circleIcon = await (TopicsPage.getLibertarianClubsCircleIconElement).isExisting();
    if (!circleIcon) {
      await driver.waitUntil(async () => (TopicsPage.getLibertarianClubsFollowElement.isClickable()));
      await TopicsPage.getLibertarianClubsFollowElement.click();
    }
    await driver.waitUntil(async () => (TopicsPage.getLibertarianClubsDropdownButtonElement.isClickable()));
    await TopicsPage.getLibertarianClubsDropdownButtonElement.click();
    await driver.waitUntil(async () => (TopicsPage.getLibertarianClubsUnfollowElement.isClickable()));
    await TopicsPage.getLibertarianClubsUnfollowElement.click();
    // verify follow button appears
    await expect(TopicsPage.getLibertarianClubsFollowElement).toBeDisplayed();

    await driver.waitUntil(async () => (TopicsPage.avatar.isClickable()));
    await TopicsPage.avatar.click();

    await driver.waitUntil(async () => (ProfilePage.getSignOutElement.isClickable()));
    await ProfilePage.getSignOutElement.click();

  });

  it('verifyProPublicSchoolsPageLoads', async () => {

    await ReadyPage.login();
    await ReadyPage.load();
    await driver.pause(waitTime);
    await driver.waitUntil(async () => (ReadyPage.getShowMoreLinkElement.isClickable()));
    await ReadyPage.getShowMoreLinkElement.click();
    await driver.waitUntil(async () => (ReadyPage.getProPublicSchoolsLinkElement.isClickable()));
    await ReadyPage.getProPublicSchoolsLinkElement.click();
    await driver.waitUntil(async () => {
      // Add condition to check for the expected URL
      const currentUrl = await driver.getUrl();
      console.log(currentUrl);
      return currentUrl.includes('pro_public_schools');
    }, {
      timeout: 10000,
      timeoutMsg: 'Expected URL to contain "pro_public_schools" not found, timeout after 10000ms',
    });
    await driver.switchWindow('Pro Public Schools - WeVote');
    await driver.pause(waitTime);
    await expect(driver).toHaveTitle(expect.stringContaining('Pro Public Schools - WeVote'));
    // Checking Follow and Unfollow buttons
    const circleIcon = await (TopicsPage.getProPublicSchoolsCircleIconElement).isExisting();
    if (!circleIcon) {
      await driver.waitUntil(async () => (TopicsPage.getProPublicSchoolsFollowElement.isClickable()));
      await TopicsPage.getProPublicSchoolsFollowElement.click();
    }
    await driver.waitUntil(async () => (TopicsPage.getProPublicSchoolsDropdownButtonElement.isClickable()));
    await TopicsPage.getProPublicSchoolsDropdownButtonElement.click();
    await driver.waitUntil(async () => (TopicsPage.getProPublicSchoolsUnfollowElement.isClickable()));
    await TopicsPage.getProPublicSchoolsUnfollowElement.click();
    // verify follow button appears
    await expect(TopicsPage.getProPublicSchoolsFollowElement).toBeDisplayed();

    await driver.waitUntil(async () => (TopicsPage.avatar.isClickable()));
    await TopicsPage.avatar.click();

    await driver.waitUntil(async () => (ProfilePage.getSignOutElement.isClickable()));
    await ProfilePage.getSignOutElement.click();

  });

  it('verifyPubliclyFundedHealthcarePageLoads', async () => {

    await ReadyPage.login();
    await ReadyPage.load();
    await driver.pause(waitTime);
    await driver.waitUntil(async () => (ReadyPage.getShowMoreLinkElement.isClickable()));
    await ReadyPage.getShowMoreLinkElement.click();
    await driver.waitUntil(async () => (ReadyPage.getPubliclyFundedHealthcareLinkElement.isClickable()));
    await ReadyPage.getPubliclyFundedHealthcareLinkElement.click();
    await driver.waitUntil(async () => {
      // Add condition to check for the expected URL
      const currentUrl = await driver.getUrl();
      console.log(currentUrl);
      return currentUrl.includes('publicly_funded_healthcare');
    }, {
      timeout: 10000,
      timeoutMsg: 'Expected URL to contain "publicly_funded_healthcare" not found, timeout after 10000ms',
    });
    await driver.switchWindow('Publicly Funded Healthcare - WeVote');
    await driver.pause(waitTime);
    await expect(driver).toHaveTitle(expect.stringContaining('Publicly Funded Healthcare - WeVote'));
    // Checking Follow and Unfollow buttons
    const circleIcon = await (TopicsPage.getPubliclyFundedHealthcareCircleIconElement).isExisting();
    if (!circleIcon) {
      await driver.waitUntil(async () => (TopicsPage.getPubliclyFundedHealthcareFollowElement.isClickable()));
      await TopicsPage.getPubliclyFundedHealthcareFollowElement.click();
    }
    await driver.waitUntil(async () => (TopicsPage.getPubliclyFundedHealthcareDropdownButtonElement.isClickable()));
    await TopicsPage.getPubliclyFundedHealthcareDropdownButtonElement.click();
    await driver.waitUntil(async () => (TopicsPage.getPubliclyFundedHealthcareUnfollowElement.isClickable()));
    await TopicsPage.getPubliclyFundedHealthcareUnfollowElement.click();
    // verify follow button appears
    await expect(TopicsPage.getPubliclyFundedHealthcareFollowElement).toBeDisplayed();

    await driver.waitUntil(async () => (TopicsPage.avatar.isClickable()));
    await TopicsPage.avatar.click();

    await driver.waitUntil(async () => (ProfilePage.getSignOutElement.isClickable()));
    await ProfilePage.getSignOutElement.click();

  });

  it('verifyGreenPartyPoliticiansPageLoads', async () => {

    await ReadyPage.login();
    await ReadyPage.load();
    await driver.pause(waitTime);
    await driver.waitUntil(async () => (ReadyPage.getShowMoreLinkElement.isClickable()));
    await ReadyPage.getShowMoreLinkElement.click();
    await driver.waitUntil(async () => (ReadyPage.getGreenPartyPoliticiansLinkElement.isClickable()));
    await ReadyPage.getGreenPartyPoliticiansLinkElement.click();
    await driver.waitUntil(async () => {
      // Add condition to check for the expected URL
      const currentUrl = await driver.getUrl();
      console.log(currentUrl);
      return currentUrl.includes('green_party_politicians');
    }, {
      timeout: 10000,
      timeoutMsg: 'Expected URL to contain "green_party_politicians" not found, timeout after 10000ms',
    });
    await driver.switchWindow('Green Party Politicians - WeVote');
    await driver.pause(waitTime);
    await expect(driver).toHaveTitle(expect.stringContaining('Green Party Politicians - WeVote'));
    // Checking Follow and Unfollow buttons
    const circleIcon = await (TopicsPage.getGreenPartyPoliticiansCircleIconElement).isExisting();
    if (!circleIcon) {
      await driver.waitUntil(async () => (TopicsPage.getGreenPartyPoliticiansFollowElement.isClickable()));
      await TopicsPage.getGreenPartyPoliticiansFollowElement.click();
    }
    await driver.waitUntil(async () => (TopicsPage.getGreenPartyPoliticiansDropdownButtonElement.isClickable()));
    await TopicsPage.getGreenPartyPoliticiansDropdownButtonElement.click();
    await driver.waitUntil(async () => (TopicsPage.getGreenPartyPoliticiansUnfollowElement.isClickable()));
    await TopicsPage.getGreenPartyPoliticiansUnfollowElement.click();
    // verify follow button appears
    await expect(TopicsPage.getGreenPartyPoliticiansFollowElement).toBeDisplayed();

    await driver.waitUntil(async () => (TopicsPage.avatar.isClickable()));
    await TopicsPage.avatar.click();

    await driver.waitUntil(async () => (ProfilePage.getSignOutElement.isClickable()));
    await ProfilePage.getSignOutElement.click();

  });

  it('verifyLibertarianPartyPoliticiansPageLoads', async () => {

    await ReadyPage.login();
    await ReadyPage.load();
    await driver.pause(waitTime);
    await driver.waitUntil(async () => (ReadyPage.getShowMoreLinkElement.isClickable()));
    await ReadyPage.getShowMoreLinkElement.click();
    await driver.waitUntil(async () => (ReadyPage.getLibertarianPartyPoliticiansLinkElement.isClickable()));
    await ReadyPage.getLibertarianPartyPoliticiansLinkElement.click();
    await driver.waitUntil(async () => {
      // Add condition to check for the expected URL
      const currentUrl = await driver.getUrl();
      console.log(currentUrl);
      return currentUrl.includes('libertarian_party_politicians');
    }, {
      timeout: 10000,
      timeoutMsg: 'Expected URL to contain "libertarian_party_politicians" not found, timeout after 10000ms',
    });
    await driver.switchWindow('Libertarian Party Politicians - WeVote');
    await driver.pause(waitTime);
    await expect(driver).toHaveTitle(expect.stringContaining('Libertarian Party Politicians - WeVote'));
    // Checking Follow and Unfollow buttons
    const circleIcon = await (TopicsPage.getLibertarianPartyPoliticiansCircleIconElement).isExisting();
    if (!circleIcon) {
      await driver.waitUntil(async () => (TopicsPage.getLibertarianPartyPoliticiansFollowElement.isClickable()));
      await TopicsPage.getLibertarianPartyPoliticiansFollowElement.click();
    }
    await driver.waitUntil(async () => (TopicsPage.getLibertarianPartyPoliticiansDropdownButtonElement.isClickable()));
    await TopicsPage.getLibertarianPartyPoliticiansDropdownButtonElement.click();
    await driver.waitUntil(async () => (TopicsPage.getLibertarianPartyPoliticiansUnfollowElement.isClickable()));
    await TopicsPage.getLibertarianPartyPoliticiansUnfollowElement.click();
    // verify follow button appears
    await expect(TopicsPage.getLibertarianPartyPoliticiansFollowElement).toBeDisplayed();

    await driver.waitUntil(async () => (TopicsPage.avatar.isClickable()));
    await TopicsPage.avatar.click();

    await driver.waitUntil(async () => (ProfilePage.getSignOutElement.isClickable()));
    await ProfilePage.getSignOutElement.click();

  });

  it('verifyIndependentPoliticiansPageLoads', async () => {

    await ReadyPage.login();
    await ReadyPage.load();
    await driver.pause(waitTime);
    await driver.waitUntil(async () => (ReadyPage.getShowMoreLinkElement.isClickable()));
    await ReadyPage.getShowMoreLinkElement.click();
    await driver.waitUntil(async () => (ReadyPage.getIndependentPoliticiansLinkElement.isClickable()));
    await ReadyPage.getIndependentPoliticiansLinkElement.click();
    await driver.waitUntil(async () => {
      // Add condition to check for the expected URL
      const currentUrl = await driver.getUrl();
      console.log(currentUrl);
      return currentUrl.includes('independent_politicians');
    }, {
      timeout: 10000,
      timeoutMsg: 'Expected URL to contain "independent_politicians" not found, timeout after 10000ms',
    });
    await driver.switchWindow('Independent Politicians - WeVote');
    await driver.pause(waitTime);
    await expect(driver).toHaveTitle(expect.stringContaining('Independent Politicians - WeVote'));
    // Checking Follow and Unfollow buttons
    const circleIcon = await (TopicsPage.getIndependentPoliticiansCircleIconElement).isExisting();
    if (!circleIcon) {
      await driver.waitUntil(async () => (TopicsPage.getIndependentPoliticiansFollowElement.isClickable()));
      await TopicsPage.getIndependentPoliticiansFollowElement.click();
    }
    await driver.waitUntil(async () => (TopicsPage.getIndependentPoliticiansDropdownButtonElement.isClickable()));
    await TopicsPage.getIndependentPoliticiansDropdownButtonElement.click();
    await driver.waitUntil(async () => (TopicsPage.getIndependentPoliticiansUnfollowElement.isClickable()));
    await TopicsPage.getIndependentPoliticiansUnfollowElement.click();
    // verify follow button appears
    await expect(TopicsPage.getIndependentPoliticiansFollowElement).toBeDisplayed();

    await driver.waitUntil(async () => (TopicsPage.avatar.isClickable()));
    await TopicsPage.avatar.click();

    await driver.waitUntil(async () => (ProfilePage.getSignOutElement.isClickable()));
    await ProfilePage.getSignOutElement.click();

  });

  it('verifyProSchoolChoicePageLoads', async () => {

    await ReadyPage.login();
    await ReadyPage.load();
    await driver.pause(waitTime);
    await driver.waitUntil(async () => (ReadyPage.getShowMoreLinkElement.isClickable()));
    await ReadyPage.getShowMoreLinkElement.click();
    await driver.waitUntil(async () => (ReadyPage.getProSchoolChoiceLinkElement.isClickable()));
    await ReadyPage.getProSchoolChoiceLinkElement.click();
    await driver.waitUntil(async () => {
      // Add condition to check for the expected URL
      const currentUrl = await driver.getUrl();
      console.log(currentUrl);
      return currentUrl.includes('pro_school_choice');
    }, {
      timeout: 10000,
      timeoutMsg: 'Expected URL to contain "pro_school_choice" not found, timeout after 10000ms',
    });
    await driver.switchWindow('Pro School Choice - WeVote');
    await driver.pause(waitTime);
    await expect(driver).toHaveTitle(expect.stringContaining('Pro School Choice - WeVote'));
    // Checking Follow and Unfollow buttons
    const circleIcon = await (TopicsPage.getProSchoolChoiceCircleIconElement).isExisting();
    if (!circleIcon) {
      await driver.waitUntil(async () => (TopicsPage.getProSchoolChoiceFollowElement.isClickable()));
      await TopicsPage.getProSchoolChoiceFollowElement.click();
    }
    await driver.waitUntil(async () => (TopicsPage.getProSchoolChoiceDropdownButtonElement.isClickable()));
    await TopicsPage.getProSchoolChoiceDropdownButtonElement.click();
    await driver.waitUntil(async () => (TopicsPage.getProSchoolChoiceUnfollowElement.isClickable()));
    await TopicsPage.getProSchoolChoiceUnfollowElement.click();
    // verify follow button appears
    await expect(TopicsPage.getProSchoolChoiceFollowElement).toBeDisplayed();

    await driver.waitUntil(async () => (TopicsPage.avatar.isClickable()));
    await TopicsPage.avatar.click();

    await driver.waitUntil(async () => (ProfilePage.getSignOutElement.isClickable()));
    await ProfilePage.getSignOutElement.click();

  });

  it('verifyMakeAmericaGreatAgainPageLoads', async () => {

    await ReadyPage.login();
    await ReadyPage.load();
    await driver.pause(waitTime);
    await driver.waitUntil(async () => (ReadyPage.getShowMoreLinkElement.isClickable()));
    await ReadyPage.getShowMoreLinkElement.click();
    await driver.waitUntil(async () => (ReadyPage.getMakeAmericaGreatAgainLinkElement.isClickable()));
    await ReadyPage.getMakeAmericaGreatAgainLinkElement.click();
    await driver.waitUntil(async () => {
      // Add condition to check for the expected URL
      const currentUrl = await driver.getUrl();
      console.log(currentUrl);
      return currentUrl.includes('make_america_great_again_(maga)');
    }, {
      timeout: 10000,
      timeoutMsg: 'Expected URL to contain "make_america_great_again_(maga)" not found, timeout after 10000ms',
    });
    await driver.switchWindow('Make America Great Again (MAGA) - WeVote');
    await driver.pause(waitTime);
    await expect(driver).toHaveTitle(expect.stringContaining('Make America Great Again (MAGA) - WeVote'));
    // Checking Follow and Unfollow buttons
    const circleIcon = await (TopicsPage.getMakeAmericaGreatAgainCircleIconElement).isExisting();
    if (!circleIcon) {
      await driver.waitUntil(async () => (TopicsPage.getMakeAmericaGreatAgainFollowElement.isClickable()));
      await TopicsPage.getMakeAmericaGreatAgainFollowElement.click();
    }
    await driver.waitUntil(async () => (TopicsPage.getMakeAmericaGreatAgainDropdownButtonElement.isClickable()));
    await TopicsPage.getMakeAmericaGreatAgainDropdownButtonElement.click();
    await driver.waitUntil(async () => (TopicsPage.getMakeAmericaGreatAgainUnfollowElement.isClickable()));
    await TopicsPage.getMakeAmericaGreatAgainUnfollowElement.click();
    // verify follow button appears
    await expect(TopicsPage.getMakeAmericaGreatAgainFollowElement).toBeDisplayed();

    await driver.waitUntil(async () => (TopicsPage.avatar.isClickable()));
    await TopicsPage.avatar.click();

    await driver.waitUntil(async () => (ProfilePage.getSignOutElement.isClickable()));
    await ProfilePage.getSignOutElement.click();

  });

  //Topics_037
  it('verifyFilterButtonsinProChoice', async () => {
    await ReadyPage.load();
    await driver.pause(waitTime);
    await driver.waitUntil(async () => (ReadyPage.getProChoiceLinkElement.isClickable()));
    await ReadyPage.getProChoiceLinkElement.click();
    await driver.waitUntil(async () => (TopicsPage.forThisElectionFilter.isClickable()));
    await driver.waitUntil(async () => (TopicsPage.forAllEndorsersFilter.isClickable()));
    await driver.refresh()
    await driver.waitUntil(async () => (TopicsPage.forThisElectionFilter.isClickable()));
    await TopicsPage.forThisElectionFilter.click();
    await driver.waitUntil(async () => (TopicsPage.forAllEndorsersFilter.isClickable()));
    await TopicsPage.forAllEndorsersFilter.click();

  });

});
