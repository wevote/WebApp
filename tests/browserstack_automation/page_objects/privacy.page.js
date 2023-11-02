import { $, $$ } from '@wdio/globals';
import Page from './page';

class PrivacyPage extends Page {
  constructor () {
    super().title = 'Privacy Policy - We Vote';
  }

  async load () {
    await super.open('/more/privacy');
    await super.maximizeWindow();
    await super.rerender();
  }

  get pageContentTitleText () {
    return $('.ContentTitle-sc-aac96k-0');
  }

  get weVoteUSLink () {
    return $('#wevote');
  }

  get campaignsWeVoteUSLink () {
    return $('#weVoteCampaigns');
  }

  get helpCenterLink () {
    return $('#wevotePrivacy');
  }

  get findSubmittingRequestHereLink () {
    return $('#weVoteContactUsPage');
  }

  get deleteYourAccountLink () {
    return $('.u-link-color');
  }

  get googleApiUserDataPolicyLink () {
    return $('#googleLimitedUse');
  }

  get googleAnalyticsLink () {
    return $('#googleAnalytics');
  }

  get openReplayPrivacyLink () {
    return $('#openReplayPrivacy');
  }

  get elementOfCampaignPage () {
    return $('//div/h1[text() = "Helping the best candidates win votes"]');
  }

  get emailLink () {
    return $$('//a[text() = "info@WeVote.US"]');
  }

   get deleteYourAccountButton () {
    return $('.DeleteYourAccountButtonInnerWrapper-sc-qu6md9-2');
   }

   get cancelOfDeleteYourAccountButton () {
    return $('.DeleteYourAccountButtonInnerCancelWrapper-sc-qu6md9-1');
   }

  async getTextFromEmailLinks() {
    const selectorToGetElements = '//a[text() = "info@WeVote.US"]';
    let arrOfElements = [];
    for(let i = 1; i <= await $$(selectorToGetElements).length; i++) {
      let textFromElement = await $(`(${selectorToGetElements})[${i}]`).getText();
      arrOfElements.push(textFromElement);
    }

    return arrOfElements;
  }
}

export default new PrivacyPage();
