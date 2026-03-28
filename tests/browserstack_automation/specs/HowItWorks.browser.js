import {browser, driver, expect } from '@wdio/globals';
import ReadyPage from '../page_objects/ready.browser';
import HowItWorks from '../page_objects/howitworks.browser';
import testData from '../capabilities/testData.js';


describe('HowItWorks', () => {

  const totalSlides = 5;

  const enterOTP = async (code) => {
    for (let i = 0; i < code.length; i++) {
      await (await HowItWorks.enterDigit(i)).setValue(code[i]);
    }
  };

  const navigateToSignIn = async () => {
    await ReadyPage.load();
    await HowItWorks.clickHowItWorksLink();
    await HowItWorks.clickNextButtonFourTimes();
    await HowItWorks.clickButton(await HowItWorks.getStartedButton);
    await (await HowItWorks.signInSubtitle).waitForDisplayed();
  };

  const navigateToHowItWorks = async () => {
    await ReadyPage.load();
    await HowItWorks.clickHowItWorksLink();
  };

  // HowItWorks_001
  it('verifyNextButton', async () => {
    await navigateToHowItWorks();
    for (let i = 1; i <= totalSlides; i++) {
      await expect(await HowItWorks.checkTitleOfHowItWorksWindow(i)).toBeDisplayed();
      if (i !== totalSlides) {
        await HowItWorks.clickNextButton(i);
      }
    }
    console.log("Next Button and titles of the page verified successfully")
  });
  // HowItWorks_002
  it('verifyBackButton', async () => {
    await navigateToHowItWorks();
    await HowItWorks.clickNextButtonFourTimes();
    await HowItWorks.clickBackButtonFourTimes();
    await expect(await HowItWorks.checkTitleOfHowItWorksWindow(1)).toBeDisplayed();
    console.log("Back button clicked successfully and user is on first page")
  });
  // HowItWorks_003
  it('verifyGetStartedButton', async () => {
    await navigateToSignIn();
    await expect(await HowItWorks.signInSubtitle).toHaveText('Sign In or Join');
    console.log("GetStarted Button Clicked Successfully, user on the signIn page")
  });
  // HowItWorks_004
  it('verifyCancelSigninwithEmail', async () => {
   await navigateToSignIn();
    const emailTextBox = await HowItWorks.enterVoterEmailAddressTextBox;
    await emailTextBox.setValue(testData.EMAIL_NEGATIVE_SCENARIO);
    await HowItWorks.clickButton(await HowItWorks.cancelEmailButton);
    await expect(await HowItWorks.signInSubtitle).toHaveText('Sign In or Join');
    console.log("Email SignIn was Cancelled")
  });
  // HowItWorks_005
  it('verifyCancelSigninWithMobile', async () => {
    await navigateToSignIn();
    const mobile = await HowItWorks.enterMobilePhoneNumber;
    await mobile.setValue(testData.MOBILE_NUMBER);
    await HowItWorks.clickButton(await HowItWorks.cancelMobilePhoneNumberButton);
    await expect(await HowItWorks.signInSubtitle).toHaveText('Sign In or Join');
    console.log("Mobile SignIn was Cancelled")
  });
  // HowItWorks_006
  it('verifyCancelSigninWithApple', async () => {
    await navigateToSignIn();
    await HowItWorks.clickButton(await HowItWorks.enterSignInWithApple);
    await driver.back(); // known Safari issue
    await expect(await HowItWorks.getTitleSignUpPopUp).toHaveText('Sign In');
    console.log("AppleID  SignIn was Cancelled")
  });
   // HowItWorks_008
  it('verifySigninUsingMobile', async () => {
    await navigateToSignIn();
    const mobile = await HowItWorks.enterMobilePhoneNumber;
    await mobile.setValue(testData.MOBILE_NUMBER);
    await HowItWorks.clickButton(await HowItWorks.enterSendVerificationCode);
    await enterOTP(testData.MOBILE_VERIFICATION);
    await HowItWorks.clickButton(await HowItWorks.enterPhoneVerifyButton);
    await HowItWorks.clickButton(await HowItWorks.enterProfileAvatar);
    await HowItWorks.clickButton(await HowItWorks.signOut);
    console.log("Mobile sign-in successful");
  });

  // HowItWorks_009
  it('verifySigninUsingEmail', async () => {
    await navigateToSignIn();
    const email = await HowItWorks.enterVoterEmailAddressTextBox;
    await email.setValue(testData.EMAIL_VALID);
    await HowItWorks.clickButton(await HowItWorks.enterSendEmailVerificationCode);
    await enterOTP(testData.MOBILE_VERIFICATION);
    await HowItWorks.clickButton(await HowItWorks.enterEmailVerifyButton);
    await HowItWorks.clickButton(await HowItWorks.enterProfileAvatar);
    await HowItWorks.clickButton(await HowItWorks.signOut);
    console.log("Email sign-in successful");
  });

  // HowItWorks_012
  it('verifyImagesAndContent', async () => {
   await navigateToHowItWorks();
    for (let i = 1; i <= totalSlides; i++) {
      await expect(await HowItWorks.checkDescriptionOfHowItWorksWindow(i)).toBeDisplayed();
      await HowItWorks.checkBrokenImagesUsingResponseCode();
      if (i !== totalSlides) {
        await HowItWorks.clickNextButton(i);
      }
    }
    console.log("Images and content verified");
  });

   //HowItWorks_013
  it('verifyInvalidMobileNumber' , async () =>{
    await navigateToSignIn();
    const mobile = await HowItWorks.enterMobilePhoneNumber;
    await mobile.setValue(testData.INVALID_MOBILE_NUMBER);
    await expect(await HowItWorks.phoneNumberHelperText)
      .toHaveText('Enter a valid phone number');
    console.log("Invalid mobile validation verified");
   });

   //HowItWorks_014
  it('VerifyInvalidEmailAddress' , async () =>{
    await navigateToSignIn();
    const email = await HowItWorks.enterVoterEmailAddressTextBox;
    await email.setValue(testData.INVALID_EMAIL_ADDRESS);
    await expect(await HowItWorks.emailAddressHelperText)
      .toHaveText('Enter valid email 6 to 254 characters long');
    console.log("Invalid email validation verified");
   });

   // HowItWorks_016
  it('verifyDeleteUnverifiedEmailAddress', async () => {
    await ReadyPage.load();
    await HowItWorks.clickHowItWorksLink();
    await driver.pause(5000);
    await HowItWorks.clickNextButtonFourTimes();
    const getStarted = await HowItWorks.getStartedButton;
    await HowItWorks.clickButton(getStarted)
    await driver.pause(5000);
    const mobilePhoneNumber = await HowItWorks.enterMobilePhoneNumber;
    const emailTextBox = await HowItWorks.enterVoterEmailAddressTextBox;
    await emailTextBox.addValue(testData.EMAIL_NEGATIVE_SCENARIO);
    const sendCode = await HowItWorks.enterSendEmailVerificationCode;
    await HowItWorks.clickButton(sendCode)
    const backButton = await HowItWorks.backArrow;
    await HowItWorks.clickButton(backButton)
    const deleteButton = await HowItWorks.deleteIcon;
    await driver.pause(5000);
    await HowItWorks.clickButton(deleteButton);
    await expect(HowItWorks.alertMessage).toHaveText('Your email address was deleted.');
    console.log("Deleted unverified Email address")
   });

 // HowItWorks_015
  it('verifyDeleteUnverifiedPhoneNumbers', async () => {
   await ReadyPage.load();
    await HowItWorks.clickHowItWorksLink();
    await driver.pause(3000);
    await HowItWorks.clickNextButtonFourTimes();
    const getStarted = await HowItWorks.getStartedButton;
    await HowItWorks.clickButton(getStarted)
    await driver.pause(3000);
    const mobilePhoneNumber = await HowItWorks.enterMobilePhoneNumber;
    await mobilePhoneNumber.addValue(testData.UNVERIFIED_PHONE_NUMBER);
    const sendCode = await HowItWorks.enterSendVerificationCode;
    await HowItWorks.clickButton(sendCode)
    const backButton = await HowItWorks.backArrowPhoneVerification;
    await HowItWorks.clickButton(backButton)
    const deleteButton = await HowItWorks.deleteIcon;
    await driver.pause(3000);
    await HowItWorks.clickButton(deleteButton);
    await expect(HowItWorks.alertMessage).toHaveText('Your phone number was deleted.');
    console.log("Deleted unverified phone numbers")
   });


});
