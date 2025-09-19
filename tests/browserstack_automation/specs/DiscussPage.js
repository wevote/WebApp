
import { browser, driver, expect } from '@wdio/globals';
import DiscussPage from '../page_objects/discuss.page';

const { describe, it } = require('mocha');

const waitTime = 5000;
const email = 'wevote@wevote.us';
const errorMessage = 'Enter valid email 6 to 254 characters long';
beforeEach(async () => {
  await DiscussPage.load();
  await driver.pause(waitTime);
  await driver.switchWindow('Discuss - WeVote');
  await driver.maximizeWindow();

});

describe('Discuss Page', () => {
  // Discuss_001
  it('openDiscussPage', async () => {
    await expect(driver).toHaveUrl(expect.stringContaining('/news'));//'https://quality.wevote.us/news'
    await expect(driver).toHaveTitle('Discuss - WeVote');
  });

  //Discuss_002
  it('verifyDiscussPageSpellingSignIn', async () => {
    const signInTitle = 'Sign In to Join the Discussion';
    const signInSubtitle = 'WeVote is a community of friends who care about voting and democracy.';
    const testAuthor = 'Alissa B., Oakland, California';
    const textTestAuthor = 'Great way to sort through my ballot! My husband and I used WeVote during ' +
    'the last election to learn more about our ballots and make some tough choices. ' +
    'Between following various organizations, and friending a couple of trusted friends, ' +
    'we felt like we had an excellent pool of information to draw from.';
    const termsWrapper = "By continuing, you accept WeVote.US’s Terms of Service and Privacy Policy.";
    const imageElementSizeHeight = 40;
    const imageElementSizeWidth = 40;

    let currentSignInTitle = await (await DiscussPage.signInTitle).getText();
    let currentSignInSubtitle = await (await DiscussPage.signInSubtitle).getText();
    let currentTestAuthor =  await (await DiscussPage.testImoniaAuthor).getText();
    // Safari adds non-breaking space at the end vs Chrome adds regular space.
    // Trim to make sure we get expected results.
    let currentTextTestAuthor = (await (await DiscussPage.textTestAuthor).getText()).trim();
    let currentTermsWrapperText = await (await DiscussPage.termsWrapper).getText();
    let currentTermsOfServiceLink = await (await DiscussPage.openTermsOfService)
    let currentPrivacyPolicyLink = await (await DiscussPage.openPrivacyPolicy)
    let imageElement = await DiscussPage.avatarCard;
    const { height: currentSizeHeight, width: currentSizeWidth } = await imageElement.getSize();

    await expect (currentSignInTitle).toBe(signInTitle);
    await expect (currentSignInSubtitle).toBe(signInSubtitle);
    await expect (currentTestAuthor).toBe(testAuthor);
    await expect (currentTextTestAuthor).toBe(textTestAuthor);
    await expect (currentTermsWrapperText).toBe(termsWrapper);
    await expect (currentTermsOfServiceLink).toHaveAttr('href',expect.stringContaining('/terms'));
    await expect (currentPrivacyPolicyLink).toHaveAttr('href',expect.stringContaining('/privacy'));
    await expect (imageElement).toBeDisplayed();
    await expect (currentSizeHeight).toBe(imageElementSizeHeight);
    await expect (currentSizeWidth).toBe(imageElementSizeWidth);
  });

  // // Clarify test case
  // // // Discuss_003
  // // it('verifyDiscussPageBlankSpace', async () => {
  // //   await DiscussPage.load();
  // // });

  // Discuss_004
  it('verifyvoterEmailAddressVerificationButton', async () => {
    await expect(DiscussPage.voterEmailAddressVerificationButton).not.toBeClickable();
    const element = await DiscussPage.enterVoterEmailAddressTextBox; // Locate the text box element using a selector
    await driver.pause(waitTime);
    element.setValue(email);
    await driver.pause(waitTime);
    await driver.waitUntil(async () => ((DiscussPage.toggleEmailVerificationButton)));
  });

  // Discuss_005
  it('verifyEmailPlaceholderText', async () => {
    const enterVoterEmailAddressTextBoxElement = await DiscussPage.enterVoterEmailAddressTextBox;
    const placeholderText = await enterVoterEmailAddressTextBoxElement.getAttribute('placeholder'); // Retrieve and wait for the placeholder text
    await driver.pause(waitTime);
    await expect(placeholderText).toBe('Type email here...');
    console.log(placeholderText); // Output the placeholder text
  });

  // Discuss_006
  it('verifyEmailButtons', async () => {
    const enterVoterEmailAddressTextBoxElement = await DiscussPage.enterVoterEmailAddressTextBox;
    await enterVoterEmailAddressTextBoxElement.click();
    await driver.pause(waitTime);
    const emailCancelElement = await DiscussPage.cancelEmailButton;
    const emailVerificationElement = await DiscussPage.voterEmailAddressVerificationButton;

    await expect(emailCancelElement).toBeDisplayed();
    await expect(emailVerificationElement).toBeDisplayed();
  });

  // Discuss_007
  it('verifyTabKeySelectEnterVoterEmailAddressTextBox', async () => {

    const element = await DiscussPage.enterVoterEmailAddressTextBox;
    const elementId = await element.getAttribute('id');

    const voterEmailAddressTextBox = await DiscussPage.tabToSelectElement(driver, elementId);
    if (voterEmailAddressTextBox) {
      await voterEmailAddressTextBox.setValue(email);
    } else {
      throw new Error('Element with ID ' + elementId + ' not found or not reachable while selectig with Tab.');
    }

    await expect(DiscussPage.voterEmailAddressVerificationButton).toBeClickable();
    await expect(await element.getAttribute('value')).toBe(email);
  });

  // Discuss_008
  it('verifyTabKeySelectEmailCancelButton', async () => {
    const element = await DiscussPage.enterVoterEmailAddressTextBox;
    const elementId = await element.getAttribute('id');
    const voterEmailAddressTextBox = await DiscussPage.tabToSelectElement(driver, elementId);
    if (voterEmailAddressTextBox) {
      await voterEmailAddressTextBox.setValue(email);
    } else {
      throw new Error('Element with ID ' + elementId + ' not found or not reachable while selectig with Tab.');
    }

    await expect(DiscussPage.cancelEmailButton).toBeClickable();

    const elementCancelButton = await DiscussPage.cancelEmailButton;
    const elementCancelButtonId = await elementCancelButton.getAttribute('id');
    const cancelButton = await DiscussPage.tabToSelectElement(driver, elementCancelButtonId);
    if (cancelButton) {
      await elementCancelButton.click();
    } else {
      throw new Error('Element with ID ' + elementCancelButtonId + ' not found or not reachable while selectig with Tab.');
    }

    await expect(DiscussPage.cancelEmailButton).not.toBeClickable();
    await expect(DiscussPage.cancelEmailButton).not.toBeDisplayed();
    await expect(DiscussPage.voterEmailAddressVerificationButton).not.toBeClickable();
    await expect(DiscussPage.voterEmailAddressVerificationButton).not.toBeDisplayed();
  });

  // Discuss_009
  it('verifyEmailTyped', async () => {
    await expect(DiscussPage.voterEmailAddressVerificationButton).not.toBeClickable();
    const element = await DiscussPage.enterVoterEmailAddressTextBox; // Locate the text box element using a selector
    await element.setValue('wevote@gmail.com');
    await driver.pause(waitTime);
    // Get the value of the email text box
    const enterVoterEmailAddressTextBoxValue = await element.getValue();

    // Check if the value of the email text box is 'wevote@gmail.com'
    await expect(enterVoterEmailAddressTextBoxValue).toBe('wevote@gmail.com');
  });

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
    const colorElementAddressHelperText = 'rgb(211,47,47)';

    await expect(DiscussPage.voterEmailAddressVerificationButton).not.toBeClickable();
    await expect(DiscussPage.voterEmailAddressHelperText).not.toBeDisplayed();

    const element = await DiscussPage.enterVoterEmailAddressTextBox;
    element.setValue('11111');
    await driver.pause(waitTime);
    let currentColorElementAddressHelperText = (await (await DiscussPage.voterEmailAddressHelperText).getCSSProperty('color')).value;
    currentColorElementAddressHelperText = currentColorElementAddressHelperText.replace(/rgba?\((\d+,\d+,\d+)(,\d+)?\)/, 'rgb($1)');

    await expect(DiscussPage.voterEmailAddressVerificationButton).not.toBeClickable();
    await expect(DiscussPage.voterEmailAddressHelperText).toBeDisplayed();
    await expect(await (await DiscussPage.voterEmailAddressHelperText)
                .getText()).toBe(errorMessage);
    await expect(currentColorElementAddressHelperText).toBe(colorElementAddressHelperText);
  });

  // Discuss_014
  it('missing@EmailVerification', async () => {
    const elementColor = 'rgb(211,47,47)';
    const emailAddressLableText = 'Email';

    await expect(DiscussPage.voterEmailAddressVerificationButton).not.toBeClickable();
    await expect(DiscussPage.voterEmailAddressHelperText).not.toBeDisplayed();

    const element = await DiscussPage.enterVoterEmailAddressTextBox;
    element.setValue('wevotewevote.us');
    await driver.pause(waitTime);

    let currentColorElementAddressHelperText = (await (await DiscussPage.voterEmailAddressHelperText).getCSSProperty('color')).value;
    currentColorElementAddressHelperText = currentColorElementAddressHelperText.replace(/rgba?\((\d+,\d+,\d+)(,\d+)?\)/, 'rgb($1)');
    let currentColorElementAddressLabel = (await (await DiscussPage.voterEmailAddressLabel).getCSSProperty('color')).value;
    currentColorElementAddressLabel = currentColorElementAddressLabel.replace(/rgba?\((\d+,\d+,\d+)(,\d+)?\)/, 'rgb($1)');
    let currentEmailAdderssLabelText = await (await DiscussPage.voterEmailAddressLabel).getText();

    await expect(currentEmailAdderssLabelText).toBe(emailAddressLableText);
    await expect(currentColorElementAddressHelperText).toBe(elementColor);
    await expect(currentColorElementAddressLabel).toBe(elementColor);
    await expect(DiscussPage.voterEmailAddressVerificationButton).not.toBeClickable();
    await expect(DiscussPage.voterEmailAddressHelperText).toBeDisplayed();
    await expect(await (await DiscussPage.voterEmailAddressHelperText)
                .getText()).toBe(errorMessage);
   });

  // Discuss_015
  it('capitalLetterEmailVerification', async () => {

    await expect(DiscussPage.voterEmailAddressVerificationButton).not.toBeClickable();
    await expect(DiscussPage.voterEmailAddressHelperText).not.toBeDisplayed();

    const element = await DiscussPage.enterVoterEmailAddressTextBox;
    element.setValue('WeVote@wevote.us');

    await expect(DiscussPage.voterEmailAddressVerificationButton).toBeClickable();
    await expect(DiscussPage.voterEmailAddressHelperText).not.toBeDisplayed();
  });

  // Discuss_017
  it('numberEmailVerification', async () => {

    await expect(DiscussPage.voterEmailAddressVerificationButton).not.toBeClickable();
    await expect(DiscussPage.voterEmailAddressHelperText).not.toBeDisplayed();

    const element = await DiscussPage.enterVoterEmailAddressTextBox;
    element.setValue('wevote1@wevote.us');
    await driver.pause(waitTime);

    await expect(DiscussPage.voterEmailAddressVerificationButton).toBeClickable();
    await expect(DiscussPage.voterEmailAddressHelperText).not.toBeDisplayed();
  });

  // Discuss_018
  it('periodEmailVerification', async () => {

    await expect(DiscussPage.voterEmailAddressVerificationButton).not.toBeClickable();
    await expect(DiscussPage.voterEmailAddressHelperText).not.toBeDisplayed();

    const element = await DiscussPage.enterVoterEmailAddressTextBox;
    element.setValue('we.vote@wevote.us');
    await driver.pause(waitTime);

    await expect(DiscussPage.voterEmailAddressVerificationButton).toBeClickable();
    await expect(DiscussPage.voterEmailAddressHelperText).not.toBeDisplayed();
  });

  // Discuss_019
  it('underscoreEmailVerification', async () => {

    await expect(DiscussPage.voterEmailAddressVerificationButton).not.toBeClickable();
    await expect(DiscussPage.voterEmailAddressHelperText).not.toBeDisplayed();

    const element = await DiscussPage.enterVoterEmailAddressTextBox;
    element.setValue('we_vote@wevote.us');
    await driver.pause(waitTime);

    await expect(DiscussPage.voterEmailAddressVerificationButton).toBeClickable();
    await expect(DiscussPage.voterEmailAddressHelperText).not.toBeDisplayed();
  });

  // Discuss_020
  it('dashEmailVerification', async () => {

    await expect(DiscussPage.voterEmailAddressVerificationButton).not.toBeClickable();
    await expect(DiscussPage.voterEmailAddressHelperText).not.toBeDisplayed();

    const element = await DiscussPage.enterVoterEmailAddressTextBox;
    element.setValue('we-vote@wevote.us');
    await driver.pause(waitTime);

    await expect(DiscussPage.voterEmailAddressVerificationButton).toBeClickable();
    await expect(DiscussPage.voterEmailAddressHelperText).not.toBeDisplayed();
  });

  //Discuss_021
  it('periodStartEmailVerification', async () => {
    const elementColor = 'rgb(211,47,47)';
    const emailAddressLableText = 'Email';

    await expect(DiscussPage.voterEmailAddressVerificationButton).not.toBeClickable();
    await expect(DiscussPage.voterEmailAddressHelperText).not.toBeDisplayed();

    const element = await DiscussPage.enterVoterEmailAddressTextBox;
    element.setValue('.wevote@wevote.us');
    await driver.pause(waitTime);

    let currentColorElementAddressHelperText = (await (await DiscussPage.voterEmailAddressHelperText).getCSSProperty('color')).value;
    let currentColorElementAddressLabel = (await (await DiscussPage.voterEmailAddressLabel).getCSSProperty('color')).value;
    currentColorElementAddressHelperText = currentColorElementAddressHelperText.replace(/rgba?\((\d+,\d+,\d+)(,\d+)?\)/, 'rgb($1)');
    currentColorElementAddressLabel = currentColorElementAddressLabel.replace(/rgba?\((\d+,\d+,\d+)(,\d+)?\)/, 'rgb($1)');
    let currentEmailAdderssLabelText = await (await DiscussPage.voterEmailAddressLabel).getText();
    let elementAddressHelperText = await DiscussPage.voterEmailAddressHelperText;

    await expect(await elementAddressHelperText.getText()).toEqual(errorMessage);
    await expect(currentEmailAdderssLabelText).toBe(emailAddressLableText);
    await expect(currentColorElementAddressHelperText).toBe(elementColor);
    await expect(currentColorElementAddressLabel).toBe(elementColor);
    await expect(DiscussPage.voterEmailAddressVerificationButton).not.toBeClickable();
  });

  // Test case fails
  // Discuss_022
  // it('underscoreStartEmailVerification', async () => {
  //   await DiscussPage.load();
  //   await driver.switchWindow('https://quality.wevote.us/news');
  //   await expect(DiscussPage.voterEmailAddressVerificationButton).not.toBeClickable();
  //   const element = await DiscussPage.enterVoterEmailAddressTextBox; // Locate the text box element using a selector
  //   element.setValue('_wevote@wevote.us');
  //   await expect(DiscussPage.voterEmailAddressVerificationButton).not.toBeClickable();
  // });

  // Test case fails
  // // Discuss_023
  // it('dashStartEmailVerification', async () => {
  //   await DiscussPage.load();
  //   await driver.switchWindow('https://quality.wevote.us/news');
  //   await expect(DiscussPage.voterEmailAddressVerificationButton).not.toBeClickable();
  //   const element = await DiscussPage.enterVoterEmailAddressTextBox; // Locate the text box element using a selector
  //   element.setValue('-wevote@wevote.us');
  //   await expect(DiscussPage.voterEmailAddressVerificationButton).not.toBeClickable();
  // });

  // Discuss_024
  it('domainEmailVerification', async () => {
    await expect(DiscussPage.voterEmailAddressVerificationButton).not.toBeClickable();
    const element = await DiscussPage.enterVoterEmailAddressTextBox; // Locate the text box element using a selector
    element.setValue('@wevote.us');
    await driver.pause(waitTime);
    await expect(DiscussPage.voterEmailAddressVerificationButton).not.toBeClickable();
  });

  // Discuss_026
  it('spaceEmailVerification', async () => {
    const email = 'we  vote@vewote.us';
    const emailWithoutSpaces = email.replace(/\s+/g, '');
    const browserName = browser.capabilities.browserName;
    await expect(DiscussPage.voterEmailAddressVerificationButton).not.toBeClickable();
    const element = await DiscussPage.enterVoterEmailAddressTextBox; // Locate the text box element using a selector
    element.setValue(email);
    await driver.pause(waitTime);
    //Chrome checks for whitespace in email input and prevents entry. Safari does not enforce this restriction.
    if (browserName == 'Safari') {
      await expect(await (await DiscussPage.enterVoterEmailAddressTextBox).getValue()).toBe(email);
      await expect(DiscussPage.voterEmailAddressVerificationButton).not.toBeClickable();
    } else {
      await expect(await (await DiscussPage.enterVoterEmailAddressTextBox).getValue()).toBe(emailWithoutSpaces);
      await expect(DiscussPage.voterEmailAddressVerificationButton).toBeClickable();
    }
  });

// Discuss_025
it('symbolEmailVerification', async () => {
  await expect(DiscussPage.voterEmailAddressVerificationButton).not.toBeClickable();
  const element = await DiscussPage.enterVoterEmailAddressTextBox; // Locate the text box element using a selector
  const symbolsArray = ['~', '`', '!', '#', '$', '%', '\'', '^', '&', '*', '(', ')', '+', '=', '\\', ']', '[', '{', '}', '|', '"', ':', ';', '?', '/', '>', ',', '<'];
  for (let i = 0; i < symbolsArray.length; i++) {
    await element.setValue(symbolsArray[i]);
    await expect(DiscussPage.voterEmailAddressVerificationButton).not.toBeClickable();
  }
  });
});
