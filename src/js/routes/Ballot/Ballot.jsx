import React, { Component } from "react";

import BallotStore from "../../stores/BallotStore";
import BallotActions from "../../actions/BallotActions";
import BallotItem from "../../components/Ballot/BallotItem";

export default class Ballot extends Component {
  constructor (props) {
    super(props);
    this.state = {
      ballot: []
    };
  }

  componentDidMount () {
    BallotActions.init();
    this.token = BallotStore.addListener(this._onChange.bind(this));
  }

  componentWillUnmount (){
    this.token.remove();
  }

  _onChange (){
    this.setState({ ballot: BallotStore.ballot });
  }

  render () {

    const ballot =
      <div className="ballot">
        {
          this.state.ballot.map( (item) =>
          <BallotItem key={item.we_vote_id} {...item} />
          )
        }
      </div>;

    return ballot;
  }

}
