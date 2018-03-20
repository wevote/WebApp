import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import CandidateStore from "../../stores/CandidateStore";
import FollowToggle from "../../components/Widgets/FollowToggle";
import ItemActionBar from "../../components/Widgets/ItemActionBar";
import ItemPositionStatementActionBar from "../../components/Widgets/ItemPositionStatementActionBar";
import LoadingWheel from "../../components/LoadingWheel";
import OrganizationCard from "../../components/VoterGuide/OrganizationCard";
import OrganizationPositionItem from "../../components/VoterGuide/OrganizationPositionItem";
import OrganizationStore from "../../stores/OrganizationStore";
import SupportActions from "../../actions/SupportActions";
import SupportStore from "../../stores/SupportStore";
import VoterStore from "../../stores/VoterStore";

export default class EditPositionAboutCandidateModal extends Component {
  static propTypes = {
    params: PropTypes.object,
    organization: PropTypes.object.isRequired,
    position: PropTypes.object.isRequired
  };

  constructor (props) {
    super(props);
    this.state = {candidate: {}};
  }

  componentDidMount () {
    console.log("OrganizationsFollowedOnTwitter componentDidMount");
    this._onVoterStoreChange();

    this.organizationStoreListener = OrganizationStore.addListener(this._onOrganizationStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this._onVoterStoreChange.bind(this));

    this.candidateStoreListener = CandidateStore.addListener(this._onCandidateStoreChange.bind(this));
    this.supportStoreListener = SupportStore.addListener(this.onSupportStoreChange.bind(this));

    // let { ballot_item_we_vote_id } = this.props.position;
    // var candidate = CandidateStore.getCandidate(ballot_item_we_vote_id) || null;
    // console.log("EditPositionAboutCandidateModal: componentDidMount, ballot_item_we_vote_id: ", ballot_item_we_vote_id, ", candidate: ", candidate);
    // if (candidate === null) {
    //   CandidateActions.candidateRetrieve(ballot_item_we_vote_id);
    //   CandidateActions.positionListForBallotItem(ballot_item_we_vote_id);
    // } else {
    //   this._onCandidateStoreChange()
    // }

    // this.props.position.ballot_item_we_vote_id is the candidate
    let ballot_item_we_vote_id = this.props.position.ballot_item_we_vote_id;
    let supportProps = SupportStore.get(ballot_item_we_vote_id);

    this.setState({supportProps: supportProps});

    // if supportProps is missing support_count or oppose_count, force a retrieve
    if (supportProps !== undefined) {
      if (supportProps.support_count === undefined || supportProps.oppose_count === undefined) {
        SupportActions.retrievePositionsCountsForOneBallotItem(ballot_item_we_vote_id);
      }
    }
  }

  componentWillUnmount () {
    this.candidateStoreListener.remove();
    this.organizationStoreListener.remove();
    this.voterStoreListener.remove();
    this.supportStoreListener.remove();
  }

  _onVoterStoreChange () {
    this.setState({voter: VoterStore.getVoter()});
  }

  _onOrganizationStoreChange () {
    // let {owner_we_vote_id} = this.props.position;
    // console.log("Entering _onOrganizationStoreChange, owner_we_vote_id: " + owner_we_vote_id);
    // this.setState({
    //   organization: OrganizationStore.get(owner_we_vote_id),
    // });
  }

  _onCandidateStoreChange () {
    // let { ballot_item_we_vote_id } = this.props.position;
    // var candidate = CandidateStore.getCandidate(ballot_item_we_vote_id) || {};
    // console.log("_onCandidateStoreChange, ballot_item_we_vote_id: ", ballot_item_we_vote_id, ", candidate: ", candidate);
    // this.setState({
    //   candidate: candidate,
    // });
    //
  }

  onSupportStoreChange () {
    var ballot_item_we_vote_id = this.props.position.ballot_item_we_vote_id;
    this.setState({ supportProps: SupportStore.get(ballot_item_we_vote_id) });
  }

  render () {
    // This is the position we are editing
    var position = this.props.position;
    // The owner of this position
    var organization = this.props.organization;
    var ballot_item_we_vote_id = this.props.position.ballot_item_we_vote_id;
    var ballot_item_display_name = this.props.position.ballot_item_display_name;

    const { supportProps, voter } = this.state;
    var signed_in_twitter = voter === undefined ? false : voter.signed_in_twitter;
    // var signed_in_with_this_twitter_account = false;
    if (signed_in_twitter) {
      // console.log("In render, voter: ", voter);
      // console.log("this.props.params.twitter_handle: " + this.props.params.twitter_handle);
      // signed_in_with_this_twitter_account = voter.twitter_screen_name.toLowerCase() === this.props.params.twitter_handle.toLowerCase();
    }

    let modal_contents;
    if (position === undefined) {
      // Show a loading wheel while this component's data is loading
      return LoadingWheel;

    } else if (organization !== undefined) {
      modal_contents = <div className="card">
              <div className="card-main candidate-card">
                <FollowToggle we_vote_id={organization.organization_we_vote_id}/>
                <OrganizationCard organization={organization}
                                  turnOffDescription
                                  followToggleOn/>
              </div>
            <ul className="list-group">
              <OrganizationPositionItem position={position}
                                        organization={this.props.organization}
                                        link_to_edit_modal_off
                                        stance_display_off
                                        comment_text_off
                                        placement="bottom"/>
            </ul>
          <div className="card-main__media-object-content">
            <div className="card-main__actions">
              <ItemActionBar ballot_item_we_vote_id={ballot_item_we_vote_id}
                             supportProps={supportProps} type="CANDIDATE" />
              <ItemPositionStatementActionBar ballot_item_we_vote_id={ballot_item_we_vote_id}
                                              ballot_item_display_name={ballot_item_display_name}
                                              supportProps={supportProps}
                                              type="CANDIDATE" />
              </div>
            </div>
          </div>;
    }
    return <Modal {...this.props} bsSize="large" aria-labelledby="contained-modal-title-lg">
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-lg">&nbsp;</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        { modal_contents }
      </Modal.Body>
    </Modal>;
  }
}
