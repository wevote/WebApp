import { $, $$, driver, expect, browser } from '@wdio/globals';
import ReadyCordovaPage from '../page_objects/ready.cordova';
//import ReadyPage from '../page_objects/ready.page';
//import ReadyCordovaPage from 'tests/browserstack_automation/page_objects/ready.cordova.js';

const waitTime = 8000;
/* eslint-disable no-undef */
describe('ReadyPage', function () {
    this.timeout(9999999);

    // Ready_001 and Ready_003
    it('Ready_001 and Ready_003: verifyElectionCountDownRedirect and verifyViewYourBallotRedirect', async () => {
        console.log('Tcs : Ready_001 and Ready_003 : verifyElectionCountDownRedirect and verifyViewYourBallotRedirect');
        // No platform-specific logic is needed here; the page object handles it.
        await ReadyCordovaPage.wevoteLogo.click();
        await ReadyCordovaPage.headerFollowPopularTopics.isDisplayed();
        await ReadyCordovaPage.viewUpcomingBallotButton.click();
        await driver.pause(waitTime);
        await expect(ReadyCordovaPage.ballotShareButton).toBeDisplayed();
        const ballotShareButton = await ReadyCordovaPage.ballotShareButton;
        const name = await ballotShareButton.getAttribute('name');
        console.log('Element name:', name);
        expect(name).toBe('Share');
    });

    // Ready_002
    it('Ready_002 : updateBallotAddress', async () => {
        console.log('Tcs : Ready_002 : updateBallotAddress');
        // The page object handles platform differences for this action.
        const baladd = await ReadyCordovaPage.ballotAddress.getText();
        console.log(`baladd:${baladd}`);
        await browser.pause(waitTime + 10000);
        await ReadyCordovaPage.updateBallotAddress('New York, NY, USA');
        await browser.pause(waitTime);
        await ReadyCordovaPage.wevoteLogo.click();
        await browser.pause(waitTime);
        const updatedBalAdd = await ReadyCordovaPage.ballotAddress.getText();
        console.log(`updated address:${updatedBalAdd}`);
        expect(updatedBalAdd).toContain('New York, NY, USA');
    });

    // Ready_004
    it('Ready_004: toggleIssueFollowing - Follow/UnfollowPopular Topics', async () => {
        console.log('Tcs : Ready_004 : toggleIssueFollowing - Follow/UnfollowPopular Topics ');
        // Scroll logic is platform-dependent
        if (browser.isAndroid) {
            await $('android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().text("Follow Popular Topics"))');
        }
        await ReadyCordovaPage.followFirstIssue.click();
        await driver.pause(waitTime);
        await expect(ReadyCordovaPage.toggleFollowDropdown).toExist();
        await ReadyCordovaPage.toggleFollowDropdown.click();
        await driver.pause(waitTime);
        await ReadyCordovaPage.unfollowIssueButton.click();
        await expect(ReadyCordovaPage.followFirstIssue).toExist();
    });

    // Ready_005
    it('Ready_005: unfurlIssues - PopularIssues/ShowMoreIssues', async () => {
        console.log('Tcs : Ready_005 : unfurlIssues - PopularIssues/ShowMoreIssues');

        // Dynamically handle scrolling and initial count based on platform
        let initialButtonsCount;
        if (browser.isAndroid) {
            await $('android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().text("Follow Popular Topics"))');
            initialButtonsCount = 6;
        } else { // iOS
            initialButtonsCount = 6; // Or whatever the initial count is for iOS
        }

        const initialButtons = await ReadyCordovaPage.followIssueButtons;
        await expect(initialButtons).toBeElementsArrayOfSize(initialButtonsCount);

        let showMoreFound = false;
        while (!showMoreFound) {
            const showMoreBtn = await ReadyCordovaPage.popularTopicsShowMoreButton;
            if (await showMoreBtn.isExisting()) {
                await showMoreBtn.click();
                showMoreFound = true;
                console.log("✅ Clicked 'Show More' button.");
                await browser.pause(waitTime);
                if (browser.isAndroid) {
                    await $('android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().text("Follow Popular Topics"))');
                }
            } else {
                // Handle scrolling for both platforms if button is not in view
                try {
                    if (browser.isAndroid) {
                        await $('android=new UiScrollable(new UiSelector().scrollable(true)).scrollForward()');
                    } else { // iOS
                        // For iOS, you might need a different scroll method if the button isn't immediately visible.
                        // A simple swipe up could work, but a more reliable method depends on the UI structure.
                        // We will rely on the page object to find it in this case.
                    }
                    await browser.pause(800);
                } catch (e) {
                    console.error('❌ Reached end of scroll but did not find "Show More" button.');
                    break;
                }
            }
        }

        await driver.pause(waitTime);
        const buttonsAfter = await ReadyCordovaPage.followIssueButtons;
        console.log('total popular topics after clicking show more button:' + buttonsAfter.length);
        await expect(buttonsAfter).toBeElementsArrayOfSize({ gte: initialButtonsCount });
    });
});
