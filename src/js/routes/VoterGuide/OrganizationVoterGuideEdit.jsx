import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { historyPush } from '../../utils/cordovaUtils';
import LoadingWheel from '../../components/LoadingWheel';
import { renderLog } from '../../utils/logging';
import OrganizationActions from '../../actions/OrganizationActions';
import OrganizationStore from '../../stores/OrganizationStore';
import VoterGuideActions from '../../actions/VoterGuideActions';
import VoterGuideStore from '../../stores/VoterGuideStore';
import VoterStore from '../../stores/VoterStore';
import { isProperlyFormattedVoterGuideWeVoteId } from '../../utils/textFormat';

// Take in this.props.params.organization_we_vote_id and this.props.params.google_civic_election_id and
// redirect to the correct voter guide edit page
export default class OrganizationVoterGuideEdit extends Component {
  constructor (props) {
    super(props);
    this.state = {
      googleCivicElectionId: 0,
      organizationWeVoteId: '',
      organization: {},
      voter: {},
    };
  }

  componentDidMount () {
    let organizationWeVoteId = this.props.params.organization_we_vote_id;
    let googleCivicElectionId = this.props.params.google_civic_election_id;
    // console.log('OrganizationVoterGuideEdit, componentDidMount, this.props.params.organization_we_vote_id: ', organizationWeVoteId, ', this.props.params.google_civic_election_id: ', googleCivicElectionId);

    let tryToCreateVoterGuide = false;
    let continueLookingForLocalVoterGuide = true;
    if (organizationWeVoteId) {
      OrganizationActions.organizationRetrieve(organizationWeVoteId);
    }
    if (organizationWeVoteId && googleCivicElectionId) {
      // Simplest case where we get both variables
      const voterGuide = VoterGuideStore.getVoterGuideForOrganizationIdAndElection(organizationWeVoteId, googleCivicElectionId);
      // console.log('voterGuide: ', voterGuide);
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
        googleCivicElectionId = VoterStore.electionId();
      }
      // console.log('componentDidMount googleCivicElectionId:', googleCivicElectionId);

      // Now that we have gathered the org id or election id from local stores, try getting the Voter Guide again
      if (organizationWeVoteId && googleCivicElectionId) {
        // Simplest case where we get both variables
        const voterGuide = VoterGuideStore.getVoterGuideForOrganizationIdAndElection(organizationWeVoteId, googleCivicElectionId);
        // console.log('voterGuide: ', voterGuide);
        if (voterGuide && voterGuide.we_vote_id && isProperlyFormattedVoterGuideWeVoteId(voterGuide.we_vote_id)) {
          historyPush(`/vg/${voterGuide.we_vote_id}/settings/positions`);
        } else {
          tryToCreateVoterGuide = true;
        }
      }
    }

    this.setState({
      googleCivicElectionId,
      organizationWeVoteId,
    });

    // console.log('OrganizationVoterGuideEdit, componentDidMount, googleCivicElectionId:', googleCivicElectionId);
    if (tryToCreateVoterGuide && googleCivicElectionId) {
      // We only pass the election id since you can only create voter guides for your self
      // console.log('OrganizationVoterGuideEdit, componentDidMount, calling VoterGuideActions.voterGuideSave(googleCivicElectionId)');
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
    const voter = VoterStore.getVoter();
    const voterGuideSaveResults = VoterGuideStore.getVoterGuideSaveResults();
    // console.log('onVoterGuideStoreChange voterGuideSaveResults:', voterGuideSaveResults);
    if (voterGuideSaveResults && voter && voterGuideSaveResults.organization_we_vote_id === voter.linked_organization_we_vote_id) {
      this.goToVoterGuideForDifferentElection(voterGuideSaveResults.we_vote_id);
    } else {
      const { organizationWeVoteId } = this.state;
      VoterGuideStore.getVoterGuideForOrganizationId(organizationWeVoteId);
    }
  }

  onVoterStoreChange () {
    this.setState({
      voter: VoterStore.getVoter(),
    });
    let { googleCivicElectionId } = this.state;
    if (!googleCivicElectionId) {
      googleCivicElectionId = VoterStore.electionId();
      if (googleCivicElectionId) {
        this.setState({
          googleCivicElectionId,
        });
        VoterGuideActions.voterGuideSave(googleCivicElectionId);
        // console.log('onVoterStoreChange New googleCivicElectionId found: ', googleCivicElectionId);
        // When the result comes back from voterGuideSave, onVoterGuideStoreChange triggers a call to goToVoterGuideForDifferentElection
      }
    }
    // console.log('onVoterStoreChange googleCivicElectionId at end:', googleCivicElectionId);
  }

  onOrganizationStoreChange () {
    const { organizationWeVoteId } = this.state;
    this.setState({
      organization: OrganizationStore.getOrganizationByWeVoteId(organizationWeVoteId),
    });
    let { googleCivicElectionId } = this.state;
    if (!googleCivicElectionId) {
      googleCivicElectionId = VoterStore.electionId();
      if (googleCivicElectionId) {
        this.setState({
          googleCivicElectionId,
        });
        VoterGuideActions.voterGuideSave(googleCivicElectionId);
        // console.log('onOrganizationStoreChange New googleCivicElectionId found: ', googleCivicElectionId);
        // When the result comes back from voterGuideSave, onVoterGuideStoreChange triggers a call to goToVoterGuideForDifferentElection
      }
    }
    // console.log('onOrganizationStoreChange googleCivicElectionId at end:', googleCivicElectionId);
  }

  goToVoterGuideForDifferentElection = (voterGuideWeVoteId) => {
    const voterGuideBallotItems = `/vg/${voterGuideWeVoteId}/settings/positions`;
    historyPush(voterGuideBallotItems);
  };

  render () {
    renderLog('OrganizationVoterGuideEdit');  // Set LOG_RENDER_EVENTS to log all renders
    const { organization, organizationWeVoteId, voter } = this.state;
    // console.log('organization:', organization, ', organizationWeVoteId:', organizationWeVoteId, ', voter:', voter);
    if (!organization || !organizationWeVoteId || !voter) {
      return <div>{LoadingWheel}</div>;
    }

    const isVoterOwner = organizationWeVoteId && organizationWeVoteId === voter.linked_organization_we_vote_id;
    // console.log('isVoterOwner:', isVoterOwner);

    if (!isVoterOwner) {
      return <div>{LoadingWheel}</div>;
    }

    // This component is to redirect to the voter guide for this organization for this election
    return null;
  }
}
OrganizationVoterGuideEdit.propTypes = {
  params: PropTypes.object.isRequired,
};
