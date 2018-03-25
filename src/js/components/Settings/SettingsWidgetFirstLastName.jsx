import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router";
import { isSpeakerTypeOrganization } from "../../utils/organization-functions";
import LoadingWheel from "../../components/LoadingWheel";
import OrganizationActions from "../../actions/OrganizationActions";
import OrganizationStore from "../../stores/OrganizationStore";
import VoterActions from "../../actions/VoterActions";
import VoterStore from "../../stores/VoterStore";
import { renderLog } from "../../utils/logging";

const delayBeforeApiUpdateCall = 1200;
const delayBeforeRemovingSavedStatus = 4000;


export default class SettingsWidgetFirstLastName extends Component {
  static propTypes = {
    displayOnly: PropTypes.bool,
    hideFirstLastName: PropTypes.bool,
    voterHasMadeChangesFunction: PropTypes.func,
  };

  constructor (props) {
    super(props);
    this.state = {
      firstName: "",
      displayOnly: false,
      isOrganization: false,
      initial_name_loaded: false,
      lastName: "",
      linkedOrganizationWeVoteId: "",
      organizationName: "",
      organizationNameSavedStatus: "",
      voterNameSavedStatus: "",
    };

    this.handleKeyPressOrganizationName = this.handleKeyPressOrganizationName.bind(this);
    this.handleKeyPressVoterName = this.handleKeyPressVoterName.bind(this);
    this.updateOrganizationName = this.updateOrganizationName.bind(this);
    this.updateVoterName = this.updateVoterName.bind(this);
  }

