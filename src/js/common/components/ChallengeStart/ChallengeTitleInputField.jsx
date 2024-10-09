import { FormControl, TextField } from '@mui/material';
import styled from 'styled-components';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ChallengeStartActions from '../../actions/ChallengeStartActions';
import { renderLog } from '../../utils/logging';
import ChallengeStartStore from '../../stores/ChallengeStartStore';
import ChallengeStore from '../../stores/ChallengeStore';

class ChallengeTitleInputField extends Component {
  constructor (props) {
    super(props);
    this.state = {
      challengeTitle: '',
    };

    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.updateChallengeTitle = this.updateChallengeTitle.bind(this);
  }

  componentDidMount () {
    // console.log('ChallengeTitleInputField, componentDidMount');
    this.challengeStartStoreListener = ChallengeStartStore.addListener(this.onChallengeStartStoreChange.bind(this));
    this.challengeStoreListener = ChallengeStore.addListener(this.onChallengeStartStoreChange.bind(this));
    this.onChallengeStartStoreChange();
  }

  componentDidUpdate (prevProps) {
    // console.log('ChallengeTitleInputField componentDidUpdate');
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
    // console.log('ChallengeTitleInputField challengeWeVoteId:', challengeWeVoteId);
    let challengeTitle = '';
    if (editExistingChallenge) {
      const challenge = ChallengeStore.getChallengeByWeVoteId(challengeWeVoteId);
      if (challenge && challenge.challenge_we_vote_id) {
        challengeTitle = challenge.challenge_title;
      }
    } else {
      challengeTitle = ChallengeStartStore.getChallengeTitle();
    }
    // console.log('ChallengeTitleInputField challengeTitle:', challengeTitle);
    const challengeTitleQueuedToSave = ChallengeStartStore.getChallengeTitleQueuedToSave();
    const challengeTitleQueuedToSaveSet = ChallengeStartStore.getChallengeTitleQueuedToSaveSet();
    let challengeTitleAdjusted = challengeTitle;
    if (challengeTitleQueuedToSaveSet) {
      challengeTitleAdjusted = challengeTitleQueuedToSave;
    }
    // console.log('onChallengeStartStoreChange challengeTitle: ', challengeTitle, ', challengeTitleQueuedToSave: ', challengeTitleQueuedToSave, ', challengeTitleAdjusted:', challengeTitleAdjusted);
    this.setState({
      challengeTitle: challengeTitleAdjusted,
    });
  }

  updateChallengeTitle (event) {
    if (event.target.name === 'challengeTitle') {
      ChallengeStartActions.challengeTitleQueuedToSave(event.target.value);
      this.setState({
        challengeTitle: event.target.value,
      });
    }
  }

  render () {
    renderLog('ChallengeTitleInputField');  // Set LOG_RENDER_EVENTS to log all renders

    const { challengeTitlePlaceholder, classes, externalUniqueId } = this.props;
    const { challengeTitle } = this.state;
    return (
      <div className="">
        <form onSubmit={(e) => { e.preventDefault(); }}>
          <Wrapper>
            <ColumnFullWidth>
              <FormControl classes={{ root: classes.formControl }}>
                <TextField
                  // classes={{ root: classes.textField }} // Not working yet
                  id={`challengeTitleTextArea-${externalUniqueId}`}
                  label={challengeTitlePlaceholder || 'Challenge name'}
                  name="challengeTitle"
                  margin="dense"
                  variant="outlined"
                  placeholder={challengeTitlePlaceholder || 'Challenge name'}
                  value={challengeTitle}
                  onKeyDown={this.handleKeyPress}
                  onChange={this.updateChallengeTitle}
                />
              </FormControl>
            </ColumnFullWidth>
          </Wrapper>
        </form>
      </div>
    );
  }
}
ChallengeTitleInputField.propTypes = {
  challengeTitlePlaceholder: PropTypes.string,
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

export default withStyles(styles)(ChallengeTitleInputField);
