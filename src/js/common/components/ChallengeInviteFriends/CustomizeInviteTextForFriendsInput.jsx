import { Button, FormControl, TextField } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Suspense } from 'react';
import styled from 'styled-components';
import { renderLog } from '../../utils/logging';
import ChallengeParticipantActions from '../../actions/ChallengeParticipantActions';
import ChallengeParticipantStore from '../../stores/ChallengeParticipantStore';
import ChallengeStore from '../../stores/ChallengeStore';
import { CampaignProcessStepIntroductionText } from '../Style/CampaignProcessStyles';

const ChallengeParticipantFirstRetrieveController = React.lazy(() => import(/* webpackChunkName: 'ChallengeParticipantFirstRetrieveController' */ '../ChallengeParticipant/ChallengeParticipantFirstRetrieveController'));

const CustomizeInviteTextForFriendsInput = ({ classes, challengeWeVoteId, externalUniqueId, goToNextStep }) => {
  renderLog('CustomizeInviteTextForFriendsInputBox');  // Set LOG_RENDER_EVENTS to log all renders
  const [inviteTextForFriends, setInviteTextForFriends] = React.useState('');
  const [inviteTextForFriendsOriginal, setInviteTextForFriendsOriginal] = React.useState('');
  const [challengeInviteTextDefault, setChallengeInviteTextDefault] = React.useState('');

  function setInviteTextForFriendsFromEvent (event) {
    if (event.target.name === 'inviteTextForFriends') {
      setInviteTextForFriends(event.target.value);
    }
  }

  React.useEffect(() => {
    const onChallengeParticipantStoreChange = () => {
      setInviteTextForFriendsOriginal(ChallengeParticipantStore.getInviteTextForFriends(challengeWeVoteId));
    };

    const onChallengeStoreChange = () => {
      setChallengeInviteTextDefault(ChallengeStore.getChallengeInviteTextDefaultByWeVoteId(challengeWeVoteId));
    };

    // console.log('Fetching participants for:', challengeWeVoteId);
    const challengeParticipantStoreListener = ChallengeParticipantStore.addListener(onChallengeParticipantStoreChange);
    onChallengeParticipantStoreChange();
    const challengeStoreListener = ChallengeStore.addListener(onChallengeStoreChange);
    onChallengeStoreChange();

    return () => {
      challengeParticipantStoreListener.remove();
      challengeStoreListener.remove();
    };
  }, [challengeWeVoteId]);

  function saveAndGoToNextStep () {
    let inviteTextForFriendsNormalized = inviteTextForFriends;
    if (inviteTextForFriends === '' || inviteTextForFriends === undefined) {
      inviteTextForFriendsNormalized = null;
    }
    let challengeInviteTextDefaultNormalized = challengeInviteTextDefault;
    if (challengeInviteTextDefault === '' || challengeInviteTextDefault === undefined) {
      challengeInviteTextDefaultNormalized = null;
    }
    let inviteTextForFriendsOriginalNormalized = inviteTextForFriendsOriginal;
    if (inviteTextForFriendsOriginal === '' || inviteTextForFriendsOriginal === undefined) {
      inviteTextForFriendsOriginalNormalized = null;
    }
    const inviteTextForFriendsSameAsDefault = inviteTextForFriendsNormalized === challengeInviteTextDefaultNormalized;
    const inviteTextForFriendsSameAsOriginal = inviteTextForFriendsNormalized === inviteTextForFriendsOriginalNormalized;
    // console.log('CustomizeInviteTextForFriendsInputBox, saveAndGoToNextStep, challengeInviteTextDefault:', challengeInviteTextDefault, ', inviteTextForFriendsOriginal: ', inviteTextForFriendsOriginalNormalized, ', inviteTextForFriends:', inviteTextForFriendsNormalized);
    if (inviteTextForFriendsSameAsDefault) {
      // No change from Challenge default, don't save
      // console.log('No change from Challenge default, don\'t save');
    } else if (inviteTextForFriendsSameAsOriginal) {
      // No change from prior voter-customized version, don't save
      // console.log('No change from prior voter-customized version, don\'t save');
    } else {
      const inviteTextForFriendsChanged = true;
      // console.log('Save inviteTextForFriends:', inviteTextForFriends);  // We don't use inviteTextForFriendsNormalized
      ChallengeParticipantActions.challengeParticipantSave(challengeWeVoteId, inviteTextForFriends, inviteTextForFriendsChanged);
    }
    goToNextStep();
  }

  return (
    <CustomizeInviteTextForFriendsInputWrapper>
      <form onSubmit={(e) => { e.preventDefault(); }}>
        <FormInnerWrapper>
          <ColumnFullWidth>
            <FormControl classes={{ root: classes.formControl }}>
              <TextField
                // classes={{ root: classes.textField }} // Not working yet
                id={`inviteTextForFriends-${externalUniqueId}`}
                name="inviteTextForFriends"
                margin="dense"
                multiline
                rows={8}
                value={inviteTextForFriends || inviteTextForFriendsOriginal || challengeInviteTextDefault}
                variant="outlined"
                placeholder="Text to send to friends"
                onChange={setInviteTextForFriendsFromEvent} // eslint-disable-line react/jsx-no-bind
              />
            </FormControl>
          </ColumnFullWidth>
        </FormInnerWrapper>
      </form>
      <CampaignProcessStepIntroductionText>
        [your friend&apos;s unique link]
      </CampaignProcessStepIntroductionText>
      <CustomizeTextButtonOuterWrapper>
        <CustomizeTextButtonInnerWrapper>
          <Button
            classes={{ root: classes.buttonDesktop }}
            color="primary"
            id="saveParticipantTextForFriendsNow"
            onClick={saveAndGoToNextStep}
            variant="contained"
          >
            Next
          </Button>
        </CustomizeTextButtonInnerWrapper>
      </CustomizeTextButtonOuterWrapper>
      <Suspense fallback={<span>&nbsp;</span>}>
        <ChallengeParticipantFirstRetrieveController challengeWeVoteId={challengeWeVoteId} />
      </Suspense>
    </CustomizeInviteTextForFriendsInputWrapper>
  );
};
CustomizeInviteTextForFriendsInput.propTypes = {
  challengeWeVoteId: PropTypes.string,
  classes: PropTypes.object,
  externalUniqueId: PropTypes.string,
  goToNextStep: PropTypes.func.isRequired,
};

const styles = () => ({
  buttonDesktop: {
    borderRadius: 45,
    boxShadow: '0 4px 6px rgb(50 50 93 / 11%)',
    fontSize: '18px',
    height: '45px !important',
    minWidth: '300px',
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

const CustomizeTextButtonInnerWrapper = styled('div')`
  // background-color: #fff;
  margin-top: 8px;
`;

const CustomizeTextButtonOuterWrapper = styled('div')`
  display: flex;
  justify-content: center;
  margin-top: 24px;
  width: 100%;
`;

const ColumnFullWidth = styled('div')`
  padding: 8px 12px;
  width: 100%;
`;

const CustomizeInviteTextForFriendsInputWrapper = styled('div')`
  width: 100%;
`;

const FormInnerWrapper = styled('div')`
  display: flex;
  justify-content: space-between;
  margin-left: -12px;
  width: calc(100% + 24px);
`;

export default withStyles(styles)(CustomizeInviteTextForFriendsInput);
