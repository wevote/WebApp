import { $, $$ } from '@wdio/globals';
git s/page.browser';


class BallotBrowser extends PageBrowser {
  constructor () {
    super();
    this.title = 'Ballot - WeVote';
  }

  get getViewBallotElement () {
    return $('(//button[contains(@id, "viewUpcomingBallot")])[1]');
  }

  get getBallotAddressLocation () {
    return $$('.pac-item > span:last-child');
  }

  get getBallotTopElement () {
    return $('#ballotTabHeaderBar');
  }

  get getBallotAddressElement () {
    return $('  #ballotTitleBallotAddress span');
  }

  get getBallotModalTitleElement () {
    return $('#SelectBallotModalTitleId');
  }

  get getBallotModalCloseElement () {
    return $('#profileCloseSelectBallotModal');
  }

  get getBallotModalInputElement () {
    return $('#entryBox');
  }

  get getBallotModalSaveElement () {
    return $('#addressBoxModalSaveButton');
  }

  get getBallotModalCancelElement () {
    return $('#addressBoxModalCancelButton');
  }

  get getBallotTitleAddress () {
    return $('#ballotTitleBallotAddress span');
  }

  get getAutoCompleteAddressElements () {
    return $$('(//div[contains(@class,"pac-item")])');

    // const visibleContainer = await this.getVisibleContainer();
    // if (!visibleContainer) {
    //   return []; // No visible container found
    // }
    // return await visibleContainer.$$('(//div[contains(@class,"pac-item")])');
  }

  get getHighlightedAutoCompleteAddressElement () {
    return $('(//div[contains(@class,"pac-item") and contains(@class,"pac-item-selected")])');
  }

  // Find only the visible pac-container
  async getVisibleContainer () {
    const containers = await $$('(//div[contains(@class,"pac-container")])');
    for (const container of containers) {
      const isDisplayed = await container.isDisplayed();
      if (isDisplayed) {
        return container;
      }
    }
    return null;
  }

 //Added page object for tests in product demo
  async getCandidateByText(name) {
    const candidateText = await $(`//button[text() = "${name}"]`);
    return candidateText
  }
  //Added page object for tests in product demo
  async clickAnyCandidate() {
    await browser.pause(2000);
    await browser.execute(() => {
    const wrappers = Array.from(
      document.querySelectorAll(`div[class*="BallotScrollingOuterWrapper"]`)
    );
    const allCandidates = wrappers.flatMap(wrapper =>
      Array.from(wrapper.querySelectorAll(`div [class*="CandidateContainer"]`))
    );
    if (allCandidates.length === 0) {
      console.log('No candidates found on the ballot.');
      return;
    }
    const candidateNames = allCandidates.map(c =>
      c.innerText.trim().split('\n')[0]
    );
    console.log('Candidates currently visible:', candidateNames);
    // Pick the first (or random) candidate dynamically
    const chosenIndex = Math.floor(Math.random() * allCandidates.length);
    const chosenCandidate = allCandidates[chosenIndex];
    chosenCandidate.scrollIntoView({ behavior: 'smooth', block: 'center' });
    chosenCandidate.click();
    console.log(`✅ Clicked candidate dynamically: "${candidateNames[chosenIndex]}"`);
   });
  }

  //Added page object for tests in product demo
  get candidateModalClose() {
    return $('button#closeOrganizationModal');
  }
  //Added page object for tests in product demo
  async getCandidateCardHeart () {
    return $(`div [id*='cardForListBodyWrapper'] [class*='HeartFavoriteToggleContainer'] button[class*='LikeContainer']`);
  }
  //Added page object for tests in product demo
  async getCandidateChoose() {
    return $(`//div[contains(@id, 'ballotItemScrollingArea')]//button[contains(@id, 'itemActionBarSupportButton')]`);
 }
  //Added page object for tests in product demo
  async getCandidateCardUnheart () {
    return $(`div [id*='cardForListBodyWrapper'] [class*='HeartFavoriteToggleContainer'] button[class*='DislikeContainer']`);
  }

  //Added page object for tests in product demo
  get endorsementText() {
    return $('div[id^="candidateEndorsementText"]');
  }


}
export default new BallotBrowser();
