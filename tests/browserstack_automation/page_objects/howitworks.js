import { $ } from '@wdio/globals';
import Page from './page';
import { driver, expect } from '@wdio/globals';

class HowItWorks extends Page {

  get howItWorksTitle1() {
    return $('#claimYourCampaignProfile')
  }

  get howItWorksTitle2() {
    return $('#importEndorsements')
  }

  get howItWorksTitle3() {
    return $('#addMoreCustomizations')
  }

  get howItWorksTitle4() {
    return $('#launchToYourPeople')
  }

  get howItWorksTitle5() {
    return $('#socialLift')
  }

  get howItWorksDescription1() {
    return $('#claimYourCampaignProfileDescription');
  }

  get howItWorksDescription2() {
    return $('#importEndorsementsDescription');
  }

  get howItWorksDescription3() {
    return $('#addMoreCustomizationsDescription');
  }

  get howItWorksDescription4() {
    return $('#launchToYourPeopleDescription');
  }

  get howItWorksDescription5() {
    return $('#socialLiftDescription');
  }

  get howItWorksImage () {
    return $('div>img').getAttribute('src')
  }
  get howItWorksLink () {
    return $('#footerLinkHowItWorks');
  }

  get findFirstNextButtonHowItWorksWindow () {
    return $('#annotatedSlideShowStep1Next');
  }

  get findSecondNextButtonHowItWorksWindow () {
    return $('#annotatedSlideShowStep2Next');
  }

  get findThirdNextButtonHowItWorksWindow () {
    return $('#annotatedSlideShowStep3Next');
  }

  get findFourthNextButtonHowItWorksWindow () {
    return $('#annotatedSlideShowStep4Next');
  }

  get findFirstBackButtonHowItWorksWindow () {
    return $('#annotatedSlideShowStep2Back');
  }

  get findSecondBackButtonHowItWorksWindow () {
    return $('#annotatedSlideShowStep3Back');
  }

  get findThirdBackButtonHowItWorksWindow () {
    return $('#annotatedSlideShowStep4Back');
  }

  get findFourthBackButtonHowItWorksWindow () {
    return $('#howItWorksBackDesktopButton');
  }

  get getTitleSignUpPopUp () {
    return $('#signIn');
  }

  get signInSubtitle () {
    return $('#pleaseSignInTitle');
  }

  get getStartedButton () {
    return $('#howItWorksGetStartedDesktopButton');
  }

  get enterVoterEmailAddressTextBox () {
    return $('#enterVoterEmailAddress');
  }

  get cancelEmailButton () {
    return $('#cancelEmailButton');
  }

  get cancelMobilePhoneNumberButton(){
    return $('#cancelVoterPhoneSendSMS')
  }

  get enterMobilePhoneNumber() {
    return $('#enterVoterPhone');
  }

  get enterSignInWithApple() {
    return $('#appleLogo');
  }

  get enterSignInWithTwitter () {
    return $('.csbvaL');//deprecated case page object
  }

  get cancelTwitterSignin(){
  return $('#cancel')
  }

  get enterSendVerificationCode() {
    return $('#desktopSmsSendCode')
  }

  get enterSendEmailVerificationCode() {
    return $('#voterEmailAddressEntrySendCode')
  }

  get enterVerifyButton(){
    return $('#emailVerifyButton')
  }

  get enterProfileAvatar(){
    return $('#profileAvatarHeaderBar')
  }

  get signOut() {
    return $('#signOut_Settings')
  }

  get phoneNumberHelperText(){
    return $('#enterVoterPhone-helper-text')
  }

  get emailAddressHelperText() {
    return $('#enterVoterEmailAddress-helper-text')
  }

  get backArrow() {
    return $('#emailVerificationBackButton')
  }

  get deleteIcon() {
    return $('svg[data-testid = "DeleteIcon"]')
  }

  get alertMessage() {
    return $('.MuiAlert-message')
  }
  get howWeVoteWorksLink() {
    return $('#step1');
  }
  async clickHowWeVoteWorksLink () {
    await this.howWeVoteWorksLink.click();
  }

  async enterDigit(num){
  if (num === 0) {
      return $('#digit1')
    }else if (num === 1) {
      return $('#digit2')
    } else if (num === 2) {
      return $('#digit3')
    } else if (num === 3) {
      return $('#digit4')
    } else if (num == 4) {
      return $('#digit5')
    } else{
      return $('#digit6')
    }

  }

  async clickButton(element){
    await element.findAndClick()
  }

  async clickHowItWorksLink () {
    await this.howItWorksLink .click();
  }

  async clickNextButtonFourTimes () {
    for (let i = 1; i <= 4; i++) {
      if (i == 1) {
        await this.findFirstNextButtonHowItWorksWindow.click();
      }else if (i ==2){
        await this.findSecondNextButtonHowItWorksWindow.click();
      }else if (i ==3){
        await this.findThirdNextButtonHowItWorksWindow.click();
      }else {
        await this.findFourthNextButtonHowItWorksWindow.click();
      }
    }
  }

  async clickNextButton (i) {
      if (i == 1) {
        await this.findFirstNextButtonHowItWorksWindow.click();
      }else if (i ==2){
        await this.findSecondNextButtonHowItWorksWindow.click();
      }else if (i ==3){
        await this.findThirdNextButtonHowItWorksWindow.click();
      }else {
        await this.findFourthNextButtonHowItWorksWindow.click();
      }
    }

  async checkDescriptionOfHowItWorksWindow (num) {
    if (num === 1) {
      return this.howItWorksDescription1;
    }else if (num === 2) {
      return this.howItWorksDescription2;
    } else if (num === 3) {
      return this.howItWorksDescription3;
    } else if (num === 4) {
      return this.howItWorksDescription4;
    } else {
      return howItWorksDescription5;
    }
  }

  async checkBrokenImagesUsingResponseCode() {
    const imageSrc = await this.howItWorksImage
    const response = await fetch(imageSrc);
    if (response.status == 200){
      console.log("Image loaded");
     } else{
      console.log('Image is not loaded');
     }
  }

  async clickBackButtonFourTimes () {
    for (let i = 1; i <= 4; i++) {
      if (i == 1) {
        await this.findFourthBackButtonHowItWorksWindow.click();
      }else if (i ==2){
        await this.findThirdBackButtonHowItWorksWindow.click();
      }else if (i ==3){
        await this.findSecondBackButtonHowItWorksWindow.click();
      }else {
        await this.findFirstBackButtonHowItWorksWindow.click();
      }
    }
  }

  async checkTitleOfHowItWorksWindow (num) {
    if (num === 1) {
      return this.howItWorksTitle1;
    }else if (num === 2) {
      return this.howItWorksTitle2;
    } else if (num === 3) {
      return this.howItWorksTitle3;
    } else if (num === 4) {
      return this.howItWorksTitle4;
    } else {
      return this.howItWorksTitle5;
    }
  }
}

export default new HowItWorks();
