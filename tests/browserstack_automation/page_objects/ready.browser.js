import { $, $$, expect, driver, browser } from '@wdio/globals';
import Page from './page';

class ReadyPage extends Page {
 constructor () {
   super().title = 'Ready to Vote? - WeVote';
 }

 get avatar () {
   return super.avatar;
 }

 get electionCountDownTitle () {
   return $('//*[contains(@id, "electionCountDownTitle")]');
 }

 get wevoteLogo () {
   return $('//*[contains(@id, "HeaderLogoImage")]');
 }

 get wevoteLogoRedirectReadyPage () {
   return $('#logoHeaderBar');
 }

 get ballotTitle () {
   return $('//*[contains(@id, "ballotTitleHeader")]');
 }

 get ballotAddress () {
   return $('#ballotTitleBallotAddress');
   // return $('//span[@class ="u-cursor--pointer u-link-color u-link-underline-on-hover"]');
 }

 get ballotAddressInput () {
   return $('#entryBox');
 }

 get saveBallotAddressButton () {
   return $('#addressBoxModalSaveButton');
 }

 get viewUpcomingBallotButton () {
   return $('//*[contains(@id, "viewUpcomingBallot")]');
 }

 get unfurlIssuesButton () {
   return $('//*[contains(@id, "showMoreReadyPageValuesList")]');
 }

 get toggleIntroductionButton () {
   return $('#toggleContentButton-showMoreReadyIntroductionCompressed');
   // return $('#showmorelink');
 }

 get introductionStepText () {
   return $$('//*[contains(@id, "readyIntroductionStepText")]');
 }

 get getIntroText () {
   return $('.StepText-sc-lvvjo6-11 kIDCci');
 }

 get toggleFinePrintButton () {
   return $('#toggleContentButton-showMoreReadyFinePrintCompressed');
   // return $('#showmorelink');
 }

 get finePrintStepText () {
   return $$('//*[contains(@id, "readyFinePrintStepText")]');
 }

 get finePrintStepHeaderText1 () {
   return $("(//div[@class='StepTitle-sc-lvvjo6-10 iKrjzD'][normalize-space()='You cannot cast your vote electronically'])[1]");
 }

 get finePrintStepHeaderText2 () {
   return $('//div[text() = "WeVote does not represent a government entity"]');
 }

 get finePrintStepHeaderText3 () {
   return $('//div[text() = "Please make sure you are registered to vote"]');
 }

 get finePrintStepHeaderText4 () {
   return $('//div[text() = "How your data is used & protected"]');
 }

 async checkFinePrintHeaders () {
   const text1 = (await this.finePrintStepHeaderText1);
   console.log(`text1: ${text1}`);
   const text2 = (await this.finePrintStepHeaderText2);
   console.log(`text2: ${text2}`);
   const text3 = (await this.finePrintStepHeaderText3);
   console.log(`text3: ${text3}`);
   const text4 = (await this.finePrintStepHeaderText4);
   console.log(`text4: ${text4}`);

   await expect(text1).toHaveText('You cannot cast your vote electronically');
   await expect(text2).toHaveText('WeVote does not represent a government entity');
   await expect(text3).toHaveText('Please make sure you are registered to vote');
   await expect(text4).toHaveText('How your data is used & protected');
 }

 get followIssueButtons () {
   return $$('//*[contains(@id, "issueFollowButton")]');
 }

 get toggleFollowMenuButtons () {
   return $$('//*[contains(@id, "toggleFollowMenuButton")]');
 }

 get unfollowIssueButtons () {
   return $$('//*[contains(@id, "issueUnfollowButton")]');
 }

 get getFollowPopularTopicsElement () {
   return $('#PopularTopicsHeader');
 }

 get selectAddress () {
   return $('(//div[@class = "pac-item"])[1]');
 }

 get howItWorksLink () {
   return $('#footerLinkHowItWorks');
 }

 get howItWorksTitle () {
   // return $('div>h3[class~="gNNNpeadyFinePrintStepTextX"]');
   return $('//h3[text()="1. Choose your interests"]');
 }

