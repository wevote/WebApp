// For functions related to friends

export default function sortFriendListByMutualFriends (friendList) {
  // console.log('sortFriendListByMutualFriends, incoming friendList: ', friendList);
  if (friendList && friendList[0] && friendList[0].voter_date_last_changed) {
    // console.log('sorting friendList');
    const sortedFriendList = friendList;
    // suggestedFriendList.sort((optionA, optionB) => optionB.positions_taken - optionA.positions_taken);
    sortedFriendList.sort((optionA, optionB) => optionB.voter_date_last_changed - optionA.voter_date_last_changed);
    sortedFriendList.sort((optionA, optionB) => (optionB.voter_photo_url_medium ? 1 : 0) - (optionA.voter_photo_url_medium ? 1 : 0));
    sortedFriendList.sort((optionA, optionB) => optionB.mutual_friends - optionA.mutual_friends);
    return sortedFriendList;
  } else {
    // console.log('NOT sorting friendList');
    return friendList;
  }
}
