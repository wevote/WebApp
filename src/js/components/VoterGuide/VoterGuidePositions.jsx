import React, {Component, PropTypes } from "react";
import { capitalizeString } from "../../utils/textFormat";
import Helmet from "react-helmet";
import BallotStore from "../../stores/BallotStore";
import VoterGuideActions from "../../actions/VoterGuideActions";
import OrganizationActions from "../../actions/OrganizationActions";
import OrganizationStore from "../../stores/OrganizationStore";
import OrganizationPositionItem from "./OrganizationPositionItem";
import SupportStore from "../../stores/SupportStore";
import VoterGuideRecommendationsFromOneOrganization from "./VoterGuideRecommendationsFromOneOrganization";
import VoterStore from "../../stores/VoterStore";

export default class VoterGuidePositions extends Component {
  static propTypes = {
    organization: PropTypes.object.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = {
      current_google_civic_election_id: 0,
      current_organization_we_vote_id: "",
      editMode: false,
      organization: {},
      voter: {},
    };
  }

  componentDidMount (){
    // console.log("VoterGuidePositions, componentDidMount, this.props.organization: ", this.props.organization);
    this.organizationStoreListener = OrganizationStore.addListener(this._onOrganizationStoreChange.bind(this));
    this.supportStoreListener = SupportStore.addListener(this.onSupportStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this._onVoterStoreChange.bind(this));
    VoterGuideActions.voterGuidesRecommendedByOrganizationRetrieve(this.props.organization.organization_we_vote_id, VoterStore.election_id());
    // TODO: COMMENT OUT because they were added to OrganizationVoterGuideTabs?
    // Positions for this organization, for this voter / election
    OrganizationActions.positionListForOpinionMaker(this.props.organization.organization_we_vote_id, true);
    // Positions for this organization, NOT including for this voter / election
    OrganizationActions.positionListForOpinionMaker(this.props.organization.organization_we_vote_id, false, true);
    this.setState({
      current_google_civic_election_id: VoterStore.election_id(),
      current_organization_we_vote_id: this.props.organization.organization_we_vote_id,
      organization: this.props.organization,
      voter: VoterStore.getVoter(),
    });
  }

  componentWillReceiveProps (nextProps) {
    // console.log("VoterGuidePositions componentWillReceiveProps");
    // When a new organization is passed in, update this component to show the new data
    let different_election = this.state.current_google_civic_election_id !== VoterStore.election_id();
    let different_organization = this.state.current_organization_we_vote_id !== nextProps.organization.organization_we_vote_id;
    // console.log("VoterGuidePositions componentWillReceiveProps-different_election: ", different_election, " different_organization: ", different_organization);
    if (different_election || different_organization) {
      // console.log("VoterGuidePositions, componentWillReceiveProps, nextProps.organization: ", nextProps.organization);
      VoterGuideActions.voterGuidesRecommendedByOrganizationRetrieve(nextProps.organization.organization_we_vote_id, VoterStore.election_id());
      // // Positions for this organization, for this voter / election
      // OrganizationActions.positionListForOpinionMaker(nextProps.organization.organization_we_vote_id, true);
      // // Positions for this organization, NOT including for this voter / election
      // OrganizationActions.positionListForOpinionMaker(nextProps.organization.organization_we_vote_id, false, true);
      this.setState({
        current_google_civic_election_id: VoterStore.election_id(),
        current_organization_we_vote_id: nextProps.organization.organization_we_vote_id,
        organization: nextProps.organization
      });
    // } else {
    //   console.log("VoterGuidePositions, componentWillReceiveProps, not different");
      // We do not refresh the organization since we don't want to cause the positions to have to re-render and
      //  "flash" on the screen
      // this.setState({organization: nextProps.organization});
    }
  }

  componentWillUnmount (){
    this.organizationStoreListener.remove();
    this.supportStoreListener.remove();
    this.voterStoreListener.remove();
  }

  _onOrganizationStoreChange (){
    // console.log("VoterGuidePositions _onOrganizationStoreChange, org_we_vote_id: ", this.state.organization.organization_we_vote_id);
    this.setState({
      organization: OrganizationStore.getOrganizationByWeVoteId(this.state.organization.organization_we_vote_id),
    });
  }

  onSupportStoreChange () {
    // Whenever positions change, we want to make sure to get the latest organization, because it has
    //  position_list_for_one_election and position_list_for_all_except_one_election attached to it
    this.setState({
      organization: OrganizationStore.getOrganizationByWeVoteId(this.state.organization.organization_we_vote_id),
    });
  }

  _onVoterStoreChange () {
    this.setState({
      voter: VoterStore.getVoter()
    });
   }

  toggleEditMode () {
    this.setState({editMode: !this.state.editMode});
  }

