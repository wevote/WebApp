import BallotStore from '../stores/BallotStore';
import { formatDateMMMDoYYYY } from '../common/utils/dateFormat';
import daysUntil from '../common/utils/daysUntil';

export default function createMessageToFriendDefaults (messageToFriendType) {
  // console.log('createMessageToFriendDefaults, originalString: ', originalString, 'item.ballot_item_display_name:', item.ballot_item_display_name);
  let messageToFriendDefault = '';
  let messageToFriendDefaultAsk = '';
  let messageToFriendDefaultInviteFriend = '';
  let messageToFriendDefaultRemind = '';
  // const electionDayText = ElectionStore.getElectionDayText(VoterStore.electionId());
  const electionDayText = BallotStore.currentBallotElectionDate;
  const electionDateFormatted = formatDateMMMDoYYYY(electionDayText);
  let electionDateInFutureFormatted = '';
  // let electionDateIsToday = false;
  if (electionDayText !== undefined && electionDateFormatted) {
    const daysUntilElection = daysUntil(electionDayText);
    if (daysUntilElection === 0) {
      electionDateInFutureFormatted = electionDateFormatted;
      // electionDateIsToday = true;
    } else if (daysUntilElection > 0) {
      electionDateInFutureFormatted = electionDateFormatted;
    }
  }
  let electionDateFound = false;
  if (electionDayText !== undefined && electionDateInFutureFormatted) {
    const daysUntilElection = daysUntil(electionDayText);
    if (daysUntilElection === 0) {
      messageToFriendDefaultAsk += "I'm getting ready to vote today.";
      messageToFriendDefaultInviteFriend += "I'm getting ready to vote today.";
      messageToFriendDefaultRemind += 'I hope you join me and vote today.';
      electionDateFound = true;
    } else if (daysUntilElection > 0) {
      messageToFriendDefaultAsk += `I'm getting ready for the election on ${electionDateInFutureFormatted}.`;
      messageToFriendDefaultInviteFriend += `I'm getting ready for the election on ${electionDateInFutureFormatted}.`;
      messageToFriendDefaultRemind += `I'm planning to vote by ${electionDateInFutureFormatted}. I hope you join me!`;
      electionDateFound = true;
    }
  }
  if (!electionDateFound) {
    messageToFriendDefaultAsk += "I'm getting ready to vote.";
    messageToFriendDefaultInviteFriend += "I'm getting ready to vote.";
  }
  messageToFriendDefaultAsk += ' Would you like to join me in deciding how to vote?';
  messageToFriendDefaultInviteFriend += ' Would you like to join me in deciding how to vote?';
  if (messageToFriendType === 'askFriend') {
    messageToFriendDefault = messageToFriendDefaultAsk;
  } else if (messageToFriendType === 'remindContacts') {
    messageToFriendDefault = messageToFriendDefaultRemind;
  } else { // inviteFriend and shareWithFriend
    messageToFriendDefault = messageToFriendDefaultInviteFriend;
  }
  // Note: shareWithFriend and shareWithFriendAllOpinions is generated in ShareWithFriendsModalTitleWithController
  return {
    messageToFriendDefault,
    messageToFriendDefaultAsk,
    messageToFriendDefaultRemind,
    messageToFriendDefaultInviteFriend,
  };
}
