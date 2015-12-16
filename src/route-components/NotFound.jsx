import React, { Component } from "react";

export default class NotFound extends Component {
	static getProps() {
		return {};
	}
	render() {
		return (
			<div>
				<h2>Not found</h2>
				<p>The page you requested was not found.</p>
			</div>
		);
	}
}
