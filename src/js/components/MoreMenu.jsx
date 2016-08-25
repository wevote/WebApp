import React, { PropTypes, Component } from "react";
import { Link } from "react-router";
import FacebookActions from "../actions/FacebookActions";
var Icon = require("react-svg-icons");

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

    return <li className={url === currentUrl ? "active-link list-group-item" : "list-group-item"}>
        <Link to={url}><div><span className="header-menu-text-left">{label}</span></div></Link>
      </li>;
  }

  render () {
    const logOut = FacebookActions.appLogout;

    var { voter_photo_url } = this.props;

    let image_placeholder = "";
    let speaker_type = "V";  // TODO DALE make this dynamic
    if (speaker_type === "O") {
        image_placeholder = <span className="position-statement__avatar"><Icon name="avatar-generic" width={34} height={34} /></span>;
    } else {
        image_placeholder = <span className="position-statement__avatar"><Icon name="avatar-generic" width={34} height={34} /></span>;
    }

    let search = window.location.search ? window.location.search : "";
    let currentUrl = window.location.pathname + search;

    return <div>
      <div className="device-menu--large">
        <ul className="list-group">
          <li className="list-group-item">
            <span className="we-vote-promise">We Vote's Promise: We will never sell your email.</span>
          </li>
        </ul>
        <h4 className="text-left"></h4>
        <ul className="list-group">
          { this.props.signed_in_twitter && this.props.twitter_screen_name ?
            <li className={"/" + this.props.twitter_screen_name === currentUrl ? "active-link list-group-item" : "list-group-item"}>
              <Link to={"/" + this.props.twitter_screen_name}><div>
                { voter_photo_url ?
                  <img className="position-statement__avatar"
                        src={voter_photo_url}
                        width="34px"
                  /> :
                  image_placeholder }
                <span className="header-menu-text-left">Your Page</span>
              </div></Link>
            </li> :
            this.menuLink("/settings/claim", "Claim Your Page")
          }
          {this.menuLink("/settings/location", "Your Address & Ballot")}
          {this.menuLink("/opinions", "Who You Can Follow")}
          {this.props.signed_in_personal ?
            <li onClick={logOut} className="list-group-item"><a><span className="header-menu-text-left">Sign Out</span></a></li> :
            this.menuLink("/more/sign_in", "Sign In")
          }
        </ul>
        <h4 className="text-left"></h4>
        <ul className="list-group">
        {this.menuLink("/more/about", "About We Vote")}
        </ul>
      </div>
      </div>;
  }
}
