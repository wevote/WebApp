import { driver, expect, browser } from '@wdio/globals';
import FooterSocialLinksPage from '../page_objects/footerSocialLinks.browser';

const waitTime = 5000;

/* eslint-disable no-undef */
describe('Footer Social Links', () => {

  beforeEach(async () => {
    await FooterSocialLinksPage.load();
    await FooterSocialLinksPage.scrollToFooter();
    await FooterSocialLinksPage.facebookLink.waitForDisplayed({ timeout: waitTime });
  });

  it('verify social media icons are visible in footer @BVT', async () => {
    console.log('TC: FooterSocial_001 — social icons visible in footer');
    const links = await FooterSocialLinksPage.getAllSocialLinks();
    for (const { name, el } of links) {
      await expect(el).toBeDisplayed(`${name} icon is not visible in footer`);
    }
  });

  it('verify icons exist for all expected social platforms @BVT', async () => {
    console.log('TC: FooterSocial_002 — icons exist for expected platforms');
    const links = await FooterSocialLinksPage.getAllSocialLinks();
    for (const { name, el } of links) {
      const exists = await el.isExisting();
      expect(exists).toBe(true, `${name} link element not found in footer DOM`);
    }
  });

  it('verify Facebook icon links to correct profile @BVT', async () => {
    console.log('TC: FooterSocial_005 — Facebook href contains facebook.com');
    const href = await FooterSocialLinksPage.facebookLink.getAttribute('href');
    expect(href).toContain('facebook.com');
  });

  it('verify Instagram icon links to correct profile @BVT', async () => {
    console.log('TC: FooterSocial_006 — Instagram href contains instagram.com');
    await FooterSocialLinksPage.instagramLink.waitForDisplayed({ timeout: waitTime });
    const href = await FooterSocialLinksPage.instagramLink.getAttribute('href');
    expect(href).toContain('instagram.com');
  });

  it('verify X/Twitter icon links to correct profile @BVT', async () => {
    console.log('TC: FooterSocial_007 — Twitter href contains x.com or twitter.com');
    await FooterSocialLinksPage.twitterLink.waitForDisplayed({ timeout: waitTime });
    const href = await FooterSocialLinksPage.twitterLink.getAttribute('href');
    const isValid = href.includes('x.com') || href.includes('twitter.com');
    expect(isValid).toBe(true, `X/Twitter link points to unexpected URL: ${href}`);
  });

  it('verify all social media links open in a new tab @BVT', async () => {
    console.log('TC: FooterSocial_010 — social links have target="_blank"');
    const links = await FooterSocialLinksPage.getAllSocialLinks();
    for (const { name, el } of links) {
      const target = await el.getAttribute('target');
      expect(target).toBe('_blank', `${name} link does not open in a new tab — target='${target}'`);
    }
  });

  it('verify original page remains open after clicking Facebook icon', async () => {
    console.log('TC: FooterSocial_011 — original tab stays open, new tab closed after check');
    const originalWindow = await driver.getWindowHandle();
    const originalUrl = await driver.getUrl();

    await FooterSocialLinksPage.facebookLink.click();
    await driver.pause(waitTime);

    const allWindows = await driver.getWindowHandles();
    expect(allWindows.length).toBeGreaterThan(1, 'No new tab opened after clicking Facebook icon');

    const newWindow = allWindows.find((handle) => handle !== originalWindow);
    if (newWindow) {
      await driver.switchToWindow(newWindow);
      await driver.closeWindow();
    }

    await driver.switchToWindow(originalWindow);
    await expect(driver).toHaveUrl(originalUrl);
  });

  it('verify social icons show pointer cursor on hover', async () => {
    console.log('TC: FooterSocial_012 — icons show pointer cursor on hover');
    const cursor = await browser.execute((el) => {
      return window.getComputedStyle(el).cursor;
    }, await FooterSocialLinksPage.facebookLink);

    expect(cursor).toBe('pointer', `Facebook icon cursor is '${cursor}', expected 'pointer'`);
  });

  it('verify no broken social media icon images in footer', async () => {
    console.log('TC: FooterSocial_015 — no broken icon images');
    const links = await FooterSocialLinksPage.getAllSocialLinks();
    for (const { name, el } of links) {
      const imgs = await el.$$('img');
      for (const img of imgs) {
        const naturalWidth = await browser.execute((i) => i.naturalWidth, img);
        const src = await img.getAttribute('src') || '';
        expect(naturalWidth).toBeGreaterThan(
          0,
          `${name}: broken <img> with src='${src}'`
        );
      }
      const svgs = await el.$$('svg');
      for (const svg of svgs) {
        const size = await svg.getSize();
        expect(size.width).toBeGreaterThan(0, `${name}: <svg> has zero width (not rendered)`);
      }
    }
  });

});