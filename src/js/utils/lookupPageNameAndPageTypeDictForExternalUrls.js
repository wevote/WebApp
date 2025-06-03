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
  // console.log("gtmPageNameAndType, path:", path);
  let pageName = 'notSet'; // Per our naming convention for pageName, this would normally be 'NotSet' but I think the value of having pageName being identical to settingsPageType will save us grief in the future.
  let pageType = 'notSet';

  if (path.startsWith('https://instagram.com')) {
    pageName = 'InstagramProfile';
    pageType = 'socialMedia';
  } else if (path.startsWith('https://x.com')) {
    pageName = 'InstagramProfile';
    pageType = 'socialMedia';
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
