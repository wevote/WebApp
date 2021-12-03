// import React from 'react';
//
// export default function componentLoader (componentName) {
//   // console.log('componentLoaderFunction: ', componentName);
//   switch (componentName) {
//     case 'About':
//       return React.lazy(() => import('../pages/More/About'));
//     case 'AbsenteeBallot':
//       return React.lazy(() => import('../pages/More/AbsenteeBallot'));
//     case 'AddCandidateForExtension':
//       return React.lazy(() => import('../pages/Ballot/AddCandidateForExtension'));
//     case 'AppleSignInProcess':
//       return React.lazy(() => import('../pages/Process/AppleSignInProcess'));
//     case 'Application':
//       return React.lazy(() => import('../Application'));
//     case 'Attributions':
//       return React.lazy(() => import('../pages/More/Attributions'));
//     case 'Ballot':
//       return React.lazy(() => import('../pages/Ballot/Ballot'));
//     case 'BallotIndex':
//       return React.lazy(() => import('../pages/Ballot/BallotIndex'));
//     case 'Candidate':
//       return React.lazy(() => import('../pages/Ballot/Candidate'));
//     case 'CandidateForExtension':
//       return React.lazy(() => import('../pages/Ballot/CandidateForExtension'));
//     case 'ClaimYourPage':
//       return React.lazy(() => import('../pages/Settings/ClaimYourPage'));
//     case 'Credits':
//       return React.lazy(() => import('../pages/More/Credits'));
//     case 'Donate':
//       return React.lazy(() => import('../pages/More/Donate'));
//     case 'DonateThankYou':
//       return React.lazy(() => import('../pages/More/DonateThankYou'));
//     case 'ElectionReminder':
//       return React.lazy(() => import('../pages/More/ElectionReminder'));
//     case 'Elections':
//       return React.lazy(() => import('../pages/More/Elections'));
//     case 'ExtensionSignIn':
//       return React.lazy(() => import('../pages/More/ExtensionSignIn'));
//     case 'FAQ':
//       return React.lazy(() => import('../pages/More/FAQ'));
//     case 'FacebookInvitableFriends':
//       return React.lazy(() => import('../pages/FacebookInvitableFriends'));
//     case 'FacebookLandingProcess':
//       return React.lazy(() => import('../pages/Process/FacebookLandingProcess'));
//     case 'FacebookRedirectToWeVote':
//       return React.lazy(() => import('../pages/More/FacebookRedirectToWeVote'));
//     case 'FriendInvitationByEmailVerifyProcess':
//       return React.lazy(() => import('../pages/Process/FriendInvitationByEmailVerifyProcess'));
//     case 'FriendInvitationOnboarding':
//       return React.lazy(() => import('../pages/Intro/FriendInvitationOnboarding'));
//     case 'Friends':
//       return React.lazy(() => import('../pages/Friends/Friends'));
//     case 'GetStarted':
//       return React.lazy(() => import('../pages/Intro/GetStarted'));
//     case 'HamburgerMenu':
//       return React.lazy(() => import('../pages/Settings/HamburgerMenu'));
//     case 'HowItWorks':
//       return React.lazy(() => import('../pages/HowItWorks'));
//     case 'Intro':
//       return React.lazy(() => import('../pages/Intro/Intro'));
//     case 'IntroNetwork':
//       return React.lazy(() => import('../pages/Intro/IntroNetwork'));
//     case 'Location':
//       return React.lazy(() => import('../pages/Settings/Location'));
//     case 'Measure':
//       return React.lazy(() => import('../pages/Ballot/Measure'));
//     case 'News':
//       return React.lazy(() => import('../pages/Activity/News'));
//     case 'Office':
//       return React.lazy(() => import('../pages/Ballot/Office'));
//     case 'Opinions':
//       return React.lazy(() => import('../pages/Opinions2020'));
//     case 'OpinionsFollowed':
//       return React.lazy(() => import('../pages/OpinionsFollowed'));
//     case 'OpinionsIgnored':
//       return React.lazy(() => import('../pages/OpinionsIgnored'));
//     case 'OrganizationVoterGuide':
//       return React.lazy(() => import('../pages/VoterGuide/OrganizationVoterGuide'));
//     case 'OrganizationVoterGuideCandidate':
//       return React.lazy(() => import('../pages/VoterGuide/OrganizationVoterGuideCandidate'));
//     case 'OrganizationVoterGuideEdit':
//       return React.lazy(() => import('../pages/VoterGuide/OrganizationVoterGuideEdit'));
//     case 'OrganizationVoterGuideMeasure':
//       return React.lazy(() => import('../pages/VoterGuide/OrganizationVoterGuideMeasure'));
//     case 'OrganizationVoterGuideOffice':
//       return React.lazy(() => import('../pages/VoterGuide/OrganizationVoterGuideOffice'));
//     case 'OrganizationVoterGuideMobileDetails':
//       return React.lazy(() => import('../pages/VoterGuide/OrganizationVoterGuideMobileDetails'));
//     case 'PageNotFound':
//       return React.lazy(() => import('../pages/PageNotFound'));
//     case 'Pricing':
//       return React.lazy(() => import('../pages/More/Pricing'));
//     case 'Privacy':
//       return React.lazy(() => import('../pages/More/Privacy'));
//     case 'ProcessingDonation':
//       return React.lazy(() => import('../pages/More/ProcessingDonation'));
//     // case 'ReadyNoApi':
//     //   return React.lazy(() => import('../pages/ReadyNoApi'));
//     default:
//     case 'Ready':
//       return React.lazy(() => import('../pages/Ready'));
//     case 'ReadyRedirect':
//       return React.lazy(() => import('../pages/ReadyRedirect'));
//     case 'Register':
//       return React.lazy(() => import('../pages/Register'));
//     case 'RegisterToVote':
//       return React.lazy(() => import('../pages/More/RegisterToVote'));
//     case 'SampleBallot':
//       return React.lazy(() => import('../pages/Intro/SampleBallot'));
//     case 'ScratchPad':
//       return React.lazy(() => import('../pages/ScratchPad'));
//     case 'SearchPage':
//       return React.lazy(() => import('../pages/More/SearchPage'));
//     case 'SettingsDashboard':
//       return React.lazy(() => import('../pages/Settings/SettingsDashboard'));
//     case 'SettingsMenuMobile':
//       return React.lazy(() => import('../pages/Settings/SettingsMenuMobile'));
//     case 'SettingsNotificationsUnsubscribe':
//       return React.lazy(() => import('../pages/Settings/SettingsNotificationsUnsubscribe'));
//     case 'SharedItemLanding':
//       return React.lazy(() => import('../pages/SharedItemLanding'));
//     case 'SignInJumpProcess':
//       return React.lazy(() => import('../pages/Process/SignInJumpProcess'));
//     case 'SignInEmailProcess':
//       return React.lazy(() => import('../pages/Process/SignInEmailProcess'));
//     case 'TermsOfService':
//       return React.lazy(() => import('../pages/More/TermsOfService'));
//     case 'TwitterHandleLanding':
//       return React.lazy(() => import('../pages/TwitterHandleLanding'));
//     case 'TwitterSignInProcess':
//       return React.lazy(() => import('../pages/Process/TwitterSignInProcess'));
//     case 'Values':
//       return React.lazy(() => import('../pages/Values'));
//     case 'ValuesList':
//       return React.lazy(() => import('../pages/Values/ValuesList'));
//     case 'Vote':
//       return React.lazy(() => import('../pages/Vote'));
//     case 'VerifyEmailProcess':
//       return React.lazy(() => import('../pages/Process/VerifyEmailProcess'));
//     case 'VoterGuideListDashboard':
//       return React.lazy(() => import('../pages/Settings/VoterGuideListDashboard'));
//     case 'VoterGuideSettingsDashboard':
//       return React.lazy(() => import('../pages/Settings/VoterGuideSettingsDashboard'));
//     case 'VoterGuideSettingsMenuMobile':
//       return React.lazy(() => import('../pages/Settings/VoterGuideSettingsMenuMobile'));
//     case 'VoterGuidesMenuMobile':
//       return React.lazy(() => import('../pages/Settings/VoterGuidesMenuMobile'));
//     case 'VoterGuidesUnderOneValue':
//       return React.lazy(() => import('../pages/Values/VoterGuidesUnderOneValue'));
//     case 'VerifyRegistration':
//       return React.lazy(() => import('../pages/More/VerifyRegistration'));
//     case 'VerifyThisIsMe':
//       return React.lazy(() => import('../pages/VoterGuide/VerifyThisIsMe'));
//     case 'WelcomeForVoters':
//       return React.lazy(() => import('../pages/WelcomeForVoters'));
//     case 'WelcomeForCampaigns':
//       return React.lazy(() => import('../pages/WelcomeForCampaigns'));
//     case 'WelcomeForOrganizations':
//       return React.lazy(() => import('../pages/WelcomeForOrganizations'));
//     case 'WeVoteBallotEmbed':
//       return React.lazy(() => import('../pages/More/WeVoteBallotEmbed'));
//     case 'YourPage':
//       return React.lazy(() => import('../pages/YourPage'));
//   }
// }
