import { FormControl, TextField } from '@mui/material';
import styled from 'styled-components';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ChallengeStartActions from '../../actions/ChallengeStartActions';
import { renderLog } from '../../utils/logging';
import ChallengeStartStore from '../../stores/ChallengeStartStore';
import ChallengeStore from '../../stores/ChallengeStore';

class ChallengeInviteTextDefaultInputField extends Component {
  constructor (props) {
    super(props);
    this.state = {
      challengeInviteTextDefault: '',
    };

    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.updateChallengeInviteTextDefault = this.updateChallengeInviteTextDefault.bind(this);
  }

  componentDidMount () {
    // console.log('ChallengeInviteTextDefaultInputField, componentDidMount');
    this.challengeStartStoreListener = ChallengeStartStore.addListener(this.onChallengeStartStoreChange.bind(this));
    this.challengeStoreListener = ChallengeStore.addListener(this.onChallengeStartStoreChange.bind(this));
    this.onChallengeStartStoreChange();
  }

  componentDidUpdate (prevProps) {
    // console.log('ChallengeInviteTextDefaultInputField componentDidUpdate');
    const {
      challengeWeVoteId: challengeWeVoteIdPrevious,
    } = prevProps;
    const {
      challengeWeVoteId,
    } = this.props;
    if (challengeWeVoteId) {
      if (challengeWeVoteId !== challengeWeVoteIdPrevious) {
        this.onChallengeStartStoreChange();
      }
    }
  }

  componentWillUnmount () {
    this.challengeStartStoreListener.remove();
    this.challengeStoreListener.remove();
  }

  handleKeyPress () {
    //
  }

  onChallengeStartStoreChange () {
    const { challengeWeVoteId, editExistingChallenge } = this.props;
    let challengeInviteTextDefault = '';
    if (editExistingChallenge) {
      const challenge = ChallengeStore.getChallengeByWeVoteId(challengeWeVoteId);
      if (challenge && challenge.challenge_we_vote_id) {
        challengeInviteTextDefault = challenge.challenge_invite_text_default;
      }
    } else {
      challengeInviteTextDefault = ChallengeStartStore.getChallengeInviteTextDefault();
    }
    const challengeInviteTextDefaultQueuedToSave = ChallengeStartStore.getChallengeInviteTextDefaultQueuedToSave();
    const challengeInviteTextDefaultQueuedToSaveSet = ChallengeStartStore.getChallengeInviteTextDefaultQueuedToSaveSet();
    let challengeInviteTextDefaultAdjusted = challengeInviteTextDefault;
    if (challengeInviteTextDefaultQueuedToSaveSet) {
      challengeInviteTextDefaultAdjusted = challengeInviteTextDefaultQueuedToSave;
    }
    // console.log('onChallengeStartStoreChange challengeInviteTextDefault: ', challengeInviteTextDefault, ', challengeInviteTextDefaultQueuedToSave: ', challengeInviteTextDefaultQueuedToSave, ', challengeInviteTextDefaultAdjusted:', challengeInviteTextDefaultAdjusted);
    this.setState({
      challengeInviteTextDefault: challengeInviteTextDefaultAdjusted,
    });
  }

  updateChallengeInviteTextDefault (event) {
    if (event.target.name === 'challengeInviteTextDefault') {
      ChallengeStartActions.challengeInviteTextDefaultQueuedToSave(event.target.value);
      this.setState({
        challengeInviteTextDefault: event.target.value,
      });
    }
  }

  render () {
    renderLog('ChallengeInviteTextDefaultInputField');  // Set LOG_RENDER_EVENTS to log all renders

    const { classes, externalUniqueId } = this.props;
    const { challengeInviteTextDefault } = this.state;

    return (
      <div className="">
        <form onSubmit={(e) => { e.preventDefault(); }}>
          <Wrapper>
            <ColumnFullWidth>
              <FormControl classes={{ root: classes.formControl }}>
                <TextField
                  // classes={{ root: classes.textField }} // Not working yet
                  id={`challengeInviteTextDefaultTextArea-${externalUniqueId}`}
                  label="Text participants will send to friends"
                  name="challengeInviteTextDefault"
                  margin="dense"
                  multiline
                  rows={8}
                  variant="outlined"
                  placeholder="Text participants will send to friends"
                  value={challengeInviteTextDefault}
                  onKeyDown={this.handleKeyPress}
                  onChange={this.updateChallengeInviteTextDefault}
                />
              </FormControl>
            </ColumnFullWidth>
          </Wrapper>
        </form>
      </div>
    );
  }
}
ChallengeInviteTextDefaultInputField.propTypes = {
  challengeWeVoteId: PropTypes.string,
  classes: PropTypes.object,
  editExistingChallenge: PropTypes.bool,
  externalUniqueId: PropTypes.string,
};

const styles = () => ({
  formControl: {
    width: '100%',
  },
  // TODO: Figure out how to apply to TextField
  textField: {
    fontSize: '22px',
  },
});

const ColumnFullWidth = styled('div')`
  padding: 8px 12px;
  width: 100%;
`;

const Wrapper = styled('div')`
  display: flex;
  justify-content: space-between;
  margin-left: -12px;
  width: calc(100% + 24px);
`;

export default withStyles(styles)(ChallengeInviteTextDefaultInputField);
