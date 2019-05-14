import { stringContains } from './textFormat';
import { isCordova, isWebApp } from './cordovaUtils';


// We have to do all this, because we allow urls like https://wevote.us/aclu where "aclu" is a twitter account.
// Based on the path, decide if we want theaterMode, contentFullWidthMode, or voterGuideMode
export function getApplicationViewBooleans (pathname) {
  let inTheaterMode = false;
  let contentFullWidthMode = false;
  let friendsMode = false;
  let settingsMode = false;
  let voteMode = false;
  let valuesMode = false;
  let voterGuideMode = false;
  let voterGuideShowGettingStartedNavigation = false;
  if (pathname === '/intro/story' ||
    pathname === '/intro/sample_ballot' ||
    pathname === '/intro/get_started' ||
    pathname === '/voterguidechooseelection' ||
    pathname === '/voterguidegetstarted' ||
    pathname === '/voterguideorgtype' ||
    pathname === '/voterguideorginfo' ||
    pathname.startsWith('/voterguidepositions') ||
    pathname === '/wevoteintro/network') {
    inTheaterMode = true;
  } else if (pathname.startsWith('/candidate/') ||
    pathname === '/for-campaigns' ||
    pathname === '/for-organizations' ||
    pathname.startsWith('/how') ||
    pathname === '/intro' ||
    pathname === '/issues_followed' ||
    pathname === '/issues_to_follow' ||
    pathname.startsWith('/measure/') ||
    pathname === '/more/about' ||
    pathname === '/more/absentee' ||
    pathname === '/more/alerts' ||
    pathname === '/more/myballot' ||
    pathname === '/more/connect' ||
    pathname === '/more/credits' ||
    pathname === '/more/donate' ||
    pathname === '/more/donate_thank_you' ||
    pathname === '/more/elections' ||
    pathname.startsWith('/office/') ||
    pathname === '/more/network' ||
    pathname === '/more/network/friends' ||
    pathname === '/more/network/issues' ||
    pathname === '/more/network/organizations' ||
    pathname === '/more/pricing' ||
    pathname === '/more/privacy' ||
    pathname === '/more/register' ||
    pathname === '/more/sign_in' ||
    pathname === '/more/terms' ||
    pathname === '/more/tools' ||
    pathname === '/more/verify' ||
    pathname.startsWith('/verifythisisme/') ||
    pathname === '/welcome') {
    contentFullWidthMode = true;
  } else if (pathname.startsWith('/ballot/vote')) {
    contentFullWidthMode = true;
    voteMode = true;
  } else if (pathname.startsWith('/ballot')) {
    contentFullWidthMode = false;
  } else if (stringContains('/settings', pathname) ||
    pathname === '/more/hamburger') {
    contentFullWidthMode = true;
    settingsMode = true;
  } else if (pathname.startsWith('/value') || // '/values'
    pathname === '/opinions' ||
    pathname === '/opinions_followed' ||
    pathname === '/opinions_ignored') {
    contentFullWidthMode = true;
    valuesMode = true;
  } else if (pathname.startsWith('/friends') ||
    pathname === '/facebook_invitable_friends') {
    contentFullWidthMode = true;
    friendsMode = true;
  } else {
    voterGuideMode = true;
    voterGuideShowGettingStartedNavigation = true;
  }

  let showBackToFriends = false;
  let showBackToBallotHeader = false;
  let showBackToSettings = false;
  let showBackToValues = false;
  let showBackToVoterGuides = false;
  if (stringContains('/btdb/', pathname) || // back-to-default-ballot
    stringContains('/btdo/', pathname) || // back-to-default-office
    stringContains('/bto/', pathname) ||
    stringContains('/btvg/', pathname) ||
    stringContains('/more/myballot', pathname)
  ) {
    // If here, we want the top header to be "Back To..."
    // "/btdb/" stands for "Back To Default Ballot Page" back-to-default-ballot
    // "/btdo/" stands for "Back To Default Office Page" back-to-default-office
    // "/btvg/" stands for "Back To Voter Guide Page"
    // "/bto/" stands for "Back To Voter Guide Office Page"
    showBackToBallotHeader = true;
  } else if (pathname === '/settings/account' ||
    pathname === '/settings/address' ||
    pathname === '/settings/election' ||
    stringContains('/settings/issues', pathname) ||
    pathname === '/settings/notifications' ||
    pathname === '/settings/profile' ||
    stringContains('/settings/voter_guide', pathname) ||
    pathname === '/settings/voterguidesmenu' ||
    pathname === '/settings/voterguidelist') {
    showBackToSettings = true;
  } else if (pathname === '/opinions' ||
    pathname === '/opinions_followed' ||
    pathname === '/opinions_ignored' ||
    stringContains('/value/', pathname) ||
    pathname === '/values/list') {
    showBackToValues = true;
  } else if (pathname === '/friends/add' ||
    pathname === '/friends/current' ||
    pathname === '/friends/requests' ||
    pathname === '/friends/invitationsbyme' ||
    pathname === '/friends/suggested' ||
    pathname === '/friends/invitebyemail' ||
    pathname === '/facebook_invitable_friends') {
    showBackToFriends = true;
  } else if (stringContains('/vg/', pathname)) {
    showBackToVoterGuides = true; // DALE 2019-02-19 Soon we should be able to delete the interim voter guides page
  }

  if (pathname.startsWith('/measure') && isCordova()) {
    showBackToBallotHeader = true;
  }

  return {
    inTheaterMode,
    contentFullWidthMode,
    friendsMode,
    settingsMode,
    voteMode,
    valuesMode,
    voterGuideMode,
    voterGuideShowGettingStartedNavigation,
    showBackToFriends,
    showBackToBallotHeader,
    showBackToSettings,
    showBackToValues,
    showBackToVoterGuides,
  };
}

// November 2, 2018:  Polyfill for "Object.entries"
//   react-bootstrap 1.0 (bootstrap 4) relies on Object.entries in splitComponentProps.js
//   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries#Polyfill
export function polyfillObjectEntries () {
  if (!Object.entries) {
    Object.entries = function poly (obj) {
      const localProps = Object.keys(obj);
      let i = localProps.length;
      const resArray = new Array(i); // preallocate the Array
      while (i--) resArray[i] = [localProps[i], obj[localProps[i]]];
      return resArray;
    };
  }
}

// Choose to show/hide zendesk help widget based on route
export function setZenDeskHelpVisibility (pathname) {
  if (isWebApp()) {
    if (['/ballot', '/ballot/vote', '/candidate', '/friends', '/measure', '/more/network', '/office', '/opinions', '/settings',
      '/value'].some(match => pathname.startsWith(match))) { // '/values'
      global.zE('webWidget', 'show');
    } else {
      global.zE('webWidget', 'hide');
    }
  }
}
