import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import Tracker from '@openreplay/tracker';
import React, { Component, Suspense } from 'react';
import FullStory from 'react-fullstory';
import ReactGA from 'react-ga';
import { Redirect, Route, Switch } from 'react-router-dom';
import styled from 'styled-components';
import muiTheme from './js/common/components/Style/muiTheme';
import ErrorBoundary from './js/common/components/Widgets/ErrorBoundary';
import LoadingWheelComp from './js/common/components/Widgets/LoadingWheelComp';
import WeVoteRouter from './js/common/components/Widgets/WeVoteRouter';
import { normalizedHref } from './js/common/utils/hrefUtils';
import { isWebApp } from './js/common/utils/isCordovaOrWebApp';
import { renderLog } from './js/common/utils/logging';
import Header from './js/components/Navigation/Header';
import HeaderBarSuspense from './js/components/Navigation/HeaderBarSuspense';
import webAppConfig from './js/config';
import AppObservableStore, { messageService } from './js/stores/AppObservableStore';
import initializeFacebookSDK from './js/utils/initializeFacebookSDK';
import initializejQuery from './js/utils/initializejQuery';
import RouterV5SendMatch from './js/utils/RouterV5SendMatch';
// importRemoveCordovaListenersToken1  -- Do not remove this line!

// Root URL pages

