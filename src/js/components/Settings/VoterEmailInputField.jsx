import { FormControl, TextField } from '@mui/material';
import styled from 'styled-components';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import VoterActions from '../../actions/VoterActions';
import { renderLog } from '../../common/utils/logging';
import VoterStore from '../../stores/VoterStore';

class VoterEmailInputField extends Component {
  constructor (props) {
    super(props);
    this.state = {
      voterEmail: '',
      voterEmailDisabled: false,
    };

    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.updateVoterEmailQueuedToSave = this.updateVoterEmailQueuedToSave.bind(this);
  }

  componentDidMount () {
    // console.log('VoterEmailInputField, componentDidMount');
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    const voterEmail = VoterStore.getVoterEmail();
    this.setState({
      voterEmail,
      voterEmailDisabled: Boolean(voterEmail),
    });
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
  }

  handleKeyPress () {
    //
  }

  onVoterStoreChange () {
    const voterEmail = VoterStore.getVoterEmail();
    const voterEmailQueuedToSave = VoterStore.getVoterEmailQueuedToSave();
    const voterEmailQueuedToSaveSet = VoterStore.getVoterEmailQueuedToSaveSet();
    let voterEmailAdjusted = voterEmail;
    if (voterEmailQueuedToSaveSet) {
      voterEmailAdjusted = voterEmailQueuedToSave;
    }
    // console.log('onVoterStoreChange voterEmail: ', voterEmail, ', voterEmailQueuedToSave: ', voterEmailQueuedToSave, ', voterEmailAdjusted:', voterEmailAdjusted);
    this.setState({
      voterEmail: voterEmailAdjusted,
    });
  }

  updateVoterEmailQueuedToSave (event) {
    if (event.target.name === 'voterEmail') {
      VoterActions.voterEmailQueuedToSave(event.target.value);
      this.setState({
        voterEmail: event.target.value,
      });
    }
  }

  render () {
    renderLog('VoterEmailInputField');  // Set LOG_RENDER_EVENTS to log all renders

    const { classes, externalUniqueId, showLabel, voterEmailMissing, voterEmailPlaceholder } = this.props;
    const { voterEmail, voterEmailDisabled } = this.state;
    return (
      <div className="">
        <form onSubmit={(e) => { e.preventDefault(); }}>
          <Wrapper>
            <ColumnFullWidth>
              <FormControl classes={{ root: classes.formControl }}>
                <TextField
                  // classes={{ root: classes.textField }} // Not working yet
                  disabled={voterEmailDisabled}
                  error={voterEmailMissing && !voterEmail}
                  id={`voterEmail-${externalUniqueId}`}
                  label={voterEmailMissing && !voterEmail ? 'Email Required' : `${showLabel ? 'Email' : ''}`}
                  margin={voterEmailMissing && !voterEmail ? 'dense' : 'none'}
                  name="voterEmail"
                  variant="outlined"
                  placeholder={voterEmailPlaceholder || 'Email'}
                  value={voterEmail}
                  onKeyDown={this.handleKeyPress}
                  onChange={this.updateVoterEmailQueuedToSave}
                />
              </FormControl>
            </ColumnFullWidth>
          </Wrapper>
        </form>
      </div>
    );
  }
}
VoterEmailInputField.propTypes = {
  classes: PropTypes.object,
  externalUniqueId: PropTypes.string,
  showLabel: PropTypes.bool,
  voterEmailMissing: PropTypes.bool,
  voterEmailPlaceholder: PropTypes.string,
};

const styles = () => ({
  formControl: {
    width: '100%',
  },
});

const ColumnFullWidth = styled('div')`
  width: 100%;
`;

const Wrapper = styled('div')`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

export default withStyles(styles)(VoterEmailInputField);
