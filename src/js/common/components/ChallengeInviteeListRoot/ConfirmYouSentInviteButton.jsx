import { Button } from '@mui/material';
import styled from 'styled-components';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React from 'react';
import { renderLog } from '../../utils/logging';
import ChallengeInviteeStore from '../../stores/ChallengeInviteeStore';
import ChallengeInviteeActions from '../../actions/ChallengeInviteeActions';


const ConfirmYouSentInviteButton = ({ classes, challengeWeVoteId, challengeInviteeId }) => {
  renderLog('ConfirmYouSentInviteButtonBox');  // Set LOG_RENDER_EVENTS to log all renders
  const [inviteSent, setInviteSent] = React.useState(false);
  const [inviteTextVarsChangedCount, setInviteTextVarsChangedCount] = React.useState(0);
  // const [urlToSend, setUrlToSend] = React.useState('');

  const handleConfirmYouSentInvite = async () => {
    // console.log('handleConfirmYouSentInvite challengeWeVoteId:', challengeWeVoteId, ', challengeInviteeId:', challengeInviteeId);
    ChallengeInviteeActions.challengeInviteeFlagsSave(challengeWeVoteId, challengeInviteeId, true, true);
    setInviteSent(true);
  };

  const onChallengeInviteeStoreChange = () => {
    const varsChangedNew = inviteTextVarsChangedCount + 1;
    const invitee = ChallengeInviteeStore.getChallengeInviteeById(challengeInviteeId);
    // console.log('ConfirmYouSentInviteButton onChallengeInviteeStoreChange invitee:', invitee);
    setInviteSent(invitee.invite_sent);
    setInviteTextVarsChangedCount(varsChangedNew);
  };

  React.useEffect(() => {
    // console.log('useEffect componentDidMount equivalent');
    const challengeInviteeStoreListener = ChallengeInviteeStore.addListener(onChallengeInviteeStoreChange);
    onChallengeInviteeStoreChange();

    return () => {
      // console.log('useEffect componentWillUnMount equivalent');
      challengeInviteeStoreListener.remove();
    };
  }, []);

  return (
    <ConfirmYouSentInviteButtonWrapper>
      {!inviteSent && (
        <Button
          classes={{ root: classes.buttonDesktop }}
          color="primary"
          id="confirmInviteSentButton"
          onClick={() => handleConfirmYouSentInvite()}
          variant="outlined"
        >
          Confirm you sent invite
        </Button>
      )}
    </ConfirmYouSentInviteButtonWrapper>
  );
};
ConfirmYouSentInviteButton.propTypes = {
  challengeWeVoteId: PropTypes.string,
  classes: PropTypes.object,
  challengeInviteeId: PropTypes.number,
};

const styles = () => ({
  buttonDesktop: {
    padding: '2px 10px',
    borderRadius: 20,
    fontSize: 14,
  },
});

const ConfirmYouSentInviteButtonWrapper = styled('div')`
`;

export default withStyles(styles)(ConfirmYouSentInviteButton);
