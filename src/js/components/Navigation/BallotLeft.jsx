import React, { PropTypes, Component } from "react";
import { Link } from "react-router";

export default class BallotLeft extends Component {
  static propTypes = {
    email: PropTypes.string,
    first_name: PropTypes.string,
    linked_organization_we_vote_id: PropTypes.string,
    signed_in_facebook: PropTypes.bool,
    is_signed_in: PropTypes.bool,
    signed_in_twitter: PropTypes.bool,
    twitter_screen_name: PropTypes.string,
    voter_photo_url_medium: PropTypes.string
  };

  menuLink (url, label){
    let search = window.location.search ? window.location.search : "";
    let currentUrl = window.location.pathname + search;

    return <li className={"list-group-item" + (url === currentUrl ? " is-active" : "")}>
        <Link to={url}><div><span className="header-menu-text-left">{label}</span></div></Link>
      </li>;
  }

  render () {
    return <div className="u-inset__v--md">
      {/* Temporary "spacing" to be replaced by actual styles */}
      <h4 className="text-left" >&nbsp;</h4>
      <h4 className="text-left" >&nbsp;</h4>
      <h4 className="text-left" >Summary of Ballot Items</h4>
      <ul className="list-group">
        <li className="list-group-item">
          <h3 className="h3"><Link to="/ballot">Office 1</Link></h3>
          <h3 className="h3"><Link to="/ballot">Office 2</Link></h3>
          <h3 className="h3"><Link to="/ballot">Measure 1</Link></h3>
        </li>
      </ul>
      <h4 className="text-left" />
      <span className="terms-and-privacy">
        <br />
        <Link to="/more/terms">Terms of Service</Link>&nbsp;&nbsp;&nbsp;<Link to="/more/privacy">Privacy Policy</Link>
      </span>
    </div>;
  }
}
