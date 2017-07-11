import React, {Component, PropTypes } from "react";
// import { OverlayTrigger } from "react-bootstrap";
import { capitalizeString } from "../../utils/textFormat";
import Helmet from "react-helmet";
import BallotStore from "../../stores/BallotStore";
import LoadingWheel from "../../components/LoadingWheel";
import OrganizationStore from "../../stores/OrganizationStore";
import OrganizationPositionItem from "../../components/VoterGuide/OrganizationPositionItem";
import VoterStore from "../../stores/VoterStore";

export default class VoterGuidePositions extends Component {
  static propTypes = {
    organization: PropTypes.object.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = {
      editMode: false,
      organization: this.props.organization,
      voter: VoterStore.getVoter(),
    };
  }

  componentDidMount (){
    this._onOrganizationStoreChange();
    this.organizationStoreListener = OrganizationStore.addListener(this._onOrganizationStoreChange.bind(this));

    this._onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this._onVoterStoreChange.bind(this));
  }

  componentWillReceiveProps (nextProps) {
    // console.log("VoterGuidePositions, componentWillReceiveProps, nextProps.organization: ", nextProps.organization);
    // When a new organization is passed in, update this component to show the new data
    this.setState({organization: nextProps.organization});
  }

  componentWillUnmount (){
    this.organizationStoreListener.remove();
    this.voterStoreListener.remove();
  }

  _onOrganizationStoreChange (){
    this.setState({
      organization: OrganizationStore.get(this.state.organization.organization_we_vote_id),
    });
  }

  _onVoterStoreChange () {
    this.setState({
      voter: VoterStore.getVoter()
    });
   }

  toggleEditMode (){
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
    let looking_at_self = false;
    if (this.state.voter) {
      looking_at_self = this.state.voter.linked_organization_we_vote_id === this.state.organization.organization_we_vote_id;
    }

    const { organization_id, position_list_for_one_election, position_list_for_all_except_one_election } = this.state.organization;
    if (!organization_id) {
      return <div className="card">
          <div className="card-main">
            <h4 className="h4">Voter guide not found.</h4>
          </div>
        </div>;
    }

    const election_name = BallotStore.currentBallotElectionName;
    let organization_name = capitalizeString(this.state.organization.organization_name);
    let title_text = organization_name + " - We Vote";
    let description_text = "See endorsements and opinions from " + organization_name + " for the November election";
    const at_least_one_position_found_for_this_election = position_list_for_one_election && position_list_for_one_election.length !== 0;
    // console.log("at_least_one_position_found_for_this_election: ", at_least_one_position_found_for_this_election);

    return <div className="opinions-followed__container">
      <Helmet title={title_text}
              meta={[{"name": "description", "content": description_text}]}
              />
      <div className="card">
        <ul className="card-child__list-group">
          { looking_at_self ?
            <a className="fa-pull-right u-push--md"
               tabIndex="0"
               onKeyDown={this.onKeyDownEditMode.bind(this)}
               onClick={this.toggleEditMode.bind(this)}>{this.state.editMode ? "Done Editing" : "Edit"}</a> :
            null }
          {/*  <OverlayTrigger placement="top" overlay={electionTooltip} >*/}
            <h4 className="h4 card__additional-heading">
               <span className="u-push--sm">{ election_name ? election_name : "This Election"}</span>
              {/*{this.state.ballot_election_list.length > 1 ? <img src={"/img/global/icons/gear-icon.png"} className="hidden-print" role="button" onClick={this._toggleSelectBallotModal}
                alt={"view your ballots"}/> : null}*/}
            </h4>
          {/* </OverlayTrigger> */}
          { position_list_for_one_election ?
            <span>
              { position_list_for_one_election.map( item => {
                return <OrganizationPositionItem key={item.position_we_vote_id}
                                                 position={item}
                                                 organization={this.state.organization}
                                                 editMode={this.state.editMode}
                       />;
              }) }
            </span> :
            <div>{LoadingWheel}</div>
          }
          {/* If the position_list_for_one_election comes back empty, display a message saying that there aren't any positions for this election. */}
          { at_least_one_position_found_for_this_election ?
            null :
            <div className="card-child__content-text">
              { looking_at_self ?
                <div>You have not taken any positions yet for this election.
                  Click 'Ballot' in the top navigation bar to see items you can support or oppose.
                </div> :
                <div>
                  There are no positions for this election in this voter guide yet.<br />
                  TODO Add search all<br />
                  TODO List all elections this organization has a voter guide for.
                </div> }
            </div>
          }
        </ul>
      </div>

      {/* We do not display the positions for other elections if we have even one position for this election. */}
      { position_list_for_all_except_one_election ?
        <div className="card">
          <ul className="card-child__list-group">
          { position_list_for_all_except_one_election.length && !at_least_one_position_found_for_this_election ?
            <span>
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
        <div>{LoadingWheel}</div>
      }
    </div>;
  }
}
