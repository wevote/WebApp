describe('Discuss Page', () => {
  // Discuss_001 - Discuss_003
  it('verifySpacingAndSpelling', async () => {
    if (driver.isCordova) {
      // Open up App store app
    } else {
      await driver.url("https://quality.wevote.us/");
    }
    // Functions needed examples. See: WebApp/tests/browserstack/utils.js
    // switchToPath('/ready', isCordova);
    // retrieveElementById('idName');
    if (!driver.isMobile) {
      await driver.url('/ready');
      const findYourFriendsButton = await $('button=Find your friends');
      await findYourFriendsButton.click();
      await expect(driver).toHaveTitleContaining('Find Your Friends');
    }
    if (driver.isAndroid) {
      const findYourFriendsButtonSelector = 'new UiSelector().text("Find your friends")';
      const findYourFriendsButton = await $(`android=${findYourFriendsButtonSelector}`);
      await findYourFriendsButton.click();
      const findYourFriendsTitleSelector = 'new UiSelector().textStartsWith("Find your contacts")';
      const findYourFriendsTitle = await $(`android=${findYourFriendsTitleSelector}`);
      await expect(findYourFriendsTitle).toExist();
      // await driver.saveScreenshot('./tests/browserstack_automation/screenshots/find_your_friends_android.png');
    }
  });
});
