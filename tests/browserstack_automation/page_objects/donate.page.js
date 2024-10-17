import { $, $$, driver } from '@wdio/globals';
import Page from './page';

class DonatePage extends Page {
  constructor () {
    super().title = 'Donate - WeVote';
  }

  async load () {
    await super.open('/donate');
  }

  async checkLinkAndTite () {
    await expect(driver).toHaveUrl('https://quality.wevote.us/donate');
    await expect(driver).toHaveTitle('Donate - WeVote');
  }

  getDonateHeader () {
    return $('//*[@id="app"]//h1');
  } 

  getFirstParagraph () {
    return $('//*[@id="app"]/div/div[2]/div/div/div[2]/div[1]/span[1]');
  }

  getSecondParagraph () {
    return $('//*[@id="app"]/div/div[2]/div/div/div[2]/div[1]/span[2]');
  }

  getTextLink () {
    return $('#annualBudget > span');
  }

  getOneTimeButton () {
    return $('//label[@for="plan_duration_one_time"]');
  }

  getDonateAmountButton (amount) {
    return $('//span[(text()=' + amount + ')]');
  }

  getDonorBoxIFrame () {
    return $('#donorbox-iframe');
  }

  getCommentCheckbox () {
    return $('//*[@id="standard-donation-section"]/div[6]/div/label/span[4]');
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
    return $('//*[@id="donation-amount-description"]/div/h3/span[2]');
  }

  getAmount () {
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

  getDisplayDonationCheckbox () {
    return $('//*[@id="standard-donation-section"]/div[8]/div[1]/div/label/span[4]');
  }

  getDisplayFirstNameCheckbox () {
    return $('//*[@id="standard-donation-section"]/div[8]/div[2]/div/label/span[4]');
  }

  getHideDonationAmountCheckbox () {
    return $('//*[@id="standard-donation-section"]/div[8]/div[3]/div/label/span[4]');
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

  getMonthlyLabel () {
    return $('//*[@id="linkButton"]/span[1]/span[2]');
  }

  getProcessingFeeLabel () {
    return $('//*[@id="donor-form-step-4"]/div/label[2]/span/var/span');
  }

  getMonthlyAmount () {
    return $('//*[@id="linkButton"]/span[1]/span[2]/var/span');
  } 

  getQuarterlyAmount () {
    return $('//*[@id="linkButton"]/span[1]/span[3]/var/span');
  } 

  getAnnuallyAmount () {
    return $('//*[@id="linkButton"]/span[1]/span[4]/var/span');
  } 

  getQuarterlyButton () {
    return $('label[for="plan_duration_quarterly"]');
  }

  getAnnuallyButton () {
    return $('label[for="plan_duration_annual"]');
  }

  getDedicateMyDonationCheckbox () {
    return $('//*[@id="standard-donation-section"]/div[5]/div/label/span[4]');
  }

  getInMemoryOfRadioButton () {
    return $('label[for="donation_donation_honor_attributes_honor_type_memory"]');
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
