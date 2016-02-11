import React, { Component, PropTypes } from "react";
import { Link } from "react-router";
import Headroom from "react-headroom";

export default class Header extends Component {
  constructor(props) {
    super(props);
  }

  render () {
    return (
      <header className="row">
        <Headroom>
          <section className="separate-bottom container-fluid">
            <h4 className="pull-left gutter-left--window bold">
            <Link to="/more">
              <span className="glyphicon glyphicon-menu-hamburger glyphicon-line-adjustment device-icon--large"></span>
            </Link>
              My Ballot
            </h4>
            <aside className="pull-right gutter-right--window gutter-top--small">
              <Link to="/settings/location"className="font-lightest">
                Oakland, CA
              </Link>
            </aside>
          </section>
        </Headroom>
      </header>
    );
  }
}
