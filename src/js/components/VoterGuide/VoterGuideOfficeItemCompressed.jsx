import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { toTitleCase } from '../../utils/textFormat';
import CandidateStore from '../../stores/CandidateStore';
import IssueStore from '../../stores/IssueStore';
import { renderLog } from '../../utils/logging';
import OrganizationStore from '../../stores/OrganizationStore';
import SupportStore from '../../stores/SupportStore';
import VoterGuidePositionItem from './VoterGuidePositionItem';
import VoterGuideStore from '../../stores/VoterGuideStore';


// This is based on components/Ballot/OfficeItemCompressed
export default class VoterGuideOfficeItemCompressed extends Component {
  static propTypes = {
    we_vote_id: PropTypes.string.isRequired,
    ballot_item_display_name: PropTypes.string.isRequired,
    candidate_list: PropTypes.array,
    organizationWeVoteId: PropTypes.string.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = {
      candidateList: [],
      displayAllCandidatesFlag: false,
      organization: {},
      organizationWeVoteId: '',
    };

    this.closeYourNetworkIsUndecidedPopover = this.closeYourNetworkIsUndecidedPopover.bind(this);
    this.closeYourNetworkSupportsPopover = this.closeYourNetworkSupportsPopover.bind(this);
    this.closeHighestIssueScorePopover = this.closeHighestIssueScorePopover.bind(this);
    // this.getCandidateLink = this.getCandidateLink.bind(this);
    // this.getOfficeLink = this.getOfficeLink.bind(this);
    // this.goToCandidateLink = this.goToCandidateLink.bind(this);
    // this.goToOfficeLink = this.goToOfficeLink.bind(this);
    this.toggleDisplayAllCandidates = this.toggleDisplayAllCandidates.bind(this);
  }

