import { $, $$, driver } from '@wdio/globals';
import Page from './page';
import TopNavigation from './topnavigation';

class CandidatesPage extends Page {
  async load () {
    await super.open('');
    await driver.maximizeWindow();
    await TopNavigation.toggleCandidatesTab();
  }

  get stateSelect () {
    return $("//select[@id='outlined-age-native-simple']");
  }

  get stateSelectOptions () {
    return $$("//select[@id='outlined-age-native-simple']//option");
  }

  get pageHeaders () {
    return $$('h2#whatIsHappeningTitle');
  }

  get candidateCardList () {
    return $$("//div[contains(@id,'cardForListBodyWrapper')]");
  }

  get candidateSupportButtonList () {
    return $$("button[id*='itemActionBarSupportButton'][id*='desktop']");
  }

  get supportTooltip () {
    return $('div#supportButtonTooltip');
  }

  get opposeTooltip () {
    return $('div#opposeButtonTooltip');
  }

  get likeTooltip () {
    return $('div#supportTooltip');
  }

  get dislikeTooltip () {
    return $('div#opposeTooltip');
  }

  get scrollRight () {
    return $('div#candidateRightArrowDesktop');
  }

  get likeDislikeSignin () {
    return $('button#likeDislikeSignIn');
  }

  get searchBar () {
    return $('input#searchCandidate');
  }

  //Charanya dont change this as this is for product demo
  async getCandidateByText(name) {
    const candidateText = await $(`//button[text() = "${name}"]`);
    return candidateText
  }
  //Charanya dont change this as this is for product demo
  get candidateModalClose() {
    return $('button#closeOrganizationModal');
  }
  //Charanya dont change this as this is for product demo
  async getCandidateCardHeart () {
    return $(`div [id*='cardForListBodyWrapper'] [class*='HeartFavoriteToggleContainer'] button[class*='LikeContainer']`);
  }
  //Charanya dont change this as this is for product demo
  async getCandidateChoose() {
    return $(`//div[contains(@id, 'ballotItemScrollingArea')]//button[contains(@id, 'itemActionBarSupportButton')]`);
 }
  //Charanya dont change this as this is for product demo
  async getCandidateCardUnheart () {
    return $(`div [id*='cardForListBodyWrapper'] [class*='HeartFavoriteToggleContainer'] button[class*='DislikeContainer']`);
  }
  //Charanya dont change this as this is for product demo
  async getCandidateEndorderes() {
    return $$(`div [class*= 'CandidateEndorsementText']`);
  }

  async getCandidateCardCandidate(cardId) {
    const candidate = await $(`//div[@id='${cardId}']//a[@id='candidateCardDisplayName' or @id='representativeCardDisplayName']`);
    return candidate;
  }

  async getCandidateCardCandidateName(cardId) {
    const candidate = await $(`//div[@id='${cardId}']//a[@id='candidateCardDisplayName' or @id='representativeCardDisplayName']`);
    const candidateName = await candidate.getText();
    return candidateName;
  }

  async getCandidateCardState(cardId) {
    const candidate = await $(`//div[@id='${cardId}']//div[contains(@id,'stateName')]`);
    const stateText = await candidate.getText();
    return stateText;
  }

  async getCandidateCardPartyName (cardId) {
    const candidateParty = await $(`//div[@id='${cardId}']//div[contains(@class,'PoliticalParty')]`);
    const candidatePartyExists = await candidateParty.isExisting();
    if (candidatePartyExists) {
      const partyText = await candidateParty.getText();
      return partyText;
    } else {
      return null;
    }
  }

  async getCandidateCardOffice (cardId) {
    const candidateOffice = await $(`//div[@id='${cardId}']//div[contains(@class,'OfficeNameWrapper')]/div`);
    const officeText = candidateOffice.getText();
    return officeText;
  }

  async getCandidateCardImage (cardId) {
    const candidateImage = await $(`//div[@id='${cardId}']//div[@id='candidateCardPhotoDesktop']/div/img`);
    return candidateImage;
  }

  async getCandidateCardChoose (cardId) {
    return  $(`div#${cardId} button[id*='itemActionBarSupport'][id*='desktop']`);
  }

  async getCandidateCardOppose (cardId) {
    return  $(`div#${cardId} button[id*='itemActionBarOppose'][id*='desktop']`);
  }

  async getCandidateCardHelpWinButton (cardId) {
    return $(`div#${cardId} button[id*='itemActionBarHelpThemWinButton'][id*='desktop']`);
  }

  async getCandidateCardHelpDefeatButton (cardId) {
    return $(`div#${cardId} button[id*='itemActionBarHelpDefeatButton'][id*='desktop']`);
  }

  async getCandidateCardLike (cardId) {
    return $(`div#${cardId} button[class*='LikeContainer'] svg`);
  }

  async getCandidateCardLikeButton (cardId) {
    return $(`div#${cardId} button[class*='LikeContainer']`);
  }

  async getCandidateCardDislikeButton (cardId) {
    return $(`div#${cardId} button[class*='DislikeContainer']`);
  }

  async getCandidateCardDislike (cardId) {
    return $(`div#${cardId} button[class*='DislikeContainer'] svg`);
  }

  async getCandidateCardLikeIcon (cardId) {
    return $(`div#${cardId} button[class*='LikeContainer'] svg path`);
  }

  async getCandidateCardDislikeIcon (cardId) {
    return $(`div#${cardId} button[class*='DislikeContainer'] svg path`);
  }

}
export default new CandidatesPage();
