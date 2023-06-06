import { $, $$ } from '@wdio/globals';
import Page from './page';

class ReadyPage extends Page {
  constructor () {
    super().title = 'Ready to Vote? - We Vote';
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
    return $('#toggleContentButton-showMoreReadyPageValuesList');
  }

  get toggleIntroductionButton () {
    return $('#toggleContentButton-showMoreReadyIntroductionCompressed');
  }

  get introductionStepText () {
    return $$('//*[contains(@id, "readyIntroductionStepText")]');
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

  get footer () {
    return $('#footer');
  }

  async load () {
    await super.open('/ready');
    await super.maximizeWindow();
    await super.rerender();
  }

  async openBallotModal () {
    await this.ballotTitle.click();
    await super.rerender();
  }

  async updateBallotAddress (ballotAddress = 'New York, NY, USA') {
    await this.ballotAddress.click();
    await super.rerender();
    await this.ballotAddressInput.setValue(ballotAddress);
    await super.rerender();
    await this.saveBallotAddressButton.click();
    await super.rerender();
  }

  async followFirstIssue () {
    await this.followIssueButtons[0].scrollIntoView({ block: 'center', inline: 'center' });
    await super.rerender();
    await this.followIssueButtons[0].click();
    await super.rerender();
  }

  async unfollowFirstIssue () {
    // Open the follow menu
    await this.toggleFollowMenuButtons[0].click();
    await super.rerender();
    // Unfollow the issue
    await this.unfollowIssueButtons[0].click();
    await super.rerender();
  }

  async unfurlIssues () {
    await this.unfurlIssuesButton.scrollIntoView({ block: 'center', inline: 'center' });
    await super.rerender();
    await this.unfurlIssuesButton.click();
    await super.rerender();
  }

  async toggleIntroduction () {
    await this.toggleIntroductionButton.scrollIntoView({ block: 'center', inline: 'center' });
    await super.rerender();
    await this.toggleIntroductionButton.click();
    await super.rerender();
  }

  async toggleFinePrint () {
    await this.toggleFinePrintButton.scrollIntoView({ block: 'center', inline: 'center' });
    await super.rerender();
    await this.toggleFinePrintButton.click();
    await super.rerender();
  }
}

export default new ReadyPage();
