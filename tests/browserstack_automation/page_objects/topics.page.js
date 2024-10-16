import { $, $$ } from '@wdio/globals';
import Page from './page';

class TopicsPage extends Page {
  constructor () {
    //super().title = 'Terms of Service - We Vote';
    super().title = 'Pro-choice - WeVote';
  }

  async load () {
    await super.open('/value/pro-choice');
    await super.maximizeWindow();
    await super.rerender();
  }

  get getTopicTitleElement() {
    return $('.IssueName-sc-169wgaf-3 iMcdME')
  }

  get getProChoiceFollowElement() {
    return $('#issueFollowButton-wv02issue63-pro-choice')
  }

  get getProChoiceDropdownButtonElement() {
    return $('#toggleFollowMenuButton-wv02issue63')
  }

  get getProChoiceUnfollowElement() {
    return $('#issueUnfollowButton-wv02issue63-pro-choice')
  }

  get getDemocraticClubsFollowElement() {
    return $('#issueFollowButton-wv02issue25-democratic-clubs')
  }

  get getDemocraticClubsDropdownButtonElement() {
    return $('#toggleFollowMenuButton-wv02issue25')
  }
  
  get getDemocraticClubsUnfollowElement() {
    return $('#issueUnfollowButton-wv02issue25-democratic-clubs')
  }

 

}

export default new TopicsPage();