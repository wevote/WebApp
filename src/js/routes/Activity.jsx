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
	        	<div className="container-fluid well well-90">
					<h2 className="text-center">Activity Feed<br />
						Coming Soon</h2>
					<p>See the latest endorsements and news.</p>
				</div>
			</div>
		);
	}
}
