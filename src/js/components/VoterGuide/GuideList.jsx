import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CandidateStore from '../../stores/CandidateStore';
import FollowToggle from '../Widgets/FollowToggle';
import MeasureStore from '../../stores/MeasureStore';
import { stringContains } from '../../utils/textFormat';
import VoterGuideDisplayForList from './VoterGuideDisplayForList';
import { renderLog } from '../../utils/logging';
import EndorsementCard from '../Widgets/EndorsementCard';
import { openSnackbar } from '../Widgets/SnackNotifier';

export default class GuideList extends Component {
  static propTypes = {
    ballotItemWeVoteId: PropTypes.string,
    incomingVoterGuideList: PropTypes.array,
    instantRefreshOn: PropTypes.bool,
  };

  constructor (props) {
    super(props);
    this.state = {
      filteredOrganizationsWithPositions: [],
      voterGuideList: [],
      voterGuideListCount: 0,
      ballotItemWeVoteId: '',
    };
  }

  componentDidMount () {
    // console.log('GuideList componentDidMount');
    const { ballotItemWeVoteId } = this.state;
    const voterGuideList = this.sortOrganizations(this.props.incomingVoterGuideList, ballotItemWeVoteId);
    let voterGuideListCount = 0;
    if (voterGuideList) {
      voterGuideListCount = voterGuideList.length;
    }
    this.setState({
      voterGuideList,
      voterGuideListCount,
      ballotItemWeVoteId: this.props.ballotItemWeVoteId,
    }, () => {
      const organizationsWithPositions = this.getOrganizationsWithPositions();
      let filteredOrganizationsWithPositionsCount = 0;
      if (organizationsWithPositions) {
        filteredOrganizationsWithPositionsCount = organizationsWithPositions.length;
      }
      this.setState({
        filteredOrganizationsWithPositions: organizationsWithPositions,
        filteredOrganizationsWithPositionsCount,
      });
    });
  }

  componentWillReceiveProps (nextProps) {
    // console.log('GuideList componentWillReceiveProps');
    // Do not update the state if the voterGuideList list looks the same, and the ballotItemWeVoteId hasn't changed
    const { ballotItemWeVoteId } = this.state;
    const voterGuideList = this.sortOrganizations(nextProps.incomingVoterGuideList, ballotItemWeVoteId);
    let voterGuideListCount = 0;
    if (voterGuideList) {
      voterGuideListCount = voterGuideList.length;
    }
    this.setState({
      voterGuideList,
      voterGuideListCount,
      ballotItemWeVoteId: this.props.ballotItemWeVoteId,
    }, () => {
      const organizationsWithPositions = this.getOrganizationsWithPositions();
      let filteredOrganizationsWithPositionsCount = 0;
      if (organizationsWithPositions) {
        filteredOrganizationsWithPositionsCount = organizationsWithPositions.length;
      }
      this.setState({
        filteredOrganizationsWithPositions: organizationsWithPositions,
        filteredOrganizationsWithPositionsCount,
      });
    });
  }

  shouldComponentUpdate (nextProps, nextState) {
    if (this.state.filteredOrganizationsWithPositionsCount !== nextState.filteredOrganizationsWithPositionsCount) {
      return true;
    }
    if (this.state.voterGuideListCount !== nextState.voterGuideListCount) {
      return true;
    }
    if (this.state.ballotItemWeVoteId !== nextState.ballotItemWeVoteId) {
      return true;
    }
    return false;
  }

  getOrganizationsWithPositions = () => this.state.voterGuideList.map((organization) => {
    let organizationPositionForThisBallotItem;
    if (stringContains('cand', this.state.ballotItemWeVoteId)) {
      organizationPositionForThisBallotItem = CandidateStore.getPositionAboutCandidateFromOrganization(this.state.ballotItemWeVoteId, organization.organization_we_vote_id);
      // console.log({ ...organizationPositionForThisBallotItem, ...organization });
    } else if (stringContains('meas', this.state.ballotItemWeVoteId)) {
      organizationPositionForThisBallotItem = MeasureStore.getPositionAboutMeasureFromOrganization(this.state.ballotItemWeVoteId, organization.organization_we_vote_id);
    }
    return { ...organizationPositionForThisBallotItem, ...organization };
  });

