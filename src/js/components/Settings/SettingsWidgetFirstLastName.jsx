import { Button, FormControl, TextField } from '@mui/material';
import styled from 'styled-components';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import FriendActions from '../../actions/FriendActions';
import OrganizationActions from '../../actions/OrganizationActions';
import VoterActions from '../../actions/VoterActions';
import LoadingWheel from '../../common/components/Widgets/LoadingWheel';
import apiCalming from '../../common/utils/apiCalming';
import { prepareForCordovaKeyboard, restoreStylesAfterCordovaKeyboard } from '../../common/utils/cordovaUtils';
import { isCordova, isWebApp } from '../../common/utils/isCordovaOrWebApp';
import { renderLog } from '../../common/utils/logging';
import OrganizationStore from '../../stores/OrganizationStore';
import VoterStore from '../../stores/VoterStore';
import { isSpeakerTypeOrganization } from '../../utils/organization-functions';

const delayBeforeApiUpdateCall = 2000;
const delayBeforeRemovingSavedStatus = 4000;

class SettingsWidgetFirstLastName extends Component {
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
      if (this.clearStatusTimer) clearTimeout(this.clearStatusTimer);
      if (this.organizationNameTimer) clearTimeout(this.organizationNameTimer);
      if (this.voterNameTimer) clearTimeout(this.voterNameTimer);
    }
    if (apiCalming('friendInvitationsWaitingForVerification')) {
      // console.log('SettingsWidgetFirstAndLastName friendInvitationsWaitingForVerification');
      FriendActions.friendInvitationsWaitingForVerification();
    }
  }

  handleKeyPressOrganizationName () {
    if (isWebApp()) {
      if (this.organizationNameTimer) clearTimeout(this.organizationNameTimer);
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
      if (this.voterNameTimer) clearTimeout(this.voterNameTimer);
    }
    if (this.props.voterHasMadeChangesFunction) {
      this.props.voterHasMadeChangesFunction();
    }

    if (isWebApp()) {
      if (this.voterNameTimer) clearTimeout(this.voterNameTimer);
      this.voterNameTimer = setTimeout(() => {
        VoterActions.voterNameSave(this.state.firstName, this.state.lastName);
        this.setState({ voterNameSavedStatus: 'Saved' });
      }, delayBeforeApiUpdateCall);
    }
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

  updateOrganizationName (event) {
    if (event.target.name === 'organizationName') {
      this.setState({
        organizationName: event.target.value,
        organizationNameSavedStatus: isWebApp() ?
          'Saving Display Name...' :
          '',
      });
    }
    if (isWebApp()) {
      // After some time, clear saved message
      if (this.clearStatusTimer) clearTimeout(this.clearStatusTimer);
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
      if (this.clearStatusTimer) clearTimeout(this.clearStatusTimer);
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
                        <ColumnHalfWidth>
                          <FormControl classes={{ root: classes.formControl }}>
                            <StyledTextField
                              type="text"
                              // className={classes.input}
                              label="First Name"
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
                        </ColumnHalfWidth>
                        <ColumnHalfWidth>
                          <FormControl classes={{ root: classes.formControl }}>
                            <StyledTextField
                              type="text"
                              label="Last Name"
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
                        </ColumnHalfWidth>
                      </Row>
                      <div className="u-gray-mid">{voterNameSavedStatus}</div>
                    </span>
                  )}
                  {!this.props.hideNameShownWithEndorsements && (
                    <Row>
                      <ColumnFullWidth>
                        <FormControl classes={{ root: classes.formControl }}>
                          <StyledTextField
                            type="text"
                            label="Name Shown with Endorsements"
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
                      </ColumnFullWidth>
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
SettingsWidgetFirstLastName.propTypes = {
  classes: PropTypes.object,
  displayOnly: PropTypes.bool,
  externalUniqueId: PropTypes.string,
  hideFirstLastName: PropTypes.bool,
  hideNameShownWithEndorsements: PropTypes.bool,
  voterHasMadeChangesFunction: PropTypes.func,
};

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

const Row = styled('div')`
  width: calc(100% + 24px);
  margin-left: -12px;
  display: flex;
  justify-content: space-between;
`;

const ColumnFullWidth = styled('div')`
  padding: 6px 12px;
  width: 100%;
`;

const ColumnHalfWidth = styled('div')`
  padding: 6px 12px;
  width: 50%;
`;

const Label = styled('label')`
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
