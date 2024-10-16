import { Button } from '@mui/material';
import styled from 'styled-components';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { renderLog } from '../../utils/logging';
import ChallengeInviteeStore from '../../stores/ChallengeInviteeStore';
import ChallengeParticipantStore from '../../stores/ChallengeParticipantStore';
import ChallengeStore from '../../stores/ChallengeStore';
import VoterStore from '../../../stores/VoterStore';
import DesignTokenColors from '../Style/DesignTokenColors';


const InviteAgainButton = ({ classes, challengeWeVoteId, challengeInviteeId }) => {
  renderLog('InviteAgainButtonBox');  // Set LOG_RENDER_EVENTS to log all renders
  const [challengeInviteTextDefault, setChallengeInviteTextDefault] = React.useState('');
  const [challengeTitle, setChallengeTitle] = React.useState('');
  const [inviteCopiedMessageOn, setInviteCopiedMessageOn] = React.useState(false);
  const [inviteeName, setInviteeName] = React.useState('');
  const [inviterName, setInviterName] = React.useState('');
  const [inviteTextForFriends, setInviteTextForFriends] = React.useState('');
  const [inviteTextFromInviter, setInviteTextFromInviter] = React.useState('');
  const [inviteTextToSend, setInviteTextToSend] = React.useState('');
  const [inviteTextVarsChangedCount, setInviteTextVarsChangedCount] = React.useState(0);
  // const [urlToSend, setUrlToSend] = React.useState('');

  const handleShare = async () => {
    setInviteCopiedMessageOn(true);
    setTimeout(() => {
      // console.log('handleShare setTimeout fired');
      setInviteCopiedMessageOn(false);
    }, 1000);
    if (navigator.share) {
      try {
        await navigator.share({
          title: challengeTitle,
          text: inviteTextToSend,
          // url: urlToSend,
        });
        console.log('Content shared successfully!');
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      console.log('Web Share API is not supported on this browser.');
      // Fallback to a custom share modal or other sharing methods
    }
  };

  const onChallengeInviteeStoreChange = () => {
    const varsChangedNew = inviteTextVarsChangedCount + 1;
    setInviterName(VoterStore.getFirstName());
    const invitee = ChallengeInviteeStore.getChallengeInviteeById(challengeInviteeId);
    // console.log('InviteAgainButton onChallengeInviteeStoreChange invitee:', invitee);
    const inviteeNameTemp = invitee.invitee_voter_name || invitee.invitee_name;
    setInviteeName(inviteeNameTemp);
    setInviteTextFromInviter(invitee.invite_text_from_inviter);
    setInviteTextVarsChangedCount(varsChangedNew);
  };

  const onChallengeParticipantStoreChange = () => {
    const varsChangedNew = inviteTextVarsChangedCount + 1;
    setInviterName(VoterStore.getFirstName());
    // console.log('InviteAgainButton onChallengeParticipantStoreChange Participant TextForFriends:', ChallengeParticipantStore.getInviteTextForFriends(challengeWeVoteId));
    setInviteTextForFriends(ChallengeParticipantStore.getInviteTextForFriends(challengeWeVoteId));
    setInviteTextVarsChangedCount(varsChangedNew);
  };

  const onChallengeStoreChange = () => {
    const varsChangedNew = inviteTextVarsChangedCount + 1;
    setInviterName(VoterStore.getFirstName());
    // console.log('InviteAgainButton onChallengeStoreChange InviteTextDefault:', ChallengeStore.getChallengeInviteTextDefaultByWeVoteId(challengeWeVoteId));
    setChallengeInviteTextDefault(ChallengeStore.getChallengeInviteTextDefaultByWeVoteId(challengeWeVoteId));
    setChallengeTitle(ChallengeStore.getChallengeTitleByWeVoteId(challengeWeVoteId));
    setInviteTextVarsChangedCount(varsChangedNew);
  };

  React.useEffect(() => {
    // console.log('useEffect componentDidMount equivalent');
    const challengeInviteeStoreListener = ChallengeInviteeStore.addListener(onChallengeInviteeStoreChange);
    onChallengeInviteeStoreChange();
    const challengeParticipantStoreListener = ChallengeParticipantStore.addListener(onChallengeParticipantStoreChange);
    onChallengeParticipantStoreChange();
    const challengeStoreListener = ChallengeStore.addListener(onChallengeStoreChange);
    onChallengeStoreChange();

    return () => {
      // console.log('useEffect componentWillUnMount equivalent');
      challengeInviteeStoreListener.remove();
      challengeParticipantStoreListener.remove();
      challengeStoreListener.remove();
    };
  }, []);

  React.useEffect(() => {
    let inviteTextToSendAgain = inviteTextFromInviter;
    if (!inviteTextToSendAgain || inviteTextToSendAgain.trim() === '') {
      const inviteeFirstName = inviteeName ? inviteeName.split(' ')[0] : '';
      const inviterFirstName = inviterName ? inviterName.split(' ')[0] : '';
      // console.log('inviteeName: ', inviteeName, ', inviterName: ', inviterName);
      let inviteTextToSendTemp1 = inviteeFirstName ? `Hi ${inviteeFirstName}` : 'Hi';
      inviteTextToSendTemp1 += inviterFirstName ? `, this is ${inviterFirstName}. ` : ', ';
      let inviteTextToSendTemp2 = challengeInviteTextDefault;
      if (inviteTextForFriends && inviteTextForFriends.trim() !== '') {
        inviteTextToSendTemp2 = inviteTextForFriends;
      }
      if (inviteTextForFriends && inviteTextFromInviter.trim() !== '') {
        inviteTextToSendTemp2 = inviteTextFromInviter;
      }
      // console.log('challengeInviteTextDefault: ', challengeInviteTextDefault);
      const invitee = ChallengeInviteeStore.getChallengeInviteeById(challengeInviteeId);
      const inviteeUrlCode = invitee.invitee_url_code || '';
      const urlToSendTemp = `${ChallengeStore.getSiteUrl(challengeWeVoteId)}/-${inviteeUrlCode}`;
      inviteTextToSendAgain = `${inviteTextToSendTemp1}${inviteTextToSendTemp2} ${urlToSendTemp}`;
    }
    setInviteTextToSend(inviteTextToSendAgain);
  }, [inviteTextVarsChangedCount]);

  React.useEffect(() => {
  }, [challengeWeVoteId]);

  return (
    <InviteAgainButtonWrapper>
      {/* onCopy={this.copyLink} */}
      <CopyToClipboard text={inviteTextToSend}>
        <Button
          classes={{ root: classes.simpleLink }}
          color="primary"
          id="copyInviteeMessageAgain"
          onClick={() => handleShare()}
          variant="outlined"
        >
          {inviteCopiedMessageOn ? 'Invite copied!' : 'Copy invite again'}
        </Button>
      </CopyToClipboard>
    </InviteAgainButtonWrapper>
  );
};
InviteAgainButton.propTypes = {
  challengeWeVoteId: PropTypes.string,
  classes: PropTypes.object,
  challengeInviteeId: PropTypes.number,
};

const styles = () => ({
  simpleLink: {
    border: 0,
    boxShadow: 'none !important',
    color: `${DesignTokenColors.primary500}`,
    fontSize: 14,
    lineHeight: '1.2',
    marginRight: '-5px',
    padding: '0 20px',
    textTransform: 'none',
    '&:hover': {
      border: 0,
      color: `${DesignTokenColors.primary600}`,
      textDecoration: 'underline',
    },
  },
});

const InviteAgainButtonWrapper = styled('div')`
`;

export default withStyles(styles)(InviteAgainButton);
