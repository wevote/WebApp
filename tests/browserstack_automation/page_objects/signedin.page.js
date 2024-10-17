import { $, $$, expect, driver } from '@wdio/globals';
import Page from './page';

const waitTime = 3000;

class SignedIn extends Page {
  
    get signInButton() {
      return $('//*[contains(@id, "signIn")]');
    }
    
    get signInWithTwitterButton() {
        return $('//*[contains(@id, "twitterSignIn-splitIconButton")]');
    }

    get signInWithAppleButton() {
        return $('//*[contains(@id, "appleSignInText")]');
    }

    get signInWithEmailOption() {
        return $('//*[contains(@id, "enterVoterEmailAddress-label") and contains(@id, "enterVoterEmailAddress")]');
    }

    get signInWithPhoneNumberOption() {
        return $('//*[contains(@id, "enterVoterPhone-label") and contains(@id, "enterVoterPhone")]');
    }

    get deleteIconAfterUploadingPhoto() {
        return $('[data-testid = "DeleteIcon"]');
    }

    get firstNameInput() {
        return $('//*[contains(@id,"first-name-domainDesktop")]');
    }

    get lastNameInput() {
        return $('//*[contains(@id,"last-name-domainDesktop")]');
    }

    get organizationNameInput() {
        return $('//*[contains(@id,"organization-name-domainDesktop")]');
    }

    get websiteInput() {
        return $('//*[contains(@id,"organizationWebsiteTextArea-domainDesktop-label")]');
    }

    get descriptionInput() {
        return $('//*[contains(@id,"organizationDescriptionTextArea-domainDesktop")]');
    }

    get typeOfProfile() {
        return $('//*[text()="Type of Profile"]');
    }

    async clickOnDragDropBoxToUploadPhoto() { //not completed
        //return $('[data-testid = "AccountCircleIcon"]');
        const localFilePath = '/Users/ayusheedash/MyProjects/wevote_profile_image.jpg';
        const remoteFilePath = await driver.uploadFile(localFilePath);
        const fileInput = await $('[data-testid = "AccountCircleIcon"]');
        await fileInput.setValue(remoteFilePath);
    }

    async enterPhoneNumberInPhoneNumberInput() {
        (await $('#enterVoterPhone')).setValue("808-935-8555");
    }

    async clickOnSendCodeOption() {
        (await $('#desktopSmsSendCode')).click();
    }

    get bellIconNoNotificationText() {
        return $('//*[contains(@id, "noActivities")]');
    }

    get notificationTitleText() {
        return $('//*[text()="Notification Settings"]');
    }

    get notificationBellIcon() {
        return $('[data-testid = "NotificationsIcon"]');
    }

    get notificationMailIcon() {
        return $('[data-testid = "MailOutlineIcon"]');
    }

    get addEmailAddressLink() {
        return $('//*[contains(text(), "Add Email Address")]');
    }

    get howItWorksTitleText() {
        return $('//*[contains(text(), "How WeVote Works")]');
    }

    get sideBarText() {
        return $('//*[contains(text(), "WeVote does not support or oppose any political candidate or party.")]');
    }

    async enterVerificationCode() {
        const verificationCode = '123456';

        await $('#digit1').setValue(verificationCode[0]);
        await $('#digit2').setValue(verificationCode[1]);
        await $('#digit3').setValue(verificationCode[2]);
        await $('#digit4').setValue(verificationCode[3]);
        await $('#digit5').setValue(verificationCode[4]);
        await $('#digit6').setValue(verificationCode[5]);
    }

    async clickOnVerifyButtonForCodeVerification() {
        await $('#emailVerifyButton').click();

    }

    async clickOnProfilePhotoPlaceholder() {
        await $('#profileAvatarHeaderBar').click();
    }

    async clickOnTermsOfServiceFooterLink() {
        await $('#openTermsOfService').click();
    }

    async clickOnPrivacyPolicyFooterLink() {
        await $('#openPrivacyPolicy').click();
    }

    async clickOnFAQLinkInNameAndPhoto() {
        await $('#profileFAQ').click();
    }

    async clickOnBellIconForNotifications() {
        await $('#headerNotificationMenuIcon').click();
    }

    async clickOnSecurityAndSignIn() {
        await $('#securityAndSignIn').click();
    }

    async clickOnRemovePhoto() {
        await $('//*[text()="remove photo"]').click();
    }

    async clickOnSavePhoto() {
        await $('#saveEditYourPhotoBottom').click();
    }

    async idOfInputFields(id, textToEnter) { 
        await $(`#${id}`).setValue(textToEnter);
        const entered = await $(`#${id}`).getValue();
        await expect(entered).toBe(textToEnter);
        await $(`#${id}`).clearValue();
        driver.pause(waitTime);
    }

