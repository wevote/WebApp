import { Button } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
import BallotActions from '../../actions/BallotActions';
import VoterActions from '../../actions/VoterActions';
import { isIPhoneMiniOrSmaller, restoreStylesAfterCordovaKeyboard } from '../../common/utils/cordovaUtils';
import historyPush from '../../common/utils/historyPush';
import { displayNoneIfSmallerThanDesktop } from '../../common/utils/isMobileScreenSize';
import Cookies from '../../common/utils/js-cookie/Cookies';
import { renderLog } from '../../common/utils/logging';
import AppObservableStore from '../../common/stores/AppObservableStore';
import BallotStore from '../../stores/BallotStore';
import VoterStore from '../../stores/VoterStore';
import isMobile from '../../utils/isMobile';
import GoogleAutoComplete from '../Widgets/GoogleAutoComplete';
import InfoCircleIcon from '../Widgets/InfoCircleIcon';

class EditAddressOneHorizontalRow extends Component {
  constructor (props, context) {
    super(props, context);
    this.state = {
      showAddressExplanation: false,
      textForMapSearch: '',
      voterSavedAddress: false,
    };
  }


  componentDidMount () {
    // console.log('In EditAddressOneHorizontalRow componentDidMount');
    this.setState({
      textForMapSearch: VoterStore.getTextForMapSearch(),
    });
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    this.ballotStoreListener = BallotStore.addListener(this.onBallotStoreChange.bind(this));
  }

  componentDidCatch (error, info) {
    // We should get this information to Splunk!
    console.error('EditAddressOneHorizontalRow caught error: ', `${error} with info: `, info);
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
    this.ballotStoreListener.remove();
    restoreStylesAfterCordovaKeyboard('EditAddressOneHorizontalRow');
  }

  // See https://reactjs.org/docs/error-boundaries.html
  static getDerivedStateFromError (error) { // eslint-disable-line no-unused-vars
    // Update state so the next render will show the fallback UI, We should have a "Oh snap" page
    return { hasError: true };
  }

  onBallotStoreChange () {
    const { saveUrl } = this.props;
    const { textForMapSearch, voterSavedAddress } = this.state;
    // console.log('onBallotStoreChange, state.voterSavedAddress:', voterSavedAddress, ', VoterStore.getTextForMapSearch():', VoterStore.getTextForMapSearch())
    const { pathname } = window.location;
    if (saveUrl && saveUrl !== '' && pathname !== saveUrl && textForMapSearch && voterSavedAddress) {
      historyPush(saveUrl);
    } else if (VoterStore.getTextForMapSearch() !== '') {
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
    } else if (VoterStore.getTextForMapSearch() !== '') {
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

  updateTextForMapSearch = (textForMapSearch) => {
    // console.log('EditAddressHorizontalRow updateTextForMapSearch textForMapSearch:', textForMapSearch);
    this.setState({ textForMapSearch });
  }

  updateTextForMapSearchFromGoogle = (textForMapSearch) => {
    // console.log('EditAddressHorizontalRow updateTextForMapSearchFromGoogle, textForMapSearch:', textForMapSearch);
    if (textForMapSearch) {
      this.setState({ textForMapSearch });
    }
  }

  voterAddressSaveSubmit = (event) => {
    event.preventDefault();
    const { textForMapSearch } = this.state;
    // console.log('EditAddressOneHorizontalRow voterAddressSaveSubmit textForMapSearch:', textForMapSearch);
    let ballotCaveat = 'Saving new address...';
    if (textForMapSearch && textForMapSearch !== '') {
      ballotCaveat = `Saving new address '${textForMapSearch}'...`;
    }
    BallotActions.setBallotCaveat(ballotCaveat);
    VoterActions.clearVoterElectionId();
    VoterActions.voterAddressSave(textForMapSearch);
    BallotActions.completionLevelFilterTypeSave('filterAllBallotItems');
    AppObservableStore.voterBallotItemsRetrieveHasBeenCalled(true);
    Cookies.set('location_guess_closed', '1', { expires: 31, path: '/' });
    this.setState({
      voterSavedAddress: true,
    });
    const { onSave } = this.props;
    if (onSave) onSave();
  }

  render () {
    renderLog('EditAddressOneHorizontalRow');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes } = this.props;
    const { showAddressExplanation, textForMapSearch } = this.state; // voterSavedAddress
    // console.log('EditAddressOneHorizontalrow render textForMapSearch:', textForMapSearch);

    return (
      <OuterWrapper id="EditAddressOneHorizontalRow">
        <InnerWrapper className="u-show-mobile">
          <AddressLabelMobile>
            <span className="u-show-mobile-iphone5-or-smaller">
              Street address w/ number
            </span>
            <span className="u-show-mobile-bigger-than-iphone5">
              Street address w/ house number
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
          <AddressLabel>
            <span>
              Your full street address with house number
            </span>
            &nbsp;
          </AddressLabel>
          <SubmitFormWrapper>
            <InternalFormWrapper>
              <GoogleAutoComplete
                id="oneHorizRow"
                updateTextForMapSearchInParent={this.updateTextForMapSearch}
                updateTextForMapSearchInParentFromGoogle={this.updateTextForMapSearchFromGoogle}
              />
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
              Note: our partners who provide what&apos;s-on-the-ballot data work incredibly hard to cover the entire United States, but we cannot guarantee 100% of the items on your official ballot will be shown on WeVote. Please contact us using the &apos;Help&apos; link if you have questions.
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

const AddressExplanation = styled('div')`
  color: #999;
  font-size: 16px;
  font-weight: 400;
  padding-bottom: 0;
  padding-top: 4px;
  @include breakpoints (max mid-small) {
    font-size: 14px;
  }
`;

const AddressLabel = styled('div')`
  font-weight: 600;
  margin-right: 12px;
  ${() => (isIPhoneMiniOrSmaller() ? { display: 'flex' } : {})}
  ${() => displayNoneIfSmallerThanDesktop()};
`;

const AddressLabelMobile = styled('div')`
  font-weight: 600;
  margin-bottom: 4px;
  text-align: center;
  ${() => (isIPhoneMiniOrSmaller() ? { display: 'flex' } : {})}
`;

const SubmitFormWrapper = styled('div')`
  ${() => (isIPhoneMiniOrSmaller() ? { display: 'flex' } : {})}
  ${() => (isMobile() ? { width: '100%' } : {})}
`;

const InternalFormWrapper = styled('div')`
  display: flex;
  @media (max-width: 490px) {
    flex-wrap: wrap;
  }
  ${() => (isMobile() ? { flexWrap: 'wrap' } : {})}
  justify-content: center;
  width: 100%;
`;

const OuterWrapper = styled('div')({
  marginBottom: '8px !important',
  width: '100%',
});

const ButtonWrapper = styled('div')`
  min-width: 208px;
  @media (max-width: 490px) {
    width: 100%;
  }
`;

const InnerWrapper = styled('div')`
  align-items: center;
  display: flex;
  justify-content: center;
`;

const styles = (theme) => ({
  saveButton: {
    height: 'fit-content',
    width: '100%',
    [theme.breakpoints.down('sm')]: {
      marginTop: 3,
    },
    [theme.breakpoints.up('sm')]: {
      marginLeft: 8,
      width: 150,
    },
  },
});

export default withStyles(styles)(EditAddressOneHorizontalRow);
