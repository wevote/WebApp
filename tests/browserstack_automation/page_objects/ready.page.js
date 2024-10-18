import { $, $$ , expect} from '@wdio/globals';
import { $, $$ , expect} from '@wdio/globals';
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

  get ballotTitle () {
    return $('//*[contains(@id, "ballotTitleHeader")]');
  }

  get ballotAddress () {
    //return $('#ballotTitleBallotAddress');
    return $('//span[@class ="u-cursor--pointer u-link-color u-link-underline-on-hover"]');

    //return $('#ballotTitleBallotAddress');
    return $('//span[@class ="u-cursor--pointer u-link-color u-link-underline-on-hover"]');

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
  }

  get introductionStepText () {
    return $$('//*[contains(@id, "readyIntroductionStepText")]');
  }

  get getIntroText () {
    return $('.StepText-sc-lvvjo6-11 kIDCci');
  }

  get toggleFinePrintButton () {
    return $('#toggleContentButton-showMoreReadyFinePrintCompressed');
  }

  get finePrintStepText () {
    return $$('//*[contains(@id, "readyFinePrintStepText")]');
  }

  get finePrintStepHeaderText1()
  {
    return $("(//div[@class='StepTitle-sc-lvvjo6-10 iKrjzD'][normalize-space()='You cannot cast your vote electronically'])[1]");
  }

  get finePrintStepHeaderText2()
  {
    return $('//div[text() = "WeVote does not represent a government entity"]');
  }

  get finePrintStepHeaderText3()
  {
    return $('//div[text() = "Please make sure you are registered to vote"]');
  }

  get finePrintStepHeaderText4()
  {
    return $('//div[text() = "How your data is used & protected"]');
  }

  async checkFinePrintHeaders()
  {
    const text1 = (await this.finePrintStepHeaderText1);
    console.log("text1: " + text1);
    const text2 = (await this.finePrintStepHeaderText2);
    console.log("text2: " + text2);
    const text3 = (await this.finePrintStepHeaderText3);
    console.log("text3: " + text3);
    const text4 = (await this.finePrintStepHeaderText4);
    console.log("text4: " + text4);

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
    //return $('div>h3[class~="gNNNpeadyFinePrintStepTextX"]');
    return $('//h3[text()="1. Choose your interests"]');
    //return $('div>h3[class~="gNNNpeadyFinePrintStepTextX"]');
    return $('//h3[text()="1. Choose your interests"]');
  }

  get howItWorksCloseIcon () {
    return $('[data-testid = "CloseIcon"] > path');
  }

  get findPrivacyLink () {
    return $('#footerLinkPrivacy');
  }

 

  get findNextButtonHowItWorksWindow () {
    return $('.kMeOcV');
  }

  get findBackButtonHowItWorksWindow () {
    return $('//button[text() = "Back"]');
  }

  get getStartedButton () {
    return $('.cqTvJR>button');
  }

  get getTitleSignUpPopUp () {
    return $('.u-f3');
  }

  get elementHowItWorksWindow () {
    return $('.sc-dcJsrY');
  }

  get ballotForAddress () {
    //return $('span[class = u-link-color]');
    return $('(span[class~="u-link-underline-on-hover"])');
   // return $ ('.u-cursor--pointer u-link-color u-link-underline-on-hover');
   }

  get getHelpLinkElement () {
    return $('#footerLinkWeVoteHelp');
  }

  get getHelpPageTitleElement () {
    return $('section h1');
  }

  get getTermsLinkElement () {
    return $('#footerLinkTermsOfUse');
  }

  get getTeamLinkElement () {
    return $('#footerLinkTeam');
  }

  get getTeamPageTitleElement () {
    //return $('.bpNVDR');
    return $("//h1[normalize-space()='About WeVote']");
  }

  get getCreditsAndThanksElement () {
    return $('#footerLinkCredits');
  }

  get getCreditsAndThanksPageTitleElement () {
    //return $('.fmguXD');
    return $("//h1[normalize-space()='Credits & Thanks']");
  }

  get getVolunteeringOpportunitiesElement () {
    return $('#footerLinkVolunteer');
  }

  get getVolunteeringOpportunitiesPageTitleElement () {
    return $('.page-title-open');
  }

  get getDonateLinkLocator () {
   return $('[href = "/donate"]');
   //return $('.FooterMainWeVote-link-77=Donate');
  // return $('//a[contains(text(),"Donate")]');
  }

  get getAboutLinkElement () {
    return $('//a[text() = "About & FAQ"]');
  }

  async waitAboutLinkAndClick () {
    await this.getAboutLinkElement.waitForDisplayed({ timeout: 15000 });
    // await driver.pause(9000);
    await this.getAboutLinkElement.click();
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

  async clickHowItWorksLink () {
    await this.howItWorksLink.click();
  }

  async closeHowItWorksModalWindow () {
    await this.howItWorksCloseIcon.click();
  }

  async clickNextButtonHowItWorksWindow () {
    let num = Math.floor(Math.random() * 5);
    if (num === 0) {
      num += 1;
    }

    for (let i = 1; i <= num; i++) {
      this.findNextButtonHowItWorksWindow.click();
    }
    return num;
  }

  async checkTitleOfHowItWorksWindow () {
    const num = await this.clickNextButtonHowItWorksWindow();
    if (num === 1) {
      return '2. Follow organizations and people you trust';
    } else if (num === 2) {
      return '3. See who endorsed each choice on your ballot';
    } else if (num === 3) {
      return '4. Complete your ballot with confidence';
    } else {
      return '5. Share with friends who could use a guide';
    }
  }

  async getTitleOfHowItWorksWindowAfterBackButton () {
    const num = await this.clickNextButtonHowItWorksWindow();
    await this.findBackButtonHowItWorksWindow.click();

    if (num === 1) {
      return '1. Choose your interests';
    } else if (num === 2) {
      return '2. Follow organizations and people you trust';
    } else if (num === 3) {
      return '3. See who endorsed each choice on your ballot';
    } else {
      return '4. Complete your ballot with confidence';
    }
  }

  async clickGetStartedButton () {
    await this.getStartedButton.click();
  }

  async clickNextButtonFourTimes () {
    for (let i = 1; i <= 4; i++) {
      this.findNextButtonHowItWorksWindow.click();
    }
  }



}

export default new ReadyPage();
