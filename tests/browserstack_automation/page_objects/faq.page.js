import { $, $$ } from '@wdio/globals';
import Page from './page';
import { driver, expect } from '@wdio/globals';

class FAQPage extends Page {
  constructor () {
    super().title = 'FAQ - We Vote';
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
    return $('//h2[contains(text(), "wevote")]')
  }

  get getEmailIconElement () {
    return $('#eepurl');
  }

  get getGitHubIconElement() {
    return $$('//a[@href = "https://github.com/WeVote"]');
  }

  get getBlogIconElement () {
    return $('#wevoteBlog');
  }

  get getValueLinkElement () {
    return $$('//a[@id = "helpSiteValues"]');
  }

  async clickValueLink() {
    const selectorToGetValueElements = '//a[@id = "helpSiteValues"]';
    let arrOfElements = [];
    for(let i = 1; i <= await $$(selectorToGetValueElements).length; i++) {
       await $(`(${selectorToGetValueElements})[${i}]`).click();
       const windowHandles = await driver.getWindowHandles();
       await driver.switchToWindow(windowHandles[1]);
       let textFromElement = await driver.getTitle();
       await arrOfElements.push(textFromElement);
       await driver.closeWindow();
       await driver.switchWindow('https://quality.wevote.us/more/faq');
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

  async clickVolunteerOpeningsLinks() {
    const selectorToGetElements = '//a[@href = "https://wevote.applytojob.com/apply"]';
    let arrOfElements = [];
    for(let i = 1; i <= await $$(selectorToGetElements).length; i++) {
      await $(`(${selectorToGetElements})[${i}]`).click();
      await driver.switchWindow('https://wevote.applytojob.com/apply');
      let textFromElement = await driver.getTitle();
      arrOfElements.push(textFromElement);
      await driver.switchWindow('https://quality.wevote.us/more/faq');
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

  async clickGitHubIconAndLinks() {
    const selectorToGetElements = '//a[@href = "https://github.com/WeVote"]';
    let arrOfElements = [];
    for(let i = 1; i <= await $$(selectorToGetElements).length; i++) {
      await $(`(${selectorToGetElements})[${i}]`).click();
      await driver.switchWindow('https://github.com/WeVote');
      let textFromElement = await driver.getTitle();
      arrOfElements.push(textFromElement);
      await driver.switchWindow('https://quality.wevote.us/more/faq');
    }
    return arrOfElements;
  }
}

export default new FAQPage();
