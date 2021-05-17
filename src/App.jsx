import { MuiThemeProvider } from '@material-ui/core/styles';
import React, { Component, Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import Header from './js/components/Navigation/Header';
import HeaderBarSuspense from './js/components/Navigation/HeaderBarSuspense';
import ErrorBoundary from './js/components/Widgets/ErrorBoundary';
import WeVoteRouter from './js/components/Widgets/WeVoteRouter';
import muiTheme from './js/mui-theme';
import styledTheme from './js/styled-theme';
import cookies from './js/utils/cookies';
import initializejQuery from './js/utils/initializejQuery';
// import initializeOnce from './js/utils/initializeOnce';
import { renderLog } from './js/utils/logging';
import RouterV5SendMatch from './js/utils/RouterV5SendMatch';
// import SnackNotifier from './js/components/Widgets/SnackNotifier';

// Root URL pages

const About = React.lazy(() => import(/* webpackChunkName: 'About' */ './js/routes/More/About'));
const AbsenteeBallot = React.lazy(() => import(/* webpackChunkName: 'AbsenteeBallot' */ './js/routes/More/AbsenteeBallot'));
const AddCandidateForExtension = React.lazy(() => import(/* webpackChunkName: 'AddCandidateForExtension' */ './js/routes/Ballot/AddCandidateForExtension'));
const AppleSignInProcess = React.lazy(() => import(/* webpackChunkName: 'AppleSignInProcess' */ './js/routes/Process/AppleSignInProcess'));
const Attributions = React.lazy(() => import(/* webpackChunkName: 'Attributions' */ './js/routes/More/Attributions'));
const Ballot = React.lazy(() => import(/* webpackChunkName: 'Ballot' */ './js/routes/Ballot/Ballot'));
const Candidate = React.lazy(() => import(/* webpackChunkName: 'Candidate' */ './js/routes/Ballot/Candidate'));
const CandidateForExtension = React.lazy(() => import(/* webpackChunkName: 'CandidateForExtension' */ './js/routes/Ballot/CandidateForExtension'));
const ClaimYourPage = React.lazy(() => import(/* webpackChunkName: 'ClaimYourPage' */ './js/routes/Settings/ClaimYourPage'));
const Credits = React.lazy(() => import(/* webpackChunkName: 'Credits' */ './js/routes/More/Credits'));
const Donate = React.lazy(() => import(/* webpackChunkName: 'Donate' */ './js/routes/More/Donate'));
const DonateThankYou = React.lazy(() => import(/* webpackChunkName: 'DonateThankYou' */ './js/routes/More/DonateThankYou'));
const ElectionReminder = React.lazy(() => import(/* webpackChunkName: 'ElectionReminder' */ './js/routes/More/ElectionReminder'));
const Elections = React.lazy(() => import(/* webpackChunkName: 'Elections' */ './js/routes/More/Elections'));
const ExtensionSignIn = React.lazy(() => import(/* webpackChunkName: 'ExtensionSignIn' */ './js/routes/More/ExtensionSignIn'));
const FAQ = React.lazy(() => import(/* webpackChunkName: 'FAQ' */ './js/routes/More/FAQ'));
const FacebookInvitableFriends = React.lazy(() => import(/* webpackChunkName: 'FacebookInvitableFriends' */ './js/routes/FacebookInvitableFriends'));
const FacebookLandingProcess = React.lazy(() => import(/* webpackChunkName: 'FacebookLandingProcess' */ './js/routes/Process/FacebookLandingProcess'));
const FacebookRedirectToWeVote = React.lazy(() => import(/* webpackChunkName: 'FacebookRedirectToWeVote' */ './js/routes/More/FacebookRedirectToWeVote'));
const FriendInvitationByEmailVerifyProcess = React.lazy(() => import(/* webpackChunkName: 'FriendInvitationByEmailVerifyProcess' */ './js/routes/Process/FriendInvitationByEmailVerifyProcess'));
const FriendInvitationOnboarding = React.lazy(() => import(/* webpackChunkName: 'FriendInvitationOnboarding' */ './js/routes/Intro/FriendInvitationOnboarding'));
const Friends = React.lazy(() => import(/* webpackChunkName: 'Friends' */ './js/routes/Friends/Friends'));
const GetStarted = React.lazy(() => import(/* webpackChunkName: 'GetStarted' */ './js/routes/Intro/GetStarted'));
const HamburgerMenu = React.lazy(() => import(/* webpackChunkName: 'HamburgerMenu' */ './js/routes/Settings/HamburgerMenu'));
const HowItWorks = React.lazy(() => import(/* webpackChunkName: 'HowItWorks' */ './js/routes/HowItWorks'));
const Intro = React.lazy(() => import(/* webpackChunkName: 'Intro' */ './js/routes/Intro/Intro'));
const IntroNetwork = React.lazy(() => import(/* webpackChunkName: 'IntroNetwork' */ './js/routes/Intro/IntroNetwork'));
const Location = React.lazy(() => import(/* webpackChunkName: 'Location' */ './js/routes/Settings/Location'));
const Measure = React.lazy(() => import(/* webpackChunkName: 'Measure' */ './js/routes/Ballot/Measure'));
const News = React.lazy(() => import(/* webpackChunkName: 'News' */ './js/routes/Activity/News'));
const Office = React.lazy(() => import(/* webpackChunkName: 'Office' */ './js/routes/Ballot/Office'));
const Opinions2020 = React.lazy(() => import(/* webpackChunkName: 'Opinions2020' */ './js/routes/Opinions2020'));
const OpinionsFollowed = React.lazy(() => import(/* webpackChunkName: 'OpinionsFollowed' */ './js/routes/OpinionsFollowed'));
const OpinionsIgnored = React.lazy(() => import(/* webpackChunkName: 'OpinionsIgnored' */ './js/routes/OpinionsIgnored'));
const OrganizationVoterGuide = React.lazy(() => import(/* webpackChunkName: 'OrganizationVoterGuide' */ './js/routes/VoterGuide/OrganizationVoterGuide'));
const OrganizationVoterGuideCandidate = React.lazy(() => import(/* webpackChunkName: 'OrganizationVoterGuideCandidate' */ './js/routes/VoterGuide/OrganizationVoterGuideCandidate'));
const OrganizationVoterGuideMeasure = React.lazy(() => import(/* webpackChunkName: 'OrganizationVoterGuideMeasure' */ './js/routes/VoterGuide/OrganizationVoterGuideMeasure'));
const OrganizationVoterGuideMobileDetails = React.lazy(() => import(/* webpackChunkName: 'OrganizationVoterGuideMobileDetails' */ './js/routes/VoterGuide/OrganizationVoterGuideMobileDetails'));
const OrganizationVoterGuideOffice = React.lazy(() => import(/* webpackChunkName: 'OrganizationVoterGuideOffice' */ './js/routes/VoterGuide/OrganizationVoterGuideOffice'));
const PageNotFound = React.lazy(() => import(/* webpackChunkName: 'PageNotFound' */ './js/routes/PageNotFound'));
const Pricing = React.lazy(() => import(/* webpackChunkName: 'Pricing' */ './js/routes/More/Pricing'));
const Privacy = React.lazy(() => import(/* webpackChunkName: 'Privacy' */ './js/routes/More/Privacy'));
const ProcessingDonation = React.lazy(() => import(/* webpackChunkName: 'ProcessingDonation' */ './js/routes/More/ProcessingDonation'));
const Ready = React.lazy(() => import(/* webpackChunkName: 'Ready' */ './js/routes/Ready'));
const ReadyLight = React.lazy(() => import(/* webpackChunkName: 'ReadyLight' */ './js/routes/ReadyLight'));
const ReadyRedirect = React.lazy(() => import(/* webpackChunkName: 'ReadyRedirect' */ './js/routes/ReadyRedirect'));
const Register = React.lazy(() => import(/* webpackChunkName: 'Register' */ './js/routes/Register'));
const RegisterToVote = React.lazy(() => import(/* webpackChunkName: 'RegisterToVote' */ './js/routes/More/RegisterToVote'));
const SampleBallot = React.lazy(() => import(/* webpackChunkName: 'SampleBallot' */ './js/routes/Intro/SampleBallot'));
const SearchPage = React.lazy(() => import(/* webpackChunkName: 'SearchPage' */ './js/routes/More/SearchPage'));
const SettingsDashboard = React.lazy(() => import(/* webpackChunkName: 'SettingsDashboard' */ './js/routes/Settings/SettingsDashboard'));
const SettingsMenuMobile = React.lazy(() => import(/* webpackChunkName: 'SettingsMenuMobile' */ './js/routes/Settings/SettingsMenuMobile'));
const SharedItemLanding = React.lazy(() => import(/* webpackChunkName: 'SharedItemLanding' */ './js/routes/SharedItemLanding'));
const SignInEmailProcess = React.lazy(() => import(/* webpackChunkName: 'SignInEmailProcess' */ './js/routes/Process/SignInEmailProcess'));
const SignInJumpProcess = React.lazy(() => import(/* webpackChunkName: 'SignInJumpProcess' */ './js/routes/Process/SignInJumpProcess'));
const TermsOfService = React.lazy(() => import(/* webpackChunkName: 'TermsOfService' */ './js/routes/More/TermsOfService'));
const TwitterHandleLanding = React.lazy(() => import(/* webpackChunkName: 'TwitterHandleLanding' */ './js/routes/TwitterHandleLanding'));
const TwitterSignInProcess = React.lazy(() => import(/* webpackChunkName: 'TwitterSignInProcess' */ './js/routes/Process/TwitterSignInProcess'));
const Values = React.lazy(() => import(/* webpackChunkName: 'Values' */ './js/routes/Values'));
const ValuesList = React.lazy(() => import(/* webpackChunkName: 'ValuesList' */ './js/routes/Values/ValuesList'));
const VerifyEmailProcess = React.lazy(() => import(/* webpackChunkName: 'VerifyEmailProcess' */ './js/routes/Process/VerifyEmailProcess'));
const VerifyRegistration = React.lazy(() => import(/* webpackChunkName: 'VerifyRegistration' */ './js/routes/More/VerifyRegistration'));
const VerifyThisIsMe = React.lazy(() => import(/* webpackChunkName: 'VerifyThisIsMe' */ './js/routes/VoterGuide/VerifyThisIsMe'));
const Vote = React.lazy(() => import(/* webpackChunkName: 'Vote' */ './js/routes/Vote'));
const VoterGuideListDashboard = React.lazy(() => import(/* webpackChunkName: 'VoterGuideListDashboard' */ './js/routes/Settings/VoterGuideListDashboard'));
const VoterGuideSettingsDashboard = React.lazy(() => import(/* webpackChunkName: 'VoterGuideSettingsDashboard' */ './js/routes/Settings/VoterGuideSettingsDashboard'));
const VoterGuideSettingsMenuMobile = React.lazy(() => import(/* webpackChunkName: 'VoterGuideSettingsMenuMobile' */ './js/routes/Settings/VoterGuideSettingsMenuMobile'));
const VoterGuidesMenuMobile = React.lazy(() => import(/* webpackChunkName: 'VoterGuidesMenuMobile' */ './js/routes/Settings/VoterGuidesMenuMobile'));
const VoterGuidesUnderOneValue = React.lazy(() => import(/* webpackChunkName: 'VoterGuidesUnderOneValue' */ './js/routes/Values/VoterGuidesUnderOneValue'));
const WeVoteBallotEmbed = React.lazy(() => import(/* webpackChunkName: 'WeVoteBallotEmbed' */ './js/routes/More/WeVoteBallotEmbed'));
const WelcomeForCampaigns = React.lazy(() => import(/* webpackChunkName: 'WelcomeForCampaigns' */ './js/routes/WelcomeForCampaigns'));
const WelcomeForOrganizations = React.lazy(() => import(/* webpackChunkName: 'WelcomeForOrganizations' */ './js/routes/WelcomeForOrganizations'));
const WelcomeForVoters = React.lazy(() => import(/* webpackChunkName: 'WelcomeForVoters' */ './js/routes/WelcomeForVoters'));
const YourPage = React.lazy(() => import(/* webpackChunkName: 'YourPage' */ './js/routes/YourPage'));

// There are just too many "prop spreadings", if someone can figure out an alternative...
/* eslint-disable react/jsx-props-no-spreading */

class App extends Component {
  constructor (props) {
    super(props);
    this.state = {
      doShowHeader: true,
      doShowFooter: true,
      isInitialized: false,
      showReadyLight: true,
    };
    this.setShowHeader = this.setShowHeader.bind(this);
    this.setShowFooter = this.setShowFooter.bind(this);
    this.setShowHeaderFooter = this.setShowHeaderFooter.bind(this);
    this.setShowReadyHeavy = this.setShowReadyHeavy.bind(this);

    // lazyLoader('bootstrap-social-css').then((result) => {
    //   console.log('lazy loader for bootstrap-social-css returned: ', result);
    // });
    initializejQuery(() => {
      console.log('jquery initialized in App');
      this.setState({ jQueryInitialized: true });
    });
    this.localIsCordova();
  }

  // From index.js (4/20/21)
  localIsCordova () {
    const { cordova } = window;
    window.isCordovaGlobal = cordova !== undefined;    // So now we set a global
    return cordova !== undefined;
  }


  // See https://reactjs.org/docs/error-boundaries.html
  static getDerivedStateFromError (error) { // eslint-disable-line no-unused-vars
    // Update state so the next render will show the fallback UI, We should have a "Oh snap" page
    console.log('App caught error ', error);
    return { hasError: true };
  }

  componentDidMount () {
    // initializeOnce();
    // this.InitializeOnce();
    console.log('href in App.js componentDidMount: ', window.location.href);

  }

  componentDidCatch (error, info) {
    // We should get this information to Splunk!
    console.error('App caught error: ', `${error} with info: `, info);
  }

  setShowHeader (doShowHeader) {
    console.log('-----------HEADER setShowHeader');
    this.setState({ doShowHeader });
  }

  setShowFooter (doShowFooter) {
    console.log('-----------HEADER setShowFooter');
    this.setState({ doShowFooter });
  }

  setShowHeaderFooter (doShow) {
    console.log('-----------HEADER setShowHeaderFooter', doShow);
    // console.log('setShowHeaderFooter -------------- doShow:', doShow);
    this.setState({
      doShowHeader: doShow,
      doShowFooter: doShow,
    });
  }

  // InitializeOnce () {
  //   const { isInitialized } = this.state;
  //   if (isInitialized) {
  //     return;
  //   }
  //
  //   this.positionItemTimer = setTimeout(() => {
  //     // April 2021: This takes a half second to complete, and does tons more than
  //     // you would think server side.  But it should not be necessary on every voterRetrieve,
  //     // but if there are some odd cases where it has to be called agian, deal with them as
  //     // special cases.
  //     // voter_device_id won't be set for first time visitors, until the first API call completes!
  //     const voterDeviceId = VoterStore.voterDeviceId();
  //     if (voterDeviceId) {
  //       VoterActions.voterAddressRetrieve(voterDeviceId);
  //       this.setState({ isInitialized: true });
  //     } else {
  //       console.error('Attempted to send voterAddressRetrieve before we have a voterDeviceId!');
  //     }
  //   }, 5000);  // April 30, 2021: Tuned to keep performance up
  // }

  setShowReadyHeavy () {
    this.setState({ showReadyLight: false });
  }

  render () {
    renderLog('App');
    const { doShowHeader, doShowFooter, jQueryInitialized, showReadyLight } = this.state;
    // console.log(`App doShowHeader: ${doShowHeader}, doShowFooter:${doShowFooter}`);
    let { hostname } = window.location;
    hostname = hostname || '';
    const weVoteSites = ['wevote.us', 'quality.wevote.us', 'localhost', 'silicon', ''];   // localhost on Cordova is a ''
    const isWeVoteMarketingSite = weVoteSites.includes(String(hostname));
    const isNotWeVoteMarketingSite = !isWeVoteMarketingSite;
    const firstVisit = !cookies.getItem('voter_device_id');

    // console.log('href in App.js render: ', window.location.href);

    return (
      <ErrorBoundary>
        <Suspense fallback={<HeaderBarSuspense />}>
          <MuiThemeProvider theme={muiTheme}>
            <ThemeProvider theme={styledTheme}>
              <WeVoteRouter>
                <WeVoteBody>
                  <Header params={{ }} pathname={window.location.href} />
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
                    <Route path="/more/donate_thank_you" component={isNotWeVoteMarketingSite ? ReadyRedirect : DonateThankYou} />
                    <Route path="/more/donate_thank_you" component={isNotWeVoteMarketingSite ? ReadyRedirect : DonateThankYou} />
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
                    <Route path=":twitter_handle($)?" component={TwitterHandleLanding} />
                    <Route path=":twitter_handle/:action_variable" component={TwitterHandleLanding} />
                    <Route path=":twitter_handle/ballot/:ballot_location_shortcut" component={TwitterHandleLanding} />
                    <Route path=":twitter_handle/ballot/election/:google_civic_election_id" component={TwitterHandleLanding} />
                    <Route path=":twitter_handle/ballot/election/:google_civic_election_id/:view_mode" component={TwitterHandleLanding} />
                    <Route path=":twitter_handle/ballot/empty" component={TwitterHandleLanding} />
                    <Route path=":twitter_handle/ballot/id/:ballot_returned_we_vote_id" component={TwitterHandleLanding} />
                    <Route path=":twitter_handle/ballot/id/:ballot_returned_we_vote_id/:view_mode" component={TwitterHandleLanding} />
                    <Route path=":twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/:action_variable" component={TwitterHandleLanding} />
                    <Route path=":twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/:action_variable/m/followers" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
                    <Route path=":twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/:action_variable/m/following" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
                    <Route path=":twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/:action_variable/m/friends" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />} />
                    <Route path=":twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/followers" component={(props) => <TwitterHandleLanding {...props} activeRoute="followers" />} />
                    <Route path=":twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/following" component={(props) => <TwitterHandleLanding {...props} activeRoute="following" />} />
                    <Route path=":twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/m/followers" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
                    <Route path=":twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/m/following" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
                    <Route path=":twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/m/friends" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />} />
                    <Route path=":twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/modal/:modal_to_show" component={TwitterHandleLanding} />
                    <Route path=":twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/modal/:modal_to_show/:shared_item_code" component={TwitterHandleLanding} />
                    <Route path=":twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/modal/:modal_to_show/:shared_item_code" component={TwitterHandleLanding} />
                    <Route path=":twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/positions" component={(props) => <TwitterHandleLanding {...props} activeRoute="positions" />} />
                    <Route path=":twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/positions/modal/:modal_to_show" component={(props) => <TwitterHandleLanding {...props} activeRoute="positions" />} />
                    <Route path=":twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/positions/modal/:modal_to_show/:shared_item_code" component={(props) => <TwitterHandleLanding {...props} activeRoute="positions" />} />
                    <Route path=":twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable" component={TwitterHandleLanding} />
                    <Route path=":twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/:action_variable" component={TwitterHandleLanding} />
                    <Route path=":twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/:action_variable/m/followers" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
                    <Route path=":twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/:action_variable/m/following" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
                    <Route path=":twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/:action_variable/m/friends" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />} />
                    <Route path=":twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/followers" component={(props) => <TwitterHandleLanding {...props} activeRoute="followers" />} />
                    <Route path=":twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/following" component={(props) => <TwitterHandleLanding {...props} activeRoute="following" />} />
                    <Route path=":twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/m/followers" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
                    <Route path=":twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/m/following" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
                    <Route path=":twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/m/friends" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />} />
                    <Route path=":twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/modal/:modal_to_show" component={TwitterHandleLanding} />
                    <Route path=":twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/modal/:modal_to_show/:shared_item_code" component={TwitterHandleLanding} />
                    <Route path=":twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/positions" component={(props) => <TwitterHandleLanding {...props} activeRoute="positions" />} />
                    <Route path=":twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/positions/modal/:modal_to_show" component={(props) => <TwitterHandleLanding {...props} activeRoute="positions" />} />
                    <Route path=":twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/positions/modal/:modal_to_show/:shared_item_code" component={(props) => <TwitterHandleLanding {...props} activeRoute="positions" />} />
                    <Route path=":twitter_handle/followers" component={(props) => <TwitterHandleLanding {...props} activeRoute="followers" />} />
                    <Route path=":twitter_handle/following" component={(props) => <TwitterHandleLanding {...props} activeRoute="following" />} />
                    <Route path=":twitter_handle/m/followers" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
                    <Route path=":twitter_handle/m/following" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
                    <Route path=":twitter_handle/m/friends" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />}  />
                    <Route path=":twitter_handle/modal/:modal_to_show" component={TwitterHandleLanding} />
                    <Route path=":twitter_handle/modal/:modal_to_show/:shared_item_code" component={TwitterHandleLanding} />
                    <Route path=":twitter_handle/positions" component={(props) => <TwitterHandleLanding {...props} activeRoute="positions" />} />
                    <Route path=":twitter_handle/positions/modal/:modal_to_show" component={(props) => <TwitterHandleLanding {...props} activeRoute="positions" />} />
                    <Route path=":twitter_handle/positions/modal/:modal_to_show/:shared_item_code" component={(props) => <TwitterHandleLanding {...props} activeRoute="positions" />} />
                    <Route path="*" component={PageNotFound} />
                  </Switch>
                  {/*
                  <DelayedLoad waitBeforeShow={500}>
                    <Suspense fallback={<span>&nbsp;</span>}>
                      <MainFooter displayFooter={doShowFooter} />
                    </Suspense>
                  </DelayedLoad>
                  */}
                </WeVoteBody>
              </WeVoteRouter>
            </ThemeProvider>
          </MuiThemeProvider>
        </Suspense>
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
  max-width: 960px;
  position: relative;
  z-index: 0;
`;

export default App;