  componentDidMount () {
    this.candidateStoreListener = CandidateStore.addListener(this.onCandidateStoreChange.bind(this));
    this.issueStoreListener = IssueStore.addListener(this.onIssueStoreChange.bind(this));
    this.organizationStoreListener = OrganizationStore.addListener(this.onOrganizationStoreChange.bind(this));
    this.supportStoreListener = SupportStore.addListener(this.onSupportStoreChange.bind(this));
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));
    this.onVoterGuideStoreChange();
    this.onCandidateStoreChange();
    this.setState({
      organizationWeVoteId: this.props.organizationWeVoteId,
    });
    if (this.props.organizationWeVoteId) {
      const organization = OrganizationStore.getOrganizationByWeVoteId(this.props.organizationWeVoteId);
      this.setState({
        organization,
      });
    }
  }

  componentWillReceiveProps (nextProps) {
    // console.log('officeItemCompressed componentWillReceiveProps, nextProps.candidate_list:', nextProps.candidate_list);
    // 2018-05-10 I don't think we need to trigger a new render because the incoming candidate_list should be the same
    // if (nextProps.candidate_list && nextProps.candidate_list.length) {
    //   this.setState({
    //     candidateList: nextProps.candidate_list,
    //   });
    // }
    this.setState({
      organizationWeVoteId: nextProps.organizationWeVoteId,
    });

    if (nextProps.organizationWeVoteId) {
      const organization = OrganizationStore.getOrganizationByWeVoteId(nextProps.organizationWeVoteId);
      this.setState({
        organization,
      });
    }
  }

  componentWillUnmount () {
    this.candidateStoreListener.remove();
    this.issueStoreListener.remove();
    this.organizationStoreListener.remove();
    this.supportStoreListener.remove();
    this.voterGuideStoreListener.remove();
  }

  onCandidateStoreChange () {
    if (this.props.candidate_list && this.props.candidate_list.length && this.props.we_vote_id) {
      // console.log('onCandidateStoreChange');
      const newCandidateList = [];
      this.props.candidate_list.forEach((candidate) => {
        if (candidate && candidate.we_vote_id) {
          newCandidateList.push(CandidateStore.getCandidate(candidate.we_vote_id));
        }
      });
      this.setState({
        candidateList: newCandidateList,
      });
      // console.log(this.props.candidate_list);
    }
  }

  onIssueStoreChange () {
    this.setState();
  }

  onVoterGuideStoreChange () {
    this.setState();
  }

  onOrganizationStoreChange () {
    const { organizationWeVoteId } = this.state;
    // console.log('VoterGuideOfficeItemCompressed onOrganizationStoreChange, organizationWeVoteId: ', organizationWeVoteId);
    if (organizationWeVoteId) {
      const organization = OrganizationStore.getOrganizationByWeVoteId(organizationWeVoteId);
      this.setState({
        organization,
      });
    }
  }

  onSupportStoreChange () {
    const { organizationWeVoteId } = this.state;
    // Whenever positions change, we want to make sure to get the latest organization, because it has
    //  position_list_for_one_election and position_list_for_all_except_one_election attached to it
    if (organizationWeVoteId) {
      const organization = OrganizationStore.getOrganizationByWeVoteId(organizationWeVoteId);
      this.setState({
        organization,
      });
    }
  }
  //
  // getCandidateLink (candidateWeVoteId) {
  //   return `/candidate/${candidateWeVoteId}/btvg/${this.state.organization.organization_we_vote_id}`;
  // }
  //
  // getOfficeLink () {
  //   return `/office/${this.props.we_vote_id}/btvg/${this.state.organization.organization_we_vote_id}`;
  // }

  getOrganizationPositionForThisCandidate (candidateWeVoteId, positionListForOneElection) {
    // console.log('getOrganizationPositionForThisCandidate position_list_for_one_election: ', position_list_for_one_election);
    let onePositionToReturn = {};
    if (positionListForOneElection) {
      positionListForOneElection.forEach((position) => {
        // console.log('getOrganizationPositionForThisCandidate candidateWeVoteId: ', candidateWeVoteId, ', one_position: ', one_position);
        if (position.ballot_item_we_vote_id === candidateWeVoteId) {
          // console.log('getOrganizationPositionForThisCandidate one_position found to return');
          // Because this is a forEach, we aren't able to break out of the loop
          onePositionToReturn = position;
        }
      });
    }

    return onePositionToReturn;
  }

  toggleDisplayAllCandidates () {
    const { displayAllCandidatesFlag } = this.state;
    this.setState({ displayAllCandidatesFlag: !displayAllCandidatesFlag });
  }

  // goToCandidateLink (candidateWeVoteId) {
  //   const candidateLink = this.getCandidateLink(candidateWeVoteId);
  //   historyPush(candidateLink);
  // }
  //
  // goToOfficeLink () {
  //   const officeLink = this.getOfficeLink();
  //   historyPush(officeLink);
  // }

  closeYourNetworkSupportsPopover () {
    this.refs['supports-overlay'].hide(); // eslint-disable-line react/no-string-refs
  }

  closeHighestIssueScorePopover () {
    this.refs['highest-issue-score-overlay'].hide(); // eslint-disable-line react/no-string-refs
  }

  closeYourNetworkIsUndecidedPopover () {
    this.refs['undecided-overlay'].hide(); // eslint-disable-line react/no-string-refs
  }

  render () {
    renderLog('VoterGuideOfficeItemCompressed');  // Set LOG_RENDER_EVENTS to log all renders
    let { ballot_item_display_name: ballotItemDisplayName } = this.props;
    const { we_vote_id: weVoteId } = this.props;
    const { organization, organizationWeVoteId } = this.state;

    ballotItemDisplayName = toTitleCase(ballotItemDisplayName);

    let orgPositionForCandidate;
    let candidateWeVoteId;
    let positionList = [];
    if (organization.position_list_for_one_election) {
      positionList = organization.position_list_for_one_election;
    } else if (organization.position_list) {
      positionList = organization.position_list;
    }

    // console.log('organization:', organization);
    return (
      <div className="card-main office-item">
        <a // eslint-disable-line
          className="anchor-under-header"
          name={weVoteId}
        />
        <div className="card-main__content">
          {/* Desktop */}
          {/* On the voter guide, we bring the size of the office name down so we can emphasize the candidate being supported */}
          <h2 className="h4 u-f5 card-main__ballot-name u-gray-dark u-stack--sm">
            {ballotItemDisplayName}
          </h2>
          <div>
            { this.state.candidateList.map((oneCandidate) => {
              if (!oneCandidate || !oneCandidate.we_vote_id) {
                return null;
              }

              if (OrganizationStore.doesOrganizationHavePositionOnBallotItem(organizationWeVoteId, oneCandidate.we_vote_id)) {
                orgPositionForCandidate = this.getOrganizationPositionForThisCandidate(oneCandidate.we_vote_id, positionList);
                // console.log('orgPositionForCandidate:', orgPositionForCandidate);

                if (orgPositionForCandidate) {
                  candidateWeVoteId = oneCandidate.we_vote_id;

                  return (
                    <div key={candidateWeVoteId}>
                      {/* Organization Endorsement */}
                      {/* <VoterGuidePositionItemWrapper key={`VoterGuidePositionItem-${item.position_we_vote_id}`}>
                      </VoterGuidePositionItemWrapper> */}
                      <VoterGuidePositionItem
                        organizationWeVoteId={organizationWeVoteId}
                        position={orgPositionForCandidate}
                      />
                      {/*
                      <OrganizationPositionItem
                        editMode={this.state.editMode}
                        key={orgPositionForCandidate.position_we_vote_id}
                        organizationWeVoteId={organizationWeVoteId}
                        position={orgPositionForCandidate}
                      />
                      */}
                    </div>
                  );
                }
              }
              return null;
            })
          }
          </div>
        </div>
      </div>
    );
  }
}

// const VoterGuidePositionItemWrapper = styled.div`
//   margin-bottom: 10px;
// `;
