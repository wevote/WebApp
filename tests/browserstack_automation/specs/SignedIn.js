import { driver, expect } from '@wdio/globals';
import SignedIn from '../page_objects/signedin.page';
import ReadyPage from '../page_objects/ready.page';

const waitTime = 14000;

async function switchWindow(currentWindowHandle, allWindows) {
  for (const window of allWindows) {
    if (window !== currentWindowHandle) {
      await driver.switchToWindow(window);
      break;
    }
  }
}

describe('Profile(Signed In)', () => {

    // ProfileSignedIn_001
    it.only('verifySignInButton', async () => {
      await ReadyPage.load();
      await driver.pause(waitTime);
      await SignedIn.signInButton.click();
      await driver.pause(waitTime);
      await expect(ReadyPage.getTitleSignUpPopUp).toHaveText('Sign In or Join');
      await expect(SignedIn.signInWithAppleButton).toBeDisplayed();
      await expect(SignedIn.signInWithPhoneNumberOption).toBeDisplayed();
      await expect(SignedIn.signInWithEmailOption).toBeDisplayed();  
    });

    //ProfileSignedIn_002
    it.only('verifyOpeningAccountSettings', async () => {
      await ReadyPage.load();
      await driver.pause(waitTime);
      await SignedIn.signInButton.click();
      await driver.pause(waitTime);
      await SignedIn.enterPhoneNumberInPhoneNumberInput();
      await SignedIn.clickOnSendCodeOption();
      await driver.pause(waitTime);
      await SignedIn.enterVerificationCode();
      await SignedIn.clickOnVerifyButtonForCodeVerification();
      await driver.pause(waitTime);
      await SignedIn.clickOnProfilePhotoPlaceholder();
      await driver.pause(waitTime);
      await expect(driver).toHaveUrl(expect.stringContaining('profile'));
    });

    //ProfileSignedIn_003
    it.only('verifyBellIconNotifications', async () => {
      await ReadyPage.load();
      await driver.pause(waitTime);
      await SignedIn.clickOnBellIconForNotifications();
      await driver.pause(waitTime);
      await expect(SignedIn.bellIconNotificationsSettingsText).toBeDisplayed();
    });

    // //ProfileSignedIn_004  //not completed yet, to be taken later
    // it.only('verifyUploadPhotoInNamePhotoSettings', async () => {
    //   // await ReadyPage.load();
    //   // await driver.pause(waitTime);
    //   await SignedIn.clickOnProfilePhotoPlaceholder();
    //   await driver.pause(waitTime);
    //   await expect(driver).toHaveUrl(expect.stringContaining('profile'));
    //   await driver.pause(waitTime);
    //   await SignedIn.clickOnRemovePhoto();  //added this line as existing account already has a profile image
    //   await driver.pause(waitTime);
    //   //await SignedIn.clickOnDragDropBoxToUploadPhoto();
    //   const localFilePath = '/Users/ayusheedash/MyProjects/wevote_profile_image.jpg';
    //   const remoteFilePath = await driver.uploadFile(localFilePath);
    //   const uploadIcon = await $('[data-testid = "AccountCircleIcon"]');
    //   await expect(uploadIcon).toBeDisplayed();
    //   await uploadIcon.click();
    //   await driver.pause(waitTime);
    //   const fileInput = await $('input[type="file"]');
    //   //await expect(uploadIcon).toBeDisplayed();
    //   await fileInput.setValue(remoteFilePath);
    //   await driver.pause(waitTime);
    //   await expect(SignedIn.deleteIconAfterUploadingPhoto).toBeDisplayed();
    //   await SignedIn.clickOnSavePhoto();
    // });

    //ProfileSignedIn_005
    it.only('verifyNavigationToSecuritySignInSettings', async () => {
      await ReadyPage.load();
      await driver.pause(waitTime);
      await SignedIn.clickOnProfilePhotoPlaceholder();
      await driver.pause(waitTime);
      await expect(driver).toHaveUrl(expect.stringContaining('profile'));
      await SignedIn.clickOnSecurityAndSignIn();
      await driver.pause(waitTime);
      await expect(driver).toHaveUrl(expect.stringContaining('account'));
    });

    // // //ProfileSignedIn_006
    // // it.only('verifyAddingAndDeletingPhoneNumber', async () => {
    // //   //blocked
    // // });

    // // //ProfileSignedIn_007
    // // it.only('verifyAddingAndDeletingEmail', async () => {
    // //   //blocked
    // // });

    //ProfileSignedIn_008
    it.only('verifyNavigationToFooterLinkPagesFromSecuritySignIn', async () => {
      await ReadyPage.load();
      await driver.pause(waitTime);
      await SignedIn.clickOnProfilePhotoPlaceholder();
      await driver.pause(waitTime);
      await expect(driver).toHaveUrl(expect.stringContaining('profile'));
      await SignedIn.clickOnSecurityAndSignIn();
      await driver.pause(waitTime);
      await expect(driver).toHaveUrl(expect.stringContaining('account'));
      const accountWindow = await driver.getWindowHandle();
      await SignedIn.clickOnTermsOfServiceFooterLink();
      await driver.pause(waitTime);
      let allWindows = await driver.getWindowHandles();
      switchWindow(accountWindow, allWindows);
      await expect(driver).toHaveUrl(expect.stringContaining('terms'));
      await driver.closeWindow();
      await driver.switchToWindow(accountWindow);
      await SignedIn.clickOnPrivacyPolicyFooterLink();
      await driver.pause(waitTime);
      allWindows = await driver.getWindowHandles();
      switchWindow(accountWindow, allWindows);
      await expect(driver).toHaveUrl(expect.stringContaining('privacy'));
    });

    //ProfileSignedIn_009
    it.only('verifyNavigationToFAQFromNamePhotoSettings', async () => {
      await ReadyPage.load();
      await driver.pause(waitTime);
      await SignedIn.clickOnProfilePhotoPlaceholder();
      await driver.pause(waitTime);
      await expect(driver).toHaveUrl(expect.stringContaining('profile'));
      await SignedIn.clickOnFAQLinkInNameAndPhoto();
      await driver.pause(waitTime);
      await expect(driver).toHaveUrl(expect.stringContaining('faq'));
    });

    //ProfileSignedIn_010
    it.only('verifyAllFieldsInNamePhotoSettings', async () => {
      await ReadyPage.load();
      await driver.pause(waitTime);
      await SignedIn.clickOnProfilePhotoPlaceholder();
      await driver.pause(waitTime);
      await expect(SignedIn.firstNameInput).toBeDisplayed();
      await expect(SignedIn.lastNameInput).toBeDisplayed();
      await expect(SignedIn.organizationNameInput).toBeDisplayed();
      await expect(SignedIn.websiteInput).toBeDisplayed();
      await expect(SignedIn.descriptionInput).toBeDisplayed();
      await expect(SignedIn.typeOfProfile).toBeDisplayed();
      await SignedIn.enterAndRemoveTextFromInputFields();
    });

    //ProfileSignedIn_011
    it.only('verifyAllOptionsForTypeOfProfileInNamePhotoSettings', async () => {
      await ReadyPage.load();
      await driver.pause(waitTime);
      await SignedIn.clickOnProfilePhotoPlaceholder();
      await driver.pause(waitTime);
      await expect(driver).toHaveUrl(expect.stringContaining('profile'));
      await SignedIn.clickOnEachOptionInTypeOfProfile();
    });

    //ProfileSignedIn_012
    it.only('verifyPrivacyAndDataInSettings', async () => {
      await ReadyPage.load();
      await driver.pause(waitTime);
      await SignedIn.clickOnProfilePhotoPlaceholder();
      await driver.pause(waitTime);
      await expect(driver).toHaveUrl(expect.stringContaining('profile'));
      await SignedIn.clickOnYourPrivacyAndData();
      await driver.pause(waitTime);
      await expect(driver).toHaveUrl(expect.stringContaining('yourdata'));
      await SignedIn.privacyDataTopics();
      await SignedIn.clickOnImportContactsLink();
      await expect(driver).toHaveUrl(expect.stringContaining('findfriends/importcontacts'));
      await driver.back();
      await driver.pause(waitTime);
      await SignedIn.clickOnDeleteYourAccountLink();
      await SignedIn.deleteAccountOptions();
    });

    //ProfileSignedIn_013
    it.only('verifyNotificationsInSettings', async () => {
      await ReadyPage.load();
      await driver.pause(waitTime);
      await SignedIn.clickOnProfilePhotoPlaceholder();
      await driver.pause(waitTime);
      await expect(driver).toHaveUrl(expect.stringContaining('profile'));
      await SignedIn.clickOnNotifications();
      await driver.pause(waitTime);
      await expect(driver).toHaveUrl(expect.stringContaining('notifications'));
      await expect(SignedIn.notificationTitleText).toBeDisplayed();
      await SignedIn.notificationTypes();
      await expect(SignedIn.notificationBellIcon).toBeDisplayed();
      await expect(SignedIn.notificationMailIcon).toBeDisplayed();
      await expect(SignedIn.addEmailAddressLink).toBeDisplayed();
      await SignedIn.verifyAlreadyAddedEmailIdIfPresent();
    });

    // //ProfileSignedIn_014
    // it.only('verifyFriendsOptionInSettings', async () => {
    //   //on hold
    //   });

    // //ProfileSignedIn_015
    // it.only('verifyDifferentTabsInFriendsPage', async () => {
    //   //on hold
    //   });

    //ProfileSignedIn_016
    it.only('verifyDiscussPageNavigationFromSettings', async () => {
      await ReadyPage.load();
      await driver.pause(waitTime);
      await SignedIn.clickOnProfilePhotoPlaceholder();
      await driver.pause(waitTime);
      await expect(driver).toHaveUrl(expect.stringContaining('profile'));
      await SignedIn.clickOnDiscuss();
      await driver.pause(waitTime);
      await expect(driver).toHaveUrl(expect.stringContaining('news'));
    });

    //ProfileSignedIn_017
    it.only('verifySideBarLinksInProfile', async () => {
      await ReadyPage.load();
      await driver.pause(waitTime);
      await SignedIn.clickOnProfilePhotoPlaceholder();
      await expect(driver).toHaveUrl(expect.stringContaining('profile'));
      await SignedIn.clickOnHowItWorksLink();                            
      await expect(SignedIn.howItWorksTitleText).toBeDisplayed();
      await SignedIn.closeTheHowItWorksDialogBox();
      await driver.pause(waitTime);
      await SignedIn.clickOnAboutAndFAQLink();
      await expect(driver).toHaveUrl(expect.stringContaining('faq'));
      await driver.back();
      const profileWindow = await driver.getWindowHandle();
      await SignedIn.clickOnHelpLink();
      await driver.pause(waitTime);
      let allWindows = await driver.getWindowHandles();
      switchWindow(profileWindow, allWindows);
      await expect(driver).toHaveUrl(expect.stringContaining('hc/en-us'));
      await driver.closeWindow();
      await driver.switchToWindow(profileWindow);
      await SignedIn.clickOnPrivacyLink();
      await expect(driver).toHaveUrl(expect.stringContaining('privacy'));
      await driver.back();
      await SignedIn.clickOnTermsLink();
      await expect(driver).toHaveUrl(expect.stringContaining('more/terms'));
      await driver.back();
      await SignedIn.clickOnTeamLink();
      await driver.pause(waitTime);
      allWindows = await driver.getWindowHandles();
      switchWindow(profileWindow, allWindows);
      await expect(driver).toHaveUrl(expect.stringContaining('more/about'));
      await driver.closeWindow();
      await driver.switchToWindow(profileWindow);
      await SignedIn.clickOnCreditAndThanksLink();
      await driver.pause(waitTime);
      allWindows = await driver.getWindowHandles();
      switchWindow(profileWindow, allWindows);
      await expect(driver).toHaveUrl(expect.stringContaining('more/credits'));
    });

    //ProfileSignedIn_018
    it.only('verifySideBarTextInProfile', async () => {
      await ReadyPage.load();
      await driver.pause(waitTime);
      await SignedIn.clickOnProfilePhotoPlaceholder();
      await driver.pause(waitTime);
      await expect(driver).toHaveUrl(expect.stringContaining('profile'));
      await expect(SignedIn.sideBarText).toBeDisplayed();
    });

    //ProfileSignedIn_019
    it.only('verifySignOutOption', async () => {
      await ReadyPage.load();
      await driver.pause(waitTime);
      await SignedIn.clickOnProfilePhotoPlaceholder();
      await SignedIn.clickOnSignOutFromSideBar();
      await expect(driver).toHaveUrl(expect.stringContaining('ready'));
      await SignedIn.signInButton.click();
      await driver.pause(waitTime);
      await SignedIn.enterPhoneNumberInPhoneNumberInput();
      await SignedIn.clickOnSendCodeOption();
      await SignedIn.enterVerificationCode();
      await SignedIn.clickOnVerifyButtonForCodeVerification();
      await driver.pause(waitTime);
      await SignedIn.clickOnProfilePhotoPlaceholder();
      await SignedIn.clickOnSecurityAndSignIn();
      await SignedIn.clickOnSignOutFromSecuritySignIn();
      await expect(driver).toHaveUrl(expect.stringContaining('ready'));
    });
  
  });