  sortOrganizations (organizationsList, ballotItemWeVoteId) {
    // console.log('sortOrganizations: ', organizationsList, 'ballotItemWeVoteId: ', ballotItemWeVoteId);
    if (organizationsList && ballotItemWeVoteId) {
      // console.log('Checking for resort');
      const arrayLength = organizationsList.length;
      let organization;
      let organizationPositionForThisBallotItem;
      const sortedOrganizations = [];
      for (let i = 0; i < arrayLength; i++) {
        organization = organizationsList[i];
        organizationPositionForThisBallotItem = null;
        if (ballotItemWeVoteId && organization.organization_we_vote_id) {
          if (stringContains('cand', ballotItemWeVoteId)) {
            organizationPositionForThisBallotItem = CandidateStore.getPositionAboutCandidateFromOrganization(ballotItemWeVoteId, organization.organization_we_vote_id);
          } else if (stringContains('meas', ballotItemWeVoteId)) {
            organizationPositionForThisBallotItem = MeasureStore.getPositionAboutMeasureFromOrganization(ballotItemWeVoteId, organization.organization_we_vote_id);
          }
        }
        if (organizationPositionForThisBallotItem && organizationPositionForThisBallotItem.statement_text) {
          // console.log('sortOrganizations unshift');
          sortedOrganizations.unshift(organization);
        } else {
          // console.log('sortOrganizations push');
          sortedOrganizations.push(organization);
        }
      }
      return sortedOrganizations;
    }
    return organizationsList;
  }

  handleIgnore (organizationWeVoteId) {
    const { voterGuideList } = this.state;
    // OrganizationActions.organizationFollowIgnore(organizationWeVoteId); // This is run within FollowToggle
    const newVoterGuideList = voterGuideList.filter(
      org => org.organization_we_vote_id !== organizationWeVoteId,
    );
    let voterGuideListCount = 0;
    if (newVoterGuideList) {
      voterGuideListCount = newVoterGuideList.length;
    }
    this.setState({
      voterGuideList: newVoterGuideList,
      voterGuideListCount,
    });
    openSnackbar({ message: 'Added to ignore list.' });
  }

  render () {
    renderLog('GuideList');  // Set LOG_RENDER_EVENTS to log all renders
    const { filteredOrganizationsWithPositions } = this.state;
    if (filteredOrganizationsWithPositions === undefined) {
      // console.log('GuideList this.state.organizations_to_follow === undefined');
      return null;
    }

    // console.log('GuideList voterGuideList: ', this.state.voterGuideList);

    if (!filteredOrganizationsWithPositions) {
      return (
        <div className="guidelist card-child__list-group">
          <div className="u-flex u-flex-column u-items-center">
            <div className="u-margin-top--sm u-stack--sm u-no-break">
              No results found.
            </div>
            <EndorsementCard
              className="btn endorsement-btn btn-sm"
              bsPrefix="u-margin-top--sm u-stack--xs"
              variant="primary"
              buttonText="Organization Missing?"
              text="Don't see an organization you want to follow?"
            />
          </div>
        </div>
      );
    }
    return (
      <div className="guidelist card-child__list-group">
        {filteredOrganizationsWithPositions.map((organization) => {
          const handleIgnoreFunc = () => {
            this.handleIgnore(organization.organization_we_vote_id);
          };

          return (
            <VoterGuideDisplayForList
              key={organization.organization_we_vote_id}
              {...organization}
            >
              <FollowToggle
                  organizationWeVoteId={organization.organization_we_vote_id}
                  handleIgnore={handleIgnoreFunc}
              />
            </VoterGuideDisplayForList>
          );
        })
        }
      </div>
    );
  }
}
