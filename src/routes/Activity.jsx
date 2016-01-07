import React, { PropTypes, Component } from "react";

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
					Activity Feed Coming Soon
				</div>
			</div>
		);
	}
}
