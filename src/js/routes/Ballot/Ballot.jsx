import React, { Component } from "react";
import BallotStore from "../../stores/BallotStore";
import SupportStore from "../../stores/SupportStore";
import SupportActions from "../../actions/SupportActions";
import LoadingWheel from "../../components/LoadingWheel";
import BallotItem from "../../components/Ballot/BallotItem";

export default class Ballot extends Component {
  constructor (props) {
    super(props);
    this.state = {
      ballot: BallotStore.ballot
    };
  }

  componentDidMount () {
    if (BallotStore.ballot_found === false){ // No ballot found
      this.props.history.push("settings/location");
    }
      SupportActions.retrieveAll();
      SupportActions.retrieveAllCounts();
      this.supportToken = SupportStore.addListener(this._onChange.bind(this));
      this.token = BallotStore.addListener(this._onChange.bind(this));
  }

  componentWillUnmount (){
    this.token.remove();
    this.supportToken.remove();
  }

  _onChange (){
    if (BallotStore.ballot_found && BallotStore.ballot.length === 0){ // Ballot is found but ballot is empty
      this.props.history.push("ballot/empty");
    } else if (BallotStore.ballot && SupportStore.supportList){
      this.setState({ballot: BallotStore.ballot});
    }
  }

  render () {

    const ballot =
      <div className="ballot">
        { this.state.ballot ?
          this.state.ballot.map( (item) =>
          <BallotItem key={item.we_vote_id} {...item} />
        ) :
        LoadingWheel
        }
      </div>;

    return ballot;
  }

}