 get howItWorksCloseIcon () {
   return $('[data-testid = "CloseIcon"] > path');
 }

 get findPrivacyLink () {
   return $('#footerLinkPrivacy');
 }

 get findNextButtonHowItWorksWindow () {
   // return $('.kMeOcV');
   return $('//*[contains(@id, "Next")]');
 }

 get findBackButtonHowItWorksWindow () {
   return $('//*[contains(@id, "Back")]');
 }

 get getStartedButton () {
   return $('#howItWorksGetStartedDesktopButton');
 }

 get ballotForAddress () {
   return $('(span[class~="u-link-underline-on-hover"])');
 }

 get getTeamPageTitleElement () {
   return $("//h1[normalize-space()='About WeVote']");
 }

 get getCreditsAndThanksElement () {
   return $('#footerLinkCredits');
 }

 get getCreditsAndThanksPageTitleElement () {
   return $("//h1[normalize-space()='Credits & Thanks']");
 }

 get getDonateLinkLocator () {
   return $('[href = "/donate"]');
 }

 get getDonateLinkHeader () {
   return $('#donateTabHeaderBar');
 }

 get getDonateLinkFooter () {
   return $('#footerMainLinkDonate');
 }

 get getSignInElement () {
   return $('#signIn');
 }

 get getMobilePhoneNumberElement () {
   return $('#enterVoterPhone');
 }

 get getSendCodeElement () {
   return $('#desktopSmsSendCode');
 }

 get getCodeVerificationDigit1Element () {
   return $('#digit1');
 }

 get getCodeVerificationDigit2Element () {
   return $('#digit2');
 }

 get getCodeVerificationDigit3Element () {
   return $('#digit3');
 }

 get getCodeVerificationDigit4Element () {
   return $('#digit4');
 }

 get getCodeVerificationDigit5Element () {
   return $('#digit5');
 }

 get getCodeVerificationDigit6Element () {
   return $('#digit6');
 }

 get getVerifyButtonElement () {
   return $('#emailVerifyButton');
 }

 get getProChoiceLinkElement () {
   return $('a[href="/value/pro-choice"]');
 }

 get getDemocraticClubsLinkElement () {
   return $('a[href="/value/democratic_clubs"]');
 }

 get getProfileIconElement () {
   return $('#profileAvatarHeaderBar');
 }


