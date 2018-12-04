import React, { Component } from "react";
import Helmet from "react-helmet";
import { cordovaDot, historyPush } from "../../utils/cordovaUtils";
import { renderLog } from "../../utils/logging";
import OrganizationActions from "../../actions/OrganizationActions";
import OrganizationStore from "../../stores/OrganizationStore";
import SettingsWidgetAccountType from "../../components/Settings/SettingsWidgetAccountType";
import VoterStore from "../../stores/VoterStore";

export default class VoterGuideOrganizationType extends Component {
  constructor (props) {
    super(props);
    this.state = {
      autoFocus: true,
      searchResultsOrganizationName: "",
      twitterSearchStatus: "",
    };
    this.resetState = this.resetState.bind(this);
  }

  componentWillMount () {
    document.body.style.backgroundColor = "#A3A3A3";
    document.body.className = "story-view";
  }

  componentDidMount () {
    // AnalyticsActions.saveActionVoterGuideGetStarted(VoterStore.election_id());
    this.organizationStoreListener = OrganizationStore.addListener(this.onOrganizationStoreChange.bind(this));
    this.setState({
      autoFocus: true,
    });
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    // Get Voter and Voter's Organization
    const voter = VoterStore.getVoter();
    if (voter && voter.is_signed_in) {
      historyPush("/voterguidechooseelection");
    }
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
      } else {
        OrganizationActions.organizationRetrieve(linkedOrganizationWeVoteId);
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
    this.setState({
      isLoading: false,
      organization: OrganizationStore.getOrganizationByWeVoteId(this.state.linkedOrganizationWeVoteId),
    });
  }

  onVoterStoreChange () {
    const voter = VoterStore.getVoter();
    if (voter && voter.is_signed_in) {
      historyPush("/voterguidechooseelection");
    }
    const linkedOrganizationWeVoteId = voter.linked_organization_we_vote_id;
    // console.log("SettingsDashboard onVoterStoreChange linkedOrganizationWeVoteId: ", linkedOrganizationWeVoteId);
    if (linkedOrganizationWeVoteId && this.state.linkedOrganizationWeVoteId !== linkedOrganizationWeVoteId) {
      OrganizationActions.organizationRetrieve(linkedOrganizationWeVoteId);
      this.setState({ linkedOrganizationWeVoteId });
    }
  }

  resetState () {
    this.setState({
      autoFocus: true,
      isLoading: false,
      isTwitterHandleValid: false,
      twitterSearchStatus: "",
      twitterHandle: "",
    });
  }

  goToBallotLink () {
    const sampleBallotLink = "/ballot";
    historyPush(sampleBallotLink);
  }

  goToOrganizationInfo () {
    historyPush("/voterguideorginfo");
  }

  render () {
    renderLog(__filename);

    return (
      <div>
        <Helmet title="Type of Profile - We Vote" />
        <div className="intro-story container well u-inset--md">
          <img src={cordovaDot("/img/global/icons/x-close.png")} onClick={this.goToBallotLink} className="x-close" alt="close" />
          <div className="create-voter-guide__h1 xs-text-left">Create Your Voter Guide</div>
          <div className="create-voter-guide__steps xs-text-left">
            Step 2 of 5
          </div>
          <div className="row">
            <div className="col-sm-2 col-xs-1">&nbsp;</div>
            <div className="col-sm-8 col-xs-10">
              <p className="u-stack--md" />
              <SettingsWidgetAccountType editFormOpen />
            </div>
            <div className="col-sm-2 col-xs-1">&nbsp;</div>
          </div>
          <footer className="create-voter-guide__footer">
            <button
              type="button"
              className="btn btn-lg btn-success"
              onClick={this.goToOrganizationInfo}
            >
              Next&nbsp;&nbsp;&gt;
            </button>
          </footer>
        </div>
      </div>
    );
  }
}
