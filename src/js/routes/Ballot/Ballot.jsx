import React, { Component, PropTypes } from "react";
import LoadingWheel from "../../components/LoadingWheel";

import BallotStore from "../../stores/BallotStore";
import BallotItem from "../../components/Ballot/BallotItem";


export default class Ballot extends Component {
  static propTypes = {
    history: PropTypes.array,
    children: PropTypes.object
  };

  constructor (props) {
    super(props);
    this.state = {};
  }

  componentDidMount () {
    BallotStore.initialize( (ballot_list) => {

      if (ballot_list.length === 0)
        this.props.history.push("settings/location");

      else
        this.setState({ ballot_list });

    });
  }

  render () {
    var { ballot_list } = this.state;

    const ballot =
      <div className="ballot-list">
        { ballot_list ? ballot_list.map( item =>
          <BallotItem key={item.we_vote_id} {...item} />
        ) : LoadingWheel }
      </div>;

    return ballot;
  }
}
