import { browser, driver, expect } from '@wdio/globals';
import { Key } from 'webdriverio';
import { isWebTarget } from 'webpack-dev-server';
const os = require('os');
import ReadyPage from '../page_objects/ready.page';
import SignIn from '../page_objects/signin.page';
const { describe, it } = require('mocha');

const waitTime = 5000;

beforeEach(async () => {
    await ReadyPage.load();;
    //await driver.pause(waitTime);
    await driver.maximizeWindow();
    await (await SignIn.signInLinkElement).click();
});


const testEmails = [
    //`${SignIn.randomString(1)}@w.us`,  //cannot test with invalid 5 letters email because @w.us itself counted as 5 letters 
    `${SignIn.randomString(1)}@w.us`,//generates valid 6 letters email
    `${SignIn.randomString(244)}@wevote.us`,//generates valid 254 letters email
    `${SignIn.randomString(245)}@wevote.us`  //generates invalid 255 letters email
];


describe('SignIn', () => {

    // SignIn_001
    it('verifySignInPage', async () => {
        await expect(await SignIn.signInElement).toHaveText('Sign In or Join');
    });


    // SignIn_002 and SignIn_007 and SignIn_008
    it('verifySpellingsOfAllElementsOnSignInPage', async () => {
        const TwitterText = "Sign in with Twitter";
        const AppleText = "Sign in with Apple";
        await expect(SignIn.signInWithTwitterTextElement).toHaveText(TwitterText);
        await expect(SignIn.signInWithAppleTextElement).toHaveText(AppleText);
        await expect(SignIn.phoneNumberLabelElement).toHaveText("Mobile Phone Number");
        await expect(SignIn.emailLabelElement).toHaveText("Email");
        await expect(await SignIn.phoneNumberFieldElement).toBeDisplayed();
        await expect(await SignIn.phoneNumberFieldElement.getAttribute('placeholder')).toBe("Type phone number here...");
        await expect(await SignIn.emailFieldElement).toBeDisplayed();
        await expect(await SignIn.emailFieldElement.getAttribute('placeholder')).toBe("Type email here...");


    });

    // SignIn_003
    it('verifyAllIconsOnSignInPage', async () => {

        const iconsVisibility = await SignIn.getIcons();
        for (const iconVisible of iconsVisibility) {
            await expect(iconVisible).toBe(true);
        }


    });

    //SignIn_004
    it('verifyAllButtonsAndFieldsAlignedAndPresent', async () => {

        await expect(SignIn.phoneNumberFieldElement).toBePresent();
        await expect(SignIn.emailFieldElement).toBePresent();

        await expect(SignIn.twitterBttnElement).toBePresent();

        await expect(SignIn.appleBttnElement).toBePresent();


        await expect(await (await SignIn.twitterBttnElement.getCSSProperty('display')).value).toBe('inline-flex');

        await expect(await (await SignIn.phoneNumberFieldElement.getCSSProperty('display')).value).toBe('block');

        await expect(await (await SignIn.emailFieldElement.getCSSProperty('display')).value).toBe('block');

        await (await SignIn.phoneNumberFieldElement).click();
        await expect(await (await SignIn.cancelPhoneBttnElement.getCSSProperty('display')).value).toBe('inline-flex');
        await expect(await SignIn.cancelPhoneBttnElement).toBePresent();

        await expect(await (await SignIn.sendVerificationPhoneBttnElement.getCSSProperty('display')).value).toBe('inline-flex');
        await expect(SignIn.sendVerificationPhoneBttnElement).toBeDisabled();;


    });
    //SignIn_005 and SignIn_006

    it('validateSendVerificationBttn', async () => {
        const randomNumber = `4089${Math.floor(100000 + Math.random() * 900000)}`;

        const randomEmail = `user${Date.now()}@email.com`;
       
        await SignIn.phoneNumberFieldElement.click();
        await expect(SignIn.sendVerificationPhoneBttnElement).not.toBeEnabled();

        await SignIn.phoneNumberFieldElement.addValue(randomNumber);
        await expect(SignIn.sendVerificationPhoneBttnElement).toBeEnabled();
        await SignIn.emailFieldElement.click();
        await expect (SignIn.sendVerificationEmailBttnElement).not.toBeEnabled();

        await SignIn.emailFieldElement.addValue(randomEmail);
        await expect(SignIn.sendVerificationEmailBttnElement).toBeEnabled();

    });

    //SignIn_009
    it('verifyColorForContents', async () => {

        const twitterbackgroundColor = await (SignIn.twitterBttnElement).getCSSProperty('background-color');
        const applebackgroundColor = await (SignIn.appleBttnElement).getCSSProperty('background-color');
        const twitterTextColor = await (SignIn.signInWithTwitterTextElement).getCSSProperty('color');
        const appleTextColor = await (SignIn.signInWithAppleTextElement).getCSSProperty('color');
        // Convert 'rgba' to 'rgb' by removing the alpha value if present
        await expect(await twitterbackgroundColor.value.replace('rgba', 'rgb').replace(/,\s*1\)$/, ')')).toBe('rgb(85,172,238)');

        await expect(await applebackgroundColor.value.replace('rgba', 'rgb').replace(/,\s*1\)$/, ')')).toBe('rgb(0,0,0)');

        await expect(await twitterTextColor.value.replace('rgba', 'rgb').replace(/,\s*1\)$/, ')')).toBe('rgb(255,255,255)');
        await expect(await appleTextColor.value.replace('rgba', 'rgb').replace(/,\s*1\)$/, ')')).toBe('rgb(255,255,255)');

    });


    //SignIn_010
    it('verifyTwitterSignInLinkResponsiveness', async () => {


        await SignIn.twitterBttnElement.waitForClickable();
        await SignIn.twitterBttnElement.click();
        await driver.waitUntil(async () => {
            return await driver.getTitle() === 'X / Authorize an application'
        }, {
            timeout: 5000,
        });



    });
    //SignIn_013 and SignIn_014
    it('verifyAppleSignInLinkResponsiveness', async () => {
        await SignIn.appleBttnElement.waitForClickable();
        await SignIn.appleBttnElement.click();
        await driver.waitUntil(async () => { return await driver.getTitle() === 'Sign in to Apple Account' }, {
            timeout: 5000,
        });
        await driver.back();
        await expect(await SignIn.signInElement).toHaveText('Sign In or Join');

    });


    //SignIn_15 and //SignIn_16
    it('verifyVisiblityOfPhoneAndEmailCancelAndSendBttn', async () => {
        
        await SignIn.phoneNumberFieldElement.click();
        await expect(SignIn.cancelPhoneBttnElement).toBeDisplayed();
        await expect(SignIn.sendVerificationPhoneBttnElement).toBeDisplayed();
        await SignIn.emailFieldElement.click();
        await expect(SignIn.cancelEmailBttnElement).toBeDisplayed();
        await expect(SignIn.sendVerificationEmailBttnElement).toBeDisplayed();


    });


    //SignIn_017 and //SignIn_018 and //SignIn_019 and //SignIn_020 and //SignIn_021 and//SignIn_022

    it('verifyTabKeyFunctionality', async () => {
        await driver.keys('Tab');
        //  await browser.keys('Tab');//first press tab
        await expect(await SignIn.closeBttnElement).toBeFocused();
        await driver.keys('Tab', 'Tab');
        await expect(await SignIn.twitterBttnElement).toBeFocused();
        await driver.keys('Tab', 'Tab', 'Tab');
        await expect(await SignIn.appleBttnElement).toBeFocused();
        await driver.keys('Tab', 'Tab', 'Tab', 'Tab');
        await expect(await SignIn.phoneNumberFieldElement).toBeFocused();
    });


    //SignIn_026
    it('verifyEmailFieldPasteFunctionalityUsingKeyboard', async () => {
       
        const testdata = 'wevote@wevote.us';
        const valueLength = testdata.length;

        const selector = await SignIn.emailFieldElement;
        await SignIn.emailFieldElement.setValue(testdata);
        await driver.pause(5000);
       
        const platformName = browser.capabilities.platformName; // Gets the platform like 'Windows', 'macOS'
        const browserName = browser.capabilities.browserName;
        console.log(`Platform: ${platformName}`);
        console.log(`Browser: ${browserName}`);
        if (platformName === 'Windows XP' && browserName === 'chrome') {

            await browser.keys([Key.Control, 'a']);
            //await browser.keys('NULL');            // Releases the Ctrl key
            await browser.keys([Key.Control, 'c']);
            //await browser.keys('NULL');   
            //for (let i = 0; i < valueLength; i++) {         // Releases the Ctrl key
            await browser.keys(Key.Backspace);
            await SignIn.emailFieldElement.click();
            await browser.keys([Key.Control, 'v']);
        }

        if (platformName === 'mac' && browserName === 'Safari') {   //For macOS, the correct value for process.platform is "darwin"
            await browser.keys([Key.Command, 'a']);
            await browser.keys([Key.Command, 'c']);

            await browser.keys(Key.Backspace);
            await driver.keys([Key.Command, 'v']);

        }

        const value = await SignIn.emailFieldElement.getValue();
        await expect(value).toBe(testdata);


    });
    // //SignIn_028  
    it('verifyEmailFieldWithValidAddress', async () => {
        const testData = 'wevote@wevote.us';
        await SignIn.emailFieldElement.click();
        await SignIn.emailFieldElement.addValue(testData);
        await SignIn.sendVerificationEmailBttnElement.click();
        const textData = await SignIn.codeVerifyElement.getText();
        await expect(textData).toBe('Code Verification');


    });

    //SignIn_029 //SignIn_030
    it('verifyEmailFieldWithInvalidAddress', async () => {
        const testDataNumber = '11111';
        const testDataUrl = 'wevotewevote.us';
        await SignIn.emailFieldElement.click();
        await SignIn.emailFieldElement.addValue(testDataNumber);
        const isClickableNumber = await (await SignIn.sendVerificationEmailBttnElement).isClickable();
        await expect(isClickableNumber).toBe(false);
        await  SignIn.emailFieldElement.setValue(testDataUrl);
        const isClickableURL = await (await SignIn.sendVerificationEmailBttnElement).isClickable();
        await expect(isClickableURL).toBe(false);


    });


    //SignIn_031 
    it("verifyEmailFieldAcceptsOnlyLatinLetters", async () => {

        const withLatinLettersOnly = `${SignIn.randomString(6)}@wevote.us`;
        await SignIn.emailFieldElement.setValue(withLatinLettersOnly);
        const emailValue = await SignIn.emailFieldElement.getValue();
        console.log('email value ', emailValue);
        await expect(emailValue).toMatch(/^[a-zA-Z]+@wevote\.us$/);
        let isDisplayed = await  SignIn.sendVerificationEmailBttnElement.isClickable();
        await expect(isDisplayed).toBe(true);

        //await SignIn.emailFieldElement.setValue(''); // Clear using setValue
       // await driver.pause(waitTime); // Pause to ensure value is cleared


    });
    //SignIn_033

    it("verifyEmailFieldAcceptsLettersWithNum", async () => {
        const lettersWithNumOnly = `${SignIn.randomString(6, true)}@wevote.us`;//const lettersWithNumOnly=`${SignIn.randomString(6,true,false,false,false)}
        // or only need to use the parameters that are relevant for the string you want to generate. If you want a random string that includes numbers but excludes decimals, underscores, and dashes, you can simply call:  const lettersWithNumOnly=`${SignIn.randomString(6,true)}`;
        await (await SignIn.emailFieldElement).setValue(lettersWithNumOnly);
        const valueWithNum = await (await SignIn.emailFieldElement).getValue();
        console.log('email value ', valueWithNum);
        await expect(valueWithNum).toMatch(/^[a-zA-Z0-9]+@wevote\.us$/);
        let isDisplayed = await (await SignIn.sendVerificationEmailBttnElement).isClickable();
        await expect(isDisplayed).toBe(true);
       
    });
    //SignIn_034
    it("verifyEmailFieldAcceptsLettersWithDecimal", async () => {
        const lettersWithDecimalOnly = `${SignIn.randomString(2)}.${SignIn.randomString(2)}@wevote.us`;
        await (await SignIn.emailFieldElement).setValue(lettersWithDecimalOnly);
        const valueWithDec = await (await SignIn.emailFieldElement).getValue();
        console.log('email value ', valueWithDec);
        await expect(valueWithDec).toMatch(/^[a-zA-Z.]*\.[a-zA-Z.]*@wevote\.us$/);
        let isDisplayed = await (await SignIn.sendVerificationEmailBttnElement).isClickable();

        await expect(isDisplayed).toBe(true);
    });
    //SignIn_035
    it("verifyEmailFieldAcceptsLettersWithUnderscore", async () => {
        const lettersWithUnderscore = `${SignIn.randomString(2)}_${SignIn.randomString(2)}@wevote.us`;
        await (await SignIn.emailFieldElement).setValue(lettersWithUnderscore);
        const valueWithUnderscore = await (await SignIn.emailFieldElement).getValue();
        console.log('email value ', valueWithUnderscore);
        await expect(valueWithUnderscore).toMatch(/^[a-zA-Z]*\_[a-zA-Z]*@wevote\.us$/);
        let isDisplayed = await (await SignIn.sendVerificationEmailBttnElement).isClickable();
        await expect(isDisplayed).toBe(true);
    });
    //     //SignIn_036
    it("verifyEmailFieldAcceptsLettersWithDash", async () => {
        const lettersWithDash = `${SignIn.randomString(3)}-${SignIn.randomString(3)}@wevote.us`;
        await (await SignIn.emailFieldElement).setValue(lettersWithDash);
        const valueWithDash = await (await SignIn.emailFieldElement).getValue();
        console.log('email value ', valueWithDash);
        await expect(valueWithDash).toMatch(/^[a-zA-Z]*\-[a-zA-Z]*@wevote\.us$/);
        let isDisplayed = await (await SignIn.sendVerificationEmailBttnElement).isClickable();
        await expect(isDisplayed).toBe(true);
    });
    //     //SignIn_037
    it("verifyEmailFieldDoesntAcceptStartWithDot", async () => {
        const lettersStartWithDot = `.${SignIn.randomString(4)}@wevote.us`;
        await (await SignIn.emailFieldElement).setValue(lettersStartWithDot);
        const valueStarWithDot = await (await SignIn.emailFieldElement).getValue();
        console.log('email value ', valueStarWithDot);
        await expect(valueStarWithDot).toMatch(/^\.[a-zA-Z]*@wevote\.us$/);
        let isDisplayed = await (await SignIn.sendVerificationEmailBttnElement).isEnabled();
        await expect(isDisplayed).toBe(false);
    });
    //     //SignIn_040
    it("verifyEmailFieldDoesntAcceptStartWithDomain", async () => {
        const lettersStartWithDomain = `@wevote.us`;
        await (await SignIn.emailFieldElement).setValue(lettersStartWithDomain);
        const valueStarWithDomain = await (await SignIn.emailFieldElement).getValue();
        console.log('email value ', valueStarWithDomain);
        await expect(valueStarWithDomain).toMatch(/^@wevote\.us$/);
        let isDisplayed = await (await SignIn.sendVerificationEmailBttnElement).isEnabled();
        await expect(isDisplayed).toBe(false);

    });

    //SignIn_042  //This code works only in Running in Safari only so commented out
    // it("verifyEmailFieldDoesntAcceptSpaces", async () => {
     

    //     const browserName = browser.capabilities.browserName;
    //     console.log(`Platform: ${platformName}`);
    //     console.log(`Browser: ${browserName}`);

    //     await (await SignIn.emailFieldElement).click();
    //     await (await SignIn.emailFieldElement).addValue(`${SignIn.randomString(2)}`);
    //     await (await SignIn.emailFieldElement).addValue(' ');
    //     await (await SignIn.emailFieldElement).addValue(`${SignIn.randomString(2)}@wevote.us`);
    //     const valueWithSpace = await (await SignIn.emailFieldElement).getValue();
    //     console.log('email value ', valueWithSpace);
    //     await expect(valueWithSpace).toMatch(/^[a-zA-Z]* [a-zA-Z]*@wevote\.us$/);
    //     let isDisplayed = await (await SignIn.sendVerificationEmailBttnElement).isEnabled();
    //     await expect(isDisplayed).toBe(false);

    // });
    //SignIn_045
    it("verifyEmailFieldWithBlank", async () => {

        await (await SignIn.emailFieldElement).setValue(' ');
        const valueWithBlank = await (await SignIn.emailFieldElement).getValue();
        console.log('email value ', valueWithBlank);
        await expect(valueWithBlank).toMatch(/^$/); // Validating that the value is empty
        let isDisplayed = await (await SignIn.sendVerificationEmailBttnElement).isEnabled();
        await expect(isDisplayed).toBe(false);

    });
    //     //SignIn_046
    it("verifyEmailFieldAcceptsLettersWithTwoDots", async () => {
        const lettersWithDoubleDots = `${SignIn.randomString(2)}.${SignIn.randomString(1)}.${SignIn.randomString(2)}@wevote.us`;
        await (await SignIn.emailFieldElement).setValue(lettersWithDoubleDots);
        const valueWithTwoDots = await (await SignIn.emailFieldElement).getValue();
        console.log('email value ', valueWithTwoDots);
        await expect(valueWithTwoDots).toMatch(/^[a-zA-Z]*\.[a-zA-Z]*\.[a-zA-Z]*@wevote\.us$/);
        let isDisplayed = await (await SignIn.sendVerificationEmailBttnElement).isEnabled();
        await expect(isDisplayed).toBe(true);
    });

    //SignIn_047
    for (let email of testEmails) {
        it('verifyEmailFieldAcceptsCharactersBetween6to254', async () => {


            console.log(`Testing email: ${email}`);
            console.log('email length:', email.length);

            await (await SignIn.emailFieldElement).setValue(email);
            const emailValue = await (await SignIn.emailFieldElement).getValue();
            //console.log('email value ',emailValue);
            const len = emailValue.length;
            if (len >= 6 && len <= 254) {
                await expect(await SignIn.cancelEmailBttnElement).toBeDisplayed();

                await expect(await SignIn.sendVerificationEmailBttnElement).toBeEnabled();
            } else {

                await expect(await SignIn.cancelEmailBttnElement).toBeDisplayed();

                await expect(await SignIn.sendVerificationEmailBttnElement).not.toBeEnabled();

            }

        });
    }
    //     //SignIn_052
    it('verifyBackButtonOnVerificationPage', async () => {
        const lettersWithDoubleDots = `${SignIn.randomString(2)}.${SignIn.randomString(5)}@wevote.us`;
        await (await SignIn.emailFieldElement).setValue(lettersWithDoubleDots);

        await (await SignIn.sendVerificationEmailBttnElement).click();
        await driver.waitUntil(async () => {
            return await (await SignIn.codeVerifyElement).getText() === 'Code Verification'
        }, {
            timeout: 5000,
        });
        await (await SignIn.backButtonElement).click();
        await expect(await SignIn.sendVeificationAgainElement).toBeDisplayed();

    });

    //     //SignIn_054
    it('verifyCancelButtonClearEmailField', async () => {
        const email = `${SignIn.randomString(5)}@wevote.us`;
        await (await SignIn.emailFieldElement).setValue(email);

        await (await SignIn.cancelEmailBttnElement).click();
        const fieldvalue = await (await SignIn.emailFieldElement).getValue();
        await expect(fieldvalue).toBe('');
        await expect(await SignIn.cancelEmailBttnElement).not.toBeDisplayed();
        await expect(await SignIn.sendVerificationEmailBttnElement).not.toBeDisplayed();

        //***********Both assertion works same way*************************
        //await expect(fieldvalue).toHaveLength(0);
        //await expect(fieldvalue).toEqual('');
        //*********************************************************** */


    });
});