import { driver, expect } from '@wdio/globals';
import ReadyPage from '../page_objects/ready.page';

/* eslint-disable no-undef */
// This rule is disabled because describe() and it() are available at runtime.
// Refer to https://webdriver.io/docs/pageobjects for guidance.

describe('Ready Page', () => {
  // Ready_001
  it('findYourFriendsButtonRedirect', async () => {
    await ReadyPage.open();
    await ReadyPage.findYourFriendsButton.click();
    if (driver.isMobile) {
      // Handle Android
      // Handle iOS
    } else {
      await expect(driver).toHaveUrlContaining('friends');
    }
  });
});
