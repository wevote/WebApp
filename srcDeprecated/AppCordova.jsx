import { MuiThemeProvider, StylesProvider } from '@material-ui/core/styles';
import React, { Component, Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import LoadingWheelComp from './js/components/LoadingWheelComp';
import Header from './js/components/Navigation/Header';
import HeaderBarSuspense from './js/components/Navigation/HeaderBarSuspense';
import ErrorBoundary from './js/components/Widgets/ErrorBoundary';
import WeVoteRouter from './js/components/Widgets/WeVoteRouter';
import muiTheme from './js/mui-theme';
import AppObservableStore from './js/stores/AppObservableStore';
import styledTheme from './js/styled-theme';
import { getApplicationViewBooleans } from './js/utils/applicationUtils';
import { isWebApp } from './js/utils/cordovaUtils';
import initializejQuery from './js/utils/initializejQuery';
import { renderLog } from './js/utils/logging';
import RouterV5SendMatch from './js/utils/RouterV5SendMatch';

// Root URL pages

import About from './js/routes/More/About';
import AbsenteeBallot from './js/routes/More/AbsenteeBallot';
import AddCandidateForExtension from './js/routes/Ballot/AddCandidateForExtension';
import AppleSignInProcess from './js/routes/Process/AppleSignInProcess';
import Attributions from './js/routes/More/Attributions';
import Ballot from './js/routes/Ballot/Ballot';
import Candidate from './js/routes/Ballot/Candidate';
import CandidateForExtension from './js/routes/Ballot/CandidateForExtension';
import ClaimYourPage from './js/routes/Settings/ClaimYourPage';
import Credits from './js/routes/More/Credits';
import Donate from './js/routes/More/Donate';
import ElectionReminder from './js/routes/More/ElectionReminder';
import Elections from './js/routes/More/Elections';
import ExtensionSignIn from './js/routes/More/ExtensionSignIn';
import FAQ from './js/routes/More/FAQ';
import FacebookInvitableFriends from './js/routes/FacebookInvitableFriends';
import FacebookLandingProcess from './js/routes/Process/FacebookLandingProcess';
import FacebookRedirectToWeVote from './js/routes/More/FacebookRedirectToWeVote';
import FooterBar from './js/components/Navigation/FooterBar';
import FriendInvitationByEmailVerifyProcess from './js/routes/Process/FriendInvitationByEmailVerifyProcess';
import FriendInvitationOnboarding from './js/routes/Intro/FriendInvitationOnboarding';
import Friends from './js/routes/Friends/Friends';
import GetStarted from './js/routes/Intro/GetStarted';
import HamburgerMenu from './js/routes/Settings/HamburgerMenu';
import HowItWorks from './js/routes/HowItWorks';
import Intro from './js/routes/Intro/Intro';
import IntroNetwork from './js/routes/Intro/IntroNetwork';
import Location from './js/routes/Settings/Location';
import Measure from './js/routes/Ballot/Measure';
import News from './js/routes/Activity/News';
import Office from './js/routes/Ballot/Office';
import Opinions2020 from './js/routes/Opinions2020';
import OpinionsFollowed from './js/routes/OpinionsFollowed';
import OpinionsIgnored from './js/routes/OpinionsIgnored';
import OrganizationVoterGuide from './js/routes/VoterGuide/OrganizationVoterGuide';
import OrganizationVoterGuideCandidate from './js/routes/VoterGuide/OrganizationVoterGuideCandidate';
import OrganizationVoterGuideMeasure from './js/routes/VoterGuide/OrganizationVoterGuideMeasure';
import OrganizationVoterGuideMobileDetails from './js/routes/VoterGuide/OrganizationVoterGuideMobileDetails';
import OrganizationVoterGuideOffice from './js/routes/VoterGuide/OrganizationVoterGuideOffice';
import PageNotFound from './js/routes/PageNotFound';
import Pricing from './js/routes/More/Pricing';
import Privacy from './js/routes/More/Privacy';
import ProcessingDonation from './js/routes/More/ProcessingDonation';
import Ready from './js/routes/Ready';
import ReadyLight from './js/routes/ReadyLight';
import ReadyRedirect from './js/routes/ReadyRedirect';
import Register from './js/routes/Register';
import RegisterToVote from './js/routes/More/RegisterToVote';
import SampleBallot from './js/routes/Intro/SampleBallot';
import SearchPage from './js/routes/More/SearchPage';
import SettingsDashboard from './js/routes/Settings/SettingsDashboard';
import SettingsMenuMobile from './js/routes/Settings/SettingsMenuMobile';
import SharedItemLanding from './js/routes/SharedItemLanding';
import SignInEmailProcess from './js/routes/Process/SignInEmailProcess';
import SignInJumpProcess from './js/routes/Process/SignInJumpProcess';
import TermsOfService from './js/routes/More/TermsOfService';
import TwitterHandleLanding from './js/routes/TwitterHandleLanding';
import TwitterSignInProcess from './js/routes/Process/TwitterSignInProcess';
import Values from './js/routes/Values';
import ValuesList from './js/routes/Values/ValuesList';
import VerifyEmailProcess from './js/routes/Process/VerifyEmailProcess';
import VerifyRegistration from './js/routes/More/VerifyRegistration';
import VerifyThisIsMe from './js/routes/VoterGuide/VerifyThisIsMe';
import Vote from './js/routes/Vote';
import VoterGuideListDashboard from './js/routes/Settings/VoterGuideListDashboard';
import VoterGuideSettingsDashboard from './js/routes/Settings/VoterGuideSettingsDashboard';
import VoterGuideSettingsMenuMobile from './js/routes/Settings/VoterGuideSettingsMenuMobile';
import VoterGuidesMenuMobile from './js/routes/Settings/VoterGuidesMenuMobile';
import VoterGuidesUnderOneValue from './js/routes/Values/VoterGuidesUnderOneValue';
import WeVoteBallotEmbed from './js/routes/More/WeVoteBallotEmbed';
import WelcomeForCampaigns from './js/routes/WelcomeForCampaigns';
import WelcomeForOrganizations from './js/routes/WelcomeForOrganizations';
import WelcomeForVoters from './js/routes/WelcomeForVoters';
import YourPage from './js/routes/YourPage';

// There are just too many "prop spreadings" in the use of Route, if someone can figure out an alternative...
/* eslint-disable react/jsx-props-no-spreading */

class AppCordova extends Component {
  constructor (props) {
    super(props);
    this.state = {
      // doShowHeader: true,
      // doShowFooter: true,
      showReadyLight: true,
    };
    // this.setShowHeader = this.setShowHeader.bind(this);
    // this.setShowFooter = this.setShowFooter.bind(this);
    // this.setShowHeaderFooter = this.setShowHeaderFooter.bind(this);
    this.setShowReadyHeavy = this.setShowReadyHeavy.bind(this);
    this.localIsCordova();
  }

  // See https://reactjs.org/docs/error-boundaries.html
  static getDerivedStateFromError (error) { // eslint-disable-line no-unused-vars
    // Update state so the next render will show the fallback UI, We should have a "Oh snap" page
    console.log('App caught error ', error);
    return { hasError: true };
  }

  componentDidMount () {
    initializejQuery(() => {
      let { hostname } = window.location;
      hostname = hostname || '';
      AppObservableStore.siteConfigurationRetrieve(hostname);
    });
    console.log('href in App.js componentDidMount: ', window.location.href);
  }

  componentDidCatch (error, info) {
    // We should get this information to Splunk!
    console.error('App caught error: ', `${error} with info: `, info);
  }

  // setShowHeader (doShowHeader) {
  //   console.log('-----------HEADER setShowHeader');
  //   this.setState({ doShowHeader });
  // }

  // setShowFooter (doShowFooter) {
  //   console.log('-----------HEADER setShowFooter');
  //   this.setState({ doShowFooter });
  // }

  // setShowHeaderFooter (doShow) {
  //   console.log('-----------HEADER setShowHeaderFooter', doShow);
  //   // console.log('setShowHeaderFooter -------------- doShow:', doShow);
  //   this.setState({
  //     doShowHeader: doShow,
  //     doShowFooter: doShow,
  //   });
  // }

  setShowReadyHeavy () {
    this.setState({ showReadyLight: false });
  }

  // From index.js (4/20/21)
  localIsCordova () {
    const { cordova } = window;
    window.isCordovaGlobal = cordova !== undefined;    // So now we set a global
    return cordova !== undefined;
  }

  render () {
    renderLog('App');
    const { /* doShowHeader, doShowFooter, */ showReadyLight } = this.state;
    // console.log(`App doShowHeader: ${doShowHeader}, doShowFooter:${doShowFooter}`);
    let { hostname } = window.location;
    hostname = hostname || '';
    const weVoteSites = ['wevote.us', 'quality.wevote.us', 'localhost', 'silicon', ''];   // localhost on Cordova is a ''
    const isWeVoteMarketingSite = weVoteSites.includes(String(hostname));
    const isNotWeVoteMarketingSite = !isWeVoteMarketingSite;
    const siteVars = getApplicationViewBooleans(hostname);
    const { showFooterBar } = siteVars;
    // const firstVisit = !cookies.getItem('voter_device_id');

    console.log('href in App.js render: ', window.location.href);

    /*
    Note: To debug routing, set a breakpoint in the class that routing takes you to -- then look at the received props.
    The props.match.path shows exactly which route string from this file, was selected by the <Switch>
    */

    return (
      <ErrorBoundary>
        <MuiThemeProvider theme={muiTheme}>
          <ThemeProvider theme={styledTheme}>
            <StylesProvider injectFirst>
              <WeVoteRouter>
                <WeVoteBody>
                  {/* DO NOT put SnackNotifier or anything else that is non-essential here (to keep it out of the main chuck. */}
                  <Suspense fallback={<HeaderBarSuspense />}>
                    <Header params={{ }} pathname={window.location.href} />
                  </Suspense>
                  <Suspense fallback={<LoadingWheelComp />}>
                    <Switch>
                      <Route exact path="/about"><About /></Route>
                      <Route exact path="/ballot" component={Ballot} />
                      <Route exact path="/friends" component={Friends} />
                      <Route exact path="/friends/:tabItem" component={Friends} />
                      <Route exact path="/">
                        {() => {
                          if (showReadyLight) {
                            return <ReadyLight showReadyHeavy={this.setShowReadyHeavy} />;
                          } else {
                            return <Redirect to="/ready" />;
                          }
                        }}
                      </Route>
                      <Route exact path="/ready"><Ready /></Route>
                      {/* <Route exact path="/ready"><Redirect to="/" /></Route> */}
                      <Route exact path="/settings" component={SettingsDashboard} />
                      <Route exact path="/settings/claim" component={ClaimYourPage} />
                      <Route exact path="/settings/hamburger" component={HamburgerMenu} />
                      <Route exact path="/settings/location" component={Location} />
                      <Route exact path="/settings/menu" component={SettingsMenuMobile} />
                      <Route exact path="/settings/voterguidelist" component={VoterGuideListDashboard} />
                      <Route exact path="/settings/voterguidesmenu" component={VoterGuidesMenuMobile} />
                      <Route exact path="/twitter_sign_in"><TwitterSignInProcess /></Route>
                      <Route path="/-/:custom_link_string" component={SharedItemLanding} />
                      <Route path="/-:shared_item_code" component={SharedItemLanding} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable($)?" component={TwitterHandleLanding} />
                      <Route path="/add-candidate-for-extension" component={AddCandidateForExtension} />
                      <Route path="/applesigninprocess" component={AppleSignInProcess} />
                      <Route path="/ballot/:ballot_location_shortcut" component={Ballot} />
                      <Route path="/ballot/:ballot_location_shortcut/modal/:modal_to_show" component={Ballot} />
                      <Route path="/ballot/:ballot_location_shortcut/modal/:modal_to_show/:shared_item_code" component={Ballot} />
                      <Route path="/ballot/election/:google_civic_election_id" component={Ballot} />
                      <Route path="/ballot/election/:google_civic_election_id/modal/:modal_to_show" component={Ballot} />
                      <Route path="/ballot/election/:google_civic_election_id/modal/:modal_to_show/:shared_item_code" component={Ballot} />
                      <Route path="/ballot/id/:ballot_returned_we_vote_id" component={Ballot} />
                      <Route path="/ballot/id/:ballot_returned_we_vote_id/modal/:modal_to_show" component={Ballot} />
                      <Route path="/ballot/id/:ballot_returned_we_vote_id/modal/:modal_to_show/:shared_item_code" component={Ballot} />
                      <Route path="/ballot/modal/:modal_to_show" component={Ballot} />
                      <Route path="/ballot/modal/:modal_to_show/:shared_item_code" component={Ballot} />
                      <Route path="/ballot/vote" component={Vote} />
                      <Route path="/ballot?voter_refresh_timer_on=:voter_refresh_timer_on" component={Ballot} />
                      <Route path="/candidate-for-extension" component={CandidateForExtension} />
                      <Route path="/candidate/:candidate_we_vote_id" component={Candidate} />
                      <Route path="/candidate/:candidate_we_vote_id/:back_to_variable/:organization_we_vote_id" component={OrganizationVoterGuideCandidate} />
                      <Route path="/candidate/:candidate_we_vote_id/:organization_we_vote_id" component={OrganizationVoterGuideCandidate} />
                      <Route path="/candidate/:candidate_we_vote_id/b/:back_to_variable" component={Candidate} />
                      <Route path="/candidate/:candidate_we_vote_id/b/:back_to_variable/" component={Candidate} />
                      <Route path="/candidate/:candidate_we_vote_id/b/:back_to_variable/modal/:modal_to_show" component={Candidate} />
                      <Route path="/candidate/:candidate_we_vote_id/b/:back_to_variable/modal/:modal_to_show/:shared_item_code" component={Candidate} />
                      <Route path="/candidate/:candidate_we_vote_id/modal/:modal_to_show" component={Candidate} />
                      <Route path="/candidate/:candidate_we_vote_id/modal/:modal_to_show/:shared_item_code" component={Candidate} />
                      <Route path="/facebook_invitable_friends" component={FacebookInvitableFriends} />
                      <Route path="/for-campaigns" component={isNotWeVoteMarketingSite ? ReadyRedirect : (props) => <WelcomeForCampaigns {...props} pathname="/for-campaigns" />} />
                      <Route path="/for-organizations" component={isNotWeVoteMarketingSite ? ReadyRedirect : (props) => <WelcomeForOrganizations {...props} pathname="/for-organizations" />} />
                      <Route path="/how" component={isNotWeVoteMarketingSite ? ReadyRedirect : HowItWorks} />
                      <Route path="/how/:category_string" component={isNotWeVoteMarketingSite ? ReadyRedirect : HowItWorks} />
                      <Route path="/intro" component={Intro} />
                      <Route path="/intro/get_started" component={GetStarted} />
                      <Route path="/intro/sample_ballot" component={SampleBallot} />
                      <Route path="/measure/:measure_we_vote_id" component={Measure} />
                      <Route path="/measure/:measure_we_vote_id/:back_to_variable/:organization_we_vote_id" component={OrganizationVoterGuideMeasure} />
                      <Route path="/measure/:measure_we_vote_id/b/:back_to_variable" component={Measure} />
                      <Route path="/measure/:measure_we_vote_id/b/:back_to_variable/" component={Measure} />
                      <Route path="/measure/:measure_we_vote_id/b/:back_to_variable/modal/:modal_to_show" component={Measure} />
                      <Route path="/measure/:measure_we_vote_id/b/:back_to_variable/modal/:modal_to_show/:shared_item_code" component={Measure} />
                      <Route path="/measure/:measure_we_vote_id/modal/:modal_to_show" component={Measure} />
                      <Route path="/measure/:measure_we_vote_id/modal/:modal_to_show/:shared_item_code" component={Measure} />
                      <Route path="/more/absentee" component={AbsenteeBallot} />
                      <Route path="/more/alerts" component={ElectionReminder} />
                      <Route path="/more/alerts" component={ElectionReminder} />
                      <Route path="/more/attributions" component={Attributions} />
                      <Route path="/more/attributions" component={Attributions} />
                      <Route path="/more/credits" component={Credits} />
                      <Route path="/more/credits" component={Credits} />
                      <Route path="/more/donate" component={isNotWeVoteMarketingSite ? ReadyRedirect : Donate} />
                      <Route path="/more/donate" component={isNotWeVoteMarketingSite ? ReadyRedirect : Donate} />
                      <Route path="/more/elections" component={Elections} />
                      <Route path="/more/elections" component={Elections} />
                      <Route path="/more/extensionsignin" component={ExtensionSignIn} />
                      <Route path="/more/extensionsignin" component={ExtensionSignIn} />
                      <Route path="/more/facebooklandingprocess" component={FacebookLandingProcess} />
                      <Route path="/more/facebookredirecttowevote" component={FacebookRedirectToWeVote} />
                      <Route path="/more/faq" component={FAQ} />
                      <Route path="/more/jump" component={SignInJumpProcess} />
                      <Route path="/more/myballot" component={WeVoteBallotEmbed} />
                      <Route path="/more/network" component={Friends} />
                      <Route path="/more/network/friends" component={Friends} />
                      <Route path="/more/network/key/:invitation_secret_key" component={FriendInvitationByEmailVerifyProcess} />
                      <Route path="/more/network/key/:invitation_secret_key/ignore" component={FriendInvitationByEmailVerifyProcess} />
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
                      <Route path="/news" component={News} />
                      <Route path="/news/a/" component={News} />
                      <Route path="/news/a/:activity_tidbit_we_vote_id" component={News} />
                      <Route path="/office/:office_we_vote_id" component={Office} />
                      <Route path="/office/:office_we_vote_id/:back_to_variable/:organization_we_vote_id" component={OrganizationVoterGuideOffice} />
                      <Route path="/office/:office_we_vote_id/:organization_we_vote_id" component={OrganizationVoterGuideOffice} />
                      <Route path="/office/:office_we_vote_id/b/:back_to_variable" component={Office} />
                      <Route path="/office/:office_we_vote_id/b/:back_to_variable/" component={Office} />
                      <Route path="/office/:office_we_vote_id/b/:back_to_variable/modal/:modal_to_show" component={Office} />
                      <Route path="/office/:office_we_vote_id/modal/:modal_to_show" component={Office} />
                      <Route path="/office/:office_we_vote_id/modal/:modal_to_show/:shared_item_code" component={Office} />
                      <Route path="/opinions" component={Opinions2020} />
                      <Route path="/opinions/f/:selectedFilter" component={Opinions2020} />
                      <Route path="/opinions/s/:searchTextDefault" component={Opinions2020} />
                      <Route path="/opinions_followed" component={OpinionsFollowed} />
                      <Route path="/opinions_ignored" component={OpinionsIgnored} />
                      {/* <Route exact path="/ready"><Redirect to="/" /></Route> */}
                      <Route exact path="/ready"><Ready /></Route>
                      <Route path="/ready/election/:google_civic_election_id" component={Ready} />
                      <Route path="/ready/modal/:modal_to_show" render={(props) => (<RouterV5SendMatch componentName="Ready" {...props} />)} />
                      <Route path="/ready/modal/:modal_to_show/:shared_item_code" render={(props) => (<RouterV5SendMatch componentName="Ready" {...props} />)} />
                      <Route path="/register" component={Register} />
                      <Route path="/settings/:edit_mode" render={(props) => (<RouterV5SendMatch componentName="SettingsDashboard" {...props} />)} />
                      <Route path="/settings/:edit_mode/:voter_guide_we_vote_id" render={(props) => (<RouterV5SendMatch componentName="SettingsDashboard" {...props} />)} />
                      <Route path="/settings/issues/:edit_mode" render={(props) => (<RouterV5SendMatch componentName="SettingsDashboard" {...props} />)} />
                      <Route path="/sign_in_email/:email_secret_key" component={SignInEmailProcess} />
                      <Route path="/twittersigninprocess/:sign_in_step" component={TwitterSignInProcess} />
                      <Route path="/value/:value_slug" component={VoterGuidesUnderOneValue} />
                      <Route path="/values" component={Values} />
                      <Route path="/values/list" component={ValuesList} />
                      <Route path="/verify_email/:email_secret_key" component={VerifyEmailProcess} />
                      <Route path="/verifythisisme/:twitter_handle" component={VerifyThisIsMe} />
                      <Route path="/vg/:voter_guide_we_vote_id/settings" component={VoterGuideSettingsDashboard} />
                      <Route path="/vg/:voter_guide_we_vote_id/settings/menu" component={VoterGuideSettingsMenuMobile} />
                      <Route path="/vg/:voter_guide_we_vote_id/settings/positions" component={VoterGuideSettingsDashboard} />
                      <Route path="/voterguide/:organization_we_vote_id" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/:action_variable" component={OrganizationVoterGuide} />
                      <Route path="/voterguide/:organization_we_vote_id/ballot" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/ballot/:ballot_location_shortcut" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/ballot/election/:google_civic_election_id" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/ballot/election/:google_civic_election_id/ballot" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/ballot/election/:google_civic_election_id/followers" component={(props) => <OrganizationVoterGuide {...props} activeRoute="followers" />} />
                      <Route path="/voterguide/:organization_we_vote_id/ballot/election/:google_civic_election_id/following" component={(props) => <OrganizationVoterGuide {...props} activeRoute="following" />} />
                      <Route path="/voterguide/:organization_we_vote_id/ballot/election/:google_civic_election_id/m/followers" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
                      <Route path="/voterguide/:organization_we_vote_id/ballot/election/:google_civic_election_id/m/following" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
                      <Route path="/voterguide/:organization_we_vote_id/ballot/election/:google_civic_election_id/m/friends" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />} />
                      <Route path="/voterguide/:organization_we_vote_id/ballot/election/:google_civic_election_id/positions" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/ballot/election/:google_civic_election_id/positions/modal/:modal_to_show" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/ballot/election/:google_civic_election_id/positions/modal/:modal_to_show/:shared_item_code" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/ballot/empty" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/ballot/id/:ballot_returned_we_vote_id" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable" component={OrganizationVoterGuide} />
                      <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/:action_variable" component={OrganizationVoterGuide} />
                      <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/:action_variable/m/followers" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/:action_variable/m/following" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/:action_variable/m/friends" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/followers" component={(props) => <OrganizationVoterGuide {...props} activeRoute="followers" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/following" component={(props) => <OrganizationVoterGuide {...props} activeRoute="following" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/m/followers" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/m/following" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/m/friends" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/modal/:modal_to_show" component={OrganizationVoterGuide} />
                      <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/modal/:modal_to_show/:shared_item_code" component={OrganizationVoterGuide} />
                      <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/positions" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/positions/modal/:modal_to_show" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/positions/modal/:modal_to_show/:shared_item_code" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable" component={OrganizationVoterGuide} />
                      <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/:action_variable" component={OrganizationVoterGuide} />
                      <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/:action_variable/m/followers" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/:action_variable/m/following" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/:action_variable/m/friends" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/followers" component={(props) => <OrganizationVoterGuide {...props} activeRoute="followers" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/following" component={(props) => <OrganizationVoterGuide {...props} activeRoute="following" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/m/followers" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/m/following" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/m/friends" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/modal/:modal_to_show" component={OrganizationVoterGuide} />
                      <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/modal/:modal_to_show/:shared_item_code" component={OrganizationVoterGuide} />
                      <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/positions" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/positions/modal/:modal_to_show" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/positions/modal/:modal_to_show/:shared_item_code" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/followers" component={(props) => <OrganizationVoterGuide {...props} activeRoute="followers" />} />
                      <Route path="/voterguide/:organization_we_vote_id/following" component={(props) => <OrganizationVoterGuide {...props} activeRoute="following" />} />
                      <Route path="/voterguide/:organization_we_vote_id/m/followers" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
                      <Route path="/voterguide/:organization_we_vote_id/m/following" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
                      <Route path="/voterguide/:organization_we_vote_id/m/friends" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />} />
                      <Route path="/voterguide/:organization_we_vote_id/modal/:modal_to_show" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/modal/:modal_to_show/:shared_item_code" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/positions" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/positions/modal/:modal_to_show" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/positions/modal/:modal_to_show/:shared_item_code" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguideedit/:organization_we_vote_id" render={(props) => (<RouterV5SendMatch componentName="OrganizationVoterGuideEdit" {...props} />)} />
                      <Route path="/voterguideedit/:organization_we_vote_id/:google_civic_election_id" render={(props) => (<RouterV5SendMatch componentName="OrganizationVoterGuideEdit" {...props} />)} />
                      <Route path="/welcome" component={isNotWeVoteMarketingSite ? ReadyRedirect : (props) => <WelcomeForVoters {...props} pathname="/welcome" />} />
                      <Route path="/wevoteintro/network" component={IntroNetwork} />
                      <Route path="/wevoteintro/newfriend/:invitationSecretKey" component={FriendInvitationOnboarding} />
                      <Route path="/yourpage" component={YourPage} />
                      <Route path="/:twitter_handle/:action_variable" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/ballot/:ballot_location_shortcut" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/ballot/election/:google_civic_election_id" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/ballot/election/:google_civic_election_id/:view_mode" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/ballot/empty" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/ballot/id/:ballot_returned_we_vote_id" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/ballot/id/:ballot_returned_we_vote_id/:view_mode" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/:action_variable" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/:action_variable/m/followers" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/:action_variable/m/following" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/:action_variable/m/friends" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/followers" component={(props) => <TwitterHandleLanding {...props} activeRoute="followers" />} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/following" component={(props) => <TwitterHandleLanding {...props} activeRoute="following" />} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/m/followers" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/m/following" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/m/friends" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/modal/:modal_to_show" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/modal/:modal_to_show/:shared_item_code" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/modal/:modal_to_show/:shared_item_code" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/positions" component={(props) => <TwitterHandleLanding {...props} activeRoute="positions" />} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/positions/modal/:modal_to_show" component={(props) => <TwitterHandleLanding {...props} activeRoute="positions" />} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/positions/modal/:modal_to_show/:shared_item_code" component={(props) => <TwitterHandleLanding {...props} activeRoute="positions" />} />
                      <Route path="/:twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/:action_variable" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/:action_variable/m/followers" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
                      <Route path="/:twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/:action_variable/m/following" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
                      <Route path="/:twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/:action_variable/m/friends" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />} />
                      <Route path="/:twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/followers" component={(props) => <TwitterHandleLanding {...props} activeRoute="followers" />} />
                      <Route path="/:twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/following" component={(props) => <TwitterHandleLanding {...props} activeRoute="following" />} />
                      <Route path="/:twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/m/followers" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
                      <Route path="/:twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/m/following" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
                      <Route path="/:twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/m/friends" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />} />
                      <Route path="/:twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/modal/:modal_to_show" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/modal/:modal_to_show/:shared_item_code" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/positions" component={(props) => <TwitterHandleLanding {...props} activeRoute="positions" />} />
                      <Route path="/:twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/positions/modal/:modal_to_show" component={(props) => <TwitterHandleLanding {...props} activeRoute="positions" />} />
                      <Route path="/:twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/positions/modal/:modal_to_show/:shared_item_code" component={(props) => <TwitterHandleLanding {...props} activeRoute="positions" />} />
                      <Route path="/:twitter_handle/followers" component={(props) => <TwitterHandleLanding {...props} activeRoute="followers" />} />
                      <Route path="/:twitter_handle/following" component={(props) => <TwitterHandleLanding {...props} activeRoute="following" />} />
                      <Route path="/:twitter_handle/m/followers" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
                      <Route path="/:twitter_handle/m/following" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
                      <Route path="/:twitter_handle/m/friends" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />}  />
                      <Route path="/:twitter_handle/modal/:modal_to_show" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/modal/:modal_to_show/:shared_item_code" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/positions" component={(props) => <TwitterHandleLanding {...props} activeRoute="positions" />} />
                      <Route path="/:twitter_handle/positions/modal/:modal_to_show" component={(props) => <TwitterHandleLanding {...props} activeRoute="positions" />} />
                      <Route path="/:twitter_handle/positions/modal/:modal_to_show/:shared_item_code" component={(props) => <TwitterHandleLanding {...props} activeRoute="positions" />} />
                      <Route path="/:twitter_handle($)?" component={TwitterHandleLanding} />
                      <Route path="*" component={PageNotFound} />
                    </Switch>
                  </Suspense>
                  {showFooterBar && (
                    <div className={isWebApp() ? 'footroom-wrapper' : 'footroom-wrapper-cordova'}>
                      <Suspense fallback={<></>}>
                        <FooterBar />
                      </Suspense>
                    </div>
                  )}
                </WeVoteBody>
              </WeVoteRouter>
            </StylesProvider>
          </ThemeProvider>
        </MuiThemeProvider>
      </ErrorBoundary>
    );
  }
}

