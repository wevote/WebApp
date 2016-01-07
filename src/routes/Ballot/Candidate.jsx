import React, { Component, PropTypes } from 'react';

import BallotStore from 'stores/BallotStore';

export default class Candidate extends Component {
    static propTypes = {
        params: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

    }


    render() {
        let { id } = this.props.params;
        let candidate = BallotStore.getCandidateById(`wve5cand${id}`)

        return (
            <div>
            </div>
        );
    }
}
