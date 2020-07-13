import React, { Suspense } from 'react';
import { IndexRoute, IndexRedirect, Route } from 'react-router'; // Route,
// import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import cookies from './utils/cookies';
import componentLoader from './utils/componentLoader';
import { isWebApp } from './utils/cordovaUtils';

// Temp until we can find alternative
const OrganizationVoterGuide = React.lazy(() => import('./routes/VoterGuide/OrganizationVoterGuide'));
const OrganizationVoterGuideMobileDetails = React.lazy(() => import('./routes/VoterGuide/OrganizationVoterGuideMobileDetails'));
const TwitterHandleLanding = React.lazy(() => import('./routes/TwitterHandleLanding'));
const WelcomeForVoters = React.lazy(() => import('./routes/WelcomeForVoters'));
const WelcomeForCampaigns = React.lazy(() => import('./routes/WelcomeForCampaigns'));
const WelcomeForOrganizations = React.lazy(() => import('./routes/WelcomeForOrganizations'));

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
    // <Router>
    //   <div>
    //     <Switch>
    //       <Suspense fallback={<div>Loading...</div>}>
    //         <Route path="/getready" component={componentLoader('ReadyNoApi')} />
    //         <Route path="/ready" component={componentLoader('Ready')} />
    //       </Suspense>
    //     </Switch>
    //   </div>
    // </Router>
    <Route path="/">
      {                       // 12/4/18: Not sure why we need the following disabled
        (function redirect () {  // eslint-disable-line wrap-iife
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
        <Route path="/getready" component={componentLoader('ReadyNoApi')} />
      </Suspense>
      <Suspense fallback={<div>Loading...</div>}>
        <Route component={componentLoader('Application')}>
          <Route component={componentLoader('Intro')} />
          <Route path="/welcome" component={isNotWeVoteMarketingSite ? componentLoader('ReadyRedirect') : props => <WelcomeForVoters {...props} pathname="/welcome" />} />
          <Route path="/news" component={componentLoader('News')} />
          <Route path="/ready" component={componentLoader('Ready')} />
          <Route path="/register" component={componentLoader('Register')} />
          <Route path="/ballot" component={componentLoader('BallotIndex')}>
            <IndexRoute component={componentLoader('Ballot')} />
            <Route path="/ballot?voter_refresh_timer_on=:voter_refresh_timer_on" component={componentLoader('Ballot')} />
            <Route path="/office/:office_we_vote_id/b/:back_to_variable/modal/:modal_to_show" component={componentLoader('Office')} />
            <Route path="/office/:office_we_vote_id/b/:back_to_variable/" component={componentLoader('Office')} />
            <Route path="/office/:office_we_vote_id/b/:back_to_variable" component={componentLoader('Office')} />
            <Route path="/office/:office_we_vote_id/modal/:modal_to_show/:shared_item_code" component={componentLoader('Office')} />
            <Route path="/office/:office_we_vote_id/modal/:modal_to_show" component={componentLoader('Office')} />
            <Route path="/office/:office_we_vote_id/:back_to_variable/:organization_we_vote_id" component={componentLoader('OrganizationVoterGuideOffice')} />
            <Route path="/office/:office_we_vote_id/:organization_we_vote_id" component={componentLoader('OrganizationVoterGuideOffice')} />
            <Route path="/office/:office_we_vote_id" component={componentLoader('Office')} />
            <Route path="/candidate/:candidate_we_vote_id/b/:back_to_variable/modal/:modal_to_show/:shared_item_code" component={componentLoader('Candidate')} />
            <Route path="/candidate/:candidate_we_vote_id/b/:back_to_variable/modal/:modal_to_show" component={componentLoader('Candidate')} />
            <Route path="/candidate/:candidate_we_vote_id/b/:back_to_variable/" component={componentLoader('Candidate')} />
            <Route path="/candidate/:candidate_we_vote_id/b/:back_to_variable" component={componentLoader('Candidate')} />
            <Route path="/candidate/:candidate_we_vote_id/modal/:modal_to_show/:shared_item_code" component={componentLoader('Candidate')} />
            <Route path="/candidate/:candidate_we_vote_id/modal/:modal_to_show" component={componentLoader('Candidate')} />
            <Route path="/candidate/:candidate_we_vote_id/:back_to_variable/:organization_we_vote_id" component={componentLoader('OrganizationVoterGuideCandidate')} />
            <Route path="/candidate/:candidate_we_vote_id/:organization_we_vote_id" component={componentLoader('OrganizationVoterGuideCandidate')} />
            <Route path="/candidate/:candidate_we_vote_id" component={componentLoader('Candidate')} />
            <Route path="/measure/:measure_we_vote_id/b/:back_to_variable/modal/:modal_to_show/:shared_item_code" component={componentLoader('Measure')} />
            <Route path="/measure/:measure_we_vote_id/b/:back_to_variable/modal/:modal_to_show" component={componentLoader('Measure')} />
            <Route path="/measure/:measure_we_vote_id/b/:back_to_variable/" component={componentLoader('Measure')} />
            <Route path="/measure/:measure_we_vote_id/b/:back_to_variable" component={componentLoader('Measure')} />
            <Route path="/measure/:measure_we_vote_id/modal/:modal_to_show/:shared_item_code" component={componentLoader('Measure')} />
            <Route path="/measure/:measure_we_vote_id/modal/:modal_to_show" component={componentLoader('Measure')} />
            <Route path="/measure/:measure_we_vote_id/:back_to_variable/:organization_we_vote_id" component={componentLoader('OrganizationVoterGuideMeasure')} />
            <Route path="/measure/:measure_we_vote_id" component={componentLoader('Measure')} />
          </Route>
          <Route path="/ballot/vote" component={componentLoader('Vote')} />
          <Route path="/ballot/modal/:modal_to_show/:shared_item_code" component={componentLoader('Ballot')} />
          <Route path="/ballot/modal/:modal_to_show" component={componentLoader('Ballot')} />
          <Route path="/ballot/:ballot_location_shortcut/modal/:modal_to_show/:shared_item_code" component={componentLoader('Ballot')} />
          <Route path="/ballot/:ballot_location_shortcut/modal/:modal_to_show" component={componentLoader('Ballot')} />
          <Route path="/ballot/:ballot_location_shortcut" component={componentLoader('Ballot')} />
          <Route path="/ballot/id/:ballot_returned_we_vote_id/modal/:modal_to_show/:shared_item_code" component={componentLoader('Ballot')} />
          <Route path="/ballot/id/:ballot_returned_we_vote_id/modal/:modal_to_show" component={componentLoader('Ballot')} />
          <Route path="/ballot/id/:ballot_returned_we_vote_id" component={componentLoader('Ballot')} />
          <Route path="/ballot/election/:google_civic_election_id/modal/:modal_to_show/:shared_item_code" component={componentLoader('Ballot')} />
          <Route path="/ballot/election/:google_civic_election_id/modal/:modal_to_show" component={componentLoader('Ballot')} />
          <Route path="/ballot/election/:google_civic_election_id" component={componentLoader('Ballot')} />

          <Route path="/candidate-for-extension" component={componentLoader('CandidateForExtension')} />
          <Route path="/add-candidate-for-extension" component={componentLoader('AddCandidateForExtension')} />
          <Route path="/for-campaigns" component={isNotWeVoteMarketingSite ? componentLoader('ReadyRedirect') : props => <WelcomeForCampaigns {...props} pathname="/for-campaigns" />} />
          <Route path="/for-organizations" component={isNotWeVoteMarketingSite ? componentLoader('ReadyRedirect') : props => <WelcomeForOrganizations {...props} pathname="/for-organizations" />} />
          <Route path="/how" component={isNotWeVoteMarketingSite ? componentLoader('ReadyRedirect') : componentLoader('HowItWorks')} />
          <Route path="/how/:category_string" component={isNotWeVoteMarketingSite ? componentLoader('ReadyRedirect') : componentLoader('HowItWorks')} />
          <Route path="/intro" component={componentLoader('Intro')} />
          <Route path="/wevoteintro/network" component={componentLoader('IntroNetwork')} />
          <Route path="/intro/sample_ballot" component={componentLoader('SampleBallot')} />
          <Route path="/intro/get_started" component={componentLoader('GetStarted')} />

          {/* Your Settings go in this structure... */}
          {/* Complete path on one line for searching */}
          <Route path="/settings" component={componentLoader('SettingsDashboard')} />
          <Route path="/settings/claim" component={componentLoader('ClaimYourPage')} />
          <Route path="/settings/hamburger" component={componentLoader('HamburgerMenu')} />
          <Route path="/settings/location" component={componentLoader('Location')} />
          <Route path="/settings/menu" component={componentLoader('SettingsMenuMobile')} />
          <Route path="/settings/voterguidelist" component={componentLoader('VoterGuideListDashboard')} />
          <Route path="/settings/voterguidesmenu" component={componentLoader('VoterGuidesMenuMobile')} />
          {/* settings/:edit_mode includes "/settings/account", "/settings/address", "/settings/domain", "/settings/election",
          "/settings/issues_linked", "/settings/issues_to_link", "/settings/issues", "/settings/notifications",
          "/settings/profile", "/settings/text", "/settings/tools" */}
          <Route path="/settings/:edit_mode" component={componentLoader('SettingsDashboard')} />
          <Route path="/settings/issues/:edit_mode" component={componentLoader('SettingsDashboard')} />
          <Route path="/settings/:edit_mode/:voter_guide_we_vote_id" component={componentLoader('SettingsDashboard')} />

          {/* Ballot Off-shoot Pages */}
          <Route path="/opinions" component={componentLoader('Opinions')} />
          <Route path="/opinions/f/:selectedFilter" component={componentLoader('Opinions')} />
          <Route path="/opinions/s/:searchTextDefault" component={componentLoader('Opinions')} />
          <Route path="/opinions_followed" component={componentLoader('OpinionsFollowed')} />
          <Route path="/opinions_ignored" component={componentLoader('OpinionsIgnored')} />

          {/* Friend related Pages */}
          <Route path="/friends" component={componentLoader('Friends')} />
          <Route path="/friends/:tabItem" component={componentLoader('Friends')} />
          <Route path="/facebook_invitable_friends" component={componentLoader('FacebookInvitableFriends')} />
          <Route path="/wevoteintro/newfriend/:invitationSecretKey" component={componentLoader('FriendInvitationOnboarding')} />

          {/* More Menu Pages */}
          <Route path="/more/about" component={isNotWeVoteMarketingSite ? componentLoader('ReadyRedirect') : componentLoader('About')} />
          <Route path="/more/absentee" component={componentLoader('AbsenteeBallot')} />
          <Route path="/more/alerts" component={componentLoader('ElectionReminder')} />
          <Route path="/more/attributions" component={componentLoader('Attributions')} />
          <Route path="/more/connect" component={componentLoader('Connect')} />
          <Route path="/more/credits" component={componentLoader('Credits')} />
          <Route path="/more/donate" component={isNotWeVoteMarketingSite ? componentLoader('ReadyRedirect') : componentLoader('Donate')} />
          <Route path="/more/donate_thank_you" component={isNotWeVoteMarketingSite ? componentLoader('ReadyRedirect') : componentLoader('DonateThankYou')} />
          <Route path="/more/extensionsignin" component={componentLoader('ExtensionSignIn')} />
          <Route path="/more/stripe_elements_test" component={componentLoader('StripeElementsTest')} />
          <Route path="/more/elections" component={componentLoader('Elections')} />
          <Route path="/more/facebooklandingprocess" component={componentLoader('FacebookLandingProcess')} />
          <Route path="/more/facebookredirecttowevote" component={componentLoader('FacebookRedirectToWeVote')} />
          <Route path="/more/faq" component={componentLoader('FAQ')} />
          <Route path="/more/jump" component={componentLoader('SignInJumpProcess')} />
          <Route path="/more/myballot" component={componentLoader('WeVoteBallotEmbed')} />
          <Route path="/more/network" component={componentLoader('Friends')} />
          <Route path="/more/network/key/:invitation_secret_key" component={componentLoader('FriendInvitationByEmailVerifyProcess')} />
          <Route path="/more/network/key/:invitation_secret_key/ignore" component={componentLoader('FriendInvitationByEmailVerifyProcess')} />
          {/* Redirecting old URLs to new components */}
          <Route path="/more/network/friends" component={componentLoader('Friends')} />
          <Route path="/more/network/organizations" component={componentLoader('Values')} />
          <Route path="/more/pricing" component={isNotWeVoteMarketingSite ? componentLoader('ReadyRedirect') : componentLoader('Pricing')} />
          <Route path="/more/pricing/:pricing_choice" component={isNotWeVoteMarketingSite ? componentLoader('ReadyRedirect') : componentLoader('Pricing')} />
          <Route path="/more/privacy" component={componentLoader('Privacy')} />
          <Route path="/more/processing_donation" component={componentLoader('ProcessingDonation')} />
          <Route path="/more/register" component={componentLoader('RegisterToVote')} />
          <Route path="/more/search_page" component={componentLoader('SearchPage')} />
          <Route path="/more/search_page/:encoded_search_string" component={componentLoader('SearchPage')} />
          <Route path="/more/terms" component={componentLoader('TermsOfService')} />
          <Route path="/more/verify" component={componentLoader('VerifyRegistration')} />
          <Route path="/values" component={componentLoader('Values')} />
          <Route path="/values/list" component={componentLoader('ValuesList')} />
          <Route path="/value/:value_slug" component={componentLoader('VoterGuidesUnderOneValue')} />

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
          <Route path="/voterguideedit/:organization_we_vote_id" component={componentLoader('OrganizationVoterGuideEdit')} />
          <Route path="/voterguideedit/:organization_we_vote_id/:google_civic_election_id" component={componentLoader('OrganizationVoterGuideEdit')} />

          {/* Voter Guide Settings go in this structure... "/vg/wvYYvgYY/settings/positions", "/vg/wvYYvgYY/settings/addpositions" */}
          <Route path="/vg/:voter_guide_we_vote_id/settings" component={componentLoader('VoterGuideSettingsDashboard')} />
          <Route path="/vg/:voter_guide_we_vote_id/settings/menu" component={componentLoader('VoterGuideSettingsMenuMobile')} />
          <Route path="/vg/:voter_guide_we_vote_id/settings/positions" component={componentLoader('VoterGuideSettingsDashboard')} />

          <Route path="/yourpage" component={componentLoader('YourPage')} />

          <Route path="/twitter_sign_in" component={componentLoader('TwitterSignInProcess')} />

          <Route path="/verify_email/:email_secret_key" component={componentLoader('VerifyEmailProcess')} />
          <Route path="/sign_in_email/:email_secret_key" component={componentLoader('SignInEmailProcess')} />

          {/* Confirming that person owns twitter handle */}
          <Route path="/verifythisisme/:twitter_handle" component={componentLoader('VerifyThisIsMe')} />
          <Route path="/twittersigninprocess/:sign_in_step" component={componentLoader('TwitterSignInProcess')} />

          {/* Custom link. "/-/" is controlled by customer and tied to hostname, "/-" is generated by software */}
          <Route path="/-/:custom_link_string" component={componentLoader('SharedItemLanding')} />
          <Route path="/-:shared_item_code" component={componentLoader('SharedItemLanding')} />

          {/* Temporary scratchpad for component testing */}
          <Route path="/testing/scratchpad" component={isNotWeVoteMarketingSite ? componentLoader('ReadyRedirect') : componentLoader('ScratchPad')} />

          <Route path=":twitter_handle/ballot/empty" component={componentLoader('TwitterHandleLanding')} />
          <Route path=":twitter_handle/ballot/:ballot_location_shortcut" component={componentLoader('TwitterHandleLanding')} />
          <Route path=":twitter_handle/ballot/id/:ballot_returned_we_vote_id" component={componentLoader('TwitterHandleLanding')} />
          <Route path=":twitter_handle/ballot/id/:ballot_returned_we_vote_id/:view_mode" component={componentLoader('TwitterHandleLanding')} />
          <Route path=":twitter_handle/ballot/election/:google_civic_election_id" component={componentLoader('TwitterHandleLanding')} />
          <Route path=":twitter_handle/ballot/election/:google_civic_election_id/:view_mode" component={componentLoader('TwitterHandleLanding')} />
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
          <Route path=":twitter_handle" component={componentLoader('TwitterHandleLanding')} />
          <Route path="*" component={componentLoader('PageNotFound')} />
        </Route>
      </Suspense>
    </Route>
  );
};

export default routes;
