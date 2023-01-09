import { FormControl, TextField } from '@mui/material';
import styled from 'styled-components';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import VoterActions from '../../../actions/VoterActions';
import { renderLog } from '../../utils/logging';
import VoterStore from '../../../stores/VoterStore';

class VoterLastNameInputField extends Component {
  constructor (props) {
    super(props);
    this.state = {
      voterLastName: '',
    };

    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.updateVoterLastNameQueuedToSave = this.updateVoterLastNameQueuedToSave.bind(this);
  }

  componentDidMount () {
    // console.log('VoterLastNameInputField, componentDidMount');
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    const voterLastName = VoterStore.getLastName();
    this.setState({
      voterLastName,
    });
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
  }

  handleKeyPress () {
    //
  }

  onVoterStoreChange () {
    const voterLastName = VoterStore.getLastName();
    const voterLastNameQueuedToSave = VoterStore.getVoterLastNameQueuedToSave();
    const voterLastNameQueuedToSaveSet = VoterStore.getVoterLastNameQueuedToSaveSet();
    let voterLastNameAdjusted = voterLastName;
    if (voterLastNameQueuedToSaveSet) {
      voterLastNameAdjusted = voterLastNameQueuedToSave;
    }
    // console.log('onVoterStoreChange voterLastName: ', voterLastName, ', voterLastNameQueuedToSave: ', voterLastNameQueuedToSave, ', voterLastNameAdjusted:', voterLastNameAdjusted);
    this.setState({
      voterLastName: voterLastNameAdjusted,
    });
  }

  updateVoterLastNameQueuedToSave (event) {
    if (event.target.name === 'voterLastName') {
      VoterActions.voterLastNameQueuedToSave(event.target.value);
      this.setState({
        voterLastName: event.target.value,
      });
    }
  }

  render () {
    renderLog('VoterLastNameInputField');  // Set LOG_RENDER_EVENTS to log all renders

    const { classes, externalUniqueId, showLabel, voterLastNameMissing, voterLastNamePlaceholder } = this.props;
    const { voterLastName } = this.state;
    return (
      <div className="">
        <form onSubmit={(e) => { e.preventDefault(); }}>
          <Wrapper>
            <ColumnFullWidth>
              <FormControl classes={{ root: classes.formControl }}>
                <TextField
                  // classes={{ root: classes.textField }} // Not working yet
                  error={voterLastNameMissing && !voterLastName}
                  id={`voterLastName-${externalUniqueId}`}
                  label={voterLastNameMissing && !voterLastName ? 'Last Name Required' : `${showLabel ? 'Last Name' : ''}`}
                  margin={voterLastNameMissing && !voterLastName ? 'dense' : 'none'}
                  name="voterLastName"
                  variant="outlined"
                  placeholder={voterLastNamePlaceholder || 'Last Name'}
                  value={voterLastName}
                  onKeyDown={this.handleKeyPress}
                  onChange={this.updateVoterLastNameQueuedToSave}
                />
              </FormControl>
            </ColumnFullWidth>
          </Wrapper>
        </form>
      </div>
    );
  }
}
VoterLastNameInputField.propTypes = {
  classes: PropTypes.object,
  externalUniqueId: PropTypes.string,
  showLabel: PropTypes.bool,
  voterLastNameMissing: PropTypes.bool,
  voterLastNamePlaceholder: PropTypes.string,
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

export default withStyles(styles)(VoterLastNameInputField);
