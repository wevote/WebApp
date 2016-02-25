import React, { Component, PropTypes } from "react";

import Candidate from "./Candidate";
import CandidateStore from "../../stores/CandidateStore";
import CandidateActions from "../../actions/CandidateActions";

export default class Office extends Component {
  static propTypes = {
    id: PropTypes.string,
    displayName: PropTypes.string,
    candidates: PropTypes.array,
    children: PropTypes.array,
    _raw: PropTypes.object // raw object data
  };

  constructor (props) {
    super(props);

    this.state = {
      candidates: []
    };
  }

  componentDidMount () {
    
  }

  componentWillUnmount () {

  }

  render () {
    var { id, displayName, candidates } = this.props;

    const office =
      <div className="office ballot-item well well-skinny gutter-top--small">

        {this.props.children}

        {}

      </div>;

    return office;
  }
}
