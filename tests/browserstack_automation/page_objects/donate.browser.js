import { $, driver, expect, browser } from '@wdio/globals';
import path from 'path';
import PageBrowser from './page.browser';

class DonateBrowser extends PageBrowser {
  constructor () {
    super().title = 'Donate - WeVote';
  }

  async load () {
    await driver.switchFrame(null);
    await super.open('/donate');
  }

  async checkLinkAndTite () {
    await expect(driver).toHaveUrl(`${path}/donate`);
    await expect(driver).toHaveTitle('Donate - WeVote');
  }

  getDonateHeader () {
    return $('#want_to_vote');
  }

  getFirstParagraph () {
    return $('(//*[@id="first_paragraph"])[2]');
  }

  getSecondParagraph () {
    return $('(//*[@id="second_paragraph"])[2]');
  }

  getTextLink () {
    return $('#budgets_small');
  }

  getDonationCopy () {
    return $('.u-show-desktop-tablet #donation_copy');
  }

  async selectDonationInterval (interval) {
    await driver.execute('document.getElementById(arguments[0]).click();', `plan_duration_${interval}`);
  }

  getDonationInterval (interval) {
    return $(`#plan_duration_${interval}`);
  }

  async enableDedication () {
    const checkbox = $('#honor_in_memory');
    if (!await checkbox.isSelected()) {
      await driver.execute('document.getElementById(arguments[0]).click();', 'honor_in_memory');
    }
  }

  getOneTimeButton () {
    return $('#plan_duration_one_time');
  }

  getDonateAmountButton (amount) {
    return $(`//span[text()="${amount}"]`);
  }

  getDonorBoxIFrame () {
    return $('.u-show-desktop-tablet #donorbox-iframe');
  }

  getCommentField () {
    return $('#ty-msg');
  }

  getNextButton () {
    return $('#footer_button');
  }

  getPayPalButton () {
    return $('.paypal');
  }

  getPayPalButton2 () {
    return $('.paypal-button-container');
  }

  getPayPalIFrame () {
    return $('//iframe[@title="PayPal"]');
  }

  getPayPalCancelLink () {
    return $('#cancelLink');
  }

  getOptionalFeesCheckbox () {
    return $('#ask_for_cover_fee');
  }

  getOneTimeLabel () {
    return $('.donation-interval.plan_duration_one_time');
  }

  getOneTimeAmount () {
    return $('h3 > var > span');
  }

  getMonthlyButton () {
    return $('#plan_duration_monthly');
  }

  getHeartIcon () {
    return $('svg.heart');
  }

  getCustomAmountField () {
    return $('#donation_custom_amount');
  }

  getCommentCheckbox () {
    return $('//span[text()="Write us a comment"]/../span[4]');
  }

  getDisplayDonationCheckbox () {
    return $('//span[contains(text(), "on the donor wall")]/../span[4]');
  }

  getDisplayFirstNameCheckbox () {
    return $('//span[contains(text(), "first name instead")]/../span[4]');
  }

  getHideDonationAmountCheckbox () {
    return $('//span[contains(text(), "Hide donation")]/../span[4]');
  }

  getDedicateMyDonationCheckbox () {
    return $('#honor_in_memory');
  }

  getInMemoryOfRadioButton () {
    return $('label[for="donation_donation_honor_attributes_honor_type_memory"]');
  }

  getPostalMailRadioButton () {
    return $('label[for="donation_donation_honor_attributes_notify_type_postal"]');
  }

  getFirstName () {
    return $('#donation_first_name');
  }

  getLasttName () {
    return $('#donation_last_name');
  }

  getEmail () {
    return $('#donation_email');
  }

  getDonateButton () {
    return $('#footer_button');
  }

  getIntervalLabel () {
    return $('.plan_duration_monthly.interval');
  }

  getProcessingFeeLabel () {
    return $('(//span[@class="processing_fee"])[2]');
  }

  getMonthlyAmount () {
    return $('(//span[@class="donation-amt"])[3]');
  }

  getQuarterlyAmount () {
    return $('(//span[@class="donation-amt"])[4]');
  }

  getAnnuallyAmount () {
    return $('(//span[@class="donation-amt"])[5]');
  }

  getQuarterlyButton () {
    return $('#plan_duration_quarterly');
  }

  getAnnuallyButton () {
    return $('#plan_duration_annual');
  }

  getHonoreeNameField () {
    return $('#donation_donation_honor_attributes_honoree_name');
  }

  getRecipientNameField () {
    return $('#donation_donation_honor_attributes_recipient_name');
  }

  getRecipientEmailField () {
    return $('#donation_donation_honor_attributes_recipient_email');
  }

  getRecipientMessageField () {
    return $('#donation_donation_honor_attributes_recipient_message');
  }

  getCustomAmountError () {
    return $('.desc.invalid');
  }

  getFieldRequiredError (number) {
    return $(`(//div[@class="dwm-error"])[${number}]`);
  }

  getFixErrors () {
    return $('#info-error');
  }

}

export default new DonateBrowser();
