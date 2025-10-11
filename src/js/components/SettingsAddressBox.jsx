import { Box, Button } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import TagManager from 'react-gtm-module';
import BallotActions from '../actions/BallotActions';
import VoterActions from '../actions/VoterActions';
import DelayedLoad from '../common/components/Widgets/DelayedLoad';
import LoadingWheel from '../common/components/Widgets/LoadingWheel';
import { prepareForCordovaKeyboard, restoreStylesAfterCordovaKeyboard } from '../common/utils/cordovaUtils';
import historyPush from '../common/utils/historyPush';
import Cookies from '../common/utils/js-cookie/Cookies';
import { renderLog } from '../common/utils/logging';
import BallotStore from '../stores/BallotStore';
import VoterStore from '../stores/VoterStore';
import { getPageDetails } from '../utils/lookupPageNameAndPageTypeDict';
import GoogleAutoComplete from './Widgets/GoogleAutoComplete';

class SettingsAddressBox extends Component {
  constructor (props) {
    super(props);
    this.state = {
      loading: false,
      textForMapSearch: '',
      ballotCaveat: '',
      isAddressVerified: false,
      voterSavedAddress: false,
    };
  }

  // eslint-disable-next-line camelcase,react/sort-comp
  UNSAFE_componentWillMount () {
    prepareForCordovaKeyboard('SettingsAddressBox');
  }