    async enterAndRemoveTextFromInputFields() { //organizationname commented as it is not getting removed
        const ids = ['first-name-domainDesktop', 'last-name-domainDesktop', /*'organization-name-domainDesktop',*/ 'organizationWebsiteTextArea-domainDesktop', 'organizationDescriptionTextArea-domainDesktop'];
        const text = 'AutomatedTest';
        for (const id of ids) {
            await this.idOfInputFields(id, text);
        }
    }

    async clickOnEachOptionInTypeOfProfile() {
        const ids = ['organizationTypeIdC3', 'organizationTypeIdC4', 'organizationTypeIdPAC', 'organizationTypeIdNonprofit',
            'organizationTypeIdGroup', 'organizationTypeIdPolitician', 'organizationTypeIdNews', 'organizationTypeIdCompany', 'organizationTypeIdUnknown',
            'organizationTypeIdIndividual'
        ];
        const textProfileTypes = ['Nonprofit 501(c)(3)', 'Nonprofit 501(c)(4)', 'Political Action Committee', 'Nonprofit (Type Not Specified)', 'Group or Club (10+ people)',
            'Politician', 'News Organization', 'Company', 'Not specified (Individual vs. Organization)', 'Individual'
        ];
        for (let i = 0; i < ids.length; i++) {
            const id = ids[i];
            const text = textProfileTypes[i];
            await $('#edit-domainDesktop').click();
            await $(`#${id}`).click();
            const textToBeDisplayed = await $(`//*[text()="${text}"]`);
            await expect(textToBeDisplayed).toBeDisplayed(); 
        }
    }

    async clickOnYourPrivacyAndData() {
        await $('#yourData').click();
    }

    async clickOnImportContactsLink() {
        await $('//*[text()="Import your contacts to find your friends"]').click();
    }

    async clickOnDeleteYourAccountLink() {
        await $('#deleteAllAccountDataLink').click();
    }

    async clickOnNotifications() {
        await $('#settingsNotifications').click();
    }

    async clickOnDiscuss() {
        await $('#settingsDiscuss').click();
    }

    async verifyAlreadyAddedEmailIdIfPresent() {
        if (await $('//*[text()="Emails to Verify"]').isDisplayed()) {
            const sendVerificationLink = await $('//*[text()="Send verification again"]');
            const trashIcon = await $('[data-testid="DeleteIcon"]');
            const emailId = await $('//*[text()="wevote@wevote.us"]');
            expect (sendVerificationLink).toBeDisplayed();
            expect (trashIcon).toBeDisplayed();
            expect (emailId).toBeDisplayed();
        } else {
            await this.addEmailAddressLink();
        }
    }

    async clickOnHowItWorksLink() {
        await $('//span[contains(text(), "How") and contains(text(), "It") and contains(text(), "Works")]').click();
    }

    async clickOnAboutAndFAQLink() {
        await $('//span[contains(text(), "About") and contains(text(), "&") and contains(text(), "FAQ")]').click();
    }

    async clickOnHelpLink() {
        await $('#footerLinkWeVoteHelp').click();
    }

    async clickOnPrivacyLink() {
        await $('//*[text()="Privacy"]').click();
    }
    
    async clickOnTermsLink() {
        await $('//*[text()="Terms"]').click();
    }

    async clickOnTeamLink() {
        await $('#footerLinkTeam').click();
    }

    async clickOnCreditAndThanksLink() {
        await $('#footerLinkCredit').click();
    }

    async closeTheHowItWorksDialogBox() {
        await $('[data-testid="CloseIcon"]').click();
    }
    
    async clickOnSignOutFromSideBar() {
        await $('//*[text()="Sign Out"]').click();
    } 

    async clickOnSignOutFromSecuritySignIn() {
        await $('//*[text()="sign out"]').click();
    }

    async privacyDataTopics() {
        await expect($('//*[contains(text(), "Your Address Book Contact Data")]')).toBeDisplayed();
        await expect($('//*[contains(text(), "Delete Your Account")]')).toBeDisplayed();
    }

    async notificationTypes() {
        await expect($('//*[contains(text(), "Notification Settings")]')).toBeDisplayed();
        await expect($('//*[contains(text(), "New friend requests, and responses to your requests")]')).toBeDisplayed();
        await expect($('//*[contains(., "Friends") and contains(., "opinions")]')).toBeDisplayed();
        await expect($('//*[contains(text(), "(on your ballot)")]')).toBeDisplayed();
        await expect($('//*[contains(text(), "(all regions)")]')).toBeDisplayed();
        await expect($('//*[contains(., "Friends") and contains(., "activity")]')).toBeDisplayed();
        await expect($('//*[contains(text(), "summarized daily")]')).toBeDisplayed();
        await expect($('//*[contains(text(), "WeVote newsletter")]')).toBeDisplayed();
    }

    async deleteAccountOptions() {
        await $('//*[contains(@id, "deleteAllAccountDataButton")]');
        await $('//*[contains(@id, "deleteAllAccountDataCancelButton")]');
    }
}
export default new SignedIn();