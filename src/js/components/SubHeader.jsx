import React, { Component, PropTypes } from "react";
import { Link } from "react-router";

export default class SubHeader extends Component {
  static propTypes = {
    ballotItemWeVoteId: PropTypes.string,
    pathname: PropTypes.string
  };
  constructor (props) {
    super(props);
  }

  render () {
    var moreOpinionsLink = "/opinions";
    return <section className="container-fluid ballotList-bg fluff-tight--full separate-bottom">
          <div className="row">
            <Link
              to="/friends/add"
              className="font-darkest fluff-left-narrow utils-align--super">
              <div className="col-xs-6 col-md-6 text-center">
                <i className="icon-icon-add-friends-2-1 icon-light icon-medium">
                </i>
                  Add Friends
              </div>
            </Link>
            <Link
              to={moreOpinionsLink}
              className="font-darkest fluff-left-narrow utils-align--super">
              <div className="col-xs-6 col-md-6 text-center">
                <i className="icon-icon-more-opinions-2-2 icon-light icon-medium">
                </i>
                  Who I Can Follow
              </div>
            </Link>
          </div>
      </section>;
  }
}
