import { getWhatAndHowMuchToShareDefault } from './shareButtonCommon';
import AppObservableStore from '../../stores/AppObservableStore';
import ShareStore from '../../common/stores/ShareStore';
import { cordovaLinkToBeSharedFixes } from '../../common/utils/cordovaUtils';
import stringContains from '../../common/utils/stringContains';

export function generateShareLinks () {
  const currentFullUrlAdjusted = cordovaLinkToBeSharedFixes(window.location.href || '');
  const currentFullUrlToShare = currentFullUrlAdjusted.replace('/modal/share', '').toLowerCase();
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

export function returnShareModalText (whatAndHowMuchToShare) {
  let allOpinionsRadioButtonText;
  let noOpinionsRadioButtonText;
  let allOpinionsRadioButtonDescription = "I want to include all the choices I've have made, my name and my profile photo.";
  let noOpinionsRadioButtonDescription = "I don't want to include any choices I've made, my name, nor my profile photo.";
  let shareModalDescription;
  let shareModalTitle;
  if (whatAndHowMuchToShare.startsWith('ballotShareOptions')) {
    allOpinionsRadioButtonText = 'Ballot with my choices';
    noOpinionsRadioButtonText = 'Ballot only';
    shareModalDescription = 'Share with your friends a link to this list of ballot choices to help them make their own choices.';
    shareModalTitle = 'Share ballot';
  } else if (whatAndHowMuchToShare.startsWith('candidateShareOptions')) {
    allOpinionsRadioButtonDescription = '';
    allOpinionsRadioButtonText = '';
    noOpinionsRadioButtonDescription = '';
    noOpinionsRadioButtonText = '';
    shareModalTitle = 'Share candidate';
  } else if (whatAndHowMuchToShare.startsWith('measureShareOptions')) {
    allOpinionsRadioButtonText = '';
    noOpinionsRadioButtonText = '';
    shareModalTitle = 'Share measure';
  } else if (whatAndHowMuchToShare.startsWith('officeShareOptions')) {
    allOpinionsRadioButtonText = '';
    noOpinionsRadioButtonText = '';
    shareModalTitle = 'Share office';
  } else if (whatAndHowMuchToShare.startsWith('organizationShareOptions')) {
    allOpinionsRadioButtonText = '';
    noOpinionsRadioButtonText = '';
    shareModalTitle = 'Share this page';
  } else if (whatAndHowMuchToShare.startsWith('readyShareOptions')) {
    allOpinionsRadioButtonText = '';
    noOpinionsRadioButtonText = '';
    shareModalTitle = 'Share this page';
  } else {
    allOpinionsRadioButtonText = '';
    noOpinionsRadioButtonText = '';
    shareModalTitle = 'Share';
  }
  return {
    allOpinionsRadioButtonDescription,
    allOpinionsRadioButtonText,
    noOpinionsRadioButtonDescription,
    noOpinionsRadioButtonText,
    shareModalDescription,
    shareModalTitle,
  };
}
