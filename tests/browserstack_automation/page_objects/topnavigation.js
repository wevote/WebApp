import { $ } from '@wdio/globals';
import Page from './page';



class TopNavigation extends Page {
  get getBallotLinkLocator () {
    return $('[href = "/ballot"]');
  }

  get getBallotTabLocator () {
    return $('#ballotTabHeaderBar');
  }

  get getCandidatesTabLocator () {
    return $('#candidatesTabHeaderBar');
  }

  get getChallengesTabLocator () {
    return $('#challengesTabHeaderBar');
  }

  get getDonateTabLocator () {
    return $('#donateTabHeaderBar');
  }

  get getSquadsTabLocator () {
    return $('#squadsTabHeaderBar');
  }

  get getWeVoteLogoLocator () {
    return $('#logoHeaderBar');
  }

  async toggleCandidatesTab () {
    await this.getCandidatesTabLocator.findAndClick();
  }

  async toggleChallengesTab () {
    await this.getChallengesTabLocator.findAndClick();
  }


  async toggleDonateTab () {
    await this.getDonateTabLocator.findAndClick();
  }

  async toggleLogoBar () {
    await this.getWeVoteLogoLocator.findAndClick();
  }

  async toggleSquadsTab () {
    await this.getSquadsTabLocator.findAndClick();
  }
}

export default new TopNavigation();

