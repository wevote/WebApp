import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import EditLocationIcon from '@material-ui/icons/EditLocation';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import BallotStore from '../../stores/BallotStore';
import { historyPush, prepareForCordovaKeyboard, restoreStylesAfterCordovaKeyboard } from '../../utils/cordovaUtils';
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

  componentWillMount () {
    prepareForCordovaKeyboard('AddressBox');
  }

  componentDidMount () {
    // console.log("In EditAddressOneHorizontalRow componentDidMount");
    this.setState({
      locationGuessClosed: cookies.getItem('location_guess_closed'),
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

  onBallotStoreChange () {
    // console.log('EditAddressOneHorizontalRow, onBallotStoreChange, this.state:', this.state);
    const { saveUrl } = this.props;
    const { textForMapSearch, voterSavedAddress } = this.state;
    const { pathname } = window.location;
    if (saveUrl && saveUrl !== '' && pathname !== saveUrl && textForMapSearch && voterSavedAddress) {
      historyPush(saveUrl);
    } else {
      this.setState({
        locationGuessClosed: cookies.getItem('location_guess_closed'),
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
        locationGuessClosed: cookies.getItem('location_guess_closed'),
        textForMapSearch: VoterStore.getTextForMapSearch(),
      });
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
    // console.log('EditAddressOneHorizontalRow, handleKeyPress, event: ', event);
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
    // console.log('EditAddressOneHorizontalRow, voterAddressSave');
    const { textForMapSearch } = this.state;
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
    const { locationGuessClosed, textForMapSearch } = this.state;

    if (locationGuessClosed) {
      // Address has already been saved in the last 30 days
      return null;
    }

    return (
      <Wrapper>
        <AddressLabel className="u-show-desktop-tablet">
          <span className="u-show-tablet">
            Your correct location?
          </span>
          <span className="u-show-desktop">
            Do we have your location correct?
          </span>
        </AddressLabel>
        <form onSubmit={this.voterAddressSave}>
          <InternalFormWrapper>
            <Paper className={classes.paperInputForm} elevation={2}>
              <EditLocationIcon className="ion-input-icon" />
              <InputBase
                className={classes.inputBase}
                name="address"
                aria-label="Address"
                placeholder="Enter registered address..."
                value={textForMapSearch}
                inputRef={(autocomplete) => { this.autoComplete = autocomplete; }}
                inputProps={{
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
              Confirm
            </Button>
          </InternalFormWrapper>
        </form>
      </Wrapper>
    );
  }
}

const AddressLabel = styled.div`
  font-weight: 600;
  margin-right: 12px;
`;
const InternalFormWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const Wrapper = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  width: 100%;
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
