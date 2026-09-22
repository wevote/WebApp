import { $, browser, driver, expect } from '@wdio/globals';
import CreditsPage from '../page_objects/credits.browser';

const waitTime = 10000;

/* eslint-disable no-undef */
describe('Credits & Thanks Page', () => {
  beforeEach(async () => {
    await CreditsPage.load();
    await CreditsPage.pageHeading.waitForDisplayed({ timeout: waitTime });
  });

  // TC-001: Credits page loads successfully
  it('verify Credits page loads and heading is visible', async () => {
    console.log('TC: Credits_001 — page loads successfully');
    await expect(driver).toHaveUrl(expect.stringContaining('/more/credits'));
    await expect(CreditsPage.pageHeading).toBeDisplayed();
    await expect(CreditsPage.pageHeading).toHaveText('Credits & Thanks');
  });

  // TC-002: Browser tab title is correct
  it('verify browser tab title contains Credits or WeVote', async () => {
    console.log('TC: Credits_002 — page title is correct');
    const title = (await browser.getTitle()).toLowerCase();
    expect(title).toMatch(/credits|wevote/);
  });

  // TC-005: 'Open source software' inline link is clickable
  it('verify open source software inline link is clickable and has valid href', async () => {
    console.log('TC: Credits_005 — open source inline link');
    await CreditsPage.openSourceInlineLink.waitForClickable({ timeout: waitTime });
    // getProperty returns the resolved absolute URL, even if the raw href is relative
    const href = await CreditsPage.openSourceInlineLink.getProperty('href');
    expect(href).toBeTruthy();
  });

  // TC-006: All organization logos render without broken images
  it('verify all organization logos render without broken images', async () => {
    console.log('TC: Credits_006 — no broken org logo images');
    const images = await CreditsPage.allImages;
    const broken = [];
    for (const img of images) {
      const naturalWidth = await browser.execute((el) => el.naturalWidth, img);
      const src = (await img.getAttribute('src')) || '';
      if (naturalWidth === 0 && src) {
        broken.push(src);
      }
    }
    // Comparing to [] prints the list of broken image srcs if this fails
    expect(broken).toEqual([]);
  });


  // TC-007: Key organizations are listed on the page (as visible text or logo alt text)
  it('verify key organizations are present on the Credits page', async () => {
    console.log('TC: Credits_007 — key org names present');
    const bodyText = await $('body').getText();
    const altTexts = [];
    for (const img of await CreditsPage.allImages) {
      altTexts.push((await img.getAttribute('alt')) || '');
    }
    const pageText = `${bodyText} ${altTexts.join(' ')}`.toLowerCase();

    const expectedOrgs = [
      'Amazon Web Services',
      'Atlassian',
      'Ballotpedia',
      'BrowserStack',
      'Google',
    ];
    const missing = expectedOrgs.filter((org) => !pageText.includes(org.toLowerCase()));
    expect(missing).toEqual([]);
  });

  // TC-010: Org logo links point to external sites
  it('verify organization logo links have valid external hrefs', async () => {
    console.log('TC: Credits_010 — org logo links have valid hrefs');
    const logoLinks = await CreditsPage.orgLogoLinks;
    expect(logoLinks.length).toBeGreaterThanOrEqual(5);

    const invalid = [];
    for (const link of logoLinks) {
      const href = (await link.getAttribute('href')) || '';
      if (!/^https?:\/\/[^/\s]+\.[a-z]{2,}/i.test(href)) {
        invalid.push(href);
      }
    }
    expect(invalid).toEqual([]);
  });

  // TC-011: Org logo links open in a new tab
  it('verify organization logo links open in a new tab', async () => {
    console.log('TC: Credits_011 — org logo links open in new tab');
    const logoLinks = await CreditsPage.orgLogoLinks;
    expect(logoLinks.length).toBeGreaterThan(0);

    // Collect the hrefs of any logo links that do NOT open in a new tab
    const notNewTab = [];
    for (const link of logoLinks) {
      const target = await link.getAttribute('target');
      if (target !== '_blank') {
        notNewTab.push(await link.getAttribute('href'));
      }
    }
    expect(notNewTab).toEqual([]);
  });

  // TC-013: Volunteers, Interns & Donors section heading is present
  it('verify Volunteers Interns and Donors section heading is visible', async () => {
    console.log('TC: Credits_013 — volunteers section heading present');
    await CreditsPage.volunteersHeading.waitForDisplayed({ timeout: waitTime });
    await expect(CreditsPage.volunteersHeading).toBeDisplayed();
  });

  // TC-014a: Volunteer role link is functional
  it('verify finding a volunteer role link has valid href', async () => {
    console.log('TC: Credits_014a — volunteer role link functional');
    await CreditsPage.volunteerRoleLink.waitForClickable({ timeout: waitTime });
    const href = await CreditsPage.volunteerRoleLink.getAttribute('href');
    expect(href).toMatch(/^https?:\/\//);
  });

  describe('Footer', () => {
    beforeEach(async () => {
      await CreditsPage.scrollToFooter();
    });

    // TC-016: Footer is visible and fully rendered
    it('verify footer is visible and key elements are rendered', async () => {
      console.log('TC: Credits_016 — footer visible');
      await CreditsPage.footerGetStarted.waitForDisplayed({ timeout: waitTime });
      await expect(CreditsPage.footerGetStarted).toBeDisplayed();
      await expect(CreditsPage.footerPrivacy).toBeDisplayed();
      await expect(CreditsPage.footerOpenSource).toBeDisplayed();
    });

    // TC-019: Footer social media links open in a new tab
    it('verify footer social media links open in a new tab', async () => {
      console.log('TC: Credits_019 — footer social links open in new tab');
      await expect(CreditsPage.footerFacebook).toHaveAttribute('target', '_blank');
      await expect(CreditsPage.footerTwitter).toHaveAttribute('target', '_blank');
      await expect(CreditsPage.footerInstagram).toHaveAttribute('target', '_blank');
    });

    // TC-020: Footer nonprofit disclaimer text is present
    it('verify footer nonprofit disclaimer text is present', async () => {
      console.log('TC: Credits_020 — nonprofit disclaimer present');
      const bodyText = (await $('body').getText()).toLowerCase();
      expect(bodyText).toMatch(/nonprofit|501/);
      expect(bodyText).toMatch(/political|candidate/);
    });

    // TC-021: Footer open source link points to GitHub
    it('verify footer open source link points to GitHub', async () => {
      console.log('TC: Credits_021 — open source link points to GitHub');
      await CreditsPage.footerOpenSource.waitForDisplayed({ timeout: waitTime });
      const href = await CreditsPage.footerOpenSource.getAttribute('href');
      expect(href).toContain('github');
    });

    // TC-022: App store badges are visible and functional
    it('verify App Store badges have links and open in new tab', async () => {
      console.log('TC: Credits_022 — app store badges functional');
      for (const badge of [CreditsPage.googleBadge, CreditsPage.appleBadge]) {
        const href = await badge.getAttribute('href');
        expect(href).toBeTruthy();
        await expect(badge).toHaveAttribute('target', '_blank');
      }
    });
  });
});