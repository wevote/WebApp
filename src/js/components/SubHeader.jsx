import React, { Component } from "react";
import { Link } from "react-router";

export default class SubHeader extends Component {
  constructor(props) {
    super(props);
  }

  render () {
    return (
      <section className="container-fluid ballotList-bg fluff-tight--full separate-bottom">
          <div className="row">
            <div className="col-xs-6 col-md-6 text-center">
              <i className="icon-icon-add-friends-2-1 icon-light icon-medium">
              </i>
              <Link
                to="/friends/add"
                className="font-darkest fluff-left-narrow utils-align--super">
                  Add Friends
              </Link>
            </div>
            <div className="col-xs-6 col-md-6 text-center">
              <i className="icon-icon-more-opinions-2-2 icon-light icon-medium">
              </i>
              <Link
                to="/opinions"
                className="font-darkest fluff-left-narrow utils-align--super">
                  More Opinions
              </Link>
            </div>
          </div>
      </section>
    );
  }
}
