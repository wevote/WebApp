import { isIOSAppOnMac } from '../common/utils/cordovaUtils';
import { normalizedHrefPage } from '../common/utils/hrefUtils';
import { isCordova, isWebApp } from '../common/utils/isCordovaOrWebApp';
import isMobileScreenSize, { isSmallerThanTablet } from '../common/utils/isMobileScreenSize';
import Cookies from '../common/utils/js-cookie/Cookies';
import { isSEOFriendlyURL, isChallengeSEOFriendlyURL, isPoliticianSEOFriendlyURL } from '../common/utils/isSEOFriendlyURL';
import normalizedImagePath from '../common/utils/normalizedImagePath';
import stringContains from '../common/utils/stringContains';

// We have to do all this, because we allow urls where the path starts with a twitter username (handle)
// as a result every path has to be evaluated for an exact routable match, and what is left is a twitter handle path.
// Based on the pathname parameter, decide if we want theaterMode, contentFullWidthMode, or voterGuideMode
export function getApplicationViewBooleans (pathname) {
  // We don't want to do all the work to create the footer, fire off api queries, etc., only to then set "display: none" based on a breakpoint!
  const isSmallScreen = isSmallerThanTablet(); // was ... window.screen.width < 992;
  let inTheaterMode = false;
  let campaignsMode = false;
  let candidatesMode = false;
  let contentFullWidthMode = false;
  let extensionPageMode = false;
  let friendsMode = false;
  let headerNotVisible = false;
  const pathnameLowerCase = pathname.toLowerCase() || '';
  // console.log('getApplicationViewBooleans, pathnameLowerCase:', pathnameLowerCase);
  let readyMode = false;
  let settingsMode = false;
  let sharedItemLandingPage = false;
  let twitterSignInMode = false;
  let voteMode = false;
  let valuesMode = false;
  let voterGuideMode = false;
  let voterGuideCreatorMode = false;
  if (pathnameLowerCase.startsWith('/-') || // Shared item
    pathnameLowerCase === '/intro/story' ||
    pathnameLowerCase === '/intro/sample_ballot' ||
    pathnameLowerCase === '/intro/get_started' ||
    pathnameLowerCase === '/more/myballot' ||
    pathnameLowerCase.startsWith('/voterguidepositions') ||
    pathnameLowerCase.startsWith('/wevoteintro')) {
    inTheaterMode = true;
  } else if (
    pathnameLowerCase === '/about' ||
    (pathnameLowerCase.startsWith('/candidate/') && !isSEOFriendlyURL(pathnameLowerCase)) ||
    (pathnameLowerCase.startsWith('/donate') && !isSEOFriendlyURL(pathnameLowerCase)) ||
    pathnameLowerCase === '/for-campaigns' ||
    pathnameLowerCase === '/for-organizations' ||
    (pathnameLowerCase.startsWith('/how') && !isSEOFriendlyURL(pathnameLowerCase)) ||
    pathnameLowerCase === '/intro' ||
    pathnameLowerCase.startsWith('/measure/') ||
    pathnameLowerCase === '/more/about' ||
    pathnameLowerCase === '/more/absentee' ||
    pathnameLowerCase === '/more/alerts' ||
    pathnameLowerCase === '/more/credits' ||
    pathnameLowerCase.startsWith('/more/donate') ||
    pathnameLowerCase === '/more/elections' ||
    pathnameLowerCase.startsWith('/office/') ||
    pathnameLowerCase === '/more/network' ||
    pathnameLowerCase === '/more/network/friends' ||
    pathnameLowerCase === '/more/network/issues' ||
    pathnameLowerCase === '/more/network/organizations' ||
    pathnameLowerCase.startsWith('/more/pricing') ||
    pathnameLowerCase === '/more/privacy' ||
    pathnameLowerCase === '/more/register' ||
    pathnameLowerCase === '/more/sign_in' ||
    pathnameLowerCase === '/more/terms' ||
    pathnameLowerCase === '/more/verify' ||
    pathnameLowerCase === '/privacy' ||
    pathnameLowerCase.startsWith('/verifythisisme/') ||
    pathnameLowerCase === '/welcomehome') {
    contentFullWidthMode = true;
  } else if (pathnameLowerCase.startsWith('/ballot/vote')) {
    contentFullWidthMode = false; // I set this to false, to fix the header padding issues in /ballot/vote
    voteMode = true;
  } else if (pathnameLowerCase.startsWith('/ballot') && !isSEOFriendlyURL(pathnameLowerCase)) {
    contentFullWidthMode = false;
  } else if (pathnameLowerCase.startsWith('/c/') || pathnameLowerCase.startsWith('/id/')) {
    contentFullWidthMode = true;
    campaignsMode = true;
  } else if (pathnameLowerCase.endsWith('/cs/') ||
      (pathnameLowerCase === '/start-a-campaign')) {
    contentFullWidthMode = true;
    candidatesMode = true;
  } else if (pathnameLowerCase.startsWith('/news') && !isSEOFriendlyURL(pathnameLowerCase)) {
    contentFullWidthMode = false;
  } else if (stringContains('/settings/positions', pathnameLowerCase)) {
    // contentFullWidthMode = true;
    voterGuideCreatorMode = true;
  } else if ((pathnameLowerCase.startsWith('/ready') && !isSEOFriendlyURL(pathnameLowerCase)) ||
    (pathnameLowerCase === '/welcome') ||
    (pathnameLowerCase === '/')) {
    contentFullWidthMode = true;
    readyMode = true;
  } else if ((stringContains('/settings', pathnameLowerCase) && !isSEOFriendlyURL(pathnameLowerCase)) ||
    pathnameLowerCase === '/settings/voterguidesmenu' ||
    pathnameLowerCase === '/settings/voterguidelist') {
    contentFullWidthMode = true;
    settingsMode = true;
  } else if ((pathnameLowerCase.startsWith('/value') && !isSEOFriendlyURL(pathnameLowerCase)) || // '/values'
    (pathnameLowerCase.startsWith('/opinions') && !isSEOFriendlyURL(pathnameLowerCase))) {
    contentFullWidthMode = true;
    valuesMode = true;
  } else if (pathnameLowerCase.startsWith('/candidate-for-extension') ||
    pathnameLowerCase.startsWith('/add-candidate-for-extension') ||
    pathnameLowerCase.startsWith('/more/extensionsignin')) {
    extensionPageMode = true;
    // Don't even load Stripe, Google Analytics, Google Maps, and Zen, they make startup very slow and are not needed for the Chrome Extension
    window.leanLoadForChromeExtension = true;
    console.log('applicationUtils for Chrome Extension window.leanLoadForChromeExtension set to true');
  } else if (pathnameLowerCase.startsWith('/-') && !isSEOFriendlyURL(pathnameLowerCase)) {
    sharedItemLandingPage = true;
  } else if (pathnameLowerCase.startsWith('/twitter_sign_in')) {
    twitterSignInMode = true;
  } else if ((pathnameLowerCase.startsWith('/friends') && !isSEOFriendlyURL(pathnameLowerCase)) ||
    pathnameLowerCase === '/facebook_invitable_friends') {
    contentFullWidthMode = true;
    friendsMode = true;
  } else if (stringContains('/vg/', pathnameLowerCase)) {    // TODO: Check voter guide mode STEVE ---------------------------------------------------------------
    voterGuideMode = true;
  } else if (stringContains('/btcand/', pathnameLowerCase)) {
    voterGuideMode = true;
  }

  let showBackToFriends = false;
  let showBackToBallotHeader = false;
  let showBackToSettingsDesktop = false;
  let showBackToSettingsMobile = false;
  let showBackToValues = false;
  let showBackToVoterGuide = false;
  let showBackToVoterGuides = false;
  if (extensionPageMode) {
    // No headers or footers
  } else if (stringContains('/m/', pathnameLowerCase)) {
    // Even though we might have a back-to-default... variable in the URL, we want to go back to a voter guide first
    showBackToVoterGuide = true;
  } else if (stringContains('/btdb/', pathnameLowerCase) || // back-to-default-ballot
    stringContains('/btdo/', pathnameLowerCase) || // back-to-default-office
    stringContains('/bto/', pathnameLowerCase) ||
    stringContains('/btdb', pathnameLowerCase) || // back-to-default-ballot
    stringContains('/btdo', pathnameLowerCase) || // back-to-default-office
    stringContains('/bto', pathnameLowerCase) ||
    stringContains('/btvg/', pathnameLowerCase) ||
    stringContains('/btcand/', pathnameLowerCase) ||  // back to candidate
    stringContains('/btmeas/', pathnameLowerCase)) {  // back to measure
    showBackToBallotHeader = true;
  } else if (stringContains('/settings/voter_guide', pathnameLowerCase) ||
    pathnameLowerCase === '/settings/voterguidesmenu' ||
    pathnameLowerCase === '/settings/voterguidelist') {
    showBackToSettingsDesktop = true;
    showBackToSettingsMobile = true;
  } else if (pathnameLowerCase === '/settings/account' ||
    pathnameLowerCase === '/settings/address' ||
    pathnameLowerCase === '/settings/analytics' ||
    pathnameLowerCase === '/settings/domain' ||
    pathnameLowerCase === '/settings/election' ||
    stringContains('/settings/issues', pathnameLowerCase) ||
    pathnameLowerCase === '/settings/notifications' ||
    pathnameLowerCase === '/settings/profile' ||
    pathnameLowerCase === '/settings/promoted' ||
    pathnameLowerCase === '/settings/sharing' ||
    pathnameLowerCase === '/settings/subscription' ||
    pathnameLowerCase === '/settings/text' ||
    pathnameLowerCase === '/settings/tools' ||
    pathnameLowerCase === '/settings/yourdata') {
    showBackToSettingsMobile = true;
  } else if (pathnameLowerCase.startsWith('/value/') ||
    pathnameLowerCase === '/values/list' ||
    // pathnameLowerCase === '/opinions' ||
    pathnameLowerCase === '/opinions_followed' ||
    pathnameLowerCase === '/opinions_ignored') {
    showBackToValues = true;
  } else if (pathnameLowerCase === '/friends/add' ||
    pathnameLowerCase === '/friends/all' ||
    pathnameLowerCase === '/friends/current' ||
    pathnameLowerCase === '/friends/requests' ||
    pathnameLowerCase === '/friends/sent-requests' ||
    pathnameLowerCase === '/friends/suggested' ||
    pathnameLowerCase === '/friends/invitebyemail' ||
    pathnameLowerCase === '/facebook_invitable_friends') {
    showBackToFriends = isWebApp();
  } else if (stringContains('/vg/', pathnameLowerCase)) {
    showBackToVoterGuides = true; // DALE 2019-02-19 Soon we should be able to delete the interim voter guides page
  }

  if (pathnameLowerCase.startsWith('/-')) { // Shared item
    headerNotVisible = true;
  }

  if (pathnameLowerCase.startsWith('/measure') && isCordova()) {
    showBackToBallotHeader = true;
  }

  let showFooterBar = isSmallerThanTablet();
  // console.log('stringContains(\'/settings/positions\', pathnameLowerCase):', stringContains('/settings/positions', pathnameLowerCase), pathnameLowerCase);
  if (extensionPageMode) {
    showFooterBar = false;
  // ///////// EXCLUDE: The following are URLS we want to specifically exclude (because otherwise they will be picked up in a broader pattern in the next branch
  } else if (pathnameLowerCase.startsWith('/-') || // Shared item
      stringContains('/b/btdb', pathnameLowerCase) ||
      ((pathnameLowerCase === '/about') && !isSEOFriendlyURL(pathnameLowerCase)) ||
      (pathnameLowerCase === '/for-campaigns') ||
      (pathnameLowerCase === '/for-organizations') ||
      (pathnameLowerCase === '/more/about') ||
      (pathnameLowerCase === '/more/credits') ||
      (pathnameLowerCase === '/more/myballot') ||
      (pathnameLowerCase.startsWith('/start-a-campaign') && !(pathnameLowerCase === '/start-a-campaign')) ||
      (pathnameLowerCase.startsWith('/start-a-challenge') && !(pathnameLowerCase === '/start-a-challenge')) ||
      ((pathnameLowerCase === '/start') && !(pathnameLowerCase === '/start-a-campaign')) ||
      (pathnameLowerCase === '/values/list') ||
      (pathnameLowerCase === '/welcomehome') ||
      pathnameLowerCase.startsWith('/findfriends') ||
      (pathnameLowerCase.startsWith('/how') && !isSEOFriendlyURL(pathnameLowerCase)) ||
      pathnameLowerCase.startsWith('/more/pricing') ||
      (pathnameLowerCase.startsWith('/register') && !isSEOFriendlyURL(pathnameLowerCase)) ||
      (pathnameLowerCase.startsWith('/remind') && !isSEOFriendlyURL(pathnameLowerCase)) ||
      pathnameLowerCase.startsWith('/settings/voterguidelist') ||
      pathnameLowerCase.startsWith('/setupaccount') ||
      pathnameLowerCase.startsWith('/settings/voterguidesmenu') ||
      pathnameLowerCase.startsWith('/twitter_sign_in') ||
      pathnameLowerCase.startsWith('/unsubscribe') ||
      pathnameLowerCase.startsWith('/wevoteintro/') ||
      pathnameLowerCase.startsWith('/value/') ||
      stringContains('/b/btdo', pathnameLowerCase) ||
      stringContains('/btcand/', pathnameLowerCase) ||
      stringContains('/+/invite-friends', pathnameLowerCase) ||
      stringContains('/+/customize-message', pathnameLowerCase) ||
      stringContains('/+/join-challenge', pathnameLowerCase) ||
      stringContains('/settings/positions', pathnameLowerCase)) {
    // We want to HIDE the footer bar on the above path patterns
    showFooterBar = false;
    // ///////// SHOW: The following are URLS where we want the footer to show
  } else if (pathnameLowerCase.startsWith('/ballot') ||
      pathnameLowerCase.endsWith('/cs/') || // Show Footer if back to not specified above
      pathnameLowerCase.startsWith('/candidate') || // Show Footer if back to not specified above
      pathnameLowerCase.startsWith('/donate') || // Show Footer if back to not specified above
      pathnameLowerCase.startsWith('/friends') ||
      pathnameLowerCase.startsWith('/measure') || // Show Footer if back to not specified above
      pathnameLowerCase.startsWith('/more/donate') ||
      (pathnameLowerCase === '/more/attributions') ||
      (pathnameLowerCase === '/more/privacy') ||
      (pathnameLowerCase === '/more/terms') ||
      pathnameLowerCase.startsWith('/news') ||
      pathnameLowerCase.startsWith('/office') || // Show Footer if back to not specified above
      (pathnameLowerCase === '/privacy') ||
      pathnameLowerCase.startsWith('/values') ||
      pathnameLowerCase.startsWith('/settings/account') ||
      pathnameLowerCase.startsWith('/settings/domain') ||
      pathnameLowerCase.startsWith('/settings/notifications') ||
      pathnameLowerCase.startsWith('/settings/profile') ||
      pathnameLowerCase.startsWith('/settings/sharing') ||
      pathnameLowerCase.startsWith('/settings/subscription') ||
      pathnameLowerCase.startsWith('/settings/text') ||
      pathnameLowerCase.startsWith('/settings/tools') ||
      pathnameLowerCase.startsWith('/settings/yourdata') ||
      pathnameLowerCase.startsWith('/settings') ||
      (pathnameLowerCase === '/start-a-campaign') ||
      (pathnameLowerCase === '/start-a-challenge')) {
    // We want to SHOW the footer bar on the above path patterns
    showFooterBar = isMobileScreenSize();
  } else {
    // URLs like: https://WeVote.US/orlandosentinel  (The URL pathname consists of a Twitter Handle only)
    contentFullWidthMode = true;
    showFooterBar = isMobileScreenSize();
  }

  // We are only showing the page footer on the "Ready" landing page.
  // Once the voter is signed in, we weave the footer links into the profile page
  let showFooterMain = false;
  if (isChallengeSEOFriendlyURL(pathnameLowerCase)) {
    // We never want to show the footer on Challenge URLs
    showFooterMain = false;
  } else if (
    isPoliticianSEOFriendlyURL(pathnameLowerCase) ||
    pathnameLowerCase.endsWith('/cs/') ||
    (pathnameLowerCase.startsWith('/ready') && !isSEOFriendlyURL(pathnameLowerCase)) ||
    (pathnameLowerCase === '/start-a-campaign') ||
    (pathnameLowerCase === '/welcome') ||
    (pathnameLowerCase === '/')) {
    showFooterMain = true;
    // Note: This gets overridden (and the footer is not shown) in a variety of Cordova configurations
  }

  let showShareButtonFooter = false;
  const onFollowSubPage = stringContains('/m/followers', pathnameLowerCase) || stringContains('/m/following', pathnameLowerCase);
  if (extensionPageMode) {
    // No headers or footers
  } else if (pathnameLowerCase.startsWith('/ballot') ||
    (pathnameLowerCase.startsWith('/candidate') && !isSEOFriendlyURL(pathnameLowerCase)) ||
    (pathnameLowerCase.startsWith('/measure') && !isSEOFriendlyURL(pathnameLowerCase)) ||
    (pathnameLowerCase.startsWith('/office') && !isSEOFriendlyURL(pathnameLowerCase)) ||
    (voterGuideMode && !onFollowSubPage)) {
    showShareButtonFooter = isWebApp() || (!isIOSAppOnMac() && isSmallScreen);
  }
  // console.log('getApplicationViewBooleans, showBackToBallotHeader: ', showBackToBallotHeader, ' showFooterBar: ', showFooterBar, ', pathnameLowerCase:', pathnameLowerCase, ', showBackToSettingsMobile:', showBackToSettingsMobile);

  return {
    headerNotVisible,
    inTheaterMode,
    campaignsMode,
    candidatesMode,
    contentFullWidthMode,
    extensionPageMode,
    friendsMode,
    readyMode,
    settingsMode,
    sharedItemLandingPage,
    showBackToFriends,
    showBackToBallotHeader,
    showBackToSettingsDesktop,
    showBackToSettingsMobile,
    showBackToValues,
    showBackToVoterGuide,
    showBackToVoterGuides,
    showFooterBar,
    showFooterMain,
    showShareButtonFooter,
    twitterSignInMode,
    voteMode,
    valuesMode,
    voterGuideCreatorMode,
    voterGuideMode,
  };
}

