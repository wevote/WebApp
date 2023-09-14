import { $, $$ } from '@wdio/globals';
import Page from './page';

class ReadyPage extends Page {
  constructor () {
    super().title = 'Ready to Vote? - We Vote';
  }

  get avatar () {
    return super.avatar;
  }

  get electionCountDownTitle () {
    return $('#electionCountDownTitle');
  }

  get ballotTitle () {
    return $('//*[contains(@id, "ballotTitleHeader")]');
  }

  get ballotAddress () {
    return $('//*[contains(@id, "ballotTitleBallotAddress")]');
  }

  get ballotAddressInput () {
    return $('#entryBox');
  }

  get saveBallotAddressButton () {
    return $('//*[contains(@id, "addressBoxModalSaveButton")]');
  }

  get viewUpcomingBallotButton () {
    return $('//*[contains(@id, "viewUpcomingBallot")]');
  }

  get unfurlIssuesButton () {
    return $('//*[contains(@id, "showMoreReadyPageValuesList")]');
  }

  get toggleIntroductionButton () {
    return $('//*[contains(@id, "showMoreReadyIntroductionCompressed")]');
  }

  get introductionStepText () {
    return $$('//*[contains(@id, "readyIntroductionStepText")]');
  }

  get toggleFinePrintButton () {
    return $('//*[contains(@id, "showMoreReadyFinePrintCompressed")]');
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

  async load () {
    await super.open('/ready');
  }

  async signIn () {
    await super.signIn();
  }

  async openBallotModal () {
    await this.ballotTitle.findAndClick();
  }

  async updateBallotAddress (ballotAddress = 'New York, NY, USA') {
    await this.ballotAddress.findAndClick();
    await this.ballotAddressInput.setValue(ballotAddress);
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

  async toggleFinePrint () {
    await this.toggleFinePrintButton.findAndClick();
  }
}

export default new ReadyPage();
