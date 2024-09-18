import { $, $$ } from '@wdio/globals';
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
    return $('#ballotTitleBallotAddress');
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
    return $('div>h3[class~="gNNNpX"]');
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
    return $('span[class = u-link-color]');
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
    return $('.bpNVDR');
  }

  get getCreditsAndThanksElement () {
    return $('#footerLinkCredits');
  }

  get getCreditsAndThanksPageTitleElement () {
    return $('.fmguXD');
  }

  get getVolunteeringOpportunitiesElement () {
    return $('#footerLinkVolunteer');
  }

  get getVolunteeringOpportunitiesPageTitleElement () {
    return $('.page-title-open');
  }

  get getDonateLinkLocator () {
    return $('[href = "/donate"]');
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
