import { $, $$, expect, driver, browser } from '@wdio/globals';
import PageBrowser from './page.browser';


class ReadyCordova extends PageBrowser {
    constructor() {
        super().title = 'Ready to Vote? - WeVote';
    }

    // Use a getter to return the platform-specific locator
    get wevoteLogo() {
        const locator = browser.isAndroid
            ? 'android=new UiSelector().resourceId("HeaderLogoImage")'
            : '~HeaderLogoImage'; // Assuming an accessibility ID is used for iOS
        return $(locator);
    }

    get viewUpcomingBallotButton() {
        const locator = browser.isAndroid
            ? 'android=new UiSelector().resourceId("viewUpcomingBallotButton")'
            : '(//XCUIElementTypeButton[@name="View Your Ballot"])[1]';
        return $(locator);
    }

    get headerFollowPopularTopics() {
        const locator = browser.isAndroid
            ? 'android=new UiSelector().resourceId("PopularTopicsHeader")'
            : '//XCUIElementTypeStaticText[@name="Follow Popular Topics"]';
        return $(locator);
    }

    get ballotButton() {
        const locator = browser.isAndroid
            ? 'android=new UiSelector().resourceId("ballotButton")' // Assumed resourceId
            : '-ios class chain:**/XCUIElementTypeButton[`name == "Ballot"`]';
        return $(locator);
    }

    get ballotShareButton() {
        const locator = browser.isAndroid
            ? 'android=new UiSelector().resourceId("shareButtonFooter")'
            : '-ios predicate string:name == "Share"';
        return $(locator);
    }

    get ballotAddress() {
        const locator = browser.isAndroid
            ? 'android=new UiSelector().resourceId("ballotTitleBallotAddress")'
            : '-ios predicate string:name BEGINSWITH "Ballot for "';
        return $(locator);
    }

    get ballotAddressInput() {
        const locator = browser.isAndroid
            ? 'android=new UiSelector().resourceId("entryBox")'
            : '~Address';
        return $(locator);
    }

    get saveBallotAddressButton() {
        const locator = browser.isAndroid
            ? 'android=new UiSelector().resourceId("addressBoxModalSaveButton")'
            : '~Save';
        return $(locator);
    }

    get followIssueButtons() {
        const locator = browser.isAndroid
            ? 'android=new UiSelector().resourceIdMatches(".*issueFollowButton-wv02issue.*")'
            : '//XCUIElementTypeButton[@name="Follow"]';
        return $$(locator);
    }

    get followFirstIssue() {
        const locator = browser.isAndroid
            ? 'android=new UiSelector().resourceId("issueFollowButton-wv02issue63-pro-choice")'
            : '-ios predicate string:name == "Follow" AND visible == 1';
        return $(locator);
    }

    get toggleFollowDropdown() {
        const locator = browser.isAndroid
            ? 'android=new UiSelector().resourceIdMatches("toggleFollowMenuButton-wv02issue.*")'
            : '~Toggle Dropdown';
        return $(locator);
    }

    get unfollowIssueButton() {
        const locator = browser.isAndroid
            ? 'android=new UiSelector().resourceIdMatches("issueUnfollowButton-wv02issue.*")'
            : '~Unfollow';
        return $(locator);
    }

    get popularTopicsShowMoreButton() {
        const locator = browser.isAndroid
            ? '#toggleContentButton-showMoreReadyPageValuesList'
            : '-ios class chain:**/XCUIElementTypeButton[`name == "show more"`][1]';
        return $(locator);
    }

    async updateBallotAddress(ballotadd) {
        await this.ballotAddress.click();
        await this.ballotAddressInput.setValue(ballotadd);
        await this.saveBallotAddressButton.click();
    }
}

export default new ReadyCordova();
