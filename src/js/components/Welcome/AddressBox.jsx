/* global google */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import TextBox from './TextBox';
import VoterActions from '../../actions/VoterActions';
import VoterStore from '../../stores/VoterStore';
import { restoreStylesAfterCordovaKeyboard } from '../../utils/cordovaUtils';

class AddressBox extends PureComponent {
  static propTypes = {
    inputProps: PropTypes.object,
  }

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
    const addressAutocomplete = new google.maps.places.Autocomplete(this.autoComplete);
    addressAutocomplete.setComponentRestrictions({ country: 'us' });
    this.googleAutocompleteListener = addressAutocomplete.addListener('place_changed', this._placeChanged.bind(this, addressAutocomplete));
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
    if (this.googleAutocompleteListener !== undefined) { // Temporary fix until google maps key is fixed.
      this.googleAutocompleteListener.remove();
    } else {
      console.log('Google Maps Error: DeletedApiProjectMapError');
    }
    restoreStylesAfterCordovaKeyboard(__filename);
  }

  onVoterStoreChange = () => {
    this.setState({
      textForMapSearch: VoterStore.getTextForMapSearch(),
    });
  }

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
  }

  updateVoterAddress = (event) => {
    console.log('UPDATE VOTER ADDRESS', event.target.value);
    this.setState({ textForMapSearch: event.target.value });
  }

  handleKeyPress = (event) => {
    // Wait for 1/2 of a second after the last keypress to make a call to the voterAddressSave API
    const ENTER_KEY_CODE = 13;
    if (event.keyCode === ENTER_KEY_CODE) {
      event.preventDefault();
      setTimeout(() => {
        VoterActions.voterAddressSave(this.state.textForMapSearch);
      }, 500);
    }
  }

  render () {
    const { textForMapSearch } = this.state;
    return (
      <TextBox
        value={textForMapSearch}
        inputRef={(autocomplete) => { this.autoComplete = autocomplete; }}
        inputProps={{
          ...this.props.inputProps,
          onChange: this.updateVoterAddress,
          onKeyDown: this.handleKeyPress,
          style: { width: '65%' },
        }}
        {...this.props}
      />
    );
  }
}

export default AddressBox;
