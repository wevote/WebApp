import { $, $$ } from '@wdio/globals';
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
    // WDIO partial link text selector: first <a> whose visible text contains this phrase
    return $('*=open source software');
  }

  // ─── Organization logos ──────────────────────────────────────────────────────

  get allImages () {
    return $$('img');
  }

  get orgLogoLinks () {
    // <a> tags that wrap an image and point to an external (non-WeVote) site.
    // Note: the previous selector ('a img') returned the <img> elements themselves,
    // which have no href or target, so TC-010 and TC-011 could never pass.
    return $$("//a[.//img][starts-with(@href, 'http')][not(contains(@href, 'wevote'))]");
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
    // Wait for the footer to exist, then scroll it into view (no fixed pause needed)
    await this.footerGetStarted.waitForExist({ timeout: 10000 });
    await this.footerGetStarted.scrollIntoView();
  }
}

export default new CreditsBrowser();