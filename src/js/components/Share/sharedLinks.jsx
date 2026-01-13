import AppObservableStore from '../../common/stores/AppObservableStore';
import ShareStore from '../../common/stores/ShareStore';
import { cordovaLinkToBeSharedFixes } from '../../common/utils/cordovaUtils';
import stringContains from '../../common/utils/stringContains';
import { getWhatAndHowMuchToShareDefault } from './getWhatAndHowMuchToShareDefault';


// eslint-disable-next-line import/prefer-default-export
export function generateShareLinks () {
  const currentFullUrlAdjusted = cordovaLinkToBeSharedFixes(window.location.href || '');
  const currentFullUrlToShare = currentFullUrlAdjusted.replace('/modal/share', ''); // .toLowerCase(); // toLowerCase messes with shared link codes
  const urlWithSharedItemCode = ShareStore.getUrlWithSharedItemCodeByFullUrl(currentFullUrlToShare, false);
  const urlWithSharedItemCodeAllOpinions = ShareStore.getUrlWithSharedItemCodeByFullUrl(currentFullUrlToShare, true);
  // console.log('generateShareLinks urlWithSharedItemCode:', urlWithSharedItemCode);

  let linkToBeShared = '';
  let linkToBeSharedUrlEncoded = '';
  let whatAndHowMuchToShare = AppObservableStore.getWhatAndHowMuchToShare();
  // console.log('generateShareLinks BEFORE whatAndHowMuchToShare:', whatAndHowMuchToShare);
  if (whatAndHowMuchToShare === '') {
    const whatAndHowMuchToShareDefault = getWhatAndHowMuchToShareDefault();
    AppObservableStore.setWhatAndHowMuchToShare(whatAndHowMuchToShareDefault);
    whatAndHowMuchToShare = whatAndHowMuchToShareDefault;
  }
  // console.log('generateShareLinks AFTER whatAndHowMuchToShare:', whatAndHowMuchToShare);
  if (stringContains('AllOpinions', whatAndHowMuchToShare)) {
    if (urlWithSharedItemCodeAllOpinions) {
      linkToBeShared = urlWithSharedItemCodeAllOpinions;
    } else {
      linkToBeShared = currentFullUrlToShare;
    }
  } else if (urlWithSharedItemCode) {
    linkToBeShared = urlWithSharedItemCode;
  } else {
    linkToBeShared = currentFullUrlToShare;
  }
  linkToBeShared = cordovaLinkToBeSharedFixes(linkToBeShared);
  linkToBeSharedUrlEncoded = encodeURI(linkToBeShared);
  return {
    currentFullUrlToShare,
    linkToBeShared,
    linkToBeSharedUrlEncoded,
    urlWithSharedItemCode,
    urlWithSharedItemCodeAllOpinions,
  };
}
