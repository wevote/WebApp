import React, { PropTypes, Component } from 'react';

{/* VISUAL DESIGN HERE: TBD */}

export default class Activity extends Component {
    static propTypes = {
        children: PropTypes.object
    };

	constructor(props) {
		super(props);
	}

	static getProps() {
		return {};
	}

	render() {
	    return (
			<div>
	        	<div className="container-fluid well gutter-top--small fluff-full1">
					<h3 className="text-center">Activity Feed</h3>
					<h4 className="text-center">Coming Soon</h4>
					<p>See the latest endorsements and news.</p>
				</div>
			</div>
		);
	}
}
