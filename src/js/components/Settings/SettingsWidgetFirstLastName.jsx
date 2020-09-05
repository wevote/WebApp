import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, FormControl, TextField } from '@material-ui/core';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import {
  isCordova,
  isWebApp,
  prepareForCordovaKeyboard,
  restoreStylesAfterCordovaKeyboard,
} from '../../utils/cordovaUtils';
import { isSpeakerTypeOrganization } from '../../utils/organization-functions';
import LoadingWheel from '../LoadingWheel';
import FriendActions from '../../actions/FriendActions';
import OrganizationActions from '../../actions/OrganizationActions';
import OrganizationStore from '../../stores/OrganizationStore';
import VoterActions from '../../actions/VoterActions';
import VoterStore from '../../stores/VoterStore';
import { renderLog } from '../../utils/logging';

const delayBeforeApiUpdateCall = 2000;
const delayBeforeRemovingSavedStatus = 4000;

class SettingsWidgetFirstLastName extends Component {
  static propTypes = {
    classes: PropTypes.object,
    displayOnly: PropTypes.bool,
    externalUniqueId: PropTypes.string,
    hideFirstLastName: PropTypes.bool,
    hideNameShownWithEndorsements: PropTypes.bool,
    voterHasMadeChangesFunction: PropTypes.func,
  };

  constructor (props) {
    super(props);
    this.state = {
      firstName: '',
      displayOnly: false,
      isOrganization: false,
      initialNameLoaded: false,
      lastName: '',
      linkedOrganizationWeVoteId: '',
      organizationName: '',
      organizationNameSavedStatus: '',
      voterIsSignedIn: false,
      voterNameSavedStatus: '',
    };

    this.handleKeyPressOrganizationName = this.handleKeyPressOrganizationName.bind(
      this,
    );
    this.handleKeyPressVoterName = this.handleKeyPressVoterName.bind(this);
    this.updateOrganizationName = this.updateOrganizationName.bind(this);
    this.updateVoterName = this.updateVoterName.bind(this);
    this.saveNameCordova = this.saveNameCordova.bind(this);
  }

  componentDidMount () {
    this.onVoterStoreChange();
    this.organizationStoreListener = OrganizationStore.addListener(
      this.onOrganizationStoreChange.bind(this),
    );
    this.voterStoreListener = VoterStore.addListener(
      this.onVoterStoreChange.bind(this),
    );
    const displayOnly = this.props.displayOnly || false;
    this.setState({ displayOnly });
    if (!displayOnly) {
      prepareForCordovaKeyboard('SettingsWidgetFirstLastName');
    }
  }

  componentWillUnmount () {
    this.organizationStoreListener.remove();
    this.voterStoreListener.remove();
    if (isWebApp()) {
      if (this.clearStatusTimer) {
        clearTimeout(this.clearStatusTimer);
        this.clearStatusTimer = null;
      }
      if (this.organizationNameTimer) {
        clearTimeout(this.organizationNameTimer);
        this.organizationNameTimer = null;
      }
      if (this.voterNameTimer) {
        clearTimeout(this.voterNameTimer);
        this.voterNameTimer = null;
      }
    }
    FriendActions.friendInvitationsWaitingForVerification();
  }

  onOrganizationStoreChange () {
    const organization = OrganizationStore.getOrganizationByWeVoteId(
      this.state.linkedOrganizationWeVoteId,
    );
    if (organization && organization.organization_type) {
      // While typing 'Tom Smith' in the org field, without the following line, when you get to 'Tom ', autosaving trims and overwrites it to 'Tom' before you can type the 'S'
      // console.log('onOrganizationStoreChange: \'' + organization.organization_name + "' '" + this.state.organizationName + "'");
      if (
        organization.organization_name.trim() !==
        this.state.organizationName.trim()
      ) {
        this.setState({
          isOrganization: isSpeakerTypeOrganization(
            organization.organization_type,
          ),
          organizationName: organization.organization_name,
        });
      }
    }
  }

