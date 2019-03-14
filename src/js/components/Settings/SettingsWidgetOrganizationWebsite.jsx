import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { prepareForCordovaKeyboard, restoreStylesAfterCordovaKeyboard } from '../../utils/cordovaUtils';
import { isSpeakerTypeOrganization } from '../../utils/organization-functions';
import LoadingWheel from '../LoadingWheel';
import { renderLog } from '../../utils/logging';
import OrganizationActions from '../../actions/OrganizationActions';
import OrganizationStore from '../../stores/OrganizationStore';
import VoterStore from '../../stores/VoterStore';

const delayBeforeApiUpdateCall = 1200;
const delayBeforeRemovingSavedStatus = 4000;

export default class SettingsWidgetOrganizationWebsite extends Component {
  static propTypes = {
    voterHasMadeChangesFunction: PropTypes.func,
  };

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

  componentWillMount () {
    prepareForCordovaKeyboard(__filename);
  }

  componentDidMount () {
    this.onVoterStoreChange();
    this.organizationStoreListener = OrganizationStore.addListener(this.onOrganizationStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
  }

  componentWillUnmount () {
    this.organizationStoreListener.remove();
    this.voterStoreListener.remove();
    this.timer = null;
    this.clearStatusTimer = null;
    restoreStylesAfterCordovaKeyboard(__filename);
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
    renderLog(__filename);
    if (!this.state.voter) {
      return LoadingWheel;
    }

    return (
      <div className="">
        <form onSubmit={(e) => { e.preventDefault(); }}>
          <span className="pull-right u-gray-mid">{this.state.organizationWebsiteSavedStatus}</span>
          <label htmlFor="organizationWebsiteTextArea">{ this.state.isOrganization ? 'Organization Website' : 'Your Website'}</label>
          <input
            id="organizationWebsiteTextArea"
            name="organizationWebsite"
            className="form-control"
            placeholder={this.state.isOrganization ? 'Organization Website' : 'Your Website'}
            value={this.state.organizationWebsite}
            onKeyDown={this.handleKeyPress}
            onChange={this.updateOrganizationWebsite}
          />
        </form>
      </div>
    );
  }
}