let weVoteBrandingOffGlobal;
export function weVoteBrandingOff () {
  if (weVoteBrandingOffGlobal !== undefined) {
    return weVoteBrandingOffGlobal;
  }
  const { location: { query } } = window;
  const weVoteBrandingOffFromUrl = query ? query.we_vote_branding_off : false;
  const weVoteBrandingOffFromCookie = Cookies.get('we_vote_branding_off');
  if (weVoteBrandingOffFromUrl && !weVoteBrandingOffFromCookie) {
    Cookies.set('we_vote_branding_off', weVoteBrandingOffFromUrl, 1, { path: '/' });
  }

  if (weVoteBrandingOffFromUrl || weVoteBrandingOffFromCookie) {
    Cookies.set('show_full_navigation', '1', { path: '/' });
  }

  weVoteBrandingOffGlobal = weVoteBrandingOffFromUrl || weVoteBrandingOffFromCookie;
  return weVoteBrandingOffGlobal;
}

export function displayTopMenuShadow () {  //
  return !['ballot', 'candidate'].includes(normalizedHrefPage());
}

export function avatarGeneric () {
  return normalizedImagePath('../../img/global/icons/avatar-generic.png');
}

export function dumpCookies () {
  console.log('dumpCookies: ', document.cookie);
  // console.log('cookies dump keys,length:', this.keys().length, this.keys());
  // return this.keys().forEach((key) => {
  //   console.log(`cookies dump for ${key} - ${this.getItem(key)}`);
  // });
}
