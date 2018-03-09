import React, { Component, PropTypes } from "react";
import { Link } from "react-router";
import AnalyticsActions from "../../actions/AnalyticsActions";
import LoadingWheel from "../../components/LoadingWheel";
import OrganizationActions from "../../actions/OrganizationActions";
import OrganizationStore from "../../stores/OrganizationStore";
import VoterStore from "../../stores/VoterStore";

const delay_before_removing_saved_status = 2000;


export default class SettingsWidgetAccountType extends Component {
  static propTypes = {
    editFormClosedByDefault: PropTypes.bool, // Normally we load this component with the edit options displaying
    showEditToggleOption: PropTypes.bool, // Should the voter be able to hide/show the form fields
  };

  constructor (props) {
    super(props);
    // We intentionally don't define this.state.organization or this.state.voter
    this.state = {
      linked_organization_we_vote_id: "",
      organizationType: "",
      organizationTypeSavedStatus: "",
    };

    this.renderOrganizationType = this.renderOrganizationType.bind(this);
    this.updateOrganizationType = this.updateOrganizationType.bind(this);
  }

  componentDidMount () {
    this.onVoterStoreChange();
    this.organizationStoreListener = OrganizationStore.addListener(this.onOrganizationStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    if (VoterStore.election_id()) {
      AnalyticsActions.saveActionAccountPage(VoterStore.election_id());
    }
  }

  componentWillUnmount () {
    // console.log("SettingsProfile ---- UN mount");
    this.organizationStoreListener.remove();
    this.voterStoreListener.remove();
    this.clear_timer = null;
  }

  onOrganizationStoreChange (){
    let organization = OrganizationStore.getOrganizationByWeVoteId(this.state.linked_organization_we_vote_id);
    if (organization && organization.organization_type) {
      this.setState({
        organization: organization,
        organizationType: organization.organization_type,
      });
    }
  }

  onVoterStoreChange () {
    if (VoterStore.isVoterFound()) {
      let voter = VoterStore.getVoter();
      this.setState({
        voter: voter
      });
      if (voter && voter.linked_organization_we_vote_id) {
        this.setState({
          linked_organization_we_vote_id: voter.linked_organization_we_vote_id
        });
        if (voter.linked_organization_we_vote_id !== this.state.linked_organization_we_vote_id) {
          let organization = OrganizationStore.getOrganizationByWeVoteId(voter.linked_organization_we_vote_id);
          if (organization && organization.organization_type) {
            this.setState({
              organization: organization,
              organizationType: organization.organization_type,
            });
          }
        }
      }
    }
  }

  updateOrganizationType (event) {
    // console.log("updateOrganizationType event.target:", event.target);
    if (event.target.name === "organizationType") {
      // console.log("UPDATING, this.state.linked_organization_we_vote_id: ", this.state.linked_organization_we_vote_id, ", event.target.value: ", event.target.value);
      OrganizationActions.organizationTypeSave(this.state.linked_organization_we_vote_id, event.target.value);
      this.setState({
        organizationType: event.target.value,
        organizationTypeSavedStatus: "Saved"
      });
      if (VoterStore.election_id()) {
        AnalyticsActions.saveActionAccountPage(VoterStore.election_id());
      }
      // After some time, clear saved message
      clearTimeout(this.clear_timer);
      this.clear_timer = setTimeout(() => {
        this.setState({organizationTypeSavedStatus: ""});
      }, delay_before_removing_saved_status);
    }
  }

  renderOrganizationType (organizationType, stateOrganizationType, organizationTypeLabel, organizationTypeId) {
    return <div className="form-check">
            <input className="form-check-input"
                   checked={stateOrganizationType === organizationType}
                   id={organizationTypeId}
                   name="organizationType"
                   onChange={this.updateOrganizationType}
                   type="radio"
                   value={organizationType}
            />
            <label className="form-check-label" htmlFor={organizationTypeId}>
              {organizationTypeLabel}
            </label>
          </div>;
  }

  render () {
    // console.log("render organizationType:", this.state.organizationType);
    if (!this.state.voter || !this.state.organization) {
      return LoadingWheel;
    }

    return <div className="">
      {this.state.voter.is_signed_in ?
        <div>
          <h4 className="h4">Type of Account</h4>
          <div className="">
            If you would like to share your opinions publicly as an organization, we recommend
            that you sign in with your organization's Twitter account, and change this setting based on the kind
            of organization you are.
          </div>
          {this.renderOrganizationType("I", this.state.organizationType, "Individual", "organizationTypeIdIndividual")}
          {this.renderOrganizationType("C3", this.state.organizationType, "Nonprofit 501(c)(3)", "organizationTypeIdC3")}
          {this.renderOrganizationType("C4", this.state.organizationType, "Nonprofit 501(c)(4)", "organizationTypeIdC4")}
          {this.renderOrganizationType("P", this.state.organizationType, "Political Action Committee", "organizationTypeIdPAC")}
          {this.renderOrganizationType("NP", this.state.organizationType, "Other Nonprofit", "organizationTypeIdNonprofit")}
          {this.renderOrganizationType("G", this.state.organizationType, "Other Group (10+ people)", "organizationTypeIdGroup")}
          {this.renderOrganizationType("PF", this.state.organizationType, "Politician", "organizationTypeIdPolitician")}
          {this.renderOrganizationType("NW", this.state.organizationType, "News Organization", "organizationTypeIdNews")}
          {this.renderOrganizationType("C", this.state.organizationType, "Company", "organizationTypeIdCompany")}
          {this.renderOrganizationType("U", this.state.organizationType, "Other", "organizationTypeIdUnknown")}
          <br />
          <span className="pull-right u-gray-mid">{this.state.organizationTypeSavedStatus}</span>
        </div> :
        <div><Link to="/settings/account">Please Sign In</Link></div>
      }
    </div>;
  }
}