const About = React.lazy(() => import(/* webpackChunkName: 'About' */ './js/pages/More/About'));
const AbsenteeBallot = React.lazy(() => import(/* webpackChunkName: 'AbsenteeBallot' */ './js/pages/More/AbsenteeBallot'));
const AddCandidateForExtension = React.lazy(() => import(/* webpackChunkName: 'AddCandidateForExtension' */ './js/pages/Ballot/AddCandidateExtension/AddCandidateForExtension'));
const AppleSignInProcess = React.lazy(() => import(/* webpackChunkName: 'AppleSignInProcess' */ './js/pages/Process/AppleSignInProcess'));
const Attributions = React.lazy(() => import(/* webpackChunkName: 'Attributions' */ './js/pages/More/Attributions'));
const Ballot = React.lazy(() => import(/* webpackChunkName: 'Ballot' */ './js/pages/Ballot/Ballot'));
const Candidate = React.lazy(() => import(/* webpackChunkName: 'Candidate' */ './js/pages/Ballot/Candidate'));
const CandidateForExtension = React.lazy(() => import(/* webpackChunkName: 'EditCandidateForExtension' */ './js/pages/Ballot/EditCandidateForExtension/EditCandidateForExtension'));
const ClaimYourPage = React.lazy(() => import(/* webpackChunkName: 'ClaimYourPage' */ './js/pages/Settings/ClaimYourPage'));
const Credits = React.lazy(() => import(/* webpackChunkName: 'Credits' */ './js/pages/More/Credits'));
const Donate = React.lazy(() => import(/* webpackChunkName: 'Donate' */ './js/pages/More/Donate'));
const ElectionReminder = React.lazy(() => import(/* webpackChunkName: 'ElectionReminder' */ './js/pages/More/ElectionReminder'));
const Elections = React.lazy(() => import(/* webpackChunkName: 'Elections' */ './js/pages/More/Elections'));
const ExtensionSignIn = React.lazy(() => import(/* webpackChunkName: 'ExtensionSignIn' */ './js/pages/More/ExtensionSignIn'));
const FAQ = React.lazy(() => import(/* webpackChunkName: 'FAQ' */ './js/pages/More/FAQ'));
const FacebookInvitableFriends = React.lazy(() => import(/* webpackChunkName: 'FacebookInvitableFriends' */ './js/pages/FacebookInvitableFriends'));
const FacebookLandingProcess = React.lazy(() => import(/* webpackChunkName: 'FacebookLandingProcess' */ './js/pages/Process/FacebookLandingProcess'));
const FacebookRedirectToWeVote = React.lazy(() => import(/* webpackChunkName: 'FacebookRedirectToWeVote' */ './js/pages/More/FacebookRedirectToWeVote'));
const Footer = React.lazy(() => import(/* webpackChunkName: 'Footer' */ './js/components/Navigation/Footer'));
const FindFriendsRoot = React.lazy(() => import(/* webpackChunkName: 'FindFriendsRoot' */ './js/pages/Friends/FindFriendsRoot'));
const FriendIntroLanding = React.lazy(() => import(/* webpackChunkName: 'FriendIntroLanding' */ './js/pages/FriendIntro/FriendIntroLanding'));
const FriendInvitationByEmailVerifyProcess = React.lazy(() => import(/* webpackChunkName: 'FriendInvitationByEmailVerifyProcess' */ './js/pages/Process/FriendInvitationByEmailVerifyProcess'));
const FriendInvitationOnboarding = React.lazy(() => import(/* webpackChunkName: 'FriendInvitationOnboarding' */ './js/pages/Intro/FriendInvitationOnboarding'));
const Friends = React.lazy(() => import(/* webpackChunkName: 'Friends' */ './js/pages/Friends/Friends'));
const GetStarted2019 = React.lazy(() => import(/* webpackChunkName: 'GetStarted' */ './js/pages/Intro/GetStarted2019'));
const HamburgerMenu = React.lazy(() => import(/* webpackChunkName: 'HamburgerMenu' */ './js/pages/Settings/HamburgerMenu'));
const HowItWorks = React.lazy(() => import(/* webpackChunkName: 'HowItWorks' */ './js/pages/HowItWorks'));
const HowWeVoteHelps = React.lazy(() => import(/* webpackChunkName: 'HowWeVoteHelps' */ './js/pages/More/HowWeVoteHelps'));
const Intro = React.lazy(() => import(/* webpackChunkName: 'Intro' */ './js/pages/Intro/Intro'));
const IntroNetwork = React.lazy(() => import(/* webpackChunkName: 'IntroNetwork' */ './js/pages/Intro/IntroNetwork'));
const Location = React.lazy(() => import(/* webpackChunkName: 'Location' */ './js/pages/Settings/Location'));
const Measure = React.lazy(() => import(/* webpackChunkName: 'Measure' */ './js/pages/Ballot/Measure'));
const News = React.lazy(() => import(/* webpackChunkName: 'News' */ './js/pages/Activity/News'));
const Office = React.lazy(() => import(/* webpackChunkName: 'Office' */ './js/pages/Ballot/Office'));
const Opinions2020 = React.lazy(() => import(/* webpackChunkName: 'Opinions2020' */ './js/pages/Opinions2020'));
const OpinionsFollowed = React.lazy(() => import(/* webpackChunkName: 'OpinionsFollowed' */ './js/pages/OpinionsFollowed'));
const OpinionsIgnored = React.lazy(() => import(/* webpackChunkName: 'OpinionsIgnored' */ './js/pages/OpinionsIgnored'));
const OrganizationVoterGuide = React.lazy(() => import(/* webpackChunkName: 'OrganizationVoterGuide' */ './js/pages/VoterGuide/OrganizationVoterGuide'));
const OrganizationVoterGuideCandidate = React.lazy(() => import(/* webpackChunkName: 'OrganizationVoterGuideCandidate' */ './js/pages/VoterGuide/OrganizationVoterGuideCandidate'));
const OrganizationVoterGuideMeasure = React.lazy(() => import(/* webpackChunkName: 'OrganizationVoterGuideMeasure' */ './js/pages/VoterGuide/OrganizationVoterGuideMeasure'));
const OrganizationVoterGuideMobileDetails = React.lazy(() => import(/* webpackChunkName: 'OrganizationVoterGuideMobileDetails' */ './js/pages/VoterGuide/OrganizationVoterGuideMobileDetails'));
const OrganizationVoterGuideOffice = React.lazy(() => import(/* webpackChunkName: 'OrganizationVoterGuideOffice' */ './js/pages/VoterGuide/OrganizationVoterGuideOffice'));
const PageNotFound = React.lazy(() => import(/* webpackChunkName: 'PageNotFound' */ './js/pages/PageNotFound'));
const Pricing = React.lazy(() => import(/* webpackChunkName: 'Pricing' */ './js/pages/More/Pricing'));
const Privacy = React.lazy(() => import(/* webpackChunkName: 'Privacy' */ './js/pages/More/Privacy'));
const ProcessingDonation = React.lazy(() => import(/* webpackChunkName: 'ProcessingDonation' */ './js/pages/More/ProcessingDonation'));
const Ready = React.lazy(() => import(/* webpackChunkName: 'Ready' */ './js/pages/Ready'));
const ReadyLight = React.lazy(() => import(/* webpackChunkName: 'ReadyLight' */ './js/pages/ReadyLight'));
const ReadyRedirect = React.lazy(() => import(/* webpackChunkName: 'ReadyRedirect' */ './js/pages/ReadyRedirect'));
const Register = React.lazy(() => import(/* webpackChunkName: 'Register' */ './js/pages/Register'));
const RegisterToVote = React.lazy(() => import(/* webpackChunkName: 'RegisterToVote' */ './js/pages/More/RegisterToVote'));
const RemindContactsRoot = React.lazy(() => import(/* webpackChunkName: 'RemindContactsRoot' */ './js/pages/Remind/RemindContactsRoot'));
const SampleBallot = React.lazy(() => import(/* webpackChunkName: 'SampleBallot' */ './js/pages/Intro/SampleBallot'));
const SearchPage = React.lazy(() => import(/* webpackChunkName: 'SearchPage' */ './js/pages/More/SearchPage'));
const SettingsDashboard = React.lazy(() => import(/* webpackChunkName: 'SettingsDashboard' */ './js/pages/Settings/SettingsDashboard'));
const SettingsMenuMobile = React.lazy(() => import(/* webpackChunkName: 'SettingsMenuMobile' */ './js/pages/Settings/SettingsMenuMobile'));
const SetUpAccountRoot = React.lazy(() => import(/* webpackChunkName: 'SetUpAccountRoot' */ './js/pages/SetUpAccount/SetUpAccountRoot'));
const SharedItemLanding = React.lazy(() => import(/* webpackChunkName: 'SharedItemLanding' */ './js/pages/SharedItemLanding'));
const SignInEmailProcess = React.lazy(() => import(/* webpackChunkName: 'SignInEmailProcess' */ './js/pages/Process/SignInEmailProcess'));
const SignInJumpProcess = React.lazy(() => import(/* webpackChunkName: 'SignInJumpProcess' */ './js/pages/Process/SignInJumpProcess'));
const TermsOfService = React.lazy(() => import(/* webpackChunkName: 'TermsOfService' */ './js/pages/More/TermsOfService'));
const TwitterHandleLanding = React.lazy(() => import(/* webpackChunkName: 'TwitterHandleLanding' */ './js/pages/TwitterHandleLanding'));
const TwitterSignInProcess = React.lazy(() => import(/* webpackChunkName: 'TwitterSignInProcess' */ './js/pages/Process/TwitterSignInProcess'));
const UnsubscribeRoot = React.lazy(() => import(/* webpackChunkName: 'UnsubscribeRoot' */ './js/pages/Settings/UnsubscribeRoot'));
const Values = React.lazy(() => import(/* webpackChunkName: 'Values' */ './js/pages/Values'));
const ValuesList = React.lazy(() => import(/* webpackChunkName: 'ValuesList' */ './js/pages/Values/ValuesList'));
const VerifyEmailProcess = React.lazy(() => import(/* webpackChunkName: 'VerifyEmailProcess' */ './js/pages/Process/VerifyEmailProcess'));
const VerifyRegistration = React.lazy(() => import(/* webpackChunkName: 'VerifyRegistration' */ './js/pages/More/VerifyRegistration'));
const VerifyThisIsMe = React.lazy(() => import(/* webpackChunkName: 'VerifyThisIsMe' */ './js/pages/VoterGuide/VerifyThisIsMe'));
const Vote = React.lazy(() => import(/* webpackChunkName: 'Vote' */ './js/pages/Vote'));
const VoterGuideListDashboard = React.lazy(() => import(/* webpackChunkName: 'VoterGuideListDashboard' */ './js/pages/Settings/VoterGuideListDashboard'));
const VoterGuideSettingsDashboard = React.lazy(() => import(/* webpackChunkName: 'VoterGuideSettingsDashboard' */ './js/pages/Settings/VoterGuideSettingsDashboard'));
const VoterGuideSettingsMenuMobile = React.lazy(() => import(/* webpackChunkName: 'VoterGuideSettingsMenuMobile' */ './js/pages/Settings/VoterGuideSettingsMenuMobile'));
const VoterGuidesMenuMobile = React.lazy(() => import(/* webpackChunkName: 'VoterGuidesMenuMobile' */ './js/pages/Settings/VoterGuidesMenuMobile'));
const OneValue = React.lazy(() => import(/* webpackChunkName: 'OneValue' */ './js/pages/Values/OneValue'));
const WeVoteBallotEmbed = React.lazy(() => import(/* webpackChunkName: 'WeVoteBallotEmbed' */ './js/pages/More/WeVoteBallotEmbed'));
const WelcomeForCampaigns = React.lazy(() => import(/* webpackChunkName: 'WelcomeForCampaigns' */ './js/pages/WelcomeForCampaigns'));
const WelcomeForOrganizations = React.lazy(() => import(/* webpackChunkName: 'WelcomeForOrganizations' */ './js/pages/WelcomeForOrganizations'));
const WelcomeForVoters = React.lazy(() => import(/* webpackChunkName: 'WelcomeForVoters' */ './js/pages/WelcomeForVoters'));
const YourPage = React.lazy(() => import(/* webpackChunkName: 'YourPage' */ './js/pages/YourPage'));

