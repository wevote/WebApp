import { $, $$ } from '@wdio/globals';
import Page from './page';

class ReadyPage extends Page {
  constructor () {
    super().title = 'Ready to Vote? - We Vote';
  }

  get electionCountDown () {
    return $('#electionCountDown');
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

  get toggleIntroductionButton () {
    return $('#showMoreReadyIntroductionCompressed');
  }

  get introductionStepText () {
    return $$('//*[contains(@id, "readyIntroductionStepText")]');
  }

  get toggleFinePrintButton () {
    return $('#showMoreReadyFinePrintCompressed');
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

  async open () {
    await super.open('/ready');
  }

  async openBallotModal () {
    await this.ballotTitle.click();
  }

  async saveBallotAddress () {
    await this.saveBallotAddressButton.click();
  }

  async followFirstIssue () {
    const followIssueButtons = await this.followIssueButtons;
    const firstFollowIssueButton = followIssueButtons[0];
    await firstFollowIssueButton.click();
  }

  async unfollowFirstIssue () {
    // Open the follow menu
    const toggleFollowMenuButtons = await this.toggleFollowMenuButtons;
    const firstToggleFollowMenuButton = toggleFollowMenuButtons[0];
    await firstToggleFollowMenuButton.click();
    // Unfollow the issue
    const unfollowIssueButtons = await this.unfollowIssueButtons;
    const firstUnfollowIssueButton = unfollowIssueButtons[0];
    await firstUnfollowIssueButton.click();
  }
}

export default new ReadyPage();
