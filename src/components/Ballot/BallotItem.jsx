import React, { Component, PropTypes } from 'react';

import Candidate from 'components/Ballot/Candidate';

import InfoIconAction from 'components/InfoIconAction';
import StarAction from 'components/StarAction';

export default class BallotItem extends Component {
    static propTypes = {
        data: PropTypes.object.isRequired
    }

    render() {
        let {
            we_vote_id,
            ballot_item_display_name,
            candidate_list

        } = this.props.data;

        let candidateList = [];

        candidate_list.forEach( candidate =>
            candidateList.push(
                < Candidate
                    data={candidate}
                    key={candidate.we_vote_id}/>
                )
        );

        return (
            <div
                id={we_vote_id}
                className="ballot-item well well-skinny split-top-skinny"
                >
                { ballot_item_display_name }
                <InfoIconAction />
                <StarAction />
                <ul className="list-group">
                    { candidateList }
                </ul>
            </div>
        )
    }
}
