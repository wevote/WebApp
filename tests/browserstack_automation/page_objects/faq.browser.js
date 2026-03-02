/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { $, $$, driver } from '@wdio/globals';
import PageBrowser from './page.browser';

class FaqBrowser extends PageBrowser {
  constructor () {
    super().title = 'FAQ - WeVote';
  }

  async load () {
    await super.open('/more/faq');
  }

  get getFAQPageTitleElement () {
    return $('.kkIyuQ');
  }

  get getTwitterIconElement () {
    return $('#weVoteTwitter');
  }

  get getFacebookIconElement () {
    return $('#weVoteFacebook');
  }

  get getInstagramIconElement () {
    return $('#weVoteInstagram');
  }

  get getWeVoteElementFromInstagram () {
    return $('//h2[contains(text(), "wevote")]');
  }

  get getEmailIconElement () {
    return $('#eepurl');
  }

  get getAllPdfLinks () {
    return $$('a[href*="pdf"]');    // a[contains(@href, ".pdf")]
  }

  get getGitHubIconElement () {
    return $$('//a[@href = "https://github.com/WeVote"]');
  }

  get getBlogIconElement () {
    return $('#weVoteBlog');
  }

  get getValueLinkElement () {
    return $$('//a[@id = "helpSiteValues"]');
  }

  async clickValueLink () {
    const selectorToGetValueElements = '//a[@id = "helpSiteValues"]';
    const arrOfElements = [];
    for (let i = 1; i <= selectorToGetValueElements.length; i++) {
      $(`(${selectorToGetValueElements})[${i}]`).click();
      const windowHandles = driver.getWindowHandles();
      await driver.switchToWindow(windowHandles[1]);
      const textFromElement = driver.getTitle();
      arrOfElements.push(textFromElement);
      // await driver.switchWindow('https://quality.wevote.us/more/faq');
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
    return $$('a[href*="applytojob"]');
  }

  async clickVolunteerOpeningsLinks () {
    // const selectorToGetElements = '//a[@href = "https://wevote.applytojob.com/apply"]';
    const selectorToGetElements = await this.getWeVoteVolunteerElements;

    const arrOfElements = [];
    for (let i = 0; i < selectorToGetElements.length; i++) {
      const element = selectorToGetElements[i];
      await element.click(); // <-- await is important
      await driver.waitUntil(
        async () => (await driver.getWindowHandles()).length > 1,
        { timeout: 30000 },
      );
      //  const handles =  await driver.getWindowHandles();
      // await driver.switchWindow(handles[handles.length - 1]); // Switch to the most recently opened window
      await driver.switchWindow('https://wevote.applytojob.com/apply');
      await driver.waitUntil(
        async () => (await driver.getTitle()).length > 0,
        { timeout: 30000, timeoutMsg: 'Title not loaded' },
      );

      const textFromElement = await driver.getTitle();

      arrOfElements.push(textFromElement);
      await driver.switchWindow('https://quality.wevote.us/more/faq');
    }
    return arrOfElements;
  }

  get getAboutPageElement () {
    return $('//span[text()="volunteer board members"]');
  }

  get clickTitokIconElement () {
    return $('button[aria-label="TikTok"]');
  }

  get clickTwitterIconElement () {
    return $('#weVoteTwitter');
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
    return $('//span[normalize-space()="Let\'s get started!"]');
  }

  get allFAQLinks () {
    return $$('a[href^="https"]');
  }

  get weVoteText () {
    return $('//div[@data-testid="UserName"]//span[text()="WeVote"]');
  }

  async waitForURL (expectedURL) {
    // wait for title
    await driver.waitUntil(
      async () => (await driver.getTitle()).length > 0,
      { timeout: 20000, timeoutMsg: 'Title not loaded' },
    );

    // wait for new window
    await driver.waitUntil(
      async () => (await driver.getWindowHandles()).length > 1,
      { timeout: 30000, timeoutMsg: 'New window did not open' },
    );

    // 2️⃣ switch to new window
    // const handles = await driver.getWindowHandles();
    await driver.switchWindow(expectedURL);

    // 3️⃣ wait for URL (partial match)
    await driver.waitUntil(
      async () => (await driver.getUrl()).includes(expectedURL),
      { timeout: 40000, timeoutMsg: 'Expected URL not found' },
    );









    // await  driver.waitUntil(async () => {
    //   (await driver.getWindowHandles()).length > 1,
    //   await driver.switchWindow(expectedURL);
    //   (await driver.getTitle()).length > 0;
    //   const currenturl = await driver.getUrl();
    //   return currenturl === expectedURL;
    // }, {
    //   timeout: 40000,
    //   timeoutMsg: 'Expected URL not found',

    // });
  }

  async clickGitHubIconAndLinks () {
    const selectorToGetElements = await this.getGitHubIconElement;
    const arrOfElements = [];
    console.log(`Github  length is ${selectorToGetElements.length}`);
    for (let i = 0; i < selectorToGetElements.length; i++) {
      const element = selectorToGetElements[i];
      await element.click(); // <-- await is important

      // ✅ wait for title to be available
      //  await driver.waitUntil(async () => (await driver.getUrl()).includes('github'), { timeout: 10000, timeoutMsg: 'URL did not change to GitHub' });
      await driver.waitUntil(
        async () => (await driver.getWindowHandles()).length > 1,
        { timeout: 30000 },
      );
      // const handles =  await driver.getWindowHandles();
      // await driver.switchWindow(handles[handles.length - 1]); // Switch to the most recently opened window
      await driver.switchWindow('https://github.com/WeVote');
      console.log(`Current URL after clicking GitHub icon: ${await driver.getUrl()}`);
      await driver.waitUntil(
        async () => (await driver.getTitle()).length > 0,
        { timeout: 50000, timeoutMsg: 'Url not found' },
      );
      const title = await driver.getTitle();
      arrOfElements.push(title);
      await driver.switchWindow('https://quality.wevote.us/more/faq');
    }
    console.log(arrOfElements);
    return arrOfElements;
  }

  // async getAllFaqPageLinks () {
  //   // Use the WDIO-specific .map() directly on the selector
  //   // This handles the 'iterability' internally and is much faster
  //   const allLinks = await this.allFAQLinks.map(async (link) => {
  //     try {
  //       const href = await link.getAttribute('href');
  //       return (href && href.startsWith('http')) ? href : null;
  //     } catch (e) {
  //       throw new Error(`Error retrieving link: ${e.message}`);

  //       // Handle stale elements or missing attributes
  //     }
  //   });

  //   // filter(Boolean) removes nulls; New Set removes duplicates
  //   return [...new Set(allLinks.filter(Boolean))];
  // }


  async getAllFaqPageLinks () {
    await driver.waitUntil(
      // @ts-ignore
      async () => (await this.allFAQLinks).length > 0,
      {
        timeout: 10000,
        timeoutMsg: 'FAQ links did not load',
      },
    );
    const links = await this.allFAQLinks;

    const results = [];

    for (const link of links) {
      const href = await link.getAttribute('href');
      if (href.startsWith('https')) {
        results.push(href);
      }
    }
    console.log(`Faq links length is  ${results.length}`);
    console.log(`All Faq links are ${results}`);
    return [...new Set(results)];
  }
}
export default new FaqBrowser();


