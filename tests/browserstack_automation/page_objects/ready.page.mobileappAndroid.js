import { $, $$, expect, driver, browser } from '@wdio/globals';
import Page from './page';

class ReadyPage extends Page {
 constructor () {
   super().title = 'Ready to Vote? - WeVote';
 }

 get wevoteLogo () {
    //return $('~HeaderLogoImage');
    return $('android=new UiSelector().resourceId("HeaderLogoImage")');
  }

  get viewUpcomingBallotButton () {
    return $('android=new UiSelector().resourceId("viewUpcomingBallotButton")');
  }

  get headerFollowPopularTopics()
  {
    return $('android=new UiSelector().resourceId("PopularTopicsHeader")');
  }

  get ballotButton()
  {
    return $('-ios class chain:**/XCUIElementTypeButton[`name == "Ballot"`]');
  }

  get ballotShareButton()
  {
    //return driver.$('-ios class chain:**/XCUIElementTypeOther[`name == "Share"`]');
    return driver.$('android= new UiSelector().resourceId("shareButtonFooter")');

  }

  get ballotAddress () {
    //return driver.$('-ios predicate string:type == "XCUIElementTypeButton" AND name LIKE "*Ballot for*"');
    // return driver.$('-ios predicate string:name == "Ballot for Newyork,usa,"');
    return $('android= new UiSelector().resourceId("ballotTitleBallotAddress")');
    //return $('//android.widget.Button[@resource-id="ballotTitleBallotAddress"]');
  }

  get ballotAddressInput () {
    return $('android= new UiSelector().resourceId("entryBox")');
  }

    // get selectAddress() {
    //     return $('(//div[@class = "pac-item"])[1]');
    // }

  get saveBallotAddressButton () {
    return $('android= new UiSelector().resourceId("addressBoxModalSaveButton")');
  }

  get followIssueButtons () {
    //return $$('//*[contains(@id, "issueFollowButton")]');
    return $$('android=new UiSelector().resourceIdMatches(".*issueFollowButton-wv02issue.*")');

  }

  get followFirstIssue () {
    return $('android=new UiSelector().resourceId("issueFollowButton-wv02issue63-pro-choice")') ;
  }

  get toggleFollowDropdown ()
  {
    return $('android=new UiSelector().resourceIdMatches("toggleFollowMenuButton-wv02issue.*")');
  }

  get unfollowIssueButton()
  {
    return $('android= new UiSelector().resourceIdMatches("issueUnfollowButton-wv02issue.*")');
  }

  get popularTopicsShowMoreButton()
  {
    return $('#toggleContentButton-showMoreReadyPageValuesList');
  }
  

  async updateBallotAddress (ballotadd) {
    await this.ballotAddress.click();
    await this.ballotAddressInput.setValue(ballotadd);
   // await this.ballotAddressInput.setValue(ballotAddress);
    //await this.selectAddress.click();
    await this.saveBallotAddressButton.click();
  }

 


}
export default new ReadyPage();