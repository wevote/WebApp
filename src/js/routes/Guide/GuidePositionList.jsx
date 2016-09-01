import React, { Component, PropTypes } from "react";
import FollowToggle from "../../components/Widgets/FollowToggle";
import OrganizationActions from "../../actions/OrganizationActions";
import OrganizationCard from "../../components/VoterGuide/OrganizationCard";
import OrganizationStore from "../../stores/OrganizationStore";
import OrganizationPositionItem from "../../components/VoterGuide/OrganizationPositionItem";
import LoadingWheel from "../../components/LoadingWheel";
import ThisIsMeAction from "../../components/Widgets/ThisIsMeAction";
import { exitSearch } from "../../utils/search-functions";

/* VISUAL DESIGN HERE: https://projects.invisionapp.com/share/2R41VR3XW#/screens/94226088 */

export default class GuidePositionList extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = { we_vote_id: this.props.params.we_vote_id };
  }

  componentDidMount (){
    this.organizationStoreListener = OrganizationStore.addListener(this._onOrganizationStoreChange.bind(this));

    var { we_vote_id } = this.state;

    OrganizationActions.retrieve(we_vote_id);
    // Positions for this organization, for this voter / election
    OrganizationActions.retrievePositions(we_vote_id, true);
    // Positions for this organization, NOT including for this voter / election
    OrganizationActions.retrievePositions(we_vote_id, false, true);

    // Display the organization's name in the search box
    // var { organization } = this.state;
    // var searchBoxText = organization.organization_name || "";  // TODO DALE Not working right now
    // exitSearch(searchBoxText);
    exitSearch("");
  }

  componentWillReceiveProps (nextProps) {
    // When a new candidate is passed in, update this component to show the new data
    this.setState({we_vote_id: nextProps.params.we_vote_id});

    OrganizationActions.retrieve(nextProps.params.we_vote_id);
    // Positions for this organization, for this voter / election
    OrganizationActions.retrievePositions(nextProps.params.we_vote_id, true);
    // Positions for this organization, NOT including for this voter / election
    OrganizationActions.retrievePositions(nextProps.params.we_vote_id, false, true);

    // Display the candidate's name in the search box
    // var { candidate } = this.state;
    // var searchBoxText = candidate.ballot_item_display_name || "";  // TODO DALE Not working right now
    exitSearch("");
  }

  componentWillUnmount (){
    this.organizationStoreListener.remove();
  }

  _onOrganizationStoreChange (){
    var { we_vote_id } = this.state;
    this.setState({ organization: OrganizationStore.get(we_vote_id)});
  }

  render () {
    if (!this.state.organization){
      return <div>{LoadingWheel}</div>;
    }

    const { position_list_for_one_election, position_list_for_all_except_one_election } = this.state.organization;
    var { we_vote_id } = this.state;
    // console.log("position list for one election:", position_list_for_one_election);
    return <span>
        <div className="card__container">
          <div className="card__main">
            <FollowToggle we_vote_id={we_vote_id} />
            <OrganizationCard organization={this.state.organization} />
          </div>
          <ul className="list-group">
            { position_list_for_one_election ?
              position_list_for_one_election.map( item => {
                return <OrganizationPositionItem key={item.position_we_vote_id}
                                                 position={item}
                                                 organization={this.state.organization}

                                                 popover_off />;
              }) :
              <div>{LoadingWheel}</div>
            }
            { position_list_for_all_except_one_election ?
              <span>
                { position_list_for_all_except_one_election.length ?
                  <span>
                    <br />
                    <h4>Positions for Other Elections</h4>
                  </span> :
                  <span></span>
                }
                { position_list_for_all_except_one_election.map( item => {
                  return <OrganizationPositionItem key={item.position_we_vote_id}
                                                   position={item}
                                                   organization={this.state.organization}
                                                   popover_off />;
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
