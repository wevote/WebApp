import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';


import BallotList from './BallotList';
import BallotFeedNavigation from './BallotFeedNavigation';

/*****************************************************************************/
                            //\\REMOVE\\//
/*****************************************************************************/
/*****************************************************************************/

{/* VISUAL DESIGN HERE: https://invis.io/V33KV2GBR */}

export default class MyBallot extends Component {
	constructor(props) {
		super(props);
	}

	static propTypes = {
		children: PropTypes.object
	}

    static getProps() {
        return {};
    }

    componentDidMount() {

    }

    componentWillUnmount() {
    }

	render() {

	    return (
			<div>
				<BallotFeedNavigation />
				{ this.props.children || <BallotList ballotItems={[]}/> }
			</div>
		);
	}
}
