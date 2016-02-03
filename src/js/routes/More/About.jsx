import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router';

{/* VISUAL DESIGN HERE: https://projects.invisionapp.com/share/2R41VR3XW#/screens/90192590 */}

export default class About extends Component {
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
					<h4>About We Vote</h4>

			        <p>We Vote USA is a nonprofit, nonpartisan, volunteer-driven movement, dedicated to helping you make voting decisions.
			            We are volunteer designers, engineers, thought leaders, political junkies, and good citizens.
			            We contribute our time and passion because we feel political decisions should be made following
			            clear-headed conversations as opposed to through epic media battles, cast in terms of good versus evil.
			        </p>

			        <span>
			            <Link to="framed_content" >
			                <Button bsStyle="primary">Vision Video</Button>&nbsp;&nbsp;
			            </Link>
			            <Link to="framed_content" >
			                <Button bsStyle="primary">Meet the Team</Button>&nbsp;&nbsp;
			            </Link>
			            <Link to="framed_content" >
			                <Button bsStyle="primary">Our Values</Button>
			            </Link>
			        </span>

			    </div>
			</div>
		);
	}
}
