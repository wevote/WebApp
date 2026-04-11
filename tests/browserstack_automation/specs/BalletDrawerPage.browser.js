/* eslint-disable no-await-in-loop */
/* eslint-disable no-use-before-define */
import { driver, expect } from '@wdio/globals';
import BallotDrawer from '../page_objects/ballotDrawer.browser';
import ReadyPage from '../page_objects/ready.browser';

beforeEach(async () => {
  await ReadyPage.load();
  await BallotDrawer.openPage();
  await driver.maximizeWindow();
  const element =  BallotDrawer.displayNameSelector;
  await driver.waitUntil(
    async () => (await driver.getUrl()).includes('/ballot') && (element.isDisplayed()),
    { timeout: 15000, timeoutMsg: 'Expected to be on the ballot page after 15s' },
  );
});
// DrawerOpen_001
it.only('should open the drawer when user clicks button', async () => {
  const  cards = await BallotDrawer.candidateCardSelector;
  console.log('Number of candidate cards found:', await cards.length);
  cards.forEach(async (card) => {
    // console.log('Checking card:', await card.getText());
    await expect(card).toBeDisplayed();
  });

  // await cards[0].doubleClick();
  await driver.execute((el) => el.click(), cards[0]);
  await driver.pause(5000);
  const drawer = await BallotDrawer.ballotDrawer;


  // Assert drawer is attached to (or very close to) right edge

  // const windowSize = await driver.getWindowSize();
  const location = await drawer.getLocation();
  const drawerRightEdge = location.x + await drawer.getSize('width');
  console.log('Drawer right edge:', drawerRightEdge);
  const windowWidth = (await driver.getWindowSize()).width;
  console.log('Window width:', windowWidth);
  // expect(drawerRightEdge).toBeCloseTo(windowWidth, 1);
  // expect(location.x).toBeGreaterThan(windowSize.width / 2
  expect(drawerRightEdge).toBeLessThanOrEqual(windowWidth);  // Drawer should be on the right half of the screen
  const overlay = await BallotDrawer.overlay;
  const bg = await overlay.getCSSProperty('background-color');
  console.log(bg.value); // rgba(0,0,0,0.5)
  expect(bg.value).toBe('rgba(0,0,0,0.5)'); // Verify the background color of the overlay
});

// DrawerOpen_002//DrawerOpen_002.1//DrawerOpen_002.2

it('should display correct candidate name and party in the drawer', async () => {
  const candidatePartyElement = await BallotDrawer.candidateParty;
  expect(candidatePartyElement).toBeDisplayed();
  const  cards = await BallotDrawer.candidateCardSelector;
  await driver.execute((el) => el.click(), cards[0]);
  const cardItemsList = await BallotDrawer.getCandidateItems();
  // await (await BallotDrawer.firstBallot).click();
  const e1 = await BallotDrawer.firstBallot;
  await driver.execute((el) => el.click(), cards[0]);
  await driver.pause(5000);
  const candidateNameElement = await BallotDrawer.candidateNameDrawer;
  expect(candidateNameElement).toBeDisplayed();
  expect(cardItemsList[0].candidateName).toBe(await candidateNameElement.getText());
});


