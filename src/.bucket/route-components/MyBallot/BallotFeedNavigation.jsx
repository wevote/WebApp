"use strict";

import React, { Component } from "react";
import { Link } from "react-router";



function loadAddress() {

}

export default class BallotFeedNavigation extends Component {
	render() {
		return ;
	}

	/**
     * save address changes
     * @return {undefined}
     */
    _changeSaved(err) {
        if (err) console.error('Issue saving address to server..', err);
        console.log('Ballot page saving...');
    }
}
