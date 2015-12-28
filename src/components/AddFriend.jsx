import React, { Component } from 'react';
import { Link } from 'react-router';

import { Button, ButtonToolbar, Input } from 'react-bootstrap';

import HeaderBackNavigation from 'components/Navigation/HeaderBackNavigation';
import BottomContinueNavigation from 'components/Navigation/BottomContinueNavigation';

export default class AddFriend extends Component {
	constructor(props) {
		super(props);
	}

	static getProps() {
		return {};
	}

	render() {
        var floatRight = {
            float: 'right'
        };

	    return (
            <div>
            	<Link to="/ballot"> &lt;Back to My Ballot"}
                </Link>
            	<div className="container-fluid well well-90">
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
            	</div>
                <Link to="addbyaddress">
                    Next
                </Link>
            </div>
		);
	}
}
