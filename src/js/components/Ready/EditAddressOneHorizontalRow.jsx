import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { EditLocation } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import { Paper, InputBase, Button } from '@material-ui/core';
import BallotStore from '../../stores/BallotStore';
import { historyPush, isWebApp, restoreStylesAfterCordovaKeyboard } from '../../utils/cordovaUtils';
import { renderLog } from '../../utils/logging';
import VoterActions from '../../actions/VoterActions';
import VoterStore from '../../stores/VoterStore';
import cookies from '../../utils/cookies';

class EditAddressOneHorizontalRow extends Component {
  static propTypes = {
    saveUrl: PropTypes.string,
    classes: PropTypes.object,
  };

  constructor (props, context) {
    super(props, context);
    this.state = {
      textForMapSearch: '',
      voterSavedAddress: false,
    };
    this.updateVoterAddress = this.updateVoterAddress.bind(this);
    this.voterAddressSave = this.voterAddressSave.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }


  componentDidMount () {
    // console.log("In EditAddressOneHorizontalRow componentDidMount");
    this.setState({
      textForMapSearch: VoterStore.getTextForMapSearch(),
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

  componentDidUpdate () {
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
    if (this.googleAutocompleteListener !== undefined) { // Temporary fix until google maps key is fixed for Cordova
      this.googleAutocompleteListener.remove();
    } else if (isWebApp()) {
      console.log('ERROR: Google Maps API IS NOT LOADED');
    }
    restoreStylesAfterCordovaKeyboard('EditAddressOneHorizontalRow');
  }

  // See https://reactjs.org/docs/error-boundaries.html
  static getDerivedStateFromError (error) { // eslint-disable-line no-unused-vars
    // Update state so the next render will show the fallback UI, We should have a "Oh snap" page
    return { hasError: true };
  }

  onBallotStoreChange () {
    // console.log('EditAddressOneHorizontalRow, onBallotStoreChange, this.state:', this.state);
    const { saveUrl } = this.props;
    const { textForMapSearch, voterSavedAddress } = this.state;
    // console.log('onBallotStoreChange, state.voterSavedAddress:', voterSavedAddress, ', VoterStore.getTextForMapSearch():', VoterStore.getTextForMapSearch())
    const { pathname } = window.location;
    if (saveUrl && saveUrl !== '' && pathname !== saveUrl && textForMapSearch && voterSavedAddress) {
      historyPush(saveUrl);
    } else {
      this.setState({
        textForMapSearch: VoterStore.getTextForMapSearch(),
      });
    }
  }

  onVoterStoreChange () {
    // console.log('EditAddressOneHorizontalRow, onVoterStoreChange, this.state:', this.state);
    const { saveUrl } = this.props;
    const { textForMapSearch, voterSavedAddress } = this.state;
    const { pathname } = window.location;
    if (saveUrl && saveUrl !== '' && pathname !== saveUrl && textForMapSearch && voterSavedAddress) {
      historyPush(saveUrl);
    } else {
      this.setState({
        textForMapSearch: VoterStore.getTextForMapSearch(),
      });
    }
  }

  saveAddressToApiServer = () => {
    const { textForMapSearch } = this.state;
    // console.log('saveAddressToApiServer, textForMapSearch: ', textForMapSearch);
    VoterActions.voterAddressSave(textForMapSearch);
  };

  _placeChanged (addressAutocomplete) {
    const place = addressAutocomplete.getPlace();
    if (place.formatted_address) {
      // console.log('_placeChanged place.formatted_address:', place.formatted_address);
      VoterActions.voterAddressSave(place.formatted_address);
      this.setState({
        textForMapSearch: place.formatted_address,
      });
    } else {
      // console.log('_placeChanged place.name:', place.name);
      VoterActions.voterAddressSave(place.name);
      this.setState({
        textForMapSearch: place.name,
      });
    }

    this.saveAddressToApiServer();
  }

  handleKeyPress (event) {
    // console.log('EditAddressOneHorizontalRow, handleKeyPress, event: ', event, ', event.keyCode:', event.keyCode);
    // console.log('this.autoComplete:', this.autoComplete);
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
    const { textForMapSearch } = this.state;
    // console.log('EditAddressOneHorizontalRow, voterAddressSave, textForMapSearch:', textForMapSearch);
    event.preventDefault();
    VoterActions.voterAddressSave(textForMapSearch);
    const oneMonthExpires = 86400 * 31;
    cookies.setItem('location_guess_closed', '1', oneMonthExpires, '/');
    this.setState({
      voterSavedAddress: true,
    });
  }

  componentDidCatch (error, info) {
    // We should get this information to Splunk!
    console.error('EditAddressOneHorizontalRow caught error: ', `${error} with info: `, info);
  }

  render () {
    renderLog('EditAddressOneHorizontalRow');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes } = this.props;
    const { textForMapSearch, voterSavedAddress } = this.state;

    if (voterSavedAddress) {
      return <span />;
    }

    return (
      <OuterWrapper>
        <InnerWrapper className="u-show-mobile">
          <AddressLabelMobile>
            Enter full address for correct ballot
          </AddressLabelMobile>
        </InnerWrapper>
        <InnerWrapper>
          <AddressLabel>
            <span className="u-show-tablet">
              Enter full address for correct ballot
            </span>
            <span className="u-show-desktop">
              Enter your full address to see correct ballot
            </span>
          </AddressLabel>
          <form onSubmit={this.voterAddressSave}>
            <InternalFormWrapper>
              <Paper className={classes.paperInputForm} elevation={2}>
                <EditLocation className="ion-input-icon" />
                <InputBase
                  className={classes.inputBase}
                  name="address"
                  aria-label="Address"
                  placeholder="Full address and ZIP..."
                  value={textForMapSearch}
                  inputRef={(autocomplete) => { this.autoComplete = autocomplete; }}
                  inputProps={{
                    onBlur: this.saveAddressToApiServer,
                    onChange: this.updateVoterAddress,
                    onKeyDown: this.handleKeyPress,
                  }}
                  id="editAddressOneHorizontalRowTextForMapSearch"
                />
              </Paper>
              <Button
                classes={{ root: classes.saveButton }}
                color="primary"
                fullWidth
                id="editAddressOneHorizontalRowSaveButton"
                onClick={this.voterAddressSave}
                variant="contained"
              >
                {(textForMapSearch) ? (
                  <>
                    Update
                  </>
                ) : (
                  <>
                    Save
                  </>
                )}
              </Button>
            </InternalFormWrapper>
          </form>
        </InnerWrapper>
      </OuterWrapper>
    );
  }
}

const AddressLabel = styled.div`
  font-weight: 600;
  margin-right: 12px;
`;

const AddressLabelMobile = styled.div`
  font-weight: 600;
`;

const InternalFormWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const OuterWrapper = styled.div`
  margin-bottom: 8px !important;
  width: 100%;
`;

const InnerWrapper = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
`;

const styles = theme => ({
  paperInputForm: {
    padding: '2px .7rem',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  },
  saveButton: {
    height: 'fit-content',
    marginLeft: 8,
    width: 120,
  },
  inputBase: {
    flex: 1,
    [theme.breakpoints.up('sm')]: {
      width: 210,
    },
    [theme.breakpoints.up('md')]: {
      width: 250,
    },
  },
});

export default withStyles(styles)(EditAddressOneHorizontalRow);
