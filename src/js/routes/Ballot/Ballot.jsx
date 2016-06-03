import React, { Component, PropTypes } from "react";
import BallotStore from "../../stores/BallotStore";
import SupportStore from "../../stores/SupportStore";
import SupportActions from "../../actions/SupportActions";
import LoadingWheel from "../../components/LoadingWheel";
import BallotItem from "../../components/Ballot/BallotItem";
import { Link } from "react-router";
import { Button } from "react-bootstrap";

export default class Ballot extends Component {
  static propTypes = {
      history: PropTypes.object,
      location: PropTypes.object
  };

  constructor (props){
    super(props);
    this.state = {};
  }

  componentDidMount () {
    if (BallotStore.ballot_properties && BallotStore.ballot_properties.ballot_found === false){ // No ballot found
      this.props.history.push("settings/location");
    }
      SupportActions.retrieveAll();
      SupportActions.retrieveAllCounts();
      this.supportToken = SupportStore.addListener(this._onChange.bind(this));
    }

  componentWillUnmount (){
    this.supportToken.remove();
  }

  componentWillReceiveProps (nextProps){
    let type = nextProps.location.query ? nextProps.location.query.type : "all";
    this.setState({ballot: this.getBallot(nextProps), type: type });
  }

  _onChange (){
    if (BallotStore.ballot_properties && BallotStore.ballot_properties.ballot_found && BallotStore.ballot && BallotStore.ballot.length === 0){ // Ballot is found but ballot is empty
      this.props.history.push("ballot/empty");
    } else {
      let type = this.props.location.query ? this.props.location.query.type : "all";
      this.setState({ballot: this.getBallot(this.props), type: type });
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
    let type = props.location.query ? props.location.query.type : "all";
    switch (type) {
      case "filterRemaining":
        return BallotStore.ballot_remaining_choices;
      case "filterSupport":
        return BallotStore.ballot_supported;
      default :
        return BallotStore.ballot;
    }
  }

  getFilterType (){
    switch (this.state.type) {
      case "filterRemaining":
        return "filterRemaining";
      case "filterSupport":
        return "filterSupport";
      default :
        return "none";
    }
  }

  getTitle (){
    switch (this.state.type) {
      case "filterRemaining":
        return "Choices Remaining on My Ballot";
      case "filterSupport":
        return "What I Support on My Ballot";
      default :
        return "All Ballot Items";
    }
  }

  emptyMsg (){
    switch (this.state.type) {
      case "filterRemaining":
        return "You already chose a candidate or position for each ballot item";
      case "filterSupport":
        return "You haven't supported any candidates or measures yet.";
      default :
        return "";
    }
  }

  render () {
    const ballot = this.state.ballot;
    if (!ballot) {
      return LoadingWheel;
    }
    const missing_address = this.props.location === null;
    const ballot_caveat = BallotStore.ballot_properties.ballot_caveat;

    const emptyBallotButton = this.getFilterType() !== "none" && !missing_address ?
        <span>
          <Link to="/ballot">
              <Button bsClass="bs-btn" bsStyle="primary">View Full Ballot</Button>
          </Link>
        </span> :
        <span>
          <Link to="/settings/location">
              <Button bsClass="bs-btn" bsStyle="primary">Enter a Different Address</Button>
          </Link>
        </span>;

    const emptyBallot = ballot.length === 0 ?
      <div className="bs-container-fluid bs-well gutter-top--small fluff-full1">
        <h3 className="bs-text-center">{this.emptyMsg()}</h3>
        {emptyBallotButton}
      </div> :
      <div></div>;

    return <div className="ballot">
      <h4 className="bs-text-center">{this.getTitle()}</h4>
      { ballot_caveat !== "" ?
        <div className="alert bs-alert bs-alert-info alert-dismissible" role="alert">
          <button type="button" className="bs-close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
          {ballot_caveat}
        </div> : null
      }
        {emptyBallot}
        {
          ballot.map( (item) => <BallotItem key={item.we_vote_id} {...item} />)
        }
      </div>;
  }

}
