import { $ } from '@wdio/globals';
import Page from './page';

class DiscussPage extends Page {
  constructor () {
    super().title = 'Discuss - We Vote';
  }

  async load () {
    await super.open('/news');
    // await super.maximizeWindow();
    // await super.rerender();
  }

  get getEmailPlaceholderText () {
    return $('[placeholder="Type email here..."]');
  }

  get emailFriendsTextBox () {
    return $('#EmailAddress-sidebar');
  }


  get emailVerificationButton () {
    return $('#voterEmailAddressEntrySendCode');
  }

  get inviteFriendsButton () {
    return $('#friendsNextButton-sidebar');
  }

  get cancelEmailButton () {
    return $('#cancelEmailButton');
  }

  get emailTextBox () {
    return $('#enterVoterEmailAddress');
  }

  async toggleEmailVerificationButton () {
    await this.emailVerificationButton.findAndClick();
  }
}

export default new DiscussPage();
