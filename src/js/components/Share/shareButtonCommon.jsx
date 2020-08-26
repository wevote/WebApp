import { cordovaOpenSafariView } from '../../utils/cordovaUtils';

export function androidFacebookClickHandler (linkToBeShared) {
  // react-share in Cordova for Android, navigates to the URL instead of opening a "tab" with a return 'X' button
  // https://m.facebook.com/sharer/sharer.php?u=https%253A%252F%252Fwevote.us%252F-0i8mao%26t%3DWeVote&quote=This+is+a+website+I+am+using+to+get+ready+to+vote.
  const fbURL = `https://m.facebook.com/sharer/sharer.php?u=${linkToBeShared}&quote=This+is+a+website+I+am+using+to+get+ready+to+vote.`;
  console.log(`androidFacebookClickHandler clicked ~~~~~~~~~~~~~~~~ url : ${fbURL}`);
  cordovaOpenSafariView(fbURL, null, 50);
}

export function androidTwitterClickHandler (linkToBeShared) {
  // react-share in Cordova for Android, navigates to the URL instead of opening a "tab" with a return 'X' button
  // https://twitter.com/share?url=https%3A%2F%2Fwevote.us%2F-0i8mao&text=This%20is%20a%20website%20I%20am%20using%20to%20get%20ready%20to%20vote.
  const twitURL = `https://twitter.com/share?url=${linkToBeShared}&text=This%20is%20a%20website%20I%20am%20using%20to%20get%20ready%20to%20vote.`;
  console.log(`androidTwitterClickHandler clicked ~~~~~~~~~~~~~~~~ url : ${twitURL}`);
  cordovaOpenSafariView(twitURL, null, 50);
}
