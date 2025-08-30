import { driver, expect, browser } from '@wdio/globals';
import ReadyPage from '../page_objects/ready.page';
import BallotPage from '../page_objects/ballot.page';
import HowItWorks from '../page_objects/howitworks';
import TopicsPage from '../page_objects/topics.page';
import CandidatesPage from '../page_objects/candidates.page';
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
    await ReadyPage.viewUpcomingBallotButton;
    await HowItWorks.clickHowWeVoteWorksLink();
    for (let i = 1; i < 5; i++) {
      await moveAndClick(await HowItWorks.clickNextButton(i));
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
    await ReadyPage.updateBallotAddress('800 Saratoga Avenue, San Jose, CA, USA');
  });

  it('climateChangeTopic', async () => {
    await browser.execute(() => window.scrollBy(0, 600));
    await moveAndClick(await TopicsPage.climateChangeElement);
    await moveAndClick(await TopicsPage.forAllEndorsersFilter);
    await moveAndClick(await TopicsPage.backButton);
  });

  it('verifySigninUsingMobile', async () => {
    const howItWorksLink = await HowItWorks.howItWorksLink;
    await moveAndClick(howItWorksLink);
    await HowItWorks.clickNextButtonFourTimes();
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

  it('candidateHeartAndUnheart', async () => {
    await ReadyPage.viewUpcomingBallotButton.findAndClick();
    await browser.execute(() => window.scrollBy(0, 600));
    const candidate01 = await CandidatesPage.getCandidateByText('Adam Schiff');
    await candidate01.click();
    const heartIcon = await CandidatesPage.getCandidateCardHeart()
    await driver.executeScript("arguments[0].scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });", [heartIcon]);
    await heartIcon.click();
    const unheartIcon = await CandidatesPage.getCandidateCardUnheart()
    await driver.executeScript("arguments[0].scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });", [unheartIcon]);
    await unheartIcon.click();
    await CandidatesPage.candidateModalClose.click();

   });

  it('candidateEndorsements', async () => {
    await ReadyPage.viewUpcomingBallotButton.findAndClick();
    await browser.execute(() => window.scrollBy(0, 600));
    const candidate02 = await CandidatesPage.getCandidateByText('Donald Trump');
    await candidate02.scrollIntoView();
    const endorsers =  await CandidatesPage.getCandidateEndorderes()
    const endorserTarget = endorsers[2]
    await endorserTarget.scrollIntoView({ block: "center", inline: "center" });
    await moveAndClick(endorserTarget)
    await CandidatesPage.candidateModalClose.click();
  });

  it('candidateChooseAndUnchoose', async () => {
    await moveAndClick(await ReadyPage.viewUpcomingBallotButton);
    const candidate03 = await CandidatesPage.getCandidateByText('Donald Trump');
    await candidate03.scrollIntoView();
    const choose = await CandidatesPage.getCandidateChoose();
    await moveAndClick(choose);
  // Unchoose
    await moveAndClick(choose);
  });

  after(async function () {
    const sessionId = driver.sessionId;
    console.log('Session ID:', sessionId);

  });
});
