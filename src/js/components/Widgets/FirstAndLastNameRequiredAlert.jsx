import { withStyles } from '@material-ui/core/styles';
import React, { Component } from 'react';
import Alert from 'react-bootstrap/Alert';
import styled from 'styled-components';
import FriendActions from '../../actions/FriendActions';
import FriendStore from '../../stores/FriendStore';
import OrganizationStore from '../../stores/OrganizationStore';
import VoterStore from '../../stores/VoterStore';
import apiCalming from '../../utils/apiCalming';
import { renderLog } from '../../utils/logging';
import { isSpeakerTypeOrganization } from '../../utils/organization-functions';
import { stringContains } from '../../utils/textFormat';
import SettingsWidgetFirstLastName from '../Settings/SettingsWidgetFirstLastName';

class FirstAndLastNameRequiredAlert extends Component {
  constructor (props) {
    super(props);
    this.state = {
      displayThisComponent: false,
      friendInvitationsWaitingForVerification: [],
      // friendInvitationsWaitingForVerificationCount: 0,
      isOrganization: false,
      organizationName: '',
      organizationNameRelevantAndMissing: false,
      voterDisplayName: '',
      voterNameRelevantAndMissing: false,
    };
  }

  componentDidMount () {
    this.onVoterStoreChange();
    this.onOrganizationStoreChange();
    this.friendStoreListener = FriendStore.addListener(this.onFriendStoreChange.bind(this));
    this.organizationStoreListener = OrganizationStore.addListener(this.onOrganizationStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    if (apiCalming('friendInvitationsWaitingForVerification')) {
      console.log('----------------- FirstAndLastNameRequiredAlert friendInvitationsWaitingForVerification');
      FriendActions.friendInvitationsWaitingForVerification();
    }
  }

  componentWillUnmount () {
    if (this.timer > 0) {
      FriendActions.friendInvitationByEmailSend();
    }
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.friendStoreListener.remove();
    this.organizationStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onFriendStoreChange () {
    // console.log('FirstAndLastNameRequiredAlert.jsx onFriendStoreChange');
    const friendInvitationsWaitingForVerification = FriendStore.friendInvitationsWaitingForVerification() || [];
    this.setState({
      friendInvitationsWaitingForVerification,
    });
  }

  onOrganizationStoreChange () {
    const voter = VoterStore.getVoter();
    const linkedOrganizationWeVoteId = voter.linked_organization_we_vote_id;
    let isOrganization = false;
    let organizationName = '';
    let organizationNameExists = false;
    const organization = OrganizationStore.getOrganizationByWeVoteId(linkedOrganizationWeVoteId);
    if (organization && organization.organization_type) {
      organizationName = organization.organization_name;
      isOrganization = isSpeakerTypeOrganization(organization.organization_type);
      organizationNameExists = organizationName && !stringContains('Voter-', organizationName);
    }
    // onOrganizationStoreChange will only make component appear -- never disappear
    if (isOrganization) {
      if (!organizationNameExists) {
        this.setState({
          displayThisComponent: true,
        });
      }
      const organizationNameRelevantAndMissing = !organizationNameExists;
      const voterNameRelevantAndMissing = false;
      this.setState({
        organizationNameRelevantAndMissing,
        voterNameRelevantAndMissing,
      });
      this.setState({
        isOrganization,
        organizationName,
      });
      // Send an API tickler (with a delay) to send cached invitations
      if (!voterNameRelevantAndMissing && !organizationNameRelevantAndMissing) this.sendInvitationsWaitingForVerification();
    }
  }

  onVoterStoreChange () {
    // console.log('FirstAndLastNameRequiredAlert.jsx onVoterStoreChange, voter: ', VoterStore.getVoter());
    const voter = VoterStore.getVoter();
    const linkedOrganizationWeVoteId = voter.linked_organization_we_vote_id;
    const organization = OrganizationStore.getOrganizationByWeVoteId(linkedOrganizationWeVoteId);
    let isSimpleVoter = false;
    if (organization && organization.organization_type) {
      isSimpleVoter = !isSpeakerTypeOrganization(organization.organization_type);
    }
    const voterDisplayName = VoterStore.getFirstPlusLastName();
    const voterDisplayNameExists = voterDisplayName && !stringContains('Voter-', voterDisplayName);
    let organizationNameRelevantAndMissing = true;
    let voterNameRelevantAndMissing = true;
    // onVoterStoreChange will only make component appear -- never disappear
    if (isSimpleVoter) {
      if (!voterDisplayNameExists) {
        this.setState({
          displayThisComponent: true,
        });
      }
      organizationNameRelevantAndMissing = false;
      voterNameRelevantAndMissing = !voterDisplayNameExists;
      this.setState({
        organizationNameRelevantAndMissing: false,
        voterNameRelevantAndMissing: !voterDisplayNameExists,
      });
      this.setState({
        voterDisplayName,
      });
      // Send an API tickler (with a delay) to send cached invitations
      if (!voterNameRelevantAndMissing && !organizationNameRelevantAndMissing) this.sendInvitationsWaitingForVerification();
    }
  }

  sendInvitationsWaitingForVerification () {
    const delayBeforeApiCall = 10000;
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      FriendActions.friendInvitationByEmailSend();
    }, delayBeforeApiCall);
    // console.log('this.timer:', this.timer);
  }

