import { $ } from '@wdio/globals';
import Page from './page';

class ReadyPage extends Page {
  constructor () {
    super().title = 'Ready to Vote? - We Vote';
  }

  get findYourFriendsButton () {
    return $('#viewUpcomingBallotFindYourFriends');
  }

  async open () {
    await super.open('/ready');
  }
}

export default new ReadyPage();
