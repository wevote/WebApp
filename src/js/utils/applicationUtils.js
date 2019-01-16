import { stringContains } from "./textFormat";
import { isCordova, isWebApp } from "./cordovaUtils";


// We have to do all this, because we allow urls like https://wevote.us/aclu where "aclu" is a twitter account.
// Based on the path, decide if we want theaterMode, contentFullWidthMode, or voterGuideMode
export function getApplicationViewBooleans (pathname) {
  let inTheaterMode = false;
  let contentFullWidthMode = false;
  let settingsMode = false;
  let voterGuideMode = false;
  let voterGuideShowGettingStartedNavigation = false;
  if (pathname === "/intro/story" ||
    pathname === "/intro/sample_ballot" ||
    pathname === "/intro/get_started" ||
    pathname === "/voterguidechooseelection" ||
    pathname === "/voterguidegetstarted" ||
    pathname === "/voterguideorgtype" ||
    pathname === "/voterguideorginfo" ||
    pathname.startsWith("/voterguidepositions") ||
    pathname === "/wevoteintro/network") {
    inTheaterMode = true;
  } else if (pathname.startsWith("/candidate/") ||
    pathname === "/facebook_invitable_friends" ||
    pathname === "/friends" ||
    pathname === "/friends/invitebyemail" ||
    pathname === "/intro" ||
    pathname === "/issues_followed" ||
    pathname === "/issues_to_follow" ||
    pathname.startsWith("/measure/") ||
    pathname === "/more/about" ||
    pathname === "/more/absentee" ||
    pathname === "/more/alerts" ||
    pathname === "/more/myballot" ||
    pathname === "/more/connect" ||
    pathname === "/more/credits" ||
    pathname === "/more/donate" ||
    pathname === "/more/donate_thank_you" ||
    pathname === "/more/elections" ||
    pathname === "/more/howtouse" ||
    pathname.startsWith("/office/") ||
    pathname === "/more/network" ||
    pathname === "/more/network/friends" ||
    pathname === "/more/network/issues" ||
    pathname === "/more/network/organizations" ||
    pathname === "/more/organization" ||
    pathname === "/more/privacy" ||
    pathname === "/more/register" ||
    pathname === "/more/sign_in" ||
    pathname === "/more/team" ||
    pathname === "/more/terms" ||
    pathname === "/more/tools" ||
    pathname === "/more/verify" ||
    pathname === "/more/vision" ||
    pathname === "/opinions" ||
    pathname === "/opinions_followed" ||
    pathname === "/opinions_ignored" ||
    pathname.startsWith("/verifythisisme/") ||
    pathname === "/welcome") {
    contentFullWidthMode = true;
  } else if (pathname.startsWith("/ballot")) {
    contentFullWidthMode = false;
  } else if (stringContains("/settings", pathname) ||
    pathname === "/more/hamburger") {
    contentFullWidthMode = true;
    settingsMode = true;
  } else {
    voterGuideMode = true;
    voterGuideShowGettingStartedNavigation = true;
  }

  let showBackToHeader = false;
  let showBackToSettings = false;
  let showBackToVoterGuides = false;
  if (stringContains("/btdb/", pathname) ||
    stringContains("/btdo/", pathname) ||
    stringContains("/bto/", pathname) ||
    stringContains("/btvg/", pathname) ||
    stringContains("/more/myballot", pathname)
  ) {
    // If here, we want the top header to be "Back To..."
    // "/btdb/" stands for "Back To Default Ballot Page"
    // "/btdo/" stands for "Back To Default Office Page"
    // "/btvg/" stands for "Back To Voter Guide Page"
    // "/bto/" stands for "Back To Voter Guide Office Page"
    showBackToHeader = true;
  } else if (pathname === "/settings/account" ||
    pathname === "/settings/address" ||
    pathname === "/settings/election" ||
    pathname === "/settings/issues" ||
    pathname === "/settings/notifications" ||
    pathname === "/settings/profile" ||
    pathname === "/settings/voterguidesmenu" ||
    pathname === "/settings/voterguidelist") {
    showBackToSettings = true;
  } else if (stringContains("/vg/", pathname)) {
    showBackToVoterGuides = true;
  }

  if (pathname.startsWith("/measure") && isCordova()) {
    showBackToHeader = true;
  }

  return {
    inTheaterMode,
    contentFullWidthMode,
    settingsMode,
    voterGuideMode,
    voterGuideShowGettingStartedNavigation,
    showBackToHeader,
    showBackToSettings,
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
    if (["/ballot", "/more/network", "/settings"].some(match => pathname.startsWith(match))) {
      global.zE("webWidget", "show");
    } else {
      global.zE("webWidget", "hide");
    }
  }
}
