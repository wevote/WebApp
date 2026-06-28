import { browser, driver, expect } from '@wdio/globals';
import ReadyPage from '../page_objects/ready.browser';
import DonatePage from '../page_objects/donate.browser';

/* eslint-disable no-undef */
// This eslint-disable turns off warnings for describe() and it()
// We don't need those warnings, because describe() and it() are available at runtime
// https://webdriver.io/docs/pageobjects

const validEmailError = 'Please enter a valid email address';
const validEmail = 'dd@gmail.com';

const openDonationWidget = async () => {
  await DonatePage.load();
  const iframe = await DonatePage.getDonorBoxIFrame();
  await expect(iframe).toBeDisplayed();
  await driver.switchFrame(iframe);
};

const submitAmountStep = async () => {
  const nextButton = DonatePage.getNextButton();
  await nextButton.scrollIntoView();
  await expect(nextButton).toBeDisplayed();
  await nextButton.click();
};

describe('DonatePage', () => {
  // Donate_001
  it('verifyDonatePageAfterClickDonateLinks', async () => {
    await ReadyPage.load();
    await ReadyPage.getDonateLinkHeader.click();
    DonatePage.checkLinkAndTite();

    await ReadyPage.load();
    await expect(driver).toHaveTitle('Ready to Vote? - WeVote');
    await ReadyPage.getDonateLinkFooter.click();
    DonatePage.checkLinkAndTite();
  });

  // Donate_002
  it('verifyTextAndDonationWidget', async () => {
    await DonatePage.load();
    await expect(await DonatePage.getDonationCopy()).toHaveText('Become a sustainer of WeVote! With 150+ active volunteers and ' +
      '150,000+ voters, our hard costs are ~$4,000 per month. Your donations go toward servers, data fees, collaboration ' +
      'tools, and other critical paid services we can\'t get for free.');
  });

  // Donate_003
  it('verifyDonationWidget', async () => {
    await openDonationWidget();
    await expect(DonatePage.getMonthlyButton()).toBeChecked();
    await expect(DonatePage.getCustomAmountField()).toHaveValue('10');
  });

  // Donate_004
  it('verifyOneTimePayment', async () => {
    await openDonationWidget();
    await DonatePage.selectDonationInterval('one_time');
    await expect(DonatePage.getDonationInterval('one_time')).toBeChecked();
    await DonatePage.getCustomAmountField().setValue('100');
    await expect(DonatePage.getCustomAmountField()).toHaveValue('100');
  });

  // Donate_005
  it('verifyMonthlyCustomPayment', async () => {
    await openDonationWidget();
    await expect(DonatePage.getMonthlyButton()).toBeChecked();
    await DonatePage.getCustomAmountField().setValue('5.01');
    await expect(DonatePage.getCustomAmountField()).toHaveValue('5.01');
  });

  // Donate_006
  it('verifyQuarterlyPaymentDedicatedInMemory', async () => {
    await openDonationWidget();
    await DonatePage.selectDonationInterval('quarterly');
    await expect(DonatePage.getDonationInterval('quarterly')).toBeChecked();
    await DonatePage.enableDedication();
    await expect(DonatePage.getDedicateMyDonationCheckbox()).toBeChecked();
    await DonatePage.getInMemoryOfRadioButton().click();
    await DonatePage.getHonoreeNameField().setValue('John F. Kennedy');
    await DonatePage.getRecipientNameField().setValue('Bill Clinton');
    await DonatePage.getRecipientEmailField().setValue('bill@gmail.com');
    await DonatePage.getRecipientMessageField().setValue('Donation in memory of John F. Kennedy');
    await expect(DonatePage.getHonoreeNameField()).toHaveValue('John F. Kennedy');
    await expect(DonatePage.getRecipientEmailField()).toHaveValue('bill@gmail.com');
  });

  // Donate_007
  it('verifyAnnuallyCustomPayment', async () => {
    await openDonationWidget();
    await DonatePage.selectDonationInterval('annual');
    await expect(DonatePage.getDonationInterval('annual')).toBeChecked();
    await DonatePage.getCustomAmountField().setValue('300');
    await expect(DonatePage.getCustomAmountField()).toHaveValue('300');
  });

  // Donate_008
  it('verifyEmptyAmountErrorMessage', async () => {
    await openDonationWidget();
    await DonatePage.selectDonationInterval('one_time');
    await DonatePage.getCustomAmountField().setValue('');
    await submitAmountStep();
    await expect(DonatePage.getCustomAmountError()).toHaveText('#Please select or enter an amount');
  });

  // Donate_009
  it('verifyMinimumAmountErrorMessage', async () => {
    await openDonationWidget();
    await DonatePage.selectDonationInterval('one_time');
    await DonatePage.getCustomAmountField().setValue('4.99');
    await submitAmountStep();
    await expect(DonatePage.getCustomAmountError()).toHaveText('Please enter an amount of at least $5');
  });

  // Donate_010
  it('verifyValidRecipientEmail', async () => {
    await openDonationWidget();
    await DonatePage.enableDedication();
    await DonatePage.getHonoreeNameField().setValue('John Wick');
    await DonatePage.getRecipientEmailField().setValue(`${validEmail}1`);
    await browser.keys('Tab');
    await expect(DonatePage.getFieldRequiredError(1)).toHaveText(`#${validEmailError}`);
  });
});
