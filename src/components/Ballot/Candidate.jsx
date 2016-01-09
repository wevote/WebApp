import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

import StarAction from 'components/StarAction';

export default class Candidate extends Component {
    static propTypes = {
      ballot_item_display_name: PropTypes.string,
      candidate_photo_url: PropTypes.string,
      id: PropTypes.number,
      opposeCount: PropTypes.number,
      order_on_ballot: PropTypes.string,
      supportCount: PropTypes.number,
      we_vote_id: PropTypes.string
    };

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    render() {
        let {
            we_vote_id,
            ballot_item_display_name,
            supportCount,
            opposeCount
        }
        = this.props;

        return (

        );
    }
}
