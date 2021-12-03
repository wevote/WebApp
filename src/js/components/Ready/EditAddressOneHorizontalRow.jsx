import { Button, InputBase, Paper } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { EditLocation } from '@material-ui/icons';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
import BallotActions from '../../actions/BallotActions';
import VoterActions from '../../actions/VoterActions';
import BallotStore from '../../stores/BallotStore';
import VoterStore from '../../stores/VoterStore';
import { historyPush, isIPhoneMiniOrSmaller, isWebApp, restoreStylesAfterCordovaKeyboard } from '../../utils/cordovaUtils';
import isMobile from '../../utils/isMobile';
import Cookies from '../../utils/js-cookie/Cookies';
import { renderLog } from '../../common/utils/logging';
import InfoCircleIcon from '../Widgets/InfoCircleIcon';

class EditAddressOneHorizontalRow extends Component {
  constructor (props, context) {
    super(props, context);
    this.state = {
      showAddressExplanation: false,
      textForMapSearch: '',
      voterSavedAddress: false,
    };
    this.updateVoterAddress = this.updateVoterAddress.bind(this);
    this.voterAddressSaveLocal = this.voterAddressSaveLocal.bind(this);
    this.voterAddressSaveSubmit = this.voterAddressSaveSubmit.bind(this);
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

  componentDidCatch (error, info) {
    // We should get this information to Splunk!
    console.error('EditAddressOneHorizontalRow caught error: ', `${error} with info: `, info);
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
    this.ballotStoreListener.remove();
    if (this.googleAutocompleteListener !== undefined) { // Temporary fix until google maps key is fixed for Cordova
      this.googleAutocompleteListener.remove();
    } else if (isWebApp()) {
      // console.log('EditAddressOneHorizontalRow ERROR: Google Maps API IS NOT LOADED');
    }
    restoreStylesAfterCordovaKeyboard('EditAddressOneHorizontalRow');
  }

  // See https://reactjs.org/docs/error-boundaries.html
  static getDerivedStateFromError (error) { // eslint-disable-line no-unused-vars
    // Update state so the next render will show the fallback UI, We should have a "Oh snap" page
    return { hasError: true };
  }


  handleKeyPress (event) {
    // console.log('EditAddressOneHorizontalRow, handleKeyPress, event: ', event, ', event.keyCode:', event.keyCode);
    // console.log('this.autoComplete:', this.autoComplete);
    // console.log('handleKeyPress');
    const enterAndSpaceKeyCodes = [13]; // We actually don't want to use the space character to save, 32
    if (enterAndSpaceKeyCodes.includes(event.keyCode)) {
      event.preventDefault();
      this.voterAddressSaveLocal(event);
    }
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

  onClickToggleAddressExplanation = () => {
    const { showAddressExplanation } = this.state;
    this.setState({
      showAddressExplanation: !showAddressExplanation,
    });
  }

  _placeChanged (addressAutocomplete) {
    // I believe this gets called when we get a response from Google
    const place = addressAutocomplete.getPlace();
    if (place.formatted_address) {
      // console.log('_placeChanged CALLING-VoterActions.voterAddressSave place.formatted_address:', place.formatted_address);
      // VoterActions.voterAddressSave(place.formatted_address);
      this.setState({
        textForMapSearch: place.formatted_address,
      });
    } else {
      // console.log('_placeChanged CALLING-VoterActions.voterAddressSave place.name:', place.name);
      // VoterActions.voterAddressSave(place.name);
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
    // console.log('updateVoterAddress, event.target.value:', event.target.value);
    this.setState({ textForMapSearch: event.target.value });
  }

  voterAddressSaveLocal (event) {
    // console.log('CALLING-VoterActions.voterAddressSave, event.target.value:', event.target.value);
    event.preventDefault();
    VoterActions.voterAddressSave(event.target.value);
    Cookies.set('location_guess_closed', '1', { expires: 31, path: '/' });
    this.setState({
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
      voterSavedAddress: true,
    });
    const { onSave } = this.props;
    if (onSave) onSave();
  }

  render () {
    renderLog('EditAddressOneHorizontalRow');  // Set LOG_RENDER_EVENTS to log all renders
    // console.log('EditAddressOneHorizontalrow render');
    const { classes } = this.props;
    const { showAddressExplanation, textForMapSearch } = this.state; // voterSavedAddress

    // if (voterSavedAddress) {
    //   return <span />;
    // }

    return (
      <OuterWrapper id="EditAddressOneHorizontalRow">
        <InnerWrapper className="u-show-mobile">
          <AddressLabelMobile>
            <span className="u-show-mobile-iphone5-or-smaller">
              Your street address w/ number
            </span>
            <span className="u-show-mobile-bigger-than-iphone5">
              Your street address with house number
            </span>
            &nbsp;
          </AddressLabelMobile>
        </InnerWrapper>
        <InnerWrapper className="u-show-tablet">
          <AddressLabelMobile>
            <span>
              Your street address with house number
            </span>
            &nbsp;
          </AddressLabelMobile>
        </InnerWrapper>
        <InnerWrapper>
          <AddressLabel className="u-show-desktop">
            <span>
              Your full street address with house number
            </span>
            &nbsp;
          </AddressLabel>
          <SubmitFormWrapper onSubmit={this.voterAddressSaveSubmit}>
            <InternalFormWrapper>
              <Paper className={classes.paperInputForm} elevation={2} style={{ minWidth: 250 }}>
                <EditLocation className="ion-input-icon" />
                <InputBase
                  className={classes.inputBase}
                  name="address"
                  aria-label="Address"
                  placeholder="Street number, full address and ZIP..."
                  value={textForMapSearch}
                  inputRef={(autocomplete) => { this.autoComplete = autocomplete; }}
                  inputProps={{
                    // onBlur: this.saveAddressFromOnBlur,
                    onChange: this.updateVoterAddress,
                    onKeyDown: this.handleKeyPress,
                  }}
                  id="editAddressOneHorizontalRowTextForMapSearch"
                />
              </Paper>
              <ButtonWrapper>
                <Button
                  classes={{ root: classes.saveButton }}
                  color="primary"
                  fullWidth={!isMobile()}
                  id="editAddressOneHorizontalRowSaveButton"
                  onClick={this.voterAddressSaveSubmit}
                  variant="contained"
                >
                  {(textForMapSearch) ? (
                    <>
                      <span className="u-show-desktop-tablet u-no-break">Retrieve Ballot</span>
                      <span className="u-show-mobile">Confirm</span>
                    </>
                  ) : (
                    <>
                      Save
                    </>
                  )}
                </Button>
              </ButtonWrapper>
            </InternalFormWrapper>
          </SubmitFormWrapper>
        </InnerWrapper>
        <InnerWrapper>
          {showAddressExplanation ? (
            <AddressExplanation onClick={this.onClickToggleAddressExplanation}>
              <InfoCircleIcon />
              To find your correct ballot, we need your full address, including house number.
              {' '}
              We are a nonprofit, and will never reveal your address.
              {' '}
              Note: our partners who provide what&apos;s-on-the-ballot data work incredibly hard to cover the entire United States, but we cannot guarantee 100% of the items on your official ballot will be shown on We Vote. Please contact us using the &apos;Help&apos; link if you have questions.
              {' '}
              (
              <span className="u-cursor--pointer u-link-color">
                show less
              </span>
              )
            </AddressExplanation>
          ) : (
            <AddressExplanation onClick={this.onClickToggleAddressExplanation}>
              <InfoCircleIcon />
              Why house number?
              {' '}
              (
              <span className="u-cursor--pointer u-link-color">
                show more
              </span>
              )
            </AddressExplanation>
          )}
        </InnerWrapper>
      </OuterWrapper>
    );
  }
}
EditAddressOneHorizontalRow.propTypes = {
  saveUrl: PropTypes.string,
  classes: PropTypes.object,
  onSave: PropTypes.func,
};

const AddressExplanation = styled.div`
  color: #999;
  font-size: 16px;
  font-weight: 400;
  padding-bottom: 0;
  padding-top: 4px;
  @include breakpoints (max mid-small) {
    font-size: 14px;
  }
`;

const AddressLabel = styled.div`
  font-weight: 600;
  margin-right: 12px;
  ${() => (isIPhoneMiniOrSmaller() ? { display: 'flex' } : {})}
`;

const AddressLabelMobile = styled.div`
  font-weight: 600;
  margin-bottom: 4px;
  text-align: center;
  ${() => (isIPhoneMiniOrSmaller() ? { display: 'flex' } : {})}
`;

const SubmitFormWrapper = styled.div`
  ${() => (isIPhoneMiniOrSmaller() ? { display: 'flex' } : {})}
  ${() => (isMobile() ? { width: '100%' } : {})}
`;

const InternalFormWrapper = styled.div`
  display: flex;
  @media (max-width: 490px) {
    flex-wrap: wrap;
  }
  ${() => (isMobile() ? { flexWrap: 'wrap' } : {})}
  justify-content: center;
  width: 100%;
`;

const OuterWrapper = styled.div`
  margin-bottom: 8px !important;
  width: 100%;
`;

const ButtonWrapper = styled.div`
  min-width: 208px;
  @media (max-width: 490px) {
    width: 100%;
  }
`;

const InnerWrapper = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
`;

const styles = (theme) => ({
  paperInputForm: {
    padding: '2px .7rem',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  },
  saveButton: {
    height: 'fit-content',
    width: '100%',
    [theme.breakpoints.down('sm')]: {
      marginTop: 3,
    },
    [theme.breakpoints.up('sm')]: {
      marginLeft: 8,
    },
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
