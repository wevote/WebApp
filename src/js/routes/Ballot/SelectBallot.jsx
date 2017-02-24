import React, { Component } from "react";
import { browserHistory } from "react-router";
import Helmet from "react-helmet";
import BallotActions from "../../actions/BallotActions";
import BallotStore from "../../stores/BallotStore";
import BallotElectionList from "../../components/Ballot/BallotElectionList";

export default class SelectBallot extends Component {
  constructor (props){
    super(props);
    this.state = {
      ballot_election_list: []
      };
  }

  componentDidMount () {
    this.ballotStoreListener = BallotStore.addListener(this._onBallotStoreChange.bind(this));
    BallotActions.voterBallotListRetrieve();
    document.body.className = "select-ballot-view";
  }

  componentWillUnmount (){
    this.ballotStoreListener.remove();
    document.body.className = "";
  }

  _onBallotStoreChange () {
//    console.log("SelectBallot, _onBallotStoreChange " + this.state.ballot_election_list);
    this.setState({ ballot_election_list: BallotStore.ballotList() });
  }

    goToLink () {
    const sampleLink = "/ballot";
    browserHistory.push(sampleLink);
  }

  render () {
//     console.log("SelectBallot " + this.state.ballot_election_list);
    return <div>
        <Helmet title="Ballot List - We Vote" />
        <div className="ballot-election-list container-fluid well u-inset--md">
          <img src={"/img/global/icons/x-close.png"} role="button" onClick={this.goToLink} className="x-close" alt={"close"}/>
          <div className = "ballot-election-list__h1">Your Ballot Guides</div>
          <p className="ballot-election-list__h2">Click on a link below to view all your ballot guides</p>
          <BallotElectionList ballot_election_list={this.state.ballot_election_list} />
      </div>
    </div>;
  }
}
