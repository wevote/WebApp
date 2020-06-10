import { isIOS } from './cordovaUtils';


// eslint-disable-next-line import/prefer-default-export
export function voterPhoto (voter) {
  const placeholderImageUrl = 'https://quality.wevote.us/img/global/logos/Apple-01.svg';
  if (!voter) {
    return placeholderImageUrl;
  }
  const { voter_photo_url_medium: voterPhotoUrlMedium, signedInWithApple } = voter;
  if (!voterPhotoUrlMedium && signedInWithApple  && isIOS()) {
    return placeholderImageUrl;
  }
  return voterPhotoUrlMedium;
}
