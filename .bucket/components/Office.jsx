import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

import CandidateStore from 'stores/CandidateStore';

import StarAction from "components/StarAction";
import InfoIconAction from "components/InfoIconAction";

function getCandidateState() {
    return {};
}

export default class Office extends Component {
    static propTypes = {
        office_name: PropTypes.string,
        we_vote_id: PropTypes.string
    };

    constructor(props) {
        super(props);

        let { we_vote_id } = this.props;
    }

    render() {
        let {
            office_name, we_vote_id
        } =
        this.props;

        return (
            <div className='office well well-sm split-top-skinny'>
                { office_name }
                <InfoIconAction we_vote_id={we_vote_id} />
                <StarAction we_vote_id={we_vote_id} />
            </div>
        );
    }

    _onChange() {
    }
}
