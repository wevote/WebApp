import { FormControl, TextField } from '@mui/material';
import styled from 'styled-components';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import VoterActions from '../../actions/VoterActions';
import { renderLog } from '../../common/utils/logging';
import VoterStore from '../../stores/VoterStore';

class VoterFirstNameInputField extends Component {
  constructor (props) {
    super(props);
    this.state = {
      voterFirstName: '',
    };

    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.updateVoterFirstNameQueuedToSave = this.updateVoterFirstNameQueuedToSave.bind(this);
  }

  componentDidMount () {
    // console.log('VoterFirstNameInputField, componentDidMount');
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    const voterFirstName = VoterStore.getFirstName();
    this.setState({
      voterFirstName,
    });
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
  }

  handleKeyPress () {
    //
  }

  onVoterStoreChange () {
    const voterFirstName = VoterStore.getFirstName();
    const voterFirstNameQueuedToSave = VoterStore.getVoterFirstNameQueuedToSave();
    const voterFirstNameQueuedToSaveSet = VoterStore.getVoterFirstNameQueuedToSaveSet();
    let voterFirstNameAdjusted = voterFirstName;
    if (voterFirstNameQueuedToSaveSet) {
      voterFirstNameAdjusted = voterFirstNameQueuedToSave;
    }
    // console.log('onVoterStoreChange voterFirstName: ', voterFirstName, ', voterFirstNameQueuedToSave: ', voterFirstNameQueuedToSave, ', voterFirstNameAdjusted:', voterFirstNameAdjusted);
    this.setState({
      voterFirstName: voterFirstNameAdjusted,
    });
  }

  updateVoterFirstNameQueuedToSave (event) {
    if (event.target.name === 'voterFirstName') {
      VoterActions.voterFirstNameQueuedToSave(event.target.value);
      this.setState({
        voterFirstName: event.target.value,
      });
    }
  }

  render () {
    renderLog('VoterFirstNameInputField');  // Set LOG_RENDER_EVENTS to log all renders

    const { classes, externalUniqueId, showLabel, voterFirstNameMissing, voterFirstNamePlaceholder } = this.props;
    const { voterFirstName } = this.state;
    return (
      <div className="">
        <form onSubmit={(e) => { e.preventDefault(); }}>
          <Wrapper>
            <ColumnFullWidth>
              <FormControl classes={{ root: classes.formControl }}>
                <TextField
                  // classes={{ root: classes.textField }} // Not working yet
                  error={voterFirstNameMissing && !voterFirstName}
                  id={`voterFirstName-${externalUniqueId}`}
                  label={voterFirstNameMissing && !voterFirstName ? 'First Name Required' : `${showLabel ? 'First Name' : ''}`}
                  margin={voterFirstNameMissing && !voterFirstName ? 'dense' : 'none'}
                  name="voterFirstName"
                  // margin="dense" // TODO remove margin top and bottom
                  variant="outlined"
                  placeholder={voterFirstNamePlaceholder || 'First Name'}
                  value={voterFirstName}
                  onKeyDown={this.handleKeyPress}
                  onChange={this.updateVoterFirstNameQueuedToSave}
                />
              </FormControl>
            </ColumnFullWidth>
          </Wrapper>
        </form>
      </div>
    );
  }
}
VoterFirstNameInputField.propTypes = {
  classes: PropTypes.object,
  externalUniqueId: PropTypes.string,
  showLabel: PropTypes.bool,
  voterFirstNameMissing: PropTypes.bool,
  voterFirstNamePlaceholder: PropTypes.string,
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

export default withStyles(styles)(VoterFirstNameInputField);
