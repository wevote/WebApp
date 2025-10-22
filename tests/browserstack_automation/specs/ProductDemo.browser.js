import { driver, expect, browser } from '@wdio/globals';
import ReadyPage from '../page_objects/ready.browser';
import BallotPage from '../page_objects/ballot.browser';
import HowItWorks from '../page_objects/howitworks.browser';
import TopicsPage from '../page_objects/topics.browser';
import CandidatesPage from '../page_objects/candidates.browser';
import TopNavigation from '../page_objects/topnavigation.browser';
import testData from '../capabilities/testData.js';
import path from 'path';
import { spawn } from 'child_process';
const waitTime = 5000;


describe('Product Demo', () => {
  beforeEach(async () => {
    await ReadyPage.load();
    await driver.maximizeWindow();
  });
  const moveAndClick = async (element) => {
    await element.moveTo();
    await browser.pause(waitTime);
    await element.click();
    await browser.pause(waitTime);
  };
  it('HomePage', async () => {
    await ReadyPage.viewUpcomingBallotButton.findAndClick();
    await HowItWorks.clickHowWeVoteWorksLink();
    for (let i = 1; i < 5; i++) {
      await HowItWorks.clickNextButton(i);
    }
    const getStarted = await HowItWorks.getStartedButton;
    await moveAndClick(getStarted);
    const mobilePhoneNumber = await HowItWorks.enterMobilePhoneNumber;
    await mobilePhoneNumber.addValue(testData.MOBILE_NUMBER);
    const sendCode = await HowItWorks.enterSendVerificationCode;
    await moveAndClick(sendCode);
    for (let i = 0; i < 6; i++) {
      const digitValue = await HowItWorks.enterDigit(i);
      await digitValue.addValue(testData.MOBILE_VERIFICATION[i]);
    }
    const verifyButton = await HowItWorks.enterVerifyButton;
    await moveAndClick(verifyButton);
  });

  it('updateBallotAddress', async () => {
    await ReadyPage.updateBallotAddress('Virginia');
  });

  it('climateChangeTopic', async () => {
    await browser.execute(() => window.scrollBy(0, 600));
    await moveAndClick(await TopicsPage.climateChangeElement);
    await moveAndClick(await TopicsPage.forAllEndorsersFilter);
    await moveAndClick(await TopicsPage.backButton);
  });

  it('candidateHeartAndUnheart', async () => {
    await ReadyPage.viewUpcomingBallotButton.findAndClick();
    await browser.execute(() => window.scrollBy(0, 600));
    await BallotPage.clickAnyCandidate();
    const heartIcon = await BallotPage.getCandidateCardHeart()
    await heartIcon.scrollIntoView({ block: 'center' });
    await heartIcon.click();
    const unheartIcon = await BallotPage.getCandidateCardUnheart()
    await unheartIcon.scrollIntoView({ block: 'center' });
    await unheartIcon.click();
    await BallotPage.candidateModalClose.click();
   });

  it('candidateEndorsements', async () => {
    await ReadyPage.viewUpcomingBallotButton.findAndClick();
    await browser.execute(() => window.scrollBy(0, 600));
    const endorsement =  await BallotPage.endorsementText;
    await endorsement.waitForExist({ timeout: 5000 });
    await endorsement.scrollIntoView({ block: 'center' });
    await endorsement.moveTo();
    await browser.pause(waitTime); // small hover delay for visual cue
    await endorsement.click();
    await BallotPage.candidateModalClose.click();
  });

  it('candidateChooseAndUnchoose', async () => {
    await moveAndClick(await ReadyPage.viewUpcomingBallotButton);
    const candidate03 = await BallotPage.getCandidateByText('Donald Trump');
    await candidate03.scrollIntoView();
    const choose = await BallotPage.getCandidateChoose();
    await moveAndClick(choose);
  // Unchoose
    await moveAndClick(choose);
  });

  it('clickCandidate and click endorsements ', async () =>{
   await TopNavigation.toggleCandidatesTab();
   await driver.pause(waitTime);
   const cardId = await getCandidateCardId();
   const candidateName = await CandidatesPage.getCandidateCardCandidate(cardId);
   await candidateName.waitForDisplayed({timeout: 10000,});
   await candidateName.click();
   await driver.pause(waitTime);
   const likeButton = await CandidatesPage.getLikeButtonForEndorsement("Barack Obama");
   const dislikeButton = await CandidatesPage.getDislikeButtonForEndorsement("Barack Obama");
   //Adding to cleanup the data
   const undislikeButton = await BallotPage.getDislikeButtonForEndorsement("Barack Obama");
   await CandidatesPage.clickOpinionPlaceholderAndType();
   await CandidatesPage.getSelectRadioOptions("SUPPORT")
   await driver.pause(waitTime);
   await CandidatesPage.getSelectRadioOptions("OPPOSE")
   await driver.pause(waitTime);
   await CandidatesPage.getSelectRadioOptions("INFO_ONLY")
   await driver.pause(waitTime);
  });

  async function getCandidateCardId () {
    const candidateCards = await CandidatesPage.candidateCardList;
    let selCard =  0;
    if (candidateCards.length >= 3) {
      selCard =  1;
    } else {
      selCard = candidateCards.length - 1;
    }
    const candidateCardRandom = candidateCards[selCard];
    await driver.waitUntil(async () =>  !(await candidateCardRandom.getAttribute('id')).includes('Loading'), { timeout: 4000, timeoutMsg: 'Card Data not Loaded within expected duration of 4 seconds.' });
    const candidateCardId = await candidateCardRandom.getAttribute('id');
    return candidateCardId;
  }

  after(async function () {
    const sessionId = driver.sessionId;
    console.log('Session ID:', sessionId);

  });
});
