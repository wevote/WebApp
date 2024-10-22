import { Button, FormControl, TextField } from '@mui/material';
import styled from 'styled-components';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Suspense } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { renderLog } from '../../utils/logging';
import stringContains from '../../utils/stringContains';
import ChallengeInviteeActions from '../../actions/ChallengeInviteeActions';
import ChallengeInviteeStore from '../../stores/ChallengeInviteeStore';
import ChallengeParticipantActions from '../../actions/ChallengeParticipantActions';
import ChallengeParticipantStore from '../../stores/ChallengeParticipantStore';
import ChallengeStore from '../../stores/ChallengeStore';
import VoterStore from '../../../stores/VoterStore';

const ChallengeParticipantFirstRetrieveController = React.lazy(() => import(/* webpackChunkName: 'ChallengeParticipantFirstRetrieveController' */ '../ChallengeParticipant/ChallengeParticipantFirstRetrieveController'));

const InviteFriendToChallengeInput = ({ classes, challengeWeVoteId, externalUniqueId }) => {
  renderLog('InviteFriendToChallengeInputBox');  // Set LOG_RENDER_EVENTS to log all renders
  const [challengeInviteTextDefault, setChallengeInviteTextDefault] = React.useState('');
  const [challengeTitle, setChallengeTitle] = React.useState('');
  const [destinationFullURL, setDestinationFullURL] = React.useState('');
  const [googleCivicElectionId, setGoogleCivicElectionId] = React.useState(0);
  const [inviteCopiedMessageOn, setInviteCopiedMessageOn] = React.useState(false);
  const [inviteeListLength, setInviteeListLength] = React.useState(0);
  const [inviteeName, setInviteeName] = React.useState('');
  const [inviterName, setInviterName] = React.useState('');
  const [inviteTextForFriends, setInviteTextForFriends] = React.useState('');
  const [inviteTextToSend, setInviteTextToSend] = React.useState('');
  // const [urlToSend, setUrlToSend] = React.useState('');

  function prepareInviteTextToSend () {
    let inviteeFirstName = '';
    if (inviteeName) {
      inviteeFirstName = stringContains(' ', inviteeName) ? inviteeName.split(' ')[0] : inviteeName;
    }
    let inviterFirstName = '';
    if (inviterName) {
      inviterFirstName = stringContains(' ', inviterName) ? inviterName.split(' ')[0] : inviterName;
    }
    // console.log('prepareInviteTextToSend, inviteeName:', inviteeName, ', inviteeFirstName:', inviteeFirstName, ', inviterName:', inviterName, ', inviterFirstName:', inviterFirstName);
    const inviteTextGreeting = inviteeFirstName ? `Hi ${inviteeFirstName}` : 'Hi';
    const inviteTextFrom = inviterFirstName ? `, this is ${inviterFirstName}. ` : ', ';
    const inviteTextToSendTemp1 = `${inviteTextGreeting}${inviteTextFrom}`;
    // console.log('prepareInviteTextToSend, inviteTextToSendTemp1:', inviteTextToSendTemp1);
    const inviteTextToSendTemp2 = inviteTextForFriends || challengeInviteTextDefault;
    const inviteeUrlCode = ChallengeInviteeStore.getNextInviteeUrlCode();
    const urlToSendTemp = `${ChallengeStore.getSiteUrl(challengeWeVoteId)}/-${inviteeUrlCode}`;
    const inviteTextToSendTemp3 = `${inviteTextToSendTemp1}${inviteTextToSendTemp2} ${urlToSendTemp}`;
    setInviteTextToSend(inviteTextToSendTemp3);
    const SEOFriendlyPath = ChallengeStore.getChallengeSEOFriendlyPathByWeVoteId(challengeWeVoteId);
    setDestinationFullURL(`${ChallengeStore.getSiteUrl(challengeWeVoteId)}/${SEOFriendlyPath}/+/`);
    // setUrlToSend(urlToSendTemp);
  }

  function resetForm () {
    setInviteeName('');
  }

  const handleShare = async () => {
    const inviteeUrlCode = ChallengeInviteeStore.getNextInviteeUrlCode();
    ChallengeInviteeActions.challengeInviteeSave(
      challengeWeVoteId,
      destinationFullURL,
      googleCivicElectionId,
      0,
      inviteeName, true,
      inviteTextToSend, true,
      inviteeUrlCode, true,
    );
    setInviteCopiedMessageOn(true);
    setTimeout(() => {
      console.log('handleShare setTimeout fired');
      setInviteCopiedMessageOn(false);
      resetForm();
    }, 2000);
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

  function setInviteeNameFromEvent (event) {
    if (event.target.name === 'inviteeNameTextField') {
      setInviteeName(event.target.value);
    }
  }

  React.useEffect(() => {
    const onChallengeInviteeStoreChange = () => {
      setInviterName(VoterStore.getFirstName());
      const inviteeList = ChallengeInviteeStore.getChallengeInviteeList(challengeWeVoteId);
      if (inviteeListLength < inviteeList.length) {
        // If inviteeList length changes, make call for refreshed ChallengeParticipant, so we can make sure we have the updated score/rank.
        ChallengeParticipantActions.challengeParticipantRetrieve(challengeWeVoteId);
      }
      setInviteeListLength(inviteeList.length);
      prepareInviteTextToSend();
    };

    const onChallengeParticipantStoreChange = () => {
      setInviteTextForFriends(ChallengeParticipantStore.getInviteTextForFriends(challengeWeVoteId));
      prepareInviteTextToSend();
    };

    const onChallengeStoreChange = () => {
      setChallengeInviteTextDefault(ChallengeStore.getChallengeInviteTextDefaultByWeVoteId(challengeWeVoteId));
      setChallengeTitle(ChallengeStore.getChallengeTitleByWeVoteId(challengeWeVoteId));
      prepareInviteTextToSend();
    };

    const onVoterStoreChange = () => {
      setGoogleCivicElectionId(VoterStore.electionId());
      setInviterName(VoterStore.getFirstName());
      prepareInviteTextToSend();
    };

    // console.log('Fetching participants for:', challengeWeVoteId);
    const challengeInviteeStoreListener = ChallengeInviteeStore.addListener(onChallengeInviteeStoreChange);
    onChallengeParticipantStoreChange();
    const challengeParticipantStoreListener = ChallengeParticipantStore.addListener(onChallengeParticipantStoreChange);
    onChallengeParticipantStoreChange();
    const challengeStoreListener = ChallengeStore.addListener(onChallengeStoreChange);
    onChallengeStoreChange();
    const voterStoreListener = VoterStore.addListener(onVoterStoreChange);
    onVoterStoreChange();

    return () => {
      challengeInviteeStoreListener.remove();
      challengeParticipantStoreListener.remove();
      challengeStoreListener.remove();
      voterStoreListener.remove();
    };
  }, [challengeWeVoteId]);

  React.useEffect(() => {
    prepareInviteTextToSend();
  }, [inviteeName]);

  return (
    <InviteFriendToChallengeInputWrapper>
      <form onSubmit={(e) => { e.preventDefault(); }}>
        <Wrapper>
          <ColumnFullWidth>
            <FormControl classes={{ root: classes.formControl }}>
              <TextField
                // classes={{ root: classes.textField }} // Not working yet
                id={`campaignTitleTextArea-${externalUniqueId}`}
                name="inviteeNameTextField"
                margin="dense"
                value={inviteeName}
                variant="outlined"
                placeholder="Your friend's name (or a friend group name)"
                onChange={setInviteeNameFromEvent} // eslint-disable-line react/jsx-no-bind
              />
            </FormControl>
          </ColumnFullWidth>
        </Wrapper>
      </form>
      <InviteFriendButtonOuterWrapper>
        <InviteFriendButtonInnerWrapper>
          {/* onCopy={this.copyLink} */}
          <CopyToClipboard text={inviteTextToSend}>
            <Button
              classes={{ root: classes.buttonDesktop }}
              color="primary"
              id="inviteToChallengeNow"
              onClick={() => handleShare()}
              variant="contained"
            >
              {inviteCopiedMessageOn ? (
                <span>
                  Invite copied!
                </span>
              ) : (
                <>
                  {(inviteeName && inviteeName.length > 1) ? (
                    <span>
                      Invite
                      {' '}
                      {`${inviteeName ? `${inviteeName.length > 18 ? `${inviteeName.slice(0, 18)}...` : inviteeName}` : 'friend'}`}
                      {' '}
                      {inviteeName.length < 12 && 'to challenge'}
                    </span>
                  ) : (
                    <span>Copy message &amp; link to challenge</span>
                  )}
                </>
              )}
            </Button>
          </CopyToClipboard>
        </InviteFriendButtonInnerWrapper>
      </InviteFriendButtonOuterWrapper>
      <Suspense fallback={<span>&nbsp;</span>}>
        <ChallengeParticipantFirstRetrieveController
          challengeWeVoteId={challengeWeVoteId}
        />
      </Suspense>
    </InviteFriendToChallengeInputWrapper>
  );
};
InviteFriendToChallengeInput.propTypes = {
  challengeWeVoteId: PropTypes.string,
  classes: PropTypes.object,
  externalUniqueId: PropTypes.string,
};

const styles = () => ({
  buttonDesktop: {
    borderRadius: 45,
    boxShadow: '0 4px 6px rgb(50 50 93 / 11%)',
    fontSize: '18px',
    height: '45px !important',
    minWidth: '350px',
    padding: '0 12px',
    textTransform: 'none',
    width: '100%',
  },
  formControl: {
    width: '100%',
  },
  // TODO: Figure out how to apply to TextField
  textField: {
    fontSize: '22px',
  },
});

const InviteFriendButtonInnerWrapper = styled('div')`
  // background-color: #fff;
  margin-top: 8px;
`;

const InviteFriendButtonOuterWrapper = styled('div')`
  display: flex;
  justify-content: center;
  width: 100%;
`;

const ColumnFullWidth = styled('div')`
  padding: 8px 12px;
  width: 100%;
`;

const InviteFriendToChallengeInputWrapper = styled('div')`
`;

const Wrapper = styled('div')`
  display: flex;
  justify-content: space-between;
  margin-left: -12px;
  width: calc(100% + 24px);
`;

export default withStyles(styles)(InviteFriendToChallengeInput);
