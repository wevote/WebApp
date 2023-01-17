import { cordovaOpenSafariView } from '../../utils/cordovaUtils';
import { openSnackbar } from '../Widgets/SnackNotifier';

export function androidFacebookClickHandler (linkToBeShared, quoteForSharingEncoded) {
  // react-share in Cordova for Android, navigates to the URL instead of opening a "tab" with a return 'X' button
  // https://m.facebook.com/sharer/sharer.php?u=https%253A%252F%252Fwevote.us%252F-0i8mao%26t%3DWeVote&quote=This+is+a+website+I+am+using+to+get+ready+to+vote.
  const fbURL = `https://m.facebook.com/sharer/sharer.php?u=${linkToBeShared}&quote=${quoteForSharingEncoded}`;
  console.log(`androidFacebookClickHandler clicked ~~~~~~~~~~~~~~~~ url : ${fbURL}`);
  cordovaOpenSafariView(fbURL, null, 50);
}

export function androidTwitterClickHandler (linkToBeShared, quoteForSharingEncoded) {
  // react-share in Cordova for Android, navigates to the URL instead of opening a "tab" with a return 'X' button
  // https://twitter.com/share?url=https%3A%2F%2Fwevote.us%2F-0i8mao&text=This%20is%20a%20website%20I%20am%20using%20to%20get%20ready%20to%20vote.
  const twitURL = `https://twitter.com/share?url=${linkToBeShared}&text=${quoteForSharingEncoded}`;
  console.log(`androidTwitterClickHandler clicked ~~~~~~~~~~~~~~~~ url : ${twitURL}`);
  cordovaOpenSafariView(twitURL, null, 50);
}

export function generateSharingLink (campaignX, campaignXNewsItemWeVoteId = '') {
  const { host } = window.location;
  const domainAddress = `https://${host}`;
  // console.log('domainAddress:', domainAddress);
  if (!campaignX) {
    return domainAddress;
  }
  const {
    seo_friendly_path: campaignSEOFriendlyPath,
    campaignx_we_vote_id: campaignXWeVoteId,
  } = campaignX;
  let urlToShare;
  if (campaignSEOFriendlyPath) {
    urlToShare = `${domainAddress}/c/${campaignSEOFriendlyPath}`;
    if (campaignXNewsItemWeVoteId) {
      urlToShare += `/u/${campaignXNewsItemWeVoteId}`;
    }
  } else {
    urlToShare = `${domainAddress}/id/${campaignXWeVoteId}`;
    if (campaignXNewsItemWeVoteId) {
      urlToShare += `/u/${campaignXNewsItemWeVoteId}`;
    }
  }
  return urlToShare;
}

export function generateQuoteForSharing (campaignTitle, numberOfPoliticians, politicianListSentenceString, linkToBeShared = '') {
  let quoteForSharing = 'Please join me in voting';
  if (numberOfPoliticians === 1) {
    quoteForSharing += ' for the candidate';
    quoteForSharing += politicianListSentenceString;
  } else if (numberOfPoliticians) {
    quoteForSharing += ' for the candidates';
    quoteForSharing += politicianListSentenceString;
  } else {
    quoteForSharing += ` for ${campaignTitle}`;
  }
  quoteForSharing += '. Sign the campaign! ';
  if (linkToBeShared) {
    quoteForSharing += ` ${linkToBeShared}`;
  }
  return quoteForSharing;
}

let close;
function onEmailSendSuccess () {
  console.log('successfully shared via email');
  close();
  openSnackbar({ message: 'You have successfully shared via email.' });
}

function onEmailSendError (error) {
  console.log('share by email failed', error);
  close();
  if (error === 'not available') {
    openSnackbar({ message: 'Your device is not configured to send email' });
  } else {
    openSnackbar({ message: `Unable to send an email (${error})` });
  }
}

export function cordovaSocialSharingByEmail (subject, messageBody, handleClose = null) {
  close = handleClose;
  console.log('cordovaSocialSharingByEmail ', subject, messageBody);
  // window.plugins.socialsharing.canShareViaEmail((e) => {console.log("canShareViaEmail 1: " + e)}, (e) => {console.log("canShareViaEmail 2: " + e)});
  // const { plugins: { socialsharing: { shareViaEmail } } } = window;
  const soc = window.plugins.socialsharing;
  soc.shareViaEmail(
    messageBody,               // can contain HTML tags, but support on Android is rather limited:  http://stackoverflow.com/questions/15136480/how-to-send-html-content-with-image-through-android-default-email-client
    subject,
    null,               // TO: must be null or an array
    null,               // CC: must be null or an array
    null,               // BCC: must be null or an array
    null,               // FILES: can be null, a string, or an array
    onEmailSendSuccess, // called when sharing worked, but also when the user cancelled sharing via email. On iOS, the callbacks' boolean result parameter is true when sharing worked, false if cancelled. On Android, this parameter is always true so it can't be used). See section "Notes about the successCallback" below.
    onEmailSendError,   // called when sh*t hits the fan
  );
}