const WeVoteBody = styled.div`
  background-color: rgb(235, 236, 238);
  color: #333;
  display: block;
  font-family: "Nunito Sans", "Helvetica Neue Light", "Helvetica Neue", "Helvetica", "Arial", sans-serif;
  line-height: 1.4;
  margin: 0 auto;
  // max-width: 960px;
  height: 100vw;
  position: relative;
  z-index: 0;
`;

export default App;
import { MuiThemeProvider, StylesProvider } from '@material-ui/core/styles';
import React, { Component, Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import LoadingWheelComp from './js/components/LoadingWheelComp';
import Header from './js/components/Navigation/Header';
import HeaderBarSuspense from './js/components/Navigation/HeaderBarSuspense';
import ErrorBoundary from './js/components/Widgets/ErrorBoundary';
import WeVoteRouter from './js/components/Widgets/WeVoteRouter';
import muiTheme from './js/mui-theme';
import AppObservableStore from './js/stores/AppObservableStore';
import styledTheme from './js/styled-theme';
import { getApplicationViewBooleans } from './js/utils/applicationUtils';
import { isWebApp } from './js/utils/cordovaUtils';
import initializejQuery from './js/utils/initializejQuery';
import { renderLog } from './js/utils/logging';
import RouterV5SendMatch from './js/utils/RouterV5SendMatch';

// Root URL pages

import About from './js/routes/More/About';
import AbsenteeBallot from './js/routes/More/AbsenteeBallot';
import AddCandidateForExtension from './js/routes/Ballot/AddCandidateForExtension';
import AppleSignInProcess from './js/routes/Process/AppleSignInProcess';
import Attributions from './js/routes/More/Attributions';
import Ballot from './js/routes/Ballot/Ballot';
import Candidate from './js/routes/Ballot/Candidate';
import CandidateForExtension from './js/routes/Ballot/CandidateForExtension';
import ClaimYourPage from './js/routes/Settings/ClaimYourPage';
import Credits from './js/routes/More/Credits';
import Donate from './js/routes/More/Donate';
import ElectionReminder from './js/routes/More/ElectionReminder';
import Elections from './js/routes/More/Elections';
import ExtensionSignIn from './js/routes/More/ExtensionSignIn';
import FAQ from './js/routes/More/FAQ';
import FacebookInvitableFriends from './js/routes/FacebookInvitableFriends';
import FacebookLandingProcess from './js/routes/Process/FacebookLandingProcess';
import FacebookRedirectToWeVote from './js/routes/More/FacebookRedirectToWeVote';
import FooterBar from './js/components/Navigation/FooterBar.jsx';
import FriendInvitationByEmailVerifyProcess from './js/routes/Process/FriendInvitationByEmailVerifyProcess';
import FriendInvitationOnboarding from './js/routes/Intro/FriendInvitationOnboarding';
import Friends from './js/routes/Friends/Friends';
import GetStarted from './js/routes/Intro/GetStarted';
import HamburgerMenu from './js/routes/Settings/HamburgerMenu';
import HowItWorks from './js/routes/HowItWorks';
import Intro from './js/routes/Intro/Intro';
import IntroNetwork from './js/routes/Intro/IntroNetwork';
import Location from './js/routes/Settings/Location';
import Measure from './js/routes/Ballot/Measure';
import News from './js/routes/Activity/News';
import Office from './js/routes/Ballot/Office';
import Opinions2020 from './js/routes/Opinions2020';
import OpinionsFollowed from './js/routes/OpinionsFollowed';
import OpinionsIgnored from './js/routes/OpinionsIgnored';
import OrganizationVoterGuide from './js/routes/VoterGuide/OrganizationVoterGuide';
import OrganizationVoterGuideCandidate from './js/routes/VoterGuide/OrganizationVoterGuideCandidate';
import OrganizationVoterGuideMeasure from './js/routes/VoterGuide/OrganizationVoterGuideMeasure';
import OrganizationVoterGuideMobileDetails from './js/routes/VoterGuide/OrganizationVoterGuideMobileDetails';
import OrganizationVoterGuideOffice from './js/routes/VoterGuide/OrganizationVoterGuideOffice';
import PageNotFound from './js/routes/PageNotFound';
import Pricing from './js/routes/More/Pricing';
import Privacy from './js/routes/More/Privacy';
import ProcessingDonation from './js/routes/More/ProcessingDonation';
import Ready from './js/routes/Ready';
import ReadyLight from './js/routes/ReadyLight';
import ReadyRedirect from './js/routes/ReadyRedirect';
import Register from './js/routes/Register';
import RegisterToVote from './js/routes/More/RegisterToVote';
import SampleBallot from './js/routes/Intro/SampleBallot';
import SearchPage from './js/routes/More/SearchPage';
import SettingsDashboard from './js/routes/Settings/SettingsDashboard';
import SettingsMenuMobile from './js/routes/Settings/SettingsMenuMobile';
import SharedItemLanding from './js/routes/SharedItemLanding';
import SignInEmailProcess from './js/routes/Process/SignInEmailProcess';
import SignInJumpProcess from './js/routes/Process/SignInJumpProcess';
import TermsOfService from './js/routes/More/TermsOfService';
import TwitterHandleLanding from './js/routes/TwitterHandleLanding';
import TwitterSignInProcess from './js/routes/Process/TwitterSignInProcess';
import Values from './js/routes/Values';
import ValuesList from './js/routes/Values/ValuesList';
import VerifyEmailProcess from './js/routes/Process/VerifyEmailProcess';
import VerifyRegistration from './js/routes/More/VerifyRegistration';
import VerifyThisIsMe from './js/routes/VoterGuide/VerifyThisIsMe';
import Vote from './js/routes/Vote';
import VoterGuideListDashboard from './js/routes/Settings/VoterGuideListDashboard';
import VoterGuideSettingsDashboard from './js/routes/Settings/VoterGuideSettingsDashboard';
import VoterGuideSettingsMenuMobile from './js/routes/Settings/VoterGuideSettingsMenuMobile';
import VoterGuidesMenuMobile from './js/routes/Settings/VoterGuidesMenuMobile';
import VoterGuidesUnderOneValue from './js/routes/Values/VoterGuidesUnderOneValue';
import WeVoteBallotEmbed from './js/routes/More/WeVoteBallotEmbed';
import WelcomeForCampaigns from './js/routes/WelcomeForCampaigns';
import WelcomeForOrganizations from './js/routes/WelcomeForOrganizations';
import WelcomeForVoters from './js/routes/WelcomeForVoters';
import YourPage from './js/routes/YourPage';

// There are just too many "prop spreadings" in the use of Route, if someone can figure out an alternative...
/* eslint-disable react/jsx-props-no-spreading */

class AppCordova extends Component {
  constructor (props) {
    super(props);
    this.state = {
      // doShowHeader: true,
      // doShowFooter: true,
      showReadyLight: true,
    };
    // this.setShowHeader = this.setShowHeader.bind(this);
    // this.setShowFooter = this.setShowFooter.bind(this);
    // this.setShowHeaderFooter = this.setShowHeaderFooter.bind(this);
    this.setShowReadyHeavy = this.setShowReadyHeavy.bind(this);
    this.localIsCordova();
  }

  // See https://reactjs.org/docs/error-boundaries.html
  static getDerivedStateFromError (error) { // eslint-disable-line no-unused-vars
    // Update state so the next render will show the fallback UI, We should have a "Oh snap" page
    console.log('App caught error ', error);
    return { hasError: true };
  }

  componentDidMount () {
    initializejQuery(() => {
      let { hostname } = window.location;
      hostname = hostname || '';
      AppObservableStore.siteConfigurationRetrieve(hostname);
    });
    console.log('href in App.js componentDidMount: ', window.location.href);
  }

  componentDidCatch (error, info) {
    // We should get this information to Splunk!
    console.error('App caught error: ', `${error} with info: `, info);
  }

  // setShowHeader (doShowHeader) {
  //   console.log('-----------HEADER setShowHeader');
  //   this.setState({ doShowHeader });
  // }

  // setShowFooter (doShowFooter) {
  //   console.log('-----------HEADER setShowFooter');
  //   this.setState({ doShowFooter });
  // }

  // setShowHeaderFooter (doShow) {
  //   console.log('-----------HEADER setShowHeaderFooter', doShow);
  //   // console.log('setShowHeaderFooter -------------- doShow:', doShow);
  //   this.setState({
  //     doShowHeader: doShow,
  //     doShowFooter: doShow,
  //   });
  // }

  setShowReadyHeavy () {
    this.setState({ showReadyLight: false });
  }

  // From index.js (4/20/21)
  localIsCordova () {
    const { cordova } = window;
    window.isCordovaGlobal = cordova !== undefined;    // So now we set a global
    return cordova !== undefined;
  }

  render () {
    renderLog('App');
    const { /* doShowHeader, doShowFooter, */ showReadyLight } = this.state;
    // console.log(`App doShowHeader: ${doShowHeader}, doShowFooter:${doShowFooter}`);
    let { hostname } = window.location;
    hostname = hostname || '';
    const weVoteSites = ['wevote.us', 'quality.wevote.us', 'localhost', 'silicon', ''];   // localhost on Cordova is a ''
    const isWeVoteMarketingSite = weVoteSites.includes(String(hostname));
    const isNotWeVoteMarketingSite = !isWeVoteMarketingSite;
    const siteVars = getApplicationViewBooleans(hostname);
    const { showFooterBar } = siteVars;
    // const firstVisit = !cookies.getItem('voter_device_id');

    console.log('href in App.js render: ', window.location.href);

    /*
    Note: To debug routing, set a breakpoint in the class that routing takes you to -- then look at the received props.
    The props.match.path shows exactly which route string from this file, was selected by the <Switch>
    */

    return (
      <ErrorBoundary>
        <MuiThemeProvider theme={muiTheme}>
          <ThemeProvider theme={styledTheme}>
            <StylesProvider injectFirst>
              <WeVoteRouter>
                <WeVoteBody>
                  {/* DO NOT put SnackNotifier or anything else that is non-essential here (to keep it out of the main chuck. */}
                  <Suspense fallback={<HeaderBarSuspense />}>
                    <Header params={{ }} pathname={window.location.href} />
                  </Suspense>
                  <Suspense fallback={<LoadingWheelComp />}>
                    <Switch>
                      <Route exact path="/about"><About /></Route>
                      <Route exact path="/ballot" component={Ballot} />
                      <Route exact path="/friends" component={Friends} />
                      <Route exact path="/friends/:tabItem" component={Friends} />
                      <Route exact path="/">
                        {() => {
                          if (showReadyLight) {
                            return <ReadyLight showReadyHeavy={this.setShowReadyHeavy} />;
                          } else {
                            return <Redirect to="/ready" />;
                          }
                        }}
                      </Route>
                      <Route exact path="/ready"><Ready /></Route>
                      {/* <Route exact path="/ready"><Redirect to="/" /></Route> */}
                      <Route exact path="/settings" component={SettingsDashboard} />
                      <Route exact path="/settings/claim" component={ClaimYourPage} />
                      <Route exact path="/settings/hamburger" component={HamburgerMenu} />
                      <Route exact path="/settings/location" component={Location} />
                      <Route exact path="/settings/menu" component={SettingsMenuMobile} />
                      <Route exact path="/settings/voterguidelist" component={VoterGuideListDashboard} />
                      <Route exact path="/settings/voterguidesmenu" component={VoterGuidesMenuMobile} />
                      <Route exact path="/twitter_sign_in"><TwitterSignInProcess /></Route>
                      <Route path="/-/:custom_link_string" component={SharedItemLanding} />
                      <Route path="/-:shared_item_code" component={SharedItemLanding} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable($)?" component={TwitterHandleLanding} />
                      <Route path="/add-candidate-for-extension" component={AddCandidateForExtension} />
                      <Route path="/applesigninprocess" component={AppleSignInProcess} />
                      <Route path="/ballot/:ballot_location_shortcut" component={Ballot} />
                      <Route path="/ballot/:ballot_location_shortcut/modal/:modal_to_show" component={Ballot} />
                      <Route path="/ballot/:ballot_location_shortcut/modal/:modal_to_show/:shared_item_code" component={Ballot} />
                      <Route path="/ballot/election/:google_civic_election_id" component={Ballot} />
                      <Route path="/ballot/election/:google_civic_election_id/modal/:modal_to_show" component={Ballot} />
                      <Route path="/ballot/election/:google_civic_election_id/modal/:modal_to_show/:shared_item_code" component={Ballot} />
                      <Route path="/ballot/id/:ballot_returned_we_vote_id" component={Ballot} />
                      <Route path="/ballot/id/:ballot_returned_we_vote_id/modal/:modal_to_show" component={Ballot} />
                      <Route path="/ballot/id/:ballot_returned_we_vote_id/modal/:modal_to_show/:shared_item_code" component={Ballot} />
                      <Route path="/ballot/modal/:modal_to_show" component={Ballot} />
                      <Route path="/ballot/modal/:modal_to_show/:shared_item_code" component={Ballot} />
                      <Route path="/ballot/vote" component={Vote} />
                      <Route path="/ballot?voter_refresh_timer_on=:voter_refresh_timer_on" component={Ballot} />
                      <Route path="/candidate-for-extension" component={CandidateForExtension} />
                      <Route path="/candidate/:candidate_we_vote_id" component={Candidate} />
                      <Route path="/candidate/:candidate_we_vote_id/:back_to_variable/:organization_we_vote_id" component={OrganizationVoterGuideCandidate} />
                      <Route path="/candidate/:candidate_we_vote_id/:organization_we_vote_id" component={OrganizationVoterGuideCandidate} />
                      <Route path="/candidate/:candidate_we_vote_id/b/:back_to_variable" component={Candidate} />
                      <Route path="/candidate/:candidate_we_vote_id/b/:back_to_variable/" component={Candidate} />
                      <Route path="/candidate/:candidate_we_vote_id/b/:back_to_variable/modal/:modal_to_show" component={Candidate} />
                      <Route path="/candidate/:candidate_we_vote_id/b/:back_to_variable/modal/:modal_to_show/:shared_item_code" component={Candidate} />
                      <Route path="/candidate/:candidate_we_vote_id/modal/:modal_to_show" component={Candidate} />
                      <Route path="/candidate/:candidate_we_vote_id/modal/:modal_to_show/:shared_item_code" component={Candidate} />
                      <Route path="/facebook_invitable_friends" component={FacebookInvitableFriends} />
                      <Route path="/for-campaigns" component={isNotWeVoteMarketingSite ? ReadyRedirect : (props) => <WelcomeForCampaigns {...props} pathname="/for-campaigns" />} />
                      <Route path="/for-organizations" component={isNotWeVoteMarketingSite ? ReadyRedirect : (props) => <WelcomeForOrganizations {...props} pathname="/for-organizations" />} />
                      <Route path="/how" component={isNotWeVoteMarketingSite ? ReadyRedirect : HowItWorks} />
                      <Route path="/how/:category_string" component={isNotWeVoteMarketingSite ? ReadyRedirect : HowItWorks} />
                      <Route path="/intro" component={Intro} />
                      <Route path="/intro/get_started" component={GetStarted} />
                      <Route path="/intro/sample_ballot" component={SampleBallot} />
                      <Route path="/measure/:measure_we_vote_id" component={Measure} />
                      <Route path="/measure/:measure_we_vote_id/:back_to_variable/:organization_we_vote_id" component={OrganizationVoterGuideMeasure} />
                      <Route path="/measure/:measure_we_vote_id/b/:back_to_variable" component={Measure} />
                      <Route path="/measure/:measure_we_vote_id/b/:back_to_variable/" component={Measure} />
                      <Route path="/measure/:measure_we_vote_id/b/:back_to_variable/modal/:modal_to_show" component={Measure} />
                      <Route path="/measure/:measure_we_vote_id/b/:back_to_variable/modal/:modal_to_show/:shared_item_code" component={Measure} />
                      <Route path="/measure/:measure_we_vote_id/modal/:modal_to_show" component={Measure} />
                      <Route path="/measure/:measure_we_vote_id/modal/:modal_to_show/:shared_item_code" component={Measure} />
                      <Route path="/more/absentee" component={AbsenteeBallot} />
                      <Route path="/more/alerts" component={ElectionReminder} />
                      <Route path="/more/alerts" component={ElectionReminder} />
                      <Route path="/more/attributions" component={Attributions} />
                      <Route path="/more/attributions" component={Attributions} />
                      <Route path="/more/credits" component={Credits} />
                      <Route path="/more/credits" component={Credits} />
                      <Route path="/more/donate" component={isNotWeVoteMarketingSite ? ReadyRedirect : Donate} />
                      <Route path="/more/donate" component={isNotWeVoteMarketingSite ? ReadyRedirect : Donate} />
                      <Route path="/more/elections" component={Elections} />
                      <Route path="/more/elections" component={Elections} />
                      <Route path="/more/extensionsignin" component={ExtensionSignIn} />
                      <Route path="/more/extensionsignin" component={ExtensionSignIn} />
                      <Route path="/more/facebooklandingprocess" component={FacebookLandingProcess} />
                      <Route path="/more/facebookredirecttowevote" component={FacebookRedirectToWeVote} />
                      <Route path="/more/faq" component={FAQ} />
                      <Route path="/more/jump" component={SignInJumpProcess} />
                      <Route path="/more/myballot" component={WeVoteBallotEmbed} />
                      <Route path="/more/network" component={Friends} />
                      <Route path="/more/network/friends" component={Friends} />
                      <Route path="/more/network/key/:invitation_secret_key" component={FriendInvitationByEmailVerifyProcess} />
                      <Route path="/more/network/key/:invitation_secret_key/ignore" component={FriendInvitationByEmailVerifyProcess} />
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
                      <Route path="/news" component={News} />
                      <Route path="/news/a/" component={News} />
                      <Route path="/news/a/:activity_tidbit_we_vote_id" component={News} />
                      <Route path="/office/:office_we_vote_id" component={Office} />
                      <Route path="/office/:office_we_vote_id/:back_to_variable/:organization_we_vote_id" component={OrganizationVoterGuideOffice} />
                      <Route path="/office/:office_we_vote_id/:organization_we_vote_id" component={OrganizationVoterGuideOffice} />
                      <Route path="/office/:office_we_vote_id/b/:back_to_variable" component={Office} />
                      <Route path="/office/:office_we_vote_id/b/:back_to_variable/" component={Office} />
                      <Route path="/office/:office_we_vote_id/b/:back_to_variable/modal/:modal_to_show" component={Office} />
                      <Route path="/office/:office_we_vote_id/modal/:modal_to_show" component={Office} />
                      <Route path="/office/:office_we_vote_id/modal/:modal_to_show/:shared_item_code" component={Office} />
                      <Route path="/opinions" component={Opinions2020} />
                      <Route path="/opinions/f/:selectedFilter" component={Opinions2020} />
                      <Route path="/opinions/s/:searchTextDefault" component={Opinions2020} />
                      <Route path="/opinions_followed" component={OpinionsFollowed} />
                      <Route path="/opinions_ignored" component={OpinionsIgnored} />
                      {/* <Route exact path="/ready"><Redirect to="/" /></Route> */}
                      <Route exact path="/ready"><Ready /></Route>
                      <Route path="/ready/election/:google_civic_election_id" component={Ready} />
                      <Route path="/ready/modal/:modal_to_show" render={(props) => (<RouterV5SendMatch componentName="Ready" {...props} />)} />
                      <Route path="/ready/modal/:modal_to_show/:shared_item_code" render={(props) => (<RouterV5SendMatch componentName="Ready" {...props} />)} />
                      <Route path="/register" component={Register} />
                      <Route path="/settings/:edit_mode" render={(props) => (<RouterV5SendMatch componentName="SettingsDashboard" {...props} />)} />
                      <Route path="/settings/:edit_mode/:voter_guide_we_vote_id" render={(props) => (<RouterV5SendMatch componentName="SettingsDashboard" {...props} />)} />
                      <Route path="/settings/issues/:edit_mode" render={(props) => (<RouterV5SendMatch componentName="SettingsDashboard" {...props} />)} />
                      <Route path="/sign_in_email/:email_secret_key" component={SignInEmailProcess} />
                      <Route path="/twittersigninprocess/:sign_in_step" component={TwitterSignInProcess} />
                      <Route path="/value/:value_slug" component={VoterGuidesUnderOneValue} />
                      <Route path="/values" component={Values} />
                      <Route path="/values/list" component={ValuesList} />
                      <Route path="/verify_email/:email_secret_key" component={VerifyEmailProcess} />
                      <Route path="/verifythisisme/:twitter_handle" component={VerifyThisIsMe} />
                      <Route path="/vg/:voter_guide_we_vote_id/settings" component={VoterGuideSettingsDashboard} />
                      <Route path="/vg/:voter_guide_we_vote_id/settings/menu" component={VoterGuideSettingsMenuMobile} />
                      <Route path="/vg/:voter_guide_we_vote_id/settings/positions" component={VoterGuideSettingsDashboard} />
                      <Route path="/voterguide/:organization_we_vote_id" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/:action_variable" component={OrganizationVoterGuide} />
                      <Route path="/voterguide/:organization_we_vote_id/ballot" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/ballot/:ballot_location_shortcut" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/ballot/election/:google_civic_election_id" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/ballot/election/:google_civic_election_id/ballot" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/ballot/election/:google_civic_election_id/followers" component={(props) => <OrganizationVoterGuide {...props} activeRoute="followers" />} />
                      <Route path="/voterguide/:organization_we_vote_id/ballot/election/:google_civic_election_id/following" component={(props) => <OrganizationVoterGuide {...props} activeRoute="following" />} />
                      <Route path="/voterguide/:organization_we_vote_id/ballot/election/:google_civic_election_id/m/followers" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
                      <Route path="/voterguide/:organization_we_vote_id/ballot/election/:google_civic_election_id/m/following" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
                      <Route path="/voterguide/:organization_we_vote_id/ballot/election/:google_civic_election_id/m/friends" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />} />
                      <Route path="/voterguide/:organization_we_vote_id/ballot/election/:google_civic_election_id/positions" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/ballot/election/:google_civic_election_id/positions/modal/:modal_to_show" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/ballot/election/:google_civic_election_id/positions/modal/:modal_to_show/:shared_item_code" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/ballot/empty" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/ballot/id/:ballot_returned_we_vote_id" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable" component={OrganizationVoterGuide} />
                      <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/:action_variable" component={OrganizationVoterGuide} />
                      <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/:action_variable/m/followers" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/:action_variable/m/following" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/:action_variable/m/friends" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/followers" component={(props) => <OrganizationVoterGuide {...props} activeRoute="followers" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/following" component={(props) => <OrganizationVoterGuide {...props} activeRoute="following" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/m/followers" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/m/following" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/m/friends" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/modal/:modal_to_show" component={OrganizationVoterGuide} />
                      <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/modal/:modal_to_show/:shared_item_code" component={OrganizationVoterGuide} />
                      <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/positions" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/positions/modal/:modal_to_show" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/positions/modal/:modal_to_show/:shared_item_code" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable" component={OrganizationVoterGuide} />
                      <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/:action_variable" component={OrganizationVoterGuide} />
                      <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/:action_variable/m/followers" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/:action_variable/m/following" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/:action_variable/m/friends" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/followers" component={(props) => <OrganizationVoterGuide {...props} activeRoute="followers" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/following" component={(props) => <OrganizationVoterGuide {...props} activeRoute="following" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/m/followers" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/m/following" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/m/friends" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/modal/:modal_to_show" component={OrganizationVoterGuide} />
                      <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/modal/:modal_to_show/:shared_item_code" component={OrganizationVoterGuide} />
                      <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/positions" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/positions/modal/:modal_to_show" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/positions/modal/:modal_to_show/:shared_item_code" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/followers" component={(props) => <OrganizationVoterGuide {...props} activeRoute="followers" />} />
                      <Route path="/voterguide/:organization_we_vote_id/following" component={(props) => <OrganizationVoterGuide {...props} activeRoute="following" />} />
                      <Route path="/voterguide/:organization_we_vote_id/m/followers" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
                      <Route path="/voterguide/:organization_we_vote_id/m/following" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
                      <Route path="/voterguide/:organization_we_vote_id/m/friends" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />} />
                      <Route path="/voterguide/:organization_we_vote_id/modal/:modal_to_show" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/modal/:modal_to_show/:shared_item_code" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/positions" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/positions/modal/:modal_to_show" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/positions/modal/:modal_to_show/:shared_item_code" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguideedit/:organization_we_vote_id" render={(props) => (<RouterV5SendMatch componentName="OrganizationVoterGuideEdit" {...props} />)} />
                      <Route path="/voterguideedit/:organization_we_vote_id/:google_civic_election_id" render={(props) => (<RouterV5SendMatch componentName="OrganizationVoterGuideEdit" {...props} />)} />
                      <Route path="/welcome" component={isNotWeVoteMarketingSite ? ReadyRedirect : (props) => <WelcomeForVoters {...props} pathname="/welcome" />} />
                      <Route path="/wevoteintro/network" component={IntroNetwork} />
                      <Route path="/wevoteintro/newfriend/:invitationSecretKey" component={FriendInvitationOnboarding} />
                      <Route path="/yourpage" component={YourPage} />
                      <Route path="/:twitter_handle/:action_variable" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/ballot/:ballot_location_shortcut" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/ballot/election/:google_civic_election_id" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/ballot/election/:google_civic_election_id/:view_mode" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/ballot/empty" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/ballot/id/:ballot_returned_we_vote_id" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/ballot/id/:ballot_returned_we_vote_id/:view_mode" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/:action_variable" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/:action_variable/m/followers" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/:action_variable/m/following" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/:action_variable/m/friends" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/followers" component={(props) => <TwitterHandleLanding {...props} activeRoute="followers" />} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/following" component={(props) => <TwitterHandleLanding {...props} activeRoute="following" />} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/m/followers" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/m/following" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/m/friends" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/modal/:modal_to_show" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/modal/:modal_to_show/:shared_item_code" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/modal/:modal_to_show/:shared_item_code" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/positions" component={(props) => <TwitterHandleLanding {...props} activeRoute="positions" />} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/positions/modal/:modal_to_show" component={(props) => <TwitterHandleLanding {...props} activeRoute="positions" />} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/positions/modal/:modal_to_show/:shared_item_code" component={(props) => <TwitterHandleLanding {...props} activeRoute="positions" />} />
                      <Route path="/:twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/:action_variable" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/:action_variable/m/followers" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
                      <Route path="/:twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/:action_variable/m/following" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
                      <Route path="/:twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/:action_variable/m/friends" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />} />
                      <Route path="/:twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/followers" component={(props) => <TwitterHandleLanding {...props} activeRoute="followers" />} />
                      <Route path="/:twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/following" component={(props) => <TwitterHandleLanding {...props} activeRoute="following" />} />
                      <Route path="/:twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/m/followers" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
                      <Route path="/:twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/m/following" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
                      <Route path="/:twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/m/friends" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />} />
                      <Route path="/:twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/modal/:modal_to_show" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/modal/:modal_to_show/:shared_item_code" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/positions" component={(props) => <TwitterHandleLanding {...props} activeRoute="positions" />} />
                      <Route path="/:twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/positions/modal/:modal_to_show" component={(props) => <TwitterHandleLanding {...props} activeRoute="positions" />} />
                      <Route path="/:twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/positions/modal/:modal_to_show/:shared_item_code" component={(props) => <TwitterHandleLanding {...props} activeRoute="positions" />} />
                      <Route path="/:twitter_handle/followers" component={(props) => <TwitterHandleLanding {...props} activeRoute="followers" />} />
                      <Route path="/:twitter_handle/following" component={(props) => <TwitterHandleLanding {...props} activeRoute="following" />} />
                      <Route path="/:twitter_handle/m/followers" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
                      <Route path="/:twitter_handle/m/following" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
                      <Route path="/:twitter_handle/m/friends" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />}  />
                      <Route path="/:twitter_handle/modal/:modal_to_show" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/modal/:modal_to_show/:shared_item_code" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/positions" component={(props) => <TwitterHandleLanding {...props} activeRoute="positions" />} />
                      <Route path="/:twitter_handle/positions/modal/:modal_to_show" component={(props) => <TwitterHandleLanding {...props} activeRoute="positions" />} />
                      <Route path="/:twitter_handle/positions/modal/:modal_to_show/:shared_item_code" component={(props) => <TwitterHandleLanding {...props} activeRoute="positions" />} />
                      <Route path="/:twitter_handle($)?" component={TwitterHandleLanding} />
                      <Route path="*" component={PageNotFound} />
                    </Switch>
                  </Suspense>
                  {showFooterBar && (
                    <div className={isWebApp() ? 'footroom-wrapper' : 'footroom-wrapper-cordova'}>
                      <Suspense fallback={<></>}>
                        <FooterBar />
                      </Suspense>
                    </div>
                  )}
                </WeVoteBody>
              </WeVoteRouter>
            </StylesProvider>
          </ThemeProvider>
        </MuiThemeProvider>
      </ErrorBoundary>
    );
  }
}

