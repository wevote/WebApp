import { stringContains } from './textFormat';
import { isCordova, isWebApp } from './cordovaUtils';


// We have to do all this, because we allow urls like https://wevote.us/aclu where "aclu" is a twitter account.
// Based on the path, decide if we want theaterMode, contentFullWidthMode, or voterGuideMode
export function getApplicationViewBooleans (pathname) {
  let inTheaterMode = false;
  let contentFullWidthMode = false;
  let friendsMode = false;
  const pathnameLowerCase = pathname.toLowerCase() || '';
  let settingsMode = false;
  let voteMode = false;
  let valuesMode = false;
  let voterGuideMode = false;
  let voterGuideShowGettingStartedNavigation = false;
  if (pathnameLowerCase === '/intro/story' ||
    pathnameLowerCase === '/intro/sample_ballot' ||
    pathnameLowerCase === '/intro/get_started' ||
    pathnameLowerCase === '/more/myballot' ||
    pathnameLowerCase === '/voterguidechooseelection' ||
    pathnameLowerCase === '/voterguidegetstarted' ||
    pathnameLowerCase === '/voterguideorgtype' ||
    pathnameLowerCase === '/voterguideorginfo' ||
    pathnameLowerCase.startsWith('/voterguidepositions') ||
    pathnameLowerCase === '/wevoteintro/network') {
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
    pathnameLowerCase === '/more/connect' ||
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
  } else if (stringContains('/settings', pathnameLowerCase) ||
    pathnameLowerCase === '/more/hamburger') {
    contentFullWidthMode = true;
    settingsMode = true;
  } else if (pathnameLowerCase.startsWith('/value') || // '/values'
    pathnameLowerCase === '/opinions' ||
    pathnameLowerCase === '/opinions_followed' ||
    pathnameLowerCase === '/opinions_ignored') {
    contentFullWidthMode = true;
    valuesMode = true;
  } else if (pathnameLowerCase.startsWith('/friends') ||
    pathnameLowerCase === '/facebook_invitable_friends') {
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
  if (stringContains('/btdb/', pathnameLowerCase) || // back-to-default-ballot
    stringContains('/btdo/', pathnameLowerCase) || // back-to-default-office
    stringContains('/bto/', pathnameLowerCase) ||
    stringContains('/btvg/', pathnameLowerCase)) {
    // If here, we want the top header to be "Back To..."
    // "/btdb/" stands for "Back To Default Ballot Page" back-to-default-ballot
    // "/btdo/" stands for "Back To Default Office Page" back-to-default-office
    // "/btvg/" stands for "Back To Voter Guide Page"
    // "/bto/" stands for "Back To Voter Guide Office Page"
    showBackToBallotHeader = true;
  } else if (pathnameLowerCase === '/settings/account' ||
    pathnameLowerCase === '/settings/address' ||
    pathnameLowerCase === '/settings/election' ||
    stringContains('/settings/issues', pathnameLowerCase) ||
    pathnameLowerCase === '/settings/notifications' ||
    pathnameLowerCase === '/settings/profile' ||
    pathnameLowerCase === '/settings/tools' ||
    stringContains('/settings/voter_guide', pathnameLowerCase) ||
    pathnameLowerCase === '/settings/voterguidesmenu' ||
    pathnameLowerCase === '/settings/voterguidelist') {
    showBackToSettings = true;
  } else if (pathnameLowerCase.startsWith('/value/') ||
    pathnameLowerCase === '/values/list' ||
    pathnameLowerCase === '/opinions' ||
    pathnameLowerCase === '/opinions_followed' ||
    pathnameLowerCase === '/opinions_ignored') {
    showBackToValues = true;
  } else if (pathnameLowerCase === '/friends/add' ||
    pathnameLowerCase === '/friends/current' ||
    pathnameLowerCase === '/friends/requests' ||
    pathnameLowerCase === '/friends/invitationsbyme' ||
    pathnameLowerCase === '/friends/suggested' ||
    pathnameLowerCase === '/friends/invitebyemail' ||
    pathnameLowerCase === '/facebook_invitable_friends') {
    showBackToFriends = true;
  } else if (stringContains('/vg/', pathnameLowerCase)) {
    showBackToVoterGuides = true; // DALE 2019-02-19 Soon we should be able to delete the interim voter guides page
  }

  if (pathnameLowerCase.startsWith('/measure') && isCordova()) {
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
    if (['/ballot', '/ballot/vote', '/friends', '/more/network', '/office', '/opinions', '/settings',
      '/value'].some(match => pathname.toLowerCase().startsWith(match))) { // '/values'
      global.zE('webWidget', 'show');
    } else {
      global.zE('webWidget', 'hide');
    }
  }
}
