import { cordovaDot, isCordova, isIOSAppOnMac, isWebApp } from './cordovaUtils';
import Cookies from './js-cookie/Cookies';
import { stringContains } from './textFormat';

// We have to do all this, because we allow urls where the path starts with a twitter username (handle)
// as a result every path has to be evaluated for an exact routable match, and what is left is a twitter handle path.
// Based on the pathname parameter, decide if we want theaterMode, contentFullWidthMode, or voterGuideMode
export function getApplicationViewBooleans (pathname) {
  // We don't want to do all the work to create the footer, fire off api queries, etc., only to then set "display: none" based on a breakpoint!
  const isSmallScreen = window.screen.width < 992;
  let inTheaterMode = false;
  let contentFullWidthMode = false;
  let extensionPageMode = false;
  let friendsMode = false;
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
  if (pathnameLowerCase === '/intro/story' ||
    pathnameLowerCase === '/intro/sample_ballot' ||
    pathnameLowerCase === '/intro/get_started' ||
    pathnameLowerCase === '/more/myballot' ||
    pathnameLowerCase.startsWith('/voterguidepositions') ||
    pathnameLowerCase.startsWith('/wevoteintro')) {
    inTheaterMode = true;
  } else if (pathnameLowerCase.startsWith('/candidate/') ||
    pathnameLowerCase === '/for-campaigns' ||
    pathnameLowerCase === '/for-organizations' ||
    pathnameLowerCase.startsWith('/how') ||
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
    pathnameLowerCase.startsWith('/verifythisisme/') ||
    pathnameLowerCase === '/welcome') {
    contentFullWidthMode = true;
  } else if (pathnameLowerCase.startsWith('/ballot/vote')) {
    contentFullWidthMode = false; // I set this to false to fix the header padding issues in /ballot/vote
    voteMode = true;
  } else if (pathnameLowerCase.startsWith('/ballot')) {
    contentFullWidthMode = false;
  } else if (pathnameLowerCase.startsWith('/news')) {
    contentFullWidthMode = false;
  } else if (stringContains('/settings/positions', pathnameLowerCase)) {
    // contentFullWidthMode = true;
    voterGuideCreatorMode = true;
  } else if (pathnameLowerCase.startsWith('/ready')) {
    contentFullWidthMode = true;
    readyMode = true;
  } else if (stringContains('/settings', pathnameLowerCase) ||
    pathnameLowerCase === '/settings/voterguidesmenu' ||
    pathnameLowerCase === '/settings/voterguidelist') {
    contentFullWidthMode = true;
    settingsMode = true;
  } else if (pathnameLowerCase.startsWith('/value') || // '/values'
    pathnameLowerCase.startsWith('/opinions')) {
    contentFullWidthMode = true;
    valuesMode = true;
  } else if (pathnameLowerCase.startsWith('/candidate-for-extension') ||
    pathnameLowerCase.startsWith('/add-candidate-for-extension') ||
    pathnameLowerCase.startsWith('/more/extensionsignin')) {
    extensionPageMode = true;
  } else if (pathnameLowerCase.startsWith('/-')) {
    sharedItemLandingPage = true;
  } else if (pathnameLowerCase.startsWith('/twitter_sign_in')) {
    twitterSignInMode = true;
  } else if (pathnameLowerCase.startsWith('/friends') ||
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
  if (stringContains('/m/', pathnameLowerCase)) {
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
    pathnameLowerCase === '/settings/tools') {
    showBackToSettingsMobile = true;
  } else if (pathnameLowerCase.startsWith('/value/') ||
    pathnameLowerCase === '/values/list' ||
    // pathnameLowerCase === '/opinions' ||
    pathnameLowerCase === '/opinions_followed' ||
    pathnameLowerCase === '/opinions_ignored') {
    showBackToValues = true;
  } else if (pathnameLowerCase === '/friends/add' ||
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

  if (pathnameLowerCase.startsWith('/measure') && isCordova()) {
    showBackToBallotHeader = true;
  }

  let showFooterBar;
  let showFooterMain;
  // console.log('stringContains(\'/settings/positions\', pathnameLowerCase):', stringContains('/settings/positions', pathnameLowerCase), pathnameLowerCase);
  if (!pathnameLowerCase) {
    showFooterBar = isCordova();
  // ///////// EXCLUDE: The following are URLS we want to specifically exclude (because otherwise they will be picked up in a broader pattern in the next branch
  } else if (stringContains('/b/btdb', pathnameLowerCase) ||
      (pathnameLowerCase === '/about') ||
      (pathnameLowerCase === '/for-campaigns') ||
      (pathnameLowerCase === '/for-organizations') ||
      (pathnameLowerCase === '/more/about') ||
      (pathnameLowerCase === '/more/credits') ||
      (pathnameLowerCase === '/more/myballot') ||
      (pathnameLowerCase === '/values/list') ||
      (pathnameLowerCase === '/welcome') ||
      pathnameLowerCase.startsWith('/how') ||
      pathnameLowerCase.startsWith('/more/donate') ||
      pathnameLowerCase.startsWith('/more/pricing') ||
      pathnameLowerCase.startsWith('/register') ||
      pathnameLowerCase.startsWith('/settings/voterguidelist') ||
      pathnameLowerCase.startsWith('/settings/voterguidesmenu') ||
      pathnameLowerCase.startsWith('/twitter_sign_in') ||
      pathnameLowerCase.startsWith('/wevoteintro/') ||
      pathnameLowerCase.startsWith('/value/') ||
      stringContains('/b/btdo', pathnameLowerCase) ||
      stringContains('/btcand/', pathnameLowerCase) ||
      stringContains('/settings/positions', pathnameLowerCase)) {
    // We want to HIDE the footer bar on the above path patterns
    showFooterBar = false;
    showFooterMain = false;
    // ///////// SHOW: The following are URLS where we want the footer to show
  } else if (pathnameLowerCase.startsWith('/ballot') ||
      pathnameLowerCase.startsWith('/candidate') || // Show Footer if back to not specified above
      pathnameLowerCase.startsWith('/friends') ||
      pathnameLowerCase.startsWith('/measure') || // Show Footer if back to not specified above
      (pathnameLowerCase === '/more/attributions') ||
      (pathnameLowerCase === '/more/privacy') ||
      (pathnameLowerCase === '/more/terms') ||
      pathnameLowerCase.startsWith('/news') ||
      pathnameLowerCase.startsWith('/office') || // Show Footer if back to not specified above
      pathnameLowerCase.startsWith('/values') ||
      pathnameLowerCase.startsWith('/settings/account') ||
      pathnameLowerCase.startsWith('/settings/domain') ||
      pathnameLowerCase.startsWith('/settings/notifications') ||
      pathnameLowerCase.startsWith('/settings/profile') ||
      pathnameLowerCase.startsWith('/settings/sharing') ||
      pathnameLowerCase.startsWith('/settings/subscription') ||
      pathnameLowerCase.startsWith('/settings/text') ||
      pathnameLowerCase.startsWith('/settings/tools') ||
      pathnameLowerCase.startsWith('/settings')) {
    // We want to SHOW the footer bar on the above path patterns
    showFooterBar = isWebApp() || (!isIOSAppOnMac() && isSmallScreen);
    showFooterMain = isWebApp();
  } else {
    // URLs like: https://WeVote.US/orlandosentinel  (The URL pathname consists of a Twitter Handle only)
    contentFullWidthMode = true;
    showFooterBar = isWebApp() || (!isIOSAppOnMac() && isSmallScreen);
    showFooterMain = isWebApp();
  }

  let showShareButtonFooter = false;
  const onFollowSubPage = stringContains('/m/followers', pathnameLowerCase) || stringContains('/m/following', pathnameLowerCase);
  if (pathnameLowerCase.startsWith('/ballot') ||
    pathnameLowerCase.startsWith('/candidate') ||
    pathnameLowerCase.startsWith('/measure') ||
    pathnameLowerCase.startsWith('/office') ||
    pathnameLowerCase.startsWith('/ready') ||
    (voterGuideMode && !onFollowSubPage)) {
    showShareButtonFooter = isWebApp() || (!isIOSAppOnMac() && isSmallScreen);
  }
  // console.log('getApplicationViewBooleans, showBackToBallotHeader: ', showBackToBallotHeader, ' showFooterBar: ', showFooterBar, ', pathnameLowerCase:', pathnameLowerCase, ', showBackToSettingsMobile:', showBackToSettingsMobile);

  return {
    inTheaterMode,
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

export function hideZenDeskHelpVisibility () {
  // console.log('hideZenDeskHelpVisibility');
  if (isWebApp()) {
    try {
      const { zE } = global;
      if (zE) {     // This library is delayed load, and may not have loaded yet
        zE('webWidget', 'show');
      }
    } catch (err) {
      console.log('hideZenDeskHelpVisibility global.zE failure hide, ', err);
    }
  }
}

export function showZenDeskHelpVisibility () {
  // console.log('showZenDeskHelpVisibility');
  if (isWebApp()) {
    try {
      const { zE } = global;
      if (zE) {
        zE('webWidget', 'show');
      }
    } catch (err) {
      console.log('hideZenDeskHelpVisibility global.zE failure show, ', err);
    }
  }
}

// Choose to show/hide zendesk help widget based on route
export function setZenDeskHelpVisibility (pathname) {
  // console.log('setZenDeskHelpVisibility true, pathname:', pathname);
  const { zE } = global;   // takes 16 seconds after load to be initialized, see index.html
  if (isWebApp() && zE) {
    const { showFooterBar } = getApplicationViewBooleans(pathname);
    // console.log('setZenDeskHelpVisibility true, pathname:', pathname, ', showFooterBar:', showFooterBar);
    if ((showFooterBar ||
      ['/ballot', '/ballot/vote', '/friends', '/more/network', '/office', '/opinions', '/settings', '/value'].some(
        (match) => pathname.toLowerCase().startsWith(match),
      )) &&
      !['/wevoteintro', '/how', '/candidate-for-extension'].some(
        (match) => pathname.toLowerCase().startsWith(match),
      )
    ) {
      showZenDeskHelpVisibility();
    } else {
      hideZenDeskHelpVisibility();
    }
  }
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

export function normalizedHref () {
  const { location: { hash, pathname } } = window;
  return isWebApp() ? pathname.toLowerCase() : hash.substring(1).toLowerCase();
}

export function normalizedHrefPage () {
  const [, page] = normalizedHref().split('/');
  return page;
}

export function displayTopMenuShadow () {  //
  return !['ballot'].includes(normalizedHrefPage());
}

export function avatarGeneric () {
  return cordovaDot('../../img/global/icons/avatar-generic.png');
}

export function dumpCookies () {
  console.log('dumpCookies: ', document.cookie);
  // console.log('cookies dump keys,length:', this.keys().length, this.keys());
  // return this.keys().forEach((key) => {
  //   console.log(`cookies dump for ${key} - ${this.getItem(key)}`);
  // });
}
