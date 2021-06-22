import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import componentLoader from './utils/componentLoader';
import cookies from './utils/cookies';
import { isWebApp, polyfillFixes } from './utils/cordovaUtils';
import RouterV5SendMatch from './utils/RouterV5SendMatch';

import Application from './Application';
import News from './routes/Activity/News';
const AddCandidateForExtension = React.lazy(() => import('./routes/Ballot/AddCandidateForExtension'));
const Ballot = React.lazy(() => import('./routes/Ballot/Ballot'));
// const BallotIndex = React.lazy(() => import('./routes/Ballot/BallotIndex'));
const Candidate = React.lazy(() => import('./routes/Ballot/Candidate'));
const CandidateForExtension = React.lazy(() => import('./routes/Ballot/CandidateForExtension'));
const Measure = React.lazy(() => import('./routes/Ballot/Measure'));
const Office = React.lazy(() => import('./routes/Ballot/Office'));
const FacebookInvitableFriends = React.lazy(() => import('./routes/FacebookInvitableFriends'));
const Friends = React.lazy(() => import('./routes/Friends/Friends'));
const HowItWorks = React.lazy(() => import('./routes/HowItWorks'));
const FriendInvitationOnboarding = React.lazy(() => import('./routes/Intro/FriendInvitationOnboarding'));
const GetStarted = React.lazy(() => import('./routes/Intro/GetStarted'));
const Intro = React.lazy(() => import('./routes/Intro/Intro'));
const IntroNetwork = React.lazy(() => import('./routes/Intro/IntroNetwork'));
const SampleBallot = React.lazy(() => import('./routes/Intro/SampleBallot'));
const About = React.lazy(() => import('./routes/More/About'));
const AbsenteeBallot = React.lazy(() => import('./routes/More/AbsenteeBallot'));
const Attributions = React.lazy(() => import('./routes/More/Attributions'));
const Credits = React.lazy(() => import('./routes/More/Credits'));
const Donate = React.lazy(() => import('./routes/More/Donate'));
const DonateThankYou = React.lazy(() => import('./routes/More/DonateThankYou'));
const ElectionReminder = React.lazy(() => import('./routes/More/ElectionReminder'));
const Elections = React.lazy(() => import('./routes/More/Elections'));
const ExtensionSignIn = React.lazy(() => import('./routes/More/ExtensionSignIn'));
const FacebookRedirectToWeVote = React.lazy(() => import('./routes/More/FacebookRedirectToWeVote'));
const FAQ = React.lazy(() => import('./routes/More/FAQ'));
const Pricing = React.lazy(() => import('./routes/More/Pricing'));
const Privacy = React.lazy(() => import('./routes/More/Privacy'));
const ProcessingDonation = React.lazy(() => import('./routes/More/ProcessingDonation'));
const RegisterToVote = React.lazy(() => import('./routes/More/RegisterToVote'));
// const ScratchPad = React.lazy(() => import('./routes/ScratchPad'));
const SearchPage = React.lazy(() => import('./routes/More/SearchPage'));
const TermsOfService = React.lazy(() => import('./routes/More/TermsOfService'));
const VerifyRegistration = React.lazy(() => import('./routes/More/VerifyRegistration'));
const WeVoteBallotEmbed = React.lazy(() => import('./routes/More/WeVoteBallotEmbed'));
const Opinions2020 = React.lazy(() => import('./routes/Opinions2020'));
const OpinionsFollowed = React.lazy(() => import('./routes/OpinionsFollowed'));
const OpinionsIgnored = React.lazy(() => import('./routes/OpinionsIgnored'));
const PageNotFound = React.lazy(() => import('./routes/PageNotFound'));
const AppleSignInProcess = React.lazy(() => import('./routes/Process/AppleSignInProcess'));
const FacebookLandingProcess = React.lazy(() => import('./routes/Process/FacebookLandingProcess'));
const FriendInvitationByEmailVerifyProcess = React.lazy(() => import('./routes/Process/FriendInvitationByEmailVerifyProcess'));
const SignInEmailProcess = React.lazy(() => import('./routes/Process/SignInEmailProcess'));
const SignInJumpProcess = React.lazy(() => import('./routes/Process/SignInJumpProcess'));
const TwitterSignInProcess = React.lazy(() => import('./routes/Process/TwitterSignInProcess'));
const VerifyEmailProcess = React.lazy(() => import('./routes/Process/VerifyEmailProcess'));
// const GetReady = React.lazy(() => import('./routes/GetReady'));
const Ready = React.lazy(() => import('./routes/Ready'));
const ReadyRedirect = React.lazy(() => import('./routes/ReadyRedirect'));
const Register = React.lazy(() => import('./routes/Register'));
const ClaimYourPage = React.lazy(() => import('./routes/Settings/ClaimYourPage'));
const HamburgerMenu = React.lazy(() => import('./routes/Settings/HamburgerMenu'));
const Location = React.lazy(() => import('./routes/Settings/Location'));
const SettingsDashboard = React.lazy(() => import('./routes/Settings/SettingsDashboard'));
const SettingsMenuMobile = React.lazy(() => import('./routes/Settings/SettingsMenuMobile'));
const VoterGuideListDashboard = React.lazy(() => import('./routes/Settings/VoterGuideListDashboard'));
const VoterGuideSettingsDashboard = React.lazy(() => import('./routes/Settings/VoterGuideSettingsDashboard'));
const VoterGuideSettingsMenuMobile = React.lazy(() => import('./routes/Settings/VoterGuideSettingsMenuMobile'));
const VoterGuidesMenuMobile = React.lazy(() => import('./routes/Settings/VoterGuidesMenuMobile'));
const SharedItemLanding = React.lazy(() => import('./routes/SharedItemLanding'));
const TwitterHandleLanding = React.lazy(() => import('./routes/TwitterHandleLanding'));
const Values = React.lazy(() => import('./routes/Values'));
const ValuesList = React.lazy(() => import('./routes/Values/ValuesList'));
const VoterGuidesUnderOneValue = React.lazy(() => import('./routes/Values/VoterGuidesUnderOneValue'));
const Vote = React.lazy(() => import('./routes/Vote'));
const OrganizationVoterGuide = React.lazy(() => import('./routes/VoterGuide/OrganizationVoterGuide'));
const OrganizationVoterGuideCandidate = React.lazy(() => import('./routes/VoterGuide/OrganizationVoterGuideCandidate'));
const OrganizationVoterGuideMeasure = React.lazy(() => import('./routes/VoterGuide/OrganizationVoterGuideMeasure'));
const OrganizationVoterGuideMobileDetails = React.lazy(() => import('./routes/VoterGuide/OrganizationVoterGuideMobileDetails'));
const OrganizationVoterGuideOffice = React.lazy(() => import('./routes/VoterGuide/OrganizationVoterGuideOffice'));
const VerifyThisIsMe = React.lazy(() => import('./routes/VoterGuide/VerifyThisIsMe'));
const WelcomeForCampaigns = React.lazy(() => import('./routes/WelcomeForCampaigns'));
const WelcomeForOrganizations = React.lazy(() => import('./routes/WelcomeForOrganizations'));
const WelcomeForVoters = React.lazy(() => import('./routes/WelcomeForVoters'));
const YourPage = React.lazy(() => import('./routes/YourPage'));

