import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import VoterActions from '../../actions/VoterActions';
import VoterStore from '../../stores/VoterStore';
import { restoreStylesAfterCordovaKeyboard } from '../../common/utils/cordovaUtils';
import { isWebApp } from '../../common/utils/isCordovaOrWebApp';
import { renderLog } from '../../common/utils/logging';
import TextBox from './TextBox';

class AddressBoxWelcome extends PureComponent {
  constructor (props) {
    super(props);
    this.state = {
      textForMapSearch: '',
    };
  }

  componentDidMount () {
    this.setState({
      textForMapSearch: VoterStore.getTextForMapSearch(),
    });
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    const { google } = window;
    if (google !== undefined) {
      const addressAutocomplete = new google.maps.places.Autocomplete(this.autoComplete);
      addressAutocomplete.setComponentRestrictions({ country: 'us' });
      this.googleAutocompleteListener = addressAutocomplete.addListener('place_changed', this._placeChanged.bind(this, addressAutocomplete));
    } else if (isWebApp()) {
      console.log('AddressBoxWelcome ERROR: Google Maps API IS NOT LOADED');
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
    if (this.googleAutocompleteListener !== undefined) { // Temporary fix until google maps key is fixed for Cordova
      this.googleAutocompleteListener.remove();
    }
    restoreStylesAfterCordovaKeyboard('AddressBoxWelcome');  // Set LOG_RENDER_EVENTS to log all renders
    if (this.keyPressTimer) clearTimeout(this.keyPressTimer);
  }

  onVoterStoreChange = () => {
    // console.log('AddressBoxWelcome, onVoterStoreChange voter: ', VoterStore.getVoter());
    this.setState({
      textForMapSearch: VoterStore.getTextForMapSearch(),
    });
  };

  _placeChanged = (addressAutocomplete) => {
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
  };

  updateVoterAddress = (event) => {
    console.log('UPDATE VOTER ADDRESS', event.target.value);
    this.setState({ textForMapSearch: event.target.value });
  };

  handleKeyPress = (event) => {
    // Wait for 1/2 of a second after the last keypress to make a call to the voterAddressSave API
    const ENTER_KEY_CODE = 13;
    if (event.keyCode === ENTER_KEY_CODE) {
      event.preventDefault();
      const { textForMapSearch } = this.state;
      if (this.keyPressTimer) clearTimeout(this.keyPressTimer);
      this.keyPressTimer = setTimeout(() => {
        VoterActions.voterAddressSave(textForMapSearch);
      }, 500);
    }
  };

  saveAddressToApiServer = () => {
    const { textForMapSearch } = this.state;
    VoterActions.voterAddressSave(textForMapSearch);
  };

  render () {
    renderLog('AddressBoxWelcome');  // Set LOG_RENDER_EVENTS to log all renders
    const { textForMapSearch } = this.state;
    return (
      <TextBox
        value={textForMapSearch}
        inputRef={(autocomplete) => { this.autoComplete = autocomplete; }}
        inputProps={{
          ...this.props.inputProps,
          onBlur: this.saveAddressToApiServer,
          onChange: this.updateVoterAddress,
          onKeyDown: this.handleKeyPress,
        }}
        icon={this.props.icon}
      />
      );
  }
}
AddressBoxWelcome.propTypes = {
  inputProps: PropTypes.object,
};

export default AddressBoxWelcome;
