import React, { Component, PropTypes } from "react";
import { Modal, Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { browserHistory, Link } from "react-router";
import BallotItem from "../../components/Ballot/BallotItem";
import BallotItemCompressed from "../../components/Ballot/BallotItemCompressed";
import BallotStore from "../../stores/BallotStore";
import BallotFilter from "../../components/Navigation/BallotFilter";
import BrowserPushMessage from "../../components/Widgets/BrowserPushMessage";
import cookies from "../../utils/cookies";
import Helmet from "react-helmet";
import LoadingWheel from "../../components/LoadingWheel";
import SupportActions from "../../actions/SupportActions";
import SupportStore from "../../stores/SupportStore";
import VoterStore from "../../stores/VoterStore";

export default class Ballot extends Component {
  static propTypes = {
      location: PropTypes.object
  };

  constructor (props){
    super(props);
    this.state = {showModal: false};
  }

  componentDidMount () {
    if (BallotStore.ballot_properties && BallotStore.ballot_properties.ballot_found === false){ // No ballot found
      browserHistory.push("settings/location");
    } else {
      let ballot = this.getBallot(this.props);
      // console.log(ballot);
      if (ballot !== undefined) {
        let ballot_type = this.props.location.query ? this.props.location.query.type : "all";
        this.setState({ballot: ballot, ballot_type: ballot_type});
      }
      // We need a ballotStoreListener here because we want the ballot to display before positions are received
      this.ballotStoreListener = BallotStore.addListener(this._onChange.bind(this));
      // NOTE: voterAllPositionsRetrieve and positionsCountForAllBallotItems are also called in SupportStore when voterAddressRetrieve is received,
      // so we get duplicate calls when you come straight to the Ballot page. There is no easy way around this currently.
      this._togglePopup = this._togglePopup.bind(this);
      SupportActions.voterAllPositionsRetrieve();
      SupportActions.positionsCountForAllBallotItems();
      this.supportStoreListener = SupportStore.addListener(this._onChange.bind(this));
    }
  }

  componentWillUnmount (){
    if (BallotStore.ballot_properties && BallotStore.ballot_properties.ballot_found === false){
      // No ballot found
    } else {
      this.ballotStoreListener.remove();
      this.supportStoreListener.remove();
    }
  }

  componentWillReceiveProps (nextProps){
    let ballot_type = nextProps.location.query ? nextProps.location.query.type : "all";
    this.setState({ballot: this.getBallot(nextProps), ballot_type: ballot_type });
  }

    _togglePopup (modalMessage) {
     this.setState({
        showModal: !this.state.showModal,
        modalMessage: modalMessage
      });
  }

  _onChange (){
    if (BallotStore.ballot_properties && BallotStore.ballot_properties.ballot_found && BallotStore.ballot && BallotStore.ballot.length === 0){ // Ballot is found but ballot is empty
      browserHistory.push("ballot/empty");
    } else {
      let ballot_type = this.props.location.query ? this.props.location.query.type : "all";
      this.setState({ballot: this.getBallot(this.props), ballot_type: ballot_type });
    }
  }

  componentDidUpdate (){
    this.hashLinkScroll();
  }

  //Needed to scroll to anchor tags based on hash in url(as done for bookmarks)
  hashLinkScroll () {
    const { hash } = window.location;
    if (hash !== "") {
      // Push onto callback queue so it runs after the DOM is updated,
      // this is required when navigating from a different page so that
      // the element is rendered on the page before trying to getElementById.
      setTimeout(() => {
        var id = hash.replace("#", "");
        const element = document.getElementById(id);
        if (element) element.scrollIntoView();
      }, 0);
    }
  }

  getBallot (props){
    let ballot_type = props.location.query ? props.location.query.type : "all";
    switch (ballot_type) {
      case "filterRemaining":
        return BallotStore.ballot_remaining_choices;
      case "filterSupport":
        return BallotStore.ballot_supported;
      default :
        return BallotStore.ballot;
    }
  }

  getBallotType (){
    switch (this.state.ballot_type) {
      case "filterRemaining":
        return "CHOICES_REMAINING";
      case "filterSupport":
        return "WHAT_I_SUPPORT";
      default :
        return "ALL_BALLOT_ITEMS";
    }
  }

  getFilterType (){
    switch (this.state.ballot_type) {
      case "filterRemaining":
        return "filterRemaining";
      case "filterSupport":
        return "filterSupport";
      default :
        return "none";
    }
  }

  emptyMsg (){
    switch (this.state.ballot_type) {
      case "filterRemaining":
        return "You already chose a candidate or position for each ballot item";
      case "filterSupport":
        return "You haven't supported any candidates or measures yet.";
      default :
        return "";
    }
  }

  test (){
    console.log("This is a test");
  }

  render () {
      const PopupModal = (
      <Modal show={this.state.showModal} onHide={()=>{this._togglePopup(null)}}>
          <Modal.Header closeButton>
            <Modal.Title>{this.state.modalMessage}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h4>{"Hello!"}</h4>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={()=>{this._togglePopup(null)}}>Close</Button>
          </Modal.Footer>
        </Modal>
      );


    const showIntroStory = !cookies.getItem("intro_story_watched");

    if (showIntroStory) {
      browserHistory.push("/intro/story");
      return LoadingWheel;
    }

    const ballot = this.state.ballot;
    // console.log(ballot,5);
    var voter_address = VoterStore.getAddress();
    if (!ballot) {
      if (voter_address.length === 0) {
        return <div className="ballot">
          <div className="ballot__header">
            <Helmet title="Ballot - We Vote" />
            <BrowserPushMessage incomingProps={this.props} />
            <h1 className="h1">Please enter your address so we can find your ballot.</h1>
            <Link to="/settings/location">
                <Button bsStyle="primary">Enter an Address</Button>
            </Link>
          </div>
        </div>;
      } else {
        return LoadingWheel;
      }
    }
    const missing_address = this.props.location === null;
    // const ballot_caveat = BallotStore.ballot_properties.ballot_caveat;
    const election_name = BallotStore.currentBallotElectionName;
    const election_date = BallotStore.currentBallotElectionDate;

    const emptyBallotButton = this.getFilterType() !== "none" && !missing_address ?
        <span>
          <Link to="/ballot">
              <Button bsStyle="primary">View Full Ballot</Button>
          </Link>
        </span> :
        <span>
          <Link to="/settings/location">
              <Button bsStyle="primary">Enter a Different Address</Button>
          </Link>
        </span>;

    const emptyBallot = ballot.length === 0 ?
      <div className="container-fluid well u-stack--md u-inset--md">
        <h3 className="text-center">{this.emptyMsg()}</h3>
        {emptyBallotButton}
      </div> :
      null;

    const electionTooltip = election_date ? <Tooltip id="tooltip">Ballot for {election_date}</Tooltip> : <span />;

    let show_expanded_ballot_items = false;

    return <div className="ballot">
    {this.state.showModal ? PopupModal : null}
      <div className="ballot__heading u-stack--lg">
        <Helmet title="Ballot - We Vote" />
        <BrowserPushMessage incomingProps={this.props} />
        <OverlayTrigger placement="top" overlay={electionTooltip} >
          <h1 className="h1 ballot__election-name">{election_name}</h1>
        </OverlayTrigger>
        <p className="ballot__date_location">
          {voter_address}
          <span> (<Link to="/settings/location">Edit</Link>)</span>
        </p>
        <div className="ballot__filter"><BallotFilter ballot_type={this.getBallotType()} /></div>
      </div>
      {/* TO BE DISCUSSED ballot_caveat !== "" ?
        <div className="alert alert alert-info alert-dismissible" role="alert">
          <button type="button" className="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
          {ballot_caveat}
        </div> : null
      */}
      {emptyBallot}
      { show_expanded_ballot_items ?
        ballot.map( (item) => <BallotItem key={item.we_vote_id} {...item} />) :
        ballot.map( (item) => <BallotItemCompressed _togglePopup = {this._togglePopup} key={item.we_vote_id} {...item} />)
      }
      </div>;
  }
}
