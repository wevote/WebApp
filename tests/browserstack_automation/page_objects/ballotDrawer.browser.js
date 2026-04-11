/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { $, $$, driver } from '@wdio/globals';

import { KeyboardReturnOutlined } from '@mui/icons-material';
import PageBrowser from './page.browser';

class BallotDrawer extends PageBrowser {
  constructor () {
    super();
    this.title = 'Ballot - WeVote';
    this.url = '/ballot';
  }

  async openPage () {
    await super.open(this.url);
  }

  // In WebdriverIO, this pattern is typically used within the Page Object Model (POM) to define and access UI elements efficientlyou are defining a getter method->get :
  get candidateCardSelector () {
    return $$('//div[contains(@class,"CandidateContainer")]');
  }

  get displayNameSelector () {
    return $('(//div[contains(text(),"U.S. Representative")])[1]');
  }

  get ballotDrawer () {
    return $('.MuiDrawer-paperAnchorRight');
  }

  get overlay () {
    return $('.MuiModal-backdrop');
  }

  get candidateNameDrawer () {
    return $('h1.OneCampaignTitle-sc-13fiky4-23');
  }

  get partyName () {
    return $('.PoliticalPartyDiv-sc-14ym4n7-3');
  }

  get firstBallot () {
    return $('(//div[contains(@id,\'ballotItemScrollingArea\')])[1]');
  }

  get candidateName () {
    return '(//button[contains(@class,\'CandidateNameH4\')])[1]';
  }

  get candidateParty () {
    return '(//div[contains(@class,\'CandidateParty\')])[1]';
  }

  get firstIssuesList () {
    return '.Issues-sc-4mzi5p-1 .IssueListWrapper-sc-4mzi5p-2';
  }

  async getCandidateItems () {
  //  const ballotItems =  await this.ballotList;
    await driver.pause(10000); // Wait for the ballot items to load
    const firstItem = await this.firstBallot;
    const itemsData = [];
    //  console.log('First ballot item text:', firstItem); // Log the text of the first ballot item for debugging

    const candidateName = await firstItem.$(this.candidateName).getText();
    console.log('Candidate Name:', candidateName); // Log the candidate name for debugging
    const descriptionElement = await firstItem.$(this.candidateParty).getText();
    const title = await firstItem.$$(this.firstIssuesList);
    console.log('Number of issues found:', (await title.length)); // Log the number of issues found for debugging
    const issueText = [];
    // issue gettext() rteurns promise and in map its doent no aabout asynd await so we need to use for of loop to get the text of each issue and push it to the issueText array
    // await title.map((issue) => {
    //   const text = issue.getText();
    //   issueText.push(text);
    // });
    for (const issue of title) {
      const text = await issue.getText();
      issueText.push(text);
    }
    console.log('Issues:', issueText);
    itemsData.push({ candidateName, descriptionElement, issueText });
    return itemsData;
  }
}

export default new BallotDrawer();