 get getClimateChangeLinkElement() {
  return $('a[href="/value/climate_change"]');
}

get getProLifeLinkElement() {
  return $('a[href="/value/pro-life"]');
}

get getRepublicanClubsLinkElement() {
  return $('a[href="/value/republican_clubs"]');
}

get getLGBTQLinkElement() {
  return $('a[href="/value/lgbtq"]');
}

get getShowMoreLinkElement() {
  return $('#showMoreLink');
}

get getDemocraticPartyPoliticiansLinkElement() {
  return $('a[href="/value/democratic_party_politicians"]');
}

get getRepublicanPartyPoliticiansLinkElement() {
  return $('a[href="/value/republican_party_politicians"]');
}

get getProgressiveValuesLinkElement() {
  return $('a[href="/value/progressive_values"]');
}

get getConservativeValuesLinkElement() {
  return $('a[href="/value/conservative_values"]');
}

get getCommonSenseGunReformLinkElement() {
  return $('a[href="/value/common_sense_gun_reform"]');
}

get getGun2ndAmendmentRightsLinkElement() {
  return $('a[href="/value/gun__2nd_amendment_rights"]');
}

get getAffordableHousingLinkElement() {
  return $('a[href="/value/affordable_housing"]');
}

get getVotingRightsAndEducationLinkElement() {
  return $('a[href="/value/voting_rights__education"]');
}

get getCommunitiesOfColorLinkElement() {
  return $('a[href="/value/communities_of_color"]');
}

get getAnimalsAndWildlifeLinkElement() {
  return $('a[href="/value/animals__wildlife"]');
}

get getImmigrationRightsLinkElement() {
  return $('a[href="/value/immigration_rights"]');
}

get getCriminalJusticeReformLinkElement() {
  return $('a[href="/value/criminal_justice_reform"]');
}

get getReducingMoneyInPoliticsLinkElement() {
  return $('a[href="/value/reducing_money_in_politics"]');
}

get getSocialSecurityAndMedicareLinkElement() {
  return $('a[href="/value/social_security__medicare"]');
}

get getReducingStudentDebtLinkElement() {
  return $('a[href="/value/reducing_student_debt"]');
}

get getMarijuanaLegalizationLinkElement() {
  return $('a[href="/value/marijuana_legalization"]');
}

get getLowIncomeAndUnemploymentLinkElement() {
  return $('a[href="/value/low_income__unemployment"]');
}

get getHomelessWellBeingLinkElement() {
  return $('a[href="/value/homeless_well-being"]');
}

get getBicyclingLinkElement() {
  return $('a[href="/value/bicycling"]');
}

get getSecuringOurBordersLinkElement() {
  return $('a[href="/value/securing_our_borders"]');
}

get getWomensEqualityLinkElement() {
  return $("a[href='/value/women\\'s_equality']");
}

get getGreenPartyClubsLinkElement() {
  return $('a[href="/value/green_party_clubs"]');
}

get getLibertarianClubsLinkElement() {
  return $('a[href="/value/libertarian_clubs"]');
}

get getProPublicSchoolsLinkElement() {
  return $('a[href="/value/pro_public_schools"]');
}

get getPubliclyFundedHealthcareLinkElement() {
  return $('a[href="/value/publicly_funded_healthcare"]');
}

get getGreenPartyPoliticiansLinkElement() {
  return $('a[href="/value/green_party_politicians"]');
}

get getLibertarianPartyPoliticiansLinkElement() {
  return $('a[href="/value/libertarian_party_politicians"]');
}

get getIndependentPoliticiansLinkElement() {
  return $('a[href="/value/independent_politicians"]');
}

get getProSchoolChoiceLinkElement() {
  return $('a[href="/value/pro_school_choice"]');
}

get getMakeAmericaGreatAgainLinkElement() {
  return $('a[href="/value/make_america_great_again_\\(maga\\)"]');
}

get getAboutLinkElement() {
  return $('//a[text() = "About & FAQ"]');
}

async waitAboutLinkAndClick() {
  await this.getAboutLinkElement.waitForDisplayed({ timeout: 15000 });
  await this.getAboutLinkElement.click();
}

 get followAlertMsg(){
   return $('//div[@class="sc-dtInlm dBSTL MuiAlert-message"]');
 }

 get unfollowAlertMsg(){
   return $('//div[@class="sc-dtInlm dBSTL MuiAlert-message"]');
 }
 
 get weVoteHelpsYouMenuItem1()
 {
   return $('#weVoteHelpsYouMenuItem1');
 }

 get weVoteHelpsYouMenuItem1Text()
 {
   return $('#readyIntroductionStepText1');
 }

 get weVoteHelpsYouMenuItem2()
 {
   return $('#weVoteHelpsYouMenuItem2');
 }

 get weVoteHelpsYouMenuItem2Text()
 {
   return $('#readyIntroductionStepText2');
 }

 get weVoteHelpsYouMenuItem3()
 {
   return $('#weVoteHelpsYouMenuItem3');
 }

 get weVoteHelpsYouMenuItem3Text()
 {
   return $('#readyIntroductionStepText3');
 }

 get finePrintMenuItema()
 {
   return $('#finePrintMenuItema');
 }

 get readyFinePrintStepTexta()
 {
   return $('#readyFinePrintStepTexta');
 }

 get finePrintMenuItemb()
 {
   return $('#finePrintMenuItemb');
 }

 get readyFinePrintStepTextb()
 {
   return $('#readyFinePrintStepTextb');
 }

 get finePrintMenuItemc()
 {
   return $('#finePrintMenuitemc');
 }

