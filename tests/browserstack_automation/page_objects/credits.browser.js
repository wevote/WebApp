import { $, $$, driver } from '@wdio/globals';
import PageBrowser from './page.browser';

// Page object for the WeVote Credits & Thanks page.
// URL: https://quality.wevote.us/more/credits

class CreditsBrowser extends PageBrowser {
  constructor () {
    super();
    this.title = 'Credits & Thanks - WeVote';
  }

  // ─── Page heading ────────────────────────────────────────────────────────────

  get pageHeading () {
    return $("//h1[normalize-space()='Credits & Thanks']");
  }

  // ─── Intro section ───────────────────────────────────────────────────────────

  get openSourceInlineLink () {
    return $('a[href*="open-source"]');
  }

  // ─── Organization logos ──────────────────────────────────────────────────────

  get allImages () {
    return $$('img');
  }

  get allLogoLinks () {
    return $$('a img');
  }

  // ─── Volunteers section ──────────────────────────────────────────────────────

  get volunteersHeading () {
    return $("//*[contains(text(), 'Volunteers') and contains(text(), 'Donors')]");
  }

  get volunteerRoleLink () {
    return $('a[href*="apply"]');
  }

  get donateLink () {
    return $('a[href*="donate"]');
  }

  // ─── Footer elements ─────────────────────────────────────────────────────────

  get footerGetStarted () {
    return $('#footerLinkGetStarted');
  }

  get footerFacebook () {
    return $('#footerLinkFacebook');
  }

  get footerTwitter () {
    return $('#footerLinkTwitter');
  }

  get footerInstagram () {
    return $('#footerLinkInstagram');
  }

  get footerOpenSource () {
    return $('#footerLinkOpenSource');
  }

  get footerPrivacy () {
    return $('#footerLinkPrivacy');
  }

  get footerTerms () {
    return $('#footerLinkTermsOfUse');
  }

  get googleBadge () {
    return $('#googleBadge');
  }

  get appleBadge () {
    return $('#appleBadge');
  }

  // ─── Page load & helpers ─────────────────────────────────────────────────────

  async load () {
    await super.open('/more/credits');
  }

  async scrollToFooter () {
    await browser.execute(() => window.scrollTo(0, document.body.scrollHeight));
    await driver.pause(3000);
  }
}

export default new CreditsBrowser();