"use strict";

import React, { Component } from "react";
import { Link } from "react-router";

import 'assets/css/navigation.css';
import AddressBox from 'components/AddressBox/AddressBox';

function loadAddress() {

}

export default class BallotFeedNavigation extends Component {
	render() {
		return (
			<header className="row">
			    <nav className="navbar navbar-main navbar-fixed-top bottom-separator navHeightAuto">
            <section className="container-fluid">
              <div className="navabar-header">
			              <a className="navbar-brand navbar-link" href="#">My Ballot</a>
			              <aside className="pull-right margin-top_15">
			                <Link to="change_location"
			                      className="link-main">Oakland, CA (change)
			                </Link>
                    </aside>
              </div>
			       </section>
			    </nav>
			    <div className="container-fluid bg-light bottom-separator">
			        <div className="row">
			            <div className="col-xs-6 col-md-6 text-center">
			                <i className="icon-icon-add-friends-2-1 icon-light icon-medium"></i>
			                <Link to="add_friends"
			                      className="font-darkest fluff-left-narrow">Add Friends
			                </Link>
			            </div>
			            <div className="col-xs-6 col-md-6 text-center">
			                <i className="icon-icon-more-opinions-2-2 icon-light icon-medium"></i>
			                <Link to="ballot_opinions"
			                      className="font-darkest fluff-left-narrow">More Opinions
			                </Link>
			            </div>
			        </div>
			    </div>
			</header>
		);
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
