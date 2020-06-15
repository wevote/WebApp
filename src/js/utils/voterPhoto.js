import { isIOS } from './cordovaUtils';


// eslint-disable-next-line import/prefer-default-export
export function voterPhoto (voter) {
  const { voter_photo_url_medium: voterPhotoUrlMedium, signedInWithApple } = voter;
  if (!voterPhotoUrlMedium && signedInWithApple  && isIOS()) {
    return 'https://wevote.us/img/global/logos/Apple_logo_grey.svg';
  }
  return voterPhotoUrlMedium;
}
