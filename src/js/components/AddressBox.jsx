/* global google */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import EditLocationIcon from '@material-ui/icons/EditLocation';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import BallotStore from '../stores/BallotStore';
import BallotActions from '../actions/BallotActions';
import { historyPush, isCordova, prepareForCordovaKeyboard, restoreStylesAfterCordovaKeyboard } from '../utils/cordovaUtils';
import LoadingWheel from './LoadingWheel';
import { renderLog } from '../utils/logging';
import VoterActions from '../actions/VoterActions';
import VoterStore from '../stores/VoterStore';

// December 2018:  We want to work toward being airbnb style compliant, but for now these are disabled in this file to minimize massive changes
/* eslint react/sort-comp: 0 */
/* eslint class-methods-use-this: 0 */
/* eslint react/jsx-indent-props: 0 */
/* eslint jsx-a11y/no-static-element-interactions: 0 */
/* eslint jsx-a11y/no-noninteractive-element-to-interactive-role: 0 */
/* eslint jsx-a11y/click-events-have-key-events: 0 */
/* eslint jsx-a11y/anchor-is-valid: 0 */
/* eslint no-param-reassign: 0 */
class AddressBox extends Component {
  static propTypes = {
    cancelEditAddress: PropTypes.func,
    disableAutoFocus: PropTypes.bool,
    manualFocus: PropTypes.bool,
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
    prepareForCordovaKeyboard(__filename);
  }

  componentDidMount () {
    this.setState({
      textForMapSearch: VoterStore.getTextForMapSearch(),
      ballotCaveat: BallotStore.getBallotCaveat(),
    });
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    this.ballotStoreListener = BallotStore.addListener(this.onBallotStoreChange.bind(this));
    const addressAutocomplete = new google.maps.places.Autocomplete(this.autoComplete);
    addressAutocomplete.setComponentRestrictions({ country: 'us' });
    this.googleAutocompleteListener = addressAutocomplete.addListener('place_changed', this._placeChanged.bind(this, addressAutocomplete));
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
    this.ballotStoreListener.remove();
    if (this.googleAutocompleteListener !== undefined) { // Temporary fix until google maps key is fixed.
      this.googleAutocompleteListener.remove();
    } else {
      console.log('Google Maps Error: DeletedApiProjectMapError');
    }
    restoreStylesAfterCordovaKeyboard(__filename);
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
  }

  // See https://reactjs.org/docs/error-boundaries.html
  static getDerivedStateFromError (error) { // eslint-disable-line no-unused-vars
    // Update state so the next render will show the fallback UI, We should have a "Oh snap" page
    return { hasError: true };
  }

  componentDidCatch (error, info) {
    // We should get this information to Splunk!
    console.error('AddressBox caught error: ', `${error} with info: `, info);
  }

  onVoterStoreChange () {
    // console.log("AddressBox, onVoterStoreChange, this.state:", this.state);
    if (this.props.toggleSelectAddressModal) {
      this.props.toggleSelectAddressModal();
    }

    if (this.state.textForMapSearch && this.state.voterSavedAddress) {
      historyPush(this.props.saveUrl);
    } else {
      this.setState({
        textForMapSearch: VoterStore.getTextForMapSearch(),
        loading: false,
      });
    }
  }

  onBallotStoreChange () {
    // console.log("AddressBox, onBallotStoreChange, this.state:", this.state);
    this.setState({
      ballotCaveat: BallotStore.getBallotCaveat(),
    });
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

  updateVoterAddress (event) {
    this.setState({ textForMapSearch: event.target.value });
  }

  handleKeyPress (event) {
    // Wait for 1/2 of a second after the last keypress to make a call to the voterAddressSave API
    const ENTER_KEY_CODE = 13;
    if (event.keyCode === ENTER_KEY_CODE) {
      event.preventDefault();
      setTimeout(() => {
        VoterActions.voterAddressSave(this.state.textForMapSearch);
        this.setState({ loading: true });
      }, 500);
    }
  }

  voterAddressSave (event) {
    event.preventDefault();
    VoterActions.voterAddressSave(this.state.textForMapSearch);
    BallotActions.completionLevelFilterTypeSave('filterAllBallotItems');
    this.setState({ loading: true, voterSavedAddress: true });
  }

  render () {
    let { waitingMessage } = this.props;
    const { classes } = this.props;
    renderLog(__filename);
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
            <EditLocationIcon className="ion-input-icon" />
            <InputBase
              className={classes.input}
              name="address"
              aria-label="Address"
              placeholder="Enter registered address..."
              value={this.state.textForMapSearch}
              inputRef={(autocomplete) => { this.autoComplete = autocomplete; }}
              inputProps={{ onChange: this.updateVoterAddress, onKeyDown: this.handleKeyPress, autoFocus: (!isCordova() && !this.props.disableAutoFocus) }}
            />
          </Paper>
          { this.props.cancelEditAddress ? (
            <Button
              className={classes.cancelButton}
              color="primary"
              id="addressBoxModalCancelButton"
              onClick={this.props.cancelEditAddress}
            >
              Cancel
            </Button>
          ) : null
          }
          <br />
          <Button
            className={classes.saveButton}
            color="primary"
            id="addressBoxModalSaveButton"
            onClick={this.voterAddressSave}
            variant="contained"
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
    marginRight: '1rem',
  },
  saveButton: {
    marginRight: '.3rem',
    height: 'fit-content',
  },
  cancelButton: {
    marginRight: '.3rem',
  },
  input: {
    marginLeft: 8,
    flex: 1,
  },
};

export default withStyles(styles)(AddressBox);
