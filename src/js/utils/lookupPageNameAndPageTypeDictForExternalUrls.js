// lookupPageNameAndPageTypeDictForExternalUrls.js

// If there is a static path for a page, enter it here. If the path includes dynamic elements,
//  you'll need to generate the pageName and pageType dynamically in calculatePageNameAndPageTypeDict below.
// TODO Update to with hard-coded External URLs we use
import { isChallengeSEOFriendlyURL, isPoliticianSEOFriendlyURL } from '../common/utils/isSEOFriendlyURL';

const pageNameAndTypeSimpleDictForExternalUrls = {
  'https://apps.apple.com/us/app/we-vote-voter-guide/id1347335726': {
    pageName: 'AppStoreiPhone',
    pageType: 'appStore',
  },
  'https://github.com/WeVote': {
    pageName: 'WeVoteGitHub',
    pageType: 'github',
  },
  'https://google.com': {
    pageName: 'GoogleSearch',
    pageType: 'search',
  },
  'https://help.wevote.us/hc/en-us': {
    pageName: 'WeVoteSupport',
    pageType: 'support',
  },
  'https://help.wevote.us/hc/en-us/articles/360034261733-How-were-the-Values-within-We-Vote-chosen-': {
    pageName: 'WeVoteValues',
    pageType: 'support',
  },
  'https://help.wevote.us/hc/en-us/requests/new': {
    pageName: 'HelpContact',
    pageType: 'help',
  },
  'https://play.google.com/store/apps/details?id=org.wevote.cordova&hl=en_US': {
    pageName: 'AppStoreAndroid',
    pageType: 'appStore',
  },
  'https://wevote.applytojob.com/apply': {
    pageName: 'WeVoteVolunteer',
    pageType: 'career',
  },
  'https://projects.propublica.org/nonprofits/organizations/472691544': {
    pageName: 'WeVoteBudget',
    pageType: 'donation',
  },
  'https://projects.propublica.org/nonprofits/organizations/811052585': {
    pageName: 'WeVoteBudget',
    pageType: 'donation',
  },
  'https://blog.wevote.us/': {
    pageName: 'WeVoteBlog',
    pageType: 'blog',
  },
  'https://www.WeVoteEducation.org': {
    pageName: 'WeVoteEducation',
    pageType: 'organization',
  },
  'https://www.WeVoteUSA.org': {
    pageName: 'WeVoteUSA',
    pageType: 'organization',
  },
  'https://wevote.us/more/about': {
    pageName: 'About',
    pageType: 'about',
  },
  'https://wevote.us/more/credits': {
    pageName: 'Credits',
    pageType: 'credits',
  },
};

/**
 * Takes a path to a page, or a full URL, but not a URL to wevote like https://wevote.us/ballot
 * TODO Update to recognize social sites, and other regular places we send people
 * @param pathOrURL
 * @returns {{pageName: string, pageType: string}}
 */
