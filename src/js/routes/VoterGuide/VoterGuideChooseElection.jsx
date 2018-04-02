import React, { Component } from "react";
import PropTypes from "prop-types";
import Helmet from "react-helmet";
import AnalyticsActions from "../../actions/AnalyticsActions";
import { cordovaDot, historyPush } from "../../utils/cordovaUtils";
import ChooseElectionForVoterGuide from "../../components/VoterGuide/ChooseElectionForVoterGuide";
import { renderLog } from "../../utils/logging";
import OrganizationActions from "../../actions/OrganizationActions";
import OrganizationStore from "../../stores/OrganizationStore";
import VoterStore from "../../stores/VoterStore";


export default class VoterGuideChooseElection extends Component {
  static propTypes = {
    closeEditFormOnChoice: PropTypes.bool, // When a voter makes a choice, close the edit form
    editFormOpen: PropTypes.bool, // Normally we load this component with the edit options closed
    showEditToggleOption: PropTypes.bool, // Should the voter be able to hide/show the form fields
  };

  constructor (props) {
    super(props);
    this.state = {
      autoFocus: true,
      linkedOrganizationWeVoteId: "",
      searchResultsOrganizationName: "",
      twitterHandleEntered: "",
      twitterSearchStatus: "",
      electionsLocationsList: [],
    };
    this.onOrganizationStoreChange = this.onOrganizationStoreChange.bind(this);
    this.resetState = this.resetState.bind(this);
    this.saveAndGoToOrganizationInfo = this.saveAndGoToOrganizationInfo.bind(this);
  }

  componentWillMount () {
    document.body.style.backgroundColor = "#A3A3A3";
    document.body.className = "story-view";
  }

  componentDidMount () {
    AnalyticsActions.saveActionElections(VoterStore.election_id());
    AnalyticsActions.saveActionVoterGuideGetStarted(VoterStore.election_id());
    this.organizationStoreListener = OrganizationStore.addListener(this.onOrganizationStoreChange.bind(this));
    this.setState({
      autoFocus: true,
    });
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    // Get Voter and Voter's Organization
    let voter = VoterStore.getVoter();
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
    let twitterHandleFound = OrganizationStore.getOrganizationSearchResultsTwitterHandle();

    let twitterSearchStatus = "";
    if (this.state.twitterHandleEntered.length) {
      if (twitterHandleFound.length) {
        twitterSearchStatus += "Voter guide found!";
      } else {
        twitterSearchStatus += "Voter guide not found.";
      }
    }

    this.setState({
      isLoading: false,
      isTwitterHandleValid: twitterHandleFound.length,
      organization: OrganizationStore.getOrganizationByWeVoteId(this.state.linkedOrganizationWeVoteId),
      searchResultsOrganizationName: OrganizationStore.getOrganizationSearchResultsOrganizationName(),
      searchResultsTwitterHandle: OrganizationStore.getOrganizationSearchResultsTwitterHandle(),
      searchResultsWebsite: OrganizationStore.getOrganizationSearchResultsWebsite(),
      twitterSearchStatus: twitterSearchStatus,
      twitterHandle: twitterHandleFound,
    });
  }

  onVoterStoreChange () {
    let voter = VoterStore.getVoter();
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
      twitterSearchStatus: "",
      twitterHandle: "",
    });
  }

  goToBallotLink () {
    let sampleBallotLink = "/ballot";
    historyPush(sampleBallotLink);
  }

  goToVoterGuideChoosePositions (voterGuideWeVoteId) {
    let voterGuideBallotItems = "/voterguidepositions/" + voterGuideWeVoteId;
    historyPush(voterGuideBallotItems);
  }

  saveAndGoToOrganizationInfo () {
    if (this.state.linkedOrganizationWeVoteId) {
      OrganizationActions.organizationGetStartedSave(this.state.linkedOrganizationWeVoteId, this.state.searchResultsOrganizationName, this.state.searchResultsWebsite);
    }
    historyPush("/voterguideorgtype");
  }

  render () {
    renderLog(__filename);

    return <div>
      <Helmet title="Choose Election - We Vote" />
        <div className="create-voter-guide container well">
          <img src={cordovaDot("/img/global/icons/x-close.png")} onClick={this.goToBallotLink} className="x-close" alt={"close"}/>
          <div className="create-voter-guide__h1 xs-text-left">Choose Election</div>
          <div className="create-voter-guide__steps xs-text-left">
            Step 4 of 5
          </div>
          <div className="create-voter-guide__description xs-text-left" />
          <div className="row">
            <div className="col-1 col-md-2">&nbsp;</div>
            <div className="col-10 col-md-8">
              <ChooseElectionForVoterGuide destinationFunction={this.goToVoterGuideChoosePositions.bind(this)} />
            </div>
            <div className="col-1 col-md-2">&nbsp;</div>
          </div>
        </div>
      </div>;
  }
}
