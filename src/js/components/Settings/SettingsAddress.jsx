import React, { Component } from 'react';
import { Helmet } from 'react-helmet-async';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import AnalyticsActions from '../../actions/AnalyticsActions';
import VoterStore from '../../stores/VoterStore';
import VoterActions from '../../actions/VoterActions';
import { isWebApp } from '../../common/utils/isCordovaOrWebApp';
import { renderLog } from '../../common/utils/logging';
import AddressBox from '../AddressBox';
import BrowserPushMessage from '../Widgets/BrowserPushMessage';
import AppObservableStore from '../../common/stores/AppObservableStore';

export default class SettingsAddress extends Component {
  constructor (props, context) {
    super(props, context);
    this.state = {
      textForMapSearch: '',
      originalTextAddress: false,
      addressSaved: false,
    };
    this.handleAddressSaveSuccess = this.handleAddressSaveSuccess.bind(this);
    this.removeAddress = this.removeAddress.bind(this);
  }

  componentDidMount () {
    AnalyticsActions.saveActionElections(VoterStore.electionId());
    this.onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
  }

  handleAddressSaveSuccess () {
    setTimeout(() => {
      this.setState({ addressSaved: true });
    }, 2000);
  }

  onVoterStoreChange () {
    let text = VoterStore.getTextForMapSearch();
    const ballotLocation = VoterStore.getVoterSavedAddress();
    if (text && text.length > 0) {
      text = text.replace(', USA', '');
    }
    this.setState({
      textForMapSearch: text,
      originalTextAddress: ballotLocation,
    });
  }

  toggleEditingAddress = () => {
    const entryBox = document.getElementById('entryBox');
    if (entryBox) {
      entryBox.value = '';
    }
  }

  showSelectBallotModalEditAddress = () => {
    const showEditAddress = true;
    const showSelectBallotModal = true;
    AppObservableStore.setShowSelectBallotModal(showSelectBallotModal, showEditAddress);
  }

  removeAddress () {
    VoterActions.voterAddressSave('');
    this.setState({ addressSaved: false });
  }

  render () {
    renderLog('SettingsAddress');  // Set LOG_RENDER_EVENTS to log all renders
    const { addressSaved, originalTextAddress } = this.state;
    return (
      <div className="u-stack--md u-f4">
        <Helmet title="Enter Address - WeVote" />
        <BrowserPushMessage incomingProps={this.props} />
        <div className="card">
          <div className="card-main">
            <div className={isWebApp() ? 'u-padding-bottom--md' : 'SettingsCardBottomCordova'}>
              <Header>
                <div className="h1 u-padding-top--xs">
                  Ballot address
                </div>
                <Disclaimer>
                  <InfoOutlinedIcon className="u-gray-mid" />
                  <Link id="ballotDisclaimer" to="/more/faq">
                    <span className="u-no-break u-link-color u-margin-left--xs">Ballot Disclaimer</span>
                  </Link>
                </Disclaimer>
              </Header>
              {addressSaved ? (
                <div className="u-margin-top--lg">
                  <span>Address where you are registered to vote</span>
                  <div className="u-padding-top--sm u-flex">
                    <BallotAddressText className="u-bold">{this.state.textForMapSearch}</BallotAddressText>
                    <div className="u-cursor--pointer"
                      id="editAddress"
                      onClick={this.showSelectBallotModalEditAddress}
                    >
                      <EditOutlinedIcon className="u-link-color u-f3 u-margin-left--sm" />
                      <span className="u-no-break u-link-color u-f3 u-margin-left--xs">Edit</span>
                    </div>
                  </div>
                  <div>
                    <CurrentBallotText className="u-gray-darker">We will never share your address or send you any mail.</CurrentBallotText>
                    <div className="u-margin-top--md u-flex u-cursor--pointer"
                      onClick={this.removeAddress}
                    >
                      <DeleteIcon className="u-gray-mid" />
                      <span className="u-gray-darker u-margin-left--xs">Remove address</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="u-margin-top--lg">
                    <h3 className="h3">
                      Enter your address to see your acurate ballot
                    </h3>
                    <DataSettingText>
                      We will never share your address or send you any mail.
                    </DataSettingText>
                    <span>
                      Current ballot is shown for:
                    </span>
                    <p className="u-padding-top--sm u-stack--lg">
                      <span className="u-bold">
                        {' '}
                        {this.state.textForMapSearch}
                        {' '}
                      </span>
                      <span className="u-gray-mid">(based on your ip address)</span>
                    </p>
                  </div>
                  <AddressBox
                    introductionHtml={(
                      <h3 className="h4 row u-gray-darker">
                        Address where you are registered to vote
                      </h3>
                    )}
                    saveUrl="/settings/address"
                    showCancelEditAddressButton
                    shouldClearOnCancel
                    toggleEditingAddress={this.toggleEditingAddress}
                    onAddressSaveSuccess={this.handleAddressSaveSuccess}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const Header = styled('div')`
  display: flex;
  justify-content: space-between;
`;

const Disclaimer = styled('div')`
  display: flex;
  align-items: center;
`;

const DataSettingText = styled('div')`
  color: #999;
  font-style: italic;
  margin-bottom: 30px;
`;

const CurrentBallotText = styled('span')`
  font-style: italic;
  font-size: 20px;
`;

const BallotAddressText = styled('p')`
  margin-bottom: 30px;
  border-right: solid 1px;
  padding-right: 8px;
`;
