
import { $, $$, driver } from '@wdio/globals';
import PageBrowser from './page.browser';
import TopnavigationBrowser from './topnavigation.browser';
import CandidatesBrowser from './candidates.browser';


class CandidateDetailsBrowser extends PageBrowser {
  async load (selCandidateName) {
    await CandidatesBrowser.selectCandidate(selCandidateName);
  }

  get candidateImage() {
    return $("//div[contains(@class,'DetailsSectionDesktopTablet')]" +
      "//div[contains(@id,'cardForListBodyWrapper')]" +
      "//div[@id='politicianCardPhotoDesktop']//img");
  }

   get candidateName() {
    return $("//div[contains(@class,'DetailsSectionDesktopTablet')]" +
      "//div[contains(@id,'cardForListBodyWrapper')]" +
      "//h1[contains(@class,'OneCampaignTitle')]");
  }

     get candidateState() {
    return $("//div[contains(@class,'DetailsSectionDesktopTablet')]" +
      "//div[contains(@id,'cardForListBodyWrapper')]" +
      "//div[contains(@id,'stateName')]");
  }

     get candidateParty() {
    return $("//div[contains(@class,'DetailsSectionDesktopTablet')]" +
      "//div[contains(@id,'cardForListBodyWrapper')]" +
      "//div[contains(@class,'PoliticalParty')]");
  }

   get candidateOffice() {
    return $("//div[contains(@class,'DetailsSectionDesktopTablet')]" +
      "//div[contains(@id,'cardForListBodyWrapper')]" +
      "//div[contains(@class,'PartyAndOfficeWrapper')]");
  }

}

export default new CandidateDetailsBrowser();
