import { $, $$, driver } from '@wdio/globals';
import PageBrowser from './page.browser';
import TopnavigationBrowser from "./topnavigation.browser";


export let selectedCandidateName;
export let selectedCandidateState;
export let selectedCandidateParty;
export let selectedCandidateImgSrc;
export let selectedCandidateOffice;
const waitTime = 5000;

class CandidatesBrowser extends PageBrowser {
  async load () {
    await super.open('');
    await driver.maximizeWindow();
    await TopnavigationBrowser.toggleCandidatesTab();
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

   get candidateSearchList () {
    return $$("div[class*='CandidateCardListWrapper'] div[id*='cardForListBodyWrapper'] , div[class*='PoliticianCardListWrapper'] div[id*='cardForListBodyWrapper']");
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

  async getCandidateCardCandidate(cardId) {
    const candidate = await $(`//div[@id='${cardId}']//a[@id='candidateCardDisplayName' or @id='representativeCardDisplayName'or @id='politicianCardDisplayName']`);
    return candidate;
  }

  async getCandidateCardCandidateName(cardId) {
    const candidate = await $(`//div[@id='${cardId}']//a[@id='candidateCardDisplayName' or @id='representativeCardDisplayName' or @id='politicianCardDisplayName']`);
    const candidateName = await candidate.getText();
    return candidateName;
  }

  async getCandidateCardState(cardId) {
    const candidate = await $(`//div[@id='${cardId}']//div[contains(@id,'stateName')]`);
    const stateText = await candidate.getText();
    return stateText;
  }
   //Added page object for tests in product demo
  async clickOpinionPlaceholderAndType() {
    await browser.execute(() => {
    const el = document.querySelector('div [class*=CommentContainerWrapper] input[readonly][placeholder*="opinion"]');
    if (el) {
      el.click();  // This triggers the React event attached to the wrapper
    } else {
      console.log('pinion placeholder not found');
    }
    });
  }
  //Added page object for tests in product demo
  async getSelectRadioOptions(value){
   const radioButton = await $(`input[type="radio"][value="${value}"]`);
   return radioButton.click()
  }

  //Added page object for tests in product demo
  async getLikeButtonForEndorsement(endorsement) {
    await browser.pause(waitTime);
    await browser.execute((name) => {
       const wrappers = Array.from(
          document.querySelectorAll('div[class*=PositionForBallotItemWrapper]')
       );
      const targetWrapper = wrappers.find(wrapper =>
          wrapper.innerText.trim().includes(name)
      );
      if (targetWrapper) {
        const likeButton = targetWrapper.querySelector('button[class*="LikeContainer"]:not([style*="display:none"])');
        if (likeButton) {
          likeButton.click();
          console.log(`Clicked Like for "${name}"`);
        } else {
          console.log(`Like button not found inside wrapper for "${name}"`);
        }
      } else {
         console.log(`Endorsement "${name}" not found`);
     }
    }, endorsement);
  }
 //Added page object for tests in product demo
  async getDislikeButtonForEndorsement(endorsement) {
    await browser.pause(2000);
    await browser.execute((name) => {
    const wrappers = Array.from(
      document.querySelectorAll('div[class*=PositionForBallotItemWrapper]')
    );
    const targetWrapper = wrappers.find(wrapper =>
      wrapper.innerText.trim().includes(name)
    );
    if (targetWrapper) {
      const dislikeButton = targetWrapper.querySelector('button[class*="DislikeContainer"]:not([style*="display:none"])');
      if (dislikeButton) {
        dislikeButton.click();
        console.log(`Clicked Dislike for "${name}"`);
      } else {
        console.log(`Dislike button not found inside wrapper for "${name}"`);
      }
    } else {
      console.log(`Endorsement "${name}" not found`);
    }
  }, endorsement);
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
    const candidateImage = await $(`//div[@id='${cardId}']//div[contains(@id,'CardPhotoDesktop')]//img`);
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

   async getCandidateCardLikeCount (cardId) {
    return $(`div#${cardId} button[class*='LikeContainer'] span`);
  }

   async getCandidateCardDisLikeCount (cardId) {
    return $(`div#${cardId} button[class*='DislikeContainer'] span`);
  }


  async selectCandidate (selCandidateName) {
    await this.load();
    await driver.pause(waitTime);
    const candidateCards = await this.candidateCardList;
    let selCandidate;
    let selCandidateID;
    let candidateOnPage=false;

    if (selCandidateName === "pickRandomCandidate") {
      const randomCandidate =  candidateCards[Math.floor(Math.random() * candidateCards.length)];
      let cardId = await randomCandidate.getAttribute('id');
      selCandidate = await this.getCandidateCardCandidate(cardId);
      selCandidateID = cardId;
      candidateOnPage=true;

    }
    else {

    for (const candidate of candidateCards) {
        const cardId = await candidate.getAttribute('id');
        let candidateName = await this.getCandidateCardCandidateName(cardId);
        if (candidateName === selCandidateName) {
            selCandidate = await this.getCandidateCardCandidate(cardId);
            selCandidateID = cardId;
            candidateOnPage=true;
            break;
        }
    }
       if (candidateOnPage === false) {
        throw new Error(`Candidate Card not found on Landing Page for given test data: ${selCandidateName}`);
    }
  }

    selectedCandidateName = await this.getCandidateCardCandidateName(selCandidateID);
    selectedCandidateState = await this.getCandidateCardState(selCandidateID);
    selectedCandidateParty = await this.getCandidateCardPartyName(selCandidateID);
    selectedCandidateOffice= await this.getCandidateCardOffice(selCandidateID);
    const img = await this.getCandidateCardImage(selCandidateID);
    selectedCandidateImgSrc = await img.getAttribute('src');
    await selCandidate.moveTo();
    await driver.pause(waitTime);
    await selCandidate.click();
  }

  //const randomCard=candidateCards[Math.floor(Math.random() * candidateCards.length)];
}
export default new CandidatesBrowser();