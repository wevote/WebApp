import { isWeVoteMarketingSite } from '../common/utils/hrefUtils';

export default function displayFriendsTabs () {
  return isWeVoteMarketingSite();   // Per Dale, Oct 12, 2023
  // if (isCordova() && stringContains('/friends', window.location.href)) {
  //   return true;
  // }
  //
  // if (window.innerWidth < 769 && stringContains('/friends', window.location.pathname)) {
  //   return true;
  // }
  //
  // return false;
}