  componentDidMount () {
    this.onVoterStoreChange();
    this.organizationStoreListener = OrganizationStore.addListener(this.onOrganizationStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    this.setState({
      displayOnly: this.props.displayOnly,
    });
  }

  componentWillUnmount () {
    this.organizationStoreListener.remove();
    this.voterStoreListener.remove();
    this.timer = null;
    this.clearStatusTimer = null;
  }

  onOrganizationStoreChange (){
    let organization = OrganizationStore.getOrganizationByWeVoteId(this.state.linkedOrganizationWeVoteId);
    if (organization && organization.organization_type) {
      this.setState({
        isOrganization: isSpeakerTypeOrganization(organization.organization_type),
        organization: organization,
        organizationName: organization.organization_name,
      });
    }
  }

  onVoterStoreChange () {
    if (VoterStore.isVoterFound()) {
      let voter = VoterStore.getVoter();
      this.setState({
        voter: voter
      });
      if (!this.state.initial_name_loaded) {
        this.setState({
          firstName: VoterStore.getFirstName(),
          lastName: VoterStore.getLastName(),
          initial_name_loaded: true,
        });
      }
      if (voter && voter.linked_organization_we_vote_id) {
        this.setState({
          linkedOrganizationWeVoteId: voter.linked_organization_we_vote_id
        });
        if (voter.linked_organization_we_vote_id !== this.state.linkedOrganizationWeVoteId) {
          let organization = OrganizationStore.getOrganizationByWeVoteId(voter.linked_organization_we_vote_id);
          if (organization && organization.organization_type) {
            this.setState({
              isOrganization: isSpeakerTypeOrganization(organization.organization_type),
              organization: organization,
              organizationName: organization.organization_name,
            });
          }
        }
      }
    }
  }

  handleKeyPressOrganizationName () {
    clearTimeout(this.timer);
    if (this.props.voterHasMadeChangesFunction) {
      this.props.voterHasMadeChangesFunction();
    }
    this.timer = setTimeout(() => {
      OrganizationActions.organizationNameSave(this.state.linkedOrganizationWeVoteId, this.state.organizationName);
      this.setState({ organizationNameSavedStatus: "Saved" });
    }, delayBeforeApiUpdateCall);
  }

  handleKeyPressVoterName () {
    clearTimeout(this.timer);
    if (this.props.voterHasMadeChangesFunction) {
      this.props.voterHasMadeChangesFunction();
    }

    this.timer = setTimeout(() => {
      VoterActions.voterNameSave(this.state.firstName, this.state.lastName);
      this.setState({ voterNameSavedStatus: "Saved" });
    }, delayBeforeApiUpdateCall);
  }

  updateOrganizationName (event) {
    if (event.target.name === "organizationName") {
      this.setState({
        organizationName: event.target.value,
        organizationNameSavedStatus: "Saving Organization Name...",
      });
    }
    // After some time, clear saved message
    clearTimeout(this.clearStatusTimer);
    this.clearStatusTimer = setTimeout(() => {
      this.setState({ organizationNameSavedStatus: "" });
    }, delayBeforeRemovingSavedStatus);
  }

  updateVoterName (event) {
    if (event.target.name === "firstName") {
      this.setState({
        firstName: event.target.value,
        voterNameSavedStatus: "Saving First Name...",
      });
    } else if (event.target.name === "lastName") {
      this.setState({
        lastName: event.target.value,
        voterNameSavedStatus: "Saving Last Name...",
      });
    }
    // After some time, clear saved message
    clearTimeout(this.clearStatusTimer);
    this.clearStatusTimer = setTimeout(() => {
      this.setState({ voterNameSavedStatus: "" });
    }, delayBeforeRemovingSavedStatus);
  }

  render () {
    renderLog(__filename);
    if (!this.state.voter) {
      return LoadingWheel;
    }

    return <div className="">
      {this.state.voter ?
        <span>
          {this.state.isOrganization ?
            <span>
              {this.state.displayOnly ?
                <div>
                  <div>{this.state.organizationName}</div>
                </div> :
                <form onSubmit={(e) => {e.preventDefault();}}>
                  <span className="pull-right u-gray-mid">{this.state.organizationNameSavedStatus}</span>
                  <label htmlFor="organization-name">Organization Name as Shown on Your Voter Guides</label>
                  <input type="text"
                         autoComplete="organization"
                         className="form-control"
                         id="organization-name"
                         name="organizationName"
                         placeholder="How would you like your organization name displayed publicly?"
                         onKeyDown={this.handleKeyPressOrganizationName}
                         onChange={this.updateOrganizationName}
                         value={this.state.organizationName}
                  />
                </form> }
            </span> :
            <span>
              {this.state.displayOnly ?
                <div>
                  <div>{this.state.firstName} {this.state.lastName}</div>
                  <div>{this.state.organizationName}</div>
                </div> :
                <form onSubmit={(e) => {e.preventDefault();}}>
                  <span className="pull-right u-gray-mid">{this.state.voterNameSavedStatus}</span>
                  {!this.props.hideFirstLastName ?
                    <span>
                      <label htmlFor="first-name">First Name</label>
                      <input type="text"
                             autoComplete="given-name"
                             className="form-control"
                             id="first-name"
                             name="firstName"
                             placeholder="First Name"
                             onKeyDown={this.handleKeyPressVoterName}
                             onChange={this.updateVoterName}
                             value={this.state.firstName}
                      />
                      <label htmlFor="last-name">Last Name</label>
                      <input type="text"
                             autoComplete="family-name"
                             className="form-control"
                             id="last-name"
                             name="lastName"
                             placeholder="Last Name"
                             onKeyDown={this.handleKeyPressVoterName}
                             onChange={this.updateVoterName}
                             value={this.state.lastName}
                      />
                    </span> :
                    null }
                  <span className="pull-right u-gray-mid">{this.state.organizationNameSavedStatus}</span>
                  <label htmlFor="organization-name">Name Shown on Your Voter Guides</label>
                  <input type="text"
                         autoComplete="organization"
                         className="form-control"
                         id="organization-name"
                         name="organizationName"
                         placeholder="How would you like your name displayed publicly?"
                         onKeyDown={this.handleKeyPressOrganizationName}
                         onChange={this.updateOrganizationName}
                         value={this.state.organizationName}
                  />
                </form> }
            </span> }
        </span> :
        <div><Link to="/settings/account">Please Sign In</Link></div>
      }
    </div>;
  }
}