  onKeyDownEditMode (event) {
    let enterAndSpaceKeyCodes = [13, 32];
    let scope = this;
    if (enterAndSpaceKeyCodes.includes(event.keyCode)) {
      scope.setState({editMode: !this.state.editMode});
    }
  }

  render () {
    if (!this.state.organization) {
      // Wait until this.state.organization has been set to render
      return null;
    }
    const { organization_id, position_list_for_one_election, position_list_for_all_except_one_election } = this.state.organization;
    if (!organization_id) {
      return <div className="card">
          <div className="card-main">
            <h4 className="h4">Voter guide not found.</h4>
          </div>
        </div>;
    }

    let looking_at_self = false;
    if (this.state.voter) {
      looking_at_self = this.state.voter.linked_organization_we_vote_id === this.state.organization.organization_we_vote_id;
    }

    // console.log("looking_at_self: ", looking_at_self);
    const election_name = BallotStore.currentBallotElectionName;
    let organization_name = capitalizeString(this.state.organization.organization_name);
    let title_text = organization_name + " - We Vote";
    let description_text = "See endorsements and opinions from " + organization_name + " for the November election";
    const at_least_one_position_found_for_this_election = position_list_for_one_election && position_list_for_one_election.length !== 0;
    const at_least_one_position_found_for_other_elections = position_list_for_all_except_one_election && position_list_for_all_except_one_election.length !== 0;

    return <div className="opinions-followed__container">
      {/* Since VoterGuidePositions, VoterGuideFollowing, and VoterGuideFollowers are in tabs the title seems to use the Helmet values from the last tab */}
      <Helmet title={title_text}
              meta={[{"name": "description", "content": description_text}]}
              />
      <div className="card">
        <ul className="card-child__list-group">
          { looking_at_self && at_least_one_position_found_for_this_election ?
            <a className="fa-pull-right u-push--md"
               tabIndex="0"
               onKeyDown={this.onKeyDownEditMode.bind(this)}
               onClick={this.toggleEditMode.bind(this)}>{this.state.editMode ? "Done Editing" : "Edit Positions"}</a> :
            null }
          {/*  <OverlayTrigger placement="top" overlay={electionTooltip} >*/}
            <h4 className="h4 card__additional-heading">
               <span className="u-push--sm">{ election_name ? election_name : "This Election"}</span>
              {/*{this.state.ballot_election_list.length > 1 ? <img src={cordovaDot("/img/global/icons/gear-icon.png")} className="hidden-print" role="button" onClick={this.toggleSelectBallotModal}
                alt={'view your ballots' /> : null}*/}
            </h4>
          {/* </OverlayTrigger> */}
          { at_least_one_position_found_for_this_election ?
            <span>
              { position_list_for_one_election.map( item => {
                return <OrganizationPositionItem key={item.position_we_vote_id}
                                                 position={item}
                                                 organization={this.state.organization}
                                                 editMode={this.state.editMode}
                       />;
              }) }
            </span> :
            null
          }
          {/* If the position_list_for_one_election comes back empty, display a message saying that there aren't any positions for this election. */}
          { at_least_one_position_found_for_this_election ?
            null :
            <div className="card-child__content-text">
              { looking_at_self ?
                <div>You have not taken any positions yet for this election.
                  Click 'Ballot' in the top navigation bar to see items you can support or oppose.<br />
                  <br />
                  <span>Until you take positions, we recommend visitors look at other voter guides you follow. </span>
                  <VoterGuideRecommendationsFromOneOrganization organization_we_vote_id={this.state.organization.organization_we_vote_id} />
                </div> :
                <div>
                  There are no positions for this election in this voter guide yet.<br />
                  <br />
                  <VoterGuideRecommendationsFromOneOrganization organization_we_vote_id={this.state.organization.organization_we_vote_id} />
                  {/* TODO Add search all */}
                  {/* TODO List all elections this organization has a voter guide for. */}
                </div> }
            </div>
          }
        </ul>
      </div>

      {/* We do not display the positions for other elections if we have even one position for this election. */}
      { at_least_one_position_found_for_other_elections ?
        <div className="card">
          <ul className="card-child__list-group">
          { position_list_for_all_except_one_election.length && !at_least_one_position_found_for_this_election ?
            <span>
            { looking_at_self ?
              <a className="fa-pull-right u-push--md"
                 tabIndex="0"
                 onKeyDown={this.onKeyDownEditMode.bind(this)}
                 onClick={this.toggleEditMode.bind(this)}>{this.state.editMode ? "Done Editing" : "Edit Positions"}</a> :
              null }
              <h4 className="card__additional-heading">Positions for Other Elections</h4>
              { position_list_for_all_except_one_election.map( item => {
                return <OrganizationPositionItem key={item.position_we_vote_id}
                                                 position={item}
                                                 organization={this.state.organization}
                                                 editMode={this.state.editMode}
                       />;
              }) }
            </span> :
            null
          }
          </ul>
        </div> :
        null
      }
    </div>;
  }
}
