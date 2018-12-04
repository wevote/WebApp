import React, { Component } from "react";
import PropTypes from "prop-types";
import { historyPush } from "../../utils/cordovaUtils";
import LoadingWheel from "../../components/LoadingWheel";
import { renderLog } from "../../utils/logging";
import OrganizationStore from "../../stores/OrganizationStore";
import VoterGuideActions from "../../actions/VoterGuideActions";
import VoterGuideStore from "../../stores/VoterGuideStore";
import VoterStore from "../../stores/VoterStore";
import { isProperlyFormattedVoterGuideWeVoteId } from "../../utils/textFormat";

// Take in this.props.params.organization_we_vote_id and this.props.params.google_civic_election_id and
// redirect to the correct voter guide edit page
export default class OrganizationVoterGuideEdit extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = {
      organization_we_vote_id: "",
      organization: {},
      voter: {},
    };
  }

  componentDidMount () {
    // console.log("this.props.params.edit_mode: ", this.props.params.edit_mode);
    let organizationWeVoteId = this.props.params.organization_we_vote_id;
    let googleCivicElectionId = this.props.params.google_civic_election_id;
    // console.log("OrganizationVoterGuideEdit, componentDidMount, this.props.params.organization_we_vote_id: ", organizationWeVoteId, ", this.props.params.google_civic_election_id: ", googleCivicElectionId);

    let tryToCreateVoterGuide = false;
    let continueLookingForLocalVoterGuide = true;
    if (organizationWeVoteId && googleCivicElectionId) {
      // Simplest case where we get both variables
      const voterGuide = VoterGuideStore.getVoterGuideForOrganizationIdAndElection(organizationWeVoteId, googleCivicElectionId);
      // console.log("voterGuide: ", voterGuide);
      if (voterGuide && voterGuide.we_vote_id && isProperlyFormattedVoterGuideWeVoteId(voterGuide.we_vote_id)) {
        historyPush(`/vg/${voterGuide.we_vote_id}/settings/positions`);
        continueLookingForLocalVoterGuide = false;
      } else {
        continueLookingForLocalVoterGuide = false;
        tryToCreateVoterGuide = true;
      }
    }

    if (continueLookingForLocalVoterGuide) {
      const voter = VoterStore.getVoter();
      if (!organizationWeVoteId) {
        // If here, an organization wasn't specified
        if (voter && voter.linked_organization_we_vote_id) {
          organizationWeVoteId = voter.linked_organization_we_vote_id;
        }
      }

      if (!googleCivicElectionId) {
        googleCivicElectionId = VoterStore.election_id();
      }

      // Now that we have gathered the org id or election id from local stores, try getting the Voter Guide again
      if (organizationWeVoteId && googleCivicElectionId) {
        // Simplest case where we get both variables
        const voterGuide = VoterGuideStore.getVoterGuideForOrganizationIdAndElection(organizationWeVoteId, googleCivicElectionId);
        // console.log("voterGuide: ", voterGuide);
        if (voterGuide && voterGuide.we_vote_id && isProperlyFormattedVoterGuideWeVoteId(voterGuide.we_vote_id)) {
          historyPush(`/vg/${voterGuide.we_vote_id}/settings/positions`);
        } else {
          tryToCreateVoterGuide = true;
        }
      }
    }

    // Cache what we have for when we get a response from VoterGuide store
    this.setState({
      googleCivicElectionId,
      organizationWeVoteId,
    });

    // console.log("OrganizationVoterGuideEdit, componentDidMount, googleCivicElectionId:", googleCivicElectionId);
    if (tryToCreateVoterGuide) {
      // We only pass the election id since you can only create voter guides for your self
      VoterGuideActions.voterGuideSave(googleCivicElectionId);
    }

    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));
    this.organizationStoreListener = OrganizationStore.addListener(this.onOrganizationStoreChange.bind(this));
  }

  componentWillUnmount () {
    this.organizationStoreListener.remove();
    this.voterGuideStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onVoterGuideStoreChange () {
    const voterGuide = VoterGuideStore.getVoterGuideSaveResults();
    this.setState({
      voterGuide,
    });
    // console.log("onVoterGuideStoreChange voterGuide:", voterGuide);
    if (voterGuide && voterGuide.we_vote_id && isProperlyFormattedVoterGuideWeVoteId(voterGuide.we_vote_id)) {
      historyPush(`/vg/${voterGuide.we_vote_id}/settings/positions`);
    }
  }

  onVoterStoreChange () {
    this.setState({
      voter: VoterStore.getVoter(),
    });
  }

  onOrganizationStoreChange () {
    this.setState({
      organization: OrganizationStore.getOrganizationByWeVoteId(this.state.organization_we_vote_id),
    });
  }

  render () {
    renderLog(__filename);
    if (!this.state.organization || !this.state.organization.organization_we_vote_id || !this.state.voter) {
      return <div>{LoadingWheel}</div>;
    }

    const is_voter_owner = this.state.organization.organization_we_vote_id !== undefined &&
      this.state.organization.organization_we_vote_id === this.state.voter.linked_organization_we_vote_id;

    if (!is_voter_owner) {
      return <div>{LoadingWheel}</div>;
    }

    // This component is to redirect to the voter guide for this organization for this election
    return null;
  }
}