function calculatePageNameAndPageTypeDictForExternalUrls (pathOrURL) {
  // console.log("gtmPageNameAndType, path:", path);
  let pageName = 'notSet'; // Per our naming convention for pageName, this would normally be 'NotSet' but I think the value of having pageName being identical to pageType will save us grief in the future.
  let pageType = 'notSet';

  if (isPoliticianSEOFriendlyURL(pathOrURL)) {
    // We need this more complex logic here because there are many paths in /src/App.jsx that use "/-/" in the path
    pageName = 'PoliticianDetailsPage';
    pageType = 'politician';
  } else if (pathOrURL.startsWith('/ballot')) {
    pageName = 'Ballot';
    pageType = 'ballot';
  } else if (pathOrURL.startsWith('/candidate/')) {
    pageName = 'Candidate';
    pageType = 'candidate';
  } else if (pathOrURL.startsWith('/measure/')) {
    pageName = 'Measure';
    pageType = 'measure';
  } else if (pathOrURL.startsWith('/voterguide/')) {
    pageName = 'OrganizationVoterGuide';
    pageType = 'organizationVoterGuide';
  } else if (pathOrURL.endsWith('/cs/')) {
    pageName = 'CampaignsHomeLoader';
    pageType = 'candidate';
  } else if (isChallengeSEOFriendlyURL(pathOrURL)) {
    // We need to add more complex logic here because there are many paths in /src/App.jsx that use "/+/" in the path
    if (pathOrURL.endsWith('join-challenge')) {
      pageName = 'ChallengeInviteFriendsJoin';
    } else if (pathOrURL.endsWith('customize-message')) {
      pageName = 'ChallengeInviteCustomizeMessage';
    } else if (pathOrURL.endsWith('invite-friends')) {
      pageName = 'ChallengeInviteFriends';
    } else if (pathOrURL.endsWith('edit')) {
      pageName = 'ChallengeStartEditAll';
    } else {
      pageName = 'ChallengeHomePage';
    }
    pageType = 'challenge';
  } else if (pathOrURL.startsWith('/friends')) {
    pageName = 'Friends';
    pageType = 'friends';
  } else if (pathOrURL.startsWith('/news')) {
    pageName = 'News';
    pageType = 'news';
  } else if (pathOrURL.startsWith('/value/')) {
    pageName = 'IssuePage';
    pageType = 'issue';
  } else if (/^\/[^/\s]+$/.test(pathOrURL)) {
    pageName = 'TwitterHandleLanding';
    pageType = 'endorser';  // Changed from 'twitterHandleLanding' to 'endorser'
  } else if (pathOrURL.endsWith('/more/credits')) {
    pageName = 'CreditsAndThanks';
    pageType = 'about';
  }

  if (pathOrURL.startsWith('https://') || pathOrURL.startsWith('http://')) {
    if (pathOrURL.startsWith('https://apps.apple.com')) {
      pageName = 'AppStore';
      pageType = 'appStore';
    } else if (pathOrURL.startsWith('https://www.bing.com/search')) {
      pageName = 'BingSearch';
      pageType = 'searchEngine';
    } else if (pathOrURL.startsWith('https://blog.wevote.us')) {
      pageName = 'WeVoteBlog';
      pageType = 'blog';
    } else if (pathOrURL.startsWith('https://eepurl.com')) {
      pageName = 'NewsletterSignup';
      pageType = 'newsletter';
    } else if (pathOrURL.startsWith('https://facebook.com') || pathOrURL.startsWith('https://www.facebook.com')) {
      pageName = 'FacebookProfile';
      pageType = 'socialMedia';
    } else if (pathOrURL.startsWith('https://github.com')) {
      pageName = 'GitHubProfile';
      pageType = 'socialMedia';
    } else if (pathOrURL.startsWith('https://play.google.com')) {
      pageName = 'GooglePlayStore';
      pageType = 'appStore';
    } else if (pathOrURL.startsWith('https://google.com/search') || pathOrURL.startsWith('https://www.google.com/search')) {
      pageName = 'GoogleSearch';
      pageType = 'searchEngine';
    } else if (pathOrURL.startsWith('https://help.wevote.us')) { // FAQ/Help site
      pageName = 'WeVoteHelp';
      pageType = 'help';
    } else if (pathOrURL.startsWith('https://instagram.com') || pathOrURL.startsWith('https://www.instagram.com')) {
      pageName = 'Instagram';
      pageType = 'socialMedia';
    } else if (pathOrURL.includes('projects.propublica.org/nonprofits/organizations')) {
      pageName = 'Propublica';
      pageType = 'donation';
    } else if (pathOrURL.startsWith('https://tiktok.com') || pathOrURL.startsWith('https://www.tiktok.com')) {
      pageName = 'TikTokProfile';
      pageType = 'socialMedia';
    } else if (pathOrURL.startsWith('https://wevote.applytojob.com')) {
      pageName = 'WeVoteCareers';
      pageType = 'careers';
    } else if (pathOrURL.startsWith('https://www.wikipedia.org')) {
      pageName = 'Wikipedia';
      pageType = 'encyclopedia';
    } else if (pathOrURL.startsWith('https://x.com') || pathOrURL.startsWith('https://www.x.com') || pathOrURL.startsWith('https://twitter.com') || pathOrURL.startsWith('https://www.twitter.com')) { // Includes old Twitter domains
      pageName = 'XTwitter'; // Corrected name for X/Twitter
      pageType = 'socialMedia';
    } else if (pathOrURL.startsWith('https://www.youtube.com')) {
      pageName = 'YouTube';
      pageType = 'videoPlatform';
    }
  }

  return {
    pageName,
    pageType,
  };
}

export default function lookupPageNameAndPageTypeDictForExternalUrls (path) {
  if (pageNameAndTypeSimpleDictForExternalUrls[path]) {
    return pageNameAndTypeSimpleDictForExternalUrls[path];
  } else {
    return calculatePageNameAndPageTypeDictForExternalUrls(path);
  }
}
