import React, { Component, PropTypes } from 'react';

import CandidateDetail from 'components/Ballot/CandidateDetail';
import CandidateStore from 'stores/CandidateStore';

export default class Candidate extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount () {

  }

  componentWillUnmount () { }

  render() {
    if (this.state.candidate)
      return <CandidateDetail data={this.state.candidate} />;
    else
      return (<div className="loading-wheel">loading...</div>);
  }

  _onChange () { }
}
