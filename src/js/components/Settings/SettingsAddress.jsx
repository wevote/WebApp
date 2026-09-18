import DeleteIcon from '@mui/icons-material/Delete';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import React, { Component } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import AnalyticsActions from '../../actions/AnalyticsActions';
import VoterActions from '../../actions/VoterActions';
import { isWebApp } from '../../common/utils/isCordovaOrWebApp';
import { renderLog } from '../../common/utils/logging';
import webAppConfig from '../../config';
import VoterStore from '../../stores/VoterStore';
import SettingsAddressBox from '../SettingsAddressBox';
import BrowserPushMessage from '../Widgets/BrowserPushMessage';

const nextReleaseFeaturesEnabled = webAppConfig.ENABLE_NEXT_RELEASE_FEATURES === undefined ? false : webAppConfig.ENABLE_NEXT_RELEASE_FEATURES;

export default class SettingsAddressForDrawer extends Component {
  constructor (props, context) {
    super(props, context);
    this.state = {
      textForMapSearch: '',
      // originalTextAddress: false,
      addressSaved: VoterStore.getVoterSavedAddress(),
      editingAddress: false,
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
      this.setState({ addressSaved: true, editingAddress: false });
    }, 2000);
  }

  onVoterStoreChange () {
    let text = VoterStore.getTextForMapSearch();
    // const ballotLocation = VoterStore.getVoterSavedAddress();
    if (text && text.length > 0) {
      text = text.replace(', USA', '');
    }
    this.setState({
      textForMapSearch: text,
      // originalTextAddress: ballotLocation,
    });
  }

  toggleEditingAddress = () => {
    const entryBox = document.getElementById('entryBox');
    if (entryBox) {
      entryBox.value = '';
    }
  };

  openWarningDialog = () => {
    this.setState({ showWarningDialog: true });
  };

  closeWarningDialog = () => {
    this.setState({ showWarningDialog: false });
  };

  confirmRemoveAddress = () => {
    VoterActions.voterAddressSave('');
    this.setState({ addressSaved: false, showWarningDialog: false });
  };

  removeAddress () {
    VoterActions.voterAddressSave('');
    this.setState({ addressSaved: false });
  }

  render () {
    renderLog('SettingsAddressForDrawer');  // Set LOG_RENDER_EVENTS to log all renders
    const { addressSaved, editingAddress } = this.state;
    const pigsCanFly = false;
    return (
      nextReleaseFeaturesEnabled && (
      <OuterWrapper>
        <Helmet title="Enter Address - WeVote" />
        <BrowserPushMessage incomingProps={this.props} />
        <CardWrapper className="card">
          <CardMainWrapper className="card-main">
            <CardContentWrapper className={isWebApp() ? 'u-padding-bottom--md' : 'SettingsCardBottomCordova'}>
              <Header>
                <Title>
                  Ballot address
                </Title>
                {pigsCanFly && (
                  <Disclaimer>
                    <InfoOutlinedIcon className="u-gray-mid" />
                    <Link id="ballotDisclaimer" to="/more/faq">
                      <DisclaimerLinkText>Ballot Disclaimer</DisclaimerLinkText>
                    </Link>
                  </Disclaimer>
                )}
              </Header>
              {addressSaved && !editingAddress ? (
                <AddressSavedSection>
                  <AddressLabel>Address where you are registered to vote</AddressLabel>
                  <AddressDisplayWrapper>
                    <BallotAddressText>{this.state.textForMapSearch}</BallotAddressText>
                    <EditAddressButton
                      id="editAddress"
                      onClick={() => this.setState({ editingAddress: true })}
                    >
                      <EditOutlinedIcon className="u-link-color u-f3 u-margin-left--sm" />
                      <EditText>Edit</EditText>
                    </EditAddressButton>
                  </AddressDisplayWrapper>
                  <PrivacyAndActionsWrapper>
                    <CurrentBallotText>We will never share your address or send you any mail.</CurrentBallotText>
                    <RemoveAddressButton
                      onClick={this.openWarningDialog}
                    >
                      <DeleteIcon className="u-gray-mid" />
                      <RemoveAddressText>Remove address</RemoveAddressText>
                    </RemoveAddressButton>
                  </PrivacyAndActionsWrapper>
                </AddressSavedSection>
              ) : (
                <AddressEntrySection>
                  <AddressEntryTopSection>
                    <AddressEntryInstruction>
                      Enter your address to see your accurate ballot
                    </AddressEntryInstruction>
                    <DataSettingText>
                      We will never share your address or send you any mail.
                    </DataSettingText>
                    <CurrentBallotLabel>
                      Current ballot is shown for:
                    </CurrentBallotLabel>
                    <CurrentBallotLocationWrapper>
                      <BoldText>
                        {' '}
                        {this.state.textForMapSearch}
                        {' '}
                      </BoldText>
                      {!this.state.addressSaved && (
                        <ApproximateLocationText>
                          <br />
                          (approximate location from your internet provider)
                        </ApproximateLocationText>
                      )}
                    </CurrentBallotLocationWrapper>
                  </AddressEntryTopSection>
                  <SettingsAddressBox
                    introductionHtml={(
                      <IntroductionHeading>
                        <strong>Ballot address</strong>
                        <SubHeadingText>&nbsp;(where you are registered to vote)</SubHeadingText>
                      </IntroductionHeading>
                    )}
                    saveUrl="/settings/address"
                    showCancelEditAddressButton
                    shouldClearOnCancel
                    toggleEditingAddress={this.toggleEditingAddress}
                    onAddressSaveSuccess={this.handleAddressSaveSuccess}
                  />
                  <CurrentBallotLabelBottom>
                    Current ballot is shown for:
                  </CurrentBallotLabelBottom>
                  <CurrentBallotLocationWrapperBottom>
                    <BoldTextBottom>
                      {' '}
                      {this.state.textForMapSearch}
                      {' '}
                    </BoldTextBottom>
                    <ApproximateLocationTextBottom>
                      <br />
                      (approximate location from your internet provider)
                    </ApproximateLocationTextBottom>
                  </CurrentBallotLocationWrapperBottom>
                </AddressEntrySection>
              )}
            </CardContentWrapper>
          </CardMainWrapper>
        </CardWrapper>
        <Dialog
          open={Boolean(this.state.showWarningDialog)}
          onClose={this.closeWarningDialog}
        >
          <DialogTitle>
            <WarningAmberIcon color="warning" style={{ marginRight: 8, verticalAlign: 'middle' }} />
            Warning
          </DialogTitle>
          <DialogContent>
            Not entering an address may result in an inaccurate ballot.
          </DialogContent>
          <DialogActions>
            <Button onClick={this.closeWarningDialog}>Cancel</Button>
            <Button onClick={this.confirmRemoveAddress} color="error" variant="contained">
              Remove Address
            </Button>
          </DialogActions>
        </Dialog>
      </OuterWrapper>
      )
    );
  }
}

