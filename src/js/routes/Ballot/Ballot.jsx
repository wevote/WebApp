import React, { Component, PropTypes } from "react";
import BallotStore from "../../stores/BallotStore";
import SupportStore from "../../stores/SupportStore";
import SupportActions from "../../actions/SupportActions";
import LoadingWheel from "../../components/LoadingWheel";
import BallotItem from "../../components/Ballot/BallotItem";

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
    if (BallotStore.ballot_found === false){ // No ballot found
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
    if (BallotStore.ballot_found && BallotStore.ballot && BallotStore.ballot.length === 0){ // Ballot is found but ballot is empty
      this.props.history.push("ballot/empty");
    }
    this.setState({loading: false});
  }

  render () {
    let query = this.props.location.query;
    let ballot;
    if (query && query.filterSupport){
      ballot = BallotStore.ballot_supported;
    } else if (query && query.filterRemaining){
      ballot = BallotStore.ballot_remaining_choices;
    } else {
      ballot = BallotStore.ballot;
    }
    // let ballot = query && query.filterSupport ? BallotStore.ballot_supported : BallotStore.ballot;

    return (
      <div className="ballot">
        { ballot ?
          ballot.map( (item) =>
          <BallotItem key={item.we_vote_id} {...item} />
        ) :
        LoadingWheel
        }
      </div>
    );
  }

}
