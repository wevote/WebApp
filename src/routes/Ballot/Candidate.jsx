import React, { Component, PropTypes } from 'react';

import CandidateDetail from 'components/Ballot/CandidateDetail';

export default class Candidate extends Component {
    static propTypes = {
        params: PropTypes.object.isRequired,
        ballotStore: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
    }

    componentDidMount () { }

    componentWillUnmount () { }

    render() {
        if (this.state.candidate)
          return <CandidateDetail data={this.state.candidate} />;
        else
          return (<div className="loading-wheel">loading...</div>);
    }

  _onChange () { }
}
