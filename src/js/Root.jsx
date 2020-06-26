import React, { Suspense } from 'react';
import { Route, IndexRoute, IndexRedirect } from 'react-router';
import cookies from './utils/cookies';
import { isWebApp } from './utils/cordovaUtils';
const About = React.lazy(() => import('./routes/More/About'));
const AbsenteeBallot = React.lazy(() => import('./routes/More/AbsenteeBallot'));
const AddCandidateForExtension = React.lazy(() => import('./routes/Ballot/AddCandidateForExtension'));
const Application = React.lazy(() => import('./Application'));
const Ballot = React.lazy(() => import('./routes/Ballot/Ballot'));
const Attributions = React.lazy(() => import('./routes/More/Attributions'));
const BallotIndex = React.lazy(() => import('./routes/Ballot/BallotIndex'));
const Candidate = React.lazy(() => import('./routes/Ballot/Candidate'));
const CandidateForExtension = React.lazy(() => import('./routes/Ballot/CandidateForExtension'));
const ClaimYourPage = React.lazy(() => import('./routes/Settings/ClaimYourPage'));
const Connect = React.lazy(() => import('./routes/Connect'));
const Credits = React.lazy(() => import('./routes/More/Credits'));
const Donate = React.lazy(() => import('./routes/More/Donate'));
const DonateThankYou = React.lazy(() => import('./routes/More/DonateThankYou'));
const StripeElementsTest = React.lazy(() => import('./routes/More/StripeElementsTest'));
const ElectionReminder = React.lazy(() => import('./routes/More/ElectionReminder'));
const Elections = React.lazy(() => import('./routes/More/Elections'));
const ExtensionSignIn = React.lazy(() => import('./routes/More/ExtensionSignIn'));
const FAQ = React.lazy(() => import('./routes/More/FAQ'));
const FacebookInvitableFriends = React.lazy(() => import('./routes/FacebookInvitableFriends'));
const FacebookLandingProcess = React.lazy(() => import('./routes/Process/FacebookLandingProcess'));
const FacebookRedirectToWeVote = React.lazy(() => import('./routes/More/FacebookRedirectToWeVote'));
const FriendInvitationByEmailVerifyProcess = React.lazy(() => import('./routes/Process/FriendInvitationByEmailVerifyProcess'));
const FriendInvitationOnboarding = React.lazy(() => import('./routes/Intro/FriendInvitationOnboarding'));
const Friends = React.lazy(() => import('./routes/Friends'));
const GetStarted = React.lazy(() => import('./routes/Intro/GetStarted'));
const HamburgerMenu = React.lazy(() => import('./routes/Settings/HamburgerMenu'));
const HowItWorks = React.lazy(() => import('./routes/HowItWorks'));
const Intro = React.lazy(() => import('./routes/Intro/Intro'));
const IntroNetwork = React.lazy(() => import('./routes/Intro/IntroNetwork'));
const Location = React.lazy(() => import('./routes/Settings/Location'));
const Measure = React.lazy(() => import('./routes/Ballot/Measure'));
const News = React.lazy(() => import('./routes/News'));
const Office = React.lazy(() => import('./routes/Ballot/Office'));
const Opinions = React.lazy(() => import('./routes/Opinions'));
const OpinionsFollowed = React.lazy(() => import('./routes/OpinionsFollowed'));
const OpinionsIgnored = React.lazy(() => import('./routes/OpinionsIgnored'));
const OrganizationVoterGuide = React.lazy(() => import('./routes/VoterGuide/OrganizationVoterGuide'));
const OrganizationVoterGuideCandidate = React.lazy(() => import('./routes/VoterGuide/OrganizationVoterGuideCandidate'));
const OrganizationVoterGuideEdit = React.lazy(() => import('./routes/VoterGuide/OrganizationVoterGuideEdit'));
const OrganizationVoterGuideMeasure = React.lazy(() => import('./routes/VoterGuide/OrganizationVoterGuideMeasure'));
const OrganizationVoterGuideOffice = React.lazy(() => import('./routes/VoterGuide/OrganizationVoterGuideOffice'));
const OrganizationVoterGuideMobileDetails = React.lazy(() => import('./routes/VoterGuide/OrganizationVoterGuideMobileDetails'));
const PageNotFound = React.lazy(() => import('./routes/PageNotFound'));
const Pricing = React.lazy(() => import('./routes/More/Pricing'));
const Privacy = React.lazy(() => import('./routes/More/Privacy'));
const ProcessingDonation = React.lazy(() => import('./routes/More/ProcessingDonation'));
const ReadyNoApi = React.lazy(() => import('./routes/ReadyNoApi'));
const Ready = React.lazy(() => import('./routes/Ready'));
const ReadyRedirect = React.lazy(() => import('./routes/ReadyRedirect'));
const RegisterToVote = React.lazy(() => import('./routes/More/RegisterToVote'));
const SampleBallot = React.lazy(() => import('./routes/Intro/SampleBallot'));
const ScratchPad = React.lazy(() => import('./routes/ScratchPad'));
const SearchPage = React.lazy(() => import('./routes/More/SearchPage'));
const SettingsDashboard = React.lazy(() => import('./routes/Settings/SettingsDashboard'));
const SettingsMenuMobile = React.lazy(() => import('./routes/Settings/SettingsMenuMobile'));
const SharedItemLanding = React.lazy(() => import('./routes/SharedItemLanding'));
const SignInJumpProcess = React.lazy(() => import('./routes/Process/SignInJumpProcess'));
const SignInEmailProcess = React.lazy(() => import('./routes/Process/SignInEmailProcess'));
const TermsOfService = React.lazy(() => import('./routes/More/TermsOfService'));
const TwitterHandleLanding = React.lazy(() => import('./routes/TwitterHandleLanding'));
const TwitterSignInProcess = React.lazy(() => import('./routes/Process/TwitterSignInProcess'));
const Values = React.lazy(() => import('./routes/Values'));
const ValuesList = React.lazy(() => import('./routes/Values/ValuesList'));
const Vote = React.lazy(() => import('./routes/Vote'));
const VerifyEmailProcess = React.lazy(() => import('./routes/Process/VerifyEmailProcess'));
const VoterGuideListDashboard = React.lazy(() => import('./routes/Settings/VoterGuideListDashboard'));
const VoterGuideSettingsDashboard = React.lazy(() => import('./routes/Settings/VoterGuideSettingsDashboard'));
const VoterGuideSettingsMenuMobile = React.lazy(() => import('./routes/Settings/VoterGuideSettingsMenuMobile'));
const VoterGuidesMenuMobile = React.lazy(() => import('./routes/Settings/VoterGuidesMenuMobile'));
const VoterGuidesUnderOneValue = React.lazy(() => import('./routes/Values/VoterGuidesUnderOneValue'));
const VerifyRegistration = React.lazy(() => import('./routes/More/VerifyRegistration'));
const VerifyThisIsMe = React.lazy(() => import('./routes/VoterGuide/VerifyThisIsMe'));
const WelcomeForVoters = React.lazy(() => import('./routes/WelcomeForVoters'));
const WelcomeForCampaigns = React.lazy(() => import('./routes/WelcomeForCampaigns'));
const WelcomeForOrganizations = React.lazy(() => import('./routes/WelcomeForOrganizations'));
const WeVoteBallotEmbed = React.lazy(() => import('./routes/More/WeVoteBallotEmbed'));
const YourPage = React.lazy(() => import('./routes/YourPage'));
const Register = React.lazy(() => import('./routes/Register'));

