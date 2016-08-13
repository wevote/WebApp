import React, { PropTypes, Component } from "react";
import { Link } from "react-router";
import FacebookActions from "../actions/FacebookActions";

export default class MoreMenu extends Component {
  static propTypes = {
    email: PropTypes.string,
    first_name: PropTypes.string,
    twitter_screen_name: PropTypes.string,
    voter_photo_url: PropTypes.string,
    signed_in_personal: PropTypes.bool,
    signed_in_twitter: PropTypes.bool
  };

  menuLink (url, label){
    let search = window.location.search ? window.location.search : "";
    let currentUrl = window.location.pathname + search;

    return <li className={url === currentUrl ? "active-link bs-list-group-item" : "bs-list-group-item"}>
        <Link to={url}><div><span className="header-menu-text-left">{label}</span></div></Link>
      </li>;
  }

  render () {
    const logOut = FacebookActions.appLogout;

  return <div>
    <div className="device-menu--large">
      <ul className="bs-list-group">
        <li className="bs-list-group-item">
          <span className="we-vote-promise">We Vote's Promise: We will never sell your email.</span>
        </li>
      </ul>
      <h4 className="bs-text-left"></h4>
      <ul className="bs-list-group">
        { this.props.signed_in_twitter && this.props.twitter_screen_name ?
          this.menuLink("/" + this.props.twitter_screen_name, "Your Profile") :
          null
        }
        {this.menuLink("/settings/location", "Your Address & Ballot")}
        {this.menuLink("/opinions", "Who You Can Follow")}
        {this.props.signed_in_personal ?
          <li onClick={logOut} className="bs-list-group-item"><a><span className="header-menu-text-left">Sign Out</span></a></li> :
          this.menuLink("/more/sign_in", "Sign In")
        }
      </ul>
      <h4 className="bs-text-left"></h4>
      <ul className="bs-list-group">
      {this.menuLink("/more/about", "About We Vote")}
      </ul>
    </div>
    </div>;
  }
}