  render () {
    renderLog('EnterFirstAndLastName');  // Set LOG_RENDER_EVENTS to log all renders
    const {
      displayThisComponent, friendInvitationsWaitingForVerification, isOrganization,
      organizationName,
      organizationNameRelevantAndMissing, voterDisplayName, voterNameRelevantAndMissing,
    } = this.state;
    if (displayThisComponent) {
      return (
        <PrintWrapper id="firstAndLastNameRequiredAlert">
          <ParagraphStyled>
            {(isOrganization && !organizationNameRelevantAndMissing) && (
              <Alert variant="success">
                Success! Invitations will be from
                {' '}
                &apos;
                {organizationName}
                &apos;
                .
              </Alert>
            )}
            {(!isOrganization && !voterNameRelevantAndMissing) && (
              <Alert variant="success">
                Success! Your name will be shown as
                {' '}
                &apos;
                {voterDisplayName}
                &apos;
                .
              </Alert>
            )}
            {(organizationNameRelevantAndMissing || voterNameRelevantAndMissing) && (
              <ExplanationText>
                <Alert variant="danger">
                  {organizationNameRelevantAndMissing ? (
                    <span>
                      Please add your name so people recognize you.
                      {' '}
                      Your name will only be shown on We Vote.
                    </span>
                  ) : (
                    <span>
                      Please add your name so your friends recognize you.
                      {' '}
                      Your name will only be shown on We Vote.
                    </span>
                  )}
                  {' '}
                  {friendInvitationsWaitingForVerification && friendInvitationsWaitingForVerification.length > 0 && (
                    <span>
                      Once you have saved your name, the following invitations will be sent:
                      <ul>
                        {friendInvitationsWaitingForVerification.map((friend) => (
                          <li key={`invitationWillBeSent-${friend.invitation_sent_to}`}>
                            {friend.invitation_sent_to}
                          </li>
                        ))}
                      </ul>
                    </span>
                  )}
                </Alert>
              </ExplanationText>
            )}
            <SettingsWidgetFirstLastName hideNameShownWithEndorsements />
          </ParagraphStyled>
        </PrintWrapper>
      );
    } else {
      return null;
    }
  }
}

const styles = ({
  iconRoot: {
    fontSize: 36,
    margin: 'auto 10px',
  },
});

const ExplanationText = styled.div`
  margin-bottom: 10px;
`;

const ParagraphStyled = styled.div`
  font-size: 16px;
  font-weight: normal;
  margin: 15px 15px;
  width: 100%;
`;

const PrintWrapper = styled.div`
  background-color: white;
  background-clip: border-box;
  border: 2px solid #999;
  display: flex;
  margin: 0 0 10px 0;
  position: relative;
  width: 100%;
  @media print {
    display: none;
  }
`;

export default withStyles(styles)(FirstAndLastNameRequiredAlert);