polyfillFixes('Root.jsx');

// See /js/components/Navigation/HeaderBar.jsx for show_full_navigation cookie
// const ballotHasBeenVisited = cookies.getItem('ballot_has_been_visited');
const firstVisit = !cookies.getItem('voter_device_id');
// const { history } = window;
// const history = useHistory();
// const history = global.weVoteGlobalHistory;
let { hostname } = window.location;
hostname = hostname || '';
const weVoteSites = ['wevote.us', 'quality.wevote.us', 'localhost', 'silicon', ''];   // localhost on Cordova is a ''
const isWeVoteMarketingSite = weVoteSites.includes(String(hostname));
const isNotWeVoteMarketingSite = !isWeVoteMarketingSite;

/* eslint-disable react/jsx-props-no-spreading */
const routes = () => {
  // console.log('window.innerWidth:', window.innerWidth);
  console.log('Root.jsx routes immediately prior to instantiation');
  return (
    <>
      <Route exact path="/">
        {(function redirect () {
          if (isWebApp()) {
            return <Redirect to="/ready" />;
          } else {
            return firstVisit ? <Redirect to="/wevoteintro/network" /> : <Redirect to="/ready" />;
          }
        }())}
      </Route>
      {/* <Suspense fallback={<div>Loading...</div>}> */}
      {/*   <Route path="/getready" component={componentLoader('ReadyNoApi')} /> */}
      {/* </Suspense> */}
      <Suspense fallback={<div>Loading...</div>}>
        {/* <Route path="/settings/notifications/esk/:email_subscription_secret_key" component={componentLoader('SettingsNotificationsUnsubscribe')} /> */}
        <Application location={window.location}>
          {/* <Route component={({ match }) => { */}
          <Switch>
            {/* <Route component={componentLoader('Intro')} /> */}
            <Route path="/welcome" component={isNotWeVoteMarketingSite ? ReadyRedirect : (props) => <WelcomeForVoters {...props} pathname="/welcome" />} />
            <Route path="/news" component={News} />
            <Route path="/news/a/:activity_tidbit_we_vote_id" component={News} />
            <Route path="/news/a/" component={News} />
            <Route exact path="/ready" component={Ready} />
            <Route path="/ready/election/:google_civic_election_id" component={Ready} />
            <Route path="/ready/modal/:modal_to_show/:shared_item_code" render={(props) => (<RouterV5SendMatch componentName="Ready" {...props} />)} />
            <Route path="/ready/modal/:modal_to_show" render={(props) => (<RouterV5SendMatch componentName="Ready" {...props} />)} />
            <Route path="/register" component={Register} />
            <Route path="/ballot" component={Ballot} />
            {/* Subpages BallotIndex ?????????????? */}
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

            {/* Additional Ballot Paths */}
            <Route path="/ballot/vote" component={Vote} />
            <Route path="/ballot/modal/:modal_to_show/:shared_item_code" component={Ballot} />
            <Route path="/ballot/modal/:modal_to_show" component={Ballot} />
            <Route path="/ballot/id/:ballot_returned_we_vote_id/modal/:modal_to_show/:shared_item_code" component={Ballot} />
            <Route path="/ballot/id/:ballot_returned_we_vote_id/modal/:modal_to_show" component={Ballot} />
            <Route path="/ballot/id/:ballot_returned_we_vote_id" component={Ballot} />
            <Route path="/ballot/election/:google_civic_election_id/modal/:modal_to_show/:shared_item_code" component={Ballot} />
            <Route path="/ballot/election/:google_civic_election_id/modal/:modal_to_show" component={Ballot} />
            <Route path="/ballot/election/:google_civic_election_id" component={Ballot} />
            <Route path="/ballot/:ballot_location_shortcut/modal/:modal_to_show/:shared_item_code" component={Ballot} />
            <Route path="/ballot/:ballot_location_shortcut/modal/:modal_to_show" component={Ballot} />
            <Route path="/ballot/:ballot_location_shortcut" component={Ballot} />

            <Route path="/candidate-for-extension" component={CandidateForExtension} />
            <Route path="/add-candidate-for-extension" component={AddCandidateForExtension} />
            <Route path="/for-campaigns" component={isNotWeVoteMarketingSite ? ReadyRedirect : (props) => <WelcomeForCampaigns {...props} pathname="/for-campaigns" />} />
            <Route path="/for-organizations" component={isNotWeVoteMarketingSite ? ReadyRedirect : (props) => <WelcomeForOrganizations {...props} pathname="/for-organizations" />} />
            <Route path="/how" component={isNotWeVoteMarketingSite ? ReadyRedirect : HowItWorks} />
            <Route path="/how/:category_string" component={isNotWeVoteMarketingSite ? ReadyRedirect : HowItWorks} />
            <Route path="/intro" component={Intro} />
            <Route path="/wevoteintro/network" component={IntroNetwork} />
            <Route path="/intro/sample_ballot" component={SampleBallot} />
            <Route path="/intro/get_started" component={GetStarted} />

            {/* Your Settings go in this structure... */}
            {/* Complete path on one line for searching */}
            <Route exact path="/settings" component={SettingsDashboard} />
            <Route exact path="/settings/claim" component={ClaimYourPage} />
            <Route exact path="/settings/hamburger" component={HamburgerMenu} />
            <Route exact path="/settings/location" component={Location} />
            <Route exact path="/settings/menu" component={SettingsMenuMobile} />
            <Route exact path="/settings/voterguidelist" component={VoterGuideListDashboard} />
            <Route exact path="/settings/voterguidesmenu" component={VoterGuidesMenuMobile} />
            {/* settings/:edit_mode includes "/settings/account", "/settings/address", "/settings/domain", "/settings/election",
              "/settings/issues_linked", "/settings/issues_to_link", "/settings/issues", "/settings/notifications",
                "/settings/profile", "/settings/text", "/settings/tools" */}
            <Route path="/settings/issues/:edit_mode" render={(props) => (<RouterV5SendMatch componentName="SettingsDashboard" {...props} />)} />
            <Route path="/settings/:edit_mode" render={(props) => (<RouterV5SendMatch componentName="SettingsDashboard" {...props} />)} />
            <Route path="/settings/:edit_mode/:voter_guide_we_vote_id" render={(props) => (<RouterV5SendMatch componentName="SettingsDashboard" {...props} />)} />

            {/* Ballot Off-shoot Pages */}
            <Route path="/opinions" component={Opinions2020} />
            <Route path="/opinions/f/:selectedFilter" component={Opinions2020} />
            <Route path="/opinions/s/:searchTextDefault" component={Opinions2020} />
            <Route path="/opinions_followed" component={OpinionsFollowed} />
            <Route path="/opinions_ignored" component={OpinionsIgnored} />

            {/* Friend related Pages */}
            {/* /friends/current */}
            <Route exact path="/friends" component={Friends} />
            <Route exact path="/friends/:tabItem" component={Friends} />
            <Route path="/facebook_invitable_friends" component={FacebookInvitableFriends} />
            <Route path="/wevoteintro/newfriend/:invitationSecretKey" component={FriendInvitationOnboarding} />

            {/* More Menu Pages */}
            <Route path="/more/about" component={isNotWeVoteMarketingSite ? ReadyRedirect : About} />
            <Route path="/more/absentee" component={AbsenteeBallot} />
            <Route path="/more/alerts" component={ElectionReminder} />
            <Route path="/more/attributions" component={Attributions} />
            <Route path="/more/credits" component={Credits} />
            <Route path="/more/donate" component={isNotWeVoteMarketingSite ? ReadyRedirect : Donate} />
            <Route path="/more/donate_thank_you" component={isNotWeVoteMarketingSite ? ReadyRedirect : DonateThankYou} />
            <Route path="/more/extensionsignin" component={ExtensionSignIn} />
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
            <Route path="/voterguide/:organization_we_vote_id" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
            <Route path="/voterguide/:organization_we_vote_id/modal/:modal_to_show/:shared_item_code" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
            <Route path="/voterguide/:organization_we_vote_id/modal/:modal_to_show" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
            <Route path="/voterguide/:organization_we_vote_id/ballot" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
            <Route path="/voterguide/:organization_we_vote_id/ballot/empty" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
            <Route path="/voterguide/:organization_we_vote_id/ballot/:ballot_location_shortcut" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
            <Route path="/voterguide/:organization_we_vote_id/ballot/id/:ballot_returned_we_vote_id" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
            <Route path="/voterguide/:organization_we_vote_id/ballot/election/:google_civic_election_id" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
            <Route path="/voterguide/:organization_we_vote_id/ballot/election/:google_civic_election_id/ballot" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
            <Route path="/voterguide/:organization_we_vote_id/ballot/election/:google_civic_election_id/m/friends" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />} />
            <Route path="/voterguide/:organization_we_vote_id/ballot/election/:google_civic_election_id/following" component={(props) => <OrganizationVoterGuide {...props} activeRoute="following" />} />
            <Route path="/voterguide/:organization_we_vote_id/ballot/election/:google_civic_election_id/m/following" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
            <Route path="/voterguide/:organization_we_vote_id/ballot/election/:google_civic_election_id/followers" component={(props) => <OrganizationVoterGuide {...props} activeRoute="followers" />} />
            <Route path="/voterguide/:organization_we_vote_id/ballot/election/:google_civic_election_id/m/followers" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
            <Route path="/voterguide/:organization_we_vote_id/ballot/election/:google_civic_election_id/positions" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
            <Route path="/voterguide/:organization_we_vote_id/ballot/election/:google_civic_election_id/positions/modal/:modal_to_show/:shared_item_code" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
            <Route path="/voterguide/:organization_we_vote_id/ballot/election/:google_civic_election_id/positions/modal/:modal_to_show" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
            <Route path="/voterguide/:organization_we_vote_id/m/friends" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />} />
            <Route path="/voterguide/:organization_we_vote_id/followers" component={(props) => <OrganizationVoterGuide {...props} activeRoute="followers" />} />
            <Route path="/voterguide/:organization_we_vote_id/m/followers" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
            <Route path="/voterguide/:organization_we_vote_id/following" component={(props) => <OrganizationVoterGuide {...props} activeRoute="following" />} />
            <Route path="/voterguide/:organization_we_vote_id/m/following" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
            <Route path="/voterguide/:organization_we_vote_id/positions" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
            <Route path="/voterguide/:organization_we_vote_id/positions/modal/:modal_to_show/:shared_item_code" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
            <Route path="/voterguide/:organization_we_vote_id/positions/modal/:modal_to_show" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
            <Route path="/voterguide/:organization_we_vote_id/:action_variable" component={OrganizationVoterGuide} />
            <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable" component={OrganizationVoterGuide} />
            <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/modal/:modal_to_show/:shared_item_code" component={OrganizationVoterGuide} />
            <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/modal/:modal_to_show" component={OrganizationVoterGuide} />
            <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/m/friends" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />} />
            <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/followers" component={(props) => <OrganizationVoterGuide {...props} activeRoute="followers" />} />
            <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/m/followers" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
            <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/following" component={(props) => <OrganizationVoterGuide {...props} activeRoute="following" />} />
            <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/m/following" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
            <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/positions/modal/:modal_to_show/:shared_item_code" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
            <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/positions/modal/:modal_to_show" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
            <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/positions" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
            <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/:action_variable" component={OrganizationVoterGuide} />
            <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/:action_variable/m/friends" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />} />
            <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/:action_variable/m/following" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
            <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/:action_variable/m/followers" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
            <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable" component={OrganizationVoterGuide} />
            <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/modal/:modal_to_show/:shared_item_code" component={OrganizationVoterGuide} />
            <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/modal/:modal_to_show" component={OrganizationVoterGuide} />
            <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/m/friends" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />} />
            <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/followers" component={(props) => <OrganizationVoterGuide {...props} activeRoute="followers" />} />
            <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/m/followers" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
            <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/following" component={(props) => <OrganizationVoterGuide {...props} activeRoute="following" />} />
            <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/m/following" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
            <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/positions" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
            <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/positions/modal/:modal_to_show/:shared_item_code" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
            <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/positions/modal/:modal_to_show" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
            <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/:action_variable" component={OrganizationVoterGuide} />
            <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/:action_variable/m/friends" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />} />
            <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/:action_variable/m/followers" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
            <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/:action_variable/m/following" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
            <Route path="/voterguideedit/:organization_we_vote_id" render={(props) => (<RouterV5SendMatch componentName="OrganizationVoterGuideEdit" {...props} />)} />
            <Route path="/voterguideedit/:organization_we_vote_id/:google_civic_election_id" render={(props) => (<RouterV5SendMatch componentName="OrganizationVoterGuideEdit" {...props} />)} />

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
            <Route path="/applesigninprocess" component={AppleSignInProcess} />

            {/* Custom link. "/-/" is controlled by customer and tied to hostname, "/-" is generated by software */}
            <Route path="/-/:custom_link_string" component={SharedItemLanding} />
            <Route path="/-:shared_item_code" component={SharedItemLanding} />

            {/* Temporary scratchpad for component testing */}
            <Route path="/testing/scratchpad" component={isNotWeVoteMarketingSite ? ReadyRedirect : componentLoader('ScratchPad')} />

            <Route path=":twitter_handle/ballot/empty" component={TwitterHandleLanding} />
            <Route path=":twitter_handle/ballot/:ballot_location_shortcut" component={TwitterHandleLanding} />
            <Route path=":twitter_handle/ballot/id/:ballot_returned_we_vote_id" component={TwitterHandleLanding} />
            <Route path=":twitter_handle/ballot/id/:ballot_returned_we_vote_id/:view_mode" component={TwitterHandleLanding} />
            <Route path=":twitter_handle/ballot/election/:google_civic_election_id" component={TwitterHandleLanding} />
            <Route path=":twitter_handle/ballot/election/:google_civic_election_id/:view_mode" component={TwitterHandleLanding} />
            {/* view_mode not taken in yet */}

            {/* Any route that is not found -> @return TwitterHandleLanding component */}
            <Route path=":twitter_handle/followers" component={(props) => <TwitterHandleLanding {...props} activeRoute="followers" />} />
            <Route path=":twitter_handle/following" component={(props) => <TwitterHandleLanding {...props} activeRoute="following" />} />
            <Route path=":twitter_handle/positions" component={(props) => <TwitterHandleLanding {...props} activeRoute="positions" />} />
            <Route path=":twitter_handle/positions/modal/:modal_to_show/:shared_item_code" component={(props) => <TwitterHandleLanding {...props} activeRoute="positions" />} />
            <Route path=":twitter_handle/positions/modal/:modal_to_show" component={(props) => <TwitterHandleLanding {...props} activeRoute="positions" />} />
            <Route path=":twitter_handle/m/friends" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />}  />
            <Route path=":twitter_handle/m/following" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
            <Route path=":twitter_handle/m/followers" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
            <Route path=":twitter_handle/:action_variable" component={TwitterHandleLanding} />
            {/* Next line handles: ":twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable" */}
            <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable($)?" component={TwitterHandleLanding} />
            <Route path=":twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/modal/:modal_to_show/:shared_item_code" component={TwitterHandleLanding} />
            <Route path=":twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/modal/:modal_to_show/:shared_item_code" component={TwitterHandleLanding} />
            <Route path=":twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/modal/:modal_to_show" component={TwitterHandleLanding} />
            <Route path=":twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/m/friends" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />} />
            <Route path=":twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/followers" component={(props) => <TwitterHandleLanding {...props} activeRoute="followers" />} />
            <Route path=":twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/m/followers" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
            <Route path=":twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/following" component={(props) => <TwitterHandleLanding {...props} activeRoute="following" />} />
            <Route path=":twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/m/following" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
            <Route path=":twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/positions" component={(props) => <TwitterHandleLanding {...props} activeRoute="positions" />} />
            <Route path=":twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/positions/modal/:modal_to_show/:shared_item_code" component={(props) => <TwitterHandleLanding {...props} activeRoute="positions" />} />
            <Route path=":twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/positions/modal/:modal_to_show" component={(props) => <TwitterHandleLanding {...props} activeRoute="positions" />} />
            <Route path=":twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/:action_variable" component={TwitterHandleLanding} />
            <Route path=":twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/:action_variable/m/friends" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />} />
            <Route path=":twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/:action_variable/m/followers" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
            <Route path=":twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/:action_variable/m/following" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
            <Route path=":twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable" component={TwitterHandleLanding} />
            <Route path=":twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/modal/:modal_to_show/:shared_item_code" component={TwitterHandleLanding} />
            <Route path=":twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/modal/:modal_to_show" component={TwitterHandleLanding} />
            <Route path=":twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/m/friends" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />} />
            <Route path=":twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/followers" component={(props) => <TwitterHandleLanding {...props} activeRoute="followers" />} />
            <Route path=":twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/m/followers" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
            <Route path=":twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/following" component={(props) => <TwitterHandleLanding {...props} activeRoute="following" />} />
            <Route path=":twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/m/following" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
            <Route path=":twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/positions" component={(props) => <TwitterHandleLanding {...props} activeRoute="positions" />} />
            <Route path=":twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/positions/modal/:modal_to_show/:shared_item_code" component={(props) => <TwitterHandleLanding {...props} activeRoute="positions" />} />
            <Route path=":twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/positions/modal/:modal_to_show" component={(props) => <TwitterHandleLanding {...props} activeRoute="positions" />} />
            <Route path=":twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/:action_variable" component={TwitterHandleLanding} />
            <Route path=":twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/:action_variable/m/friends" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />} />
            <Route path=":twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/:action_variable/m/followers" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
            <Route path=":twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/:action_variable/m/following" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
            <Route path=":twitter_handle($)?" component={TwitterHandleLanding} />
            <Route path=":twitter_handle/modal/:modal_to_show/:shared_item_code" component={TwitterHandleLanding} />
            <Route path=":twitter_handle/modal/:modal_to_show" component={TwitterHandleLanding} />
            <Route path="*" component={PageNotFound} />
          </Switch>
          {/* /> */}
        </Application>
      </Suspense>
    </>
  );
};

export default routes;