const WeVoteBody = styled.div`
  background-color: rgb(235, 236, 238);
  color: #333;
  display: block;
  font-family: "Nunito Sans", "Helvetica Neue Light", "Helvetica Neue", "Helvetica", "Arial", sans-serif;
  line-height: 1.4;
  margin: 0 auto;
  // max-width: 960px;
  height: 100vw;
  position: relative;
  z-index: 0;
`;

export default App;
import { MuiThemeProvider, StylesProvider } from '@material-ui/core/styles';
import React, { Component, Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import LoadingWheelComp from './js/components/LoadingWheelComp';
import Header from './js/components/Navigation/Header';
import HeaderBarSuspense from './js/components/Navigation/HeaderBarSuspense';
import ErrorBoundary from './js/components/Widgets/ErrorBoundary';
import WeVoteRouter from './js/components/Widgets/WeVoteRouter';
import muiTheme from './js/mui-theme';
import AppObservableStore from './js/stores/AppObservableStore';
import styledTheme from './js/styled-theme';
import { getApplicationViewBooleans } from './js/utils/applicationUtils';
import { isWebApp } from './js/utils/cordovaUtils';
import initializejQuery from './js/utils/initializejQuery';
import { renderLog } from './js/utils/logging';
import RouterV5SendMatch from './js/utils/RouterV5SendMatch';

// Root URL pages

import About from './js/routes/More/About';
import AbsenteeBallot from './js/routes/More/AbsenteeBallot';
import AddCandidateForExtension from './js/routes/Ballot/AddCandidateForExtension';
import AppleSignInProcess from './js/routes/Process/AppleSignInProcess';
import Attributions from './js/routes/More/Attributions';
import Ballot from './js/routes/Ballot/Ballot';
import Candidate from './js/routes/Ballot/Candidate';
import CandidateForExtension from './js/routes/Ballot/CandidateForExtension';
import ClaimYourPage from './js/routes/Settings/ClaimYourPage';
import Credits from './js/routes/More/Credits';
import Donate from './js/routes/More/Donate';
import ElectionReminder from './js/routes/More/ElectionReminder';
import Elections from './js/routes/More/Elections';
import ExtensionSignIn from './js/routes/More/ExtensionSignIn';
import FAQ from './js/routes/More/FAQ';
import FacebookInvitableFriends from './js/routes/FacebookInvitableFriends';
import FacebookLandingProcess from './js/routes/Process/FacebookLandingProcess';
import FacebookRedirectToWeVote from './js/routes/More/FacebookRedirectToWeVote';
import FooterBar from './js/components/Navigation/FooterBar.jsx';
import FriendInvitationByEmailVerifyProcess from './js/routes/Process/FriendInvitationByEmailVerifyProcess';
import FriendInvitationOnboarding from './js/routes/Intro/FriendInvitationOnboarding';
import Friends from './js/routes/Friends/Friends';
import GetStarted from './js/routes/Intro/GetStarted';
import HamburgerMenu from './js/routes/Settings/HamburgerMenu';
import HowItWorks from './js/routes/HowItWorks';
import Intro from './js/routes/Intro/Intro';
import IntroNetwork from './js/routes/Intro/IntroNetwork';
import Location from './js/routes/Settings/Location';
import Measure from './js/routes/Ballot/Measure';
import News from './js/routes/Activity/News';
import Office from './js/routes/Ballot/Office';
import Opinions2020 from './js/routes/Opinions2020';
import OpinionsFollowed from './js/routes/OpinionsFollowed';
import OpinionsIgnored from './js/routes/OpinionsIgnored';
import OrganizationVoterGuide from './js/routes/VoterGuide/OrganizationVoterGuide';
import OrganizationVoterGuideCandidate from './js/routes/VoterGuide/OrganizationVoterGuideCandidate';
import OrganizationVoterGuideMeasure from './js/routes/VoterGuide/OrganizationVoterGuideMeasure';
import OrganizationVoterGuideMobileDetails from './js/routes/VoterGuide/OrganizationVoterGuideMobileDetails';
import OrganizationVoterGuideOffice from './js/routes/VoterGuide/OrganizationVoterGuideOffice';
import PageNotFound from './js/routes/PageNotFound';
import Pricing from './js/routes/More/Pricing';
import Privacy from './js/routes/More/Privacy';
import ProcessingDonation from './js/routes/More/ProcessingDonation';
import Ready from './js/routes/Ready';
import ReadyLight from './js/routes/ReadyLight';
import ReadyRedirect from './js/routes/ReadyRedirect';
import Register from './js/routes/Register';
import RegisterToVote from './js/routes/More/RegisterToVote';
import SampleBallot from './js/routes/Intro/SampleBallot';
import SearchPage from './js/routes/More/SearchPage';
import SettingsDashboard from './js/routes/Settings/SettingsDashboard';
import SettingsMenuMobile from './js/routes/Settings/SettingsMenuMobile';
import SharedItemLanding from './js/routes/SharedItemLanding';
import SignInEmailProcess from './js/routes/Process/SignInEmailProcess';
import SignInJumpProcess from './js/routes/Process/SignInJumpProcess';
import TermsOfService from './js/routes/More/TermsOfService';
import TwitterHandleLanding from './js/routes/TwitterHandleLanding';
import TwitterSignInProcess from './js/routes/Process/TwitterSignInProcess';
import Values from './js/routes/Values';
import ValuesList from './js/routes/Values/ValuesList';
import VerifyEmailProcess from './js/routes/Process/VerifyEmailProcess';
import VerifyRegistration from './js/routes/More/VerifyRegistration';
import VerifyThisIsMe from './js/routes/VoterGuide/VerifyThisIsMe';
import Vote from './js/routes/Vote';
import VoterGuideListDashboard from './js/routes/Settings/VoterGuideListDashboard';
import VoterGuideSettingsDashboard from './js/routes/Settings/VoterGuideSettingsDashboard';
import VoterGuideSettingsMenuMobile from './js/routes/Settings/VoterGuideSettingsMenuMobile';
import VoterGuidesMenuMobile from './js/routes/Settings/VoterGuidesMenuMobile';
import VoterGuidesUnderOneValue from './js/routes/Values/VoterGuidesUnderOneValue';
import WeVoteBallotEmbed from './js/routes/More/WeVoteBallotEmbed';
import WelcomeForCampaigns from './js/routes/WelcomeForCampaigns';
import WelcomeForOrganizations from './js/routes/WelcomeForOrganizations';
import WelcomeForVoters from './js/routes/WelcomeForVoters';
import YourPage from './js/routes/YourPage';

// There are just too many "prop spreadings" in the use of Route, if someone can figure out an alternative...
/* eslint-disable react/jsx-props-no-spreading */

class AppCordova extends Component {
  constructor (props) {
    super(props);
    this.state = {
      // doShowHeader: true,
      // doShowFooter: true,
      showReadyLight: true,
    };
    // this.setShowHeader = this.setShowHeader.bind(this);
    // this.setShowFooter = this.setShowFooter.bind(this);
    // this.setShowHeaderFooter = this.setShowHeaderFooter.bind(this);
    this.setShowReadyHeavy = this.setShowReadyHeavy.bind(this);
    this.localIsCordova();
  }

  // See https://reactjs.org/docs/error-boundaries.html
  static getDerivedStateFromError (error) { // eslint-disable-line no-unused-vars
    // Update state so the next render will show the fallback UI, We should have a "Oh snap" page
    console.log('App caught error ', error);
    return { hasError: true };
  }

  componentDidMount () {
    initializejQuery(() => {
      let { hostname } = window.location;
      hostname = hostname || '';
      AppObservableStore.siteConfigurationRetrieve(hostname);
    });
    console.log('href in App.js componentDidMount: ', window.location.href);
  }

  componentDidCatch (error, info) {
    // We should get this information to Splunk!
    console.error('App caught error: ', `${error} with info: `, info);
  }

  // setShowHeader (doShowHeader) {
  //   console.log('-----------HEADER setShowHeader');
  //   this.setState({ doShowHeader });
  // }

  // setShowFooter (doShowFooter) {
  //   console.log('-----------HEADER setShowFooter');
  //   this.setState({ doShowFooter });
  // }

  // setShowHeaderFooter (doShow) {
  //   console.log('-----------HEADER setShowHeaderFooter', doShow);
  //   // console.log('setShowHeaderFooter -------------- doShow:', doShow);
  //   this.setState({
  //     doShowHeader: doShow,
  //     doShowFooter: doShow,
  //   });
  // }

  setShowReadyHeavy () {
    this.setState({ showReadyLight: false });
  }

  // From index.js (4/20/21)
  localIsCordova () {
    const { cordova } = window;
    window.isCordovaGlobal = cordova !== undefined;    // So now we set a global
    return cordova !== undefined;
  }

  render () {
    renderLog('App');
    const { /* doShowHeader, doShowFooter, */ showReadyLight } = this.state;
    // console.log(`App doShowHeader: ${doShowHeader}, doShowFooter:${doShowFooter}`);
    let { hostname } = window.location;
    hostname = hostname || '';
    const weVoteSites = ['wevote.us', 'quality.wevote.us', 'localhost', 'silicon', ''];   // localhost on Cordova is a ''
    const isWeVoteMarketingSite = weVoteSites.includes(String(hostname));
    const isNotWeVoteMarketingSite = !isWeVoteMarketingSite;
    const siteVars = getApplicationViewBooleans(hostname);
    const { showFooterBar } = siteVars;
    // const firstVisit = !cookies.getItem('voter_device_id');

    console.log('href in App.js render: ', window.location.href);

    /*
    Note: To debug routing, set a breakpoint in the class that routing takes you to -- then look at the received props.
    The props.match.path shows exactly which route string from this file, was selected by the <Switch>
    */

    return (
      <ErrorBoundary>
        <MuiThemeProvider theme={muiTheme}>
          <ThemeProvider theme={styledTheme}>
            <StylesProvider injectFirst>
              <WeVoteRouter>
                <WeVoteBody>
                  {/* DO NOT put SnackNotifier or anything else that is non-essential here (to keep it out of the main chuck. */}
                  <Suspense fallback={<HeaderBarSuspense />}>
                    <Header params={{ }} pathname={window.location.href} />
                  </Suspense>
                  <Suspense fallback={<LoadingWheelComp />}>
                    <Switch>
                      <Route exact path="/about"><About /></Route>
                      <Route exact path="/ballot" component={Ballot} />
                      <Route exact path="/friends" component={Friends} />
                      <Route exact path="/friends/:tabItem" component={Friends} />
                      <Route exact path="/">
                        {() => {
                          if (showReadyLight) {
                            return <ReadyLight showReadyHeavy={this.setShowReadyHeavy} />;
                          } else {
                            return <Redirect to="/ready" />;
                          }
                        }}
                      </Route>
                      <Route exact path="/ready"><Ready /></Route>
                      {/* <Route exact path="/ready"><Redirect to="/" /></Route> */}
                      <Route exact path="/settings" component={SettingsDashboard} />
                      <Route exact path="/settings/claim" component={ClaimYourPage} />
                      <Route exact path="/settings/hamburger" component={HamburgerMenu} />
                      <Route exact path="/settings/location" component={Location} />
                      <Route exact path="/settings/menu" component={SettingsMenuMobile} />
                      <Route exact path="/settings/voterguidelist" component={VoterGuideListDashboard} />
                      <Route exact path="/settings/voterguidesmenu" component={VoterGuidesMenuMobile} />
                      <Route exact path="/twitter_sign_in"><TwitterSignInProcess /></Route>
                      <Route path="/-/:custom_link_string" component={SharedItemLanding} />
                      <Route path="/-:shared_item_code" component={SharedItemLanding} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable($)?" component={TwitterHandleLanding} />
                      <Route path="/add-candidate-for-extension" component={AddCandidateForExtension} />
                      <Route path="/applesigninprocess" component={AppleSignInProcess} />
                      <Route path="/ballot/:ballot_location_shortcut" component={Ballot} />
                      <Route path="/ballot/:ballot_location_shortcut/modal/:modal_to_show" component={Ballot} />
                      <Route path="/ballot/:ballot_location_shortcut/modal/:modal_to_show/:shared_item_code" component={Ballot} />
                      <Route path="/ballot/election/:google_civic_election_id" component={Ballot} />
                      <Route path="/ballot/election/:google_civic_election_id/modal/:modal_to_show" component={Ballot} />
                      <Route path="/ballot/election/:google_civic_election_id/modal/:modal_to_show/:shared_item_code" component={Ballot} />
                      <Route path="/ballot/id/:ballot_returned_we_vote_id" component={Ballot} />
                      <Route path="/ballot/id/:ballot_returned_we_vote_id/modal/:modal_to_show" component={Ballot} />
                      <Route path="/ballot/id/:ballot_returned_we_vote_id/modal/:modal_to_show/:shared_item_code" component={Ballot} />
                      <Route path="/ballot/modal/:modal_to_show" component={Ballot} />
                      <Route path="/ballot/modal/:modal_to_show/:shared_item_code" component={Ballot} />
                      <Route path="/ballot/vote" component={Vote} />
                      <Route path="/ballot?voter_refresh_timer_on=:voter_refresh_timer_on" component={Ballot} />
                      <Route path="/candidate-for-extension" component={CandidateForExtension} />
                      <Route path="/candidate/:candidate_we_vote_id" component={Candidate} />
                      <Route path="/candidate/:candidate_we_vote_id/:back_to_variable/:organization_we_vote_id" component={OrganizationVoterGuideCandidate} />
                      <Route path="/candidate/:candidate_we_vote_id/:organization_we_vote_id" component={OrganizationVoterGuideCandidate} />
                      <Route path="/candidate/:candidate_we_vote_id/b/:back_to_variable" component={Candidate} />
                      <Route path="/candidate/:candidate_we_vote_id/b/:back_to_variable/" component={Candidate} />
                      <Route path="/candidate/:candidate_we_vote_id/b/:back_to_variable/modal/:modal_to_show" component={Candidate} />
                      <Route path="/candidate/:candidate_we_vote_id/b/:back_to_variable/modal/:modal_to_show/:shared_item_code" component={Candidate} />
                      <Route path="/candidate/:candidate_we_vote_id/modal/:modal_to_show" component={Candidate} />
                      <Route path="/candidate/:candidate_we_vote_id/modal/:modal_to_show/:shared_item_code" component={Candidate} />
                      <Route path="/facebook_invitable_friends" component={FacebookInvitableFriends} />
                      <Route path="/for-campaigns" component={isNotWeVoteMarketingSite ? ReadyRedirect : (props) => <WelcomeForCampaigns {...props} pathname="/for-campaigns" />} />
                      <Route path="/for-organizations" component={isNotWeVoteMarketingSite ? ReadyRedirect : (props) => <WelcomeForOrganizations {...props} pathname="/for-organizations" />} />
                      <Route path="/how" component={isNotWeVoteMarketingSite ? ReadyRedirect : HowItWorks} />
                      <Route path="/how/:category_string" component={isNotWeVoteMarketingSite ? ReadyRedirect : HowItWorks} />
                      <Route path="/intro" component={Intro} />
                      <Route path="/intro/get_started" component={GetStarted} />
                      <Route path="/intro/sample_ballot" component={SampleBallot} />
                      <Route path="/measure/:measure_we_vote_id" component={Measure} />
                      <Route path="/measure/:measure_we_vote_id/:back_to_variable/:organization_we_vote_id" component={OrganizationVoterGuideMeasure} />
                      <Route path="/measure/:measure_we_vote_id/b/:back_to_variable" component={Measure} />
                      <Route path="/measure/:measure_we_vote_id/b/:back_to_variable/" component={Measure} />
                      <Route path="/measure/:measure_we_vote_id/b/:back_to_variable/modal/:modal_to_show" component={Measure} />
                      <Route path="/measure/:measure_we_vote_id/b/:back_to_variable/modal/:modal_to_show/:shared_item_code" component={Measure} />
                      <Route path="/measure/:measure_we_vote_id/modal/:modal_to_show" component={Measure} />
                      <Route path="/measure/:measure_we_vote_id/modal/:modal_to_show/:shared_item_code" component={Measure} />
                      <Route path="/more/absentee" component={AbsenteeBallot} />
                      <Route path="/more/alerts" component={ElectionReminder} />
                      <Route path="/more/alerts" component={ElectionReminder} />
                      <Route path="/more/attributions" component={Attributions} />
                      <Route path="/more/attributions" component={Attributions} />
                      <Route path="/more/credits" component={Credits} />
                      <Route path="/more/credits" component={Credits} />
                      <Route path="/more/donate" component={isNotWeVoteMarketingSite ? ReadyRedirect : Donate} />
                      <Route path="/more/donate" component={isNotWeVoteMarketingSite ? ReadyRedirect : Donate} />
                      <Route path="/more/elections" component={Elections} />
                      <Route path="/more/elections" component={Elections} />
                      <Route path="/more/extensionsignin" component={ExtensionSignIn} />
                      <Route path="/more/extensionsignin" component={ExtensionSignIn} />
                      <Route path="/more/facebooklandingprocess" component={FacebookLandingProcess} />
                      <Route path="/more/facebookredirecttowevote" component={FacebookRedirectToWeVote} />
                      <Route path="/more/faq" component={FAQ} />
                      <Route path="/more/jump" component={SignInJumpProcess} />
                      <Route path="/more/myballot" component={WeVoteBallotEmbed} />
                      <Route path="/more/network" component={Friends} />
                      <Route path="/more/network/friends" component={Friends} />
                      <Route path="/more/network/key/:invitation_secret_key" component={FriendInvitationByEmailVerifyProcess} />
                      <Route path="/more/network/key/:invitation_secret_key/ignore" component={FriendInvitationByEmailVerifyProcess} />
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
                      <Route path="/news" component={News} />
                      <Route path="/news/a/" component={News} />
                      <Route path="/news/a/:activity_tidbit_we_vote_id" component={News} />
                      <Route path="/office/:office_we_vote_id" component={Office} />
                      <Route path="/office/:office_we_vote_id/:back_to_variable/:organization_we_vote_id" component={OrganizationVoterGuideOffice} />
                      <Route path="/office/:office_we_vote_id/:organization_we_vote_id" component={OrganizationVoterGuideOffice} />
                      <Route path="/office/:office_we_vote_id/b/:back_to_variable" component={Office} />
                      <Route path="/office/:office_we_vote_id/b/:back_to_variable/" component={Office} />
                      <Route path="/office/:office_we_vote_id/b/:back_to_variable/modal/:modal_to_show" component={Office} />
                      <Route path="/office/:office_we_vote_id/modal/:modal_to_show" component={Office} />
                      <Route path="/office/:office_we_vote_id/modal/:modal_to_show/:shared_item_code" component={Office} />
                      <Route path="/opinions" component={Opinions2020} />
                      <Route path="/opinions/f/:selectedFilter" component={Opinions2020} />
                      <Route path="/opinions/s/:searchTextDefault" component={Opinions2020} />
                      <Route path="/opinions_followed" component={OpinionsFollowed} />
                      <Route path="/opinions_ignored" component={OpinionsIgnored} />
                      {/* <Route exact path="/ready"><Redirect to="/" /></Route> */}
                      <Route exact path="/ready"><Ready /></Route>
                      <Route path="/ready/election/:google_civic_election_id" component={Ready} />
                      <Route path="/ready/modal/:modal_to_show" render={(props) => (<RouterV5SendMatch componentName="Ready" {...props} />)} />
                      <Route path="/ready/modal/:modal_to_show/:shared_item_code" render={(props) => (<RouterV5SendMatch componentName="Ready" {...props} />)} />
                      <Route path="/register" component={Register} />
                      <Route path="/settings/:edit_mode" render={(props) => (<RouterV5SendMatch componentName="SettingsDashboard" {...props} />)} />
                      <Route path="/settings/:edit_mode/:voter_guide_we_vote_id" render={(props) => (<RouterV5SendMatch componentName="SettingsDashboard" {...props} />)} />
                      <Route path="/settings/issues/:edit_mode" render={(props) => (<RouterV5SendMatch componentName="SettingsDashboard" {...props} />)} />
                      <Route path="/sign_in_email/:email_secret_key" component={SignInEmailProcess} />
                      <Route path="/twittersigninprocess/:sign_in_step" component={TwitterSignInProcess} />
                      <Route path="/value/:value_slug" component={VoterGuidesUnderOneValue} />
                      <Route path="/values" component={Values} />
                      <Route path="/values/list" component={ValuesList} />
                      <Route path="/verify_email/:email_secret_key" component={VerifyEmailProcess} />
                      <Route path="/verifythisisme/:twitter_handle" component={VerifyThisIsMe} />
                      <Route path="/vg/:voter_guide_we_vote_id/settings" component={VoterGuideSettingsDashboard} />
                      <Route path="/vg/:voter_guide_we_vote_id/settings/menu" component={VoterGuideSettingsMenuMobile} />
                      <Route path="/vg/:voter_guide_we_vote_id/settings/positions" component={VoterGuideSettingsDashboard} />
                      <Route path="/voterguide/:organization_we_vote_id" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/:action_variable" component={OrganizationVoterGuide} />
                      <Route path="/voterguide/:organization_we_vote_id/ballot" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/ballot/:ballot_location_shortcut" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/ballot/election/:google_civic_election_id" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/ballot/election/:google_civic_election_id/ballot" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/ballot/election/:google_civic_election_id/followers" component={(props) => <OrganizationVoterGuide {...props} activeRoute="followers" />} />
                      <Route path="/voterguide/:organization_we_vote_id/ballot/election/:google_civic_election_id/following" component={(props) => <OrganizationVoterGuide {...props} activeRoute="following" />} />
                      <Route path="/voterguide/:organization_we_vote_id/ballot/election/:google_civic_election_id/m/followers" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
                      <Route path="/voterguide/:organization_we_vote_id/ballot/election/:google_civic_election_id/m/following" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
                      <Route path="/voterguide/:organization_we_vote_id/ballot/election/:google_civic_election_id/m/friends" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />} />
                      <Route path="/voterguide/:organization_we_vote_id/ballot/election/:google_civic_election_id/positions" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/ballot/election/:google_civic_election_id/positions/modal/:modal_to_show" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/ballot/election/:google_civic_election_id/positions/modal/:modal_to_show/:shared_item_code" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/ballot/empty" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/ballot/id/:ballot_returned_we_vote_id" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable" component={OrganizationVoterGuide} />
                      <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/:action_variable" component={OrganizationVoterGuide} />
                      <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/:action_variable/m/followers" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/:action_variable/m/following" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/:action_variable/m/friends" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/followers" component={(props) => <OrganizationVoterGuide {...props} activeRoute="followers" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/following" component={(props) => <OrganizationVoterGuide {...props} activeRoute="following" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/m/followers" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/m/following" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/m/friends" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/modal/:modal_to_show" component={OrganizationVoterGuide} />
                      <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/modal/:modal_to_show/:shared_item_code" component={OrganizationVoterGuide} />
                      <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/positions" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/positions/modal/:modal_to_show" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/positions/modal/:modal_to_show/:shared_item_code" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable" component={OrganizationVoterGuide} />
                      <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/:action_variable" component={OrganizationVoterGuide} />
                      <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/:action_variable/m/followers" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/:action_variable/m/following" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/:action_variable/m/friends" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/followers" component={(props) => <OrganizationVoterGuide {...props} activeRoute="followers" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/following" component={(props) => <OrganizationVoterGuide {...props} activeRoute="following" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/m/followers" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/m/following" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/m/friends" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/modal/:modal_to_show" component={OrganizationVoterGuide} />
                      <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/modal/:modal_to_show/:shared_item_code" component={OrganizationVoterGuide} />
                      <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/positions" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/positions/modal/:modal_to_show" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/positions/modal/:modal_to_show/:shared_item_code" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/followers" component={(props) => <OrganizationVoterGuide {...props} activeRoute="followers" />} />
                      <Route path="/voterguide/:organization_we_vote_id/following" component={(props) => <OrganizationVoterGuide {...props} activeRoute="following" />} />
                      <Route path="/voterguide/:organization_we_vote_id/m/followers" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
                      <Route path="/voterguide/:organization_we_vote_id/m/following" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
                      <Route path="/voterguide/:organization_we_vote_id/m/friends" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />} />
                      <Route path="/voterguide/:organization_we_vote_id/modal/:modal_to_show" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/modal/:modal_to_show/:shared_item_code" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/positions" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/positions/modal/:modal_to_show" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/positions/modal/:modal_to_show/:shared_item_code" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguideedit/:organization_we_vote_id" render={(props) => (<RouterV5SendMatch componentName="OrganizationVoterGuideEdit" {...props} />)} />
                      <Route path="/voterguideedit/:organization_we_vote_id/:google_civic_election_id" render={(props) => (<RouterV5SendMatch componentName="OrganizationVoterGuideEdit" {...props} />)} />
                      <Route path="/welcome" component={isNotWeVoteMarketingSite ? ReadyRedirect : (props) => <WelcomeForVoters {...props} pathname="/welcome" />} />
                      <Route path="/wevoteintro/network" component={IntroNetwork} />
                      <Route path="/wevoteintro/newfriend/:invitationSecretKey" component={FriendInvitationOnboarding} />
                      <Route path="/yourpage" component={YourPage} />
                      <Route path="/:twitter_handle/:action_variable" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/ballot/:ballot_location_shortcut" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/ballot/election/:google_civic_election_id" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/ballot/election/:google_civic_election_id/:view_mode" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/ballot/empty" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/ballot/id/:ballot_returned_we_vote_id" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/ballot/id/:ballot_returned_we_vote_id/:view_mode" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/:action_variable" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/:action_variable/m/followers" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/:action_variable/m/following" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/:action_variable/m/friends" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/followers" component={(props) => <TwitterHandleLanding {...props} activeRoute="followers" />} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/following" component={(props) => <TwitterHandleLanding {...props} activeRoute="following" />} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/m/followers" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/m/following" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/m/friends" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/modal/:modal_to_show" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/modal/:modal_to_show/:shared_item_code" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/modal/:modal_to_show/:shared_item_code" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/positions" component={(props) => <TwitterHandleLanding {...props} activeRoute="positions" />} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/positions/modal/:modal_to_show" component={(props) => <TwitterHandleLanding {...props} activeRoute="positions" />} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/positions/modal/:modal_to_show/:shared_item_code" component={(props) => <TwitterHandleLanding {...props} activeRoute="positions" />} />
                      <Route path="/:twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/:action_variable" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/:action_variable/m/followers" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
                      <Route path="/:twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/:action_variable/m/following" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
                      <Route path="/:twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/:action_variable/m/friends" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />} />
                      <Route path="/:twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/followers" component={(props) => <TwitterHandleLanding {...props} activeRoute="followers" />} />
                      <Route path="/:twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/following" component={(props) => <TwitterHandleLanding {...props} activeRoute="following" />} />
                      <Route path="/:twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/m/followers" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
                      <Route path="/:twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/m/following" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
                      <Route path="/:twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/m/friends" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />} />
                      <Route path="/:twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/modal/:modal_to_show" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/modal/:modal_to_show/:shared_item_code" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/positions" component={(props) => <TwitterHandleLanding {...props} activeRoute="positions" />} />
                      <Route path="/:twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/positions/modal/:modal_to_show" component={(props) => <TwitterHandleLanding {...props} activeRoute="positions" />} />
                      <Route path="/:twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/positions/modal/:modal_to_show/:shared_item_code" component={(props) => <TwitterHandleLanding {...props} activeRoute="positions" />} />
                      <Route path="/:twitter_handle/followers" component={(props) => <TwitterHandleLanding {...props} activeRoute="followers" />} />
                      <Route path="/:twitter_handle/following" component={(props) => <TwitterHandleLanding {...props} activeRoute="following" />} />
                      <Route path="/:twitter_handle/m/followers" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
                      <Route path="/:twitter_handle/m/following" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
                      <Route path="/:twitter_handle/m/friends" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />}  />
                      <Route path="/:twitter_handle/modal/:modal_to_show" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/modal/:modal_to_show/:shared_item_code" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/positions" component={(props) => <TwitterHandleLanding {...props} activeRoute="positions" />} />
                      <Route path="/:twitter_handle/positions/modal/:modal_to_show" component={(props) => <TwitterHandleLanding {...props} activeRoute="positions" />} />
                      <Route path="/:twitter_handle/positions/modal/:modal_to_show/:shared_item_code" component={(props) => <TwitterHandleLanding {...props} activeRoute="positions" />} />
                      <Route path="/:twitter_handle($)?" component={TwitterHandleLanding} />
                      <Route path="*" component={PageNotFound} />
                    </Switch>
                  </Suspense>
                  {showFooterBar && (
                    <div className={isWebApp() ? 'footroom-wrapper' : 'footroom-wrapper-cordova'}>
                      <Suspense fallback={<></>}>
                        <FooterBar />
                      </Suspense>
                    </div>
                  )}
                </WeVoteBody>
              </WeVoteRouter>
            </StylesProvider>
          </ThemeProvider>
        </MuiThemeProvider>
      </ErrorBoundary>
    );
  }
}

