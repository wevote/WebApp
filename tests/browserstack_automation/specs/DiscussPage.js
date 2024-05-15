import { $, driver, expect } from '@wdio/globals';
import DiscussPage from '../page_objects/discuss.page';

const { describe, it } = require('mocha');

describe('Discuss Page', () => {
  // Discuss_001
  it('openDiscussPage', async () => {
    await DiscussPage.load();
    await driver.switchWindow('https://quality.wevote.us/news');
    await expect(driver).toHaveUrl('https://quality.wevote.us/news');
    await expect(driver).toHaveTitle('Discuss - WeVote');
  });

  // // Clarify test case
  // // Discuss_002
  // // it('verifyDiscussPageSpelling', async () => {
  // //   await DiscussPage.load();
  // // });

  // // Clarify test case
  // // // Discuss_003
  // // it('verifyDiscussPageBlankSpace', async () => {
  // //   await DiscussPage.load();
  // // });

  // Discuss_004
  it('verifyEmailVerificationButton', async () => {
    await DiscussPage.load();
    await driver.switchWindow('https://quality.wevote.us/news');
    await expect(DiscussPage.emailVerificationButton).not.toBeClickable();
    const element = await DiscussPage.emailTextBox; // Locate the text box element using a selector
    element.setValue('wevote@gmail.com');
    await driver.waitUntil(async () => ((DiscussPage.toggleEmailVerificationButton)));
  });

  // Discuss_005
  it('verifyEmailPlaceholderText', async () => {
    await DiscussPage.load();
    await driver.switchWindow('https://quality.wevote.us/news');
    const emailTextBoxElement = await DiscussPage.emailTextBox;
    const placeholderText = await emailTextBoxElement.getAttribute('placeholder'); // Retrieve and wait for the placeholder text
    await expect(placeholderText).toBe('Type email here...');
    console.log(placeholderText); // Output the placeholder text
  });
  // Discuss_006
  it('verifyEmailButtons', async () => {
    await DiscussPage.load();
    await driver.switchWindow('https://quality.wevote.us/news');
    const emailTextBoxElement = await DiscussPage.emailTextBox;
    await expect(emailTextBoxElement).toBeDisplayed();
    await emailTextBoxElement.click();
    const emailCancelElement = await DiscussPage.cancelEmailButton;
    await expect(emailCancelElement).toBeDisplayed();
    const emailVerificationElement = await DiscussPage.emailVerificationButton;
    await expect(emailVerificationElement).toBeDisplayed();
  });

  // Discuss_007
  it('verifyTabKeySelectEmailTextBox', async () => {
    await DiscussPage.load();
    await driver.switchWindow('https://quality.wevote.us/news');

    // Set focus on the email text box
    // const emailTextBoxElement = await DiscussPage.emailTextBox;
    // await emailTextBoxElement.click();

    // Press the tab key 11 times
    for (let i = 0; i < 12; i++) {
      driver.keys(['Tab']);
    // await driver.pause(9000);
    }
    // await driver.pause(9000);
    // driver.keys(['Tab']);

    // Check if the active element is the email text box after pressing the tab key 11 times
    const activeElement = await driver.getActiveElement();
    const activeElementWdio = await (await $(activeElement)).getProperty('id');
    // await driver.pause
    console.log(activeElementWdio);
    // console.log(emailTextBoxElement);

    // await expect(activeElement).toBe(emailTextBoxElement);
  });

  // Test Case Doesn't work
  // // Discuss_008
  // it('verifyTabKeySelectEmailCancelButton', async () => {
  //   await DiscussPage.load();
  //   await driver.switchWindow('https://quality.wevote.us/news');

  // });

  // // Discuss_009
  // it('verifyEmailTyped', async () => {
  //   await DiscussPage.load();
  //   await driver.switchWindow('https://quality.wevote.us/news');
  //   await expect(DiscussPage.emailVerificationButton).not.toBeClickable();
  //   const element = await DiscussPage.emailSignInTextBox; // Locate the text box element using a selector
  //   element.setValue('wevote@gmail.com');
  //   await driver.pause(5000);
  //   // Get the value of the email text box
  //   const emailTextBoxValue = await element.getValue();

  //   // Check if the value of the email text box is 'wevote@gmail.com'
  //   await expect(emailTextBoxValue).toBe('wevote@gmail.com');
  // });

  //   // Discuss_010
  //   it('pasteEmailVerification', async () => {
  //     await DiscussPage.load();
  //     await driver.switchWindow('https://quality.wevote.us/news');
  //     await expect(driver).toHaveUrl('https://quality.wevote.us/news');
  //     await expect(driver).toHaveTitle('Discuss - WeVote');
  //   });

  //   // Discuss_011
  //   it('pasteRightClickEmailVerification', async () => {
  //     await DiscussPage.load();
  //     await driver.switchWindow('https://quality.wevote.us/news');
  //     await expect(driver).toHaveUrl('https://quality.wevote.us/news');
  //     await expect(driver).toHaveTitle('Discuss - WeVote');
  //   });

  // Discuss_013
  it('invalidEmailVerification', async () => {
    await DiscussPage.load();
    await driver.switchWindow('https://quality.wevote.us/news');
    await expect(DiscussPage.emailVerificationButton).not.toBeClickable();
    const element = await DiscussPage.emailTextBox; // Locate the text box element using a selector
    element.setValue('11111');
    await expect(DiscussPage.emailVerificationButton).not.toBeClickable();
  });

  // Discuss_014
  it('missing@EmailVerification', async () => {
    await DiscussPage.load();
    await driver.switchWindow('https://quality.wevote.us/news');
    await expect(DiscussPage.emailVerificationButton).not.toBeClickable();
    const element = await DiscussPage.emailTextBox; // Locate the text box element using a selector
    element.setValue('wevotewevote.us');
    await expect(DiscussPage.emailVerificationButton).not.toBeClickable();
  });

  // Discuss_015
  it('capitalLetterEmailVerification', async () => {
    await DiscussPage.load();
    await driver.switchWindow('https://quality.wevote.us/news');
    await expect(DiscussPage.emailVerificationButton).not.toBeClickable();
    const element = await DiscussPage.emailTextBox; // Locate the text box element using a selector
    element.setValue('WeVote@wevote.us');
    await expect(DiscussPage.emailVerificationButton).toBeClickable();
  });

  // Test case fails
  // // Discuss_016
  // it('nonLatinLetterEmailVerification', async () => {
  //   await DiscussPage.load();
  //   await driver.switchWindow('https://quality.wevote.us/news');
  //   await expect(DiscussPage.emailVerificationButton).not.toBeClickable();
  //   const element = await DiscussPage.emailTextBox; // Locate the text box element using a selector
  //   element.setValue('wevoteč@wevote.us');
  //   await expect(DiscussPage.emailVerificationButton).toBeClickable();
  // });

  // Discuss_017
  it('numberEmailVerification', async () => {
    await DiscussPage.load();
    await driver.switchWindow('https://quality.wevote.us/news');
    await expect(DiscussPage.emailVerificationButton).not.toBeClickable();
    const element = await DiscussPage.emailTextBox; // Locate the text box element using a selector
    element.setValue('wevote1@wevote.us');
    await expect(DiscussPage.emailVerificationButton).toBeClickable();
  });

  // Discuss_018
  it('periodEmailVerification', async () => {
    await DiscussPage.load();
    await driver.switchWindow('https://quality.wevote.us/news');
    await expect(DiscussPage.emailVerificationButton).not.toBeClickable();
    const element = await DiscussPage.emailTextBox; // Locate the text box element using a selector
    element.setValue('we.vote@wevote.us');
    await expect(DiscussPage.emailVerificationButton).toBeClickable();
  });

  // Discuss_019
  it('underscoreEmailVerification', async () => {
    await DiscussPage.load();
    await driver.switchWindow('https://quality.wevote.us/news');
    await expect(DiscussPage.emailVerificationButton).not.toBeClickable();
    const element = await DiscussPage.emailTextBox; // Locate the text box element using a selector
    element.setValue('we_vote@wevote.us');
    await expect(DiscussPage.emailVerificationButton).toBeClickable();
  });

  // Discuss_020
  it('dashEmailVerification', async () => {
    await DiscussPage.load();
    await driver.switchWindow('https://quality.wevote.us/news');
    await expect(DiscussPage.emailVerificationButton).not.toBeClickable();
    const element = await DiscussPage.emailTextBox; // Locate the text box element using a selector
    element.setValue('we-vote@wevote.us');
    await expect(DiscussPage.emailVerificationButton).toBeClickable();
  });

  // Discuss_021
  it('periodStartEmailVerification', async () => {
    await DiscussPage.load();
    await driver.switchWindow('https://quality.wevote.us/news');
    await expect(DiscussPage.emailVerificationButton).not.toBeClickable();
    const element = await DiscussPage.emailTextBox; // Locate the text box element using a selector
    element.setValue('we-vote@wevote.us');
    await expect(DiscussPage.emailVerificationButton).not.toBeClickable();
  });


  // Discuss_022
  it('underscoreStartEmailVerification', async () => {
    await DiscussPage.load();
    await driver.switchWindow('https://quality.wevote.us/news');
    await expect(DiscussPage.emailVerificationButton).not.toBeClickable();
    const element = await DiscussPage.emailTextBox; // Locate the text box element using a selector
    element.setValue('_wevote@wevote.us');
    await expect(DiscussPage.emailVerificationButton).not.toBeClickable();
  });

  // Discuss_023
  it('dashStartEmailVerification', async () => {
    await DiscussPage.load();
    await driver.switchWindow('https://quality.wevote.us/news');
    await expect(DiscussPage.emailVerificationButton).not.toBeClickable();
    const element = await DiscussPage.emailTextBox; // Locate the text box element using a selector
    element.setValue('-wevote@wevote.us');
    await expect(DiscussPage.emailVerificationButton).not.toBeClickable();
  });

  // Discuss_024
  it('domainEmailVerification', async () => {
    await DiscussPage.load();
    await driver.switchWindow('https://quality.wevote.us/news');
    await expect(DiscussPage.emailVerificationButton).not.toBeClickable();
    const element = await DiscussPage.emailTextBox; // Locate the text box element using a selector
    element.setValue('@wevote.us');
    await expect(DiscussPage.emailVerificationButton).not.toBeClickable();
  });

  // Discuss_025
  it('domainEmailVerification', async () => {
    await DiscussPage.load();
    await driver.switchWindow('https://quality.wevote.us/news');
    await expect(DiscussPage.emailVerificationButton).not.toBeClickable();
    const element = await DiscussPage.emailTextBox; // Locate the text box element using a selector
    element.setValue('@wevote.us');
    await expect(DiscussPage.emailVerificationButton).not.toBeClickable();
  });

  // Discuss_026
  it('symbolEmailVerification', async () => {
    await DiscussPage.load();
    await driver.switchWindow('https://quality.wevote.us/news');
    await expect(DiscussPage.emailVerificationButton).not.toBeClickable();
    const element = await DiscussPage.emailTextBox; // Locate the text box element using a selector

    const symbolsArray = ['~', '`', '!', '#', '$', '%', '\'', '^', '&', '*', '(', ')', '+', '=', '\\', ']', '[', '{', '}', '|', '"', ':', ';', '?', '/', '>', ',', '<'];
    for (let i = 0; i < 29; i++) {
      element.setValue(symbolsArray[i]);
      expect(DiscussPage.emailVerificationButton).not.toBeClickable();
    }
  });

  // Discuss_027
  it('spaceEmailVerification', async () => {
    await DiscussPage.load();
    await driver.switchWindow('https://quality.wevote.us/news');
    await expect(DiscussPage.emailVerificationButton).not.toBeClickable();
    const element = await DiscussPage.emailTextBox; // Locate the text box element using a selector
    element.setValue('we vote@wevote.us');
    await expect(DiscussPage.emailVerificationButton).not.toBeClickable();
  });
});