  onVoterStoreChange () {
    if (VoterStore.isVoterFound()) {
      const voter = VoterStore.getVoter();
      const voterIsSignedIn = voter.is_signed_in;
      const { voterIsSignedIn: priorVoterIsSignedIn } = this.state;
      this.setState({
        voter,
        voterIsSignedIn,
      });
      if (
        !this.state.initialNameLoaded ||
        priorVoterIsSignedIn !== voterIsSignedIn
      ) {
        this.setState({
          firstName: VoterStore.getFirstName(),
          lastName: VoterStore.getLastName(),
          initialNameLoaded: true,
        });
      }
      if (voter && voter.linked_organization_we_vote_id) {
        this.setState({
          linkedOrganizationWeVoteId: voter.linked_organization_we_vote_id,
        });
        if (
          voter.linked_organization_we_vote_id !==
          this.state.linkedOrganizationWeVoteId
        ) {
          const organization = OrganizationStore.getOrganizationByWeVoteId(
            voter.linked_organization_we_vote_id,
          );
          if (organization && organization.organization_type) {
            // While typing 'Tom Smith' in the org field, without the following line, when you get to 'Tom ', autosaving trims and overwrites it to 'Tom' before you can type the 'S'
            // console.log('onVoterStoreChange: \'' + organization.organization_name + "' '" + this.state.organizationName + "'");
            if (
              organization.organization_name.trim() !==
              this.state.organizationName.trim()
            ) {
              this.setState({
                isOrganization: isSpeakerTypeOrganization(
                  organization.organization_type,
                ),
                organizationName: organization.organization_name,
              });
            }
          }
        }
      }
    }
  }

  handleKeyPressOrganizationName () {
    if (isWebApp()) {
      clearTimeout(this.organizationNameTimer);
    }
    if (this.props.voterHasMadeChangesFunction) {
      this.props.voterHasMadeChangesFunction();
    }
    if (isWebApp()) {
      this.organizationNameTimer = setTimeout(() => {
        OrganizationActions.organizationNameSave(
          this.state.linkedOrganizationWeVoteId,
          this.state.organizationName,
        );
        this.setState({ organizationNameSavedStatus: 'Saved' });
      }, delayBeforeApiUpdateCall);
    }
  }

  handleKeyPressVoterName () {
    if (isWebApp()) {
      clearTimeout(this.voterNameTimer);
    }
    if (this.props.voterHasMadeChangesFunction) {
      this.props.voterHasMadeChangesFunction();
    }

    if (isWebApp()) {
      this.voterNameTimer = setTimeout(() => {
        VoterActions.voterNameSave(this.state.firstName, this.state.lastName);
        this.setState({ voterNameSavedStatus: 'Saved' });
      }, delayBeforeApiUpdateCall);
    }
  }

  updateOrganizationName (event) {
    if (event.target.name === 'organizationName') {
      this.setState({
        organizationName: event.target.value,
        organizationNameSavedStatus: isWebApp() ?
          'Saving Organization Name...' :
          '',
      });
    }
    if (isWebApp()) {
      // After some time, clear saved message
      clearTimeout(this.clearStatusTimer);
      this.clearStatusTimer = setTimeout(() => {
        this.setState({ organizationNameSavedStatus: '' });
      }, delayBeforeRemovingSavedStatus);
    }
  }

  saveNameCordova () {
    restoreStylesAfterCordovaKeyboard('SettingsWidgetFirstLastName');
    VoterActions.voterNameSave(this.state.firstName, this.state.lastName);
    if (
      !this.props.hideNameShownWithEndorsements &&
      this.state.organizationName.length
    ) {
      OrganizationActions.organizationNameSave(
        this.state.linkedOrganizationWeVoteId,
        this.state.organizationName,
      );
    }
    this.setState({
      voterNameSavedStatus: 'Saved',
      displayOnly: true,
    });
  }

  updateVoterName (event) {
    if (event.target.name === 'firstName') {
      this.setState({
        firstName: event.target.value,
        voterNameSavedStatus: isWebApp() ? 'Saving First Name...' : '',
      });
    } else if (event.target.name === 'lastName') {
      this.setState({
        lastName: event.target.value,
        voterNameSavedStatus: isWebApp() ? 'Saving Last Name...' : '',
      });
    }
    if (isWebApp()) {
      // After some time, clear saved message
      clearTimeout(this.clearStatusTimer);
      this.clearStatusTimer = setTimeout(() => {
        this.setState({ voterNameSavedStatus: '' });
      }, delayBeforeRemovingSavedStatus);
    }
  }