const WeVoteBody = styled.div`
  background-color: rgb(235, 236, 238);
  color: #333;
  display: block;
  font-family: "Nunito Sans", "Helvetica Neue Light", "Helvetica Neue", "Helvetica", "Arial", sans-serif;
  line-height: 1.4;
  margin: 0 auto;
  // max-width: 960px;
  height: 100vw;
  position: relative;
  z-index: 0;
`;

export default App;
import { MuiThemeProvider, StylesProvider } from '@material-ui/core/styles';
import React, { Component, Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import LoadingWheelComp from './js/components/LoadingWheelComp';
import Header from './js/components/Navigation/Header';
import HeaderBarSuspense from './js/components/Navigation/HeaderBarSuspense';
import ErrorBoundary from './js/components/Widgets/ErrorBoundary';
import WeVoteRouter from './js/components/Widgets/WeVoteRouter';
import muiTheme from './js/mui-theme';
import AppObservableStore from './js/stores/AppObservableStore';
import styledTheme from './js/styled-theme';
import { getApplicationViewBooleans } from './js/utils/applicationUtils';
import { isWebApp } from './js/utils/cordovaUtils';
import initializejQuery from './js/utils/initializejQuery';
import { renderLog } from './js/utils/logging';
import RouterV5SendMatch from './js/utils/RouterV5SendMatch';

// Root URL pages

import About from './js/routes/More/About';
import AbsenteeBallot from './js/routes/More/AbsenteeBallot';
import AddCandidateForExtension from './js/routes/Ballot/AddCandidateForExtension';
import AppleSignInProcess from './js/routes/Process/AppleSignInProcess';
import Attributions from './js/routes/More/Attributions';
import Ballot from './js/routes/Ballot/Ballot';
import Candidate from './js/routes/Ballot/Candidate';
import CandidateForExtension from './js/routes/Ballot/CandidateForExtension';
import ClaimYourPage from './js/routes/Settings/ClaimYourPage';
import Credits from './js/routes/More/Credits';
import Donate from './js/routes/More/Donate';
import ElectionReminder from './js/routes/More/ElectionReminder';
import Elections from './js/routes/More/Elections';
import ExtensionSignIn from './js/routes/More/ExtensionSignIn';
import FAQ from './js/routes/More/FAQ';
import FacebookInvitableFriends from './js/routes/FacebookInvitableFriends';
import FacebookLandingProcess from './js/routes/Process/FacebookLandingProcess';
import FacebookRedirectToWeVote from './js/routes/More/FacebookRedirectToWeVote';
import FooterBar from './js/components/Navigation/FooterBar.jsx';
import FriendInvitationByEmailVerifyProcess from './js/routes/Process/FriendInvitationByEmailVerifyProcess';
import FriendInvitationOnboarding from './js/routes/Intro/FriendInvitationOnboarding';
import Friends from './js/routes/Friends/Friends';
import GetStarted from './js/routes/Intro/GetStarted';
import HamburgerMenu from './js/routes/Settings/HamburgerMenu';
import HowItWorks from './js/routes/HowItWorks';
import Intro from './js/routes/Intro/Intro';
import IntroNetwork from './js/routes/Intro/IntroNetwork';
import Location from './js/routes/Settings/Location';
import Measure from './js/routes/Ballot/Measure';
import News from './js/routes/Activity/News';
import Office from './js/routes/Ballot/Office';
import Opinions2020 from './js/routes/Opinions2020';
import OpinionsFollowed from './js/routes/OpinionsFollowed';
import OpinionsIgnored from './js/routes/OpinionsIgnored';
import OrganizationVoterGuide from './js/routes/VoterGuide/OrganizationVoterGuide';
import OrganizationVoterGuideCandidate from './js/routes/VoterGuide/OrganizationVoterGuideCandidate';
import OrganizationVoterGuideMeasure from './js/routes/VoterGuide/OrganizationVoterGuideMeasure';
import OrganizationVoterGuideMobileDetails from './js/routes/VoterGuide/OrganizationVoterGuideMobileDetails';
import OrganizationVoterGuideOffice from './js/routes/VoterGuide/OrganizationVoterGuideOffice';
import PageNotFound from './js/routes/PageNotFound';
import Pricing from './js/routes/More/Pricing';
import Privacy from './js/routes/More/Privacy';
import ProcessingDonation from './js/routes/More/ProcessingDonation';
import Ready from './js/routes/Ready';
import ReadyLight from './js/routes/ReadyLight';
import ReadyRedirect from './js/routes/ReadyRedirect';
import Register from './js/routes/Register';
import RegisterToVote from './js/routes/More/RegisterToVote';
import SampleBallot from './js/routes/Intro/SampleBallot';
import SearchPage from './js/routes/More/SearchPage';
import SettingsDashboard from './js/routes/Settings/SettingsDashboard';
import SettingsMenuMobile from './js/routes/Settings/SettingsMenuMobile';
import SharedItemLanding from './js/routes/SharedItemLanding';
import SignInEmailProcess from './js/routes/Process/SignInEmailProcess';
import SignInJumpProcess from './js/routes/Process/SignInJumpProcess';
import TermsOfService from './js/routes/More/TermsOfService';
import TwitterHandleLanding from './js/routes/TwitterHandleLanding';
import TwitterSignInProcess from './js/routes/Process/TwitterSignInProcess';
import Values from './js/routes/Values';
import ValuesList from './js/routes/Values/ValuesList';
import VerifyEmailProcess from './js/routes/Process/VerifyEmailProcess';
import VerifyRegistration from './js/routes/More/VerifyRegistration';
import VerifyThisIsMe from './js/routes/VoterGuide/VerifyThisIsMe';
import Vote from './js/routes/Vote';
import VoterGuideListDashboard from './js/routes/Settings/VoterGuideListDashboard';
import VoterGuideSettingsDashboard from './js/routes/Settings/VoterGuideSettingsDashboard';
import VoterGuideSettingsMenuMobile from './js/routes/Settings/VoterGuideSettingsMenuMobile';
import VoterGuidesMenuMobile from './js/routes/Settings/VoterGuidesMenuMobile';
import VoterGuidesUnderOneValue from './js/routes/Values/VoterGuidesUnderOneValue';
import WeVoteBallotEmbed from './js/routes/More/WeVoteBallotEmbed';
import WelcomeForCampaigns from './js/routes/WelcomeForCampaigns';
import WelcomeForOrganizations from './js/routes/WelcomeForOrganizations';
import WelcomeForVoters from './js/routes/WelcomeForVoters';
import YourPage from './js/routes/YourPage';

// There are just too many "prop spreadings" in the use of Route, if someone can figure out an alternative...
/* eslint-disable react/jsx-props-no-spreading */

class AppCordova extends Component {
  constructor (props) {
    super(props);
    this.state = {
      // doShowHeader: true,
      // doShowFooter: true,
      showReadyLight: true,
    };
    // this.setShowHeader = this.setShowHeader.bind(this);
    // this.setShowFooter = this.setShowFooter.bind(this);
    // this.setShowHeaderFooter = this.setShowHeaderFooter.bind(this);
    this.setShowReadyHeavy = this.setShowReadyHeavy.bind(this);
    this.localIsCordova();
  }

  // See https://reactjs.org/docs/error-boundaries.html
  static getDerivedStateFromError (error) { // eslint-disable-line no-unused-vars
    // Update state so the next render will show the fallback UI, We should have a "Oh snap" page
    console.log('App caught error ', error);
    return { hasError: true };
  }

  componentDidMount () {
    initializejQuery(() => {
      let { hostname } = window.location;
      hostname = hostname || '';
      AppObservableStore.siteConfigurationRetrieve(hostname);
    });
    console.log('href in App.js componentDidMount: ', window.location.href);
  }

  componentDidCatch (error, info) {
    // We should get this information to Splunk!
    console.error('App caught error: ', `${error} with info: `, info);
  }

  // setShowHeader (doShowHeader) {
  //   console.log('-----------HEADER setShowHeader');
  //   this.setState({ doShowHeader });
  // }

  // setShowFooter (doShowFooter) {
  //   console.log('-----------HEADER setShowFooter');
  //   this.setState({ doShowFooter });
  // }

  // setShowHeaderFooter (doShow) {
  //   console.log('-----------HEADER setShowHeaderFooter', doShow);
  //   // console.log('setShowHeaderFooter -------------- doShow:', doShow);
  //   this.setState({
  //     doShowHeader: doShow,
  //     doShowFooter: doShow,
  //   });
  // }

  setShowReadyHeavy () {
    this.setState({ showReadyLight: false });
  }

  // From index.js (4/20/21)
  localIsCordova () {
    const { cordova } = window;
    window.isCordovaGlobal = cordova !== undefined;    // So now we set a global
    return cordova !== undefined;
  }

  render () {
    renderLog('App');
    const { /* doShowHeader, doShowFooter, */ showReadyLight } = this.state;
    // console.log(`App doShowHeader: ${doShowHeader}, doShowFooter:${doShowFooter}`);
    let { hostname } = window.location;
    hostname = hostname || '';
    const weVoteSites = ['wevote.us', 'quality.wevote.us', 'localhost', 'silicon', ''];   // localhost on Cordova is a ''
    const isWeVoteMarketingSite = weVoteSites.includes(String(hostname));
    const isNotWeVoteMarketingSite = !isWeVoteMarketingSite;
    const siteVars = getApplicationViewBooleans(hostname);
    const { showFooterBar } = siteVars;
    // const firstVisit = !cookies.getItem('voter_device_id');

    console.log('href in App.js render: ', window.location.href);

    /*
    Note: To debug routing, set a breakpoint in the class that routing takes you to -- then look at the received props.
    The props.match.path shows exactly which route string from this file, was selected by the <Switch>
    */

    return (
      <ErrorBoundary>
        <MuiThemeProvider theme={muiTheme}>
          <ThemeProvider theme={styledTheme}>
            <StylesProvider injectFirst>
              <WeVoteRouter>
                <WeVoteBody>
                  {/* DO NOT put SnackNotifier or anything else that is non-essential here (to keep it out of the main chuck. */}
                  <Suspense fallback={<HeaderBarSuspense />}>
                    <Header params={{ }} pathname={window.location.href} />
                  </Suspense>
                  <Suspense fallback={<LoadingWheelComp />}>
                    <Switch>
                      <Route exact path="/about"><About /></Route>
                      <Route exact path="/ballot" component={Ballot} />
                      <Route exact path="/friends" component={Friends} />
                      <Route exact path="/friends/:tabItem" component={Friends} />
                      <Route exact path="/">
                        {() => {
                          if (showReadyLight) {
                            return <ReadyLight showReadyHeavy={this.setShowReadyHeavy} />;
                          } else {
                            return <Redirect to="/ready" />;
                          }
                        }}
                      </Route>
                      <Route exact path="/ready"><Ready /></Route>
                      {/* <Route exact path="/ready"><Redirect to="/" /></Route> */}
                      <Route exact path="/settings" component={SettingsDashboard} />
                      <Route exact path="/settings/claim" component={ClaimYourPage} />
                      <Route exact path="/settings/hamburger" component={HamburgerMenu} />
                      <Route exact path="/settings/location" component={Location} />
                      <Route exact path="/settings/menu" component={SettingsMenuMobile} />
                      <Route exact path="/settings/voterguidelist" component={VoterGuideListDashboard} />
                      <Route exact path="/settings/voterguidesmenu" component={VoterGuidesMenuMobile} />
                      <Route exact path="/twitter_sign_in"><TwitterSignInProcess /></Route>
                      <Route path="/-/:custom_link_string" component={SharedItemLanding} />
                      <Route path="/-:shared_item_code" component={SharedItemLanding} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable($)?" component={TwitterHandleLanding} />
                      <Route path="/add-candidate-for-extension" component={AddCandidateForExtension} />
                      <Route path="/applesigninprocess" component={AppleSignInProcess} />
                      <Route path="/ballot/:ballot_location_shortcut" component={Ballot} />
                      <Route path="/ballot/:ballot_location_shortcut/modal/:modal_to_show" component={Ballot} />
                      <Route path="/ballot/:ballot_location_shortcut/modal/:modal_to_show/:shared_item_code" component={Ballot} />
                      <Route path="/ballot/election/:google_civic_election_id" component={Ballot} />
                      <Route path="/ballot/election/:google_civic_election_id/modal/:modal_to_show" component={Ballot} />
                      <Route path="/ballot/election/:google_civic_election_id/modal/:modal_to_show/:shared_item_code" component={Ballot} />
                      <Route path="/ballot/id/:ballot_returned_we_vote_id" component={Ballot} />
                      <Route path="/ballot/id/:ballot_returned_we_vote_id/modal/:modal_to_show" component={Ballot} />
                      <Route path="/ballot/id/:ballot_returned_we_vote_id/modal/:modal_to_show/:shared_item_code" component={Ballot} />
                      <Route path="/ballot/modal/:modal_to_show" component={Ballot} />
                      <Route path="/ballot/modal/:modal_to_show/:shared_item_code" component={Ballot} />
                      <Route path="/ballot/vote" component={Vote} />
                      <Route path="/ballot?voter_refresh_timer_on=:voter_refresh_timer_on" component={Ballot} />
                      <Route path="/candidate-for-extension" component={CandidateForExtension} />
                      <Route path="/candidate/:candidate_we_vote_id" component={Candidate} />
                      <Route path="/candidate/:candidate_we_vote_id/:back_to_variable/:organization_we_vote_id" component={OrganizationVoterGuideCandidate} />
                      <Route path="/candidate/:candidate_we_vote_id/:organization_we_vote_id" component={OrganizationVoterGuideCandidate} />
                      <Route path="/candidate/:candidate_we_vote_id/b/:back_to_variable" component={Candidate} />
                      <Route path="/candidate/:candidate_we_vote_id/b/:back_to_variable/" component={Candidate} />
                      <Route path="/candidate/:candidate_we_vote_id/b/:back_to_variable/modal/:modal_to_show" component={Candidate} />
                      <Route path="/candidate/:candidate_we_vote_id/b/:back_to_variable/modal/:modal_to_show/:shared_item_code" component={Candidate} />
                      <Route path="/candidate/:candidate_we_vote_id/modal/:modal_to_show" component={Candidate} />
                      <Route path="/candidate/:candidate_we_vote_id/modal/:modal_to_show/:shared_item_code" component={Candidate} />
                      <Route path="/facebook_invitable_friends" component={FacebookInvitableFriends} />
                      <Route path="/for-campaigns" component={isNotWeVoteMarketingSite ? ReadyRedirect : (props) => <WelcomeForCampaigns {...props} pathname="/for-campaigns" />} />
                      <Route path="/for-organizations" component={isNotWeVoteMarketingSite ? ReadyRedirect : (props) => <WelcomeForOrganizations {...props} pathname="/for-organizations" />} />
                      <Route path="/how" component={isNotWeVoteMarketingSite ? ReadyRedirect : HowItWorks} />
                      <Route path="/how/:category_string" component={isNotWeVoteMarketingSite ? ReadyRedirect : HowItWorks} />
                      <Route path="/intro" component={Intro} />
                      <Route path="/intro/get_started" component={GetStarted} />
                      <Route path="/intro/sample_ballot" component={SampleBallot} />
                      <Route path="/measure/:measure_we_vote_id" component={Measure} />
                      <Route path="/measure/:measure_we_vote_id/:back_to_variable/:organization_we_vote_id" component={OrganizationVoterGuideMeasure} />
                      <Route path="/measure/:measure_we_vote_id/b/:back_to_variable" component={Measure} />
                      <Route path="/measure/:measure_we_vote_id/b/:back_to_variable/" component={Measure} />
                      <Route path="/measure/:measure_we_vote_id/b/:back_to_variable/modal/:modal_to_show" component={Measure} />
                      <Route path="/measure/:measure_we_vote_id/b/:back_to_variable/modal/:modal_to_show/:shared_item_code" component={Measure} />
                      <Route path="/measure/:measure_we_vote_id/modal/:modal_to_show" component={Measure} />
                      <Route path="/measure/:measure_we_vote_id/modal/:modal_to_show/:shared_item_code" component={Measure} />
                      <Route path="/more/absentee" component={AbsenteeBallot} />
                      <Route path="/more/alerts" component={ElectionReminder} />
                      <Route path="/more/alerts" component={ElectionReminder} />
                      <Route path="/more/attributions" component={Attributions} />
                      <Route path="/more/attributions" component={Attributions} />
                      <Route path="/more/credits" component={Credits} />
                      <Route path="/more/credits" component={Credits} />
                      <Route path="/more/donate" component={isNotWeVoteMarketingSite ? ReadyRedirect : Donate} />
                      <Route path="/more/donate" component={isNotWeVoteMarketingSite ? ReadyRedirect : Donate} />
                      <Route path="/more/elections" component={Elections} />
                      <Route path="/more/elections" component={Elections} />
                      <Route path="/more/extensionsignin" component={ExtensionSignIn} />
                      <Route path="/more/extensionsignin" component={ExtensionSignIn} />
                      <Route path="/more/facebooklandingprocess" component={FacebookLandingProcess} />
                      <Route path="/more/facebookredirecttowevote" component={FacebookRedirectToWeVote} />
                      <Route path="/more/faq" component={FAQ} />
                      <Route path="/more/jump" component={SignInJumpProcess} />
                      <Route path="/more/myballot" component={WeVoteBallotEmbed} />
                      <Route path="/more/network" component={Friends} />
                      <Route path="/more/network/friends" component={Friends} />
                      <Route path="/more/network/key/:invitation_secret_key" component={FriendInvitationByEmailVerifyProcess} />
                      <Route path="/more/network/key/:invitation_secret_key/ignore" component={FriendInvitationByEmailVerifyProcess} />
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
                      <Route path="/news" component={News} />
                      <Route path="/news/a/" component={News} />
                      <Route path="/news/a/:activity_tidbit_we_vote_id" component={News} />
                      <Route path="/office/:office_we_vote_id" component={Office} />
                      <Route path="/office/:office_we_vote_id/:back_to_variable/:organization_we_vote_id" component={OrganizationVoterGuideOffice} />
                      <Route path="/office/:office_we_vote_id/:organization_we_vote_id" component={OrganizationVoterGuideOffice} />
                      <Route path="/office/:office_we_vote_id/b/:back_to_variable" component={Office} />
                      <Route path="/office/:office_we_vote_id/b/:back_to_variable/" component={Office} />
                      <Route path="/office/:office_we_vote_id/b/:back_to_variable/modal/:modal_to_show" component={Office} />
                      <Route path="/office/:office_we_vote_id/modal/:modal_to_show" component={Office} />
                      <Route path="/office/:office_we_vote_id/modal/:modal_to_show/:shared_item_code" component={Office} />
                      <Route path="/opinions" component={Opinions2020} />
                      <Route path="/opinions/f/:selectedFilter" component={Opinions2020} />
                      <Route path="/opinions/s/:searchTextDefault" component={Opinions2020} />
                      <Route path="/opinions_followed" component={OpinionsFollowed} />
                      <Route path="/opinions_ignored" component={OpinionsIgnored} />
                      {/* <Route exact path="/ready"><Redirect to="/" /></Route> */}
                      <Route exact path="/ready"><Ready /></Route>
                      <Route path="/ready/election/:google_civic_election_id" component={Ready} />
                      <Route path="/ready/modal/:modal_to_show" render={(props) => (<RouterV5SendMatch componentName="Ready" {...props} />)} />
                      <Route path="/ready/modal/:modal_to_show/:shared_item_code" render={(props) => (<RouterV5SendMatch componentName="Ready" {...props} />)} />
                      <Route path="/register" component={Register} />
                      <Route path="/settings/:edit_mode" render={(props) => (<RouterV5SendMatch componentName="SettingsDashboard" {...props} />)} />
                      <Route path="/settings/:edit_mode/:voter_guide_we_vote_id" render={(props) => (<RouterV5SendMatch componentName="SettingsDashboard" {...props} />)} />
                      <Route path="/settings/issues/:edit_mode" render={(props) => (<RouterV5SendMatch componentName="SettingsDashboard" {...props} />)} />
                      <Route path="/sign_in_email/:email_secret_key" component={SignInEmailProcess} />
                      <Route path="/twittersigninprocess/:sign_in_step" component={TwitterSignInProcess} />
                      <Route path="/value/:value_slug" component={VoterGuidesUnderOneValue} />
                      <Route path="/values" component={Values} />
                      <Route path="/values/list" component={ValuesList} />
                      <Route path="/verify_email/:email_secret_key" component={VerifyEmailProcess} />
                      <Route path="/verifythisisme/:twitter_handle" component={VerifyThisIsMe} />
                      <Route path="/vg/:voter_guide_we_vote_id/settings" component={VoterGuideSettingsDashboard} />
                      <Route path="/vg/:voter_guide_we_vote_id/settings/menu" component={VoterGuideSettingsMenuMobile} />
                      <Route path="/vg/:voter_guide_we_vote_id/settings/positions" component={VoterGuideSettingsDashboard} />
                      <Route path="/voterguide/:organization_we_vote_id" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/:action_variable" component={OrganizationVoterGuide} />
                      <Route path="/voterguide/:organization_we_vote_id/ballot" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/ballot/:ballot_location_shortcut" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/ballot/election/:google_civic_election_id" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/ballot/election/:google_civic_election_id/ballot" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/ballot/election/:google_civic_election_id/followers" component={(props) => <OrganizationVoterGuide {...props} activeRoute="followers" />} />
                      <Route path="/voterguide/:organization_we_vote_id/ballot/election/:google_civic_election_id/following" component={(props) => <OrganizationVoterGuide {...props} activeRoute="following" />} />
                      <Route path="/voterguide/:organization_we_vote_id/ballot/election/:google_civic_election_id/m/followers" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
                      <Route path="/voterguide/:organization_we_vote_id/ballot/election/:google_civic_election_id/m/following" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
                      <Route path="/voterguide/:organization_we_vote_id/ballot/election/:google_civic_election_id/m/friends" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />} />
                      <Route path="/voterguide/:organization_we_vote_id/ballot/election/:google_civic_election_id/positions" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/ballot/election/:google_civic_election_id/positions/modal/:modal_to_show" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/ballot/election/:google_civic_election_id/positions/modal/:modal_to_show/:shared_item_code" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/ballot/empty" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/ballot/id/:ballot_returned_we_vote_id" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable" component={OrganizationVoterGuide} />
                      <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/:action_variable" component={OrganizationVoterGuide} />
                      <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/:action_variable/m/followers" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/:action_variable/m/following" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/:action_variable/m/friends" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/followers" component={(props) => <OrganizationVoterGuide {...props} activeRoute="followers" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/following" component={(props) => <OrganizationVoterGuide {...props} activeRoute="following" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/m/followers" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/m/following" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/m/friends" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/modal/:modal_to_show" component={OrganizationVoterGuide} />
                      <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/modal/:modal_to_show/:shared_item_code" component={OrganizationVoterGuide} />
                      <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/positions" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/positions/modal/:modal_to_show" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/positions/modal/:modal_to_show/:shared_item_code" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable" component={OrganizationVoterGuide} />
                      <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/:action_variable" component={OrganizationVoterGuide} />
                      <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/:action_variable/m/followers" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/:action_variable/m/following" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/:action_variable/m/friends" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/followers" component={(props) => <OrganizationVoterGuide {...props} activeRoute="followers" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/following" component={(props) => <OrganizationVoterGuide {...props} activeRoute="following" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/m/followers" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/m/following" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/m/friends" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/modal/:modal_to_show" component={OrganizationVoterGuide} />
                      <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/modal/:modal_to_show/:shared_item_code" component={OrganizationVoterGuide} />
                      <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/positions" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/positions/modal/:modal_to_show" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/positions/modal/:modal_to_show/:shared_item_code" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/followers" component={(props) => <OrganizationVoterGuide {...props} activeRoute="followers" />} />
                      <Route path="/voterguide/:organization_we_vote_id/following" component={(props) => <OrganizationVoterGuide {...props} activeRoute="following" />} />
                      <Route path="/voterguide/:organization_we_vote_id/m/followers" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
                      <Route path="/voterguide/:organization_we_vote_id/m/following" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
                      <Route path="/voterguide/:organization_we_vote_id/m/friends" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />} />
                      <Route path="/voterguide/:organization_we_vote_id/modal/:modal_to_show" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/modal/:modal_to_show/:shared_item_code" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/positions" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/positions/modal/:modal_to_show" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/positions/modal/:modal_to_show/:shared_item_code" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguideedit/:organization_we_vote_id" render={(props) => (<RouterV5SendMatch componentName="OrganizationVoterGuideEdit" {...props} />)} />
                      <Route path="/voterguideedit/:organization_we_vote_id/:google_civic_election_id" render={(props) => (<RouterV5SendMatch componentName="OrganizationVoterGuideEdit" {...props} />)} />
                      <Route path="/welcome" component={isNotWeVoteMarketingSite ? ReadyRedirect : (props) => <WelcomeForVoters {...props} pathname="/welcome" />} />
                      <Route path="/wevoteintro/network" component={IntroNetwork} />
                      <Route path="/wevoteintro/newfriend/:invitationSecretKey" component={FriendInvitationOnboarding} />
                      <Route path="/yourpage" component={YourPage} />
                      <Route path="/:twitter_handle/:action_variable" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/ballot/:ballot_location_shortcut" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/ballot/election/:google_civic_election_id" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/ballot/election/:google_civic_election_id/:view_mode" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/ballot/empty" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/ballot/id/:ballot_returned_we_vote_id" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/ballot/id/:ballot_returned_we_vote_id/:view_mode" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/:action_variable" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/:action_variable/m/followers" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/:action_variable/m/following" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/:action_variable/m/friends" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/followers" component={(props) => <TwitterHandleLanding {...props} activeRoute="followers" />} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/following" component={(props) => <TwitterHandleLanding {...props} activeRoute="following" />} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/m/followers" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/m/following" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/m/friends" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/modal/:modal_to_show" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/modal/:modal_to_show/:shared_item_code" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/modal/:modal_to_show/:shared_item_code" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/positions" component={(props) => <TwitterHandleLanding {...props} activeRoute="positions" />} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/positions/modal/:modal_to_show" component={(props) => <TwitterHandleLanding {...props} activeRoute="positions" />} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/positions/modal/:modal_to_show/:shared_item_code" component={(props) => <TwitterHandleLanding {...props} activeRoute="positions" />} />
                      <Route path="/:twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/:action_variable" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/:action_variable/m/followers" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
                      <Route path="/:twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/:action_variable/m/following" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
                      <Route path="/:twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/:action_variable/m/friends" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />} />
                      <Route path="/:twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/followers" component={(props) => <TwitterHandleLanding {...props} activeRoute="followers" />} />
                      <Route path="/:twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/following" component={(props) => <TwitterHandleLanding {...props} activeRoute="following" />} />
                      <Route path="/:twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/m/followers" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
                      <Route path="/:twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/m/following" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
                      <Route path="/:twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/m/friends" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />} />
                      <Route path="/:twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/modal/:modal_to_show" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/modal/:modal_to_show/:shared_item_code" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/positions" component={(props) => <TwitterHandleLanding {...props} activeRoute="positions" />} />
                      <Route path="/:twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/positions/modal/:modal_to_show" component={(props) => <TwitterHandleLanding {...props} activeRoute="positions" />} />
                      <Route path="/:twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/positions/modal/:modal_to_show/:shared_item_code" component={(props) => <TwitterHandleLanding {...props} activeRoute="positions" />} />
                      <Route path="/:twitter_handle/followers" component={(props) => <TwitterHandleLanding {...props} activeRoute="followers" />} />
                      <Route path="/:twitter_handle/following" component={(props) => <TwitterHandleLanding {...props} activeRoute="following" />} />
                      <Route path="/:twitter_handle/m/followers" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
                      <Route path="/:twitter_handle/m/following" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
                      <Route path="/:twitter_handle/m/friends" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />}  />
                      <Route path="/:twitter_handle/modal/:modal_to_show" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/modal/:modal_to_show/:shared_item_code" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/positions" component={(props) => <TwitterHandleLanding {...props} activeRoute="positions" />} />
                      <Route path="/:twitter_handle/positions/modal/:modal_to_show" component={(props) => <TwitterHandleLanding {...props} activeRoute="positions" />} />
                      <Route path="/:twitter_handle/positions/modal/:modal_to_show/:shared_item_code" component={(props) => <TwitterHandleLanding {...props} activeRoute="positions" />} />
                      <Route path="/:twitter_handle($)?" component={TwitterHandleLanding} />
                      <Route path="*" component={PageNotFound} />
                    </Switch>
                  </Suspense>
                  {showFooterBar && (
                    <div className={isWebApp() ? 'footroom-wrapper' : 'footroom-wrapper-cordova'}>
                      <Suspense fallback={<></>}>
                        <FooterBar />
                      </Suspense>
                    </div>
                  )}
                </WeVoteBody>
              </WeVoteRouter>
            </StylesProvider>
          </ThemeProvider>
        </MuiThemeProvider>
      </ErrorBoundary>
    );
  }
}

