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

const delayBeforeApiUpdateCall = 1200;
const delayBeforeRemovingSavedStatus = 4000;

class SettingsWidgetOrganizationWebsite extends Component {
  constructor (props) {
    super(props);
    this.state = {
      isOrganization: false,
      linkedOrganizationWeVoteId: '',
      organizationWebsiteSavedStatus: '',
      organizationWebsite: '',
    };

    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.updateOrganizationWebsite = this.updateOrganizationWebsite.bind(this);
  }

  // eslint-disable-next-line camelcase,react/sort-comp
  UNSAFE_componentWillMount () {
    prepareForCordovaKeyboard('SettingsWidgetOrganizationWebsite');
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
    clearTimeout(this.timer);
    restoreStylesAfterCordovaKeyboard('SettingsWidgetOrganizationWebsite');
  }

  handleKeyPress () {
    clearTimeout(this.timer);
    if (this.props.voterHasMadeChangesFunction) {
      this.props.voterHasMadeChangesFunction();
    }
    this.timer = setTimeout(() => {
      OrganizationActions.organizationWebsiteSave(this.state.linkedOrganizationWeVoteId, this.state.organizationWebsite);
      this.setState({ organizationWebsiteSavedStatus: 'Saved' });
    }, delayBeforeApiUpdateCall);
  }

  onOrganizationStoreChange () {
    const organization = OrganizationStore.getOrganizationByWeVoteId(this.state.linkedOrganizationWeVoteId);
    if (organization && organization.organization_we_vote_id) {
      this.setState({
        organizationWebsite: organization.organization_website,
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
              organizationWebsite: organization.organization_website,
              isOrganization: isSpeakerTypeOrganization(organization.organization_type),
            });
          }
        }
      }
    }
  }

  updateOrganizationWebsite (event) {
    if (event.target.name === 'organizationWebsite') {
      this.setState({
        organizationWebsite: event.target.value,
        organizationWebsiteSavedStatus: 'Saving website...',
      });
    }

    // After some time, clear saved message
    clearTimeout(this.clearStatusTimer);
    this.clearStatusTimer = setTimeout(() => {
      this.setState({ organizationWebsiteSavedStatus: '' });
    }, delayBeforeRemovingSavedStatus);
  }

  render () {
    renderLog('SettingsWidgetOrganizationWebsite');  // Set LOG_RENDER_EVENTS to log all renders
    if (!this.state.voter) {
      return LoadingWheel;
    }

    const { classes, externalUniqueId } = this.props;
    const { isOrganization, organizationWebsite, organizationWebsiteSavedStatus } = this.state;

    return (
      <div className="">
        <form onSubmit={(e) => { e.preventDefault(); }}>
          <Row>
            <ColumnFullWidth>
              <FormControl classes={{ root: classes.formControl }}>
                <TextField
                  id={`organizationWebsiteTextArea-${externalUniqueId}`}
                  label={ isOrganization ? 'Organization Website' : 'Your Website'}
                  name="organizationWebsite"
                  margin="dense"
                  variant="outlined"
                  placeholder={isOrganization ? 'Type Organization\'s Website, www...' : 'Type Your Website Address, www...'}
                  value={organizationWebsite}
                  onKeyDown={this.handleKeyPress}
                  onChange={this.updateOrganizationWebsite}
                />
              </FormControl>
            </ColumnFullWidth>
          </Row>
        </form>
        <div className="u-gray-mid">{organizationWebsiteSavedStatus}</div>
      </div>
    );
  }
}
SettingsWidgetOrganizationWebsite.propTypes = {
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

const ColumnFullWidth = styled('div')`
  padding: 8px 12px;
  width: 100%;
`;

const Label = styled('label')`
  margin-bottom: 4px;
  display: block;
`;

export default withStyles(styles)(SettingsWidgetOrganizationWebsite);
