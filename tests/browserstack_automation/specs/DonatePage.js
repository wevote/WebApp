import { driver, expect, $ } from '@wdio/globals';
import ReadyPage from '../page_objects/ready.page';
import DonatePage from '../page_objects/donate.page';

/* eslint-disable no-undef
   This eslint-disable turns off warnings for describe() and it()
   We don't need those warnings, because describe() and it() are available at runtime
   Refer to https://webdriver.io/docs/pageobjects for guidance */

var fillDonationForm = async (name, lastName, email) => {
  await DonatePage.getFirstName().setValue(name);
  await DonatePage.getLasttName().setValue(lastName);
  await DonatePage.getEmail().setValue(email);
  (await DonatePage.getNextButton()).click();
};

async function nextButtonScrollIntoView() {
  const nextButton = await DonatePage.getNextButton();
  await nextButton.scrollIntoView();
  await expect(nextButton).toBeDisplayed();
  await nextButton.click();
}

var checkAmounts = async (interval, processingFee, fullAmount, withoutFeeAmount, amountLabel) => {
    const elementText = await DonatePage.getIntervalLabel().getText();
    const amount = await amountLabel;
    expect(elementText.includes(interval)); 
    await expect(DonatePage.getProcessingFeeLabel()).toHaveText(processingFee);
    await expect(amount).toHaveText(fullAmount);
    driver.pause(3000);
    (await DonatePage.getOptionalFeesCheckbox()).click();
    driver.pause(3000);
    await expect(amount).toHaveText(withoutFeeAmount);

    (await DonatePage.getDonateButton()).click();
    await expect(driver).toHaveTitle('Log in to your PayPal account');
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

    await nextButtonScrollIntoView();

    await DonatePage.getPayPalButton().click();
    await expect(DonatePage.getOneTimeLabel()).toHaveText("One-time");
    await expect(DonatePage.getOneTimeAmount()).toHaveText('$125.17');

    await driver.switchToFrame(await DonatePage.getPayPalIFrame());
    const payPalButton = await DonatePage.getPayPalButton2();
    await payPalButton.waitForClickable({ timeout: 5000 });
    await payPalButton.scrollIntoView();
    await expect(payPalButton).toBeDisplayed();
    await expect(payPalButton).toBeClickable();
    await payPalButton.click();

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

    await nextButtonScrollIntoView();
    await fillDonationForm('Dmytro', 'Dolbilov', 'dolbilov@gmail.com');
    await checkAmounts('Monthly', '$0.70', '$5.71', '$5.01', DonatePage.getMonthlyAmount());
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

    await nextButtonScrollIntoView();
    await fillDonationForm('Dmytro', 'Dolbilov', 'dolbilov@gmail.com');
    await checkAmounts('Quarterly', '$2.45', '$52.45', '$50', DonatePage.getQuarterlyAmount());
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
    
    await nextButtonScrollIntoView();
    await fillDonationForm('Dmytro', 'Dolbilov', 'dolbilov@gmail.com');
    await checkAmounts('Anually', '$12.16', '$312.16', '$300', DonatePage.getAnnuallyAmount());
  });
    
});