  componentDidMount () {
    this.setState({
      textForMapSearch: VoterStore.getTextForMapSearch(),
      ballotCaveat: BallotStore.getBallotCaveat(),
    });
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    this.ballotStoreListener = BallotStore.addListener(this.onBallotStoreChange.bind(this));
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

  componentDidCatch (error, info) {
    // We should get this information to Splunk!
    console.error('!!!SettingsAddressBox caught error: ', `${error} with info: `, info);
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
    this.ballotStoreListener.remove();
    clearTimeout(this.closeModalTimer);
    restoreStylesAfterCordovaKeyboard('SettingsAddressBox');
  }

  // See https://reactjs.org/docs/error-boundaries.html
  static getDerivedStateFromError (error) { // eslint-disable-line no-unused-vars
    // Update state so the next render will show the fallback UI, We should have a "Oh snap" page
    console.log('!!!SettingsAddressBox error', error);
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
      loading: false,
    });
  }

  incomingToggleSelectAddressModal = () => {
    if (this.props.toggleSelectAddressModal) {
      this.props.toggleSelectAddressModal();
    }
  }

  voterAddressCancel = (event, buttonId) => {
    event.preventDefault();
    const dataLayerObject = {
      actionDetails: {
        actionType: 'cancel',
        buttonId,
      },
      event: 'action',
      pageDetails: getPageDetails(),
      userDetails: VoterStore.getAnalyticsUserDetails(),
    };
    // console.log('dataLayerObject:', dataLayerObject);
    TagManager.dataLayer({ dataLayer: dataLayerObject });

    if (this.props.toggleEditingAddress) {
      this.props.toggleEditingAddress();
    }
  }

  voterAddressSaveSubmit = (event, buttonId) => {
    // console.log('Save button clicked');
    // console.log('Passed buttonId:', buttonId);
    event.preventDefault();
    const { textForMapSearch } = this.state;
    // console.log('AddressBox voterAddressSaveSubmit, textForMapSearch:', textForMapSearch);
    let ballotCaveat = 'Saving new address...';
    if (textForMapSearch && textForMapSearch !== '') {
      ballotCaveat = `Saving new address '${textForMapSearch}'...`;
    }

    // console.log('Passed buttonId:', buttonId);
    const dataLayerObject = {
      actionDetails: {
        actionType: 'save',
        buttonId,
      },
      event: 'action',
      pageDetails: getPageDetails(),
      userDetails: VoterStore.getAnalyticsUserDetails(),
    };
    const electionDetails = BallotStore.getAnalyticsElectionDetails(textForMapSearch);
    if (electionDetails && electionDetails.electionDate) {
      dataLayerObject.electionDetails = electionDetails;
    }
    // console.log('dataLayerObject:', dataLayerObject);
    TagManager.dataLayer({ dataLayer: dataLayerObject });

    BallotActions.setBallotCaveat(ballotCaveat);
    VoterActions.clearVoterElectionId();
    VoterActions.voterAddressSave(textForMapSearch);
    BallotActions.completionLevelFilterTypeSave('filterAllBallotItems');
    Cookies.set('location_guess_closed', '1', { expires: 31, path: '/' });
    this.setState({
      loading: true,
      voterSavedAddress: true,
    }, () => {
      if (this.props.onAddressSaveSuccess) {
        this.props.onAddressSaveSuccess();
      }
    });
    // We want to leave the voter in the modal until we get a new ballot
    // this.returnNewTextForMapSearchLocal(textForMapSearch);
    // const { toggleSelectAddressModal } = this.props;
    // if (toggleSelectAddressModal) {
    //   // console.log('In AddressBox where we normally toggleEditingAddress');
    //   const delayBeforeClosingModal = 4000;
    //   this.closeModalTimer = setTimeout(() => {
    //     toggleSelectAddressModal();
    //   }, delayBeforeClosingModal);
    // } else {
    //   console.log('AddressBox did not receive a toggleEditingAddress() function');
    // }
  }

  updateTextForMapSearch = (textForMapSearch) => {
    // console.log('AddressBox updateTextForMapSearch textForMapSearch:', textForMapSearch);
    this.setState({ textForMapSearch, isAddressVerified: false });
  }

  updateTextForMapSearchFromGoogle = (textForMapSearch) => {
    // console.log('AddressBox updateTextForMapSearchFromGoogle textForMapSearch:', textForMapSearch);
    if (textForMapSearch) {
      this.setState({ textForMapSearch, isAddressVerified: true });
    }
  }

  returnNewTextForMapSearchLocal (textForMapSearch) {
    const { returnNewTextForMapSearch } = this.props;
    if (returnNewTextForMapSearch) {
      returnNewTextForMapSearch(textForMapSearch);
    }
  }

  render () {
    renderLog('SettingsAddressBox');  // Set LOG_RENDER_EVENTS to log all renders
    // console.log('AddressBox render');
    let { waitingMessage } = this.props;
    const { classes, externalUniqueId, introductionHtml, showCancelEditAddressButton, toggleEditingAddress } = this.props;

    const { ballotCaveat, loading } = this.state;
    if (loading) {
      if (!waitingMessage) waitingMessage = 'Please wait a moment while we find your ballot...';

      return (
        <div>
          <h2>{waitingMessage}</h2>
          {LoadingWheel}
          <DelayedLoad waitBeforeShow={15000}>
            <div>
              <Button
                color="primary"
                fullWidth
                id={externalUniqueId ? `addressBoxModalCancelButton-${externalUniqueId}` : 'addressBoxModalCancelButton'}
                onClick={toggleEditingAddress}
                classes={{ root: classes.fullWidthSaveButton }}
                variant="contained"
              >
                Cancel and Try Again
              </Button>
            </div>
          </DelayedLoad>
        </div>
      );
    }

    return (
      <div className="container">
        <Box sx={{
            backgroundColor: 'grey.200',
            pl: 6,
            pr: 6,
            pt: 2,
            pb: 2,
            borderRadius: 8,
          }}
        >
          {introductionHtml}
          <div className="row" style={{ paddingTop: 10 }}>
            <GoogleAutoComplete
              id="entryBox"
              updateTextForMapSearchInParent={this.updateTextForMapSearch}
              updateTextForMapSearchInParentFromGoogle={this.updateTextForMapSearchFromGoogle}
            />
          </div>
        </Box>
        <div className="row" style={{ paddingTop: 10 }}>
          {/* {showCancelEditAddressButton ? (
            <Button
              color="primary"
              id={externalUniqueId ? `addressBoxModalCancelButton-${externalUniqueId}` : 'addressBoxModalCancelButton'}
              onClick={(event) => this.voterAddressCancel(event, externalUniqueId ? `addressBoxModalCancelButton-${externalUniqueId}` : 'addressBoxModalCancelButton')}
              classes={{ root: classes.cancelButton }}
            >
              Cancel
            </Button>
          ) : null} */}
          <br />
          <Button
            color="primary"
            id={externalUniqueId ? `addressBoxModalSaveButton-${externalUniqueId}` : 'addressBoxModalSaveButton'}
            onClick={(event) => this.voterAddressSaveSubmit(event, externalUniqueId ? `addressBoxModalSaveButton-${externalUniqueId}` : 'addressBoxModalSaveButton')}
            variant="contained"
            // classes={showCancelEditAddressButton ? { root: classes.saveButton } : { root: classes.fullWidthSaveButton }}
            classes={{root: classes.fullWidthSaveButton}}
            // fullWidth={!showCancelEditAddressButton}
            fullWidth
            // disabled={!this.state.isAddressVerified}
          >
            Update ballot
          </Button>
        </div>
        <p />
        <h4>{ballotCaveat}</h4>
      </div>
    );
  }
}
SettingsAddressBox.propTypes = {
  classes: PropTypes.object,
  externalUniqueId: PropTypes.string,
  introductionHtml: PropTypes.node,
  returnNewTextForMapSearch: PropTypes.func,
  saveUrl: PropTypes.string.isRequired,
  showCancelEditAddressButton: PropTypes.bool,
  shouldClearOnCancel: PropTypes.bool,
  toggleEditingAddress: PropTypes.func,
  onAddressSaveSuccess: PropTypes.func,
  toggleSelectAddressModal: PropTypes.func,
  waitingMessage: PropTypes.string,
  // disableAutoFocus: PropTypes.bool,
  // manualFocus: PropTypes.bool,
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
    borderRadius: '32px',
    height: 'fit-content',
    margin: 0,
  },
  cancelButton: {
    width: 'calc(50% - 8px)',
  },
  input: {
    marginLeft: 8,
    flex: 1,
  },
};

export default withStyles(styles)(SettingsAddressBox);
