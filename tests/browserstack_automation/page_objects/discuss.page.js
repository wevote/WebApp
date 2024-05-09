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



  get emailFriendsTextBox () {
    return $('#EmailAddress-sidebar');
  }

  get emailSignInTextBox () {
    return $('#voterEmailAddressEntrySendCode');
  }

  get emailVerificationButton () {
    return $('#voterEmailAddressEntrySendCode');
  }

  get inviteFriendsButton () {
    return $('#friendsNextButton-sidebar');
  }

  async toggleEmailVerificationButton () {
    await this.emailVerificationButton.findAndClick();
  }
}

export default new DiscussPage();
