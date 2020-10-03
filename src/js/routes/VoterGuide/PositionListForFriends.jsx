import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FollowToggle from '../../components/Widgets/FollowToggle';
import { renderLog } from '../../utils/logging';
import OrganizationActions from '../../actions/OrganizationActions';
import OrganizationCard from '../../components/VoterGuide/OrganizationCard';
import OrganizationStore from '../../stores/OrganizationStore';
import OrganizationPositionItem from '../../components/VoterGuide/OrganizationPositionItem';
import LoadingWheel from '../../components/LoadingWheel';
import ThisIsMeAction from '../../components/Widgets/ThisIsMeAction';

export default class PositionListForFriends extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = { organizationWeVoteId: this.props.params.organization_we_vote_id };
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

  UNSAFE_componentWillReceiveProps (nextProps) {
    // When a new candidate is passed in, update this component to show the new data
    this.setState({ organizationWeVoteId: nextProps.params.organization_we_vote_id });

    OrganizationActions.organizationRetrieve(nextProps.params.organization_we_vote_id);
    // Positions for this organization, for this voter / election
    OrganizationActions.positionListForOpinionMakerForFriends(nextProps.params.organization_we_vote_id, true);
    // Positions for this organization, NOT including for this voter / election
    OrganizationActions.positionListForOpinionMakerForFriends(nextProps.params.organization_we_vote_id, false, true);
  }

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
            <FollowToggle organizationWeVoteId={organizationWeVoteId} />
          </div>
          <ul className="list-group">
            { friendsPositionListForOneElection ?
              friendsPositionListForOneElection.map(item => (
                <OrganizationPositionItem
                  key={item.position_we_vote_id}
                  position={item}
                  organizationWeVoteId={organizationWeVoteId}
                />
              )) :
              <div>{LoadingWheel}</div>
            }
            { friendsPositionListForAllExceptOneElection ? (
              <span>
                { friendsPositionListForAllExceptOneElection.length ? (
                  <span>
                    <br />
                    <h4 className="card__additional-heading">Endorsements for Other Elections</h4>
                  </span>
                ) :
                  <span />
                }
                { friendsPositionListForAllExceptOneElection.map(item => (
                  <OrganizationPositionItem
                    key={item.position_we_vote_id}
                    position={item}
                    organizationWeVoteId={organizationWeVoteId}
                  />
                ))
                }
              </span>
            ) :
              <div>{LoadingWheel}</div>
            }
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
