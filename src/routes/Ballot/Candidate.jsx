import React, { Component, PropTypes } from 'react';

import CandidateDetail from 'components/Ballot/CandidateDetail';

export default class Candidate extends Component {
    static propTypes = {
        params: PropTypes.object.isRequired,
        ballotStore: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.id = `wvtecand${this.props.params.id}`;
        this.state = {
          candidate: this.props.ballotStore.getCandidateById(this.id)
        };
    }

    componentDidMount () {
      this.props.ballotStore._addChangeListener(this._onChange.bind(this));
    }

    componentWillUnmount () {
      this.props.ballotStore._removeChangeListener(this._onChange.bind(this));
    }

    render() {
        if (this.state.candidate)
          return <CandidateDetail data={this.state.candidate} />;
        else
          return (<div className="loading-wheel">loading...</div>);
    }

  _onChange () {
    this.setState({
      candidate: this.props.ballotStore.getCandidateById(this.id)
    });
  }
}
