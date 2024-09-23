import { $, $$, driver } from '@wdio/globals';
import Page from './page';

class FAQPage extends Page {
  constructor () {
    super().title = 'FAQ - WeVote';
  }

  async load () {
    await super.open('/more/faq');
    await super.maximizeWindow();
    await super.rerender();
  }

  get getFAQPageTitleElement () {
    return $('.kkIyuQ');
  }

  get getTwitterIconElement () {
    return $('#wevoteTwitter');
  }

  get getFacebookIconElement () {
    return $('#wevoteFacebook');
  }

  get getInstagramIconElement () {
    return $('#wevoteInstagram');
  }

  get getWeVoteElementFromInstagram () {
    return $('//h2[contains(text(), "wevote")]');
  }

  get getEmailIconElement () {
    return $('#eepurl');
  }

  get getGitHubIconElement () {
    return $$('//a[@href = "https://github.com/WeVote"]');
  }

  get getBlogIconElement () {
    return $('#wevoteBlog');
  }

  get getValueLinkElement () {
    return $$('//a[@id = "helpSiteValues"]');
  }

  async clickValueLink () {
    const selectorToGetValueElements = '//a[@id = "helpSiteValues"]';
    const arrOfElements = [];
    for (let i = 1; i <= $$(selectorToGetValueElements).length; i++) {
      $(`(${selectorToGetValueElements})[${i}]`).click();
      const windowHandles = driver.getWindowHandles();
      driver.switchToWindow(windowHandles[1]);
      const textFromElement = driver.getTitle();
      arrOfElements.push(textFromElement);
      driver.closeWindow();
      driver.switchWindow('https://quality.wevote.us/more/faq');
    }
    return arrOfElements;
  }

  get getWeVoteEducationWebsiteElement () {
    return $('#weVoteEducationWebsite');
  }

  get getWeVoteUSAWebsiteElement () {
    return $('#weVoteUSAWebsite');
  }

  get getWeVoteVolunteerElements () {
    return $$('//a[@href = "https://wevote.applytojob.com/apply"]');
  }

  async clickVolunteerOpeningsLinks () {
    //const selectorToGetElements = '//a[@href = "https://wevote.applytojob.com/apply"]';
    const selectorToGetElements = await this.getWeVoteVolunteerElements;

    const arrOfElements = [];
    for (let i = 1; i <= $$(selectorToGetElements).length; i++) {
      $(`(${selectorToGetElements})[${i}]`).click();
      driver.switchWindow('https://wevote.applytojob.com/apply');
      const textFromElement = driver.getTitle();
      arrOfElements.push(textFromElement);
     // driver.switchWindow('https://quality.wevote.us/more/faq');
    }
    return arrOfElements;
  }

  get getAboutPageTitleElement () {
    return $('#weVoteAboutUsPage');
  }

  get getWeVoteContactUsFormElement () {
    return $('#weVoteContactUsPage');
  }

  get getWeVoteIPhoneLinkElement () {
    return $('#weVoteIPhone');
  }

  get getWeVoteAndroidLinkElement () {
    return $('#weVoteAndroid');
  }

  get getPleaseDonateElement () {
    return $('[href="/donate"]');
  }

  get getVolunteerElement () {
    return $('#idealistOpenPositions');
  }

  get getLetsGetStartedElement () {
    return $('//a[contains(text(), "get started!")]');
  }

  async waitForURL(expectedURL){
    driver.waitUntil(async()=>{
     await driver.switchWindow(expectedURL);
    const currenturl= await driver.getUrl();
    return currenturl=== expectedURL;
    },{
      timeout: 10000,
      timeoutMsg: 'Expected URL not found'

  });
}

  async clickGitHubIconAndLinks () {
    const selectorToGetElements = '//a[@href = "https://github.com/WeVote"]';
    const arrOfElements = [];
    for (let i = 1; i <= $$(selectorToGetElements).length; i++) {
      $(`(${selectorToGetElements})[${i}]`).click();
      driver.switchWindow('https://github.com/WeVote');
      const textFromElement = driver.getTitle();
      arrOfElements.push(textFromElement);
      driver.switchWindow('https://quality.wevote.us/more/faq');
    }
    return arrOfElements;
  }
}

export default new FAQPage();
// const { describe } = require('mocha');
