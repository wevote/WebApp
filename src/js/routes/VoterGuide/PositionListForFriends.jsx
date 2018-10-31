import React, { Component } from "react";
import PropTypes from "prop-types";
import FollowToggle from "../../components/Widgets/FollowToggle";
import { renderLog } from "../../utils/logging";
import OrganizationActions from "../../actions/OrganizationActions";
import OrganizationCard from "../../components/VoterGuide/OrganizationCard";
import OrganizationStore from "../../stores/OrganizationStore";
import OrganizationPositionItem from "../../components/VoterGuide/OrganizationPositionItem";
import LoadingWheel from "../../components/LoadingWheel";
import ThisIsMeAction from "../../components/Widgets/ThisIsMeAction";
import SearchAllActions from "../../actions/SearchAllActions";

export default class PositionListForFriends extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = { organization_we_vote_id: this.props.params.organization_we_vote_id };
  }

  componentDidMount (){
    this.organizationStoreListener = OrganizationStore.addListener(this._onOrganizationStoreChange.bind(this));

    var { organization_we_vote_id } = this.state;

    OrganizationActions.organizationRetrieve(organization_we_vote_id);
    // Positions for this organization, for this voter / election
    OrganizationActions.positionListForOpinionMakerForFriends(organization_we_vote_id, true);
    // Positions for this organization, NOT including for this voter / election
    OrganizationActions.positionListForOpinionMakerForFriends(organization_we_vote_id, false, true);

    // Display the organization's name in the search box
    // var { organization } = this.state;
    // var searchBoxText = organization.organization_name || "";  // TODO DALE Not working right now
    // exitSearch(searchBoxText);
    SearchAllActions.exitSearch();
  }

  componentWillReceiveProps (nextProps) {
    // When a new candidate is passed in, update this component to show the new data
    this.setState({organization_we_vote_id: nextProps.params.organization_we_vote_id});

    OrganizationActions.organizationRetrieve(nextProps.params.organization_we_vote_id);
    // Positions for this organization, for this voter / election
    OrganizationActions.positionListForOpinionMakerForFriends(nextProps.params.organization_we_vote_id, true);
    // Positions for this organization, NOT including for this voter / election
    OrganizationActions.positionListForOpinionMakerForFriends(nextProps.params.organization_we_vote_id, false, true);

    // Display the candidate's name in the search box
    // var { candidate } = this.state;
    // var searchBoxText = candidate.ballot_item_display_name || "";  // TODO DALE Not working right now
    SearchAllActions.exitSearch();
  }

  componentWillUnmount (){
    this.organizationStoreListener.remove();
  }

  _onOrganizationStoreChange (){
    var { organization_we_vote_id } = this.state;
    this.setState({ organization: OrganizationStore.getOrganizationByWeVoteId(organization_we_vote_id)});
  }

  render () {
    renderLog(__filename);
    if (!this.state.organization){
      return <div>{LoadingWheel}</div>;
    }

    const { friends_position_list_for_one_election, friends_position_list_for_all_except_one_election } = this.state.organization;
    var { organization_we_vote_id } = this.state;

    return <span>

        <div className="card">
          <div className="card-main">
            <FollowToggle organizationWeVoteId={organization_we_vote_id} />
            <OrganizationCard organization={this.state.organization} />
          </div>
          <ul className="list-group">
            { friends_position_list_for_one_election ?
              friends_position_list_for_one_election.map( item => {
                return <OrganizationPositionItem key={item.position_we_vote_id}
                                                 position={item}
                                                 organization={this.state.organization} />;
              }) :
              <div>{LoadingWheel}</div>
            }
            { friends_position_list_for_all_except_one_election ?
              <span>
                { friends_position_list_for_all_except_one_election.length ?
                  <span>
                    <br />
                    <h4 className="card__additional-heading">Positions for Other Elections</h4>
                  </span> :
                  <span />
                }
                { friends_position_list_for_all_except_one_election.map( item => {
                  return <OrganizationPositionItem key={item.position_we_vote_id}
                                                   position={item}
                                                   organization={this.state.organization} />;
                }) }
              </span> :
              <div>{LoadingWheel}</div>
            }
          </ul>
        </div>
        <br />
        <ThisIsMeAction twitter_handle_being_viewed={this.state.organization.organization_twitter_handle}
                        name_being_viewed={this.state.organization.organization_name}
                        kind_of_owner="ORGANIZATION" />
        <br />
      </span>;
  }
}
