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

  get emailAddressSidebarFriendsTextBox () {
    return $('#EmailAddress-sidebar');
  }


  get voterEmailAddressVerificationButton () {
    return $('#voterEmailAddressEntrySendCode');
  }

  get inviteFriendsNextsButton () {
    return $('#friendsNextButton-sidebar');
  }

  get cancelEmailButton () {
    return $('#cancelEmailButton');
  }

  get enterVoterEmailAddressTextBox () {
    return $('#enterVoterEmailAddress');
  }

  async toggleEmailVerificationButton () {
    await this.voterEmailAddressVerificationButton.findAndClick();
  }
}

export default new DiscussPage();
