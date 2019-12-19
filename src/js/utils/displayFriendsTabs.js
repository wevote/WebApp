import { stringContains } from './textFormat';

export default function displayFriendsTabs () {
  if (window.innerWidth < 769 && stringContains('/friends', window.location.pathname)) {
    return true;
  }

  return false;
}
