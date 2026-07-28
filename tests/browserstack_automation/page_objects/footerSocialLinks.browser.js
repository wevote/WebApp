import { $, browser,driver } from '@wdio/globals';
import PageBrowser from './page.browser';

// Page object for the WeVote homepage footer social media links.
// All element IDs confirmed from DOM inspection of quality.wevote.us.
// The homepage uses weVote-prefixed IDs (e.g. weVoteFacebook),
// which are different from the credits page footer (footerLinkFacebook).

class FooterSocialLinksBrowser extends PageBrowser {
  constructor () {
    super();
    this.title = 'Ready to Vote? - WeVote';
  }

  // ─── Social link elements ───────────────────────────────────────────────────

  get facebookLink () {
    return $('#weVoteFacebook');
  }

  get instagramLink () {
    return $('#weVoteInstagram');
  }

  get twitterLink () {
    return $('#weVoteTwitter');
  }

  get tiktokLink () {
    return $('#weVoteTikTok');
  }

  get newsletterLink () {
    return $('a[href*="eepurl"]');
  }

  get githubLink () {
    return $('#weVoteGithub');
  }

  // ─── Page load ──────────────────────────────────────────────────────────────

  async load () {
    await super.open('/ready');
  }

  // ─── Helpers ────────────────────────────────────────────────────────────────

  async scrollToFooter () {
    await browser.execute(() => window.scrollTo(0, document.body.scrollHeight));
    await driver.pause(3000);
  }

  async getAllSocialLinks () {
    return [
      { name: 'Facebook',   el: this.facebookLink },
      { name: 'Instagram',  el: this.instagramLink },
      { name: 'X/Twitter',  el: this.twitterLink },
      { name: 'TikTok',     el: this.tiktokLink },
      { name: 'Newsletter', el: this.newsletterLink },
      { name: 'Github',     el: this.githubLink },
    ];
  }
}

export default new FooterSocialLinksBrowser();