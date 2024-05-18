import { Button } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
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
import GoogleAutoComplete from './Widgets/GoogleAutoComplete';

class AddressBox extends Component {
  constructor (props) {
    super(props);
    this.state = {
      loading: false,
      textForMapSearch: '',
      ballotCaveat: '',
      voterSavedAddress: false,
    };
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
    console.error('!!!AddressBox caught error: ', `${error} with info: `, info);
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
    this.ballotStoreListener.remove();
    clearTimeout(this.closeModalTimer);
    restoreStylesAfterCordovaKeyboard('AddressBox');
  }

  // See https://reactjs.org/docs/error-boundaries.html
  static getDerivedStateFromError (error) { // eslint-disable-line no-unused-vars
    // Update state so the next render will show the fallback UI, We should have a "Oh snap" page
    console.log('!!!AddressBox error', error);
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

  voterAddressSaveSubmit = (event) => {
    event.preventDefault();
    const { textForMapSearch } = this.state;
    // console.log('AddressBox voterAddressSaveSubmit, textForMapSearch:', textForMapSearch);
    let ballotCaveat = 'Saving new address...';
    if (textForMapSearch && textForMapSearch !== '') {
      ballotCaveat = `Saving new address '${textForMapSearch}'...`;
    }
    BallotActions.setBallotCaveat(ballotCaveat);
    VoterActions.clearVoterElectionId();
    VoterActions.voterAddressSave(textForMapSearch);
    BallotActions.completionLevelFilterTypeSave('filterAllBallotItems');
    Cookies.set('location_guess_closed', '1', { expires: 31, path: '/' });
    this.setState({
      loading: true,
      voterSavedAddress: true,
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
    this.setState({ textForMapSearch });
  }

  updateTextForMapSearchFromGoogle = (textForMapSearch) => {
    // console.log('AddressBox updateTextForMapSearchFromGoogle textForMapSearch:', textForMapSearch);
    if (textForMapSearch) {
      this.setState({ textForMapSearch });
    }
  }

  returnNewTextForMapSearchLocal (textForMapSearch) {
    const { returnNewTextForMapSearch } = this.props;
    if (returnNewTextForMapSearch) {
      returnNewTextForMapSearch(textForMapSearch);
    }
  }

  render () {
    renderLog('AddressBox');  // Set LOG_RENDER_EVENTS to log all renders
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
        {introductionHtml}
        <div className="row" style={{ paddingTop: 10 }}>
          <GoogleAutoComplete
            id="entryBox"
            updateTextForMapSearchInParent={this.updateTextForMapSearch}
            updateTextForMapSearchInParentFromGoogle={this.updateTextForMapSearchFromGoogle}
          />
        </div>
        <div className="row" style={{ paddingTop: 10 }}>
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
        </div>
        <p />
        <h4>{ballotCaveat}</h4>
      </div>
    );
  }
}
AddressBox.propTypes = {
  classes: PropTypes.object,
  externalUniqueId: PropTypes.string,
  introductionHtml: PropTypes.node,
  returnNewTextForMapSearch: PropTypes.func,
  saveUrl: PropTypes.string.isRequired,
  showCancelEditAddressButton: PropTypes.bool,
  toggleEditingAddress: PropTypes.func,
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

export default withStyles(styles)(AddressBox);
