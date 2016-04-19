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
    this.state = {first_load: true};
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
    this.setState({first_load: false, ballot: this.getBallot(nextProps), type: type });
  }

  _onChange (){
    if (BallotStore.ballot_properties && BallotStore.ballot_properties.ballot_found && BallotStore.ballot && BallotStore.ballot.length === 0){ // Ballot is found but ballot is empty
      this.props.history.push("ballot/empty");
    } else if (this.state.first_load){ // Only load new ballot on page mount or receiving props
      let type = this.props.location.query ? this.props.location.query.type : "all";
      this.setState({first_load: false, ballot: this.getBallot(this.props), type: type });
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
        return "Choices Remaining";
      case "filterSupport":
        return "What I Support";
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
    if (this.state.first_load) {
      return LoadingWheel;
    }
    let ballot = this.state.ballot;
    let ballot_props = BallotStore.ballot_properties;
    let ballot_length = 0;
    if (ballot !== null && ballot.length !== null) {
      ballot_length = ballot.length;
    }
    let ballot_caveat = "";
    if (ballot_props !== null) {
      ballot_caveat = ballot_props.ballot_caveat;
    }

    var missing_address = false;
    if (this.props.location === null) {
      missing_address = true;
    }

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

    const emptyBallot = ballot_length === 0 ?
      <div className="container-fluid well gutter-top--small fluff-full1">
        <h3 className="text-center">{this.emptyMsg()}</h3>
        {emptyBallotButton}
      </div> :
      <div></div>;

    const ballotItems = ballot !== null ?
      ballot.map( (item) =>
          <BallotItem key={item.we_vote_id} {...item} />
        ) :
      <span></span>;

    return (
      <div className="ballot">
      <h4 className="text-center">{this.getTitle()}</h4>
        <div className="alert alert-info alert-dismissible" role="alert">
          <button type="button" className="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
          {ballot_caveat}
        </div>
        {emptyBallot}
        {ballotItems}
      </div>
    );
  }

}
