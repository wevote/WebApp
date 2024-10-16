import { driver, expect, $ } from '@wdio/globals';
import ReadyPage from '../page_objects/ready.page';
import DonatePage from '../page_objects/donate.page';
import { attach } from 'webdriverio';

/* eslint-disable no-undef
   This eslint-disable turns off warnings for describe() and it()
   We don't need those warnings, because describe() and it() are available at runtime
   Refer to https://webdriver.io/docs/pageobjects for guidance */

const waitTime = 2000;

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
    await expect(DonatePage.getDonateHeader()).toHaveText('Want more Americans to vote?');
    await expect(DonatePage.getFirstParagraph()).toHaveText('Thank you for being a voter! For every $10 donated, '
      + 'you help 50 Americans be voters too.');
    await expect(DonatePage.getSecondParagraph()).toHaveText('Our budgets are small,so every tax-deductible '
      + 'donation helps us reach more voters.' 
      + '\n\n'
      + 'Expenses include server costs ($600 - $2,500 per '
    + 'month), data fees (~$40,000 per year), collaboration tools and other hard costs.');
  });

  // Donate_003
  it('verifyNonProfitExplorerLink', async () => {
    await DonatePage.load();
    const element = await DonatePage.getTextLink();
    await driver.execute("arguments[0].click();", element);
    const allWindowHandles = await driver.getWindowHandles();
    await driver.switchToWindow(allWindowHandles[allWindowHandles.length - 1]);
    await expect(driver).toHaveTitle('We Vote - Nonprofit Explorer - ProPublica');
  });

  // Donate_004
  it('verifyOneTimePayment', async () => {
    await DonatePage.load();
    await driver.switchToFrame(await DonatePage.getDonorBoxIFrame());

    (await DonatePage.getOneTimeButton()).click();
    (await DonatePage.getDonateAmountButton(120)).click();
    
    const checkbox = await DonatePage.getCommentCheckbox();
    const isChecked = await checkbox.isSelected();
    if (!isChecked) {
        await checkbox.click();
    }

    await DonatePage.getCommentField().setValue('Hello, WeVote!');
    const value = await DonatePage.getCommentField().getValue();
    await expect(value).toBe('Hello, WeVote!');

    const nextButton = await DonatePage.getNextButton();
    await nextButton.scrollIntoView();
    await expect(nextButton).toBeDisplayed();
    await nextButton.click();

    await DonatePage.getPayPalButton().click();
    await expect(DonatePage.getOneTimeLabel()).toHaveText("One-time");
    await expect(DonatePage.getAmount()).toHaveText('$125.17');

    await driver.switchToFrame(await DonatePage.getPayPalIFrame());
    await DonatePage.getPayPalButton2().click();

    const allWindowHandles = await driver.getWindowHandles();
    await driver.switchToWindow(allWindowHandles[allWindowHandles.length - 1]);
    await expect(driver).toHaveTitle('Log in to your PayPal account');
    (await DonatePage.getPayPalCancelLink()).click();
    const originalWindowHandle = allWindowHandles[0];
    await driver.switchToWindow(originalWindowHandle);
    await expect(DonatePage.getDonateHeader()).toHaveText('Want more Americans to vote?');
    await expect(driver).toHaveTitle('Donate - WeVote');
  });

  // Donate_005
  it('verifyMonthlyCustomPayment', async () => {
    await DonatePage.load();
    await driver.switchToFrame(await DonatePage.getDonorBoxIFrame());

    await expect(DonatePage.getMonthlyButton()).toBeChecked();
    await expect(DonatePage.getHeartIcon()).toBeDisplayed();

    await DonatePage.getCustomAmountField().setValue('5.01');
    const value = await DonatePage.getCustomAmountField().getValue();
    await expect(value).toBe('5.01');

    const checkbox = await DonatePage.getDisplayDonationCheckbox();
    const isChecked = await checkbox.isSelected();
    if (!isChecked) {
        await checkbox.click();
    }

    const nextButton = await DonatePage.getNextButton();
    await nextButton.scrollIntoView();
    await expect(nextButton).toBeDisplayed();
    await nextButton.click();

    await DonatePage.getFirstName().setValue('Dmytro');
    await DonatePage.getLasttName().setValue('Dolbilov');
    await DonatePage.getEmail().setValue('dolbilov@gmail.com');
    await nextButton.click();

    const elementText = await DonatePage.getMonthlyLabel().getText();
    expect(elementText.includes('Monthly')); 
    await expect(DonatePage.getProcessingFeeLabel()).toHaveText('$0.70');
    await expect(DonatePage.getMonthlyAmount()).toHaveText('$5.71');
    (await DonatePage.getOptionalFeesCheckbox()).click();
    await expect(DonatePage.getMonthlyAmount()).toHaveText('$5.01');

    (await DonatePage.getDonateButton()).click();
    await expect(driver).toHaveTitle('Log in to your PayPal account');
    await driver.pause(waitTime);
  });

  // Donate_006
  it('verifyQuarterlyPaymentDedicatedInMemory', async () => {
    await DonatePage.load();
    await driver.switchToFrame(await DonatePage.getDonorBoxIFrame());

    (await DonatePage.getQuarterlyButton()).click();
    (await DonatePage.getDonateAmountButton(50)).click();
    (await DonatePage.getDedicateMyDonationCheckbox()).click();
    (await DonatePage.getInMemoryOfRadioButton()).click();
    (await DonatePage.getHonoreeNameField()).setValue('John F. Kennedy');
    (await DonatePage.getRecipientNameField()).setValue('Bill Clinton');
    (await DonatePage.getRecipientEmailField()).setValue('bill@gmail.com');
    (await DonatePage.getRecipientMessageField()).setValue('Donation in memory of John F. Kennedy');

    const nextButton = await DonatePage.getNextButton();
    await nextButton.scrollIntoView();
    await expect(nextButton).toBeDisplayed();
    await nextButton.click();

    await DonatePage.getFirstName().setValue('Dmytro');
    await DonatePage.getLasttName().setValue('Dolbilov');
    await DonatePage.getEmail().setValue('dolbilov@gmail.com');
    await nextButton.click();

    const elementText = await DonatePage.getMonthlyLabel().getText();
    expect(elementText.includes('Quarterly')); 
    await expect(DonatePage.getProcessingFeeLabel()).toHaveText('$2.45');
    await expect(DonatePage.getQuarterlyAmount()).toHaveText('$52.45');
    (await DonatePage.getOptionalFeesCheckbox()).click();
    await expect(DonatePage.getQuarterlyAmount()).toHaveText('$50');

    (await DonatePage.getDonateButton()).click();
    await expect(driver).toHaveTitle('Log in to your PayPal account');
  });

  // Donate_007
  it('verifyAnnuallyCustomPaymentWithAllOptions', async () => {
    await DonatePage.load();
    await driver.switchToFrame(await DonatePage.getDonorBoxIFrame());

    (await DonatePage.getAnnuallyButton()).click();
    await DonatePage.getCustomAmountField().setValue('300');
    const value = await DonatePage.getCustomAmountField().getValue();
    await expect(value).toBe('300');

    (await DonatePage.getDedicateMyDonationCheckbox()).click();
    (await DonatePage.getInMemoryOfRadioButton()).click();
    (await DonatePage.getHonoreeNameField()).setValue('John F. Kennedy');
    (await DonatePage.getRecipientNameField()).setValue('Bill Clinton');
    (await DonatePage.getRecipientEmailField()).setValue('bill@gmail.com');
    (await DonatePage.getRecipientMessageField()).setValue('Donation in memory of John F. Kennedy');

    (await DonatePage.getCommentCheckbox()).click();
    await DonatePage.getCommentField().setValue('Hello, WeVote!');
    const comment = await DonatePage.getCommentField().getValue();
    await expect(comment).toBe('Hello, WeVote!');

    await expect(DonatePage.getDisplayDonationCheckbox()).not.toBeChecked();
    (await DonatePage.getDisplayDonationCheckbox()).click();

    await expect(DonatePage.getDisplayFirstNameCheckbox()).not.toBeChecked();
    (await DonatePage.getDisplayFirstNameCheckbox()).click();

    await expect(DonatePage.getHideDonationAmountCheckbox()).not.toBeChecked();
    (await DonatePage.getHideDonationAmountCheckbox()).click();
    
    const nextButton = await DonatePage.getNextButton();
    await nextButton.scrollIntoView();
    await expect(nextButton).toBeDisplayed();
    await nextButton.click();

    await DonatePage.getFirstName().setValue('Dmytro');
    await DonatePage.getLasttName().setValue('Dolbilov');
    await DonatePage.getEmail().setValue('dolbilov@gmail.com');
    await nextButton.click();

    const elementText = await DonatePage.getMonthlyLabel().getText();
    expect(elementText.includes('Annually')); 
    await expect(DonatePage.getProcessingFeeLabel()).toHaveText('$12.16');
    await expect(DonatePage.getAnnuallyAmount()).toHaveText('$312.16');
    (await DonatePage.getOptionalFeesCheckbox()).click();
    await expect(DonatePage.getAnnuallyAmount()).toHaveText('$300');

    (await DonatePage.getDonateButton()).click();
    await expect(driver).toHaveTitle('Log in to your PayPal account');
  });
    
});
