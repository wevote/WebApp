import { withStyles } from '@material-ui/core/styles';
import { Settings } from '@material-ui/icons';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import styled from 'styled-components';
import { renderLog } from '../../common/utils/logging';
import VoterStore from '../../stores/VoterStore';
import { calculateBallotBaseUrl, shortenText } from '../../utils/textFormat';
import AddressBox from '../AddressBox';

const ReadMore = React.lazy(() => import(/* webpackChunkName: 'ReadMore' */ '../../common/components/Widgets/ReadMore'));

class EditAddressInPlace extends Component {
  constructor (props, context) {
    super(props, context);
    this.state = {
      editingAddress: false,
      textForMapSearch: '',
    };
  }

  componentDidMount () {
    // console.log('EditAddressInPlace componentDidMount');
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    this.onVoterStoreChange();
    const { defaultIsEditingAddress } = this.props;
    this.setState({
      editingAddress: defaultIsEditingAddress,
    });
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
  }

  onVoterStoreChange () {
    // console.log('EditAddressInPlace onVoterStoreChange');
    const voterAddressObject = VoterStore.getAddressObject();
    let textForMapSearch = '';
    if (voterAddressObject && voterAddressObject.text_for_map_search) {
      textForMapSearch = voterAddressObject.text_for_map_search;
    }
    this.setState({
      textForMapSearch,
    });
  }

  incomingToggleFunction = () => {
    if (this.props.toggleFunction) {
      this.props.toggleFunction();
    }
  }

  localTextForMapSearchUpdate = (textForMapSearch) => {
    this.setState({
      textForMapSearch,
    });
  }

  toggleEditingAddress = () => {
    const { editingAddress } = this.state;
    if (this.props.toggleEditingAddress) {
      this.props.toggleEditingAddress();
    }
    this.setState({
      editingAddress: !editingAddress,
    });
  }

  render () {
    renderLog('EditAddressInPlace');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes, noAddressMessage } = this.props;
    const { location: { pathname } } = window;
    const { editingAddress, textForMapSearch } = this.state;
    const noAddressMessageFiltered = noAddressMessage || '- no address entered -';
    const maximumAddressDisplayLength = 60;
    const ballotBaseUrl = calculateBallotBaseUrl(this.props.ballotBaseUrl, pathname);
    const addressIntroduction = "To find your correct ballot, we need your full address, including house number. We are a nonprofit, and will never reveal your address. Note: our partners who provide what's-on-the-ballot data work incredibly hard to cover the entire United States, but we cannot guarantee 100% of the items on your official ballot will be shown on We Vote. Please contact us using the 'Help' link if you have questions.";
    if (editingAddress) {
      return (
        <span>
          <div>
            Please enter your full street address with house number for your correct ballot.
          </div>
          <AddressBox
            editingAddress
            returnNewTextForMapSearch={this.localTextForMapSearchUpdate}
            saveUrl={ballotBaseUrl}
            showCancelEditAddressButton
            toggleEditingAddress={this.toggleEditingAddress}
            toggleSelectAddressModal={this.incomingToggleFunction}
          />
        </span>
      );
    } else {
      return (
        <>
          <EditBlockWrapper
            className="u-cursor--pointer"
            id="editAddressInPlaceModalEditButton"
            onClick={this.toggleEditingAddress}
          >
            <EditAddressPreview>
              { textForMapSearch.length ? shortenText(textForMapSearch, maximumAddressDisplayLength) : noAddressMessageFiltered }
              {' '}
              <ChangeAddressWrapper className="u-no-break">
                <SettingsIconWrapper>
                  <Settings classes={{ root: classes.settingsIcon }} />
                </SettingsIconWrapper>
                <ChangeAddressText>
                  change address
                </ChangeAddressText>
              </ChangeAddressWrapper>
            </EditAddressPreview>
          </EditBlockWrapper>
          <AddressIntroductionWrapper>
            <Suspense fallback={<></>}>
              <ReadMore
                textToDisplay={addressIntroduction}
                numberOfLines={4}
              />
            </Suspense>
          </AddressIntroductionWrapper>
        </>
      );
    }
  }
}
EditAddressInPlace.propTypes = {
  ballotBaseUrl: PropTypes.string,
  classes: PropTypes.object,
  defaultIsEditingAddress: PropTypes.bool,
  noAddressMessage: PropTypes.string,
  toggleEditingAddress: PropTypes.func,
  toggleFunction: PropTypes.func,
};

const styles = {
  settingsIcon: {
    color: '#999',
    marginLeft: '3px',
    width: 16,
    height: 16,
  },
  tooltipPlacementBottom: {
    marginTop: 0,
  },
};

const ChangeAddressText = styled.div`
  color: #999;
`;

const ChangeAddressWrapper = styled.div`
  align-items: center;
  display: flex;
`;

const EditAddressPreview = styled.div`
  font-size: 1.1rem;
  font-weight: bold;
`;

const AddressIntroductionWrapper = styled.div`
  font-size: 0.9rem;
  font-weight: 500;
  margin-top: 8px;
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    margin-left: 15px;
    margin-right: 15px;
  }
`;

const EditBlockWrapper = styled.div`
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    margin-left: 15px;
    margin-right: 15px;
  }
`;

const SettingsIconWrapper = styled.div`
`;

export default withStyles(styles)(EditAddressInPlace);
