import React, { Component } from "react";
import Helmet from "react-helmet";
import { cordovaDot, historyPush } from "../../utils/cordovaUtils";
import { isValidUrl } from "../../utils/textFormat";
import { renderLog } from "../../utils/logging";
import OrganizationActions from "../../actions/OrganizationActions";
import OrganizationStore from "../../stores/OrganizationStore";
import SettingsWidgetFirstLastName from "../../components/Settings/SettingsWidgetFirstLastName";
import SettingsWidgetOrganizationDescription from "../../components/Settings/SettingsWidgetOrganizationDescription";
import SettingsWidgetOrganizationWebsite from "../../components/Settings/SettingsWidgetOrganizationWebsite";
import VoterStore from "../../stores/VoterStore";
import closeIcon from "../../../img/global/icons/x-close.png";

export default class VoterGuideOrganizationInfo extends Component {
  constructor (props) {
    super(props);
    this.state = {
      linkedOrganizationWeVoteId: "",
      organization: {},
      voter: {},
      voterHasMadeChanges: false,
    };
  }

  componentWillMount () {
    document.body.style.backgroundColor = "#A3A3A3";
    document.body.className = "story-view";
  }

  componentDidMount () {
    // AnalyticsActions.saveActionVoterGuideGetStarted(VoterStore.electionId());
    this.organizationStoreListener = OrganizationStore.addListener(this.onOrganizationStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    // Get Voter and Voter's Organization
    const voter = VoterStore.getVoter();
    this.setState({
      voter,
    });
    let validOrganizationDescriptionExists = false;
    let validOrganizationNameExists = false;
    let validVoterNameExists = false;
    let validWebsiteExists = false;
    const linkedOrganizationWeVoteId = voter.linked_organization_we_vote_id;
    // console.log("SettingsDashboard componentDidMount linkedOrganizationWeVoteId: ", linkedOrganizationWeVoteId);
    if (linkedOrganizationWeVoteId) {
      this.setState({
        linkedOrganizationWeVoteId,
      });
      const organization = OrganizationStore.getOrganizationByWeVoteId(linkedOrganizationWeVoteId);
      if (organization && organization.organization_we_vote_id) {
        this.setState({
          organization,
        });
        if (!this.state.voterHasMadeChanges) {
          validOrganizationDescriptionExists = this.validOrganizationDescriptionExists(organization);
          validOrganizationNameExists = this.validOrganizationNameExists(voter, organization);
          validVoterNameExists = this.validVoterNameExists(voter, organization);
          validWebsiteExists = this.validWebsiteExists(organization);
        }
      } else {
        OrganizationActions.organizationRetrieve(linkedOrganizationWeVoteId);
      }
    }
    // Redirect if we have everything we need AND the voter hasn't made changes yet on this page
    if (!this.state.voterHasMadeChanges) {
      if (validVoterNameExists && validOrganizationDescriptionExists && validOrganizationNameExists && validWebsiteExists) {
        // console.log("VoterGuideOrganizationInfo componentDidMount redirect to /voterguidechooseelection");
        historyPush("/voterguidechooseelection");
      }
    }
  }

  componentWillUnmount () {
    this.organizationStoreListener.remove();
    this.voterStoreListener.remove();

    document.body.style.backgroundColor = null;
    document.body.className = "";
    this.timer = null;
  }

  onOrganizationStoreChange () {
    const { linkedOrganizationWeVoteId } = this.state;
    const organization = OrganizationStore.getOrganizationByWeVoteId(linkedOrganizationWeVoteId);
    this.setState({
      organization,
    });
    if (!this.state.voterHasMadeChanges) {
      const voter = VoterStore.getVoter();
      const validOrganizationDescriptionExists = this.validOrganizationDescriptionExists(organization);
      const validOrganizationNameExists = this.validOrganizationNameExists(voter, organization);
      const validVoterNameExists = this.validVoterNameExists(voter, organization);
      const validWebsiteExists = this.validWebsiteExists(organization);
      // Redirect if we have everything we need AND the voter hasn't made changes yet on this page
      if (validVoterNameExists && validOrganizationDescriptionExists && validOrganizationNameExists && validWebsiteExists) {
        // console.log("VoterGuideOrganizationInfo onOrganizationStoreChange redirect to /voterguidechooseelection");
        historyPush("/voterguidechooseelection");
      }
    }
  }

  onVoterStoreChange () {
    const voter = VoterStore.getVoter();
    this.setState({
      voter,
    });
    const linkedOrganizationWeVoteId = voter.linked_organization_we_vote_id;
    // console.log("SettingsDashboard onVoterStoreChange linkedOrganizationWeVoteId: ", linkedOrganizationWeVoteId);
    if (linkedOrganizationWeVoteId && this.state.linkedOrganizationWeVoteId !== linkedOrganizationWeVoteId) {
      OrganizationActions.organizationRetrieve(linkedOrganizationWeVoteId);
      this.setState({ linkedOrganizationWeVoteId });
    }
  }

  voterHasMadeChangesSet = () => {
    // console.log("voterHasMadeChangesSet, this.state.voterHasMadeChanges:", this.state.voterHasMadeChanges);
    if (!this.state.voterHasMadeChanges) {
      this.setState({
        voterHasMadeChanges: true,
      });
    }
  }

  validOrganizationDescriptionExists = (organization) => {
    if (organization) {
      if (organization.organization_description && organization.organization_description.length > 3) {
        // We want to keep encouraging organizations to enter a Website
        return true;
      }
    }
    return false;
  }

  validOrganizationNameExists = (voter, organization) => {
    // We want to keep encouraging organizations to enter a Website
    if (voter && organization) {
      let voterAndOrganizationNameMatches = false;
      if (voter.first_name && organization.organization_name) {
        if (voter.first_name === organization.organization_name) {
          voterAndOrganizationNameMatches = true;
        }
      }
      // Everyone requires a valid organization name
      if (organization.organization_name && organization.organization_name.length > 3 && !organization.organization_name.startsWith("Voter-") && !voterAndOrganizationNameMatches) {
        return true;
      }
    }
    return false;
  }

  validVoterNameExists = (voter, organization) => {
    if (voter && organization) {
      if (organization.organization_type && organization.organization_type === "I") {
        if (voter.first_name && !voter.first_name.startsWith("Voter-")) {
          return true;
        }
      } else {
        // Voter Name not required for non-INDIVIDUALs
        return true;
      }
    }
    return false;
  }

  validWebsiteExists = (organization) => {
    if (organization) {
      if (organization.organization_type && organization.organization_type === "I") {
        return true;
      }
      if (organization.organization_type && organization.organization_type !== "I") {
        // We don't require voter name for organizations
        if (organization.organization_website && isValidUrl(organization.organization_website)) {
          // We want to keep encouraging organizations to enter a Website
          return true;
        }
      }
    }
    return false;
  }

  goToBallotLink = () => {
    const sampleBallotLink = "/ballot";
    historyPush(sampleBallotLink);
  }

  goToChooseElection = () => {
    historyPush("/voterguidechooseelection");
  }


  render () {
    renderLog(__filename);
    if (!this.state.voter || !this.state.organization) {
      return null;
    }

    return (
      <div>
        <Helmet title="Create Profile - We Vote" />
        <div className="intro-story container well u-inset--md">
          <img src={cordovaDot(closeIcon)} onClick={this.goToBallotLink} className="x-close" alt="close" />
          <div className="create-voter-guide__h1 xs-text-left">Create Profile</div>
          <div className="create-voter-guide__steps xs-text-left">
            Step 3 of 5
          </div>
          <div className="row">
            <div className="col-1 col-md-2">&nbsp;</div>
            <div className="col-10 col-md-8">
              <p className="u-stack--md" />
              <SettingsWidgetFirstLastName voterHasMadeChangesFunction={this.voterHasMadeChangesSet} />
              <SettingsWidgetOrganizationWebsite voterHasMadeChangesFunction={this.voterHasMadeChangesSet} />
              <SettingsWidgetOrganizationDescription voterHasMadeChangesFunction={this.voterHasMadeChangesSet} />
            </div>
            <div className="col-1 col-md-2">&nbsp;</div>
          </div>
          <footer className="create-voter-guide__footer">
            <button
              type="button"
              className="btn btn-lg btn-success"
              onClick={this.goToChooseElection}
            >
              Next&nbsp;&nbsp;&gt;
            </button>
          </footer>
        </div>
      </div>
    );
  }
}
