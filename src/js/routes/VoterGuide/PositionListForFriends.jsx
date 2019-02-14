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
import SearchAllActions from '../../actions/SearchAllActions';

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

    SearchAllActions.exitSearch();
  }

  componentWillReceiveProps (nextProps) {
    // When a new candidate is passed in, update this component to show the new data
    this.setState({ organizationWeVoteId: nextProps.params.organization_we_vote_id });

    OrganizationActions.organizationRetrieve(nextProps.params.organization_we_vote_id);
    // Positions for this organization, for this voter / election
    OrganizationActions.positionListForOpinionMakerForFriends(nextProps.params.organization_we_vote_id, true);
    // Positions for this organization, NOT including for this voter / election
    OrganizationActions.positionListForOpinionMakerForFriends(nextProps.params.organization_we_vote_id, false, true);

    SearchAllActions.exitSearch();
  }

  componentWillUnmount () {
    this.organizationStoreListener.remove();
  }

  onOrganizationStoreChange () {
    const { organizationWeVoteId } = this.state;
    this.setState({ organization: OrganizationStore.getOrganizationByWeVoteId(organizationWeVoteId) });
  }

  render () {
    renderLog(__filename);
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
            <FollowToggle organizationWeVoteId={organizationWeVoteId} />
            <OrganizationCard organization={this.state.organization} />
          </div>
          <ul className="list-group">
            { friendsPositionListForOneElection ?
              friendsPositionListForOneElection.map(item => (
                <OrganizationPositionItem
                  key={item.position_we_vote_id}
                  position={item}
                  organization={this.state.organization}
                />
              )) :
              <div>{LoadingWheel}</div>
            }
            { friendsPositionListForAllExceptOneElection ? (
              <span>
                { friendsPositionListForAllExceptOneElection.length ? (
                  <span>
                    <br />
                    <h4 className="card__additional-heading">Positions for Other Elections</h4>
                  </span>
                ) :
                  <span />
                }
                { friendsPositionListForAllExceptOneElection.map(item => (
                  <OrganizationPositionItem
                    key={item.position_we_vote_id}
                    position={item}
                    organization={this.state.organization}
                  />))
                }
              </span>
            ) :
              <div>{LoadingWheel}</div>
            }
          </ul>
        </div>
        <br />
        <ThisIsMeAction
          twitter_handle_being_viewed={this.state.organization.organization_twitter_handle}
          name_being_viewed={this.state.organization.organization_name}
          kind_of_owner="ORGANIZATION"
        />
        <br />
      </span>
    );
  }
}
