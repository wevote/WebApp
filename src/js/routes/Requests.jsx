import React, { Component } from "react";

// import FollowOrIgnore from "../components/Widgets/FollowOrIgnore";

export default class RequestsPage extends Component {
	constructor (props) {
		super(props);
	}

	static getProps () {
		return {};
	}

	render () {
		return <section>
				<div className="container-fluid well gutter-top--small fluff-full1">
					<h3 className="text-center">Friend Requests</h3>
					<h4 className="text-center">Coming Soon</h4>
					<p>Friends will be able to reach out to you so you can collaborate on how to vote.</p>
					{/*
					<h4 className="text-left">Friend Requests</h4>
                    <ul className="list-group">
                        <li className="list-group-item">
		                    <FollowOrIgnore action={VoterGuideActions} action_text={"Add Friend"} />
							<i className="icon-icon-add-friends-2-1 icon-light icon-medium"></i>
							Janet Smith</li>
                        <li className="list-group-item">
		                    <FollowOrIgnore action={VoterGuideActions} action_text={"Add Friend"} />
							<i className="icon-icon-add-friends-2-1 icon-light icon-medium"></i>
							Will Rogers</li>
                        <li className="list-group-item">
		                    <FollowOrIgnore action={VoterGuideActions} action_text={"Add Friend"} />
							<i className="icon-icon-add-friends-2-1 icon-light icon-medium"></i>
							Andrea Moed</li>
                        <li className="list-group-item">
		                    <FollowOrIgnore action={VoterGuideActions} action_text={"Add Friend"} />
							<i className="icon-icon-add-friends-2-1 icon-light icon-medium"></i>
							Amy Muller</li>
                    </ul>
					*/}
				</div>
			</section>;
	}
}
