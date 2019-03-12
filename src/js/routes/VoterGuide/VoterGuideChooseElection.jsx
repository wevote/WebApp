import React, { Component } from "react";
import Helmet from "react-helmet";
import AnalyticsActions from "../../actions/AnalyticsActions";
import { cordovaDot, historyPush } from "../../utils/cordovaUtils";
import ChooseElectionForVoterGuide from "../../components/VoterGuide/ChooseElectionForVoterGuide";
import { renderLog } from "../../utils/logging";
import OrganizationActions from "../../actions/OrganizationActions";
import OrganizationStore from "../../stores/OrganizationStore";
import VoterStore from "../../stores/VoterStore";
import closeIcon from "../../../img/global/icons/x-close.png";


export default class VoterGuideChooseElection extends Component {
  static propTypes = {
  };

  constructor (props) {
    super(props);
    this.state = {
      linkedOrganizationWeVoteId: "",
      searchResultsOrganizationName: "",
    };
    this.onOrganizationStoreChange = this.onOrganizationStoreChange.bind(this);
    this.saveAndGoToOrganizationInfo = this.saveAndGoToOrganizationInfo.bind(this);
  }

  componentWillMount () {
    document.body.style.backgroundColor = "#A3A3A3";
    document.body.className = "story-view";
  }

  componentDidMount () {
    AnalyticsActions.saveActionElections(VoterStore.electionId());
    AnalyticsActions.saveActionVoterGuideGetStarted(VoterStore.electionId());
    this.organizationStoreListener = OrganizationStore.addListener(this.onOrganizationStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    // Get Voter and Voter's Organization
    const voter = VoterStore.getVoter();
    const linkedOrganizationWeVoteId = voter.linked_organization_we_vote_id;
    // console.log("SettingsDashboard componentDidMount linkedOrganizationWeVoteId: ", linkedOrganizationWeVoteId);
    if (linkedOrganizationWeVoteId) {
      this.setState({
        linkedOrganizationWeVoteId,
      });
      const organization = OrganizationStore.getOrganizationByWeVoteId(linkedOrganizationWeVoteId);
      if (organization === undefined || organization.organization_we_vote_id === undefined) {
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
      searchResultsOrganizationName: OrganizationStore.getOrganizationSearchResultsOrganizationName(),
      searchResultsWebsite: OrganizationStore.getOrganizationSearchResultsWebsite(),
    });
  }

  onVoterStoreChange () {
    const voter = VoterStore.getVoter();
    const linkedOrganizationWeVoteId = voter.linked_organization_we_vote_id;
    // console.log("SettingsDashboard onVoterStoreChange linkedOrganizationWeVoteId: ", linkedOrganizationWeVoteId);
    if (linkedOrganizationWeVoteId && this.state.linkedOrganizationWeVoteId !== linkedOrganizationWeVoteId) {
      OrganizationActions.organizationRetrieve(linkedOrganizationWeVoteId);
      this.setState({ linkedOrganizationWeVoteId });
    }
  }

  goToVoterGuideChoosePositions = (voterGuideWeVoteId) => {
    const voterGuideBallotItems = `/voterguidepositions/${voterGuideWeVoteId}`;
    historyPush(voterGuideBallotItems);
  }

  goToBallotLink () {
    const sampleBallotLink = "/ballot";
    historyPush(sampleBallotLink);
  }

  saveAndGoToOrganizationInfo () {
    if (this.state.linkedOrganizationWeVoteId) {
      OrganizationActions.organizationGetStartedSave(this.state.linkedOrganizationWeVoteId, this.state.searchResultsOrganizationName, this.state.searchResultsWebsite);
    }
    historyPush("/voterguideorgtype");
  }

  render () {
    renderLog(__filename);

    return (
      <div>
        <Helmet title="Choose Election - We Vote" />
        <div className="create-voter-guide container well">
          <img src={cordovaDot(closeIcon)} onClick={this.goToBallotLink} className="x-close" alt="close" />
          <div className="create-voter-guide__h1 xs-text-left">Choose Election</div>
          <div className="create-voter-guide__steps xs-text-left">
            Step 4 of 5
          </div>
          <div className="create-voter-guide__description xs-text-left" />
          <div className="row">
            <div className="col-1 col-md-2">&nbsp;</div>
            <div className="col-10 col-md-8">
              <ChooseElectionForVoterGuide destinationFunction={this.goToVoterGuideChoosePositions} />
            </div>
            <div className="col-1 col-md-2">&nbsp;</div>
          </div>
        </div>
      </div>
    );
  }
}
