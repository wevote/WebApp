import React, { Component, PropTypes } from "react";
import Helmet from "react-helmet";
import BallotActions from "../../actions/BallotActions";
import BallotStore from "../../stores/BallotStore";
import BallotList from "../../components/Ballot/BallotList";

export default class SelectBallot extends Component {
  static propTypes = {
  };

  constructor (props){
    super(props);
    this.state = {
      ballot_election_list: []
      };
  }

  componentDidMount () {
    this.ballotStoreListener = BallotStore.addListener(this._onBallotStoreChange.bind(this));
    BallotActions.voterBallotListRetrieve();
  }

  componentWillUnmount (){
    this.ballotStoreListener.remove();
  }

  _onBallotStoreChange () {
    console.log("SelectBallot, _onBallotStoreChange " + this.state.ballot_election_list);
    this.setState({ ballot_election_list: BallotStore.ballotList() });
  }

  render () {
     console.log("SelectBallot " + this.state.ballot_election_list);
    return <div>
      <div className="text-center">
        <Helmet title="Ballot List - We Vote" />
        <h1 className = "h1">Your Ballot Guides</h1>
        <BallotList ballot_election_list={this.state.ballot_election_list} />
      </div>
    </div>;
  }
}
