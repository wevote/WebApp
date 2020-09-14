import React, { Component } from 'react';
import Alert from 'react-bootstrap/Alert';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import { isSpeakerTypeOrganization } from '../../utils/organization-functions';
import { renderLog } from '../../utils/logging';
import { stringContains } from '../../utils/textFormat';
import FriendActions from '../../actions/FriendActions';
import FriendStore from '../../stores/FriendStore';
import OrganizationStore from '../../stores/OrganizationStore';
import SettingsWidgetFirstLastName from '../Settings/SettingsWidgetFirstLastName';
import VoterStore from '../../stores/VoterStore';

class FirstAndLastNameRequiredAlert extends Component {
  constructor (props) {
    super(props);
    this.state = {
      displayThisComponent: false,
      friendInvitationsWaitingForVerification: [],
      // friendInvitationsWaitingForVerificationCount: 0,
      isOrganization: false,
      organizationName: '',
      organizationNameExists: false,
      organizationNameRelevantAndMissing: false,
      voterDisplayName: '',
      voterDisplayNameExists: false,
      voterNameRelevantAndMissing: false,
    };
  }

  componentDidMount () {
    this.friendStoreListener = FriendStore.addListener(this.onFriendStoreChange.bind(this));
    this.organizationStoreListener = OrganizationStore.addListener(this.onOrganizationStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    FriendActions.friendInvitationsWaitingForVerification();
    const voter = VoterStore.getVoter();
    const linkedOrganizationWeVoteId = voter.linked_organization_we_vote_id;
    const voterDisplayName = VoterStore.getFirstPlusLastName();
    const voterDisplayNameExists = voterDisplayName && !stringContains('Voter-', voterDisplayName);
    this.setState({
      linkedOrganizationWeVoteId,
      voterDisplayName,
      voterDisplayNameExists,
    });
    let isOrganization = false;
    let organizationName = '';
    let organizationNameExists = false;
    const organization = OrganizationStore.getOrganizationByWeVoteId(linkedOrganizationWeVoteId);
    if (organization && organization.organization_type) {
      organizationName = organization.organization_name;
      isOrganization = isSpeakerTypeOrganization(organization.organization_type);
      organizationNameExists = organizationName && !stringContains('Voter-', organizationName);
    }
    if (isOrganization) {
      this.setState({
        displayThisComponent: !organizationNameExists,
        organizationNameRelevantAndMissing: !organizationNameExists,
        voterNameRelevantAndMissing: false,
      });
    } else {
      this.setState({
        displayThisComponent: !voterDisplayNameExists,
        organizationNameRelevantAndMissing: false,
        voterNameRelevantAndMissing: !voterDisplayNameExists,
      });
    }
    this.setState({
      isOrganization,
      organizationName,
      organizationNameExists,
    });
  }

  // shouldComponentUpdate (nextProps, nextState) {
  //   // This lifecycle method tells the component to NOT render if not needed
  //   if (this.state.displayThisComponent !== nextState.displayThisComponent) {
  //     return true;
  //   }
  //   if (this.state.friendInvitationsWaitingForVerificationCount !== nextState.friendInvitationsWaitingForVerificationCount) {
  //     return true;
  //   }
  //   if (this.state.isOrganization !== nextState.isOrganization) {
  //     return true;
  //   }
  //   if (this.state.organizationName !== nextState.organizationName) {
  //     return true;
  //   }
  //   if (this.state.organizationNameRelevantAndMissing !== nextState.organizationNameRelevantAndMissing) {
  //     return true;
  //   }
  //   if (this.state.voterDisplayName !== nextState.voterDisplayName) {
  //     return true;
  //   }
  //   if (this.state.voterNameRelevantAndMissing !== nextState.voterNameRelevantAndMissing) {
  //     return true;
  //   }
  //   return false;
  // }

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
    // let friendInvitationsWaitingForVerificationCount = 0;
    // if (friendInvitationsWaitingForVerification) {
    //   friendInvitationsWaitingForVerificationCount = friendInvitationsWaitingForVerification.length;
    // }
    this.setState({
      friendInvitationsWaitingForVerification,
      // friendInvitationsWaitingForVerificationCount,
    });
  }

  onOrganizationStoreChange () {
    let isOrganization = false;
    let organizationName = '';
    let organizationNameExists = false;
    const { voterDisplayNameExists } = this.state;
    const organization = OrganizationStore.getOrganizationByWeVoteId(this.state.linkedOrganizationWeVoteId);
    if (organization && organization.organization_type) {
      organizationName = organization.organization_name;
      isOrganization = isSpeakerTypeOrganization(organization.organization_type);
      organizationNameExists = organizationName && !stringContains('Voter-', organizationName);
    }
    let organizationNameRelevantAndMissing = true;
    let voterNameRelevantAndMissing = true;
    // onOrganizationStoreChange will only make component appear -- never disappear
    if (isOrganization) {
      if (!organizationNameExists) {
        this.setState({
          displayThisComponent: true,
        });
      }
      organizationNameRelevantAndMissing = !organizationNameExists;
      voterNameRelevantAndMissing = false;
      this.setState({
        organizationNameRelevantAndMissing,
        voterNameRelevantAndMissing,
      });
    } else {
      if (!voterDisplayNameExists) {
        this.setState({
          displayThisComponent: true,
        });
      }
      organizationNameRelevantAndMissing = false;
      voterNameRelevantAndMissing = !voterDisplayNameExists;
      this.setState({
        organizationNameRelevantAndMissing,
        voterNameRelevantAndMissing,
      });
    }
    this.setState({
      isOrganization,
      organizationName,
      organizationNameExists,
    });
    // Send an API tickler (with a delay) to send cached invitations
    if (!voterNameRelevantAndMissing && !organizationNameRelevantAndMissing) this.sendInvitationsWaitingForVerification();
  }

  onVoterStoreChange () {
    // console.log('FirstAndLastNameRequiredAlert.jsx onVoterStoreChange, voter: ', VoterStore.getVoter());
    const { isOrganization, organizationNameExists } = this.state;
    const voterDisplayName = VoterStore.getFirstPlusLastName();
    const voterDisplayNameExists = voterDisplayName && !stringContains('Voter-', voterDisplayName);
    let organizationNameRelevantAndMissing = true;
    let voterNameRelevantAndMissing = true;
    // onVoterStoreChange will only make component appear -- never disappear
    if (isOrganization) {
      if (!organizationNameExists) {
        this.setState({
          displayThisComponent: true,
        });
      }
      organizationNameRelevantAndMissing = !organizationNameExists;
      voterNameRelevantAndMissing = false;
      this.setState({
        organizationNameRelevantAndMissing,
        voterNameRelevantAndMissing,
      });
    } else {
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
    }
    this.setState({
      voterDisplayName,
      voterDisplayNameExists,
    });
    // Send an API tickler (with a delay) to send cached invitations
    if (!voterNameRelevantAndMissing && !organizationNameRelevantAndMissing) this.sendInvitationsWaitingForVerification();
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
                  Please add your name so your friends recognize you.
                  {' '}
                  {friendInvitationsWaitingForVerification && friendInvitationsWaitingForVerification.length > 0 && (
                    <span>
                      Once you have saved your name, the following invitations will be sent:
                      <ul>
                        {friendInvitationsWaitingForVerification.map(friend => (
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