const WeVoteBody = styled.div`
  background-color: rgb(235, 236, 238);
  color: #333;
  display: block;
  font-family: "Nunito Sans", "Helvetica Neue Light", "Helvetica Neue", "Helvetica", "Arial", sans-serif;
  line-height: 1.4;
  margin: 0 auto;
  // max-width: 960px;
  height: 100vw;
  position: relative;
  z-index: 0;
`;

export default App;
import { MuiThemeProvider, StylesProvider } from '@material-ui/core/styles';
import React, { Component, Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import LoadingWheelComp from './js/components/LoadingWheelComp';
import Header from './js/components/Navigation/Header';
import HeaderBarSuspense from './js/components/Navigation/HeaderBarSuspense';
import ErrorBoundary from './js/components/Widgets/ErrorBoundary';
import WeVoteRouter from './js/components/Widgets/WeVoteRouter';
import muiTheme from './js/mui-theme';
import AppObservableStore from './js/stores/AppObservableStore';
import styledTheme from './js/styled-theme';
import { getApplicationViewBooleans } from './js/utils/applicationUtils';
import { isWebApp } from './js/utils/cordovaUtils';
import initializejQuery from './js/utils/initializejQuery';
import { renderLog } from './js/utils/logging';
import RouterV5SendMatch from './js/utils/RouterV5SendMatch';

// Root URL pages

import About from './js/routes/More/About';
import AbsenteeBallot from './js/routes/More/AbsenteeBallot';
import AddCandidateForExtension from './js/routes/Ballot/AddCandidateForExtension';
import AppleSignInProcess from './js/routes/Process/AppleSignInProcess';
import Attributions from './js/routes/More/Attributions';
import Ballot from './js/routes/Ballot/Ballot';
import Candidate from './js/routes/Ballot/Candidate';
import CandidateForExtension from './js/routes/Ballot/CandidateForExtension';
import ClaimYourPage from './js/routes/Settings/ClaimYourPage';
import Credits from './js/routes/More/Credits';
import Donate from './js/routes/More/Donate';
import ElectionReminder from './js/routes/More/ElectionReminder';
import Elections from './js/routes/More/Elections';
import ExtensionSignIn from './js/routes/More/ExtensionSignIn';
import FAQ from './js/routes/More/FAQ';
import FacebookInvitableFriends from './js/routes/FacebookInvitableFriends';
import FacebookLandingProcess from './js/routes/Process/FacebookLandingProcess';
import FacebookRedirectToWeVote from './js/routes/More/FacebookRedirectToWeVote';
import FooterBar from './js/components/Navigation/FooterBar.jsx';
import FriendInvitationByEmailVerifyProcess from './js/routes/Process/FriendInvitationByEmailVerifyProcess';
import FriendInvitationOnboarding from './js/routes/Intro/FriendInvitationOnboarding';
import Friends from './js/routes/Friends/Friends';
import GetStarted from './js/routes/Intro/GetStarted';
import HamburgerMenu from './js/routes/Settings/HamburgerMenu';
import HowItWorks from './js/routes/HowItWorks';
import Intro from './js/routes/Intro/Intro';
import IntroNetwork from './js/routes/Intro/IntroNetwork';
import Location from './js/routes/Settings/Location';
import Measure from './js/routes/Ballot/Measure';
import News from './js/routes/Activity/News';
import Office from './js/routes/Ballot/Office';
import Opinions2020 from './js/routes/Opinions2020';
import OpinionsFollowed from './js/routes/OpinionsFollowed';
import OpinionsIgnored from './js/routes/OpinionsIgnored';
import OrganizationVoterGuide from './js/routes/VoterGuide/OrganizationVoterGuide';
import OrganizationVoterGuideCandidate from './js/routes/VoterGuide/OrganizationVoterGuideCandidate';
import OrganizationVoterGuideMeasure from './js/routes/VoterGuide/OrganizationVoterGuideMeasure';
import OrganizationVoterGuideMobileDetails from './js/routes/VoterGuide/OrganizationVoterGuideMobileDetails';
import OrganizationVoterGuideOffice from './js/routes/VoterGuide/OrganizationVoterGuideOffice';
import PageNotFound from './js/routes/PageNotFound';
import Pricing from './js/routes/More/Pricing';
import Privacy from './js/routes/More/Privacy';
import ProcessingDonation from './js/routes/More/ProcessingDonation';
import Ready from './js/routes/Ready';
import ReadyLight from './js/routes/ReadyLight';
import ReadyRedirect from './js/routes/ReadyRedirect';
import Register from './js/routes/Register';
import RegisterToVote from './js/routes/More/RegisterToVote';
import SampleBallot from './js/routes/Intro/SampleBallot';
import SearchPage from './js/routes/More/SearchPage';
import SettingsDashboard from './js/routes/Settings/SettingsDashboard';
import SettingsMenuMobile from './js/routes/Settings/SettingsMenuMobile';
import SharedItemLanding from './js/routes/SharedItemLanding';
import SignInEmailProcess from './js/routes/Process/SignInEmailProcess';
import SignInJumpProcess from './js/routes/Process/SignInJumpProcess';
import TermsOfService from './js/routes/More/TermsOfService';
import TwitterHandleLanding from './js/routes/TwitterHandleLanding';
import TwitterSignInProcess from './js/routes/Process/TwitterSignInProcess';
import Values from './js/routes/Values';
import ValuesList from './js/routes/Values/ValuesList';
import VerifyEmailProcess from './js/routes/Process/VerifyEmailProcess';
import VerifyRegistration from './js/routes/More/VerifyRegistration';
import VerifyThisIsMe from './js/routes/VoterGuide/VerifyThisIsMe';
import Vote from './js/routes/Vote';
import VoterGuideListDashboard from './js/routes/Settings/VoterGuideListDashboard';
import VoterGuideSettingsDashboard from './js/routes/Settings/VoterGuideSettingsDashboard';
import VoterGuideSettingsMenuMobile from './js/routes/Settings/VoterGuideSettingsMenuMobile';
import VoterGuidesMenuMobile from './js/routes/Settings/VoterGuidesMenuMobile';
import VoterGuidesUnderOneValue from './js/routes/Values/VoterGuidesUnderOneValue';
import WeVoteBallotEmbed from './js/routes/More/WeVoteBallotEmbed';
import WelcomeForCampaigns from './js/routes/WelcomeForCampaigns';
import WelcomeForOrganizations from './js/routes/WelcomeForOrganizations';
import WelcomeForVoters from './js/routes/WelcomeForVoters';
import YourPage from './js/routes/YourPage';

// There are just too many "prop spreadings" in the use of Route, if someone can figure out an alternative...
/* eslint-disable react/jsx-props-no-spreading */

class AppCordova extends Component {
  constructor (props) {
    super(props);
    this.state = {
      // doShowHeader: true,
      // doShowFooter: true,
      showReadyLight: true,
    };
    // this.setShowHeader = this.setShowHeader.bind(this);
    // this.setShowFooter = this.setShowFooter.bind(this);
    // this.setShowHeaderFooter = this.setShowHeaderFooter.bind(this);
    this.setShowReadyHeavy = this.setShowReadyHeavy.bind(this);
    this.localIsCordova();
  }

  // See https://reactjs.org/docs/error-boundaries.html
  static getDerivedStateFromError (error) { // eslint-disable-line no-unused-vars
    // Update state so the next render will show the fallback UI, We should have a "Oh snap" page
    console.log('App caught error ', error);
    return { hasError: true };
  }

  componentDidMount () {
    initializejQuery(() => {
      let { hostname } = window.location;
      hostname = hostname || '';
      AppObservableStore.siteConfigurationRetrieve(hostname);
    });
    console.log('href in App.js componentDidMount: ', window.location.href);
  }

  componentDidCatch (error, info) {
    // We should get this information to Splunk!
    console.error('App caught error: ', `${error} with info: `, info);
  }

  // setShowHeader (doShowHeader) {
  //   console.log('-----------HEADER setShowHeader');
  //   this.setState({ doShowHeader });
  // }

  // setShowFooter (doShowFooter) {
  //   console.log('-----------HEADER setShowFooter');
  //   this.setState({ doShowFooter });
  // }

  // setShowHeaderFooter (doShow) {
  //   console.log('-----------HEADER setShowHeaderFooter', doShow);
  //   // console.log('setShowHeaderFooter -------------- doShow:', doShow);
  //   this.setState({
  //     doShowHeader: doShow,
  //     doShowFooter: doShow,
  //   });
  // }

  setShowReadyHeavy () {
    this.setState({ showReadyLight: false });
  }

  // From index.js (4/20/21)
  localIsCordova () {
    const { cordova } = window;
    window.isCordovaGlobal = cordova !== undefined;    // So now we set a global
    return cordova !== undefined;
  }

  render () {
    renderLog('App');
    const { /* doShowHeader, doShowFooter, */ showReadyLight } = this.state;
    // console.log(`App doShowHeader: ${doShowHeader}, doShowFooter:${doShowFooter}`);
    let { hostname } = window.location;
    hostname = hostname || '';
    const weVoteSites = ['wevote.us', 'quality.wevote.us', 'localhost', 'silicon', ''];   // localhost on Cordova is a ''
    const isWeVoteMarketingSite = weVoteSites.includes(String(hostname));
    const isNotWeVoteMarketingSite = !isWeVoteMarketingSite;
    const siteVars = getApplicationViewBooleans(hostname);
    const { showFooterBar } = siteVars;
    // const firstVisit = !cookies.getItem('voter_device_id');

    console.log('href in App.js render: ', window.location.href);

    /*
    Note: To debug routing, set a breakpoint in the class that routing takes you to -- then look at the received props.
    The props.match.path shows exactly which route string from this file, was selected by the <Switch>
    */

    return (
      <ErrorBoundary>
        <MuiThemeProvider theme={muiTheme}>
          <ThemeProvider theme={styledTheme}>
            <StylesProvider injectFirst>
              <WeVoteRouter>
                <WeVoteBody>
                  {/* DO NOT put SnackNotifier or anything else that is non-essential here (to keep it out of the main chuck. */}
                  <Suspense fallback={<HeaderBarSuspense />}>
                    <Header params={{ }} pathname={window.location.href} />
                  </Suspense>
                  <Suspense fallback={<LoadingWheelComp />}>
                    <Switch>
                      <Route exact path="/about"><About /></Route>
                      <Route exact path="/ballot" component={Ballot} />
                      <Route exact path="/friends" component={Friends} />
                      <Route exact path="/friends/:tabItem" component={Friends} />
                      <Route exact path="/">
                        {() => {
                          if (showReadyLight) {
                            return <ReadyLight showReadyHeavy={this.setShowReadyHeavy} />;
                          } else {
                            return <Redirect to="/ready" />;
                          }
                        }}
                      </Route>
                      <Route exact path="/ready"><Ready /></Route>
                      {/* <Route exact path="/ready"><Redirect to="/" /></Route> */}
                      <Route exact path="/settings" component={SettingsDashboard} />
                      <Route exact path="/settings/claim" component={ClaimYourPage} />
                      <Route exact path="/settings/hamburger" component={HamburgerMenu} />
                      <Route exact path="/settings/location" component={Location} />
                      <Route exact path="/settings/menu" component={SettingsMenuMobile} />
                      <Route exact path="/settings/voterguidelist" component={VoterGuideListDashboard} />
                      <Route exact path="/settings/voterguidesmenu" component={VoterGuidesMenuMobile} />
                      <Route exact path="/twitter_sign_in"><TwitterSignInProcess /></Route>
                      <Route path="/-/:custom_link_string" component={SharedItemLanding} />
                      <Route path="/-:shared_item_code" component={SharedItemLanding} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable($)?" component={TwitterHandleLanding} />
                      <Route path="/add-candidate-for-extension" component={AddCandidateForExtension} />
                      <Route path="/applesigninprocess" component={AppleSignInProcess} />
                      <Route path="/ballot/:ballot_location_shortcut" component={Ballot} />
                      <Route path="/ballot/:ballot_location_shortcut/modal/:modal_to_show" component={Ballot} />
                      <Route path="/ballot/:ballot_location_shortcut/modal/:modal_to_show/:shared_item_code" component={Ballot} />
                      <Route path="/ballot/election/:google_civic_election_id" component={Ballot} />
                      <Route path="/ballot/election/:google_civic_election_id/modal/:modal_to_show" component={Ballot} />
                      <Route path="/ballot/election/:google_civic_election_id/modal/:modal_to_show/:shared_item_code" component={Ballot} />
                      <Route path="/ballot/id/:ballot_returned_we_vote_id" component={Ballot} />
                      <Route path="/ballot/id/:ballot_returned_we_vote_id/modal/:modal_to_show" component={Ballot} />
                      <Route path="/ballot/id/:ballot_returned_we_vote_id/modal/:modal_to_show/:shared_item_code" component={Ballot} />
                      <Route path="/ballot/modal/:modal_to_show" component={Ballot} />
                      <Route path="/ballot/modal/:modal_to_show/:shared_item_code" component={Ballot} />
                      <Route path="/ballot/vote" component={Vote} />
                      <Route path="/ballot?voter_refresh_timer_on=:voter_refresh_timer_on" component={Ballot} />
                      <Route path="/candidate-for-extension" component={CandidateForExtension} />
                      <Route path="/candidate/:candidate_we_vote_id" component={Candidate} />
                      <Route path="/candidate/:candidate_we_vote_id/:back_to_variable/:organization_we_vote_id" component={OrganizationVoterGuideCandidate} />
                      <Route path="/candidate/:candidate_we_vote_id/:organization_we_vote_id" component={OrganizationVoterGuideCandidate} />
                      <Route path="/candidate/:candidate_we_vote_id/b/:back_to_variable" component={Candidate} />
                      <Route path="/candidate/:candidate_we_vote_id/b/:back_to_variable/" component={Candidate} />
                      <Route path="/candidate/:candidate_we_vote_id/b/:back_to_variable/modal/:modal_to_show" component={Candidate} />
                      <Route path="/candidate/:candidate_we_vote_id/b/:back_to_variable/modal/:modal_to_show/:shared_item_code" component={Candidate} />
                      <Route path="/candidate/:candidate_we_vote_id/modal/:modal_to_show" component={Candidate} />
                      <Route path="/candidate/:candidate_we_vote_id/modal/:modal_to_show/:shared_item_code" component={Candidate} />
                      <Route path="/facebook_invitable_friends" component={FacebookInvitableFriends} />
                      <Route path="/for-campaigns" component={isNotWeVoteMarketingSite ? ReadyRedirect : (props) => <WelcomeForCampaigns {...props} pathname="/for-campaigns" />} />
                      <Route path="/for-organizations" component={isNotWeVoteMarketingSite ? ReadyRedirect : (props) => <WelcomeForOrganizations {...props} pathname="/for-organizations" />} />
                      <Route path="/how" component={isNotWeVoteMarketingSite ? ReadyRedirect : HowItWorks} />
                      <Route path="/how/:category_string" component={isNotWeVoteMarketingSite ? ReadyRedirect : HowItWorks} />
                      <Route path="/intro" component={Intro} />
                      <Route path="/intro/get_started" component={GetStarted} />
                      <Route path="/intro/sample_ballot" component={SampleBallot} />
                      <Route path="/measure/:measure_we_vote_id" component={Measure} />
                      <Route path="/measure/:measure_we_vote_id/:back_to_variable/:organization_we_vote_id" component={OrganizationVoterGuideMeasure} />
                      <Route path="/measure/:measure_we_vote_id/b/:back_to_variable" component={Measure} />
                      <Route path="/measure/:measure_we_vote_id/b/:back_to_variable/" component={Measure} />
                      <Route path="/measure/:measure_we_vote_id/b/:back_to_variable/modal/:modal_to_show" component={Measure} />
                      <Route path="/measure/:measure_we_vote_id/b/:back_to_variable/modal/:modal_to_show/:shared_item_code" component={Measure} />
                      <Route path="/measure/:measure_we_vote_id/modal/:modal_to_show" component={Measure} />
                      <Route path="/measure/:measure_we_vote_id/modal/:modal_to_show/:shared_item_code" component={Measure} />
                      <Route path="/more/absentee" component={AbsenteeBallot} />
                      <Route path="/more/alerts" component={ElectionReminder} />
                      <Route path="/more/alerts" component={ElectionReminder} />
                      <Route path="/more/attributions" component={Attributions} />
                      <Route path="/more/attributions" component={Attributions} />
                      <Route path="/more/credits" component={Credits} />
                      <Route path="/more/credits" component={Credits} />
                      <Route path="/more/donate" component={isNotWeVoteMarketingSite ? ReadyRedirect : Donate} />
                      <Route path="/more/donate" component={isNotWeVoteMarketingSite ? ReadyRedirect : Donate} />
                      <Route path="/more/elections" component={Elections} />
                      <Route path="/more/elections" component={Elections} />
                      <Route path="/more/extensionsignin" component={ExtensionSignIn} />
                      <Route path="/more/extensionsignin" component={ExtensionSignIn} />
                      <Route path="/more/facebooklandingprocess" component={FacebookLandingProcess} />
                      <Route path="/more/facebookredirecttowevote" component={FacebookRedirectToWeVote} />
                      <Route path="/more/faq" component={FAQ} />
                      <Route path="/more/jump" component={SignInJumpProcess} />
                      <Route path="/more/myballot" component={WeVoteBallotEmbed} />
                      <Route path="/more/network" component={Friends} />
                      <Route path="/more/network/friends" component={Friends} />
                      <Route path="/more/network/key/:invitation_secret_key" component={FriendInvitationByEmailVerifyProcess} />
                      <Route path="/more/network/key/:invitation_secret_key/ignore" component={FriendInvitationByEmailVerifyProcess} />
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
                      <Route path="/news" component={News} />
                      <Route path="/news/a/" component={News} />
                      <Route path="/news/a/:activity_tidbit_we_vote_id" component={News} />
                      <Route path="/office/:office_we_vote_id" component={Office} />
                      <Route path="/office/:office_we_vote_id/:back_to_variable/:organization_we_vote_id" component={OrganizationVoterGuideOffice} />
                      <Route path="/office/:office_we_vote_id/:organization_we_vote_id" component={OrganizationVoterGuideOffice} />
                      <Route path="/office/:office_we_vote_id/b/:back_to_variable" component={Office} />
                      <Route path="/office/:office_we_vote_id/b/:back_to_variable/" component={Office} />
                      <Route path="/office/:office_we_vote_id/b/:back_to_variable/modal/:modal_to_show" component={Office} />
                      <Route path="/office/:office_we_vote_id/modal/:modal_to_show" component={Office} />
                      <Route path="/office/:office_we_vote_id/modal/:modal_to_show/:shared_item_code" component={Office} />
                      <Route path="/opinions" component={Opinions2020} />
                      <Route path="/opinions/f/:selectedFilter" component={Opinions2020} />
                      <Route path="/opinions/s/:searchTextDefault" component={Opinions2020} />
                      <Route path="/opinions_followed" component={OpinionsFollowed} />
                      <Route path="/opinions_ignored" component={OpinionsIgnored} />
                      {/* <Route exact path="/ready"><Redirect to="/" /></Route> */}
                      <Route exact path="/ready"><Ready /></Route>
                      <Route path="/ready/election/:google_civic_election_id" component={Ready} />
                      <Route path="/ready/modal/:modal_to_show" render={(props) => (<RouterV5SendMatch componentName="Ready" {...props} />)} />
                      <Route path="/ready/modal/:modal_to_show/:shared_item_code" render={(props) => (<RouterV5SendMatch componentName="Ready" {...props} />)} />
                      <Route path="/register" component={Register} />
                      <Route path="/settings/:edit_mode" render={(props) => (<RouterV5SendMatch componentName="SettingsDashboard" {...props} />)} />
                      <Route path="/settings/:edit_mode/:voter_guide_we_vote_id" render={(props) => (<RouterV5SendMatch componentName="SettingsDashboard" {...props} />)} />
                      <Route path="/settings/issues/:edit_mode" render={(props) => (<RouterV5SendMatch componentName="SettingsDashboard" {...props} />)} />
                      <Route path="/sign_in_email/:email_secret_key" component={SignInEmailProcess} />
                      <Route path="/twittersigninprocess/:sign_in_step" component={TwitterSignInProcess} />
                      <Route path="/value/:value_slug" component={VoterGuidesUnderOneValue} />
                      <Route path="/values" component={Values} />
                      <Route path="/values/list" component={ValuesList} />
                      <Route path="/verify_email/:email_secret_key" component={VerifyEmailProcess} />
                      <Route path="/verifythisisme/:twitter_handle" component={VerifyThisIsMe} />
                      <Route path="/vg/:voter_guide_we_vote_id/settings" component={VoterGuideSettingsDashboard} />
                      <Route path="/vg/:voter_guide_we_vote_id/settings/menu" component={VoterGuideSettingsMenuMobile} />
                      <Route path="/vg/:voter_guide_we_vote_id/settings/positions" component={VoterGuideSettingsDashboard} />
                      <Route path="/voterguide/:organization_we_vote_id" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/:action_variable" component={OrganizationVoterGuide} />
                      <Route path="/voterguide/:organization_we_vote_id/ballot" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/ballot/:ballot_location_shortcut" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/ballot/election/:google_civic_election_id" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/ballot/election/:google_civic_election_id/ballot" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/ballot/election/:google_civic_election_id/followers" component={(props) => <OrganizationVoterGuide {...props} activeRoute="followers" />} />
                      <Route path="/voterguide/:organization_we_vote_id/ballot/election/:google_civic_election_id/following" component={(props) => <OrganizationVoterGuide {...props} activeRoute="following" />} />
                      <Route path="/voterguide/:organization_we_vote_id/ballot/election/:google_civic_election_id/m/followers" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
                      <Route path="/voterguide/:organization_we_vote_id/ballot/election/:google_civic_election_id/m/following" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
                      <Route path="/voterguide/:organization_we_vote_id/ballot/election/:google_civic_election_id/m/friends" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />} />
                      <Route path="/voterguide/:organization_we_vote_id/ballot/election/:google_civic_election_id/positions" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/ballot/election/:google_civic_election_id/positions/modal/:modal_to_show" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/ballot/election/:google_civic_election_id/positions/modal/:modal_to_show/:shared_item_code" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/ballot/empty" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/ballot/id/:ballot_returned_we_vote_id" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable" component={OrganizationVoterGuide} />
                      <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/:action_variable" component={OrganizationVoterGuide} />
                      <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/:action_variable/m/followers" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/:action_variable/m/following" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/:action_variable/m/friends" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/followers" component={(props) => <OrganizationVoterGuide {...props} activeRoute="followers" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/following" component={(props) => <OrganizationVoterGuide {...props} activeRoute="following" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/m/followers" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/m/following" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/m/friends" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/modal/:modal_to_show" component={OrganizationVoterGuide} />
                      <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/modal/:modal_to_show/:shared_item_code" component={OrganizationVoterGuide} />
                      <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/positions" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/positions/modal/:modal_to_show" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/positions/modal/:modal_to_show/:shared_item_code" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable" component={OrganizationVoterGuide} />
                      <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/:action_variable" component={OrganizationVoterGuide} />
                      <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/:action_variable/m/followers" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/:action_variable/m/following" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/:action_variable/m/friends" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/followers" component={(props) => <OrganizationVoterGuide {...props} activeRoute="followers" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/following" component={(props) => <OrganizationVoterGuide {...props} activeRoute="following" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/m/followers" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/m/following" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/m/friends" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/modal/:modal_to_show" component={OrganizationVoterGuide} />
                      <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/modal/:modal_to_show/:shared_item_code" component={OrganizationVoterGuide} />
                      <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/positions" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/positions/modal/:modal_to_show" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/positions/modal/:modal_to_show/:shared_item_code" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/followers" component={(props) => <OrganizationVoterGuide {...props} activeRoute="followers" />} />
                      <Route path="/voterguide/:organization_we_vote_id/following" component={(props) => <OrganizationVoterGuide {...props} activeRoute="following" />} />
                      <Route path="/voterguide/:organization_we_vote_id/m/followers" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
                      <Route path="/voterguide/:organization_we_vote_id/m/following" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
                      <Route path="/voterguide/:organization_we_vote_id/m/friends" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />} />
                      <Route path="/voterguide/:organization_we_vote_id/modal/:modal_to_show" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/modal/:modal_to_show/:shared_item_code" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/positions" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/positions/modal/:modal_to_show" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/positions/modal/:modal_to_show/:shared_item_code" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguideedit/:organization_we_vote_id" render={(props) => (<RouterV5SendMatch componentName="OrganizationVoterGuideEdit" {...props} />)} />
                      <Route path="/voterguideedit/:organization_we_vote_id/:google_civic_election_id" render={(props) => (<RouterV5SendMatch componentName="OrganizationVoterGuideEdit" {...props} />)} />
                      <Route path="/welcome" component={isNotWeVoteMarketingSite ? ReadyRedirect : (props) => <WelcomeForVoters {...props} pathname="/welcome" />} />
                      <Route path="/wevoteintro/network" component={IntroNetwork} />
                      <Route path="/wevoteintro/newfriend/:invitationSecretKey" component={FriendInvitationOnboarding} />
                      <Route path="/yourpage" component={YourPage} />
                      <Route path="/:twitter_handle/:action_variable" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/ballot/:ballot_location_shortcut" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/ballot/election/:google_civic_election_id" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/ballot/election/:google_civic_election_id/:view_mode" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/ballot/empty" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/ballot/id/:ballot_returned_we_vote_id" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/ballot/id/:ballot_returned_we_vote_id/:view_mode" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/:action_variable" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/:action_variable/m/followers" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/:action_variable/m/following" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/:action_variable/m/friends" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/followers" component={(props) => <TwitterHandleLanding {...props} activeRoute="followers" />} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/following" component={(props) => <TwitterHandleLanding {...props} activeRoute="following" />} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/m/followers" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/m/following" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/m/friends" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/modal/:modal_to_show" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/modal/:modal_to_show/:shared_item_code" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/modal/:modal_to_show/:shared_item_code" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/positions" component={(props) => <TwitterHandleLanding {...props} activeRoute="positions" />} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/positions/modal/:modal_to_show" component={(props) => <TwitterHandleLanding {...props} activeRoute="positions" />} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/positions/modal/:modal_to_show/:shared_item_code" component={(props) => <TwitterHandleLanding {...props} activeRoute="positions" />} />
                      <Route path="/:twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/:action_variable" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/:action_variable/m/followers" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
                      <Route path="/:twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/:action_variable/m/following" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
                      <Route path="/:twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/:action_variable/m/friends" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />} />
                      <Route path="/:twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/followers" component={(props) => <TwitterHandleLanding {...props} activeRoute="followers" />} />
                      <Route path="/:twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/following" component={(props) => <TwitterHandleLanding {...props} activeRoute="following" />} />
                      <Route path="/:twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/m/followers" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
                      <Route path="/:twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/m/following" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
                      <Route path="/:twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/m/friends" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />} />
                      <Route path="/:twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/modal/:modal_to_show" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/modal/:modal_to_show/:shared_item_code" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/positions" component={(props) => <TwitterHandleLanding {...props} activeRoute="positions" />} />
                      <Route path="/:twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/positions/modal/:modal_to_show" component={(props) => <TwitterHandleLanding {...props} activeRoute="positions" />} />
                      <Route path="/:twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/positions/modal/:modal_to_show/:shared_item_code" component={(props) => <TwitterHandleLanding {...props} activeRoute="positions" />} />
                      <Route path="/:twitter_handle/followers" component={(props) => <TwitterHandleLanding {...props} activeRoute="followers" />} />
                      <Route path="/:twitter_handle/following" component={(props) => <TwitterHandleLanding {...props} activeRoute="following" />} />
                      <Route path="/:twitter_handle/m/followers" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
                      <Route path="/:twitter_handle/m/following" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
                      <Route path="/:twitter_handle/m/friends" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />}  />
                      <Route path="/:twitter_handle/modal/:modal_to_show" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/modal/:modal_to_show/:shared_item_code" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/positions" component={(props) => <TwitterHandleLanding {...props} activeRoute="positions" />} />
                      <Route path="/:twitter_handle/positions/modal/:modal_to_show" component={(props) => <TwitterHandleLanding {...props} activeRoute="positions" />} />
                      <Route path="/:twitter_handle/positions/modal/:modal_to_show/:shared_item_code" component={(props) => <TwitterHandleLanding {...props} activeRoute="positions" />} />
                      <Route path="/:twitter_handle($)?" component={TwitterHandleLanding} />
                      <Route path="*" component={PageNotFound} />
                    </Switch>
                  </Suspense>
                  {showFooterBar && (
                    <div className={isWebApp() ? 'footroom-wrapper' : 'footroom-wrapper-cordova'}>
                      <Suspense fallback={<></>}>
                        <FooterBar />
                      </Suspense>
                    </div>
                  )}
                </WeVoteBody>
              </WeVoteRouter>
            </StylesProvider>
          </ThemeProvider>
        </MuiThemeProvider>
      </ErrorBoundary>
    );
  }
}

