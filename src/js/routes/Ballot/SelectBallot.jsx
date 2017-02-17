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
      ballot_list: []
      };
  }

  componentDidMount () {
    if(!BallotStore.ballotList().length){
      BallotActions.voterBallotListRetrieve();
    }
    this.ballotStoreListener = BallotStore.addListener(this._onBallotStoreChange.bind(this));
  }

  componentWillUnmount (){
    this.ballotStoreListener.remove();
  }

  _onBallotStoreChange () {
    this.setState({ ballot_list: BallotStore.ballotList() });
  }

  render () {
     console.log(this.state);
    return <div>
      <Helmet title="Ballot List - We Vote" />
      <h1 className = "h1">Your Election Guides</h1>
      <BallotList ballot_list={this.state.ballot_list} />
    </div>;
  }
}
