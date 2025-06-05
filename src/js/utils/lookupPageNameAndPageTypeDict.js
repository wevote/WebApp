// lookupPageNameAndPageTypeDict.js
import { isChallengeSEOFriendlyURL, isPoliticianSEOFriendlyURL } from '../common/utils/isSEOFriendlyURL';
import { isWeVoteMarketingSite } from '../common/utils/hrefUtils';

// If there is a static path for a page, enter it here. If the path includes dynamic elements,
//  you'll need to generate the pageName and pageType dynamically in calculatePageNameAndPageTypeDict below.
const pageNameAndTypeSimpleDict = {
  '/': {
    pageName: 'Ready',
    pageType: 'homepage',
  },
  '/about': {
    pageName: 'About',
    pageType: 'about',
  },
  '/challenges': {
    pageName: 'ChallengesHomeLoader',
    pageType: 'challenge',
  },
  '/donate': {
    pageName: !isWeVoteMarketingSite() || window.isCordovaGlobal ? 'Ready' : 'Donate',
    pageType: !isWeVoteMarketingSite() || window.isCordovaGlobal ? 'homepage' : 'donate',
  },
  '/more/about': {
    pageName: 'About',
    pageType: 'about',
  },
  '/more/attributions': {
    pageName: 'Attributions',
    pageType: 'attributions',
  },
  '/more/faq': {
    pageName: 'FAQ',
    pageType: 'faq',
  },
  '/more/network/friends': {
    pageName: 'Friends',
    pageType: 'friends',
  },
  '/more/privacy': {
    pageName: 'Privacy',
    pageType: 'privacy',
  },
  '/more/terms': {
    pageName: 'TermsOfService',
    pageType: 'termsOfService',
  },
  '/privacy': {
    pageName: 'Privacy',
    pageType: 'privacy',
  },
  '/ready': {
    pageName: 'Ready',
    pageType: 'homepage',
  },
  // All pageType 'settings'
  '/settings': {
    pageName: 'Settings',
    pageType: 'settings',
  },
  '/settings/account': {
    pageName: 'Account',
    pageType: 'settings',
  },
  '/settings/email': {
    pageName: 'Email',
    pageType: 'settings',
  },
  '/settings/notifications': {
    pageName: 'Notifications',
    pageType: 'settings',
  },
  '/settings/profile': {
    pageName: 'Profile',
    pageType: 'settings',
  },
  '/settings/yourdata': {
    pageName: 'Yourdata',
    pageType: 'settings',
  },
  '/terms': {
    pageName: 'TermsOfService',
    pageType: 'termsOfService',
  },
};

function calculatePageNameAndPageTypeDict (path) {
  // console.log("gtmPageNameAndType, path:", path);
  let settingsPageName = 'notSet'; // Per our naming convention for pageName, this would normally be 'NotSet' but I think the value of having settingsPageName being identical to settingsPageType will save us grief in the future.
  let settingsPageType = 'notSet';

  if (path.startsWith('/ballot')) {
    settingsPageName = 'Ballot';
    settingsPageType = 'ballot';
  } else if (path.endsWith('/cs/')) {
    settingsPageName = 'CampaignsHomeLoader';
    settingsPageType = 'candidate';
  } else if (isChallengeSEOFriendlyURL(path)) {
    // We need to add more complex logic here because there are many paths in /src/App.jsx that use "/+/" in the path
    settingsPageType = 'challenge';
    if (path.endsWith('join-challenge')) {
      settingsPageName = 'ChallengeInviteFriendsJoin';
    } else if (path.endsWith('customize-message')) {
      settingsPageName = 'ChallengeInviteCustomizeMessage';
    } else if (path.endsWith('invite-friends')) {
      settingsPageName = 'ChallengeInviteFriends';
    } else if (path.endsWith('edit')) {
      settingsPageName = 'ChallengeStartEditAll';
    } else {
      settingsPageName = 'ChallengeHomePage';
    }
  } else if (path.startsWith('/friends')) {
    settingsPageName = 'Friends';
    settingsPageType = 'friends';
  } else if (path.startsWith('/news')) {
    settingsPageName = 'News';
    settingsPageType = 'news';
  } else if (isPoliticianSEOFriendlyURL(path)) {
    // We need to add more complex logic here because there are many paths in /src/App.jsx that use "/-/" in the path
    settingsPageType = 'politician';
    settingsPageName = 'PoliticianDetailsPage';
  } else if (/^\/[^/\s]+$/.test(path)) {
    settingsPageName = 'TwitterHandleLanding';
    settingsPageType = 'twitterHandleLanding';
  }

  return {
    pageName: settingsPageName,
    pageType: settingsPageType,
  };
}

export default function lookupPageNameAndPageTypeDict (path) {
  if (pageNameAndTypeSimpleDict[path]) {
    return pageNameAndTypeSimpleDict[path];
  } else {
    return calculatePageNameAndPageTypeDict(path);
  }
}