const WeVoteBody = styled.div`
  background-color: rgb(235, 236, 238);
  color: #333;
  display: block;
  font-family: "Nunito Sans", "Helvetica Neue Light", "Helvetica Neue", "Helvetica", "Arial", sans-serif;
  line-height: 1.4;
  margin: 0 auto;
  // max-width: 960px;
  height: 100vw;
  position: relative;
  z-index: 0;
`;

export default App;
import { MuiThemeProvider, StylesProvider } from '@material-ui/core/styles';
import React, { Component, Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import LoadingWheelComp from './js/components/LoadingWheelComp';
import Header from './js/components/Navigation/Header';
import HeaderBarSuspense from './js/components/Navigation/HeaderBarSuspense';
import ErrorBoundary from './js/components/Widgets/ErrorBoundary';
import WeVoteRouter from './js/components/Widgets/WeVoteRouter';
import muiTheme from './js/mui-theme';
import AppObservableStore from './js/stores/AppObservableStore';
import styledTheme from './js/styled-theme';
import { getApplicationViewBooleans } from './js/utils/applicationUtils';
import { isWebApp } from './js/utils/cordovaUtils';
import initializejQuery from './js/utils/initializejQuery';
import { renderLog } from './js/utils/logging';
import RouterV5SendMatch from './js/utils/RouterV5SendMatch';

// Root URL pages

import About from './js/routes/More/About';
import AbsenteeBallot from './js/routes/More/AbsenteeBallot';
import AddCandidateForExtension from './js/routes/Ballot/AddCandidateForExtension';
import AppleSignInProcess from './js/routes/Process/AppleSignInProcess';
import Attributions from './js/routes/More/Attributions';
import Ballot from './js/routes/Ballot/Ballot';
import Candidate from './js/routes/Ballot/Candidate';
import CandidateForExtension from './js/routes/Ballot/CandidateForExtension';
import ClaimYourPage from './js/routes/Settings/ClaimYourPage';
import Credits from './js/routes/More/Credits';
import Donate from './js/routes/More/Donate';
import ElectionReminder from './js/routes/More/ElectionReminder';
import Elections from './js/routes/More/Elections';
import ExtensionSignIn from './js/routes/More/ExtensionSignIn';
import FAQ from './js/routes/More/FAQ';
import FacebookInvitableFriends from './js/routes/FacebookInvitableFriends';
import FacebookLandingProcess from './js/routes/Process/FacebookLandingProcess';
import FacebookRedirectToWeVote from './js/routes/More/FacebookRedirectToWeVote';
import FooterBar from './js/components/Navigation/FooterBar.jsx';
import FriendInvitationByEmailVerifyProcess from './js/routes/Process/FriendInvitationByEmailVerifyProcess';
import FriendInvitationOnboarding from './js/routes/Intro/FriendInvitationOnboarding';
import Friends from './js/routes/Friends/Friends';
import GetStarted from './js/routes/Intro/GetStarted';
import HamburgerMenu from './js/routes/Settings/HamburgerMenu';
import HowItWorks from './js/routes/HowItWorks';
import Intro from './js/routes/Intro/Intro';
import IntroNetwork from './js/routes/Intro/IntroNetwork';
import Location from './js/routes/Settings/Location';
import Measure from './js/routes/Ballot/Measure';
import News from './js/routes/Activity/News';
import Office from './js/routes/Ballot/Office';
import Opinions2020 from './js/routes/Opinions2020';
import OpinionsFollowed from './js/routes/OpinionsFollowed';
import OpinionsIgnored from './js/routes/OpinionsIgnored';
import OrganizationVoterGuide from './js/routes/VoterGuide/OrganizationVoterGuide';
import OrganizationVoterGuideCandidate from './js/routes/VoterGuide/OrganizationVoterGuideCandidate';
import OrganizationVoterGuideMeasure from './js/routes/VoterGuide/OrganizationVoterGuideMeasure';
import OrganizationVoterGuideMobileDetails from './js/routes/VoterGuide/OrganizationVoterGuideMobileDetails';
import OrganizationVoterGuideOffice from './js/routes/VoterGuide/OrganizationVoterGuideOffice';
import PageNotFound from './js/routes/PageNotFound';
import Pricing from './js/routes/More/Pricing';
import Privacy from './js/routes/More/Privacy';
import ProcessingDonation from './js/routes/More/ProcessingDonation';
import Ready from './js/routes/Ready';
import ReadyLight from './js/routes/ReadyLight';
import ReadyRedirect from './js/routes/ReadyRedirect';
import Register from './js/routes/Register';
import RegisterToVote from './js/routes/More/RegisterToVote';
import SampleBallot from './js/routes/Intro/SampleBallot';
import SearchPage from './js/routes/More/SearchPage';
import SettingsDashboard from './js/routes/Settings/SettingsDashboard';
import SettingsMenuMobile from './js/routes/Settings/SettingsMenuMobile';
import SharedItemLanding from './js/routes/SharedItemLanding';
import SignInEmailProcess from './js/routes/Process/SignInEmailProcess';
import SignInJumpProcess from './js/routes/Process/SignInJumpProcess';
import TermsOfService from './js/routes/More/TermsOfService';
import TwitterHandleLanding from './js/routes/TwitterHandleLanding';
import TwitterSignInProcess from './js/routes/Process/TwitterSignInProcess';
import Values from './js/routes/Values';
import ValuesList from './js/routes/Values/ValuesList';
import VerifyEmailProcess from './js/routes/Process/VerifyEmailProcess';
import VerifyRegistration from './js/routes/More/VerifyRegistration';
import VerifyThisIsMe from './js/routes/VoterGuide/VerifyThisIsMe';
import Vote from './js/routes/Vote';
import VoterGuideListDashboard from './js/routes/Settings/VoterGuideListDashboard';
import VoterGuideSettingsDashboard from './js/routes/Settings/VoterGuideSettingsDashboard';
import VoterGuideSettingsMenuMobile from './js/routes/Settings/VoterGuideSettingsMenuMobile';
import VoterGuidesMenuMobile from './js/routes/Settings/VoterGuidesMenuMobile';
import VoterGuidesUnderOneValue from './js/routes/Values/VoterGuidesUnderOneValue';
import WeVoteBallotEmbed from './js/routes/More/WeVoteBallotEmbed';
import WelcomeForCampaigns from './js/routes/WelcomeForCampaigns';
import WelcomeForOrganizations from './js/routes/WelcomeForOrganizations';
import WelcomeForVoters from './js/routes/WelcomeForVoters';
import YourPage from './js/routes/YourPage';

// There are just too many "prop spreadings" in the use of Route, if someone can figure out an alternative...
/* eslint-disable react/jsx-props-no-spreading */

class AppCordova extends Component {
  constructor (props) {
    super(props);
    this.state = {
      // doShowHeader: true,
      // doShowFooter: true,
      showReadyLight: true,
    };
    // this.setShowHeader = this.setShowHeader.bind(this);
    // this.setShowFooter = this.setShowFooter.bind(this);
    // this.setShowHeaderFooter = this.setShowHeaderFooter.bind(this);
    this.setShowReadyHeavy = this.setShowReadyHeavy.bind(this);
    this.localIsCordova();
  }

  // See https://reactjs.org/docs/error-boundaries.html
  static getDerivedStateFromError (error) { // eslint-disable-line no-unused-vars
    // Update state so the next render will show the fallback UI, We should have a "Oh snap" page
    console.log('App caught error ', error);
    return { hasError: true };
  }

  componentDidMount () {
    initializejQuery(() => {
      let { hostname } = window.location;
      hostname = hostname || '';
      AppObservableStore.siteConfigurationRetrieve(hostname);
    });
    console.log('href in App.js componentDidMount: ', window.location.href);
  }

  componentDidCatch (error, info) {
    // We should get this information to Splunk!
    console.error('App caught error: ', `${error} with info: `, info);
  }

  // setShowHeader (doShowHeader) {
  //   console.log('-----------HEADER setShowHeader');
  //   this.setState({ doShowHeader });
  // }

  // setShowFooter (doShowFooter) {
  //   console.log('-----------HEADER setShowFooter');
  //   this.setState({ doShowFooter });
  // }

  // setShowHeaderFooter (doShow) {
  //   console.log('-----------HEADER setShowHeaderFooter', doShow);
  //   // console.log('setShowHeaderFooter -------------- doShow:', doShow);
  //   this.setState({
  //     doShowHeader: doShow,
  //     doShowFooter: doShow,
  //   });
  // }

  setShowReadyHeavy () {
    this.setState({ showReadyLight: false });
  }

  // From index.js (4/20/21)
  localIsCordova () {
    const { cordova } = window;
    window.isCordovaGlobal = cordova !== undefined;    // So now we set a global
    return cordova !== undefined;
  }

  render () {
    renderLog('App');
    const { /* doShowHeader, doShowFooter, */ showReadyLight } = this.state;
    // console.log(`App doShowHeader: ${doShowHeader}, doShowFooter:${doShowFooter}`);
    let { hostname } = window.location;
    hostname = hostname || '';
    const weVoteSites = ['wevote.us', 'quality.wevote.us', 'localhost', 'silicon', ''];   // localhost on Cordova is a ''
    const isWeVoteMarketingSite = weVoteSites.includes(String(hostname));
    const isNotWeVoteMarketingSite = !isWeVoteMarketingSite;
    const siteVars = getApplicationViewBooleans(hostname);
    const { showFooterBar } = siteVars;
    // const firstVisit = !cookies.getItem('voter_device_id');

    console.log('href in App.js render: ', window.location.href);

    /*
    Note: To debug routing, set a breakpoint in the class that routing takes you to -- then look at the received props.
    The props.match.path shows exactly which route string from this file, was selected by the <Switch>
    */

    return (
      <ErrorBoundary>
        <MuiThemeProvider theme={muiTheme}>
          <ThemeProvider theme={styledTheme}>
            <StylesProvider injectFirst>
              <WeVoteRouter>
                <WeVoteBody>
                  {/* DO NOT put SnackNotifier or anything else that is non-essential here (to keep it out of the main chuck. */}
                  <Suspense fallback={<HeaderBarSuspense />}>
                    <Header params={{ }} pathname={window.location.href} />
                  </Suspense>
                  <Suspense fallback={<LoadingWheelComp />}>
                    <Switch>
                      <Route exact path="/about"><About /></Route>
                      <Route exact path="/ballot" component={Ballot} />
                      <Route exact path="/friends" component={Friends} />
                      <Route exact path="/friends/:tabItem" component={Friends} />
                      <Route exact path="/">
                        {() => {
                          if (showReadyLight) {
                            return <ReadyLight showReadyHeavy={this.setShowReadyHeavy} />;
                          } else {
                            return <Redirect to="/ready" />;
                          }
                        }}
                      </Route>
                      <Route exact path="/ready"><Ready /></Route>
                      {/* <Route exact path="/ready"><Redirect to="/" /></Route> */}
                      <Route exact path="/settings" component={SettingsDashboard} />
                      <Route exact path="/settings/claim" component={ClaimYourPage} />
                      <Route exact path="/settings/hamburger" component={HamburgerMenu} />
                      <Route exact path="/settings/location" component={Location} />
                      <Route exact path="/settings/menu" component={SettingsMenuMobile} />
                      <Route exact path="/settings/voterguidelist" component={VoterGuideListDashboard} />
                      <Route exact path="/settings/voterguidesmenu" component={VoterGuidesMenuMobile} />
                      <Route exact path="/twitter_sign_in"><TwitterSignInProcess /></Route>
                      <Route path="/-/:custom_link_string" component={SharedItemLanding} />
                      <Route path="/-:shared_item_code" component={SharedItemLanding} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable($)?" component={TwitterHandleLanding} />
                      <Route path="/add-candidate-for-extension" component={AddCandidateForExtension} />
                      <Route path="/applesigninprocess" component={AppleSignInProcess} />
                      <Route path="/ballot/:ballot_location_shortcut" component={Ballot} />
                      <Route path="/ballot/:ballot_location_shortcut/modal/:modal_to_show" component={Ballot} />
                      <Route path="/ballot/:ballot_location_shortcut/modal/:modal_to_show/:shared_item_code" component={Ballot} />
                      <Route path="/ballot/election/:google_civic_election_id" component={Ballot} />
                      <Route path="/ballot/election/:google_civic_election_id/modal/:modal_to_show" component={Ballot} />
                      <Route path="/ballot/election/:google_civic_election_id/modal/:modal_to_show/:shared_item_code" component={Ballot} />
                      <Route path="/ballot/id/:ballot_returned_we_vote_id" component={Ballot} />
                      <Route path="/ballot/id/:ballot_returned_we_vote_id/modal/:modal_to_show" component={Ballot} />
                      <Route path="/ballot/id/:ballot_returned_we_vote_id/modal/:modal_to_show/:shared_item_code" component={Ballot} />
                      <Route path="/ballot/modal/:modal_to_show" component={Ballot} />
                      <Route path="/ballot/modal/:modal_to_show/:shared_item_code" component={Ballot} />
                      <Route path="/ballot/vote" component={Vote} />
                      <Route path="/ballot?voter_refresh_timer_on=:voter_refresh_timer_on" component={Ballot} />
                      <Route path="/candidate-for-extension" component={CandidateForExtension} />
                      <Route path="/candidate/:candidate_we_vote_id" component={Candidate} />
                      <Route path="/candidate/:candidate_we_vote_id/:back_to_variable/:organization_we_vote_id" component={OrganizationVoterGuideCandidate} />
                      <Route path="/candidate/:candidate_we_vote_id/:organization_we_vote_id" component={OrganizationVoterGuideCandidate} />
                      <Route path="/candidate/:candidate_we_vote_id/b/:back_to_variable" component={Candidate} />
                      <Route path="/candidate/:candidate_we_vote_id/b/:back_to_variable/" component={Candidate} />
                      <Route path="/candidate/:candidate_we_vote_id/b/:back_to_variable/modal/:modal_to_show" component={Candidate} />
                      <Route path="/candidate/:candidate_we_vote_id/b/:back_to_variable/modal/:modal_to_show/:shared_item_code" component={Candidate} />
                      <Route path="/candidate/:candidate_we_vote_id/modal/:modal_to_show" component={Candidate} />
                      <Route path="/candidate/:candidate_we_vote_id/modal/:modal_to_show/:shared_item_code" component={Candidate} />
                      <Route path="/facebook_invitable_friends" component={FacebookInvitableFriends} />
                      <Route path="/for-campaigns" component={isNotWeVoteMarketingSite ? ReadyRedirect : (props) => <WelcomeForCampaigns {...props} pathname="/for-campaigns" />} />
                      <Route path="/for-organizations" component={isNotWeVoteMarketingSite ? ReadyRedirect : (props) => <WelcomeForOrganizations {...props} pathname="/for-organizations" />} />
                      <Route path="/how" component={isNotWeVoteMarketingSite ? ReadyRedirect : HowItWorks} />
                      <Route path="/how/:category_string" component={isNotWeVoteMarketingSite ? ReadyRedirect : HowItWorks} />
                      <Route path="/intro" component={Intro} />
                      <Route path="/intro/get_started" component={GetStarted} />
                      <Route path="/intro/sample_ballot" component={SampleBallot} />
                      <Route path="/measure/:measure_we_vote_id" component={Measure} />
                      <Route path="/measure/:measure_we_vote_id/:back_to_variable/:organization_we_vote_id" component={OrganizationVoterGuideMeasure} />
                      <Route path="/measure/:measure_we_vote_id/b/:back_to_variable" component={Measure} />
                      <Route path="/measure/:measure_we_vote_id/b/:back_to_variable/" component={Measure} />
                      <Route path="/measure/:measure_we_vote_id/b/:back_to_variable/modal/:modal_to_show" component={Measure} />
                      <Route path="/measure/:measure_we_vote_id/b/:back_to_variable/modal/:modal_to_show/:shared_item_code" component={Measure} />
                      <Route path="/measure/:measure_we_vote_id/modal/:modal_to_show" component={Measure} />
                      <Route path="/measure/:measure_we_vote_id/modal/:modal_to_show/:shared_item_code" component={Measure} />
                      <Route path="/more/absentee" component={AbsenteeBallot} />
                      <Route path="/more/alerts" component={ElectionReminder} />
                      <Route path="/more/alerts" component={ElectionReminder} />
                      <Route path="/more/attributions" component={Attributions} />
                      <Route path="/more/attributions" component={Attributions} />
                      <Route path="/more/credits" component={Credits} />
                      <Route path="/more/credits" component={Credits} />
                      <Route path="/more/donate" component={isNotWeVoteMarketingSite ? ReadyRedirect : Donate} />
                      <Route path="/more/donate" component={isNotWeVoteMarketingSite ? ReadyRedirect : Donate} />
                      <Route path="/more/elections" component={Elections} />
                      <Route path="/more/elections" component={Elections} />
                      <Route path="/more/extensionsignin" component={ExtensionSignIn} />
                      <Route path="/more/extensionsignin" component={ExtensionSignIn} />
                      <Route path="/more/facebooklandingprocess" component={FacebookLandingProcess} />
                      <Route path="/more/facebookredirecttowevote" component={FacebookRedirectToWeVote} />
                      <Route path="/more/faq" component={FAQ} />
                      <Route path="/more/jump" component={SignInJumpProcess} />
                      <Route path="/more/myballot" component={WeVoteBallotEmbed} />
                      <Route path="/more/network" component={Friends} />
                      <Route path="/more/network/friends" component={Friends} />
                      <Route path="/more/network/key/:invitation_secret_key" component={FriendInvitationByEmailVerifyProcess} />
                      <Route path="/more/network/key/:invitation_secret_key/ignore" component={FriendInvitationByEmailVerifyProcess} />
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
                      <Route path="/news" component={News} />
                      <Route path="/news/a/" component={News} />
                      <Route path="/news/a/:activity_tidbit_we_vote_id" component={News} />
                      <Route path="/office/:office_we_vote_id" component={Office} />
                      <Route path="/office/:office_we_vote_id/:back_to_variable/:organization_we_vote_id" component={OrganizationVoterGuideOffice} />
                      <Route path="/office/:office_we_vote_id/:organization_we_vote_id" component={OrganizationVoterGuideOffice} />
                      <Route path="/office/:office_we_vote_id/b/:back_to_variable" component={Office} />
                      <Route path="/office/:office_we_vote_id/b/:back_to_variable/" component={Office} />
                      <Route path="/office/:office_we_vote_id/b/:back_to_variable/modal/:modal_to_show" component={Office} />
                      <Route path="/office/:office_we_vote_id/modal/:modal_to_show" component={Office} />
                      <Route path="/office/:office_we_vote_id/modal/:modal_to_show/:shared_item_code" component={Office} />
                      <Route path="/opinions" component={Opinions2020} />
                      <Route path="/opinions/f/:selectedFilter" component={Opinions2020} />
                      <Route path="/opinions/s/:searchTextDefault" component={Opinions2020} />
                      <Route path="/opinions_followed" component={OpinionsFollowed} />
                      <Route path="/opinions_ignored" component={OpinionsIgnored} />
                      {/* <Route exact path="/ready"><Redirect to="/" /></Route> */}
                      <Route exact path="/ready"><Ready /></Route>
                      <Route path="/ready/election/:google_civic_election_id" component={Ready} />
                      <Route path="/ready/modal/:modal_to_show" render={(props) => (<RouterV5SendMatch componentName="Ready" {...props} />)} />
                      <Route path="/ready/modal/:modal_to_show/:shared_item_code" render={(props) => (<RouterV5SendMatch componentName="Ready" {...props} />)} />
                      <Route path="/register" component={Register} />
                      <Route path="/settings/:edit_mode" render={(props) => (<RouterV5SendMatch componentName="SettingsDashboard" {...props} />)} />
                      <Route path="/settings/:edit_mode/:voter_guide_we_vote_id" render={(props) => (<RouterV5SendMatch componentName="SettingsDashboard" {...props} />)} />
                      <Route path="/settings/issues/:edit_mode" render={(props) => (<RouterV5SendMatch componentName="SettingsDashboard" {...props} />)} />
                      <Route path="/sign_in_email/:email_secret_key" component={SignInEmailProcess} />
                      <Route path="/twittersigninprocess/:sign_in_step" component={TwitterSignInProcess} />
                      <Route path="/value/:value_slug" component={VoterGuidesUnderOneValue} />
                      <Route path="/values" component={Values} />
                      <Route path="/values/list" component={ValuesList} />
                      <Route path="/verify_email/:email_secret_key" component={VerifyEmailProcess} />
                      <Route path="/verifythisisme/:twitter_handle" component={VerifyThisIsMe} />
                      <Route path="/vg/:voter_guide_we_vote_id/settings" component={VoterGuideSettingsDashboard} />
                      <Route path="/vg/:voter_guide_we_vote_id/settings/menu" component={VoterGuideSettingsMenuMobile} />
                      <Route path="/vg/:voter_guide_we_vote_id/settings/positions" component={VoterGuideSettingsDashboard} />
                      <Route path="/voterguide/:organization_we_vote_id" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/:action_variable" component={OrganizationVoterGuide} />
                      <Route path="/voterguide/:organization_we_vote_id/ballot" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/ballot/:ballot_location_shortcut" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/ballot/election/:google_civic_election_id" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/ballot/election/:google_civic_election_id/ballot" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/ballot/election/:google_civic_election_id/followers" component={(props) => <OrganizationVoterGuide {...props} activeRoute="followers" />} />
                      <Route path="/voterguide/:organization_we_vote_id/ballot/election/:google_civic_election_id/following" component={(props) => <OrganizationVoterGuide {...props} activeRoute="following" />} />
                      <Route path="/voterguide/:organization_we_vote_id/ballot/election/:google_civic_election_id/m/followers" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
                      <Route path="/voterguide/:organization_we_vote_id/ballot/election/:google_civic_election_id/m/following" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
                      <Route path="/voterguide/:organization_we_vote_id/ballot/election/:google_civic_election_id/m/friends" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />} />
                      <Route path="/voterguide/:organization_we_vote_id/ballot/election/:google_civic_election_id/positions" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/ballot/election/:google_civic_election_id/positions/modal/:modal_to_show" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/ballot/election/:google_civic_election_id/positions/modal/:modal_to_show/:shared_item_code" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/ballot/empty" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/ballot/id/:ballot_returned_we_vote_id" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable" component={OrganizationVoterGuide} />
                      <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/:action_variable" component={OrganizationVoterGuide} />
                      <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/:action_variable/m/followers" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/:action_variable/m/following" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/:action_variable/m/friends" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/followers" component={(props) => <OrganizationVoterGuide {...props} activeRoute="followers" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/following" component={(props) => <OrganizationVoterGuide {...props} activeRoute="following" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/m/followers" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/m/following" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/m/friends" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/modal/:modal_to_show" component={OrganizationVoterGuide} />
                      <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/modal/:modal_to_show/:shared_item_code" component={OrganizationVoterGuide} />
                      <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/positions" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/positions/modal/:modal_to_show" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/positions/modal/:modal_to_show/:shared_item_code" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable" component={OrganizationVoterGuide} />
                      <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/:action_variable" component={OrganizationVoterGuide} />
                      <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/:action_variable/m/followers" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/:action_variable/m/following" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/:action_variable/m/friends" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/followers" component={(props) => <OrganizationVoterGuide {...props} activeRoute="followers" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/following" component={(props) => <OrganizationVoterGuide {...props} activeRoute="following" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/m/followers" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/m/following" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/m/friends" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/modal/:modal_to_show" component={OrganizationVoterGuide} />
                      <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/modal/:modal_to_show/:shared_item_code" component={OrganizationVoterGuide} />
                      <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/positions" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/positions/modal/:modal_to_show" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/positions/modal/:modal_to_show/:shared_item_code" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/followers" component={(props) => <OrganizationVoterGuide {...props} activeRoute="followers" />} />
                      <Route path="/voterguide/:organization_we_vote_id/following" component={(props) => <OrganizationVoterGuide {...props} activeRoute="following" />} />
                      <Route path="/voterguide/:organization_we_vote_id/m/followers" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
                      <Route path="/voterguide/:organization_we_vote_id/m/following" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
                      <Route path="/voterguide/:organization_we_vote_id/m/friends" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />} />
                      <Route path="/voterguide/:organization_we_vote_id/modal/:modal_to_show" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/modal/:modal_to_show/:shared_item_code" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/positions" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/positions/modal/:modal_to_show" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/positions/modal/:modal_to_show/:shared_item_code" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguideedit/:organization_we_vote_id" render={(props) => (<RouterV5SendMatch componentName="OrganizationVoterGuideEdit" {...props} />)} />
                      <Route path="/voterguideedit/:organization_we_vote_id/:google_civic_election_id" render={(props) => (<RouterV5SendMatch componentName="OrganizationVoterGuideEdit" {...props} />)} />
                      <Route path="/welcome" component={isNotWeVoteMarketingSite ? ReadyRedirect : (props) => <WelcomeForVoters {...props} pathname="/welcome" />} />
                      <Route path="/wevoteintro/network" component={IntroNetwork} />
                      <Route path="/wevoteintro/newfriend/:invitationSecretKey" component={FriendInvitationOnboarding} />
                      <Route path="/yourpage" component={YourPage} />
                      <Route path="/:twitter_handle/:action_variable" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/ballot/:ballot_location_shortcut" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/ballot/election/:google_civic_election_id" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/ballot/election/:google_civic_election_id/:view_mode" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/ballot/empty" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/ballot/id/:ballot_returned_we_vote_id" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/ballot/id/:ballot_returned_we_vote_id/:view_mode" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/:action_variable" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/:action_variable/m/followers" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/:action_variable/m/following" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/:action_variable/m/friends" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/followers" component={(props) => <TwitterHandleLanding {...props} activeRoute="followers" />} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/following" component={(props) => <TwitterHandleLanding {...props} activeRoute="following" />} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/m/followers" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/m/following" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/m/friends" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/modal/:modal_to_show" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/modal/:modal_to_show/:shared_item_code" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/modal/:modal_to_show/:shared_item_code" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/positions" component={(props) => <TwitterHandleLanding {...props} activeRoute="positions" />} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/positions/modal/:modal_to_show" component={(props) => <TwitterHandleLanding {...props} activeRoute="positions" />} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/positions/modal/:modal_to_show/:shared_item_code" component={(props) => <TwitterHandleLanding {...props} activeRoute="positions" />} />
                      <Route path="/:twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/:action_variable" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/:action_variable/m/followers" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
                      <Route path="/:twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/:action_variable/m/following" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
                      <Route path="/:twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/:action_variable/m/friends" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />} />
                      <Route path="/:twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/followers" component={(props) => <TwitterHandleLanding {...props} activeRoute="followers" />} />
                      <Route path="/:twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/following" component={(props) => <TwitterHandleLanding {...props} activeRoute="following" />} />
                      <Route path="/:twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/m/followers" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
                      <Route path="/:twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/m/following" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
                      <Route path="/:twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/m/friends" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />} />
                      <Route path="/:twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/modal/:modal_to_show" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/modal/:modal_to_show/:shared_item_code" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/positions" component={(props) => <TwitterHandleLanding {...props} activeRoute="positions" />} />
                      <Route path="/:twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/positions/modal/:modal_to_show" component={(props) => <TwitterHandleLanding {...props} activeRoute="positions" />} />
                      <Route path="/:twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/positions/modal/:modal_to_show/:shared_item_code" component={(props) => <TwitterHandleLanding {...props} activeRoute="positions" />} />
                      <Route path="/:twitter_handle/followers" component={(props) => <TwitterHandleLanding {...props} activeRoute="followers" />} />
                      <Route path="/:twitter_handle/following" component={(props) => <TwitterHandleLanding {...props} activeRoute="following" />} />
                      <Route path="/:twitter_handle/m/followers" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
                      <Route path="/:twitter_handle/m/following" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
                      <Route path="/:twitter_handle/m/friends" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />}  />
                      <Route path="/:twitter_handle/modal/:modal_to_show" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/modal/:modal_to_show/:shared_item_code" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/positions" component={(props) => <TwitterHandleLanding {...props} activeRoute="positions" />} />
                      <Route path="/:twitter_handle/positions/modal/:modal_to_show" component={(props) => <TwitterHandleLanding {...props} activeRoute="positions" />} />
                      <Route path="/:twitter_handle/positions/modal/:modal_to_show/:shared_item_code" component={(props) => <TwitterHandleLanding {...props} activeRoute="positions" />} />
                      <Route path="/:twitter_handle($)?" component={TwitterHandleLanding} />
                      <Route path="*" component={PageNotFound} />
                    </Switch>
                  </Suspense>
                  {showFooterBar && (
                    <div className={isWebApp() ? 'footroom-wrapper' : 'footroom-wrapper-cordova'}>
                      <Suspense fallback={<></>}>
                        <FooterBar />
                      </Suspense>
                    </div>
                  )}
                </WeVoteBody>
              </WeVoteRouter>
            </StylesProvider>
          </ThemeProvider>
        </MuiThemeProvider>
      </ErrorBoundary>
    );
  }
}

