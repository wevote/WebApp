import { driver, expect, browser } from '@wdio/globals';
import CreditsPage from '../page_objects/credits.browser';

const waitTime = 5000;

/* eslint-disable no-undef */
describe('Credits & Thanks Page', () => {

  // TC-001: Credits page loads successfully @BVT
  it('verify Credits page loads and heading is visible @BVT', async () => {
    console.log('TC: Credits_001 — page loads successfully');
    await CreditsPage.load();
    await driver.pause(waitTime);

    await expect(driver).toHaveUrl(expect.stringContaining('/more/credits'));
    await expect(CreditsPage.pageHeading).toBeDisplayed();
    await expect(CreditsPage.pageHeading).toHaveText('Credits & Thanks');
  });

  // TC-002: Browser tab title is correct @BVT
  it('verify browser tab title contains Credits or WeVote @BVT', async () => {
    console.log('TC: Credits_002 — page title is correct');
    await CreditsPage.load();
    await driver.pause(waitTime);

    const title = await browser.getTitle();
    const isValid = title.toLowerCase().includes('credits') || title.toLowerCase().includes('wevote');
    expect(isValid).toBe(true, `Unexpected page title: '${title}'`);
  });

  // TC-005: 'Open source software' inline link is clickable
  it('verify open source software inline link is clickable and has valid href', async () => {
    console.log('TC: Credits_005 — open source inline link');
    await CreditsPage.load();
    await driver.pause(waitTime);

    await CreditsPage.openSourceInlineLink.waitForClickable({ timeout: waitTime });
    const href = await CreditsPage.openSourceInlineLink.getAttribute('href');
    expect(href).toBeTruthy();
    expect(href.startsWith('http')).toBe(true, `Invalid href: '${href}'`);
  });

  // TC-006: All organization logos render without broken images @BVT
  it('verify all organization logos render without broken images @BVT', async () => {
    console.log('TC: Credits_006 — no broken org logo images');
    await CreditsPage.load();
    await driver.pause(waitTime);

    const images = await CreditsPage.allImages;
    const broken = [];
    for (const img of images) {
      const naturalWidth = await browser.execute((el) => el.naturalWidth, img);
      const src = await img.getAttribute('src') || '';
      if (naturalWidth === 0 && src) {
        broken.push(src);
      }
    }
    expect(broken.length).toBe(0, `Broken images found:\n${broken.join('\n')}`);
  });

  // TC-007: Key organizations are listed on the page @BVT
  it('verify key organizations are present on the Credits page @BVT', async () => {
    console.log('TC: Credits_007 — key org names present');
    await CreditsPage.load();
    await driver.pause(waitTime);

    const bodyText = await $('body').getText();
    const expectedOrgs = [
      'Amazon Web Services',
      'Atlassian',
      'Ballotpedia',
      'BrowserStack',
      'Google',
    ];
    const missing = expectedOrgs.filter((org) => !bodyText.includes(org));
    expect(missing.length).toBe(0, `Missing organizations: ${missing.join(', ')}`);
  });

  // TC-010: Org logo links have valid hrefs
  it('verify organization logo links have valid hrefs', async () => {
    console.log('TC: Credits_010 — org logo links navigate correctly');
    await CreditsPage.load();
    await driver.pause(waitTime);

    const logoLinks = await CreditsPage.allLogoLinks;
    expect(logoLinks.length).toBeGreaterThan(0, 'No organization logo links found');

    // Check first 5 to keep test fast
    for (const link of logoLinks.slice(0, 5)) {
      const href = await link.getAttribute('href') || '';
      expect(href.startsWith('http')).toBe(true, `Logo link has invalid href: '${href}'`);
    }
  });

  // TC-011: Org logo links open in a new tab
  it('verify organization logo links open in a new tab', async () => {
    console.log('TC: Credits_011 — org logo links open in new tab');
    await CreditsPage.load();
    await driver.pause(waitTime);

    const logoLinks = await CreditsPage.allLogoLinks;
    expect(logoLinks.length).toBeGreaterThan(0, 'No organization logo links found');

    const target = await logoLinks[0].getAttribute('target');
    expect(target).toBe('_blank', `First logo link should open in new tab — target='${target}'`);
  });

  // TC-013: Volunteers, Interns & Donors section heading is present @BVT
  it('verify Volunteers Interns and Donors section heading is visible @BVT', async () => {
    console.log('TC: Credits_013 — volunteers section heading present');
    await CreditsPage.load();
    await driver.pause(waitTime);

    await CreditsPage.volunteersHeading.waitForDisplayed({ timeout: waitTime });
    await expect(CreditsPage.volunteersHeading).toBeDisplayed();
  });

  // TC-014a: Volunteer role link is functional
  it('verify finding a volunteer role link has valid href', async () => {
    console.log('TC: Credits_014a — volunteer role link functional');
    await CreditsPage.load();
    await driver.pause(waitTime);

    await CreditsPage.volunteerRoleLink.waitForClickable({ timeout: waitTime });
    const href = await CreditsPage.volunteerRoleLink.getAttribute('href');
    expect(href).toBeTruthy();
    expect(href.startsWith('http')).toBe(true, `Volunteer link has invalid href: '${href}'`);
  });

  // TC-016: Footer is visible and fully rendered @BVT
  it('verify footer is visible and key elements are rendered @BVT', async () => {
    console.log('TC: Credits_016 — footer visible');
    await CreditsPage.load();
    await driver.pause(waitTime);
    await CreditsPage.scrollToFooter();

    await CreditsPage.footerGetStarted.waitForDisplayed({ timeout: waitTime });
    await expect(CreditsPage.footerGetStarted).toBeDisplayed();
    await expect(CreditsPage.footerPrivacy).toBeDisplayed();
    await expect(CreditsPage.footerOpenSource).toBeDisplayed();
  });

  // TC-019: Footer social media links open in a new tab @BVT
  it('verify footer social media links open in a new tab @BVT', async () => {
    console.log('TC: Credits_019 — footer social links open in new tab');
    await CreditsPage.load();
    await driver.pause(waitTime);
    await CreditsPage.scrollToFooter();

    const socialLinks = [
      { name: 'Facebook',  el: CreditsPage.footerFacebook },
      { name: 'Twitter',   el: CreditsPage.footerTwitter },
      { name: 'Instagram', el: CreditsPage.footerInstagram },
    ];
    for (const { name, el } of socialLinks) {
      const target = await el.getAttribute('target');
      expect(target).toBe('_blank', `${name} footer link should open in new tab — target='${target}'`);
    }
  });

  // TC-020: Footer nonprofit disclaimer text is present @BVT
  it('verify footer nonprofit disclaimer text is present @BVT', async () => {
    console.log('TC: Credits_020 — nonprofit disclaimer present');
    await CreditsPage.load();
    await driver.pause(waitTime);
    await CreditsPage.scrollToFooter();

    const bodyText = (await $('body').getText()).toLowerCase();
    const hasNonprofit = bodyText.includes('nonprofit') || bodyText.includes('501');
    const hasPolitical = bodyText.includes('political') || bodyText.includes('candidate');
    expect(hasNonprofit).toBe(true, 'Nonprofit disclaimer text not found');
    expect(hasPolitical).toBe(true, 'Political neutrality disclaimer not found');
  });

  // TC-021: Footer open source link points to GitHub @BVT
  it('verify footer open source link points to GitHub @BVT', async () => {
    console.log('TC: Credits_021 — open source link points to GitHub');
    await CreditsPage.load();
    await driver.pause(waitTime);
    await CreditsPage.scrollToFooter();

    await CreditsPage.footerOpenSource.waitForDisplayed({ timeout: waitTime });
    const href = await CreditsPage.footerOpenSource.getAttribute('href');
    expect(href).toContain('github', `Open source link should point to GitHub, got: '${href}'`);
  });

  // TC-022: App store badges are visible and functional @BVT
  it('verify App Store badges are visible and open in new tab @BVT', async () => {
    console.log('TC: Credits_022 — app store badges visible and functional');
    await CreditsPage.load();
    await driver.pause(waitTime);
    await CreditsPage.scrollToFooter();

    for (const { name, el } of [
      { name: 'Google Play', el: CreditsPage.googleBadge },
      { name: 'Apple App Store', el: CreditsPage.appleBadge },
    ]) {
      const href = await el.getAttribute('href');
      const target = await el.getAttribute('target');
      expect(href).toBeTruthy(`${name} badge has no href`);
      expect(target).toBe('_blank', `${name} badge should open in new tab — target='${target}'`);
    }
  });

});