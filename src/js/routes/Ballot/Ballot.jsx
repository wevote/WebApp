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
    this.state = {loading: true};
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

  _onChange (){
    if (BallotStore.ballot_properties.ballot_found && BallotStore.ballot && BallotStore.ballot.length === 0){ // Ballot is found but ballot is empty
      this.props.history.push("ballot/empty");
    }
    this.setState({loading: false});
  }

  render () {
    if (this.state.loading) {
      return LoadingWheel;
    }

    let ballot = BallotStore.ballot;
    var empty_msg = "";
    let query = this.props.location.query;
    let ballot_props = BallotStore.ballot_properties;
    let ballot_caveat = ballot_props.ballot_caveat;

    if (query && query.filterSupport){
      ballot = BallotStore.ballot_supported;
      empty_msg = "You haven't supported any candidates or measures yet.";
    } else if (query && query.filterRemaining){
      ballot = BallotStore.ballot_remaining_choices;
      empty_msg = "No remaining choices. You supported a candidate or measure for each ballot item.";
    }

    const emptyBallot = ballot.length === 0 ?
      <div className="container-fluid well gutter-top--small fluff-full1">
        <h3 className="text-center">{empty_msg}</h3>
        <span>
          <Link to="/ballot">
              <Button bsStyle="primary">View Full Ballot</Button>
          </Link>
        </span>
      </div> :
      <div></div>;

    return (
      <div className="ballot">
        <div className="alert alert-info alert-dismissible" role="alert">
          <button type="button" className="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
          {ballot_caveat}
        </div>
        {emptyBallot}
        { ballot.map( (item) =>
          <BallotItem key={item.we_vote_id} {...item} />
        ) }
      </div>
    );
  }

}