const WeVoteBody = styled.div`
  background-color: rgb(235, 236, 238);
  color: #333;
  display: block;
  font-family: "Nunito Sans", "Helvetica Neue Light", "Helvetica Neue", "Helvetica", "Arial", sans-serif;
  line-height: 1.4;
  margin: 0 auto;
  // max-width: 960px;
  height: 100vw;
  position: relative;
  z-index: 0;
`;

export default App;
import { MuiThemeProvider, StylesProvider } from '@material-ui/core/styles';
import React, { Component, Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import LoadingWheelComp from './js/components/LoadingWheelComp';
import Header from './js/components/Navigation/Header';
import HeaderBarSuspense from './js/components/Navigation/HeaderBarSuspense';
import ErrorBoundary from './js/components/Widgets/ErrorBoundary';
import WeVoteRouter from './js/components/Widgets/WeVoteRouter';
import muiTheme from './js/mui-theme';
import AppObservableStore from './js/stores/AppObservableStore';
import styledTheme from './js/styled-theme';
import { getApplicationViewBooleans } from './js/utils/applicationUtils';
import { isWebApp } from './js/utils/cordovaUtils';
import initializejQuery from './js/utils/initializejQuery';
import { renderLog } from './js/utils/logging';
import RouterV5SendMatch from './js/utils/RouterV5SendMatch';

// Root URL pages

import About from './js/routes/More/About';
import AbsenteeBallot from './js/routes/More/AbsenteeBallot';
import AddCandidateForExtension from './js/routes/Ballot/AddCandidateForExtension';
import AppleSignInProcess from './js/routes/Process/AppleSignInProcess';
import Attributions from './js/routes/More/Attributions';
import Ballot from './js/routes/Ballot/Ballot';
import Candidate from './js/routes/Ballot/Candidate';
import CandidateForExtension from './js/routes/Ballot/CandidateForExtension';
import ClaimYourPage from './js/routes/Settings/ClaimYourPage';
import Credits from './js/routes/More/Credits';
import Donate from './js/routes/More/Donate';
import ElectionReminder from './js/routes/More/ElectionReminder';
import Elections from './js/routes/More/Elections';
import ExtensionSignIn from './js/routes/More/ExtensionSignIn';
import FAQ from './js/routes/More/FAQ';
import FacebookInvitableFriends from './js/routes/FacebookInvitableFriends';
import FacebookLandingProcess from './js/routes/Process/FacebookLandingProcess';
import FacebookRedirectToWeVote from './js/routes/More/FacebookRedirectToWeVote';
import FooterBar from './js/components/Navigation/FooterBar.jsx';
import FriendInvitationByEmailVerifyProcess from './js/routes/Process/FriendInvitationByEmailVerifyProcess';
import FriendInvitationOnboarding from './js/routes/Intro/FriendInvitationOnboarding';
import Friends from './js/routes/Friends/Friends';
import GetStarted from './js/routes/Intro/GetStarted';
import HamburgerMenu from './js/routes/Settings/HamburgerMenu';
import HowItWorks from './js/routes/HowItWorks';
import Intro from './js/routes/Intro/Intro';
import IntroNetwork from './js/routes/Intro/IntroNetwork';
import Location from './js/routes/Settings/Location';
import Measure from './js/routes/Ballot/Measure';
import News from './js/routes/Activity/News';
import Office from './js/routes/Ballot/Office';
import Opinions2020 from './js/routes/Opinions2020';
import OpinionsFollowed from './js/routes/OpinionsFollowed';
import OpinionsIgnored from './js/routes/OpinionsIgnored';
import OrganizationVoterGuide from './js/routes/VoterGuide/OrganizationVoterGuide';
import OrganizationVoterGuideCandidate from './js/routes/VoterGuide/OrganizationVoterGuideCandidate';
import OrganizationVoterGuideMeasure from './js/routes/VoterGuide/OrganizationVoterGuideMeasure';
import OrganizationVoterGuideMobileDetails from './js/routes/VoterGuide/OrganizationVoterGuideMobileDetails';
import OrganizationVoterGuideOffice from './js/routes/VoterGuide/OrganizationVoterGuideOffice';
import PageNotFound from './js/routes/PageNotFound';
import Pricing from './js/routes/More/Pricing';
import Privacy from './js/routes/More/Privacy';
import ProcessingDonation from './js/routes/More/ProcessingDonation';
import Ready from './js/routes/Ready';
import ReadyLight from './js/routes/ReadyLight';
import ReadyRedirect from './js/routes/ReadyRedirect';
import Register from './js/routes/Register';
import RegisterToVote from './js/routes/More/RegisterToVote';
import SampleBallot from './js/routes/Intro/SampleBallot';
import SearchPage from './js/routes/More/SearchPage';
import SettingsDashboard from './js/routes/Settings/SettingsDashboard';
import SettingsMenuMobile from './js/routes/Settings/SettingsMenuMobile';
import SharedItemLanding from './js/routes/SharedItemLanding';
import SignInEmailProcess from './js/routes/Process/SignInEmailProcess';
import SignInJumpProcess from './js/routes/Process/SignInJumpProcess';
import TermsOfService from './js/routes/More/TermsOfService';
import TwitterHandleLanding from './js/routes/TwitterHandleLanding';
import TwitterSignInProcess from './js/routes/Process/TwitterSignInProcess';
import Values from './js/routes/Values';
import ValuesList from './js/routes/Values/ValuesList';
import VerifyEmailProcess from './js/routes/Process/VerifyEmailProcess';
import VerifyRegistration from './js/routes/More/VerifyRegistration';
import VerifyThisIsMe from './js/routes/VoterGuide/VerifyThisIsMe';
import Vote from './js/routes/Vote';
import VoterGuideListDashboard from './js/routes/Settings/VoterGuideListDashboard';
import VoterGuideSettingsDashboard from './js/routes/Settings/VoterGuideSettingsDashboard';
import VoterGuideSettingsMenuMobile from './js/routes/Settings/VoterGuideSettingsMenuMobile';
import VoterGuidesMenuMobile from './js/routes/Settings/VoterGuidesMenuMobile';
import VoterGuidesUnderOneValue from './js/routes/Values/VoterGuidesUnderOneValue';
import WeVoteBallotEmbed from './js/routes/More/WeVoteBallotEmbed';
import WelcomeForCampaigns from './js/routes/WelcomeForCampaigns';
import WelcomeForOrganizations from './js/routes/WelcomeForOrganizations';
import WelcomeForVoters from './js/routes/WelcomeForVoters';
import YourPage from './js/routes/YourPage';

// There are just too many "prop spreadings" in the use of Route, if someone can figure out an alternative...
/* eslint-disable react/jsx-props-no-spreading */

class AppCordova extends Component {
  constructor (props) {
    super(props);
    this.state = {
      // doShowHeader: true,
      // doShowFooter: true,
      showReadyLight: true,
    };
    // this.setShowHeader = this.setShowHeader.bind(this);
    // this.setShowFooter = this.setShowFooter.bind(this);
    // this.setShowHeaderFooter = this.setShowHeaderFooter.bind(this);
    this.setShowReadyHeavy = this.setShowReadyHeavy.bind(this);
    this.localIsCordova();
  }

  // See https://reactjs.org/docs/error-boundaries.html
  static getDerivedStateFromError (error) { // eslint-disable-line no-unused-vars
    // Update state so the next render will show the fallback UI, We should have a "Oh snap" page
    console.log('App caught error ', error);
    return { hasError: true };
  }

  componentDidMount () {
    initializejQuery(() => {
      let { hostname } = window.location;
      hostname = hostname || '';
      AppObservableStore.siteConfigurationRetrieve(hostname);
    });
    console.log('href in App.js componentDidMount: ', window.location.href);
  }

  componentDidCatch (error, info) {
    // We should get this information to Splunk!
    console.error('App caught error: ', `${error} with info: `, info);
  }

  // setShowHeader (doShowHeader) {
  //   console.log('-----------HEADER setShowHeader');
  //   this.setState({ doShowHeader });
  // }

  // setShowFooter (doShowFooter) {
  //   console.log('-----------HEADER setShowFooter');
  //   this.setState({ doShowFooter });
  // }

  // setShowHeaderFooter (doShow) {
  //   console.log('-----------HEADER setShowHeaderFooter', doShow);
  //   // console.log('setShowHeaderFooter -------------- doShow:', doShow);
  //   this.setState({
  //     doShowHeader: doShow,
  //     doShowFooter: doShow,
  //   });
  // }

  setShowReadyHeavy () {
    this.setState({ showReadyLight: false });
  }

  // From index.js (4/20/21)
  localIsCordova () {
    const { cordova } = window;
    window.isCordovaGlobal = cordova !== undefined;    // So now we set a global
    return cordova !== undefined;
  }

  render () {
    renderLog('App');
    const { /* doShowHeader, doShowFooter, */ showReadyLight } = this.state;
    // console.log(`App doShowHeader: ${doShowHeader}, doShowFooter:${doShowFooter}`);
    let { hostname } = window.location;
    hostname = hostname || '';
    const weVoteSites = ['wevote.us', 'quality.wevote.us', 'localhost', 'silicon', ''];   // localhost on Cordova is a ''
    const isWeVoteMarketingSite = weVoteSites.includes(String(hostname));
    const isNotWeVoteMarketingSite = !isWeVoteMarketingSite;
    const siteVars = getApplicationViewBooleans(hostname);
    const { showFooterBar } = siteVars;
    // const firstVisit = !cookies.getItem('voter_device_id');

    console.log('href in App.js render: ', window.location.href);

    /*
    Note: To debug routing, set a breakpoint in the class that routing takes you to -- then look at the received props.
    The props.match.path shows exactly which route string from this file, was selected by the <Switch>
    */

    return (
      <ErrorBoundary>
        <MuiThemeProvider theme={muiTheme}>
          <ThemeProvider theme={styledTheme}>
            <StylesProvider injectFirst>
              <WeVoteRouter>
                <WeVoteBody>
                  {/* DO NOT put SnackNotifier or anything else that is non-essential here (to keep it out of the main chuck. */}
                  <Suspense fallback={<HeaderBarSuspense />}>
                    <Header params={{ }} pathname={window.location.href} />
                  </Suspense>
                  <Suspense fallback={<LoadingWheelComp />}>
                    <Switch>
                      <Route exact path="/about"><About /></Route>
                      <Route exact path="/ballot" component={Ballot} />
                      <Route exact path="/friends" component={Friends} />
                      <Route exact path="/friends/:tabItem" component={Friends} />
                      <Route exact path="/">
                        {() => {
                          if (showReadyLight) {
                            return <ReadyLight showReadyHeavy={this.setShowReadyHeavy} />;
                          } else {
                            return <Redirect to="/ready" />;
                          }
                        }}
                      </Route>
                      <Route exact path="/ready"><Ready /></Route>
                      {/* <Route exact path="/ready"><Redirect to="/" /></Route> */}
                      <Route exact path="/settings" component={SettingsDashboard} />
                      <Route exact path="/settings/claim" component={ClaimYourPage} />
                      <Route exact path="/settings/hamburger" component={HamburgerMenu} />
                      <Route exact path="/settings/location" component={Location} />
                      <Route exact path="/settings/menu" component={SettingsMenuMobile} />
                      <Route exact path="/settings/voterguidelist" component={VoterGuideListDashboard} />
                      <Route exact path="/settings/voterguidesmenu" component={VoterGuidesMenuMobile} />
                      <Route exact path="/twitter_sign_in"><TwitterSignInProcess /></Route>
                      <Route path="/-/:custom_link_string" component={SharedItemLanding} />
                      <Route path="/-:shared_item_code" component={SharedItemLanding} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable($)?" component={TwitterHandleLanding} />
                      <Route path="/add-candidate-for-extension" component={AddCandidateForExtension} />
                      <Route path="/applesigninprocess" component={AppleSignInProcess} />
                      <Route path="/ballot/:ballot_location_shortcut" component={Ballot} />
                      <Route path="/ballot/:ballot_location_shortcut/modal/:modal_to_show" component={Ballot} />
                      <Route path="/ballot/:ballot_location_shortcut/modal/:modal_to_show/:shared_item_code" component={Ballot} />
                      <Route path="/ballot/election/:google_civic_election_id" component={Ballot} />
                      <Route path="/ballot/election/:google_civic_election_id/modal/:modal_to_show" component={Ballot} />
                      <Route path="/ballot/election/:google_civic_election_id/modal/:modal_to_show/:shared_item_code" component={Ballot} />
                      <Route path="/ballot/id/:ballot_returned_we_vote_id" component={Ballot} />
                      <Route path="/ballot/id/:ballot_returned_we_vote_id/modal/:modal_to_show" component={Ballot} />
                      <Route path="/ballot/id/:ballot_returned_we_vote_id/modal/:modal_to_show/:shared_item_code" component={Ballot} />
                      <Route path="/ballot/modal/:modal_to_show" component={Ballot} />
                      <Route path="/ballot/modal/:modal_to_show/:shared_item_code" component={Ballot} />
                      <Route path="/ballot/vote" component={Vote} />
                      <Route path="/ballot?voter_refresh_timer_on=:voter_refresh_timer_on" component={Ballot} />
                      <Route path="/candidate-for-extension" component={CandidateForExtension} />
                      <Route path="/candidate/:candidate_we_vote_id" component={Candidate} />
                      <Route path="/candidate/:candidate_we_vote_id/:back_to_variable/:organization_we_vote_id" component={OrganizationVoterGuideCandidate} />
                      <Route path="/candidate/:candidate_we_vote_id/:organization_we_vote_id" component={OrganizationVoterGuideCandidate} />
                      <Route path="/candidate/:candidate_we_vote_id/b/:back_to_variable" component={Candidate} />
                      <Route path="/candidate/:candidate_we_vote_id/b/:back_to_variable/" component={Candidate} />
                      <Route path="/candidate/:candidate_we_vote_id/b/:back_to_variable/modal/:modal_to_show" component={Candidate} />
                      <Route path="/candidate/:candidate_we_vote_id/b/:back_to_variable/modal/:modal_to_show/:shared_item_code" component={Candidate} />
                      <Route path="/candidate/:candidate_we_vote_id/modal/:modal_to_show" component={Candidate} />
                      <Route path="/candidate/:candidate_we_vote_id/modal/:modal_to_show/:shared_item_code" component={Candidate} />
                      <Route path="/facebook_invitable_friends" component={FacebookInvitableFriends} />
                      <Route path="/for-campaigns" component={isNotWeVoteMarketingSite ? ReadyRedirect : (props) => <WelcomeForCampaigns {...props} pathname="/for-campaigns" />} />
                      <Route path="/for-organizations" component={isNotWeVoteMarketingSite ? ReadyRedirect : (props) => <WelcomeForOrganizations {...props} pathname="/for-organizations" />} />
                      <Route path="/how" component={isNotWeVoteMarketingSite ? ReadyRedirect : HowItWorks} />
                      <Route path="/how/:category_string" component={isNotWeVoteMarketingSite ? ReadyRedirect : HowItWorks} />
                      <Route path="/intro" component={Intro} />
                      <Route path="/intro/get_started" component={GetStarted} />
                      <Route path="/intro/sample_ballot" component={SampleBallot} />
                      <Route path="/measure/:measure_we_vote_id" component={Measure} />
                      <Route path="/measure/:measure_we_vote_id/:back_to_variable/:organization_we_vote_id" component={OrganizationVoterGuideMeasure} />
                      <Route path="/measure/:measure_we_vote_id/b/:back_to_variable" component={Measure} />
                      <Route path="/measure/:measure_we_vote_id/b/:back_to_variable/" component={Measure} />
                      <Route path="/measure/:measure_we_vote_id/b/:back_to_variable/modal/:modal_to_show" component={Measure} />
                      <Route path="/measure/:measure_we_vote_id/b/:back_to_variable/modal/:modal_to_show/:shared_item_code" component={Measure} />
                      <Route path="/measure/:measure_we_vote_id/modal/:modal_to_show" component={Measure} />
                      <Route path="/measure/:measure_we_vote_id/modal/:modal_to_show/:shared_item_code" component={Measure} />
                      <Route path="/more/absentee" component={AbsenteeBallot} />
                      <Route path="/more/alerts" component={ElectionReminder} />
                      <Route path="/more/alerts" component={ElectionReminder} />
                      <Route path="/more/attributions" component={Attributions} />
                      <Route path="/more/attributions" component={Attributions} />
                      <Route path="/more/credits" component={Credits} />
                      <Route path="/more/credits" component={Credits} />
                      <Route path="/more/donate" component={isNotWeVoteMarketingSite ? ReadyRedirect : Donate} />
                      <Route path="/more/donate" component={isNotWeVoteMarketingSite ? ReadyRedirect : Donate} />
                      <Route path="/more/elections" component={Elections} />
                      <Route path="/more/elections" component={Elections} />
                      <Route path="/more/extensionsignin" component={ExtensionSignIn} />
                      <Route path="/more/extensionsignin" component={ExtensionSignIn} />
                      <Route path="/more/facebooklandingprocess" component={FacebookLandingProcess} />
                      <Route path="/more/facebookredirecttowevote" component={FacebookRedirectToWeVote} />
                      <Route path="/more/faq" component={FAQ} />
                      <Route path="/more/jump" component={SignInJumpProcess} />
                      <Route path="/more/myballot" component={WeVoteBallotEmbed} />
                      <Route path="/more/network" component={Friends} />
                      <Route path="/more/network/friends" component={Friends} />
                      <Route path="/more/network/key/:invitation_secret_key" component={FriendInvitationByEmailVerifyProcess} />
                      <Route path="/more/network/key/:invitation_secret_key/ignore" component={FriendInvitationByEmailVerifyProcess} />
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
                      <Route path="/news" component={News} />
                      <Route path="/news/a/" component={News} />
                      <Route path="/news/a/:activity_tidbit_we_vote_id" component={News} />
                      <Route path="/office/:office_we_vote_id" component={Office} />
                      <Route path="/office/:office_we_vote_id/:back_to_variable/:organization_we_vote_id" component={OrganizationVoterGuideOffice} />
                      <Route path="/office/:office_we_vote_id/:organization_we_vote_id" component={OrganizationVoterGuideOffice} />
                      <Route path="/office/:office_we_vote_id/b/:back_to_variable" component={Office} />
                      <Route path="/office/:office_we_vote_id/b/:back_to_variable/" component={Office} />
                      <Route path="/office/:office_we_vote_id/b/:back_to_variable/modal/:modal_to_show" component={Office} />
                      <Route path="/office/:office_we_vote_id/modal/:modal_to_show" component={Office} />
                      <Route path="/office/:office_we_vote_id/modal/:modal_to_show/:shared_item_code" component={Office} />
                      <Route path="/opinions" component={Opinions2020} />
                      <Route path="/opinions/f/:selectedFilter" component={Opinions2020} />
                      <Route path="/opinions/s/:searchTextDefault" component={Opinions2020} />
                      <Route path="/opinions_followed" component={OpinionsFollowed} />
                      <Route path="/opinions_ignored" component={OpinionsIgnored} />
                      {/* <Route exact path="/ready"><Redirect to="/" /></Route> */}
                      <Route exact path="/ready"><Ready /></Route>
                      <Route path="/ready/election/:google_civic_election_id" component={Ready} />
                      <Route path="/ready/modal/:modal_to_show" render={(props) => (<RouterV5SendMatch componentName="Ready" {...props} />)} />
                      <Route path="/ready/modal/:modal_to_show/:shared_item_code" render={(props) => (<RouterV5SendMatch componentName="Ready" {...props} />)} />
                      <Route path="/register" component={Register} />
                      <Route path="/settings/:edit_mode" render={(props) => (<RouterV5SendMatch componentName="SettingsDashboard" {...props} />)} />
                      <Route path="/settings/:edit_mode/:voter_guide_we_vote_id" render={(props) => (<RouterV5SendMatch componentName="SettingsDashboard" {...props} />)} />
                      <Route path="/settings/issues/:edit_mode" render={(props) => (<RouterV5SendMatch componentName="SettingsDashboard" {...props} />)} />
                      <Route path="/sign_in_email/:email_secret_key" component={SignInEmailProcess} />
                      <Route path="/twittersigninprocess/:sign_in_step" component={TwitterSignInProcess} />
                      <Route path="/value/:value_slug" component={VoterGuidesUnderOneValue} />
                      <Route path="/values" component={Values} />
                      <Route path="/values/list" component={ValuesList} />
                      <Route path="/verify_email/:email_secret_key" component={VerifyEmailProcess} />
                      <Route path="/verifythisisme/:twitter_handle" component={VerifyThisIsMe} />
                      <Route path="/vg/:voter_guide_we_vote_id/settings" component={VoterGuideSettingsDashboard} />
                      <Route path="/vg/:voter_guide_we_vote_id/settings/menu" component={VoterGuideSettingsMenuMobile} />
                      <Route path="/vg/:voter_guide_we_vote_id/settings/positions" component={VoterGuideSettingsDashboard} />
                      <Route path="/voterguide/:organization_we_vote_id" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/:action_variable" component={OrganizationVoterGuide} />
                      <Route path="/voterguide/:organization_we_vote_id/ballot" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/ballot/:ballot_location_shortcut" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/ballot/election/:google_civic_election_id" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/ballot/election/:google_civic_election_id/ballot" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/ballot/election/:google_civic_election_id/followers" component={(props) => <OrganizationVoterGuide {...props} activeRoute="followers" />} />
                      <Route path="/voterguide/:organization_we_vote_id/ballot/election/:google_civic_election_id/following" component={(props) => <OrganizationVoterGuide {...props} activeRoute="following" />} />
                      <Route path="/voterguide/:organization_we_vote_id/ballot/election/:google_civic_election_id/m/followers" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
                      <Route path="/voterguide/:organization_we_vote_id/ballot/election/:google_civic_election_id/m/following" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
                      <Route path="/voterguide/:organization_we_vote_id/ballot/election/:google_civic_election_id/m/friends" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />} />
                      <Route path="/voterguide/:organization_we_vote_id/ballot/election/:google_civic_election_id/positions" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/ballot/election/:google_civic_election_id/positions/modal/:modal_to_show" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/ballot/election/:google_civic_election_id/positions/modal/:modal_to_show/:shared_item_code" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/ballot/empty" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/ballot/id/:ballot_returned_we_vote_id" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable" component={OrganizationVoterGuide} />
                      <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/:action_variable" component={OrganizationVoterGuide} />
                      <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/:action_variable/m/followers" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/:action_variable/m/following" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/:action_variable/m/friends" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/followers" component={(props) => <OrganizationVoterGuide {...props} activeRoute="followers" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/following" component={(props) => <OrganizationVoterGuide {...props} activeRoute="following" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/m/followers" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/m/following" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/m/friends" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/modal/:modal_to_show" component={OrganizationVoterGuide} />
                      <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/modal/:modal_to_show/:shared_item_code" component={OrganizationVoterGuide} />
                      <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/positions" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/positions/modal/:modal_to_show" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/positions/modal/:modal_to_show/:shared_item_code" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable" component={OrganizationVoterGuide} />
                      <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/:action_variable" component={OrganizationVoterGuide} />
                      <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/:action_variable/m/followers" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/:action_variable/m/following" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/:action_variable/m/friends" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/followers" component={(props) => <OrganizationVoterGuide {...props} activeRoute="followers" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/following" component={(props) => <OrganizationVoterGuide {...props} activeRoute="following" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/m/followers" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/m/following" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/m/friends" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/modal/:modal_to_show" component={OrganizationVoterGuide} />
                      <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/modal/:modal_to_show/:shared_item_code" component={OrganizationVoterGuide} />
                      <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/positions" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/positions/modal/:modal_to_show" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/positions/modal/:modal_to_show/:shared_item_code" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/followers" component={(props) => <OrganizationVoterGuide {...props} activeRoute="followers" />} />
                      <Route path="/voterguide/:organization_we_vote_id/following" component={(props) => <OrganizationVoterGuide {...props} activeRoute="following" />} />
                      <Route path="/voterguide/:organization_we_vote_id/m/followers" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
                      <Route path="/voterguide/:organization_we_vote_id/m/following" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
                      <Route path="/voterguide/:organization_we_vote_id/m/friends" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />} />
                      <Route path="/voterguide/:organization_we_vote_id/modal/:modal_to_show" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/modal/:modal_to_show/:shared_item_code" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/positions" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/positions/modal/:modal_to_show" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguide/:organization_we_vote_id/positions/modal/:modal_to_show/:shared_item_code" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                      <Route path="/voterguideedit/:organization_we_vote_id" render={(props) => (<RouterV5SendMatch componentName="OrganizationVoterGuideEdit" {...props} />)} />
                      <Route path="/voterguideedit/:organization_we_vote_id/:google_civic_election_id" render={(props) => (<RouterV5SendMatch componentName="OrganizationVoterGuideEdit" {...props} />)} />
                      <Route path="/welcome" component={isNotWeVoteMarketingSite ? ReadyRedirect : (props) => <WelcomeForVoters {...props} pathname="/welcome" />} />
                      <Route path="/wevoteintro/network" component={IntroNetwork} />
                      <Route path="/wevoteintro/newfriend/:invitationSecretKey" component={FriendInvitationOnboarding} />
                      <Route path="/yourpage" component={YourPage} />
                      <Route path="/:twitter_handle/:action_variable" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/ballot/:ballot_location_shortcut" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/ballot/election/:google_civic_election_id" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/ballot/election/:google_civic_election_id/:view_mode" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/ballot/empty" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/ballot/id/:ballot_returned_we_vote_id" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/ballot/id/:ballot_returned_we_vote_id/:view_mode" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/:action_variable" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/:action_variable/m/followers" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/:action_variable/m/following" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/:action_variable/m/friends" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/followers" component={(props) => <TwitterHandleLanding {...props} activeRoute="followers" />} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/following" component={(props) => <TwitterHandleLanding {...props} activeRoute="following" />} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/m/followers" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/m/following" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/m/friends" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/modal/:modal_to_show" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/modal/:modal_to_show/:shared_item_code" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/modal/:modal_to_show/:shared_item_code" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/positions" component={(props) => <TwitterHandleLanding {...props} activeRoute="positions" />} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/positions/modal/:modal_to_show" component={(props) => <TwitterHandleLanding {...props} activeRoute="positions" />} />
                      <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/positions/modal/:modal_to_show/:shared_item_code" component={(props) => <TwitterHandleLanding {...props} activeRoute="positions" />} />
                      <Route path="/:twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/:action_variable" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/:action_variable/m/followers" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
                      <Route path="/:twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/:action_variable/m/following" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
                      <Route path="/:twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/:action_variable/m/friends" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />} />
                      <Route path="/:twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/followers" component={(props) => <TwitterHandleLanding {...props} activeRoute="followers" />} />
                      <Route path="/:twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/following" component={(props) => <TwitterHandleLanding {...props} activeRoute="following" />} />
                      <Route path="/:twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/m/followers" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
                      <Route path="/:twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/m/following" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
                      <Route path="/:twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/m/friends" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />} />
                      <Route path="/:twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/modal/:modal_to_show" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/modal/:modal_to_show/:shared_item_code" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/positions" component={(props) => <TwitterHandleLanding {...props} activeRoute="positions" />} />
                      <Route path="/:twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/positions/modal/:modal_to_show" component={(props) => <TwitterHandleLanding {...props} activeRoute="positions" />} />
                      <Route path="/:twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/positions/modal/:modal_to_show/:shared_item_code" component={(props) => <TwitterHandleLanding {...props} activeRoute="positions" />} />
                      <Route path="/:twitter_handle/followers" component={(props) => <TwitterHandleLanding {...props} activeRoute="followers" />} />
                      <Route path="/:twitter_handle/following" component={(props) => <TwitterHandleLanding {...props} activeRoute="following" />} />
                      <Route path="/:twitter_handle/m/followers" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
                      <Route path="/:twitter_handle/m/following" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
                      <Route path="/:twitter_handle/m/friends" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />}  />
                      <Route path="/:twitter_handle/modal/:modal_to_show" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/modal/:modal_to_show/:shared_item_code" component={TwitterHandleLanding} />
                      <Route path="/:twitter_handle/positions" component={(props) => <TwitterHandleLanding {...props} activeRoute="positions" />} />
                      <Route path="/:twitter_handle/positions/modal/:modal_to_show" component={(props) => <TwitterHandleLanding {...props} activeRoute="positions" />} />
                      <Route path="/:twitter_handle/positions/modal/:modal_to_show/:shared_item_code" component={(props) => <TwitterHandleLanding {...props} activeRoute="positions" />} />
                      <Route path="/:twitter_handle($)?" component={TwitterHandleLanding} />
                      <Route path="*" component={PageNotFound} />
                    </Switch>
                  </Suspense>
                  {showFooterBar && (
                    <div className={isWebApp() ? 'footroom-wrapper' : 'footroom-wrapper-cordova'}>
                      <Suspense fallback={<></>}>
                        <FooterBar />
                      </Suspense>
                    </div>
                  )}
                </WeVoteBody>
              </WeVoteRouter>
            </StylesProvider>
          </ThemeProvider>
        </MuiThemeProvider>
      </ErrorBoundary>
    );
  }
}

const WeVoteBody = styled.div`
  background-color: rgb(235, 236, 238);
  color: #333;
  display: block;
  font-family: "Nunito Sans", "Helvetica Neue Light", "Helvetica Neue", "Helvetica", "Arial", sans-serif;
  line-height: 1.4;
  margin: 0 auto;
  // max-width: 960px;
  height: 100vw;
  position: relative;
  z-index: 0;
`;

export default App;
