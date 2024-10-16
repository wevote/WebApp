import { $ } from '@wdio/globals';
import Page from './page';

class HowItWorks extends Page {

  get howItWorksTitle () {
    return $('div>h3[class~="gNNNpX"]');
  }

  get findNextButtonHowItWorksWindow () {
    return $('.kMeOcV');
  }

  get findBackButtonHowItWorksWindow () {
    return $('//button[text() = "Back"]');
  }

  get getTitleSignUpPopUp () {
    return $('.u-f3');
  }

  get getStartedButton () {
    return $('.cqTvJR>button');
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
    return $('.csbvaL');
  }

  get cancelTwitterSignin(){
  return $('#cancel')
  }

  get gotoWeVoteBallotGuide() {
    return $('*=homepage')
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
    return $('svg[data-testid="DeleteIcon"]')
  }

  get alertMessage() {
    return $('.MuiAlert-message')
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

  async scrollToView(element) {
   await element.scrollIntoView()
  }

  async clickNextButtonFourTimes () {
    for (let i = 1; i <= 4; i++) {
      await this.findNextButtonHowItWorksWindow.click();
    }
  }

   async clickBackButtonFourTimes () {
    for (let i = 1; i <= 4; i++) {
      await this.findBackButtonHowItWorksWindow.click();
    }
  }

  async checkTitleOfHowItWorksWindow (num) {
    if (num === 1) {
      return '1. Choose your interests';
    }else if (num === 2) {
      return '2. Follow organizations and people you trust';
    } else if (num === 3) {
      return '3. See who endorsed each choice on your ballot';
    } else if (num === 4) {
      return '4. Complete your ballot with confidence';
    } else {
      return '5. Share with friends who could use a guide';
    }
  }
}

export default new HowItWorks();
