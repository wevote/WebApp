import React from 'react';
import { Route, IndexRoute, IndexRedirect } from 'react-router';
// import GetReady from './routes/GetReady';
import About from './routes/More/About';
import AbsenteeBallot from './routes/More/AbsenteeBallot';
import AddCandidateForExtension from './routes/Ballot/AddCandidateForExtension';
import Application from './Application';
import Attributions from './routes/More/Attributions';
import Ballot from './routes/Ballot/Ballot';
import BallotIndex from './routes/Ballot/BallotIndex';
import Candidate from './routes/Ballot/Candidate';
import CandidateForExtension from './routes/Ballot/CandidateForExtension';
import ClaimYourPage from './routes/Settings/ClaimYourPage';
import Connect from './routes/Connect';
import Credits from './routes/More/Credits';
import Donate from './routes/More/Donate';
import DonateThankYou from './routes/More/DonateThankYou';
import ElectionReminder from './routes/More/ElectionReminder';
import Elections from './routes/More/Elections';
import ExtensionSignIn from './routes/More/ExtensionSignIn';
import FAQ from './routes/More/FAQ';
import FacebookInvitableFriends from './routes/FacebookInvitableFriends';
import FacebookLandingProcess from './routes/Process/FacebookLandingProcess';
import FacebookRedirectToWeVote from './routes/More/FacebookRedirectToWeVote';
import FriendInvitationByEmailVerifyProcess from './routes/Process/FriendInvitationByEmailVerifyProcess';
import FriendInvitationOnboarding from './routes/Intro/FriendInvitationOnboarding';
import Friends from './routes/Friends';
import GetStarted from './routes/Intro/GetStarted';
import HamburgerMenu from './routes/Settings/HamburgerMenu';
import HowItWorks from './routes/HowItWorks';
import Intro from './routes/Intro/Intro';
import IntroNetwork from './routes/Intro/IntroNetwork';
import Location from './routes/Settings/Location';
import Measure from './routes/Ballot/Measure';
import News from './routes/Activity/News';
import Office from './routes/Ballot/Office';
import Opinions from './routes/Opinions';
import OpinionsFollowed from './routes/OpinionsFollowed';
import OpinionsIgnored from './routes/OpinionsIgnored';
import OrganizationVoterGuide from './routes/VoterGuide/OrganizationVoterGuide';
import OrganizationVoterGuideCandidate from './routes/VoterGuide/OrganizationVoterGuideCandidate';
import OrganizationVoterGuideEdit from './routes/VoterGuide/OrganizationVoterGuideEdit';
import OrganizationVoterGuideMeasure from './routes/VoterGuide/OrganizationVoterGuideMeasure';
import OrganizationVoterGuideMobileDetails from './routes/VoterGuide/OrganizationVoterGuideMobileDetails';
import OrganizationVoterGuideOffice from './routes/VoterGuide/OrganizationVoterGuideOffice';
import PageNotFound from './routes/PageNotFound';
import Pricing from './routes/More/Pricing';
import Privacy from './routes/More/Privacy';
import ProcessingDonation from './routes/More/ProcessingDonation';
import Ready from './routes/Ready';
import ReadyRedirect from './routes/ReadyRedirect';
import Register from './routes/Register';
import RegisterToVote from './routes/More/RegisterToVote';
import SampleBallot from './routes/Intro/SampleBallot';
import ScratchPad from './routes/ScratchPad';
import SearchPage from './routes/More/SearchPage';
import SettingsDashboard from './routes/Settings/SettingsDashboard';
import SettingsMenuMobile from './routes/Settings/SettingsMenuMobile';
import SharedItemLanding from './routes/SharedItemLanding';
import SignInEmailProcess from './routes/Process/SignInEmailProcess';
import SignInJumpProcess from './routes/Process/SignInJumpProcess';
import StripeElementsTest from './routes/More/StripeElementsTest';
import TermsOfService from './routes/More/TermsOfService';
import TwitterHandleLanding from './routes/TwitterHandleLanding';
import TwitterSignInProcess from './routes/Process/TwitterSignInProcess';
import Values from './routes/Values';
import ValuesList from './routes/Values/ValuesList';
import VerifyEmailProcess from './routes/Process/VerifyEmailProcess';
import VerifyRegistration from './routes/More/VerifyRegistration';
import VerifyThisIsMe from './routes/VoterGuide/VerifyThisIsMe';
import Vote from './routes/Vote';
import VoterGuideListDashboard from './routes/Settings/VoterGuideListDashboard';
import VoterGuideSettingsDashboard from './routes/Settings/VoterGuideSettingsDashboard';
import VoterGuideSettingsMenuMobile from './routes/Settings/VoterGuideSettingsMenuMobile';
import VoterGuidesMenuMobile from './routes/Settings/VoterGuidesMenuMobile';
import VoterGuidesUnderOneValue from './routes/Values/VoterGuidesUnderOneValue';
import WeVoteBallotEmbed from './routes/More/WeVoteBallotEmbed';
import WelcomeForCampaigns from './routes/WelcomeForCampaigns';
import WelcomeForOrganizations from './routes/WelcomeForOrganizations';
import WelcomeForVoters from './routes/WelcomeForVoters';
import YourPage from './routes/YourPage';
import cookies from './utils/cookies';
import { isWebApp } from './utils/cordovaUtils';
// TODO: import AppleSignInProcess from './routes/Process/AppleSignInProcess';

// See /js/components/Navigation/HeaderBar.jsx for show_full_navigation cookie
// const ballotHasBeenVisited = cookies.getItem('ballot_has_been_visited');
const firstVisit = !cookies.getItem('voter_device_id');
const { hostname } = window.location;
const weVoteSites = ['wevote.us', 'quality.wevote.us', 'localhost', ''];   // localhost on Cordova is a ''
const isWeVoteMarketingSite = weVoteSites.includes(String(hostname));
const isNotWeVoteMarketingSite = !isWeVoteMarketingSite;

const routesSingleBundle = () => {  // eslint-disable-line arrow-body-style
  // console.log('window.innerWidth:', window.innerWidth);
  return (
    <Route path="/" component={Application}>
      <Route component={Intro} />
      {                       // 12/4/18: Not sure why we need the following disabled
        (function redir () {  // eslint-disable-line wrap-iife
          if (isWebApp()) {
            // return ballotHasBeenVisited ? <IndexRedirect to="/ballot" /> : <IndexRedirect to="/ready" />;
            return <IndexRedirect to="/ballot" />;
          } else {
            return firstVisit ? <IndexRedirect to="/wevoteintro/network" /> : <IndexRedirect to="/ballot" />;
          }
        }
        )()
      }
      <Route path="/welcome" component={isNotWeVoteMarketingSite ? ReadyRedirect : props => <WelcomeForVoters {...props} pathname="/welcome" />} />
      <Route path="/news" component={News} />
      {/* <Route path="/getready" component={GetReady} /> */}
      <Route path="/ready" component={Ready} />
      <Route path="/ready/election/:google_civic_election_id" component={Ready} />
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
      {/* <Route path="/apple_sign_in_process" component={AppleSignInProcess} />* /}

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
  );
};

export default routesSingleBundle;
