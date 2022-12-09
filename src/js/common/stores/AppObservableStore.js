import { Subject } from 'rxjs';
import VoterActions from '../../actions/VoterActions'; // eslint-disable-line import/no-cycle
import stringContains from '../utils/stringContains';
import webAppConfig from '../../config';
import VoterStore from '../../stores/VoterStore'; // eslint-disable-line import/no-cycle
import { dumpObjProps } from '../../utils/appleSiliconUtils';
import $ajax from '../../utils/service';

const subject = new Subject();

function isCordovaLocal () {
  const { cordova } = window;
  return cordova !== undefined;
}

export const messageService = {
  sendMessage: (message) => subject.next({ text: message }),
  clearMessages: () => subject.next(),
  getMessage: () => subject.asObservable(),
};

const nonFluxState = {
  activityTidbitWeVoteIdForDrawer: '',
  blockCampaignXRedirectOnSignIn: false, // When signing in from the header, don't mark a campaign as supported
  campaignListFirstRetrieveInitiated: false,
  chosenGoogleAnalyticsTrackingID: false,
  chosenPreventSharingOpinions: false,
  chosenReadyIntroductionText: '',
  chosenReadyIntroductionTitle: '',
  chosenSiteLogoUrl: '',
  chosenWebsiteName: '',
  currentPathname: '',
  getStartedMode: '',
  getVoterGuideSettingsDashboardEditMode: '',
  googleAnalyticsEnabled: false,
  googleAnalyticsPending: false,
  hideOrganizationModalBallotItemInfo: false,
  hideOrganizationModalPositions: false,
  hideWeVoteLogo: false,
  hostname: '',
  observableUpdateCounter: 0,
  organizationModalBallotItemWeVoteId: '',
  openReplayEnabled: false,
  openReplayPending: false,
  openReplayTracker: undefined,
  openReplayVoterIsSignedIn: '',
  openReplayVoterWeVoteId: '',
  pendingSnackMessage: '',
  pendingSnackSeverity: '',
  recommendedCampaignListFirstRetrieveInitiated: false,
  scrolledDown: false,
  setUpAccountBackLinkPath: '',
  setUpAccountEntryPath: '',
  whatAndHowMuchToShare: '',
  sharedItemCode: '',
  showActivityTidbitDrawer: false,
  showAdviserIntroModal: false,
  showAskFriendsModal: false,
  showChooseOrOpposeIntroModal: false,
  showCompleteYourProfileModal: false,
  showEditAddressButton: false,
  showElectionsWithOrganizationVoterGuidesModal: false,
  showHeader: 0,
  showHowItWorksModal: false,
  showNewVoterGuideModal: false,
  showOrganizationModal: false,
  showPaidAccountUpgradeModal: false,
  showPersonalizedScoreIntroModal: false,
  showPositionDrawer: false,
  showSelectBallotModal: false,
  showSelectBallotModalEditAddress: false,
  showShareModal: false,
  showSharedItemModal: false,
  showSignInModal: false,
  showTwitterLandingPage: false,
  showVoterPlanModal: false,
  signInStateChanged: false,
  siteConfigurationHasBeenRetrieved: false,
  siteOwnerOrganizationWeVoteId: '',
  storeSignInStartFullUrl: false,
  viewingOrganizationVoterGuide: false,
  voterBallotItemsRetrieveHasBeenCalled: false,
  voterExternalIdHasBeenSavedOnce: {}, // Dict with externalVoterId and membershipOrganizationWeVoteId as keys, and true/false as value
  voterFirstRetrieveInitiated: false,
};


