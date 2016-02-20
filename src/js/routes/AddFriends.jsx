import React, { Component } from 'react';
import { Link } from 'react-router';
import { Input } from 'react-bootstrap';
import BottomContinueNavigation from '../components/Navigation/BottomContinueNavigation';

{/* VISUAL DESIGN HERE: https://projects.invisionapp.com/share/2R41VR3XW#/screens/89479679 */}

export default class AddFriends extends Component {
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
					<h3 className="text-center">Add Friends</h3>
					<h4 className="text-center">Coming Soon</h4>
					<p>You will be able to ask your friends for their opinions on how to vote.</p>
					{/* Still to be implemented
            		<h2 className="text-center">Add Friends</h2>
            		<div>
            			<label htmlFor="last-name">Include a Message <span className="small">(Optional)</span></label><br />
            			<input type="text" name="add_friends_message" className="form-control"
            				   defaultValue="Please join me in preparing for the upcoming election." /><br />
            			<Input type="text" addonBefore="@" name="email_address" className="form-control"
            				   placeholder="Enter email address(es) of friend(s) here" />
            			<span>These friends will see what you support, oppose, and which opinions you follow.
            				We never sell email addresses.</span><br />
            		</div>
            		*/}
            	</div>
				{/* Still to be implemented
				<BottomContinueNavigation />
				*/}
            </div>
		);
	}
}
