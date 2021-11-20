import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import OrganizationActions from '../../actions/OrganizationActions';
import LoadingWheel from '../../components/LoadingWheel';
import OrganizationCard from '../../components/VoterGuide/OrganizationCard';
import OrganizationPositionItem from '../../components/VoterGuide/OrganizationPositionItem';
import ThisIsMeAction from '../../components/Widgets/ThisIsMeAction';
import OrganizationStore from '../../stores/OrganizationStore';
import { renderLog } from '../../utils/logging';

const FollowToggle = React.lazy(() => import(/* webpackChunkName: 'FollowToggle' */ '../../components/Widgets/FollowToggle'));

export default class PositionListForFriends extends Component {
  constructor (props) {
    super(props);
    const { params } = this.props;
    this.state = { organizationWeVoteId: params.organization_we_vote_id };
  }

  componentDidMount () {
    this.organizationStoreListener = OrganizationStore.addListener(this.onOrganizationStoreChange.bind(this));

    const { organizationWeVoteId } = this.state;

    OrganizationActions.organizationRetrieve(organizationWeVoteId);
    // Positions for this organization, for this voter / election
    OrganizationActions.positionListForOpinionMakerForFriends(organizationWeVoteId, true);
    // Positions for this organization, NOT including for this voter / election
    OrganizationActions.positionListForOpinionMakerForFriends(organizationWeVoteId, false, true);
  }

  // eslint-disable-next-line camelcase, react/sort-comp, react/prop-types
  UNSAFE_componentWillReceiveProps (nextProps) {
    const { params: nextParams } = nextProps;
    // eslint-disable react/sort-comp, react/prop-types
    // When a new candidate is passed in, update this component to show the new data
    // eslint-disable-next-line camelcase, react/sort-comp, react/prop-types
    this.setState({ organizationWeVoteId: nextParams.organization_we_vote_id });

    // eslint-disable-next-line camelcase, react/sort-comp, react/prop-types
    OrganizationActions.organizationRetrieve(nextParams.organization_we_vote_id);
    // Positions for this organization, for this voter / election
    OrganizationActions.positionListForOpinionMakerForFriends(nextParams.organization_we_vote_id, true);
    // Positions for this organization, NOT including for this voter / election
    OrganizationActions.positionListForOpinionMakerForFriends(nextParams.organization_we_vote_id, false, true);
  }
  // eslint-enable camelcase, react/sort-comp, react/prop-types

  componentWillUnmount () {
    this.organizationStoreListener.remove();
  }

  onOrganizationStoreChange () {
    const { organizationWeVoteId } = this.state;
    this.setState({ organization: OrganizationStore.getOrganizationByWeVoteId(organizationWeVoteId) });
  }

  render () {
    renderLog('PositionListForFriends');  // Set LOG_RENDER_EVENTS to log all renders
    if (!this.state.organization) {
      return <div>{LoadingWheel}</div>;
    }

    const { friends_position_list_for_one_election: friendsPositionListForOneElection,
      friends_position_list_for_all_except_one_election: friendsPositionListForAllExceptOneElection } = this.state.organization;
    const { organizationWeVoteId } = this.state;

    return (
      <span>
        <div className="card">
          <div className="card-main">
            <OrganizationCard organization={this.state.organization} />
            <Suspense fallback={<></>}>
              <FollowToggle organizationWeVoteId={organizationWeVoteId} />
            </Suspense>
          </div>
          <ul className="list-group">
            { friendsPositionListForOneElection ?
              friendsPositionListForOneElection.map((item) => (
                <OrganizationPositionItem
                  key={item.position_we_vote_id}
                  position={item}
                  organizationWeVoteId={organizationWeVoteId}
                />
              )) :
              <div>{LoadingWheel}</div>}
            { friendsPositionListForAllExceptOneElection ? (
              <span>
                { friendsPositionListForAllExceptOneElection.length ? (
                  <span>
                    <br />
                    <h4 className="card__additional-heading">Endorsements for Other Elections</h4>
                  </span>
                ) :
                  <span />}
                { friendsPositionListForAllExceptOneElection.map((item) => (
                  <OrganizationPositionItem
                    key={item.position_we_vote_id}
                    position={item}
                    organizationWeVoteId={organizationWeVoteId}
                  />
                ))}
              </span>
            ) :
              <div>{LoadingWheel}</div>}
          </ul>
        </div>
        <br />
        <ThisIsMeAction
          twitterHandleBeingViewed={this.state.organization.organization_twitter_handle}
          nameBeingViewed={this.state.organization.organization_name}
          kindOfOwner="ORGANIZATION"
        />
        <br />
      </span>
    );
  }
}
PositionListForFriends.propTypes = {
  params: PropTypes.object.isRequired,
};
