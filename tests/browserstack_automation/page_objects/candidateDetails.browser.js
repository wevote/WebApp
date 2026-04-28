
import { $, $$, driver } from '@wdio/globals';
import PageBrowser from './page.browser';
import TopnavigationBrowser from './topnavigation.browser';
import CandidatesBrowser from './candidates.browser';


class CandidateDetailsBrowser extends PageBrowser {
  async load (selCandidateName) {
    await CandidatesBrowser.selectCandidate(selCandidateName);
  }

  get candidateImage () {
    return $("//div[contains(@class,'DetailsSectionDesktopTablet')]" +
      "//div[contains(@id,'cardForListBodyWrapper')]" +
      "//div[@id='politicianCardPhotoDesktop']//img");
  }

  get candidateName () {
    return $("//div[contains(@class,'DetailsSectionDesktopTablet')]" +
      "//div[contains(@id,'cardForListBodyWrapper')]" +
      "//h1[contains(@class,'OneCampaignTitle')]");
  }

  get candidateState () {
    return $("//div[contains(@class,'DetailsSectionDesktopTablet')]" +
      "//div[contains(@id,'cardForListBodyWrapper')]" +
      "//div[contains(@id,'stateName')]");
  }

  get candidateParty () {
    return $("//div[contains(@class,'DetailsSectionDesktopTablet')]" +
      "//div[contains(@id,'cardForListBodyWrapper')]" +
      "//div[contains(@class,'PoliticalParty')]");
  }

  get candidateOffice () {
    return $("//div[contains(@class,'DetailsSectionDesktopTablet')]" +
      "//div[contains(@id,'cardForListBodyWrapper')]" +
      "//div[contains(@class,'PartyAndOfficeWrapper')]");
  }

  get supportTooltip () {
    return $('div#supportTooltip');
  }

  get opposeTooltip () {
    return $('div#opposeTooltip');
  }

  get candidateLikeButton () {
    return $("div[class*='DetailsSectionDesktopTablet'] div[id*='cardForListBodyWrapper'] button[class*='LikeContainer'][alt='Follow']");
  }

  get candidateDislikeButton () {
    return $("div[class*='DetailsSectionDesktopTablet'] div[id*='cardForListBodyWrapper'] button[class*='DislikeContainer'][alt='Dislike']");
  }

  get supportProgressBar () {
    return $("div[class*='DetailsSectionDesktopTablet'] span#progress-bar");
    }
     get supportProgressBarArrow () {
    return $("div[class*='DetailsSectionDesktopTablet'] span#right-arrow");
    }

    get moreInfoSection () {
      return $("div[class*='DetailsSectionDesktopTablet']"
       + " div[class*='PoliticianLinksWrapper'] div[class*='SectionTitle']");
    }
    get candidateLinks () {
      return $$("div[class*='DetailsSectionDesktopTablet'] a[id*='politicianLink']" );
    }
}

export default new CandidateDetailsBrowser();
