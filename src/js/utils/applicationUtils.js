import cookies from './cookies';
import { isIOSAppOnMac, isCordova, isWebApp } from './cordovaUtils';
import { startsWith, stringContains } from './textFormat';


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
    startsWith('/voterguidepositions', pathnameLowerCase) ||
    startsWith('/wevoteintro', pathnameLowerCase)) {
    inTheaterMode = true;
  } else if (startsWith('/candidate/', pathnameLowerCase) ||
    pathnameLowerCase === '/for-campaigns' ||
    pathnameLowerCase === '/for-organizations' ||
    startsWith('/how', pathnameLowerCase) ||
    pathnameLowerCase === '/intro' ||
    startsWith('/measure/', pathnameLowerCase) ||
    pathnameLowerCase === '/more/about' ||
    pathnameLowerCase === '/more/absentee' ||
    pathnameLowerCase === '/more/alerts' ||
    pathnameLowerCase === '/more/credits' ||
    startsWith('/more/donate', pathnameLowerCase) ||
    pathnameLowerCase === '/more/elections' ||
    startsWith('/office/', pathnameLowerCase) ||
    pathnameLowerCase === '/more/network' ||
    pathnameLowerCase === '/more/network/friends' ||
    pathnameLowerCase === '/more/network/issues' ||
    pathnameLowerCase === '/more/network/organizations' ||
    startsWith('/more/pricing', pathnameLowerCase) ||
    pathnameLowerCase === '/more/privacy' ||
    pathnameLowerCase === '/more/register' ||
    pathnameLowerCase === '/more/sign_in' ||
    pathnameLowerCase === '/more/terms' ||
    pathnameLowerCase === '/more/verify' ||
    startsWith('/verifythisisme/', pathnameLowerCase) ||
    pathnameLowerCase === '/welcome') {
    contentFullWidthMode = true;
  } else if (startsWith('/ballot/vote', pathnameLowerCase)) {
    contentFullWidthMode = false; // I set this to false to fix the header padding issues in /ballot/vote
    voteMode = true;
  } else if (startsWith('/ballot', pathnameLowerCase)) {
    contentFullWidthMode = false;
  } else if (startsWith('/news', pathnameLowerCase)) {
    contentFullWidthMode = false;
  } else if (stringContains('/settings/positions', pathnameLowerCase)) {
    // contentFullWidthMode = true;
    voterGuideCreatorMode = true;
  } else if (startsWith('/ready', pathnameLowerCase)) {
    contentFullWidthMode = true;
    readyMode = true;
  } else if (stringContains('/settings', pathnameLowerCase) ||
    pathnameLowerCase === '/settings/voterguidesmenu' ||
    pathnameLowerCase === '/settings/voterguidelist') {
    contentFullWidthMode = true;
    settingsMode = true;
  } else if (startsWith('/value', pathnameLowerCase) || // '/values'
    startsWith('/opinions', pathnameLowerCase)) {
    contentFullWidthMode = true;
    valuesMode = true;
  } else if (startsWith('/candidate-for-extension', pathnameLowerCase) ||
    startsWith('/add-candidate-for-extension', pathnameLowerCase) ||
    startsWith('/more/extensionsignin', pathnameLowerCase)) {
    extensionPageMode = true;
  } else if (startsWith('/-', pathnameLowerCase)) {
    sharedItemLandingPage = true;
  } else if (startsWith('/twitter_sign_in', pathnameLowerCase)) {
    twitterSignInMode = true;
  } else if (startsWith('/friends', pathnameLowerCase) ||
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
    stringContains('/btvg/', pathnameLowerCase)) {
    // If here, we want the top header to be "Back To..."
    // "/btdb/" stands for "Back To Default Ballot Page" back-to-default-ballot
    // "/btdo/" stands for "Back To Default Office Page" back-to-default-office
    // "/btvg/" stands for "Back To Voter Guide Page"
    // "/bto/" stands for "Back To Voter Guide Office Page"
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
  } else if (startsWith('/value/', pathnameLowerCase) ||
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

  if (startsWith('/measure', pathnameLowerCase) && isCordova()) {
    showBackToBallotHeader = true;
  }

  let showFooterBar;
  // console.log('stringContains(\'/settings/positions\', pathnameLowerCase):', stringContains('/settings/positions', pathnameLowerCase), pathnameLowerCase);
  if (!pathnameLowerCase) {
    showFooterBar = false;
  // ///////// EXCLUDE: The following are URLS we want to specifically exclude (because otherwise they will be picked up in a broader pattern in the next branch
  } else if (stringContains('/b/btdb', pathnameLowerCase) ||
      stringContains('/b/btdo', pathnameLowerCase) ||
      stringContains('/btcand/', pathnameLowerCase) ||
      (pathnameLowerCase === '/for-campaigns') ||
      (pathnameLowerCase === '/for-organizations') ||
      startsWith('/how', pathnameLowerCase) ||
      (pathnameLowerCase === '/more/about') ||
      (pathnameLowerCase === '/more/credits') ||
      startsWith('/more/donate', pathnameLowerCase) ||
      (pathnameLowerCase === '/more/myballot') ||
      startsWith('/more/pricing', pathnameLowerCase) ||
      (pathnameLowerCase === '/welcome') ||
      startsWith('/value/', pathnameLowerCase) ||
      startsWith('/values/', pathnameLowerCase) ||
      stringContains('/settings/positions', pathnameLowerCase) ||
      startsWith('/settings/voterguidelist', pathnameLowerCase) ||
      startsWith('/settings/voterguidesmenu', pathnameLowerCase) ||
      startsWith('/register', pathnameLowerCase)
  ) {
    // We want to HIDE the footer bar on the above path patterns
    showFooterBar = false;
    // ///////// SHOW: The following are URLS where we want the footer to show
  } else if (startsWith('/ballot', pathnameLowerCase) ||
      startsWith('/candidate', pathnameLowerCase) || // Show Footer if back to not specified above
      startsWith('/friends', pathnameLowerCase) ||
      startsWith('/measure', pathnameLowerCase) || // Show Footer if back to not specified above
      (pathnameLowerCase === '/more/attributions') ||
      (pathnameLowerCase === '/more/privacy') ||
      (pathnameLowerCase === '/more/terms') ||
      startsWith('/news', pathnameLowerCase) ||
      startsWith('/office', pathnameLowerCase) || // Show Footer if back to not specified above
      startsWith('/values', pathnameLowerCase) ||
      startsWith('/settings/account', pathnameLowerCase) ||
      startsWith('/settings/domain', pathnameLowerCase) ||
      startsWith('/settings/notifications', pathnameLowerCase) ||
      startsWith('/settings/profile', pathnameLowerCase) ||
      startsWith('/settings/sharing', pathnameLowerCase) ||
      startsWith('/settings/subscription', pathnameLowerCase) ||
      startsWith('/settings/text', pathnameLowerCase) ||
      startsWith('/settings/tools', pathnameLowerCase) ||
      startsWith('/settings', pathnameLowerCase)) {
    // We want to SHOW the footer bar on the above path patterns
    showFooterBar = !isIOSAppOnMac() && isSmallScreen;
  } else {
    // URLs like: https://WeVote.US/orlandosentinel  (The URL pathname consists of a Twitter Handle only)
    showFooterBar = !isIOSAppOnMac() && isSmallScreen;
    contentFullWidthMode = true;
  }

  let showShareButtonFooter = false;
  const onFollowSubPage = stringContains('/m/followers', pathnameLowerCase) || stringContains('/m/following', pathnameLowerCase);
  if (startsWith('/ballot', pathnameLowerCase) ||
    startsWith('/candidate', pathnameLowerCase) ||
    startsWith('/measure', pathnameLowerCase) ||
    startsWith('/office', pathnameLowerCase) ||
    startsWith('/ready', pathnameLowerCase) ||
    (voterGuideMode && !onFollowSubPage)) {
    showShareButtonFooter = !isIOSAppOnMac() && isSmallScreen;
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
        (match) => startsWith(match, pathname.toLowerCase()),
      )) &&
      !['/wevoteintro', '/how', '/candidate-for-extension'].some(
        (match) => startsWith(match, pathname.toLowerCase()),
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
  const weVoteBrandingOffFromCookie = cookies.getItem('we_vote_branding_off');
  const oneDayExpires = 86400;
  if (weVoteBrandingOffFromUrl && !weVoteBrandingOffFromCookie) {
    cookies.setItem('we_vote_branding_off', weVoteBrandingOffFromUrl, oneDayExpires, '/');
  }

  if (weVoteBrandingOffFromUrl || weVoteBrandingOffFromCookie) {
    cookies.setItem('show_full_navigation', '1', Infinity, '/');
  }

  weVoteBrandingOffGlobal = weVoteBrandingOffFromUrl || weVoteBrandingOffFromCookie;
  return weVoteBrandingOffGlobal;
}
