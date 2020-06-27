import React from "react";

export default function componentLoader (componentName) {
  // console.log('componentLoaderFunction: ', componentName);
  switch (componentName) {
    case 'About':
      return React.lazy(() => import('../routes/More/About'));
    case 'AbsenteeBallot':
      return React.lazy(() => import('../routes/More/AbsenteeBallot'));
    case 'AddCandidateForExtension':
      return React.lazy(() => import('../routes/Ballot/AddCandidateForExtension'));
    case 'Application':
      return React.lazy(() => import('../Application'));
    case 'Attributions':
      return React.lazy(() => import('../routes/More/Attributions'));
    case 'Ballot':
      return React.lazy(() => import('../routes/Ballot/Ballot'));
    case 'BallotIndex':
      return React.lazy(() => import('../routes/Ballot/BallotIndex'));
    case 'Candidate':
      return React.lazy(() => import('../routes/Ballot/Candidate'));
    case 'CandidateForExtension':
      return React.lazy(() => import('../routes/Ballot/CandidateForExtension'));
    case 'ClaimYourPage':
      return React.lazy(() => import('../routes/Settings/ClaimYourPage'));
    case 'Connect':
      return React.lazy(() => import('../routes/Connect'));
    case 'Credits':
      return React.lazy(() => import('../routes/More/Credits'));
    case 'Donate':
      return React.lazy(() => import('../routes/More/Donate'));
    case 'DonateThankYou':
      return React.lazy(() => import('../routes/More/DonateThankYou'));
    case 'StripeElementsTest':
      return React.lazy(() => import('../routes/More/StripeElementsTest'));
    case 'ElectionReminder':
      return React.lazy(() => import('../routes/More/ElectionReminder'));
    case 'Elections':
      return React.lazy(() => import('../routes/More/Elections'));
    case 'ExtensionSignIn':
      return React.lazy(() => import('../routes/More/ExtensionSignIn'));
    case 'FAQ':
      return React.lazy(() => import('../routes/More/FAQ'));
    case 'FacebookInvitableFriends':
      return React.lazy(() => import('../routes/FacebookInvitableFriends'));
    case 'FacebookLandingProcess':
      return React.lazy(() => import('../routes/Process/FacebookLandingProcess'));
    case 'FacebookRedirectToWeVote':
      return React.lazy(() => import('../routes/More/FacebookRedirectToWeVote'));
    case 'FriendInvitationByEmailVerifyProcess':
      return React.lazy(() => import('../routes/Process/FriendInvitationByEmailVerifyProcess'));
    case 'FriendInvitationOnboarding':
      return React.lazy(() => import('../routes/Intro/FriendInvitationOnboarding'));
    case 'Friends':
      return React.lazy(() => import('../routes/Friends'));
    case 'GetStarted':
      return React.lazy(() => import('../routes/Intro/GetStarted'));
    case 'HamburgerMenu':
      return React.lazy(() => import('../routes/Settings/HamburgerMenu'));
    case 'HowItWorks':
      return React.lazy(() => import('../routes/HowItWorks'));
    case 'Intro':
      return React.lazy(() => import('../routes/Intro/Intro'));
    case 'IntroNetwork':
      return React.lazy(() => import('../routes/Intro/IntroNetwork'));
    case 'Location':
      return React.lazy(() => import('../routes/Settings/Location'));
    case 'Measure':
      return React.lazy(() => import('../routes/Ballot/Measure'));
    case 'News':
      return React.lazy(() => import('../routes/News'));
    case 'Office':
      return React.lazy(() => import('../routes/Ballot/Office'));
    case 'Opinions':
      return React.lazy(() => import('../routes/Opinions'));
    case 'OpinionsFollowed':
      return React.lazy(() => import('../routes/OpinionsFollowed'));
    case 'OpinionsIgnored':
      return React.lazy(() => import('../routes/OpinionsIgnored'));
    case 'OrganizationVoterGuide':
      return React.lazy(() => import('../routes/VoterGuide/OrganizationVoterGuide'));
    case 'OrganizationVoterGuideCandidate':
      return React.lazy(() => import('../routes/VoterGuide/OrganizationVoterGuideCandidate'));
    case 'OrganizationVoterGuideEdit':
      return React.lazy(() => import('../routes/VoterGuide/OrganizationVoterGuideEdit'));
    case 'OrganizationVoterGuideMeasure':
      return React.lazy(() => import('../routes/VoterGuide/OrganizationVoterGuideMeasure'));
    case 'OrganizationVoterGuideOffice':
      return React.lazy(() => import('../routes/VoterGuide/OrganizationVoterGuideOffice'));
    case 'OrganizationVoterGuideMobileDetails':
      return React.lazy(() => import('../routes/VoterGuide/OrganizationVoterGuideMobileDetails'));
    case 'PageNotFound':
      return React.lazy(() => import('../routes/PageNotFound'));
    case 'Pricing':
      return React.lazy(() => import('../routes/More/Pricing'));
    case 'Privacy':
      return React.lazy(() => import('../routes/More/Privacy'));
    case 'ProcessingDonation':
      return React.lazy(() => import('../routes/More/ProcessingDonation'));
    case 'ReadyNoApi':
      return React.lazy(() => import('../routes/ReadyNoApi'));
    case 'Ready':
      return React.lazy(() => import('../routes/Ready'));
    case 'ReadyRedirect':
      return React.lazy(() => import('../routes/ReadyRedirect'));
    case 'RegisterToVote':
      return React.lazy(() => import('../routes/More/RegisterToVote'));
    case 'SampleBallot':
      return React.lazy(() => import('../routes/Intro/SampleBallot'));
    case 'ScratchPad':
      return React.lazy(() => import('../routes/ScratchPad'));
    case 'SearchPage':
      return React.lazy(() => import('../routes/More/SearchPage'));
    case 'SettingsDashboard':
      return React.lazy(() => import('../routes/Settings/SettingsDashboard'));
    case 'SettingsMenuMobile':
      return React.lazy(() => import('../routes/Settings/SettingsMenuMobile'));
    case 'SharedItemLanding':
      return React.lazy(() => import('../routes/SharedItemLanding'));
    case 'SignInJumpProcess':
      return React.lazy(() => import('../routes/Process/SignInJumpProcess'));
    case 'SignInEmailProcess':
      return React.lazy(() => import('../routes/Process/SignInEmailProcess'));
    case 'TermsOfService':
      return React.lazy(() => import('../routes/More/TermsOfService'));
    case 'TwitterHandleLanding':
      return React.lazy(() => import('../routes/TwitterHandleLanding'));
    case 'TwitterSignInProcess':
      return React.lazy(() => import('../routes/Process/TwitterSignInProcess'));
    case 'Values':
      return React.lazy(() => import('../routes/Values'));
    case 'ValuesList':
      return React.lazy(() => import('../routes/Values/ValuesList'));
    case 'Vote':
      return React.lazy(() => import('../routes/Vote'));
    case 'VerifyEmailProcess':
      return React.lazy(() => import('../routes/Process/VerifyEmailProcess'));
    case 'VoterGuideListDashboard':
      return React.lazy(() => import('../routes/Settings/VoterGuideListDashboard'));
    case 'VoterGuideSettingsDashboard':
      return React.lazy(() => import('../routes/Settings/VoterGuideSettingsDashboard'));
    case 'VoterGuideSettingsMenuMobile':
      return React.lazy(() => import('../routes/Settings/VoterGuideSettingsMenuMobile'));
    case 'VoterGuidesMenuMobile':
      return React.lazy(() => import('../routes/Settings/VoterGuidesMenuMobile'));
    case 'VoterGuidesUnderOneValue':
      return React.lazy(() => import('../routes/Values/VoterGuidesUnderOneValue'));
    case 'VerifyRegistration':
      return React.lazy(() => import('../routes/More/VerifyRegistration'));
    case 'VerifyThisIsMe':
      return React.lazy(() => import('../routes/VoterGuide/VerifyThisIsMe'));
    case 'WelcomeForVoters':
      return React.lazy(() => import('../routes/WelcomeForVoters'));
    case 'WelcomeForCampaigns':
      return React.lazy(() => import('../routes/WelcomeForCampaigns'));
    case 'WelcomeForOrganizations':
      return React.lazy(() => import('../routes/WelcomeForOrganizations'));
    case 'WeVoteBallotEmbed':
      return React.lazy(() => import('../routes/More/WeVoteBallotEmbed'));
    case 'YourPage':
      return React.lazy(() => import('../routes/YourPage'));
    case 'Register':
      return React.lazy(() => import('../routes/Register'));
  }
  return null;
}