  render () {
    renderLog('SettingsWidgetFirstLastName'); // Set LOG_RENDER_EVENTS to log all renders
    if (!this.state.voter) {
      return LoadingWheel;
    }

    const {
      displayOnly,
      firstName,
      isOrganization,
      lastName,
      organizationName,
      organizationNameSavedStatus,
      voterNameSavedStatus,
    } = this.state;
    const { classes, externalUniqueId } = this.props;

    return (
      <div className="">
        <span>
          {isOrganization ? (
            <span>
              {displayOnly ? (
                <div>
                  <div>{organizationName}</div>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                  }}
                >
                  <label htmlFor="organization-name">
                    Organization Name as Shown on Your Voter Guides
                    <input
                      type="text"
                      autoComplete="organization"
                      className="form-control"
                      id={`organization-name-${externalUniqueId}`}
                      name="organizationName"
                      placeholder="How would you like your organization name displayed publicly?"
                      onKeyDown={this.handleKeyPressOrganizationName}
                      onChange={this.updateOrganizationName}
                      value={organizationName}
                    />
                  </label>
                  <div className="u-gray-mid">
                    {organizationNameSavedStatus}
                  </div>
                </form>
              )}
            </span>
          ) : (
            <span>
              {displayOnly ? (
                <div>
                  <div>
                    {firstName}
                    {' '}
                    {lastName}
                  </div>
                  {!this.props.hideNameShownWithEndorsements && (
                    <div>{organizationName}</div>
                  )}
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                  }}
                >
                  {!this.props.hideFirstLastName && (
                    <span>
                      <Row>
                        <Column>
                          <FormControl classes={{ root: classes.formControl }}>
                            <Label>First Name</Label>
                            <StyledTextField
                              type="text"
                              // className={classes.input}
                              margin="dense"
                              variant="outlined"
                              autoComplete="given-name"
                              id={`first-name-${externalUniqueId}`}
                              name="firstName"
                              placeholder="First Name"
                              onKeyDown={this.handleKeyPressVoterName}
                              onChange={this.updateVoterName}
                              value={firstName}
                            />
                          </FormControl>
                        </Column>
                        <Column>
                          <FormControl classes={{ root: classes.formControl }}>
                            <Label>Last Name</Label>
                            <StyledTextField
                              type="text"
                              margin="dense"
                              variant="outlined"
                              autoComplete="family-name"
                              id={`last-name-${externalUniqueId}`}
                              name="lastName"
                              placeholder="Last Name"
                              onKeyDown={this.handleKeyPressVoterName}
                              onChange={this.updateVoterName}
                              value={lastName}
                            />
                          </FormControl>
                        </Column>
                      </Row>
                      <div className="u-gray-mid">{voterNameSavedStatus}</div>
                    </span>
                  )}
                  {!this.props.hideNameShownWithEndorsements && (
                    <Row>
                      <Column>
                        <FormControl classes={{ root: classes.formControl }}>
                          <Label htmlFor="organization-name">
                            Name Shown with Endorsements
                          </Label>
                          <StyledTextField
                            type="text"
                            margin="dense"
                            autoComplete="organization"
                            variant="outlined"
                            id={`organization-name-${externalUniqueId}`}
                            name="organizationName"
                            placeholder="How would you like your name displayed publicly?"
                            onKeyDown={this.handleKeyPressOrganizationName}
                            onChange={this.updateOrganizationName}
                            value={organizationName}
                          />
                        </FormControl>
                      </Column>
                      <Column />
                      <div className="u-gray-mid">
                        {organizationNameSavedStatus}
                      </div>
                    </Row>
                  )}
                  {isCordova() && (
                    <Button
                      color="primary"
                      id={`firstLastSaveButton-${externalUniqueId}`}
                      onClick={this.saveNameCordova}
                      variant="contained"
                      fullWidth
                    >
                      Save
                    </Button>
                  )}
                </form>
              )}
            </span>
          )}
        </span>
      </div>
    );
  }
}

const styles = () => ({
  formControl: {
    // width: '50%',
    // margin: '12px',
    // marginBottom: '12px',
    width: '100%',
  },
  input: {
    padding: '12px',
  },
});

const Row = styled.div`
  width: calc(100% + 24px);
  margin-left: -12px;
  display: flex;
  justify-content: space-between;
`;

const Column = styled.div`
  padding: 6px 12px;
  width: 50%;
`;

const Label = styled.label`
  margin-bottom: 4px;
  display: block;
`;

const StyledTextField = styled(TextField)`
  * {
    margin: 0 !important;
  }
  margin: 0 !important;
`;

export default withStyles(styles)(SettingsWidgetFirstLastName);
