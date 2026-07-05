import { $, $$ , expect} from '@wdio/globals';
import PageBrowser from './page.browser';
import { driver } from '@wdio/globals';

class FooterlinksBrowser extends PageBrowser {
  constructor () {
    super().title = 'Ready to Vote? - WeVote';
  }

  get avatar () {
    return super.avatar;
  }

  get electionCountDownTitle () {
    return $('//*[contains(@id, "electionCountDownTitle")]');
  }

  get wevoteLogo () {
    return $('//*[contains(@id, "HeaderLogoImage")]');
  }

  get howItWorksLink () {
    return $('#footerLinkHowItWorks');
  }

  get howItWorksTitle () {
    //return $('div>h3[class~="gNNNpeadyFinePrintStepTextX"]');
    return $('//h3[text()="1. Choose your interests"]');
  }

  get howItWorksCloseIcon () {
    return $('[data-testid = "CloseIcon"] > path');
  }

  get findPrivacyLink () {
    return $('#footerLinkPrivacy');
  }

  get getTitleSignUpPopUp () {
    return $('.u-f3');
  }

  get elementHowItWorksWindow () {
    return $('.sc-dcJsrY');
  }



  get getHelpLinkElement () {
    return $('#footerLinkWeVoteHelp');
  }

  get getHelpPageTitleElement () {
    //return $('section h1');
    return $('//h1[normalize-space()="Help Center"]');
  }

  get getTermsLinkElement () {
    return $('#footerLinkTermsOfUse');
  }

  get getTeamLinkElement () {
    return $('#footerLinkTeam');
  }

  get getTeamPageTitleElement () {
    return $("//h1[normalize-space()='About WeVote']");
  }

  get getCreditsAndThanksElement () {
    return $('#footerLinkCredits');
  }

  get getCreditsAndThanksPageTitleElement () {
       return $("//h1[normalize-space()='Credits & Thanks']");
  }

  get getVolunteeringOpportunitiesElement () {
    return $('#footerLinkVolunteer');
  }

  get getVolunteeringOpportunitiesPageTitleElement () {
    return $('h2.page-title-open');
  }

  get getDonateLinkLocator () {
   return $('[href = "/donate"]');
   }

  get getAboutLinkElement () {
    return $('//a[text() = "About & FAQ"]');
  }

  get getDonatePageContentTitleElement () {
    return $("//span[contains(@class,'step-1') and normalize-space()='Choose amount']");
  }

  get getDonateNextButton() {
    return $('span.next');
  }

 get donateFrame() {
  return $('#donorbox-iframe');
  }

  async switchToDonateFrame() {
    await driver.switchFrame(this.donateFrame);
  }
  async switchToMainPage() {
    await driver.switchFrame(null);
  }


  async waitAboutLinkAndClick () {
    await this.getAboutLinkElement.waitForDisplayed({ timeout: 15000 });
    await this.getAboutLinkElement.click();
  }

  async load () {
    await super.open('/ready');
  }

 async clickHowItWorksLink () {
    await this.howItWorksLink.click();
  }

  async closeHowItWorksModalWindow () {
    await this.howItWorksCloseIcon.click();
  }

   async getTitleOfHowItWorksWindowAfterBackButton () {
    const num = await this.clickNextButtonHowItWorksWindow();
    await this.findBackButtonHowItWorksWindow.click();

    if (num === 1) {
      return '1. Choose your interests';
    } else if (num === 2) {
      return '2. Follow organizations and people you trust';
    } else if (num === 3) {
      return '3. See who endorsed each choice on your ballot';
    } else {
      return '4. Complete your ballot with confidence';
    }
  }

  async clickGetStartedButton () {
    await this.getStartedButton.click();
  }

  async clickNextButtonFourTimes () {
    for (let i = 1; i <= 4; i++) {
      this.findNextButtonHowItWorksWindow.click();
    }
  }
  async verifyExternalLink(linkElement, expectedUrl, titleElement, expectedTitle) {
    const readyWindow = await driver.getWindowHandle();
    await linkElement.click();
    await driver.pause(5000);
    const allWindows = await driver.getWindowHandles();
    for (const window of allWindows) {
      if (window !== readyWindow) {
        await driver.switchToWindow(window);
        break;
      }
    }
    await expect(driver).toHaveUrl(expect.stringContaining(expectedUrl));
    await expect(titleElement).toHaveText(expectedTitle);
    await driver.closeWindow();
    await driver.switchToWindow(readyWindow);
  }


}

export default new FooterlinksBrowser();