const OuterWrapper = styled('div')`
  font-size: 18px;
  margin-bottom: 32px;
`;

const CardWrapper = styled('div')`
`;

const CardMainWrapper = styled('div')`
`;

const CardContentWrapper = styled('div')`
`;

const Header = styled('div')`
  display: flex;
  justify-content: space-between;
`;

const Title = styled('div')`
  font-size: 28px;
  font-weight: 600;
  padding-top: 4px;
`;

const Disclaimer = styled('div')`
  display: flex;
  align-items: center;
`;

const DisclaimerLinkText = styled('span')`
  white-space: nowrap;
  color: var(--link-color);
  margin-left: 4px;
`;

const AddressSavedSection = styled('div')`
  margin-top: 32px;
`;

const AddressLabel = styled('span')`
`;

const AddressDisplayWrapper = styled('div')`
  padding-top: 8px;
  display: flex;
`;

const BallotAddressText = styled('p')`
  font-weight: 600;
  margin-bottom: 30px;
  border-right: solid 1px;
  padding-right: 8px;
`;

const EditAddressButton = styled('div')`
  cursor: pointer;
`;

const EditText = styled('span')`
  white-space: nowrap;
  color: var(--link-color);
  font-size: 20px;
  margin-left: 4px;
`;

const PrivacyAndActionsWrapper = styled('div')`
`;

const CurrentBallotText = styled('span')`
  color: #555;
  font-style: italic;
`;

const RemoveAddressButton = styled('div')`
  margin-top: 24px;
  display: flex;
  cursor: pointer;
`;

const RemoveAddressText = styled('span')`
  color: #555;
  margin-left: 4px;
`;

const AddressEntrySection = styled('div')`
`;

const AddressEntryTopSection = styled('div')`
  margin-top: 32px;
`;

const AddressEntryInstruction = styled('div')`
`;

const DataSettingText = styled('div')`
  color: #999;
  font-style: italic;
  margin-bottom: 30px;
`;

const CurrentBallotLabel = styled('span')`
`;

const CurrentBallotLocationWrapper = styled('p')`
  padding-top: 8px;
  margin-bottom: 32px;
`;

const BoldText = styled('span')`
  font-weight: 600;
`;

const ApproximateLocationText = styled('span')`
  color: #999;
`;

const IntroductionHeading = styled('h3')`
  font-size: 20px;
  display: flex;
  color: #555;
`;

const SubHeadingText = styled('span')`
  color: #999;
`;

const CurrentBallotLabelBottom = styled('span')`
`;

const CurrentBallotLocationWrapperBottom = styled('p')`
  padding-top: 8px;
  margin-bottom: 32px;
`;

const BoldTextBottom = styled('span')`
  font-weight: 600;
`;

const ApproximateLocationTextBottom = styled('span')`
  color: #999;
`;