// See /js/components/Navigation/HeaderBar.jsx for show_full_navigation cookie
// const ballotHasBeenVisited = cookies.getItem('ballot_has_been_visited');
const firstVisit = !cookies.getItem('voter_device_id');
const { hostname } = window.location;
const weVoteSites = ['wevote.us', 'quality.wevote.us', 'localhost', ''];   // localhost on Cordova is a ''
const isWeVoteMarketingSite = weVoteSites.includes(String(hostname));
const isNotWeVoteMarketingSite = !isWeVoteMarketingSite;


const routes = () => {  // eslint-disable-line arrow-body-style
  // console.log('window.innerWidth:', window.innerWidth);
  return (
    <Route path="/">
      {                       // 12/4/18: Not sure why we need the following disabled
        (function redir () {  // eslint-disable-line wrap-iife
          if (isWebApp()) {
            // return ballotHasBeenVisited ? <IndexRedirect to="/ballot" /> : <IndexRedirect to="/ready" />;
            return <IndexRedirect to="/ready" />;
          } else {
            return firstVisit ? <IndexRedirect to="/wevoteintro/network" /> : <IndexRedirect to="/ready" />;
          }
        }
        )()
      }
      <Suspense fallback={<div>Loading...</div>}>
        <Route path="/getready" component={ReadyNoApi} />
      </Suspense>
      <Suspense fallback={<div>Loading...</div>}>
        <Route path="/" component={Application}>
          <Route component={Intro} />
          <Route path="/welcome" component={isNotWeVoteMarketingSite ? ReadyRedirect : props => <WelcomeForVoters {...props} pathname="/welcome" />} />
          <Route path="/news" component={News} />
          <Route path="/ready" component={Ready} />
          <Route path="/register" component={Register} />
          <Route path="/ballot" component={BallotIndex}>
            <IndexRoute component={Ballot} />
            <Route path="/ballot?voter_refresh_timer_on=:voter_refresh_timer_on" component={Ballot} />
            <Route path="/office/:office_we_vote_id/b/:back_to_variable/modal/:modal_to_show" component={Office} />
            <Route path="/office/:office_we_vote_id/b/:back_to_variable/" component={Office} />
            <Route path="/office/:office_we_vote_id/b/:back_to_variable" component={Office} />
            <Route path="/office/:office_we_vote_id/modal/:modal_to_show/:shared_item_code" component={Office} />
            <Route path="/office/:office_we_vote_id/modal/:modal_to_show" component={Office} />
            <Route path="/office/:office_we_vote_id/:back_to_variable/:organization_we_vote_id" component={OrganizationVoterGuideOffice} />
            <Route path="/office/:office_we_vote_id/:organization_we_vote_id" component={OrganizationVoterGuideOffice} />
            <Route path="/office/:office_we_vote_id" component={Office} />
            <Route path="/candidate/:candidate_we_vote_id/b/:back_to_variable/modal/:modal_to_show/:shared_item_code" component={Candidate} />
            <Route path="/candidate/:candidate_we_vote_id/b/:back_to_variable/modal/:modal_to_show" component={Candidate} />
            <Route path="/candidate/:candidate_we_vote_id/b/:back_to_variable/" component={Candidate} />
            <Route path="/candidate/:candidate_we_vote_id/b/:back_to_variable" component={Candidate} />
            <Route path="/candidate/:candidate_we_vote_id/modal/:modal_to_show/:shared_item_code" component={Candidate} />
            <Route path="/candidate/:candidate_we_vote_id/modal/:modal_to_show" component={Candidate} />
            <Route path="/candidate/:candidate_we_vote_id/:back_to_variable/:organization_we_vote_id" component={OrganizationVoterGuideCandidate} />
            <Route path="/candidate/:candidate_we_vote_id/:organization_we_vote_id" component={OrganizationVoterGuideCandidate} />
            <Route path="/candidate/:candidate_we_vote_id" component={Candidate} />
            <Route path="/measure/:measure_we_vote_id/b/:back_to_variable/modal/:modal_to_show/:shared_item_code" component={Measure} />
            <Route path="/measure/:measure_we_vote_id/b/:back_to_variable/modal/:modal_to_show" component={Measure} />
            <Route path="/measure/:measure_we_vote_id/b/:back_to_variable/" component={Measure} />
            <Route path="/measure/:measure_we_vote_id/b/:back_to_variable" component={Measure} />
            <Route path="/measure/:measure_we_vote_id/modal/:modal_to_show/:shared_item_code" component={Measure} />
            <Route path="/measure/:measure_we_vote_id/modal/:modal_to_show" component={Measure} />
            <Route path="/measure/:measure_we_vote_id/:back_to_variable/:organization_we_vote_id" component={OrganizationVoterGuideMeasure} />
            <Route path="/measure/:measure_we_vote_id" component={Measure} />
          </Route>
          <Route path="/ballot/vote" component={Vote} />
          <Route path="/ballot/modal/:modal_to_show/:shared_item_code" component={Ballot} />
          <Route path="/ballot/modal/:modal_to_show" component={Ballot} />
          <Route path="/ballot/:ballot_location_shortcut/modal/:modal_to_show/:shared_item_code" component={Ballot} />
          <Route path="/ballot/:ballot_location_shortcut/modal/:modal_to_show" component={Ballot} />
          <Route path="/ballot/:ballot_location_shortcut" component={Ballot} />
          <Route path="/ballot/id/:ballot_returned_we_vote_id/modal/:modal_to_show/:shared_item_code" component={Ballot} />
          <Route path="/ballot/id/:ballot_returned_we_vote_id/modal/:modal_to_show" component={Ballot} />
          <Route path="/ballot/id/:ballot_returned_we_vote_id" component={Ballot} />
          <Route path="/ballot/election/:google_civic_election_id/modal/:modal_to_show/:shared_item_code" component={Ballot} />
          <Route path="/ballot/election/:google_civic_election_id/modal/:modal_to_show" component={Ballot} />
          <Route path="/ballot/election/:google_civic_election_id" component={Ballot} />

          <Route path="/candidate-for-extension" component={CandidateForExtension} />
          <Route path="/add-candidate-for-extension" component={AddCandidateForExtension} />
          <Route path="/for-campaigns" component={isNotWeVoteMarketingSite ? ReadyRedirect : props => <WelcomeForCampaigns {...props} pathname="/for-campaigns" />} />
          <Route path="/for-organizations" component={isNotWeVoteMarketingSite ? ReadyRedirect : props => <WelcomeForOrganizations {...props} pathname="/for-organizations" />} />
          <Route path="/how" component={isNotWeVoteMarketingSite ? ReadyRedirect : HowItWorks} />
          <Route path="/how/:category_string" component={isNotWeVoteMarketingSite ? ReadyRedirect : HowItWorks} />
          <Route path="/intro" component={Intro} />
          <Route path="/wevoteintro/network" component={IntroNetwork} />
          <Route path="/intro/sample_ballot" component={SampleBallot} />
          <Route path="/intro/get_started" component={GetStarted} />

          {/* Your Settings go in this structure... */}
          {/* Complete path on one line for searching */}
          <Route path="/settings" component={SettingsDashboard} />
          <Route path="/settings/claim" component={ClaimYourPage} />
          <Route path="/settings/hamburger" component={HamburgerMenu} />
          <Route path="/settings/location" component={Location} />
          <Route path="/settings/menu" component={SettingsMenuMobile} />
          <Route path="/settings/voterguidelist" component={VoterGuideListDashboard} />
          <Route path="/settings/voterguidesmenu" component={VoterGuidesMenuMobile} />
          {/* settings/:edit_mode includes "/settings/account", "/settings/address", "/settings/domain", "/settings/election",
          "/settings/issues_linked", "/settings/issues_to_link", "/settings/issues", "/settings/notifications",
          "/settings/profile", "/settings/text", "/settings/tools" */}
          <Route path="/settings/:edit_mode" component={SettingsDashboard} />
          <Route path="/settings/issues/:edit_mode" component={SettingsDashboard} />
          <Route path="/settings/:edit_mode/:voter_guide_we_vote_id" component={SettingsDashboard} />

          {/* Ballot Off-shoot Pages */}
          <Route path="/opinions" component={Opinions} />
          <Route path="/opinions_followed" component={OpinionsFollowed} />
          <Route path="/opinions_ignored" component={OpinionsIgnored} />

          {/* Friend related Pages */}
          <Route path="/friends" component={Friends} />
          <Route path="/friends/:tabItem" component={Friends} />
          <Route path="/facebook_invitable_friends" component={FacebookInvitableFriends} />
          <Route path="/wevoteintro/newfriend/:invitationSecretKey" component={FriendInvitationOnboarding} />

          {/* More Menu Pages */}
          <Route path="/more/about" component={isNotWeVoteMarketingSite ? ReadyRedirect : About} />
          <Route path="/more/absentee" component={AbsenteeBallot} />
          <Route path="/more/alerts" component={ElectionReminder} />
          <Route path="/more/attributions" component={Attributions} />
          <Route path="/more/connect" component={Connect} />
          <Route path="/more/credits" component={Credits} />
          <Route path="/more/donate" component={isNotWeVoteMarketingSite ? ReadyRedirect : Donate} />
          <Route path="/more/donate_thank_you" component={isNotWeVoteMarketingSite ? ReadyRedirect : DonateThankYou} />
          <Route path="/more/extensionsignin" component={ExtensionSignIn} />
          <Route path="/more/stripe_elements_test" component={StripeElementsTest} />
          <Route path="/more/elections" component={Elections} />
          <Route path="/more/facebooklandingprocess" component={FacebookLandingProcess} />
          <Route path="/more/facebookredirecttowevote" component={FacebookRedirectToWeVote} />
          <Route path="/more/faq" component={FAQ} />
          <Route path="/more/jump" component={SignInJumpProcess} />
          <Route path="/more/myballot" component={WeVoteBallotEmbed} />
          <Route path="/more/network" component={Friends} />
          <Route path="/more/network/key/:invitation_secret_key" component={FriendInvitationByEmailVerifyProcess} />
          <Route path="/more/network/key/:invitation_secret_key/ignore" component={FriendInvitationByEmailVerifyProcess} />
          {/* Redirecting old URLs to new components */}
          <Route path="/more/network/friends" component={Friends} />
          <Route path="/more/network/organizations" component={Values} />
          <Route path="/more/pricing" component={isNotWeVoteMarketingSite ? ReadyRedirect : Pricing} />
          <Route path="/more/pricing/:pricing_choice" component={isNotWeVoteMarketingSite ? ReadyRedirect : Pricing} />
          <Route path="/more/privacy" component={Privacy} />
          <Route path="/more/processing_donation" component={ProcessingDonation} />
          <Route path="/more/register" component={RegisterToVote} />
          <Route path="/more/search_page" component={SearchPage} />
          <Route path="/more/search_page/:encoded_search_string" component={SearchPage} />
          <Route path="/more/terms" component={TermsOfService} />
          <Route path="/more/verify" component={VerifyRegistration} />
          <Route path="/values" component={Values} />
          <Route path="/values/list" component={ValuesList} />
          <Route path="/value/:value_slug" component={VoterGuidesUnderOneValue} />

          {/* Voter Guide Pages - By Organization */}
          <Route path="/voterguide/:organization_we_vote_id" component={props => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
          <Route path="/voterguide/:organization_we_vote_id/ballot" component={props => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
          <Route path="/voterguide/:organization_we_vote_id/ballot/empty" component={props => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
          <Route path="/voterguide/:organization_we_vote_id/ballot/:ballot_location_shortcut" component={props => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
          <Route path="/voterguide/:organization_we_vote_id/ballot/id/:ballot_returned_we_vote_id" component={props => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
          <Route path="/voterguide/:organization_we_vote_id/ballot/election/:google_civic_election_id" component={props => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
          <Route path="/voterguide/:organization_we_vote_id/ballot/election/:google_civic_election_id/ballot" component={props => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
          <Route path="/voterguide/:organization_we_vote_id/ballot/election/:google_civic_election_id/m/friends" component={props => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />} />
          <Route path="/voterguide/:organization_we_vote_id/ballot/election/:google_civic_election_id/following" component={props => <OrganizationVoterGuide {...props} activeRoute="following" />} />
          <Route path="/voterguide/:organization_we_vote_id/ballot/election/:google_civic_election_id/m/following" component={props => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
          <Route path="/voterguide/:organization_we_vote_id/ballot/election/:google_civic_election_id/followers" component={props => <OrganizationVoterGuide {...props} activeRoute="followers" />} />
          <Route path="/voterguide/:organization_we_vote_id/ballot/election/:google_civic_election_id/m/followers" component={props => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
          <Route path="/voterguide/:organization_we_vote_id/ballot/election/:google_civic_election_id/positions" component={props => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
          <Route path="/voterguide/:organization_we_vote_id/m/friends" component={props => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />} />
          <Route path="/voterguide/:organization_we_vote_id/followers" component={props => <OrganizationVoterGuide {...props} activeRoute="followers" />} />
          <Route path="/voterguide/:organization_we_vote_id/m/followers" component={props => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
          <Route path="/voterguide/:organization_we_vote_id/following" component={props => <OrganizationVoterGuide {...props} activeRoute="following" />} />
          <Route path="/voterguide/:organization_we_vote_id/m/following" component={props => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
          <Route path="/voterguide/:organization_we_vote_id/positions" component={props => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
          <Route path="/voterguide/:organization_we_vote_id/:action_variable" component={OrganizationVoterGuide} />
          <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable" component={OrganizationVoterGuide} />
          <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/m/friends" component={props => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />} />
          <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/followers" component={props => <OrganizationVoterGuide {...props} activeRoute="followers" />} />
          <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/m/followers" component={props => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
          <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/following" component={props => <OrganizationVoterGuide {...props} activeRoute="following" />} />
          <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/m/following" component={props => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
          <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/positions" component={props => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
          <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/:action_variable" component={OrganizationVoterGuide} />
          <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/:action_variable/m/friends" component={props => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />} />
          <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/:action_variable/m/following" component={props => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
          <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/:action_variable/m/followers" component={props => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
          <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable" component={OrganizationVoterGuide} />
          <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/m/friends" component={props => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />} />
          <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/followers" component={props => <OrganizationVoterGuide {...props} activeRoute="followers" />} />
          <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/m/followers" component={props => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
          <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/following" component={props => <OrganizationVoterGuide {...props} activeRoute="following" />} />
          <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/m/following" component={props => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
          <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/positions" component={props => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
          <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/:action_variable" component={OrganizationVoterGuide} />
          <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/:action_variable/m/friends" component={props => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />} />
          <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/:action_variable/m/followers" component={props => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
          <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/:action_variable/m/following" component={props => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
          <Route path="/voterguideedit/:organization_we_vote_id" component={OrganizationVoterGuideEdit} />
          <Route path="/voterguideedit/:organization_we_vote_id/:google_civic_election_id" component={OrganizationVoterGuideEdit} />

          {/* Voter Guide Settings go in this structure... "/vg/wvYYvgYY/settings/positions", "/vg/wvYYvgYY/settings/addpositions" */}
          <Route path="/vg/:voter_guide_we_vote_id/settings" component={VoterGuideSettingsDashboard} />
          <Route path="/vg/:voter_guide_we_vote_id/settings/menu" component={VoterGuideSettingsMenuMobile} />
          <Route path="/vg/:voter_guide_we_vote_id/settings/positions" component={VoterGuideSettingsDashboard} />

          <Route path="/yourpage" component={YourPage} />

          <Route path="/twitter_sign_in" component={TwitterSignInProcess} />

          <Route path="/verify_email/:email_secret_key" component={VerifyEmailProcess} />
          <Route path="/sign_in_email/:email_secret_key" component={SignInEmailProcess} />

          {/* Confirming that person owns twitter handle */}
          <Route path="/verifythisisme/:twitter_handle" component={VerifyThisIsMe} />
          <Route path="/twittersigninprocess/:sign_in_step" component={TwitterSignInProcess} />

          {/* Custom link. "/-/" is controlled by customer and tied to hostname, "/-" is generated by software */}
          <Route path="/-/:custom_link_string" component={SharedItemLanding} />
          <Route path="/-:shared_item_code" component={SharedItemLanding} />

          {/* Temporary scratchpad for component testing */}
          <Route path="/testing/scratchpad" component={isNotWeVoteMarketingSite ? ReadyRedirect : ScratchPad} />

          <Route path=":twitter_handle/ballot/empty" component={TwitterHandleLanding} />
          <Route path=":twitter_handle/ballot/:ballot_location_shortcut" component={TwitterHandleLanding} />
          <Route path=":twitter_handle/ballot/id/:ballot_returned_we_vote_id" component={TwitterHandleLanding} />
          <Route path=":twitter_handle/ballot/id/:ballot_returned_we_vote_id/:view_mode" component={TwitterHandleLanding} />
          <Route path=":twitter_handle/ballot/election/:google_civic_election_id" component={TwitterHandleLanding} />
          <Route path=":twitter_handle/ballot/election/:google_civic_election_id/:view_mode" component={TwitterHandleLanding} />
          {/* view_mode not taken in yet */}

          {/* Any route that is not found -> @return TwitterHandleLanding component */}
          <Route path=":twitter_handle/followers" component={props => <TwitterHandleLanding {...props} activeRoute="followers" />} />
          <Route path=":twitter_handle/following" component={props => <TwitterHandleLanding {...props} activeRoute="following" />} />
          <Route path=":twitter_handle/positions" component={props => <TwitterHandleLanding {...props} activeRoute="positions" />} />
          <Route path=":twitter_handle/m/friends" component={props => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />}  />
          <Route path=":twitter_handle/m/following" component={props => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
          <Route path=":twitter_handle/m/followers" component={props => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
          <Route path=":twitter_handle/:action_variable" component={TwitterHandleLanding} />
          <Route path=":twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable" component={TwitterHandleLanding} />
          <Route path=":twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/m/friends" component={props => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />} />
          <Route path=":twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/followers" component={props => <TwitterHandleLanding {...props} activeRoute="followers" />} />
          <Route path=":twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/m/followers" component={props => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
          <Route path=":twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/following" component={props => <TwitterHandleLanding {...props} activeRoute="following" />} />
          <Route path=":twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/m/following" component={props => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
          <Route path=":twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/positions" component={props => <TwitterHandleLanding {...props} activeRoute="positions" />} />
          <Route path=":twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/:action_variable" component={TwitterHandleLanding} />
          <Route path=":twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/:action_variable/m/friends" component={props => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />} />
          <Route path=":twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/:action_variable/m/followers" component={props => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
          <Route path=":twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/:action_variable/m/following" component={props => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
          <Route path=":twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable" component={TwitterHandleLanding} />
          <Route path=":twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/m/friends" component={props => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />} />
          <Route path=":twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/followers" component={props => <TwitterHandleLanding {...props} activeRoute="followers" />} />
          <Route path=":twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/m/followers" component={props => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
          <Route path=":twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/following" component={props => <TwitterHandleLanding {...props} activeRoute="following" />} />
          <Route path=":twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/m/following" component={props => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
          <Route path=":twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/positions" component={props => <TwitterHandleLanding {...props} activeRoute="positions" />} />
          <Route path=":twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/:action_variable" component={TwitterHandleLanding} />
          <Route path=":twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/:action_variable/m/friends" component={props => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />} />
          <Route path=":twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/:action_variable/m/followers" component={props => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
          <Route path=":twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/:action_variable/m/following" component={props => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
          <Route path=":twitter_handle" component={TwitterHandleLanding} />
          <Route path="*" component={PageNotFound} />
        </Route>
      </Suspense>
    </Route>
  );
};

export default routes;
