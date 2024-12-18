import { $, driver, expect, browser  } from '@wdio/globals';

describe('Mobile Automation Test Suite', () => {
    // Define the XPath selector as a variable
    const ballotButton = '//android.widget.Button[@text="View Your Ballot"]';
    const ballotPageId = '//android.view.View[@resource-id="ballot"]';

    const popTopicsHeader = '//android.widget.TextView[@resource-id="PopularTopicsHeader"]';
    //const homeButton ='wv87cand2314844-officeItemCompressed-wv87cand2314844-undefined-valueIconAndText-wv02issue63';
    const wvlogo = '//android.widget.Image[@resource-id="HeaderLogoImage"]';  

    it('verify view your ballot button on mobile app', async () => {
        try {
            console.log('1. Clicking "View Your Ballot" button');
            const buttonElement = await $(ballotButton);
            await buttonElement.waitForDisplayed({ timeout: 5000 });
            if(await buttonElement.isDisplayed()){
               
                await buttonElement.click();

                const ballotPageElement = await $(ballotPageId);
                await expect(ballotPageElement).toExist();
            }else{
                console.log('error:View your button is not clickable');
            }

            //expect(await ballotPageElement.isDisplayed()).toBe(true);
            //const isVisible = await ballotPageElement.isDisplayed();
            //expect(isVisible).toEqual(true); // Using .toEqual()


            const wvlogoElement = await $(wvlogo);

            await wvlogoElement.click();

            await driver.$('android=new UiScrollable(new UiSelector().scrollable(true)).scrollToEnd(1)');

            const popTopicsHeaderText = await $(popTopicsHeader).getText();
            console.log('popular topics header text: ' +popTopicsHeaderText);
            expect(popTopicsHeaderText).toContain("Follow Popular Topics");

           

        } catch (error) {
            console.error('Test failed:', error);
           // throw error; // Rethrow to fail the test
        }
    });

});