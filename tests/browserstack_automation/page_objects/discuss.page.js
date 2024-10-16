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

  async tabToSelectElement(driver, targetElementId) {
    // Max number of iterations to find target element.
    // Prevents waiting for a timeout when the element is missing or unreachable.
    const maxCount = 100;
    let count = 0;

    let activeElement;
    let activeElementId;

    do {
      await driver.keys(['Tab']);
      activeElement = await driver.getActiveElement();
      activeElementId = await (await $(activeElement)).getProperty('id');
      if (targetElementId === activeElementId) {
        return $(activeElement);
      }
      ++count;
    } while (activeElementId !== targetElementId && count <= maxCount);
    return null;
  }
}
export default new DiscussPage();
