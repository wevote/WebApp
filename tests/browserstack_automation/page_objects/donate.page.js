import { $, driver } from '@wdio/globals';
import Page from './page';

class DonatePage extends Page {
  constructor () {
    super().title = 'Donate - WeVote';
  }

  async load () {
    await super.open('/donate');
  }

  async checkLinkAndTite () {
    await expect(driver).toHaveUrl(path + '/donate');
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

  getOneTimeButton () {
    return $('#plan_duration_one_time');
  }

  getDonateAmountButton (amount) {
    return $('//span[(text()=' + amount + ')]');
  }

  getDonorBoxIFrame () {
    return $('#donorbox-iframe');
  }

  getCommentField () {
    return $('#ty-msg');
  }

  getNextButton () {
    return $('.next');
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
    return $('//span[contains(text(), "Dedicate")]/../span[4]');
  }

  getInMemoryOfRadioButton () {
    return $('label[for="donation_donation_honor_attributes_honor_type_memory"]');
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

}

export default new DonatePage();
