import React, { Component, PropTypes } from 'react';

import CandidateDetail from 'components/Ballot/CandidateDetail';
import CandidateStore from 'stores/CandidateStore';

export default class Candidate extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      candidate: null
    };
  }

  componentDidMount () {
    CandidateStore.getCandidateById(
      this.props.params.id, this.setCandidate.bind(this)
    );
  }

  setCandidate (candidate) {
    this.setState({ candidate });
  }

  componentWillUnmount () { }

  render() {
    if (this.state.candidate)
      return <CandidateDetail {...this.state.candidate} />;
    else
      return (
        <div className="loading-wheel">loading...</div>
      );
  }

  _onChange () { }
}
