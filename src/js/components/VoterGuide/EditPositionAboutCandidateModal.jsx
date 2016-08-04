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
    twitter_handle: PropTypes.string
  };

  constructor (props) {
    super(props);
    this.state = {candidate: {}, office: {} };
  }

  componentDidMount () {
    console.log("EditPositionAboutCandidateModal, Entering componentDidMount");

    // this._onVoterStoreChange();
    // console.log("VerifyThisIsMe, componentDidMount: " + this.props.params.twitter_handle);
    // TwitterActions.twitterIdentityRetrieve(this.props.params.twitter_handle);
    //
    // this.organizationStoreListener = OrganizationStore.addListener(this._onOrganizationStoreChange.bind(this));
    // this.voterStoreListener = VoterStore.addListener(this._onVoterStoreChange.bind(this));
    //
    // this.candidateStoreListener = CandidateStore.addListener(this._onCandidateStoreChange.bind(this));
    // this.officeStoreListener = OfficeStore.addListener(this._onCandidateStoreChange.bind(this));
    //
    // this.twitterStoreListener = TwitterStore.addListener(this._onTwitterStoreChange.bind(this));
  }

  componentWillUnmount (){
    // this.candidateStoreListener.remove();
    // this.officeStoreListener.remove();
    // this.organizationStoreListener.remove();
    // this.voterStoreListener.remove();
    // this.twitterStoreListener.remove();
  }

  _onVoterStoreChange () {
    // console.log("Entering _onVoterStoreChange");
    // this.setState({ voter: VoterStore.voter() });
  }

  _onOrganizationStoreChange (){
    // let { kind_of_owner, owner_we_vote_id, status } = TwitterStore.get();
    // console.log("Entering _onOrganizationStoreChange, owner_we_vote_id: " + owner_we_vote_id);
    // this.setState({
    //   organization: OrganizationStore.get(owner_we_vote_id),
    // });
  }

  _onCandidateStoreChange (){
    // let { kind_of_owner, owner_we_vote_id, status } = TwitterStore.get();
    // var candidate = CandidateStore.get(owner_we_vote_id) || {};
    // this.setState({
    //   candidate: candidate,
    // });
    //
    // if (candidate.contest_office_we_vote_id){
    //   this.setState({ office: OfficeStore.get(candidate.contest_office_we_vote_id) || {} });
    // }
  }

  _onTwitterStoreChange () {
   //  let { kind_of_owner, owner_we_vote_id, twitter_handle, twitter_description, twitter_followers_count, twitter_name,
   //    twitter_photo_url, twitter_user_website,
   //    status } = TwitterStore.get();
   //
   //  console.log("Entering _onTwitterStoreChange, owner_we_vote_id: " + owner_we_vote_id);
   //
   //  this.setState({
   //    kind_of_owner: kind_of_owner,
   //    owner_we_vote_id: owner_we_vote_id,
   //    twitter_handle: twitter_handle,
   //    twitter_description: twitter_description,
   //    twitter_followers_count: twitter_followers_count,
   //    twitter_name: twitter_name,
   //    twitter_photo_url: twitter_photo_url,
   //    twitter_user_website: twitter_user_website,
   //    status: status
   // });
  }

  render () {
    // let { ballot_item_display_name,
    //   kind_of_ballot_item,
    //   ballot_item_we_vote_id,
    //   ballot_item_image_url_https,
    //   ballot_item_twitter_handle,
    //   is_for_friends_only
    // } = this.props;

    return <Modal {...this.props} bsSize="large" aria-labelledby="contained-modal-title-lg">
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-lg">{this.props.ballot_item_display_name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.</p>
          <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.</p>
          <p>Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Donec sed odio dui. Donec ullamcorper nulla non metus auctor fringilla.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>;
    // // Manage the control over this organization voter guide
    // var {candidate, office, organization, voter} = this.state;
    // var signed_in_twitter = voter === undefined ? false : voter.signed_in_twitter;
    // var signed_in_with_this_twitter_account = false;
    // if (signed_in_twitter) {
    //   console.log("In render, voter: ", voter);
    //   console.log("this.props.params.twitter_handle: " + this.props.params.twitter_handle);
    //   signed_in_with_this_twitter_account = voter.twitter_screen_name.toLowerCase() === this.props.params.twitter_handle.toLowerCase();
    //   if (signed_in_with_this_twitter_account) {
    //     // If we are being asked to verify the account we are already signed into, return to the TwitterHandle page
    //     console.log("signed_in_with_this_twitter_account is True");
    //     browserHistory.push("/" + voter.twitter_screen_name);
    //   }
    // }
    //
    // if (this.state.status === undefined){
    //   // Show a loading wheel while this component's data is loading
    //   return LoadingWheel;
    // } else if (this.state.kind_of_owner === "CANDIDATE"){
    //   console.log("this.state.kind_of_owner === CANDIDATE");
    //   this.props.params.we_vote_id = this.state.owner_we_vote_id;
    //   return <span>
    //     <section className="candidate-card__container">
    //       <CandidateItem {...candidate} office_name={office.ballot_item_display_name}/>
    //     </section>
    //     <div>
    //       <br />
    //       <h1>Please verify that you have the right to manage statements by this politician
    //         by signing into this Twitter account:</h1>
    //       <h2>@{this.props.params.twitter_handle}</h2>
    //       <br />
    //     </div>
    //     { signed_in_twitter ?
    //       <Link to="/twittersigninprocess/signinswitchstart"><Button bsClass="bs-btn" bsStyle="primary">Sign In
    //         With @{this.props.params.twitter_handle} Account</Button></Link> :
    //       <Link to="/twittersigninprocess/signinswitchstart"><Button bsClass="bs-btn" bsStyle="primary">Sign Into
    //         Twitter</Button></Link>
    //     }
    //   </span>;
    // } else if (this.state.kind_of_owner === "ORGANIZATION"){
    //   console.log("this.state.kind_of_owner === ORGANIZATION");
    //   console.log("this.state.owner_we_vote_id: " + this.state.owner_we_vote_id);
    //   this.props.params.we_vote_id = this.state.owner_we_vote_id;
    //
    //   if (!organization){
    //     return <div>{LoadingWheel}</div>;
    //   }
    //
    //   return <span>
    //       <div className="card__container">
    //         <div className="card__main">
    //           <FollowToggle we_vote_id={this.props.params.we_vote_id} />
    //           <OrganizationCard organization={organization} />
    //         </div>
    //       </div>
    //       <div>
    //         <br />
    //         <h1>Please verify that you work for this organization by signing into this Twitter account:</h1>
    //         <h2>@{this.props.params.twitter_handle}</h2>
    //         <br />
    //       </div>
    //       { signed_in_twitter ?
    //         <Link to="/twittersigninprocess/signinswitchstart"><Button bsClass="bs-btn" bsStyle="primary">Sign In
    //           With @{this.props.params.twitter_handle} Account</Button></Link> :
    //         <Link to="/twittersigninprocess/signinswitchstart"><Button bsClass="bs-btn" bsStyle="primary">Sign Into
    //           Twitter</Button></Link>
    //       }
    //     </span>;
    // }
  }
}
