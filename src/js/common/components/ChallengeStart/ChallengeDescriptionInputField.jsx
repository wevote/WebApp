import { FormControl, TextField } from '@mui/material';
import styled from 'styled-components';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ChallengeStartActions from '../../actions/ChallengeStartActions';
import { renderLog } from '../../utils/logging';
import ChallengeStartStore from '../../stores/ChallengeStartStore';
import ChallengeStore from '../../stores/ChallengeStore';

class ChallengeDescriptionInputField extends Component {
  constructor (props) {
    super(props);
    this.state = {
      challengeDescription: '',
    };

    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.updateChallengeDescription = this.updateChallengeDescription.bind(this);
  }

  componentDidMount () {
    // console.log('ChallengeDescriptionInputField, componentDidMount');
    this.challengeStartStoreListener = ChallengeStartStore.addListener(this.onChallengeStartStoreChange.bind(this));
    this.challengeStoreListener = ChallengeStore.addListener(this.onChallengeStartStoreChange.bind(this));
    this.onChallengeStartStoreChange();
  }

  componentDidUpdate (prevProps) {
    // console.log('ChallengeDescriptionInputField componentDidUpdate');
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
    let challengeDescription = '';
    if (editExistingChallenge) {
      const challenge = ChallengeStore.getChallengeByWeVoteId(challengeWeVoteId);
      if (challenge && challenge.challenge_we_vote_id) {
        challengeDescription = challenge.challenge_description;
      }
    } else {
      challengeDescription = ChallengeStartStore.getChallengeDescription();
    }
    const challengeDescriptionQueuedToSave = ChallengeStartStore.getChallengeDescriptionQueuedToSave();
    const challengeDescriptionQueuedToSaveSet = ChallengeStartStore.getChallengeDescriptionQueuedToSaveSet();
    let challengeDescriptionAdjusted = challengeDescription;
    if (challengeDescriptionQueuedToSaveSet) {
      challengeDescriptionAdjusted = challengeDescriptionQueuedToSave;
    }
    // console.log('onChallengeStartStoreChange challengeDescription: ', challengeDescription, ', challengeDescriptionQueuedToSave: ', challengeDescriptionQueuedToSave, ', challengeDescriptionAdjusted:', challengeDescriptionAdjusted);
    this.setState({
      challengeDescription: challengeDescriptionAdjusted,
    });
  }

  updateChallengeDescription (event) {
    if (event.target.name === 'challengeDescription') {
      ChallengeStartActions.challengeDescriptionQueuedToSave(event.target.value);
      this.setState({
        challengeDescription: event.target.value,
      });
    }
  }

  render () {
    renderLog('ChallengeDescriptionInputField');  // Set LOG_RENDER_EVENTS to log all renders

    const { classes, externalUniqueId } = this.props;
    const { challengeDescription } = this.state;

    return (
      <div className="">
        <form onSubmit={(e) => { e.preventDefault(); }}>
          <Wrapper>
            <ColumnFullWidth>
              <FormControl classes={{ root: classes.formControl }}>
                <TextField
                  // classes={{ root: classes.textField }} // Not working yet
                  id={`challengeDescriptionTextArea-${externalUniqueId}`}
                  label="Challenge description"
                  name="challengeDescription"
                  margin="dense"
                  multiline
                  rows={8}
                  variant="outlined"
                  placeholder="Challenge description"
                  value={challengeDescription}
                  onKeyDown={this.handleKeyPress}
                  onChange={this.updateChallengeDescription}
                />
              </FormControl>
            </ColumnFullWidth>
          </Wrapper>
        </form>
      </div>
    );
  }
}
ChallengeDescriptionInputField.propTypes = {
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

export default withStyles(styles)(ChallengeDescriptionInputField);
