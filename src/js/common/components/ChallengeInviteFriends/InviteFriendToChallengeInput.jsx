import { Button, FormControl, TextField } from '@mui/material';
import styled from 'styled-components';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React from 'react';
import { renderLog } from '../../utils/logging';
import ChallengeInviteeActions from '../../actions/ChallengeInviteeActions';
import ChallengeInviteeStore from '../../stores/ChallengeInviteeStore';

const InviteFriendToChallengeInput = ({ classes, challengeWeVoteId, externalUniqueId }) => {
  renderLog('InviteFriendToChallengeInputBox');  // Set LOG_RENDER_EVENTS to log all renders
  const [friendName, setFriendName] = React.useState([]);

  function setFriendNameFromEvent (event) {
    if (event.target.name === 'friendNameTextField') {
      setFriendName(event.target.value);
    }
  }
  return (
    <InviteFriendToChallengeInputWrapper>
      <form onSubmit={(e) => { e.preventDefault(); }}>
        <Wrapper>
          <ColumnFullWidth>
            <FormControl classes={{ root: classes.formControl }}>
              <TextField
                // classes={{ root: classes.textField }} // Not working yet
                id={`campaignTitleTextArea-${externalUniqueId}`}
                name="friendNameTextField"
                margin="dense"
                variant="outlined"
                placeholder="Your friend's name"
                onChange={setFriendNameFromEvent} // eslint-disable-line react/jsx-no-bind
              />
            </FormControl>
          </ColumnFullWidth>
        </Wrapper>
      </form>
      <InviteFriendButtonOuterWrapper>
        <InviteFriendButtonInnerWrapper>
          <Button
            classes={{ root: classes.buttonDesktop }}
            color="primary"
            id="joinChallengeNow"
            onClick={() => ChallengeInviteeActions.challengeInviteeSave(challengeWeVoteId, friendName)}
            variant="contained"
          >
            Invite
            {' '}
            {`${friendName || 'friend'}`}
            {' '}
            to challenge
          </Button>
        </InviteFriendButtonInnerWrapper>
      </InviteFriendButtonOuterWrapper>
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
