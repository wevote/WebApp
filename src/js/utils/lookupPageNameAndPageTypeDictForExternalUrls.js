// lookupPageNameAndPageTypeDictForExternalUrls.js

// If there is a static path for a page, enter it here. If the path includes dynamic elements,
//  you'll need to generate the pageName and pageType dynamically in calculatePageNameAndPageTypeDict below.
// TODO Update to with hard-coded External URLs we use
const pageNameAndTypeSimpleDictForExternalUrls = {
  'https://google.com': {
    pageName: 'GoogleSearch',
    pageType: 'search',
  },
};

// TODO Update to recognize social sites, and other regular places we send people
function calculatePageNameAndPageTypeDictForExternalUrls (path) {
  let pageName = 'notSet'; // Per our naming convention for pageName, this would normally be 'NotSet' but I think the value of having pageName being identical to settingsPageType will save us grief in the future.
  let pageType = 'notSet';

  if (path.startsWith('https://tiktok.com') || path.startsWith('https://www.tiktok.com')) {
    pageName = 'TikTokProfile';
    pageType = 'socialMedia';
  } else if (path.startsWith('https://twitter.com') || path.startsWith('https://x.com')) {
    pageName = 'TwitterProfile';
    pageType = 'socialMedia';
  } else if (path.startsWith('https://www.facebook.com') || path.startsWith('https://facebook.com')) {
    pageName = 'FacebookProfile';
    pageType = 'socialMedia';
  } else if (path.startsWith('https://www.instagram.com') || path.startsWith('https://instagram.com')) {
    pageName = 'InstagramProfile';
    pageType = 'socialMedia';
  } else if (path.startsWith('https://github.com')) {
    pageName = 'GitHubProfile';
    pageType = 'socialMedia';
  } else if (path.startsWith('https://blog.wevote.us')) {
    pageName = 'WeVoteBlog';
    pageType = 'blog';
  } else if (path.startsWith('https://eepurl.com')) {
    pageName = 'NewsletterSignup';
    pageType = 'newsletter';
  } else if (path.startsWith('https://help.wevote.us')) { // FAQ/Help site
    pageName = 'WeVoteHelp';
    pageType = 'help';
  } else if (path.startsWith('https://wevote.applytojob.com')) {
    pageName = 'WeVoteCareers';
    pageType = 'careers';
  } else if (path.startsWith('https://apps.apple.com')) {
    pageName = 'AppStore';
    pageType = 'appStore';
  } else if (path.startsWith('https://play.google.com')) {
    pageName = 'GooglePlayStore';
    pageType = 'appStore';
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
