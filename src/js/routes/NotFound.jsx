import React, { Component } from "react";
import Candidate from "./Ballot/Candidate";

export default class NotFound extends Component {
  static propTypes = {
  };

  constructor (props) {
    super(props);
  }

  render () {
    // TODO DALE This is a proof of concept. Replace with Twitter -> We Vote ID translator.
	this.props.params.we_vote_id = "wv02cand1979";
    return <div>
		<Candidate {...this.props} />
      </div>;
  }
}
