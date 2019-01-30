import React, { Component } from "react";
import PropTypes from "prop-types";
import AnalyticsActions from "../../actions/AnalyticsActions";
import { prepareForCordovaKeyboard, restoreStylesAfterCordovaKeyboard } from "../../utils/cordovaUtils";
import LoadingWheel from "../LoadingWheel";
import OrganizationActions from "../../actions/OrganizationActions";
import OrganizationStore from "../../stores/OrganizationStore";
import VoterStore from "../../stores/VoterStore";
import { renderLog } from "../../utils/logging";

const delayBeforeRemovingSavedStatus = 2000;


export default class SettingsWidgetAccountType extends Component {
  static propTypes = {
    closeEditFormOnChoice: PropTypes.bool, // When a voter makes a choice, close the edit form
    editFormOpen: PropTypes.bool, // Normally we load this component with the edit options closed
    showEditToggleOption: PropTypes.bool, // Should the voter be able to hide/show the form fields
  };

  constructor (props) {
    super(props);
    // We intentionally don't define this.state.organization or this.state.voter
    this.state = {
      closeEditFormOnChoice: false,
      editFormOpen: false,
      linkedOrganizationWeVoteId: "",
      organizationType: "",
      organizationTypeSavedStatus: "",
    };

    this.renderOrganizationType = this.renderOrganizationType.bind(this);
    this.toggleEditForm = this.toggleEditForm.bind(this);
    this.updateOrganizationType = this.updateOrganizationType.bind(this);
  }

  componentWillMount () {
    prepareForCordovaKeyboard(__filename);
  }

  componentDidMount () {
    this.onVoterStoreChange();
    this.organizationStoreListener = OrganizationStore.addListener(this.onOrganizationStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    if (VoterStore.election_id()) {
      AnalyticsActions.saveActionAccountPage(VoterStore.election_id());
    }
    this.setState({
      closeEditFormOnChoice: this.props.closeEditFormOnChoice,
      editFormOpen: this.props.editFormOpen,
      showEditToggleOption: this.props.showEditToggleOption,
    });
  }

  componentWillUnmount () {
    this.organizationStoreListener.remove();
    this.voterStoreListener.remove();
    this.clearTimer = null;
    restoreStylesAfterCordovaKeyboard(__filename);
  }

  onOrganizationStoreChange () {
    const organization = OrganizationStore.getOrganizationByWeVoteId(this.state.linkedOrganizationWeVoteId);
    if (organization && organization.organization_we_vote_id) {
      this.setState({
        organization,
        organizationType: organization.organization_type,
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
              organization,
              organizationType: organization.organization_type,
            });
          } else {
            OrganizationActions.organizationRetrieve(voter.linked_organization_we_vote_id);
          }
        }
      }
    }
  }

  displayOrganizationType (organizationType) {
    switch (organizationType) {
      case "I":
        return "Individual";
      case "C3":
        return "Nonprofit 501(c)(3)";
      case "C4":
        return "Nonprofit 501(c)(4)";
      case "P":
        return "Political Action Committee";
      case "NP":
        return "Nonprofit (Type Not Specified)";
      case "G":
        return "Group or Club (10+ people)";
      case "PF":
        return "Politician";
      case "NW":
        return "News Organization";
      case "C":
        return "Company";
      case "U":
        return "Not specified (Individual vs. Organization)";
      default:
        return "";
    }
  }

  toggleEditForm () {
    this.setState({
      editFormOpen: !this.state.editFormOpen,
    });
  }

  updateOrganizationType (event) {
    if (event.target.name === "organizationType") {
      OrganizationActions.organizationTypeSave(this.state.linkedOrganizationWeVoteId, event.target.value);
      this.setState({
        organizationType: event.target.value,
        organizationTypeSavedStatus: "Saved",
      });
      if (this.state.closeEditFormOnChoice) {
        this.toggleEditForm();
      }
      if (VoterStore.election_id()) {
        AnalyticsActions.saveActionAccountPage(VoterStore.election_id());
      }
      // After some time, clear saved message
      clearTimeout(this.clearTimer);
      this.clearTimer = setTimeout(() => {
        this.setState({ organizationTypeSavedStatus: "" });
      }, delayBeforeRemovingSavedStatus);
    }
  }

  renderOrganizationType (organizationType, organizationTypeCurrentState, organizationTypeLabel, organizationTypeId) {
    const organizationTypeTrimmed = organizationType ? organizationType.trim() : "";
    const organizationTypeCurrentStateTrimmed = organizationTypeCurrentState ? organizationTypeCurrentState.trim() : "";
    const organizationTypeChecked = organizationTypeCurrentStateTrimmed === organizationTypeTrimmed;
    return (
      <div className="form-check create-voter-guide__radio">
        <input
          className="form-check-input"
          checked={organizationTypeChecked}
          id={organizationTypeId}
          name="organizationType"
          onChange={this.updateOrganizationType}
          type="radio"
          value={organizationType}
        />
        <label className="form-check-label create-voter-guide__radio-label" htmlFor={organizationTypeId}>
          {organizationTypeLabel}
        </label>
      </div>
    );
  }

  render () {
    renderLog(__filename);
    // console.log("render organizationType:", this.state.organizationType);
    if (!this.state.voter || !this.state.organization) {
      return LoadingWheel;
    }

    return (
      <div className="">
        <div>
          <span className="pull-right u-gray-mid">{this.state.organizationTypeSavedStatus}</span>
          <h3 className="h3">Type of Profile</h3>
          { this.state.editFormOpen ? (
            <span>
              <div className="create-voter-guide__organization-container">
                <div className="">
                  {this.state.showEditToggleOption ? (
                    <span className="pull-right">
                      (
                      <a className="" onClick={() => this.toggleEditForm()}>close</a>
                      )
                    </span>
                  ) : null}
                </div>
                {this.renderOrganizationType("I", this.state.organizationType, "Individual", "organizationTypeIdIndividual")}
                {this.renderOrganizationType("C3", this.state.organizationType, "Nonprofit 501(c)(3)", "organizationTypeIdC3")}
                {this.renderOrganizationType("C4", this.state.organizationType, "Nonprofit 501(c)(4)", "organizationTypeIdC4")}
                {this.renderOrganizationType("P", this.state.organizationType, "Political Action Committee", "organizationTypeIdPAC")}
                {this.renderOrganizationType("NP", this.state.organizationType, "Other Nonprofit", "organizationTypeIdNonprofit")}
                {this.renderOrganizationType("G", this.state.organizationType, "Other Group or Club (10+ people)", "organizationTypeIdGroup")}
                {this.renderOrganizationType("PF", this.state.organizationType, "Politician", "organizationTypeIdPolitician")}
                {this.renderOrganizationType("NW", this.state.organizationType, "News Organization", "organizationTypeIdNews")}
                {this.renderOrganizationType("C", this.state.organizationType, "Company", "organizationTypeIdCompany")}
                {this.renderOrganizationType("U", this.state.organizationType, "Other", "organizationTypeIdUnknown")}
              </div>
            </span>
          ) : (
            <div className="">
              <span className="pull-right u-gray-mid">{this.state.organizationTypeSavedStatus}</span>
              <span className="u-f4 u-bold">{this.displayOrganizationType(this.state.organizationType)}</span>
              {this.state.showEditToggleOption ? (
                <span className="">
                  {" "}
(
                  <a className="" onClick={() => this.toggleEditForm()}>edit</a>
)
                </span>
              ) : null
              }
            </div>
          )}
        </div>
      </div>
    );
  }
}
