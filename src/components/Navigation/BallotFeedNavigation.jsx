"use strict";

import React from "react";
import { Link } from "react-router";
import NavCSS from 'assets/css/navigation.css'

export default class BallotFeedNavigation extends React.Component {
	render() {
		return (
<header className="row">
    <nav className={"navbar navbar-main navbar-fixed-top bottom-separator " + NavCSS.navHeightAuto}>
        <section className="container-fluid">
              <h4 className="pull-left no-space bold">My Ballot</h4>
              <aside className="pull-right">
                <Link to="more_change_location"
                      className="font-lightest">Oakland, CA (change)
                </Link>
              </aside>
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
}
