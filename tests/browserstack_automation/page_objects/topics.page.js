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

  get getProChoiceFollowElement() {
    return $('#issueFollowButton-wv02issue63-pro-choice')
  }
  get getProChoiceCircleIconElement() {
    return $('#checkCircleIconFollowTopic')
  }
  get getProChoiceDropdownButtonElement() {
    return $('#toggleFollowMenuButton-wv02issue63')
  }
  get getProChoiceUnfollowElement() {
    return $('#issueUnfollowButton-wv02issue63-pro-choice')
  }
  get getFollowersElement() {
    return $('#followers')
  }
  get getAllEndorsersElement() {
    return $('#allEndorsers')
  }
  get getEndorsementsElement() {
    return $('#numberOfEndorsements')
  }
  get getEndorsementsElementAfterScrollingDown() {
    return $('#showMoreItemsId')
  }
  get getDemocraticClubsFollowElement() {
    return $('#issueFollowButton-wv02issue25-democratic-clubs')
  }
  get getDemocraticClubsCircleIconElement() {
    return $('#checkCircleIconFollowTopic')
  }
  get getDemocraticClubsDropdownButtonElement() {
    return $('#toggleFollowMenuButton-wv02issue25')
  }
  get getDemocraticClubsUnfollowElement() {
    return $('#issueUnfollowButton-wv02issue25-democratic-clubs')
  }
  get getClimateChangeFollowElement() {
    return $('#issueFollowButton-wv02issue4-climate-change')
  }
  get getClimateChangeCircleIconElement() {
    return $('#checkCircleIconFollowTopic')
  }
  get getClimateChangeDropdownButtonElement() {
    return $('#toggleFollowMenuButton-wv02issue4')
  }
  get getClimateChangeUnfollowElement() {
    return $('#issueUnfollowButton-wv02issue4-climate-change')
  }
  get getProLifeFollowElement() {
    return $('#issueFollowButton-wv02issue64-pro-life')
  }
  get getProLifeCircleIconElement() {
    return $('#checkCircleIconFollowTopic')
  }
  get getProLifeDropdownButtonElement() {
    return $('#toggleFollowMenuButton-wv02issue64')
  }
  get getProLifeUnfollowElement() {
    return $('#issueUnfollowButton-wv02issue64-pro-life')
  }
  get getRepublicanClubsFollowElement() {
    return $('#issueFollowButton-wv02issue68-republican-clubs')
  }
  get getRepublicanClubsCircleIconElement() {
    return $('#checkCircleIconFollowTopic')
  }
  get getRepublicanClubsDropdownButtonElement() {
    return $('#toggleFollowMenuButton-wv02issue68')
  }
  get getRepublicanClubsUnfollowElement() {
    return $('#issueUnfollowButton-wv02issue68-republican-clubs')
  }
  get getLGBTQFollowElement() {
    return $('#issueFollowButton-wv02issue51-lgbtq')
  }
  get getLGBTQCircleIconElement() {
    return $('#checkCircleIconFollowTopic')
  }
  get getLGBTQDropdownButtonElement() {
    return $('#toggleFollowMenuButton-wv02issue51')
  }
  get getLGBTQUnfollowElement() {
    return $('#issueUnfollowButton-wv02issue51-lgbtq')
  }
  get getDemocraticPartyPoliticiansFollowElement() {
    return $('#issueFollowButton-wv02issue94-democratic-party-politicians')
  }
  get getDemocraticPartyPoliticiansCircleIconElement() {
    return $('#checkCircleIconFollowTopic')
  }
  get getDemocraticPartyPoliticiansDropdownButtonElement() {
    return $('#toggleFollowMenuButton-wv02issue94')
  }
  get getDemocraticPartyPoliticiansUnfollowElement() {
    return $('#issueUnfollowButton-wv02issue94-democratic-party-politicians')
  }
  get getRepublicanPartyPoliticiansFollowElement() {
    return $('#issueFollowButton-wv02issue95-republican-party-politicians')
  }
  get getRepublicanPartyPoliticiansCircleIconElement() {
    return $('#checkCircleIconFollowTopic')
  }
  get getRepublicanPartyPoliticiansDropdownButtonElement() {
    return $('#toggleFollowMenuButton-wv02issue95')
  }
  get getRepublicanPartyPoliticiansUnfollowElement() {
    return $('#issueUnfollowButton-wv02issue95-republican-party-politicians')
  }
  get getProgressiveValuesFollowElement() {
    return $('#issueFollowButton-wv02issue65-progressive-values')
  }
  get getProgressiveValuesCircleIconElement() {
    return $('#checkCircleIconFollowTopic')
  }
  get getProgressiveValuesDropdownButtonElement() {
    return $('#toggleFollowMenuButton-wv02issue65')
  }
  get getProgressiveValuesUnfollowElement() {
    return $('#issueUnfollowButton-wv02issue65-progressive-values')
  }
  get getConservativeValuesFollowElement() {
    return $('#issueFollowButton-wv02issue18-conservative-values')
  }
  get getConservativeValuesCircleIconElement() {
    return $('#checkCircleIconFollowTopic')
  }
  get getConservativeValuesDropdownButtonElement() {
    return $('#toggleFollowMenuButton-wv02issue18')
  }
  get getConservativeValuesUnfollowElement() {
    return $('#issueUnfollowButton-wv02issue18-conservative-values')
  }
  get getCommonSenseGunReformFollowElement() {
    return $('#issueFollowButton-wv02issue37-common-sense-gun-reform')
  }
  get getCommonSenseGunReformCircleIconElement() {
    return $('#checkCircleIconFollowTopic')
  }
  get getCommonSenseGunReformDropdownButtonElement() {
    return $('#toggleFollowMenuButton-wv02issue37')
  }
  get getCommonSenseGunReformUnfollowElement() {
    return $('#issueUnfollowButton-wv02issue37-common-sense-gun-reform')
  }
  get getGun2ndAmendmentRightsFollowElement() {
    return $('#issueFollowButton-wv02issue36-gun-\\/-2nd-amendment-rights')
  }
  get getGun2ndAmendmentRightsCircleIconElement() {
    return $('#checkCircleIconFollowTopic')
  }
  get getGun2ndAmendmentRightsDropdownButtonElement() {
    return $('#toggleFollowMenuButton-wv02issue36')
  }
  get getGun2ndAmendmentRightsUnfollowElement() {
    return $('#issueUnfollowButton-wv02issue36-gun-\\/-2nd-amendment-rights')
  }
  get getAffordableHousingFollowElement() {
    return $('#issueFollowButton-wv02issue91-affordable-housing')
  }
  get getAffordableHousingCircleIconElement() {
    return $('#checkCircleIconFollowTopic')
  }
  get getAffordableHousingDropdownButtonElement() {
    return $('#toggleFollowMenuButton-wv02issue91')
  }
  get getAffordableHousingUnfollowElement() {
    return $('#issueUnfollowButton-wv02issue91-affordable-housing')
  }
  get getVotingRightsAndEducationFollowElement() {
    return $('#issueFollowButton-wv02issue84-voting-rights-\\&-education')
  }
  get getVotingRightsAndEducationCircleIconElement() {
    return $('#checkCircleIconFollowTopic')
  }
  get getVotingRightsAndEducationDropdownButtonElement() {
    return $('#toggleFollowMenuButton-wv02issue84')
  }
  get getVotingRightsAndEducationUnfollowElement() {
    return $('#issueUnfollowButton-wv02issue84-voting-rights-\\&-education')
  }
  get getCommunitiesOfColorFollowElement() {
    return $('#issueFollowButton-wv02issue16-communities-of-color')
  }
  get getCommunitiesOfColorCircleIconElement() {
    return $('#checkCircleIconFollowTopic')
  }
  get getCommunitiesOfColorDropdownButtonElement() {
    return $('#toggleFollowMenuButton-wv02issue16')
  }
  get getCommunitiesOfColorUnfollowElement() {
    return $('#issueUnfollowButton-wv02issue16-communities-of-color')
  }
  get getAnimalsAndWildlifeFollowElement() {
    return $('#issueFollowButton-wv02issue1-animals-\\&-wildlife')
  }
  get getAnimalsAndWildlifeCircleIconElement() {
    return $('#checkCircleIconFollowTopic')
  }
  get getAnimalsAndWildlifeDropdownButtonElement() {
    return $('#toggleFollowMenuButton-wv02issue1')
  }
  get getAnimalsAndWildlifeUnfollowElement() {
    return $('#issueUnfollowButton-wv02issue1-animals-\\&-wildlife')
  }
  get getImmigrationRightsFollowElement() {
    return $('#issueFollowButton-wv02issue46-immigration-rights')
  }
  get getImmigrationRightsCircleIconElement() {
    return $('#checkCircleIconFollowTopic')
  }
  get getImmigrationRightsDropdownButtonElement() {
    return $('#toggleFollowMenuButton-wv02issue46')
  }
  get getImmigrationRightsUnfollowElement() {
    return $('#issueUnfollowButton-wv02issue46-immigration-rights')
  }
  get getCriminalJusticeReformFollowElement() {
    return $('#issueFollowButton-wv02issue20-criminal-justice-reform')
  }
  get getCriminalJusticeReformCircleIconElement() {
    return $('#checkCircleIconFollowTopic')
  }
  get getCriminalJusticeReformDropdownButtonElement() {
    return $('#toggleFollowMenuButton-wv02issue20')
  }
  get getCriminalJusticeReformUnfollowElement() {
    return $('#issueUnfollowButton-wv02issue20-criminal-justice-reform')
  }
  get getReducingMoneyInPoliticsFollowElement() {
    return $('#issueFollowButton-wv02issue2-reducing-money-in-politics')
  }
  get getReducingMoneyInPoliticsCircleIconElement() {
    return $('#checkCircleIconFollowTopic')
  }
  get getReducingMoneyInPoliticsDropdownButtonElement() {
    return $('#toggleFollowMenuButton-wv02issue2')
  }
  get getReducingMoneyInPoliticsUnfollowElement() {
    return $('#issueUnfollowButton-wv02issue2-reducing-money-in-politics')
  }
  get getSocialSecurityAndMedicareFollowElement() {
    return $('#issueFollowButton-wv02issue66-social-security-\\&-medicare')
  }
  get getSocialSecurityAndMedicareCircleIconElement() {
    return $('#checkCircleIconFollowTopic')
  }
  get getSocialSecurityAndMedicareDropdownButtonElement() {
    return $('#toggleFollowMenuButton-wv02issue66')
  }
  get getSocialSecurityAndMedicareUnfollowElement() {
    return $('#issueUnfollowButton-wv02issue66-social-security-\\&-medicare')
  }
  get getReducingStudentDebtFollowElement() {
    return $('#issueFollowButton-wv02issue76-reducing-student-debt')
  }
  get getReducingStudentDebtCircleIconElement() {
    return $('#checkCircleIconFollowTopic')
  }
  get getReducingStudentDebtDropdownButtonElement() {
    return $('#toggleFollowMenuButton-wv02issue76')
  }
  get getReducingStudentDebtUnfollowElement() {
    return $('#issueUnfollowButton-wv02issue76-reducing-student-debt')
  }
  get getMarijuanaLegalizationFollowElement() {
    return $('#issueFollowButton-wv02issue56-marijuana-legalization')
  }
  get getMarijuanaLegalizationCircleIconElement() {
    return $('#checkCircleIconFollowTopic')
  }
  get getMarijuanaLegalizationDropdownButtonElement() {
    return $('#toggleFollowMenuButton-wv02issue56')
  }
  get getMarijuanaLegalizationUnfollowElement() {
    return $('#issueUnfollowButton-wv02issue56-marijuana-legalization')
  }
  get getLowIncomeAndUnemploymentFollowElement() {
    return $('#issueFollowButton-wv02issue82-low-income-\\&-unemployment')
  }
  get getLowIncomeAndUnemploymentCircleIconElement() {
    return $('#checkCircleIconFollowTopic')
  }
  get getLowIncomeAndUnemploymentDropdownButtonElement() {
    return $('#toggleFollowMenuButton-wv02issue82')
  }
  get getLowIncomeAndUnemploymentUnfollowElement() {
    return $('#issueUnfollowButton-wv02issue82-low-income-\\&-unemployment')
  }
  get getHomelessWellBeingFollowElement() {
    return $('#issueFollowButton-wv02issue42-homeless-well-being')
  }
  get getHomelessWellBeingCircleIconElement() {
    return $('#checkCircleIconFollowTopic')
  }
  get getHomelessWellBeingDropdownButtonElement() {
    return $('#toggleFollowMenuButton-wv02issue42')
  }
  get getHomelessWellBeingUnfollowElement() {
    return $('#issueUnfollowButton-wv02issue42-homeless-well-being')
  }
  get getBicyclingFollowElement() {
    return $('#issueFollowButton-wv02issue7-bicycling')
  }
  get getBicyclingCircleIconElement() {
    return $('#checkCircleIconFollowTopic')
  }
  get getBicyclingDropdownButtonElement() {
    return $('#toggleFollowMenuButton-wv02issue7')
  }
  get getBicyclingUnfollowElement() {
    return $('#issueUnfollowButton-wv02issue7-bicycling')
  }
  get getSecuringOurBordersFollowElement() {
    return $('#issueFollowButton-wv02issue45-securing-our-borders')
  }
  get getSecuringOurBordersCircleIconElement() {
    return $('#checkCircleIconFollowTopic')
  }
  get getSecuringOurBordersDropdownButtonElement() {
    return $('#toggleFollowMenuButton-wv02issue45')
  }
  get getSecuringOurBordersUnfollowElement() {
    return $('#issueUnfollowButton-wv02issue45-securing-our-borders')
  }
  get getWomensEqualityFollowElement() {
    return $("#issueFollowButton-wv02issue86-women\\'s-equality")
  }
  get getWomensEqualityCircleIconElement() {
    return $('#checkCircleIconFollowTopic')
  }
  get getWomensEqualityDropdownButtonElement() {
    return $('#toggleFollowMenuButton-wv02issue86')
  }
  get getWomensEqualityUnfollowElement() {
    return $("#issueUnfollowButton-wv02issue86-women\\'s-equality")
  }
  get getGreenPartyClubsFollowElement() {
    return $('#issueFollowButton-wv02issue35-green-party-clubs')
  }
  get getGreenPartyClubsCircleIconElement() {
    return $('#checkCircleIconFollowTopic')
  }
  get getGreenPartyClubsDropdownButtonElement() {
    return $('#toggleFollowMenuButton-wv02issue35')
  }
  get getGreenPartyClubsUnfollowElement() {
    return $('#issueUnfollowButton-wv02issue35-green-party-clubs')
  }
  get getLibertarianClubsFollowElement() {
    return $('#issueFollowButton-wv02issue53-libertarian-clubs')
  }
  get getLibertarianClubsCircleIconElement() {
    return $('#checkCircleIconFollowTopic')
  }
  get getLibertarianClubsDropdownButtonElement() {
    return $('#toggleFollowMenuButton-wv02issue53')
  }
  get getLibertarianClubsUnfollowElement() {
    return $('#issueUnfollowButton-wv02issue53-libertarian-clubs')
  }
  get getProPublicSchoolsFollowElement() {
    return $('#issueFollowButton-wv02issue27-pro-public-schools')
  }
  get getProPublicSchoolsCircleIconElement() {
    return $('#checkCircleIconFollowTopic')
  }
  get getProPublicSchoolsDropdownButtonElement() {
    return $('#toggleFollowMenuButton-wv02issue27')
  }
  get getProPublicSchoolsUnfollowElement() {
    return $('#issueUnfollowButton-wv02issue27-pro-public-schools')
  }
  get getPubliclyFundedHealthcareFollowElement() {
    return $('#issueFollowButton-wv02issue99-publicly-funded-healthcare')
  }
  get getPubliclyFundedHealthcareCircleIconElement() {
    return $('#checkCircleIconFollowTopic')
  }
  get getPubliclyFundedHealthcareDropdownButtonElement() {
    return $('#toggleFollowMenuButton-wv02issue99')
  }
  get getPubliclyFundedHealthcareUnfollowElement() {
    return $('#issueUnfollowButton-wv02issue99-publicly-funded-healthcare')
  }
  get getGreenPartyPoliticiansFollowElement() {
    return $('#issueFollowButton-wv02issue97-green-party-politicians')
  }
  get getGreenPartyPoliticiansCircleIconElement() {
    return $('#checkCircleIconFollowTopic')
  }
  get getGreenPartyPoliticiansDropdownButtonElement() {
    return $('#toggleFollowMenuButton-wv02issue97')
  }
  get getGreenPartyPoliticiansUnfollowElement() {
    return $('#issueUnfollowButton-wv02issue97-green-party-politicians')
  }
  get getLibertarianPartyPoliticiansFollowElement() {
    return $('#issueFollowButton-wv02issue96-libertarian-party-politicians')
  }
  get getLibertarianPartyPoliticiansCircleIconElement() {
    return $('#checkCircleIconFollowTopic')
  }
  get getLibertarianPartyPoliticiansDropdownButtonElement() {
    return $('#toggleFollowMenuButton-wv02issue96')
  }
  get getLibertarianPartyPoliticiansUnfollowElement() {
    return $('#issueUnfollowButton-wv02issue96-libertarian-party-politicians')
  }
  get getIndependentPoliticiansFollowElement() {
    return $('#issueFollowButton-wv02issue98-independent-politicians')
  }
  get getIndependentPoliticiansCircleIconElement() {
    return $('#checkCircleIconFollowTopic')
  }
  get getIndependentPoliticiansDropdownButtonElement() {
    return $('#toggleFollowMenuButton-wv02issue98')
  }
  get getIndependentPoliticiansUnfollowElement() {
    return $('#issueUnfollowButton-wv02issue98-independent-politicians')
  }
  get getProSchoolChoiceFollowElement() {
    return $('#issueFollowButton-wv02issue10-pro-school-choice')
  }
  get getProSchoolChoiceCircleIconElement() {
    return $('#checkCircleIconFollowTopic')
  }
  get getProSchoolChoiceDropdownButtonElement() {
    return $('#toggleFollowMenuButton-wv02issue10')
  }
  get getProSchoolChoiceUnfollowElement() {
    return $('#issueUnfollowButton-wv02issue10-pro-school-choice')
  }
  get getMakeAmericaGreatAgainFollowElement() {
    return $('#issueFollowButton-wv87issue100-make-america-great-again-\\(maga\\)')
  }
  get getMakeAmericaGreatAgainCircleIconElement() {
    return $('#checkCircleIconFollowTopic')
  }
  get getMakeAmericaGreatAgainDropdownButtonElement() {
    return $('#toggleFollowMenuButton-wv87issue100')
  }
  get getMakeAmericaGreatAgainUnfollowElement() {
    return $('#issueUnfollowButton-wv87issue100-make-america-great-again-\\(maga\\)')
  }
  get forThisElectionFilter(){
    return $('#forThisElection')
  }
  get forAllEndorsersFilter(){
    return $('#allEndorsers')
  }

}

export default new TopicsPage();
