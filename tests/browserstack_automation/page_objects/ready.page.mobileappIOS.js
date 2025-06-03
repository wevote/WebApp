import { $, $$, expect, driver, browser } from '@wdio/globals';
import Page from './page';

class ReadyPage extends Page {
 constructor () {
   super().title = 'Ready to Vote? - WeVote';
 }

 get wevoteLogo () {
    return $('//XCUIElementTypeImage[@name="WeVote Logo"]');
  }

  get viewUpcomingBallotButton () {
    return $('(//XCUIElementTypeButton[@name="View Your Ballot"])[1]');
  }

  get headerFollowPopularTopics()
  {
    return $('//XCUIElementTypeStaticText[@name="Follow Popular Topics"]');
  }

  get ballotButton()
  {
    return $('-ios class chain:**/XCUIElementTypeButton[`name == "Ballot"`]');
  }

  get ballotShareButton()
  {
    //return driver.$('-ios class chain:**/XCUIElementTypeOther[`name == "Share"`]');
    return driver.$('-ios predicate string:name == "Share"');

  }

  get ballotAddress () {
    //return driver.$('-ios predicate string:type == "XCUIElementTypeButton" AND name LIKE "*Ballot for*"');
    // return driver.$('-ios predicate string:name == "Ballot for Newyork,usa,"');
    return $('-ios predicate string:name BEGINSWITH "Ballot for "');
  }

  get ballotAddressInput () {
    return $('~Address');
  }

    // get selectAddress() {
    //     return $('(//div[@class = "pac-item"])[1]');
    // }

  get saveBallotAddressButton () {
    return $('~Save');
  }

  get followIssueButtons () {
    //return $$('//*[contains(@id, "issueFollowButton")]');
    return $$('//XCUIElementTypeButton[@name="Follow"]');
  }

  get followFirstIssue () {
    return $('-ios predicate string:name == "Follow" AND visible == 1') ;
  }

  get toggleFollowDropdown ()
  {
    return $('~Toggle Dropdown');
  }

  get unfollowIssueButton()
  {
    return $('~Unfollow');
  }

  get popularTopicsShowMoreButton()
  {
    return $('-ios class chain:**/XCUIElementTypeButton[`name == "show more"`][1]');
  }
  
  
  async updateBallotAddress (ballotadd) {
    await this.ballotAddress.click();
    await this.ballotAddressInput.setValue(ballotadd);
   // await this.ballotAddressInput.setValue(ballotAddress);
    //await this.selectAddress.click();
    await this.saveBallotAddressButton.click();
  }

  // async followFirstIssue () {
  //   await this.followIssueButtons[0].findAndClick();
  // }

}
export default new ReadyPage();