export default {
  blockCampaignXRedirectOnSignIn () {
    return nonFluxState.blockCampaignXRedirectOnSignIn;
  },

  campaignListFirstRetrieveInitiated () {
    return nonFluxState.campaignListFirstRetrieveInitiated;
  },

  getActivityTidbitWeVoteIdForDrawer () {
    return nonFluxState.activityTidbitWeVoteIdForDrawer;
  },

  getChosenAboutOrganizationExternalUrl () {
    return nonFluxState.chosenAboutOrganizationExternalUrl;
  },

  getChosenGoogleAnalyticsTrackingID () {
    return nonFluxState.chosenGoogleAnalyticsTrackingID;
  },

  getChosenPreventSharingOpinions () {
    return nonFluxState.chosenPreventSharingOpinions;
  },

  getChosenReadyIntroductionText () {
    return nonFluxState.chosenReadyIntroductionText;
  },

  getChosenReadyIntroductionTitle () {
    return nonFluxState.chosenReadyIntroductionTitle;
  },

  getChosenSiteLogoUrl () {
    return nonFluxState.chosenSiteLogoUrl;
  },

  getChosenWebsiteName () {
    return nonFluxState.chosenWebsiteName || 'WeVote.US Campaigns';
  },

  getCurrentPathname () {
    return nonFluxState.currentPathname;
  },

  getPositionDrawerBallotItemWeVoteId () {
    return nonFluxState.positionDrawerBallotItemWeVoteId;
  },

  getPositionDrawerOrganizationWeVoteId () {
    return nonFluxState.positionDrawerOrganizationWeVoteId;
  },

  getGoogleAnalyticsEnabled () {
    return nonFluxState.googleAnalyticsEnabled;
  },

  getGoogleAnalyticsPending () {
    return nonFluxState.googleAnalyticsPending;
  },

  getOpenReplayEnabled () {
    return nonFluxState.openReplayEnabled;
  },

  getOpenReplayPending () {
    return nonFluxState.openReplayPending;
  },

  getOpenReplayStateCode () {
    return nonFluxState.stateCode;
  },

  getOpenReplayStateCodeFromIpAddress () {
    return nonFluxState.stateCodeFromIpAddress;
  },

  getOpenReplayTracker () {
    return nonFluxState.openReplayTracker;
  },

  getOpenReplayVoterIsSignedIn () {
    return nonFluxState.openReplayVoterIsSignedIn;
  },

  getOpenReplayVoterWeVoteId () {
    return nonFluxState.openReplayVoterWeVoteId;
  },

  getHideWeVoteLogo () {
    return nonFluxState.hideWeVoteLogo;
  },

  getHostname () {
    return nonFluxState.hostname || '';
  },

  getOrganizationModalBallotItemWeVoteId () {
    return nonFluxState.organizationModalBallotItemWeVoteId;
  },

  getPendingSnackMessage () {
    return nonFluxState.pendingSnackMessage;
  },

  getPendingSnackSeverity () {
    return nonFluxState.pendingSnackSeverity;
  },

  getScrolledDown () {
    return nonFluxState.scrolledDown;
  },

  getSetUpAccountBackLinkPath () {
    return nonFluxState.setUpAccountBackLinkPath;
  },

  getSetUpAccountEntryPath () {
    return nonFluxState.setUpAccountEntryPath;
  },

  getSharedItemCode () {
    return nonFluxState.sharedItemCode;
  },

  getShareModalStep () {
    // console.log('AppObservableStore shareModalStep:', nonFluxState.shareModalStep);
    return nonFluxState.shareModalStep;
  },

  getWeVoteRootURL () {
    const { location: { hostname, origin } } = window;
    if (hostname === 'localhost') {
      return origin; // ex/ https://localhost:3000
    } else {
      return 'https://wevote.us';
    }
  },

  getWhatAndHowMuchToShare () {
    // console.log('getWhatAndHowMuchToShare:', nonFluxState.whatAndHowMuchToShare);
    return nonFluxState.whatAndHowMuchToShare;
  },

  getShowTwitterLandingPage () {
    // console.log('AppObservableStore getShowTwitterLandingPage:', nonFluxState.showTwitterLandingPage);
    return nonFluxState.showTwitterLandingPage;
  },

  getSignInStateChanged () {
    return nonFluxState.signInStateChanged;
  },

  getSiteOwnerOrganizationWeVoteId () {
    return nonFluxState.siteOwnerOrganizationWeVoteId;
  },

  getStartedMode () {
    return nonFluxState.getStartedMode;
  },

  getVoterGuideSettingsDashboardEditMode () {
    return nonFluxState.getVoterGuideSettingsDashboardEditMode;
  },

  hideOrganizationModalBallotItemInfo () {
    return nonFluxState.hideOrganizationModalBallotItemInfo;
  },

  hideOrganizationModalPositions () {
    return nonFluxState.hideOrganizationModalPositions;
  },

  inPrivateLabelMode () {
    return Boolean(nonFluxState.chosenSiteLogoUrl || false);
  },

  isSnackMessagePending () {
    return nonFluxState.pendingSnackMessage && nonFluxState.pendingSnackMessage.length > 0;
  },

  isOnWeVoteRootUrl () {
    // console.log('AppObservableStore nonFluxState.onWeVoteRootUrl: ', nonFluxState.onWeVoteRootUrl,
    //   ', isOnWeVoteRootUrl weVoteURL: ', weVoteURL,
    //   ', isCordovaLocal(): ', isCordovaLocal(),
    //   ', is localhost: ', stringContains('localhost:', window.location.href));

    const { location: { href: localhost } } = window;

    return (nonFluxState.onWeVoteRootUrl || false) ||
      isCordovaLocal() ||
      stringContains('wevote.us:', localhost) ||
      stringContains('wevote.org:', localhost) ||   // includes quality.wevote.us
      stringContains('localhost:', localhost) ||
      stringContains('wevotedeveloper.com:', localhost) ||
      stringContains('ngrok.io', localhost);
  },

  isOnFacebookJsSdkHostDomainList () {
    const { hostname } = window.location;
    const host = hostname.replace('www.', '');
    // console.log('----------------------', hostname);
    return host === 'wevote.us' || host === 'quality.wevote.us' || host === 'localhost' || host === 'wevotedeveloper.com' || isCordovaLocal() || window.location.href.includes('ngrok');
  },

  isOnWeVoteSubdomainUrl () {
    // let onWeVoteSubdomainUrl = nonFluxState.onWeVoteSubdomainUrl || false;
    // if (onWeVoteSubdomainUrl === undefined) {
    //   // onChosenFullDomainUrl, onFacebookSupportedDomainUrl, onWeVoteSubdomainUrl,
    //   const { hostname } = window.location;
    //   ({ onWeVoteSubdomainUrl } = this.calculateUrlSettings(hostname));
    // }
    // return onWeVoteSubdomainUrl;
    return nonFluxState.onWeVoteSubdomainUrl;
  },

  isOnPartnerUrl () {
    return nonFluxState.onWeVoteSubdomainUrl || nonFluxState.onChosenFullDomainUrl;
  },

  isVoterAdminForThisUrl (linkedOrganizationWeVoteId) {
    // const linkedOrganizationWeVoteId = VoterStore.getLinkedOrganizationWeVoteId();
    return nonFluxState.siteOwnerOrganizationWeVoteId === linkedOrganizationWeVoteId;
  },

  isOnFacebookSupportedDomainUrl () {
    return nonFluxState.onFacebookSupportedDomainUrl;
  },

  isOnChosenFullDomainUrl () {
    return nonFluxState.onChosenFullDomainUrl;
  },

  recommendedCampaignListFirstRetrieveInitiated () {
    return nonFluxState.recommendedCampaignListFirstRetrieveInitiated;
  },

  incrementObservableUpdateCounter () {
    nonFluxState.observableUpdateCounter += 1;
    messageService.sendMessage('state incremented ObservableUpdateCounter');
  },

  setActivityTidbitWeVoteIdForDrawer (activityTidbitWeVoteId) {
    nonFluxState.activityTidbitWeVoteIdForDrawer = activityTidbitWeVoteId;
    messageService.sendMessage('state updated activityTidbitWeVoteIdForDrawer');
  },

  setActivityTidbitWeVoteIdForDrawerAndOpen (setActivityTidbitWeVoteIdForDrawerAndOpen) {
    nonFluxState.activityTidbitWeVoteIdForDrawerAndOpen = setActivityTidbitWeVoteIdForDrawerAndOpen;
    messageService.sendMessage('state updated activityTidbitWeVoteIdForDrawerAndOpen');
  },

  setBlockCampaignXRedirectOnSignIn (value) {
    nonFluxState.blockCampaignXRedirectOnSignIn = value;
    messageService.sendMessage('state updated blockCampaignXRedirectOnSignIn');
  },

  setCampaignListFirstRetrieveInitiated (value) {
    nonFluxState.campaignListFirstRetrieveInitiated = value;
    messageService.sendMessage('state updated campaignListFirstRetrieveInitiated');
  },

  setCurrentPathname (currentPathname) {
    nonFluxState.currentPathname = currentPathname;
    messageService.sendMessage('state updated currentPathname');
  },

  setEvaluateHeaderDisplay () {
    // Force the Header to evaluate whether it should display
    nonFluxState.showHeader = Date.now();
    messageService.sendMessage('state updated showHeader');
  },

  setGetStartedMode (getStartedMode) {
    nonFluxState.getStartedMode = getStartedMode;
    messageService.sendMessage('state updated getStartedMode');
  },

  setHideOrganizationModalBallotItemInfo (hide) {
    nonFluxState.hideOrganizationModalBallotItemInfo = hide;
    messageService.sendMessage('state updated hideOrganizationModalBallotItemInfo');
  },

  setHideOrganizationModalPositions (hide) {
    nonFluxState.hideOrganizationModalPositions = hide;
    messageService.sendMessage('state updated hideOrganizationModalPositions');
  },

  setGoogleAnalyticsEnabled (enabled) {
    nonFluxState.googleAnalyticsEnabled = enabled;
    messageService.sendMessage('state updated googleAnalyticsEnabled');
  },

  setGoogleAnalyticsPending (enabled) {
    nonFluxState.googleAnalyticsPending = enabled;
    messageService.sendMessage('state updated googleAnalyticsPending');
  },

  setOpenReplayEnabled (enabled) {
    nonFluxState.openReplayEnabled = enabled;
    messageService.sendMessage('state updated openReplayEnabled');
  },

  setOpenReplayPending (enabled) {
    nonFluxState.openReplayPending = enabled;
    messageService.sendMessage('state updated openReplayPending');
  },

  setOpenReplayStateCode (stateCode) {
    nonFluxState.stateCode = stateCode;
    messageService.sendMessage('state updated stateCode');
  },

  setOpenReplayStateCodeFromIpAddress (stateCodeFromIpAddress) {
    nonFluxState.stateCodeFromIpAddress = stateCodeFromIpAddress;
    messageService.sendMessage('state updated stateCodeFromIpAddress');
  },

  setOpenReplayTracker (tracker) {
    nonFluxState.openReplayTracker = tracker;
    messageService.sendMessage('state updated openReplayTracker');
  },

  setOpenReplayVoterIsSignedIn (value) {
    nonFluxState.openReplayVoterIsSignedIn = value;
    messageService.sendMessage('state updated openReplayVoterIsSignedIn');
  },

  setOpenReplayVoterWeVoteId (value) {
    nonFluxState.openReplayVoterWeVoteId = value;
    messageService.sendMessage('state updated openReplayVoterWeVoteId');
  },

  setOrganizationModalBallotItemWeVoteId (ballotItemWeVoteId) {
    nonFluxState.organizationModalBallotItemWeVoteId = ballotItemWeVoteId;
    messageService.sendMessage('state updated organizationModalBallotItemWeVoteId');
  },

  setPendingSnackMessage (message, severity) {
    nonFluxState.pendingSnackMessage = message;
    nonFluxState.pendingSnackSeverity = severity;
  },

  setPositionDrawerBallotItemWeVoteId (ballotItemWeVoteId) {
    nonFluxState.positionDrawerBallotItemWeVoteId = ballotItemWeVoteId;
    messageService.sendMessage('state updated positionDrawerBallotItemWeVoteId');
  },

  setPositionDrawerOrganizationWeVoteId (organizationWeVoteId) {
    nonFluxState.positionDrawerOrganizationWeVoteId = organizationWeVoteId;
    messageService.sendMessage('state updated positionDrawerOrganizationWeVoteId');
  },

  setRecommendedCampaignListFirstRetrieveInitiated (value) {
    nonFluxState.recommendedCampaignListFirstRetrieveInitiated = value;
    messageService.sendMessage('state updated recommendedCampaignListFirstRetrieveInitiated');
  },

  setScrolled (scrolledDown) {
    nonFluxState.scrolledDown = scrolledDown;
    messageService.sendMessage('state updated scrolledDown');
  },

  setSetUpAccountBackLinkPath (backLinkPath) {
    // console.log('setSetUpAccountBackLinkPath, step:', step);
    nonFluxState.setUpAccountBackLinkPath = backLinkPath;
    messageService.sendMessage('state updated setUpAccountBackLinkPath');
  },

  setSetUpAccountEntryPath (entryPath) {
    // console.log('setSetUpAccountEntryPath, step:', step);
    nonFluxState.setUpAccountEntryPath = entryPath;
    messageService.sendMessage('state updated setSetUpAccountEntryPath');
  },

  setShowActivityTidbitDrawer (show) {
    nonFluxState.showActivityTidbitDrawer = show;
    messageService.sendMessage('state updated showActivityTidbitDrawer');
  },

  setShowAdviserIntroModal (show) {
    nonFluxState.showAdviserIntroModal = show;
    messageService.sendMessage('state updated showAdviserIntroModal');
  },

  setShowAskFriendsModal (show) {
    nonFluxState.showAskFriendsModal = show;
    messageService.sendMessage('state updated showAskFriendsModal');
  },

  setShowChooseOrOpposeIntroModal (show, ballotItemType = 'CANDIDATE') {
    nonFluxState.showChooseOrOpposeIntroModal = show;
    nonFluxState.showChooseOrOpposeIntroModalBallotItemType = ballotItemType;
    messageService.sendMessage('state updated showChooseOrOpposeIntroModal');
  },

  setShowCompleteYourProfileModal (show) {
    nonFluxState.showCompleteYourProfileModal = show;
    messageService.sendMessage('state updated showCompleteYourProfileModal');
  },

  setShowEditAddressButton (show) {
    nonFluxState.showEditAddressButton = show;
    messageService.sendMessage('state updated showEditAddressButton');
  },

  setShowElectionsWithOrganizationVoterGuidesModal (show) {
    nonFluxState.showElectionsWithOrganizationVoterGuidesModal = show;
    messageService.sendMessage('state updated showElectionsWithOrganizationVoterGuidesModal');
  },

  setShowFirstPositionIntroModal (show) {
    nonFluxState.showFirstPositionIntroModal = show;
    messageService.sendMessage('state updated showFirstPositionIntroModal');
  },

  setShowHowItWorksModal (show) {
    // The chosenPaidAccount values are: free, professional, enterprise
    nonFluxState.showHowItWorksModal = show;
    messageService.sendMessage('state updated showHowItWorksModal');
  },

  setShowImageUploadModal (show) {
    // console.log('Setting image upload modal to open!');
    nonFluxState.showImageUploadModal = show;
    messageService.sendMessage('state updated showImageUploadModal');
  },

  setShowNewVoterGuideModal (show) {
    nonFluxState.showNewVoterGuideModal = show;
    messageService.sendMessage('state updated showNewVoterGuideModal');
  },

  setShowOrganizationModal (show) {
    // console.log("Setting organizationModal to ", show);
    nonFluxState.showOrganizationModal = show;
    messageService.sendMessage('state updated showOrganizationModal');
  },

  setShowPaidAccountUpgradeModal (chosenPaidAccount) {
    // The chosenPaidAccount values are: free, professional, enterprise
    nonFluxState.showPaidAccountUpgradeModal = chosenPaidAccount;
    messageService.sendMessage('state updated showPaidAccountUpgradeModal');
  },

  setShowPersonalizedScoreIntroModal (show) {
    nonFluxState.showPersonalizedScoreIntroModal = show;
    messageService.sendMessage('state updated showPersonalizedScoreIntroModal');
  },

  setShowPositionDrawer (show) {
    nonFluxState.showPositionDrawer = show;
    messageService.sendMessage('state updated showPositionDrawer');
  },

  setShowSelectBallotModal (showSelectBallotModal, showSelectBallotModalEditAddress = false) {
    nonFluxState.showSelectBallotModalEditAddress = showSelectBallotModalEditAddress;
    nonFluxState.showSelectBallotModal = showSelectBallotModal;
    // console.log('setShowSelectBallotModal showSelectBallotModalEditAddress:', showSelectBallotModalEditAddress);
    messageService.sendMessage('state updated showSelectBallotModal, showSelectBallotModalEditAddress');
  },

  setShowSelectBallotModalOnly (showSelectBallotModal) {
    nonFluxState.showSelectBallotModal = showSelectBallotModal;
    messageService.sendMessage('state updated showSelectBallotModalOnly');
  },

  setShowShareModal (show) {
    // The chosenPaidAccount values are: free, professional, enterprise
    nonFluxState.showShareModal = show;
    messageService.sendMessage('state updated showShareModal');
  },

  setShowSharedItemModal (sharedItemCode) {
    nonFluxState.sharedItemCode = sharedItemCode;
    nonFluxState.showSharedItemModal = Boolean(sharedItemCode);
    messageService.sendMessage('state updated showSharedItemModal');
  },

  setShowSignInModal (show) {
    nonFluxState.showSignInModal = show;
    messageService.sendMessage('state updated showSignInModal');
  },

  setShowTwitterLandingPage (show) {
    nonFluxState.showTwitterLandingPage = show;
    messageService.sendMessage('state updated showTwitterLandingPage');
  },

  setShowValuesIntroModal (show) {
    nonFluxState.showValuesIntroModal = show;
    messageService.sendMessage('state updated showValuesIntroModal');
  },

  setShowVoterPlanModal (show) {
    // The chosenPaidAccount values are: free, professional, enterprise
    nonFluxState.showVoterPlanModal = show;
    messageService.sendMessage('state updated showVoterPlanModal');
  },

  setSignInStateChanged (signin) {
    nonFluxState.signInStateChanged = signin;
    messageService.sendMessage('state updated signInStateChanged');
  },

  setSignInStartFullUrl () {
    nonFluxState.storeSignInStartFullUrl = true;
    messageService.sendMessage('state updated storeSignInStartFullUrl');
  },

  setStoreSignInStartFullUrl () {
    nonFluxState.storeSignInStartFullUrl = true;
    messageService.sendMessage('state updated storeSignInStartFullUrl');
  },

  setViewingOrganizationVoterGuide (isViewing) {
    nonFluxState.viewingOrganizationVoterGuide = isViewing;
    messageService.sendMessage('state updated viewingOrganizationVoterGuide');
  },

  setVoterGuideSettingsDashboardEditMode (getVoterGuideSettingsDashboardEditMode) {
    nonFluxState.getVoterGuideSettingsDashboardEditMode = getVoterGuideSettingsDashboardEditMode;
    messageService.sendMessage('state updated getVoterGuideSettingsDashboardEditMode');
  },

  setVoterBallotItemsRetrieveHasBeenCalled (voterBallotItemsRetrieveHasBeenCalled) {
    nonFluxState.voterBallotItemsRetrieveHasBeenCalled = voterBallotItemsRetrieveHasBeenCalled;
    messageService.sendMessage('state updated voterBallotItemsRetrieveHasBeenCalled');
  },

  setVoterFirstRetrieveInitiated (voterFirstRetrieveInitiated) {
    nonFluxState.voterFirstRetrieveInitiated = voterFirstRetrieveInitiated;
    messageService.sendMessage('state updated voterFirstRetrieveInitiated');
  },

  setWhatAndHowMuchToShare (step) {
    // console.log('setWhatAndHowMuchToShare, step:', step);
    nonFluxState.whatAndHowMuchToShare = step;
    messageService.sendMessage('state updated whatAndHowMuchToShare');
  },

  showActivityTidbitDrawer () {
    return nonFluxState.showActivityTidbitDrawer;
  },

  showAdviserIntroModal () {
    return nonFluxState.showAdviserIntroModal;
  },

  showAskFriendsModal () {
    return nonFluxState.showAskFriendsModal;
  },

  showChooseOrOpposeIntroModal () {
    return nonFluxState.showChooseOrOpposeIntroModal;
  },

  showCompleteYourProfileModal () {
    return nonFluxState.showCompleteYourProfileModal;
  },

  // showEditAddressButton () {
  //   return nonFluxState.showEditAddressButton;
  // },

  showElectionsWithOrganizationVoterGuidesModal () {
    return nonFluxState.showElectionsWithOrganizationVoterGuidesModal;
  },

  showFirstPositionIntroModal () {
    return nonFluxState.showFirstPositionIntroModal;
  },

  showHowItWorksModal () {
    return nonFluxState.showHowItWorksModal;
  },

  showingOneCompleteYourProfileModal () {
    return nonFluxState.showAdviserIntroModal ||
      nonFluxState.showFirstPositionIntroModal ||
      nonFluxState.showHowItWorksModal ||
      nonFluxState.showPersonalizedScoreIntroModal ||
      nonFluxState.showSelectBallotModal ||
      nonFluxState.showSharedItemModal ||
      nonFluxState.showValuesIntroModal;
  },

  showNewVoterGuideModal () {
    return nonFluxState.showNewVoterGuideModal;
  },

  showPaidAccountUpgradeModal () {
    // The chosenPaidAccount values are: free, professional, enterprise
    return nonFluxState.showPaidAccountUpgradeModal;
  },

  showPersonalizedScoreIntroModal () {
    return nonFluxState.showPersonalizedScoreIntroModal;
  },

  showPositionDrawer () {
    return nonFluxState.showPositionDrawer;
  },

  showShareModal () {
    return nonFluxState.showShareModal;
  },

  showSharedItemModal () {
    return nonFluxState.showSharedItemModal;
  },

  showSelectBallotModal () {
    return nonFluxState.showSelectBallotModal;
  },

  showSelectBallotModalEditAddress () {
    return nonFluxState.showSelectBallotModalEditAddress;
  },

  showSignInModal () {
    return nonFluxState.showSignInModal;
  },

  showOrganizationModal () {
    return nonFluxState.showOrganizationModal;
  },

  showValuesIntroModal () {
    return nonFluxState.showValuesIntroModal;
  },

  showImageUploadModal () {
    return nonFluxState.showImageUploadModal;
  },

  showVoterPlanModal () {
    return nonFluxState.showVoterPlanModal;
  },

  siteConfigurationHasBeenRetrieved () {
    // let { hostname } = window.location;
    // hostname = hostname || '';
    // if (hostname === 'campaigns.wevote.us') {
    //   // Bypass for default site
    //   return true;
    // } else {
    //   return nonFluxState.siteConfigurationHasBeenRetrieved;
    // }
    return nonFluxState.siteConfigurationHasBeenRetrieved;
  },

  siteConfigurationRetrieve (hostname, externalVoterId = '', refresh_string = '') {
    $ajax({
      endpoint: 'siteConfigurationRetrieve',
      data: { hostname, refresh_string },
      success: (res) => {
        // console.log('AppObservableStore siteConfigurationRetrieve success, res:', res);
        const {
          status: apiStatus,
          success: apiSuccess,
          hostname: hostFromApi,
          organization_we_vote_id: siteOwnerOrganizationWeVoteId,
          chosen_about_organization_external_url: chosenAboutOrganizationExternalUrl,
          chosen_google_analytics_tracking_id: chosenGoogleAnalyticsTrackingID,
          chosen_hide_we_vote_logo: hideWeVoteLogo,
          chosen_logo_url_https: chosenSiteLogoUrl,
          chosen_prevent_sharing_opinions: chosenPreventSharingOpinions,
          chosen_ready_introduction_text: chosenReadyIntroductionText,
          chosen_ready_introduction_title: chosenReadyIntroductionTitle,
          chosen_website_name: chosenWebsiteName,
        } = res;
        let newHostname = hostFromApi ? hostFromApi.replace('www.', '') : hostname.replace('www.', '');
        if (apiSuccess) {
          let onWeVoteRootUrl = false;
          let onWeVoteSubdomainUrl = false;
          let onFacebookSupportedDomainUrl = false;
          let onChosenFullDomainUrl = false;

          if (isCordovaLocal()) {
            newHostname = webAppConfig.WE_VOTE_HOSTNAME;
          }

          // console.log('AppObservableStore siteConfigurationRetrieve hostname, newHostname:', hostname, newHostname);
          onWeVoteRootUrl = this.isOnWeVoteRootUrl();
          if (stringContains('wevote.us', newHostname)) {
            onWeVoteSubdomainUrl = true;
          } else {
            onChosenFullDomainUrl = true;
          }
          onFacebookSupportedDomainUrl = this.isOnFacebookJsSdkHostDomainList();
          // console.log('AppObservableStore siteConfigurationRetrieve onFacebookSupportedDomainUrl:', onFacebookSupportedDomainUrl);
          // console.log('AppObservableStore externalVoterId:', externalVoterId, ', siteOwnerOrganizationWeVoteId:', siteOwnerOrganizationWeVoteId);
          const { voterExternalIdHasBeenSavedOnce } = nonFluxState;
          if (externalVoterId && siteOwnerOrganizationWeVoteId) {
            if (!this.voterExternalIdHasBeenSavedOnce(externalVoterId, siteOwnerOrganizationWeVoteId)) {
              // console.log('voterExternalIdHasBeenSavedOnce has NOT been saved before.');
              VoterActions.voterExternalIdSave(externalVoterId, siteOwnerOrganizationWeVoteId);
              if (!voterExternalIdHasBeenSavedOnce[externalVoterId]) {
                voterExternalIdHasBeenSavedOnce[externalVoterId] = {};
              }
              voterExternalIdHasBeenSavedOnce[externalVoterId][siteOwnerOrganizationWeVoteId] = true;
              // AnalyticsActions.saveActionBallotVisit(VoterStore.electionId());
            } else {
              // console.log('voterExternalIdHasBeenSavedOnce has been saved before.');
            }
          }
          nonFluxState.apiStatus = apiStatus;
          nonFluxState.apiSuccess = apiSuccess;
          nonFluxState.chosenAboutOrganizationExternalUrl = chosenAboutOrganizationExternalUrl;
          nonFluxState.chosen_google_analytics_tracking_id = chosenGoogleAnalyticsTrackingID;
          nonFluxState.chosenPreventSharingOpinions = chosenPreventSharingOpinions;
          nonFluxState.chosenReadyIntroductionText = chosenReadyIntroductionText;
          nonFluxState.chosenReadyIntroductionTitle = chosenReadyIntroductionTitle;
          nonFluxState.chosenSiteLogoUrl = chosenSiteLogoUrl;
          nonFluxState.chosenWebsiteName = chosenWebsiteName;
          nonFluxState.hideWeVoteLogo = hideWeVoteLogo;
          nonFluxState.hostname = newHostname;
          nonFluxState.onChosenFullDomainUrl = onChosenFullDomainUrl;
          nonFluxState.onFacebookSupportedDomainUrl = onFacebookSupportedDomainUrl;
          nonFluxState.onWeVoteSubdomainUrl = onWeVoteSubdomainUrl;
          nonFluxState.onWeVoteRootUrl = onWeVoteRootUrl;
          nonFluxState.siteConfigurationHasBeenRetrieved = true;
          nonFluxState.siteOwnerOrganizationWeVoteId = siteOwnerOrganizationWeVoteId;
          nonFluxState.voterExternalIdHasBeenSavedOnce = voterExternalIdHasBeenSavedOnce;
          messageService.sendMessage('state updated for siteConfigurationRetrieve');
        }
      },

      error: (res) => {
        console.error('AppObservableStore error: ', res);
        dumpObjProps('AppObservableStore error', res);
      },
    });
  },

  storeSignInStartFullUrl () {
    return nonFluxState.storeSignInStartFullUrl;
  },

  unsetStoreSignInStartFullUrl () {
    nonFluxState.unsetStoreSignInStartFullUrl = false;
    messageService.sendMessage('state updated unsetStoreSignInStartFullUrl');
  },

  voterBallotItemsRetrieveHasBeenCalled () {
    return nonFluxState.voterBallotItemsRetrieveHasBeenCalled;
  },

  voterCanStartCampaignXForThisPrivateLabelSite () {
    const canEditCampaignXOwnedByOrganizationList = VoterStore.getCanEditCampaignXOwnedByOrganizationList();
    return canEditCampaignXOwnedByOrganizationList.includes(nonFluxState.siteOwnerOrganizationWeVoteId);
  },

  voterExternalIdHasBeenSavedOnce (externalVoterId, membershipOrganizationWeVoteId) {
    if (nonFluxState.voterExternalIdHasBeenSavedOnce[externalVoterId]) {
      return nonFluxState.voterExternalIdHasBeenSavedOnce[externalVoterId][membershipOrganizationWeVoteId] || false;
    } else {
      return false;
    }
  },

  voterFirstRetrieveInitiated () {
    return nonFluxState.voterFirstRetrieveInitiated;
  },

  voterIsAdminForThisUrl () {
    const linkedOrganizationWeVoteId = VoterStore.getLinkedOrganizationWeVoteId();
    return nonFluxState.siteOwnerOrganizationWeVoteId === linkedOrganizationWeVoteId;
  },
};