 get readyFinePrintStepTextc()
 {
   return $('#readyFinePrintStepTextc');
 }

 get finePrintMenuItemd()
 {
   return $('#finePrintStepd');
 }

 get readyFinePrintStepTextd()
 {
   return $('#readyFinePrintStepTextd');
 }


 get topicToolTipMsg()
 {
   return $('#topicToolTipMsg');
 }


 get topicIconToolTipMsg()
 {
   return $('#topicToolTipMsg');
 }


 get topicName()
 {
   return $("//*[contains(text(), '_topicName')]");
 }


 get topicName_DemocraticClubs()
 {
   return $('#Democratic Clubs_topicName');
 }


 get topicName_ProLife()
 {
   return $('#Pro-life_topicName');
 }

 get enterYourAddressLink()
 {
   return $('#enterAddressText');
 }

 get enterYourAddressWindowHeader()
 {
   return $('#SelectBallotModalTitleId');
 }

 get linkToTwitterAcct()
 {
   return $("//span[contains(text(), 'Link to your Twitter account')]");

 }

 async followAlertMsgText(){
   await this.followAlertMsg.getText();
 }
 async unfollowAlertMsgText(){
   await this.unfollowAlertMsg.getText();
 }

 async login () {
   const waitTime = 5000;
   await this.load();
   await driver.pause(waitTime);
   await driver.waitUntil(async () => (this.getSignInElement.isClickable()));
   await this.getSignInElement.click();
   await driver.waitUntil(async () => (this.getMobilePhoneNumberElement.isClickable()));
   await this.getMobilePhoneNumberElement.setValue('8089358555');
   await driver.waitUntil(async () => (this.getSendCodeElement.isClickable()));
   await this.getSendCodeElement.click();
   await driver.waitUntil(async () => (this.getCodeVerificationDigit1Element.isClickable()));
   await this.getCodeVerificationDigit1Element.setValue('1');
   await driver.waitUntil(async () => (this.getCodeVerificationDigit2Element.isClickable()));
   await this.getCodeVerificationDigit2Element.setValue('2');
   await driver.waitUntil(async () => (this.getCodeVerificationDigit3Element.isClickable()));
   await this.getCodeVerificationDigit3Element.setValue('3');
   await driver.waitUntil(async () => (this.getCodeVerificationDigit4Element.isClickable()));
   await this.getCodeVerificationDigit4Element.setValue('4');
   await driver.waitUntil(async () => (this.getCodeVerificationDigit5Element.isClickable()));
   await this.getCodeVerificationDigit5Element.setValue('5');
   await driver.waitUntil(async () => (this.getCodeVerificationDigit6Element.isClickable()));
   await this.getCodeVerificationDigit6Element.setValue('6');
   await driver.waitUntil(async () => (this.getVerifyButtonElement.isClickable()));
   await this.getVerifyButtonElement.click();
 }

 async load () {
   await super.open('/ready');
 }

 async signIn () {
   await super.signIn();
 }

 async openBallotModal () {
   await this.ballotTitle.findAndClick();
 }

 async openBallotcount () {
   await this.electionCountDownTitle.findAndClick();
 }

 async updateBallotAddress (ballotAddress) {
   await this.ballotAddress.findAndClick();
   await this.ballotAddressInput.setValue(ballotAddress);
   await this.selectAddress.click();
   await this.saveBallotAddressButton.findAndClick();
 }

 async followFirstIssue () {
   await this.followIssueButtons[0].findAndClick();
 }

 async unfollowFirstIssue () {
   await this.toggleFollowMenuButtons[0].findAndClick();
   await this.unfollowIssueButtons[0].findAndClick();
 }

 async unfurlIssues () {
   await this.unfurlIssuesButton.findAndClick();
 }

 async toggleIntroduction () {
   await this.toggleIntroductionButton.findAndClick();
 }

 async toggleIntroStepText () {
   await this.introductionStepText.findAndClick();
 }

 async toggleFinePrint () {
   await this.toggleFinePrintButton.findAndClick();
 }

}
export default new ReadyPage();
