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

export default class VoterGuideOrganizationInfo extends Component {
  constructor (props) {
    super(props);
    this.state = {
      autoFocus: true,
      linkedOrganizationWeVoteId: "",
      organization: {},
      searchResultsOrganizationName: "",
      voter: {},
      voterHasMadeChanges: false,
    };
    this.resetState = this.resetState.bind(this);
  }

  componentWillMount () {
    document.body.style.backgroundColor = "#A3A3A3";
    document.body.className = "story-view";
  }

  componentDidMount () {
    //AnalyticsActions.saveActionVoterGuideGetStarted(VoterStore.election_id());
    this.organizationStoreListener = OrganizationStore.addListener(this.onOrganizationStoreChange.bind(this));
    this.setState({
      autoFocus: true,
    });
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    // Get Voter and Voter's Organization
    let voter = VoterStore.getVoter();
    this.setState({
      voter: voter,
    });
    let validOrganizationDescriptionExists = false;
    let validOrganizationNameExists = false;
    let validVoterNameExists = false;
    let validWebsiteExists = false;
    let linkedOrganizationWeVoteId = voter.linked_organization_we_vote_id;
    // console.log("SettingsDashboard componentDidMount linkedOrganizationWeVoteId: ", linkedOrganizationWeVoteId);
    if (linkedOrganizationWeVoteId) {
      this.setState({
        linkedOrganizationWeVoteId: linkedOrganizationWeVoteId,
      });
      let organization = OrganizationStore.getOrganizationByWeVoteId(linkedOrganizationWeVoteId);
      if (organization && organization.organization_we_vote_id) {
        this.setState({
          organization: organization,
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
    document.body.style.backgroundColor = null;
    document.body.className = "";
    this.organizationStoreListener.remove();
    this.timer = null;
  }

  onOrganizationStoreChange () {
    let organization = OrganizationStore.getOrganizationByWeVoteId(this.state.linkedOrganizationWeVoteId);
    this.setState({
      isLoading: false,
      organization: organization,
    });
    if (!this.state.voterHasMadeChanges) {
      let voter = VoterStore.getVoter();
      let validOrganizationDescriptionExists = this.validOrganizationDescriptionExists(organization);
      let validOrganizationNameExists = this.validOrganizationNameExists(voter, organization);
      let validVoterNameExists = this.validVoterNameExists(voter, organization);
      let validWebsiteExists = this.validWebsiteExists(organization);
      // Redirect if we have everything we need AND the voter hasn't made changes yet on this page
      if (validVoterNameExists && validOrganizationDescriptionExists && validOrganizationNameExists && validWebsiteExists) {
        // console.log("VoterGuideOrganizationInfo onOrganizationStoreChange redirect to /voterguidechooseelection");
        historyPush("/voterguidechooseelection");
      }
    }
  }

  onVoterStoreChange () {
    let voter = VoterStore.getVoter();
    this.setState({
      voter: voter,
    });
    let linkedOrganizationWeVoteId = voter.linked_organization_we_vote_id;
    // console.log("SettingsDashboard onVoterStoreChange linkedOrganizationWeVoteId: ", linkedOrganizationWeVoteId);
    if (linkedOrganizationWeVoteId && this.state.linkedOrganizationWeVoteId !== linkedOrganizationWeVoteId) {
      OrganizationActions.organizationRetrieve(linkedOrganizationWeVoteId);
      this.setState({ linkedOrganizationWeVoteId: linkedOrganizationWeVoteId });
    }
  }

  resetState () {
    this.setState({
      autoFocus: true,
      isLoading: false,
      isTwitterHandleValid: false,
      twitterHandle: "",
    });
  }

  goToBallotLink () {
    let sampleBallotLink = "/ballot";
    historyPush(sampleBallotLink);
  }

  goToChooseElection () {
    historyPush("/voterguidechooseelection");
  }

  voterHasMadeChangesSet () {
    // console.log("voterHasMadeChangesSet, this.state.voterHasMadeChanges:", this.state.voterHasMadeChanges);
    if (!this.state.voterHasMadeChanges) {
      this.setState({
        voterHasMadeChanges: true,
      });
    }
  }

  validOrganizationDescriptionExists (organization) {
    if (organization) {
      if (organization.organization_description && organization.organization_description.length > 3) {
        // We want to keep encouraging organizations to enter a Website
        return true;
      }
    }
    return false;
  }

  validOrganizationNameExists (voter, organization) {
    // We want to keep encouraging organizations to enter a Website
    if (voter && organization) {
      let voter_and_organization_name_matches = false;
      if (voter.first_name && organization.organization_name) {
        if (voter.first_name === organization.organization_name) {
          voter_and_organization_name_matches = true;
        }
      }
      // Everyone requires a valid organization name
      if (organization.organization_name && organization.organization_name.length > 3 && !organization.organization_name.startsWith("Voter-") && !voter_and_organization_name_matches) {
        return true;
      }
    }
    return false;
  }

  validVoterNameExists (voter, organization) {
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

  validWebsiteExists (organization) {
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

  render () {
    renderLog(__filename);
    if (!this.state.voter || !this.state.organization) {
      return null;
    }

    let actionButtonHtml;
    actionButtonHtml = <button type="button" className="btn btn-lg btn-success"
                    onClick={this.goToChooseElection}>Next&nbsp;&nbsp;&gt;</button>;

    return <div>
      <Helmet title="Create Profile - We Vote" />
        <div className="intro-story container well u-inset--md">
          <img src={cordovaDot("/img/global/icons/x-close.png")} onClick={this.goToBallotLink} className="x-close" alt={"close"}/>
          <div className="intro-story__h1 xs-text-left">Create Profile</div>
          <div className="row">
            <div className="col-sm-2 col-xs-1">&nbsp;</div>
            <div className="col-sm-8 col-xs-10">
              <p className="u-stack--md" />
              <SettingsWidgetFirstLastName voterHasMadeChangesFunction={this.voterHasMadeChangesSet.bind(this)} />
              <SettingsWidgetOrganizationWebsite voterHasMadeChangesFunction={this.voterHasMadeChangesSet.bind(this)} />
              <SettingsWidgetOrganizationDescription voterHasMadeChangesFunction={this.voterHasMadeChangesSet.bind(this)} />
            </div>
            <div className="col-sm-2 col-xs-1">&nbsp;</div>
          </div>
          <footer className="intro-story__footer">
            {actionButtonHtml}
          </footer>
        </div>
      </div>;
  }
}
