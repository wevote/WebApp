import { Button, InputBase, Paper } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { EditLocation } from '@material-ui/icons';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import BallotActions from '../actions/BallotActions';
import VoterActions from '../actions/VoterActions';
import BallotStore from '../stores/BallotStore';
import VoterStore from '../stores/VoterStore';
import { historyPush, isCordova, isWebApp, prepareForCordovaKeyboard, restoreStylesAfterCordovaKeyboard } from '../utils/cordovaUtils';
import Cookies from '../common/utils/js-cookie/Cookies';
import { renderLog } from '../common/utils/logging';
import LoadingWheel from './LoadingWheel';

class AddressBox extends Component {
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
    this.voterAddressSaveLocal = this.voterAddressSaveLocal.bind(this);
    this.voterAddressSaveSubmit = this.voterAddressSaveSubmit.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  // eslint-disable-next-line camelcase,react/sort-comp
  UNSAFE_componentWillMount () {
    prepareForCordovaKeyboard('AddressBox');
  }

  componentDidMount () {
    this.setState({
      textForMapSearch: VoterStore.getTextForMapSearch(),
      ballotCaveat: BallotStore.getBallotCaveat(),
    });
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    this.ballotStoreListener = BallotStore.addListener(this.onBallotStoreChange.bind(this));
    const { google } = window;  // Cordova purposefully does not load the google maps API at this time
    if (google !== undefined) {
      const addressAutocomplete = new google.maps.places.Autocomplete(this.autoComplete);
      addressAutocomplete.setComponentRestrictions({ country: 'us' });
      this.googleAutocompleteListener = addressAutocomplete.addListener('place_changed', this._placeChanged.bind(this, addressAutocomplete));
    } else if (isWebApp()) {
      console.log('AddressBox ERROR: Google Maps API IS NOT LOADED');
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

  componentDidCatch (error, info) {
    // We should get this information to Splunk!
    console.error('!!!AddressBox caught error: ', `${error} with info: `, info);
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
    this.ballotStoreListener.remove();
    if (this.googleAutocompleteListener !== undefined) { // Temporary fix until google maps key is fixed for Cordova
      this.googleAutocompleteListener.remove();
    }
    restoreStylesAfterCordovaKeyboard('AddressBox');
  }

  // See https://reactjs.org/docs/error-boundaries.html
  static getDerivedStateFromError (error) { // eslint-disable-line no-unused-vars
    // Update state so the next render will show the fallback UI, We should have a "Oh snap" page
    console.log('!!!AddressBox error', error);
    return { hasError: true };
  }

  handleKeyPress (event) {
    // console.log('AddressBox, handleKeyPress, event: ', event);
    const enterAndSpaceKeyCodes = [13]; // We actually don't want to use the space character to save, 32
    if (enterAndSpaceKeyCodes.includes(event.keyCode)) {
      event.preventDefault();
      this.voterAddressSaveLocal(event);
    }
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

  // saveAddressFromOnBlur (event) {
  //   // console.log('saveAddressFromOnBlur CALLING-VoterActions.voterAddressSave event.target.value: ', event.target.value);
  //   VoterActions.voterAddressSave(event.target.value);
  // }

  updateVoterAddress (event) {
    this.setState({ textForMapSearch: event.target.value });
  }

  voterAddressSaveLocal (event) {
    // console.log('CALLING-VoterActions.voterAddressSave, event.target.value:', event.target.value);
    event.preventDefault();
    VoterActions.voterAddressSave(event.target.value);
    BallotActions.completionLevelFilterTypeSave('filterAllBallotItems');
    Cookies.set('location_guess_closed', '1', { expires: 31, path: '/' });
    this.setState({
      loading: true,
      textForMapSearch: event.target.value,
      voterSavedAddress: true,
    });
  }

  voterAddressSaveSubmit () {
    const { textForMapSearch } = this.state;
    VoterActions.voterAddressSave(textForMapSearch);
    BallotActions.completionLevelFilterTypeSave('filterAllBallotItems');
    Cookies.set('location_guess_closed', '1', { expires: 31, path: '/' });
    this.setState({
      loading: true,
      voterSavedAddress: true,
    });
    // New June 2021, once they save we want to go back to the original view with the map
    const { toggleEditingAddress } = this.props;
    toggleEditingAddress();
  }

  render () {
    renderLog('AddressBox');  // Set LOG_RENDER_EVENTS to log all renders
    // console.log('AddressBox render');
    let { waitingMessage } = this.props;
    const { classes, disableAutoFocus, externalUniqueId, showCancelEditAddressButton, toggleEditingAddress } = this.props;
    const { ballotCaveat, loading, textForMapSearch } = this.state;
    if (loading) {
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
        <form onSubmit={this.voterAddressSaveSubmit} className="row">
          <Paper className={classes.root} elevation={2}>
            <EditLocation className="ion-input-icon" />
            <InputBase
              className={classes.input}
              name="address"
              aria-label="Address"
              placeholder="Street number, full address and ZIP..."
              value={textForMapSearch}
              inputRef={(autocomplete) => { this.autoComplete = autocomplete; }}
              inputProps={{
                autoFocus: (!isCordova() && !disableAutoFocus),
                // onBlur: this.saveAddressFromOnBlur,
                onChange: this.updateVoterAddress,
                onKeyDown: this.handleKeyPress,
              }}
              id={externalUniqueId ? `addressBoxText-${externalUniqueId}` : 'addressBoxText'}
            />
          </Paper>
          {showCancelEditAddressButton ? (
            <Button
              color="primary"
              id={externalUniqueId ? `addressBoxModalCancelButton-${externalUniqueId}` : 'addressBoxModalCancelButton'}
              onClick={toggleEditingAddress}
              classes={{ root: classes.cancelButton }}
            >
              Cancel
            </Button>
          ) : null}
          <br />
          <Button
            color="primary"
            id={externalUniqueId ? `addressBoxModalSaveButton-${externalUniqueId}` : 'addressBoxModalSaveButton'}
            onClick={this.voterAddressSaveSubmit}
            variant="contained"
            classes={showCancelEditAddressButton ? { root: classes.saveButton } : { root: classes.fullWidthSaveButton }}
            fullWidth={!showCancelEditAddressButton}
          >
            Save
          </Button>
        </form>
        <p />
        <h4>{ballotCaveat}</h4>
      </div>
    );
  }
}
AddressBox.propTypes = {
  externalUniqueId: PropTypes.string,
  showCancelEditAddressButton: PropTypes.bool,
  disableAutoFocus: PropTypes.bool,
  manualFocus: PropTypes.bool,
  toggleEditingAddress: PropTypes.func,
  toggleSelectAddressModal: PropTypes.func,
  saveUrl: PropTypes.string.isRequired,
  waitingMessage: PropTypes.string,
  classes: PropTypes.object,
};

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
