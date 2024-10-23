import { $, $$ , expect} from '@wdio/globals';
import Page from './page';
import { driver } from '@wdio/globals';

class FooterLinksPage extends Page {
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
    return $('section h1');
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
    return $('.page-title-open');
  }

  get getDonateLinkLocator () {
   return $('[href = "/donate"]');
   }

  get getAboutLinkElement () {
    return $('//a[text() = "About & FAQ"]');
  }

  get getDonatePageContentTitleElement () {
    return $('.cZOxNT');
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
  } */
}

export default new FooterLinksPage();
