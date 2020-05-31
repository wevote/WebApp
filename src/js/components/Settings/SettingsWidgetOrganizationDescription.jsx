import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { TextField, FormControl, withStyles } from '@material-ui/core';
import { prepareForCordovaKeyboard, restoreStylesAfterCordovaKeyboard } from '../../utils/cordovaUtils';
import { isSpeakerTypeOrganization } from '../../utils/organization-functions';
import LoadingWheel from '../LoadingWheel';
import { renderLog } from '../../utils/logging';
import OrganizationActions from '../../actions/OrganizationActions';
import OrganizationStore from '../../stores/OrganizationStore';
import VoterStore from '../../stores/VoterStore';
// import Textarea from 'react-textarea-autosize';

const delayBeforeApiUpdateCall = 1200;
const delayBeforeRemovingSavedStatus = 4000;

class SettingsWidgetOrganizationDescription extends Component {
  static propTypes = {
    classes: PropTypes.object,
    voterHasMadeChangesFunction: PropTypes.func,
  };

  constructor (props) {
    super(props);
    this.state = {
      isOrganization: false,
      linkedOrganizationWeVoteId: '',
      organizationDescriptionSavedStatus: '',
      organizationDescription: '',
    };

    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.updateOrganizationDescription = this.updateOrganizationDescription.bind(this);
  }

  componentWillMount () {
    prepareForCordovaKeyboard('SettingsWidgetOrganizationDescription');
  }

  componentDidMount () {
    this.onVoterStoreChange();
    this.organizationStoreListener = OrganizationStore.addListener(this.onOrganizationStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
  }

  componentWillUnmount () {
    this.organizationStoreListener.remove();
    this.voterStoreListener.remove();
    if (this.clearStatusTimer) {
      clearTimeout(this.clearStatusTimer);
      this.clearStatusTimer = null;
    }
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    restoreStylesAfterCordovaKeyboard('SettingsWidgetOrganizationDescription');
  }

  onOrganizationStoreChange () {
    const organization = OrganizationStore.getOrganizationByWeVoteId(this.state.linkedOrganizationWeVoteId);
    if (organization && organization.organization_we_vote_id) {
      this.setState({
        organizationDescription: organization.organization_description,
        isOrganization: isSpeakerTypeOrganization(organization.organization_type),
      });
    }
  }

  onVoterStoreChange () {
    if (VoterStore.isVoterFound()) {
      const voter = VoterStore.getVoter();
      this.setState({
        voter,
      });
      if (voter && voter.linked_organization_we_vote_id) {
        this.setState({
          linkedOrganizationWeVoteId: voter.linked_organization_we_vote_id,
        });
        if (voter.linked_organization_we_vote_id !== this.state.linkedOrganizationWeVoteId) {
          const organization = OrganizationStore.getOrganizationByWeVoteId(voter.linked_organization_we_vote_id);
          if (organization && organization.organization_we_vote_id) {
            this.setState({
              organizationDescription: organization.organization_description,
              isOrganization: isSpeakerTypeOrganization(organization.organization_type),
            });
          }
        }
      }
    }
  }

  handleKeyPress () {
    clearTimeout(this.timer);
    if (this.props.voterHasMadeChangesFunction) {
      this.props.voterHasMadeChangesFunction();
    }
    this.timer = setTimeout(() => {
      OrganizationActions.organizationDescriptionSave(this.state.linkedOrganizationWeVoteId, this.state.organizationDescription);
      this.setState({ organizationDescriptionSavedStatus: 'Saved' });
    }, delayBeforeApiUpdateCall);
  }

  updateOrganizationDescription (event) {
    if (event.target.name === 'organizationDescription') {
      this.setState({
        organizationDescription: event.target.value,
        organizationDescriptionSavedStatus: 'Saving description...',
      });
    }
    // After some time, clear saved message
    clearTimeout(this.clearStatusTimer);
    this.clearStatusTimer = setTimeout(() => {
      this.setState({ organizationDescriptionSavedStatus: '' });
    }, delayBeforeRemovingSavedStatus);
  }

  render () {
    renderLog('SettingsWidgetOrganizationDescription');  // Set LOG_RENDER_EVENTS to log all renders
    if (!this.state.voter) {
      return LoadingWheel;
    }

    const { classes } = this.props;

    return (
      <div className="">
        <form onSubmit={(e) => { e.preventDefault(); }}>
          <Row>
            <Column>
              <FormControl classes={{ root: classes.formControl }}>
                <Label htmlFor="organizationDescriptionTextArea">{ this.state.isOrganization ? 'Description Shown with Endorsements' : 'Description Shown with Endorsements'}</Label>
                <TextField
                  id="organizationDescriptionTextArea"
                  name="organizationDescription"
                  rows={4}
                  multiline
                  fullWidth
                  margin="dense"
                  variant="outlined"
                  placeholder={this.state.isOrganization ? 'Type Organization Description...' : 'Type Description of Yourself...'}
                  value={this.state.organizationDescription}
                  onKeyDown={this.handleKeyPress}
                  onChange={this.updateOrganizationDescription}
                />
              </FormControl>
            </Column>
          </Row>
        </form>
        <div className="u-gray-mid">{this.state.organizationDescriptionSavedStatus}</div>
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
  padding: 8px 12px;
  width: 100%;
`;

const Label = styled.label`
  margin-bottom: 4px;
  display: block;
`;

export default withStyles(styles)(SettingsWidgetOrganizationDescription);

