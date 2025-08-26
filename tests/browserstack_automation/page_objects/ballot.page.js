import { $, $$ } from '@wdio/globals';
import Page from './page';


class BallotPage extends Page {
  constructor() {
    super();
    this.title = 'Ballot - WeVote';
  }

  get getViewBallotElement() {
    return $('(//button[contains(@id, "viewUpcomingBallot")])[1]');
  }

  get getBallotAddressLocation() {
    return $$('.pac-item > span:last-child');
  }

  get getBallotTopElement() {
    return $('#ballotTabHeaderBar');
  }

  get getBallotAddressElement() {
    return $('  #ballotTitleBallotAddress span');
  }

  get getBallotModalTitleElement() {
    return $('#SelectBallotModalTitleId');
  }

  get getBallotModalCloseElement() {
    return $('#profileCloseSelectBallotModal');
  }

  get getBallotModalInputElement() {
    return $('#entryBox');
  }

  get getBallotModalSaveElement() {
    return $('#addressBoxModalSaveButton');
  }

  get getBallotModalCancelElement() {
    return $('#addressBoxModalCancelButton');
  }

  get getAutoCompleteAddressElements() {
    return $$('(//div[contains(@class,"pac-item")])');

    // const visibleContainer = await this.getVisibleContainer();
    // if (!visibleContainer) {
    //   return []; // No visible container found
    // }
    // return await visibleContainer.$$('(//div[contains(@class,"pac-item")])');

  }


  // Find only the visible pac-container
  async getVisibleContainer() {
    const containers = await $$('(//div[contains(@class,"pac-container")])');
    for (const container of containers) {
      const isDisplayed = await container.isDisplayed();
      if (isDisplayed) {
        return container;
      }
    }
    return null;
  }


}
export default new BallotPage();
