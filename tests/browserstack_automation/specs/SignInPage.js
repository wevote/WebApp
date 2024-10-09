import { driver, expect } from '@wdio/globals';
import ReadyPage from '../page_objects/ready.page';
import PrivacyPage from '../page_objects/privacy.page';
import TermsPage from '../page_objects/terms.page';

const { describe, it } = require('mocha');

const waitTime = 5000;


describe('SignInPage', () => {

  /*
    it('verifySignIn', async () => {
        await ReadyPage.load();
        await driver.pause(waitTime);
        await driver.waitUntil(async () => (ReadyPage.getSignInElement.isClickable()));
        await ReadyPage.getSignInElement.click();
       
        await driver.waitUntil(async () => (ReadyPage.getMobilePhoneNumberElement.isClickable()));
        await ReadyPage.getMobilePhoneNumberElement.setValue("8089358555");

        await driver.waitUntil(async () => (ReadyPage.getSendCodeElement.isClickable()));
        await ReadyPage.getSendCodeElement.click();

        await driver.waitUntil(async () => (ReadyPage.getCodeVerificationDigit1Element.isClickable()));
        await ReadyPage.getCodeVerificationDigit1Element.setValue("1");

        await driver.waitUntil(async () => (ReadyPage.getCodeVerificationDigit2Element.isClickable()));
        await ReadyPage.getCodeVerificationDigit2Element.setValue("2");

        await driver.waitUntil(async () => (ReadyPage.getCodeVerificationDigit3Element.isClickable()));
        await ReadyPage.getCodeVerificationDigit3Element.setValue("3");

        await driver.waitUntil(async () => (ReadyPage.getCodeVerificationDigit4Element.isClickable()));
        await ReadyPage.getCodeVerificationDigit4Element.setValue("4");

        await driver.waitUntil(async () => (ReadyPage.getCodeVerificationDigit5Element.isClickable()));
        await ReadyPage.getCodeVerificationDigit5Element.setValue("5");

        await driver.waitUntil(async () => (ReadyPage.getCodeVerificationDigit6Element.isClickable()));
        await ReadyPage.getCodeVerificationDigit6Element.setValue("6");

        await driver.waitUntil(async () => (ReadyPage.getVerifyButtonElement.isClickable()));
        await ReadyPage.getVerifyButtonElement.click();

        //await driver.waitUntil(async () => (ReadyPage.getSignInElement.not.isDisplayed()));

    
      });
      */
    it('verifyLogin', async () => {
        await ReadyPage.login();
    });

});