import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { EditLocation } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import { Paper, InputBase, Button } from '@material-ui/core';
import BallotStore from '../stores/BallotStore';
import BallotActions from '../actions/BallotActions';
import { historyPush, isCordova, prepareForCordovaKeyboard, restoreStylesAfterCordovaKeyboard } from '../utils/cordovaUtils';
import LoadingWheel from './LoadingWheel';
import { renderLog } from '../utils/logging';
import VoterActions from '../actions/VoterActions';
import VoterStore from '../stores/VoterStore';
import cookies from '../utils/cookies';

class AddressBox extends Component {
  static propTypes = {
    showCancelEditAddressButton: PropTypes.bool,
    disableAutoFocus: PropTypes.bool,
    manualFocus: PropTypes.bool,
    toggleEditingAddress: PropTypes.func,
    toggleSelectAddressModal: PropTypes.func,
    saveUrl: PropTypes.string.isRequired,
    waitingMessage: PropTypes.string,
    classes: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.state = {
      loading: false,
      textForMapSearch: '',
      ballotCaveat: '',
      voterSavedAddress: false,
    };

    // this.autocomplete = React.createRef();

    this.updateVoterAddress = this.updateVoterAddress.bind(this);
    this.voterAddressSave = this.voterAddressSave.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  componentWillMount () {
    prepareForCordovaKeyboard('AddressBox');
  }

  componentDidMount () {
    this.setState({
      textForMapSearch: VoterStore.getTextForMapSearch(),
      ballotCaveat: BallotStore.getBallotCaveat(),
    });
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    this.ballotStoreListener = BallotStore.addListener(this.onBallotStoreChange.bind(this));
    const { google } = window;
    if (google !== undefined) {
      const addressAutocomplete = new google.maps.places.Autocomplete(this.autoComplete);
      addressAutocomplete.setComponentRestrictions({ country: 'us' });
      this.googleAutocompleteListener = addressAutocomplete.addListener('place_changed', this._placeChanged.bind(this, addressAutocomplete));
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    if (this.state.loading !== nextState.loading) {
      return true;
    }
    if (this.state.voterSavedAddress !== nextState.voterSavedAddress) {
      return true;
    }
    if (this.state.textForMapSearch !== nextState.textForMapSearch) {
      return true;
    }
    if (this.state.ballotCaveat !== nextState.ballotCaveat) {
      return true;
    }
    return false;
  }

  componentDidUpdate () {
    // If we're in the slide with this component, autofocus the address box, otherwise defocus.
    if (this.props.manualFocus !== undefined) {
      const addressBox = this.autoComplete;
      if (addressBox) {
        if (this.props.manualFocus) {
          addressBox.focus();
        } else {
          addressBox.blur();
        }
      }
    }
    if (this.googleAutocompleteListener === undefined) {
      const { google } = window;
      if (google !== undefined) {
        const addressAutocomplete = new google.maps.places.Autocomplete(this.autoComplete);
        addressAutocomplete.setComponentRestrictions({ country: 'us' });
        this.googleAutocompleteListener = addressAutocomplete.addListener('place_changed', this._placeChanged.bind(this, addressAutocomplete));
      }
    }
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
    this.ballotStoreListener.remove();
    if (this.googleAutocompleteListener !== undefined) { // Temporary fix until google maps key is fixed.
      this.googleAutocompleteListener.remove();
    } else {
      console.log('Google Maps Error: DeletedApiProjectMapError');
    }
    restoreStylesAfterCordovaKeyboard('AddressBox');
  }

  // See https://reactjs.org/docs/error-boundaries.html
  static getDerivedStateFromError (error) { // eslint-disable-line no-unused-vars
    // Update state so the next render will show the fallback UI, We should have a "Oh snap" page
    return { hasError: true };
  }

  onVoterStoreChange () {
    // console.log('AddressBox, onVoterStoreChange, this.state:', this.state);
    const { textForMapSearch, voterSavedAddress } = this.state;

    if (textForMapSearch && voterSavedAddress) {
      this.incomingToggleSelectAddressModal();
      historyPush(this.props.saveUrl);
    } else {
      this.setState({
        loading: false,
        textForMapSearch: VoterStore.getTextForMapSearch(),
        voterSavedAddress,
      });
    }
  }

  onBallotStoreChange () {
    // console.log('AddressBox, onBallotStoreChange, this.state:', this.state);
    this.setState({
      ballotCaveat: BallotStore.getBallotCaveat(),
    });
  }

  incomingToggleSelectAddressModal = () => {
    if (this.props.toggleSelectAddressModal) {
      this.props.toggleSelectAddressModal();
    }
  }

  _placeChanged (addressAutocomplete) {
    const place = addressAutocomplete.getPlace();
    if (place.formatted_address) {
      this.setState({
        textForMapSearch: place.formatted_address,
      });
    } else {
      this.setState({
        textForMapSearch: place.name,
      });
    }
  }

  handleKeyPress (event) {
    // console.log('AddressBox, handleKeyPress, event: ', event);
    const enterAndSpaceKeyCodes = [13]; // We actually don't want to use the space character to save, 32
    if (enterAndSpaceKeyCodes.includes(event.keyCode)) {
      event.preventDefault();
      this.voterAddressSave(event);
    }
  }

  updateVoterAddress (event) {
    this.setState({ textForMapSearch: event.target.value });
  }

  voterAddressSave (event) {
    // console.log('AddressBox, voterAddressSave');
    event.preventDefault();
    VoterActions.voterAddressSave(this.state.textForMapSearch);
    BallotActions.completionLevelFilterTypeSave('filterAllBallotItems');
    const oneMonthExpires = 86400 * 31;
    cookies.setItem('location_guess_closed', '1', oneMonthExpires, '/');
    this.setState({
      loading: true,
      voterSavedAddress: true,
    });
  }

  componentDidCatch (error, info) {
    // We should get this information to Splunk!
    console.error('AddressBox caught error: ', `${error} with info: `, info);
  }

  render () {
    renderLog('AddressBox');  // Set LOG_RENDER_EVENTS to log all renders
    let { waitingMessage } = this.props;
    const { classes } = this.props;
    if (this.state.loading) {
      if (!waitingMessage) waitingMessage = 'Please wait a moment while we find your ballot...';

      return (
        <div>
          <h2>{waitingMessage}</h2>
          {LoadingWheel}
        </div>
      );
    }

    return (
      <div className="container">
        <form onSubmit={this.voterAddressSave} className="row">
          <Paper className={classes.root} elevation={2}>
            <EditLocation className="ion-input-icon" />
            <InputBase
              className={classes.input}
              name="address"
              aria-label="Address"
              placeholder="Enter registered address..."
              value={this.state.textForMapSearch}
              inputRef={(autocomplete) => { this.autoComplete = autocomplete; }}
              inputProps={{ onChange: this.updateVoterAddress, onKeyDown: this.handleKeyPress, autoFocus: (!isCordova() && !this.props.disableAutoFocus) }}
              id="addressBoxText"
            />
          </Paper>
          { this.props.showCancelEditAddressButton ? (
            <Button
              color="primary"
              id="addressBoxModalCancelButton"
              onClick={this.props.toggleEditingAddress}
              classes={{ root: classes.cancelButton }}
            >
              Cancel
            </Button>
          ) : null
          }
          <br />
          <Button
            color="primary"
            id="addressBoxModalSaveButton"
            onClick={this.voterAddressSave}
            variant="contained"
            classes={this.props.showCancelEditAddressButton ? { root: classes.saveButton } : { root: classes.fullWidthSaveButton }}
            fullWidth={!this.props.showCancelEditAddressButton}
          >
            Save
          </Button>
        </form>
        <p />
        <h4>{this.state.ballotCaveat}</h4>
      </div>
    );
  }
}

const styles = {
  root: {
    padding: '2px .7rem',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    marginBottom: '1rem',
    // marginRight: '1rem',
  },
  saveButton: {
    // marginRight: '.3rem',
    height: 'fit-content',
    width: 'calc(50% - 8px)',
    left: 16,
  },
  fullWidthSaveButton: {
    // marginRight: '.3rem',
    height: 'fit-content',
    margin: 0,
  },
  cancelButton: {
    // marginRight: '.3rem',
    width: 'calc(50% - 8px)',
  },
  input: {
    marginLeft: 8,
    flex: 1,
  },
};

export default withStyles(styles)(AddressBox);
