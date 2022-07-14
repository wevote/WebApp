import { FormControl, TextField } from '@mui/material';
import styled from 'styled-components';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import OrganizationActions from '../../actions/OrganizationActions';
import LoadingWheel from '../../common/components/Widgets/LoadingWheel';
import { prepareForCordovaKeyboard, restoreStylesAfterCordovaKeyboard } from '../../common/utils/cordovaUtils';
import { renderLog } from '../../common/utils/logging';
import OrganizationStore from '../../stores/OrganizationStore';
import VoterStore from '../../stores/VoterStore';
import { isSpeakerTypeOrganization } from '../../utils/organization-functions';
// import Textarea from 'react-textarea-autosize';

const delayBeforeApiUpdateCall = 1200;
const delayBeforeRemovingSavedStatus = 4000;

class SettingsWidgetOrganizationDescription extends Component {
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

  // eslint-disable-next-line camelcase,react/sort-comp
  UNSAFE_componentWillMount () {
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
    if (this.clearStatusTimer) clearTimeout(this.clearStatusTimer);
    if (this.timer) clearTimeout(this.timer);
    restoreStylesAfterCordovaKeyboard('SettingsWidgetOrganizationDescription');
  }

  handleKeyPress () {
    if (this.timer) clearTimeout(this.timer);
    if (this.props.voterHasMadeChangesFunction) {
      this.props.voterHasMadeChangesFunction();
    }
    this.timer = setTimeout(() => {
      OrganizationActions.organizationDescriptionSave(this.state.linkedOrganizationWeVoteId, this.state.organizationDescription);
      this.setState({ organizationDescriptionSavedStatus: 'Saved' });
    }, delayBeforeApiUpdateCall);
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

  updateOrganizationDescription (event) {
    if (event.target.name === 'organizationDescription') {
      this.setState({
        organizationDescription: event.target.value,
        organizationDescriptionSavedStatus: 'Saving description...',
      });
    }
    // After some time, clear saved message
    if (this.clearStatusTimer) clearTimeout(this.clearStatusTimer);
    this.clearStatusTimer = setTimeout(() => {
      this.setState({ organizationDescriptionSavedStatus: '' });
    }, delayBeforeRemovingSavedStatus);
  }

  render () {
    renderLog('SettingsWidgetOrganizationDescription');  // Set LOG_RENDER_EVENTS to log all renders
    if (!this.state.voter) {
      return LoadingWheel;
    }

    const { classes, externalUniqueId } = this.props;
    const { isOrganization, organizationDescription, organizationDescriptionSavedStatus } = this.state;

    return (
      <div className="">
        <form onSubmit={(e) => { e.preventDefault(); }}>
          <Row>
            <Column>
              <FormControl classes={{ root: classes.formControl }}>
                <TextField
                  id={`organizationDescriptionTextArea-${externalUniqueId}`}
                  label={isOrganization ? 'Description Shown with Endorsements' : 'Description Shown with Endorsements'}
                  name="organizationDescription"
                  rows={4}
                  multiline
                  fullWidth
                  margin="dense"
                  variant="outlined"
                  placeholder={isOrganization ? 'Type Organization Description...' : 'Type Description of Yourself...'}
                  value={organizationDescription}
                  onKeyDown={this.handleKeyPress}
                  onChange={this.updateOrganizationDescription}
                />
              </FormControl>
            </Column>
          </Row>
        </form>
        <div className="u-gray-mid">{organizationDescriptionSavedStatus}</div>
      </div>
    );
  }
}
SettingsWidgetOrganizationDescription.propTypes = {
  classes: PropTypes.object,
  externalUniqueId: PropTypes.string,
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

const Column = styled('div')`
  padding: 8px 12px;
  width: 100%;
`;

export default withStyles(styles)(SettingsWidgetOrganizationDescription);