// There are just too many "prop spreadings" in the use of Route, if someone can figure out an alternative...
/* eslint-disable react/jsx-props-no-spreading */

class App extends Component {
  constructor (props) {
    super(props);
    this.state = {
      // doShowHeader: true,
      // doShowFooter: true,
      showReadyLight: true,
      enableFullStory: false,
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
    this.appStateSubscription = messageService.getMessage().subscribe(() => this.onAppObservableStoreChange());

    let { hostname } = window.location;
    hostname = hostname || '';
    initializejQuery(() => {
      AppObservableStore.siteConfigurationRetrieve(hostname);
    });
    // console.log('href in App.js componentDidMount: ', window.location.href);
    // console.log('normalizedHrefPage in App.js componentDidMount: ', normalizedHref());
    const onWeVoteUS = (hostname && (hostname.toLowerCase() === 'wevote.us'));
    const onMobileApp = false;
    if (onWeVoteUS || onMobileApp) {
      if (webAppConfig.FULL_STORY_ORG) {
        setTimeout(() => {
          console.log('FullStory ENABLED');
          this.setState({ enableFullStory: true });
        }, 3000);
      }
    }
    if (!webAppConfig.ENABLE_FACEBOOK) {
      setTimeout(() => {
        // Does this message make any sense anymore? ... We need to start this initialization early since there is a delay getting the FB object in place
        initializeFacebookSDK();
      }, 4000);
    }
  }

  componentDidCatch (error, info) {
    // We should get this information to Splunk!
    console.error('App caught error: ', `${error} with info: `, info);
  }

  componentWillUnmount () {
    this.appStateSubscription.unsubscribe();
    // removeCordovaListenersToken -- Do not remove this line!
  }

  onAppObservableStoreChange () {
    if (!AppObservableStore.getGoogleAnalyticsEnabled() && !AppObservableStore.getGoogleAnalyticsPending()) {
      AppObservableStore.setGoogleAnalyticsPending(true);
      setTimeout(() => {
        const storedTrackingID = AppObservableStore.getChosenGoogleAnalyticsTrackingID();
        const configuredTrackingID = webAppConfig.GOOGLE_ANALYTICS_TRACKING_ID;
        const trackingID = storedTrackingID || configuredTrackingID;
        if (trackingID) {
          console.log('Google Analytics ENABLED');
          ReactGA.initialize(trackingID);
          AppObservableStore.setGoogleAnalyticsEnabled(true);
          AppObservableStore.setGoogleAnalyticsPending(false);
        } else {
          console.log('Google Analytics did not receive a trackingID, NOT ENABLED');
        }
      }, 3000);
    }
    if (!AppObservableStore.getOpenReplayEnabled() && !AppObservableStore.getOpenReplayPending()) {
      AppObservableStore.setOpenReplayPending(true);
      setTimeout(() => {
        // const chosenProjectKey = AppObservableStore.getChosenOpenReplayTrackingID();
        const weVoteOpenReplayProjectKey = webAppConfig.OPEN_REPLAY_PROJECT_KEY;
        const weVoteOpenReplayIngestPoint = webAppConfig.OPEN_REPLAY_INGEST_POINT;
        // const openReplayProjectKey = chosenProjectKey || weVoteOpenReplayProjectKey;
        const openReplayProjectKey = weVoteOpenReplayProjectKey || '';
        const openReplayIngestPoint = weVoteOpenReplayIngestPoint || false;
        if (openReplayProjectKey) {
          console.log('OpenReplay ENABLED');
          if (openReplayIngestPoint) {
            const tracker1 = new Tracker({
              projectKey: openReplayProjectKey,
              ingestPoint: openReplayIngestPoint,
            });
            tracker1.start();
            AppObservableStore.setOpenReplayTracker(tracker1);
          } else {
            const tracker2 = new Tracker({
              projectKey: openReplayProjectKey,
            });
            tracker2.start();
            AppObservableStore.setOpenReplayTracker(tracker2);
          }
          AppObservableStore.setOpenReplayEnabled(true);
          AppObservableStore.setOpenReplayPending(false);
        } else {
          console.log('OpenReplay did not receive a projectKey, NOT ENABLED');
        }
      }, 3000);
    }
  }


  setShowReadyHeavy () {
    this.setState({ showReadyLight: false });
  }

  localIsCordova () {
    const { cordova } = window;
    window.isCordovaGlobal = cordova !== undefined;    // So now we set a global
    return cordova !== undefined;
  }

  render () {
    renderLog('App');
    const { showReadyLight, enableFullStory } = this.state;
    // console.log('App.js:  enableFullStory: ', enableFullStory);
    let { hostname } = window.location;
    hostname = hostname || '';
    const weVoteSites = ['wevote.org', 'www.wevote.org', 'wevote.us', 'quality.wevote.us', 'www.wevote.us', 'localhost', 'silicon', ''];   // localhost on Cordova is a ''
    const isWeVoteMarketingSite = weVoteSites.includes(String(hostname));
    const isNotWeVoteMarketingSite = !isWeVoteMarketingSite;
    // const firstVisit = !cookies.getItem('voter_device_id');

    if (isWebApp()) {
      console.log('WebApp: href in App.js render: ', window.location.href);
    } else {
      console.log('Cordova:  href hash in App.js render: ', window.location.hash);
    }

    /*
    Note: To debug routing, set a breakpoint in the class that routing takes you to -- then look at the received props.
    The props.match.path shows exactly which route string from this file, was selected by the <Switch>
    */

    return (
      <ErrorBoundary>
        {enableFullStory && <FullStory org={webAppConfig.FULL_STORY_ORG} />}
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={muiTheme}>
            {/* March 2022: We used to have two themeproviders here, one for material-ui, and one for styled-components, but the two are combined in V5 MUI */}
            <WeVoteRouter>
              <WeVoteBody>
                {/* DO NOT put SnackNotifier or anything else that is non-essential here (to keep it out of the main chunk). */}
                <Suspense fallback={<HeaderBarSuspense />}>
                  <Header params={{ }} pathname={normalizedHref()} />
                </Suspense>
                <Suspense fallback={<LoadingWheelComp />}>
                  <Switch>
                    <Route path="/" exact>
                      {() => {
                        if (showReadyLight) {
                          return <ReadyLight showReadyHeavy={this.setShowReadyHeavy} />;
                        } else {
                          return <Redirect to="/ready" />;
                        }
                      }}
                    </Route>
                    <Route path="/-/:custom_link_string" exact component={SharedItemLanding} />
                    <Route path="/-:shared_item_code/modal/share" exact component={SharedItemLanding} />
                    <Route path="/-:shared_item_code" exact component={SharedItemLanding} />
                    <Route path="/about" exact><About /></Route>
                    <Route path="/add-candidate-for-extension" component={AddCandidateForExtension} />
                    <Route path="/applesigninprocess" component={AppleSignInProcess} />
                    <Route path="/ballot" exact component={Ballot} />
                    <Route path="/ballot/election/:google_civic_election_id" exact component={Ballot} />
                    <Route path="/ballot/election/:google_civic_election_id/modal/:modal_to_show" exact component={Ballot} />
                    <Route path="/ballot/election/:google_civic_election_id/modal/:modal_to_show/:shared_item_code" component={Ballot} />
                    <Route path="/ballot/id/:ballot_returned_we_vote_id" exact component={Ballot} />
                    <Route path="/ballot/id/:ballot_returned_we_vote_id/modal/:modal_to_show" exact component={Ballot} />
                    <Route path="/ballot/id/:ballot_returned_we_vote_id/modal/:modal_to_show/:shared_item_code" component={Ballot} />
                    <Route path="/ballot/modal/:modal_to_show/:shared_item_code" component={Ballot} />
                    <Route path="/ballot/modal/:modal_to_show" exact component={Ballot} />
                    <Route path="/ballot/vote" component={Vote} />
                    <Route path="/ballot?voter_refresh_timer_on=:voter_refresh_timer_on" component={Ballot} />
                    <Route path="/ballot/:ballot_location_shortcut/modal/:modal_to_show/:shared_item_code" component={Ballot} />
                    <Route path="/ballot/:ballot_location_shortcut/modal/:modal_to_show" exact component={Ballot} />
                    <Route path="/ballot/:ballot_location_shortcut" exact component={Ballot} />
                    <Route path="/candidate-for-extension" component={CandidateForExtension} />
                    <Route path="/candidate/:candidate_we_vote_id/b/:back_to_variable/modal/:modal_to_show" exact component={Candidate} />
                    <Route path="/candidate/:candidate_we_vote_id/b/:back_to_variable/modal/:modal_to_show/:shared_item_code" exact component={Candidate} />
                    <Route path="/candidate/:candidate_we_vote_id/b/:back_to_variable" exact component={Candidate} />
                    <Route path="/candidate/:candidate_we_vote_id/b/:back_to_variable/" exact component={Candidate} />
                    <Route path="/candidate/:candidate_we_vote_id/modal/:modal_to_show/:shared_item_code" component={Candidate} />
                    <Route path="/candidate/:candidate_we_vote_id/modal/:modal_to_show" exact component={Candidate} />
                    <Route path="/candidate/:candidate_we_vote_id/:back_to_variable/:organization_we_vote_id" exact component={OrganizationVoterGuideCandidate} />
                    <Route path="/candidate/:candidate_we_vote_id/:organization_we_vote_id" exact component={OrganizationVoterGuideCandidate} />
                    <Route path="/candidate/:candidate_we_vote_id" exact component={Candidate} />
                    <Route path="/facebook_invitable_friends" component={FacebookInvitableFriends} />
                    <Route path="/findfriends/:set_up_page" exact component={FindFriendsRoot} />
                    <Route path="/findfriends" exact><FindFriendsRoot /></Route>
                    <Route path="/friends" exact component={Friends} />
                    <Route path="/friends/:tabItem" exact component={Friends} />
                    <Route path="/for-campaigns" component={isNotWeVoteMarketingSite ? ReadyRedirect : (props) => <WelcomeForCampaigns {...props} pathname="/for-campaigns" />} />
                    <Route path="/for-organizations" component={isNotWeVoteMarketingSite ? ReadyRedirect : (props) => <WelcomeForOrganizations {...props} pathname="/for-organizations" />} />
                    <Route path="/how/:category_string" component={isNotWeVoteMarketingSite ? ReadyRedirect : HowItWorks} />
                    <Route path="/how" exact component={isNotWeVoteMarketingSite ? ReadyRedirect : HowItWorks} />
                    <Route path="/intro" exact component={Intro} />
                    <Route path="/intro/get_started" component={GetStarted2019} />
                    <Route path="/intro/sample_ballot" component={SampleBallot} />
                    <Route path="/measure/:measure_we_vote_id/b/:back_to_variable/modal/:modal_to_show/:shared_item_code" component={Measure} />
                    <Route path="/measure/:measure_we_vote_id/b/:back_to_variable/modal/:modal_to_show" component={Measure} />
                    <Route path="/measure/:measure_we_vote_id/b/:back_to_variable" exact component={Measure} />
                    <Route path="/measure/:measure_we_vote_id/b/:back_to_variable/" exact component={Measure} />
                    <Route path="/measure/:measure_we_vote_id/modal/:modal_to_show/:shared_item_code" component={Measure} />
                    <Route path="/measure/:measure_we_vote_id/modal/:modal_to_show" exact component={Measure} />
                    <Route path="/measure/:measure_we_vote_id/:back_to_variable/:organization_we_vote_id" exact component={OrganizationVoterGuideMeasure} />
                    <Route path="/measure/:measure_we_vote_id" exact component={Measure} />
                    <Route path="/more/about" component={About} />
                    <Route path="/more/absentee" component={AbsenteeBallot} />
                    <Route path="/more/alerts" component={ElectionReminder} />
                    <Route path="/more/attributions" component={Attributions} />
                    <Route path="/more/credits" component={Credits} />
                    <Route path="/more/donate" component={(isNotWeVoteMarketingSite || this.localIsCordova()) ? ReadyRedirect : Donate} />
                    <Route path="/more/elections" component={Elections} />
                    <Route path="/more/extensionsignin" component={ExtensionSignIn} />
                    <Route path="/more/facebooklandingprocess" component={FacebookLandingProcess} />
                    <Route path="/more/facebookredirecttowevote" component={FacebookRedirectToWeVote} />
                    <Route path="/more/faq" component={FAQ} />
                    <Route path="/more/howwevotehelps" component={HowWeVoteHelps} />
                    <Route path="/more/jump" component={SignInJumpProcess} />
                    <Route path="/more/myballot" component={WeVoteBallotEmbed} />
                    <Route path="/more/network/friends" component={Friends} />
                    <Route path="/more/network/key/:invitation_secret_key/ignore" component={FriendInvitationByEmailVerifyProcess} />
                    <Route path="/more/network/key/:invitation_secret_key" exact component={FriendInvitationByEmailVerifyProcess} />
                    <Route path="/more/network/organizations" component={Values} />
                    <Route path="/more/network" exact component={Friends} />
                    <Route path="/more/pricing/:pricing_choice" component={isNotWeVoteMarketingSite ? ReadyRedirect : Pricing} />
                    <Route path="/more/pricing" exact component={isNotWeVoteMarketingSite ? ReadyRedirect : Pricing} />
                    <Route path="/more/privacy" component={Privacy} />
                    <Route path="/more/processing_donation" component={ProcessingDonation} />
                    <Route path="/more/register" component={RegisterToVote} />
                    <Route path="/more/search_page/:encoded_search_string" component={SearchPage} />
                    <Route path="/more/search_page" exact component={SearchPage} />
                    <Route path="/more/terms" component={TermsOfService} />
                    <Route path="/more/verify" component={VerifyRegistration} />
                    <Route path="/news" exact component={News} />
                    <Route path="/news/a/" exact component={News} />
                    <Route path="/news/a/:activity_tidbit_we_vote_id" exact component={News} />
                    <Route path="/office/:office_we_vote_id/b/:back_to_variable" exact component={Office} />
                    <Route path="/office/:office_we_vote_id/b/:back_to_variable/" exact component={Office} />
                    <Route path="/office/:office_we_vote_id/b/:back_to_variable/modal/:modal_to_show" component={Office} />
                    <Route path="/office/:office_we_vote_id/modal/:modal_to_show" exact component={Office} />
                    <Route path="/office/:office_we_vote_id/modal/:modal_to_show/:shared_item_code" component={Office} />
                    <Route path="/office/:office_we_vote_id/:back_to_variable/:organization_we_vote_id" exact component={OrganizationVoterGuideOffice} />
                    <Route path="/office/:office_we_vote_id/:organization_we_vote_id" exact component={OrganizationVoterGuideOffice} />
                    <Route path="/office/:office_we_vote_id" exact component={Office} />
                    <Route path="/opinions/f/:selectedFilter" component={Opinions2020} />
                    <Route path="/opinions/s/:searchTextDefault" component={Opinions2020} />
                    <Route path="/opinions_followed" component={OpinionsFollowed} />
                    <Route path="/opinions_ignored" component={OpinionsIgnored} />
                    <Route path="/opinions" exact component={Opinions2020} />
                    <Route path="/privacy" component={Privacy} />
                    <Route path="/personalized_score" component={FriendInvitationOnboarding} />
                    <Route path="/ready" exact><Ready /></Route>
                    <Route path="/ready/election/:google_civic_election_id" component={Ready} />
                    <Route path="/ready/modal/:modal_to_show/:shared_item_code" exact render={(props) => (<RouterV5SendMatch componentName="Ready" {...props} />)} />
                    <Route path="/ready/modal/:modal_to_show" exact render={(props) => (<RouterV5SendMatch componentName="Ready" {...props} />)} />
                    <Route path="/register" component={Register} />
                    <Route path="/remind/:set_up_page" exact component={RemindContactsRoot} />
                    <Route path="/remind" exact><RemindContactsRoot /></Route>
                    <Route path="/settings" exact component={SettingsDashboard} />
                    <Route path="/settings/claim" exact component={ClaimYourPage} />
                    <Route path="/settings/hamburger" exact component={HamburgerMenu} />
                    <Route path="/settings/location" exact component={Location} />
                    <Route path="/settings/menu" exact component={SettingsMenuMobile} />
                    <Route path="/settings/voterguidelist" exact component={VoterGuideListDashboard} />
                    <Route path="/settings/voterguidesmenu" exact component={VoterGuidesMenuMobile} />
                    <Route path="/settings/issues/:edit_mode" render={(props) => (<RouterV5SendMatch componentName="SettingsDashboard" {...props} />)} />
                    <Route path="/settings/:edit_mode/:voter_guide_we_vote_id" render={(props) => (<RouterV5SendMatch componentName="SettingsDashboard" {...props} />)} />
                    <Route path="/settings/:edit_mode" exact render={(props) => (<RouterV5SendMatch componentName="SettingsDashboard" {...props} />)} />
                    <Route path="/sign_in_email/:email_secret_key" component={SignInEmailProcess} />
                    <Route path="/setupaccount/:set_up_page" exact component={SetUpAccountRoot} />
                    <Route path="/setupaccount" exact><SetUpAccountRoot /></Route>
                    <Route path="/terms" component={TermsOfService} />
                    <Route path="/twitter_sign_in" exact><TwitterSignInProcess /></Route>
                    <Route path="/twittersigninprocess/:sign_in_step" component={TwitterSignInProcess} />
                    <Route path="/unsubscribe/:subscription_secret_key/:unsubscribe_modifier/instant" exact component={(props) => <UnsubscribeRoot {...props} instantUnsubscribe />} />
                    <Route path="/unsubscribe/:subscription_secret_key/:unsubscribe_modifier" exact component={UnsubscribeRoot} />
                    <Route path="/unsubscribe/:subscription_secret_key" exact component={UnsubscribeRoot} />
                    <Route path="/values/list" component={ValuesList} />
                    <Route path="/values" exact component={Values} />
                    <Route path="/value/:value_slug" component={OneValue} />
                    <Route path="/verify_email/:email_secret_key" component={VerifyEmailProcess} />
                    <Route path="/verifythisisme/:twitter_handle" component={VerifyThisIsMe} />
                    <Route path="/vg/:voter_guide_we_vote_id/settings/menu" component={VoterGuideSettingsMenuMobile} />
                    <Route path="/vg/:voter_guide_we_vote_id/settings/positions" component={VoterGuideSettingsDashboard} />
                    <Route path="/vg/:voter_guide_we_vote_id/settings" exact component={VoterGuideSettingsDashboard} />
                    <Route path="/voterguide/:organization_we_vote_id/ballot" exact component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                    <Route path="/voterguide/:organization_we_vote_id/ballot/election/:google_civic_election_id/ballot" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                    <Route path="/voterguide/:organization_we_vote_id/ballot/election/:google_civic_election_id/followers" component={(props) => <OrganizationVoterGuide {...props} activeRoute="followers" />} />
                    <Route path="/voterguide/:organization_we_vote_id/ballot/election/:google_civic_election_id/following" component={(props) => <OrganizationVoterGuide {...props} activeRoute="following" />} />
                    <Route path="/voterguide/:organization_we_vote_id/ballot/election/:google_civic_election_id/m/followers" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
                    <Route path="/voterguide/:organization_we_vote_id/ballot/election/:google_civic_election_id/m/following" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
                    <Route path="/voterguide/:organization_we_vote_id/ballot/election/:google_civic_election_id/m/friends" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />} />
                    <Route path="/voterguide/:organization_we_vote_id/ballot/election/:google_civic_election_id/positions" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                    <Route path="/voterguide/:organization_we_vote_id/ballot/election/:google_civic_election_id/positions/modal/:modal_to_show/:shared_item_code" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                    <Route path="/voterguide/:organization_we_vote_id/ballot/election/:google_civic_election_id/positions/modal/:modal_to_show" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                    <Route path="/voterguide/:organization_we_vote_id/ballot/election/:google_civic_election_id" exact component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                    <Route path="/voterguide/:organization_we_vote_id/ballot/empty" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                    <Route path="/voterguide/:organization_we_vote_id/ballot/id/:ballot_returned_we_vote_id" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                    <Route path="/voterguide/:organization_we_vote_id/ballot/:ballot_location_shortcut" exact component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                    {/* Start of btcand */}
                    <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/followers" component={(props) => <OrganizationVoterGuide {...props} activeRoute="followers" />} />
                    <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/following" component={(props) => <OrganizationVoterGuide {...props} activeRoute="following" />} />
                    <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/m/followers" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
                    <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/m/following" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
                    <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/m/friends" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />} />
                    <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/modal/:modal_to_show" exact component={OrganizationVoterGuide} />
                    <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/modal/:modal_to_show/:shared_item_code" component={OrganizationVoterGuide} />
                    <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/positions" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                    <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/positions/modal/:modal_to_show" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                    <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/positions/modal/:modal_to_show/:shared_item_code" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                    <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/:action_variable/m/followers" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
                    <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/:action_variable/m/following" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
                    <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/:action_variable/m/friends" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />} />
                    <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/:action_variable" component={OrganizationVoterGuide} />
                    <Route path="/voterguide/:organization_we_vote_id/btcand/:back_to_cand_we_vote_id/b/:back_to_variable" exact component={OrganizationVoterGuide} />
                    {/* Start of btmeas */}
                    <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/followers" component={(props) => <OrganizationVoterGuide {...props} activeRoute="followers" />} />
                    <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/following" component={(props) => <OrganizationVoterGuide {...props} activeRoute="following" />} />
                    <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/m/followers" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
                    <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/m/following" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
                    <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/m/friends" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />} />
                    <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/modal/:modal_to_show" component={OrganizationVoterGuide} />
                    <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/modal/:modal_to_show/:shared_item_code" component={OrganizationVoterGuide} />
                    <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/positions" exact component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                    <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/positions/modal/:modal_to_show" exact component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                    <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/positions/modal/:modal_to_show/:shared_item_code" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                    <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/:action_variable/m/followers" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
                    <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/:action_variable/m/following" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
                    <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/:action_variable/m/friends" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />} />
                    <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/:action_variable" component={OrganizationVoterGuide} />
                    <Route path="/voterguide/:organization_we_vote_id/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable" exact component={OrganizationVoterGuide} />
                    <Route path="/voterguide/:organization_we_vote_id/followers" component={(props) => <OrganizationVoterGuide {...props} activeRoute="followers" />} />
                    <Route path="/voterguide/:organization_we_vote_id/following" component={(props) => <OrganizationVoterGuide {...props} activeRoute="following" />} />
                    <Route path="/voterguide/:organization_we_vote_id/m/followers" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
                    <Route path="/voterguide/:organization_we_vote_id/m/following" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
                    <Route path="/voterguide/:organization_we_vote_id/m/friends" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />} />
                    <Route path="/voterguide/:organization_we_vote_id/modal/:modal_to_show/:shared_item_code" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                    <Route path="/voterguide/:organization_we_vote_id/modal/:modal_to_show" exact component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                    <Route path="/voterguide/:organization_we_vote_id/positions" exact component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                    <Route path="/voterguide/:organization_we_vote_id/positions/modal/:modal_to_show" exact component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                    <Route path="/voterguide/:organization_we_vote_id/positions/modal/:modal_to_show/:shared_item_code" component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                    <Route path="/voterguide/:organization_we_vote_id/:action_variable" component={OrganizationVoterGuide} />
                    <Route path="/voterguide/:organization_we_vote_id" exact component={(props) => <OrganizationVoterGuide {...props} activeRoute="positions" />} />
                    <Route path="/voterguideedit/:organization_we_vote_id/:google_civic_election_id" exact render={(props) => (<RouterV5SendMatch componentName="OrganizationVoterGuideEdit" {...props} />)} />
                    <Route path="/voterguideedit/:organization_we_vote_id" exact render={(props) => (<RouterV5SendMatch componentName="OrganizationVoterGuideEdit" {...props} />)} />
                    <Route path="/welcome" exact><Ready /></Route>
                    <Route path="/welcomehome" component={isNotWeVoteMarketingSite ? ReadyRedirect : (props) => <WelcomeForVoters {...props} pathname="/welcomehome" />} />
                    <Route path="/wevoteintro/network" component={IntroNetwork} />
                    <Route path="/wevoteintro/newfriend/:invitationSecretKey" component={FriendIntroLanding} />
                    <Route path="/yourpage" component={YourPage} />
                    <Route path="/:twitter_handle/ballot/election/:google_civic_election_id" component={TwitterHandleLanding} />
                    <Route path="/:twitter_handle/ballot/election/:google_civic_election_id/:view_mode" component={TwitterHandleLanding} />
                    <Route path="/:twitter_handle/ballot/empty" component={TwitterHandleLanding} />
                    <Route path="/:twitter_handle/ballot/id/:ballot_returned_we_vote_id" component={TwitterHandleLanding} />
                    <Route path="/:twitter_handle/ballot/id/:ballot_returned_we_vote_id/:view_mode" component={TwitterHandleLanding} />
                    <Route path="/:twitter_handle/ballot/:ballot_location_shortcut" exact component={TwitterHandleLanding} />
                    {/* Start of btcand */}
                    <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/:action_variable/m/followers" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
                    <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/:action_variable/m/following" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
                    <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/:action_variable/m/friends" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />} />
                    <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/followers" component={(props) => <TwitterHandleLanding {...props} activeRoute="followers" />} />
                    <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/following" component={(props) => <TwitterHandleLanding {...props} activeRoute="following" />} />
                    <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/m/followers" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
                    <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/m/following" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
                    <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/m/friends" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />} />
                    <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/modal/:modal_to_show" exact component={TwitterHandleLanding} />
                    <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/modal/:modal_to_show/:shared_item_code" component={TwitterHandleLanding} />
                    <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/positions" exact component={(props) => <TwitterHandleLanding {...props} activeRoute="positions" />} />
                    <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/positions/modal/:modal_to_show" component={(props) => <TwitterHandleLanding {...props} activeRoute="positions" />} />
                    <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/positions/modal/:modal_to_show/:shared_item_code" component={(props) => <TwitterHandleLanding {...props} activeRoute="positions" />} />
                    <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable/:action_variable" component={TwitterHandleLanding} />
                    <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id/b/:back_to_variable($)?" component={TwitterHandleLanding} />
                    <Route path="/:twitter_handle/btcand/:back_to_cand_we_vote_id" exact component={TwitterHandleLanding} />
                    {/* Start of btmeas */}
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
                    <Route path="/:twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/:action_variable/m/followers" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
                    <Route path="/:twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/:action_variable/m/following" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
                    <Route path="/:twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/:action_variable/m/friends" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />} />
                    <Route path="/:twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable/:action_variable" exact component={TwitterHandleLanding} />
                    <Route path="/:twitter_handle/btmeas/:back_to_meas_we_vote_id/b/:back_to_variable" exact component={TwitterHandleLanding} />
                    <Route path="/:twitter_handle/followers" component={(props) => <TwitterHandleLanding {...props} activeRoute="followers" />} />
                    <Route path="/:twitter_handle/following" component={(props) => <TwitterHandleLanding {...props} activeRoute="following" />} />
                    <Route path="/:twitter_handle/m/followers" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="followers" />} />
                    <Route path="/:twitter_handle/m/following" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="following" />} />
                    <Route path="/:twitter_handle/m/friends" component={(props) => <OrganizationVoterGuideMobileDetails {...props} activeRoute="friends" />}  />
                    <Route path="/:twitter_handle/modal/:modal_to_show/:shared_item_code" exact component={TwitterHandleLanding} />
                    <Route path="/:twitter_handle/modal/:modal_to_show" exact component={TwitterHandleLanding} />
                    <Route path="/:twitter_handle/positions" component={(props) => <TwitterHandleLanding {...props} activeRoute="positions" />} />
                    <Route path="/:twitter_handle/positions/modal/:modal_to_show/:shared_item_code" exact component={(props) => <TwitterHandleLanding {...props} activeRoute="positions" />} />
                    <Route path="/:twitter_handle/positions/modal/:modal_to_show" exact component={(props) => <TwitterHandleLanding {...props} activeRoute="positions" />} />
                    <Route path="/:twitter_handle/:action_variable" exact component={TwitterHandleLanding} />
                    <Route path="/:twitter_handle($)?" exact component={TwitterHandleLanding} />
                    <Route path="/:twitter_handle" exact component={TwitterHandleLanding} />
                    <Route path="*" component={PageNotFound} />
                  </Switch>
                </Suspense>
                <Suspense fallback={<span>&nbsp;</span>}>
                  <Footer />
                </Suspense>
              </WeVoteBody>
            </WeVoteRouter>
          </ThemeProvider>
        </StyledEngineProvider>
      </ErrorBoundary>
    );
  }
}

const WeVoteBody = styled('div')`
  background-color: #fff; // rgb(235, 236, 238);
  color: #333;
  display: block;
  font-family: "Nunito Sans", "Helvetica Neue Light", "Helvetica Neue", "Helvetica", "Arial", sans-serif;
  line-height: 1.4;
  margin: 0 auto;
  // max-width: 960px;
  height: 100vw;
  position: relative;
  z-index: 0;
  ${() => console.log('-----------------------------')}
`;

export default App;
