import { $, $$ } from '@wdio/globals';
import Page from './page';

class ReadyPage extends Page {
  constructor () {
    super().title = 'Ready to Vote? - We Vote';
  }

  get viewUpcomingBallotButton () {
    return $('//*[contains(@id, "viewUpcomingBallot")]');
  }

  get followIssueButtons () {
    return $$('//*[contains(@id, "issueFollowButton")]');
  }

  get toggleFollowMenuButtons () {
    return $$('#toggle-button');
  }

  get unfollowIssueButtons () {
    return $$('//*[contains(@id, "issueUnfollowButton")]');
  }

  async open () {
    await super.open('/ready');
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
