import React, { Component, PropTypes } from "react";
import { Button, Modal } from "react-bootstrap";
import { browserHistory, Link } from "react-router";
import CandidateItem from "../../components/Ballot/CandidateItem";
import CandidateStore from "../../stores/CandidateStore";
import FollowToggle from "../../components/Widgets/FollowToggle";
import LoadingWheel from "../../components/LoadingWheel";
import OfficeStore from "../../stores/OfficeStore";
import OrganizationCard from "../../components/VoterGuide/OrganizationCard";
import OrganizationStore from "../../stores/OrganizationStore";
import TwitterAccountCard from "../../components/Twitter/TwitterAccountCard";
import TwitterActions from "../../actions/TwitterActions";
import TwitterStore from "../../stores/TwitterStore";
import VoterStore from "../../stores/VoterStore";

export default class EditPositionAboutCandidateModal extends Component {
  static propTypes = {
    params: PropTypes.object,
    organization: PropTypes.object.isRequired,
    position: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {candidate: {}, office: {}};
  }

  componentDidMount() {
    this._onVoterStoreChange();

    this.organizationStoreListener = OrganizationStore.addListener(this._onOrganizationStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this._onVoterStoreChange.bind(this));

    this.candidateStoreListener = CandidateStore.addListener(this._onCandidateStoreChange.bind(this));
    this.officeStoreListener = OfficeStore.addListener(this._onCandidateStoreChange.bind(this));
  }

  componentWillUnmount() {
    this.candidateStoreListener.remove();
    this.officeStoreListener.remove();
    this.organizationStoreListener.remove();
    this.voterStoreListener.remove();
  }

  _onVoterStoreChange() {
    this.setState({voter: VoterStore.voter()});
  }

  _onOrganizationStoreChange() {
    // let {owner_we_vote_id} = this.props.position;
    // console.log("Entering _onOrganizationStoreChange, owner_we_vote_id: " + owner_we_vote_id);
    // this.setState({
    //   organization: OrganizationStore.get(owner_we_vote_id),
    // });
  }

  _onCandidateStoreChange() {
    let {kind_of_owner, owner_we_vote_id, status} = TwitterStore.get();
    var candidate = CandidateStore.get(owner_we_vote_id) || {};
    this.setState({
      candidate: candidate,
    });

    if (candidate.contest_office_we_vote_id) {
      this.setState({office: OfficeStore.get(candidate.contest_office_we_vote_id) || {}});
    }
  }

  render() {
    // This is the position we are editing
    var position = this.props.position;
    // The owner of this position
    var organization = this.props.organization;

    var {voter} = this.state;
    var signed_in_twitter = voter === undefined ? false : voter.signed_in_twitter;
    var signed_in_with_this_twitter_account = false;
    if (signed_in_twitter) {
      // console.log("In render, voter: ", voter);
      // console.log("this.props.params.twitter_handle: " + this.props.params.twitter_handle);
      // signed_in_with_this_twitter_account = voter.twitter_screen_name.toLowerCase() === this.props.params.twitter_handle.toLowerCase();
    }

    let modal_contents;
    if (position === undefined) {
      // Show a loading wheel while this component's data is loading
      console.log("position data loading");
      return LoadingWheel;
    // } else if (position.kind_of_ballot_item === "CANDIDATE") {
    //   console.log("this.state.kind_of_owner === CANDIDATE");
    //   this.props.params.we_vote_id = this.state.owner_we_vote_id;
    //   modal_contents = <span>
    //     <section className="candidate-card__container">
    //       <CandidateItem {...candidate} office_name={office.ballot_item_display_name}/>
    //     </section>
    //   </span>;
    } else if (organization !== undefined) {
      // console.log("ORGANIZATION");
      // console.log("organization.organization_name: " + organization.organization_name);

      modal_contents = <span>
          <div className="card__container">
            <div className="card__main">
              <FollowToggle we_vote_id={organization.organization_we_vote_id}/>
              <OrganizationCard organization={organization}/>
            </div>
          </div>
        </span>;
    }
    return <Modal {...this.props} bsClass="bs-modal" bsSize="large" aria-labelledby="contained-modal-title-lg">
      <Modal.Header bsClass="bs-modal" closeButton>
        <Modal.Title bsClass="bs-modal"
                     id="contained-modal-title-lg">{position.ballot_item_display_name}</Modal.Title>
      </Modal.Header>
      <Modal.Body bsClass="bs-modal">
        { modal_contents }
      </Modal.Body>
    </Modal>;
  }
}
