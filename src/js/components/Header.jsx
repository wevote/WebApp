import React, { Component, PropTypes } from "react";
import { Link } from "react-router";
import Headroom from "react-headroom";

import VoterStore from '../stores/VoterStore';

export default class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    VoterStore.getLocation( location => this.setState({ location }))
  }

  render () {
    var {location} = this.state;
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
                { location }
              </Link>
            </aside>
          </section>
        </Headroom>
      </header>
    );
  }
}
