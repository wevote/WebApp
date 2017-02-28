import React, { PropTypes, Component } from "react";
import { Link } from "react-router";
var Icon = require("react-svg-icons");

export default class BallotLeft extends Component {
  static propTypes = {
    email: PropTypes.string,
    first_name: PropTypes.string,
    linked_organization_we_vote_id: PropTypes.string,
    signed_in_facebook: PropTypes.bool,
    is_signed_in: PropTypes.bool,
    signed_in_twitter: PropTypes.bool,
    twitter_screen_name: PropTypes.string,
    voter_photo_url: PropTypes.string
  };

  menuLink (url, label){
    let search = window.location.search ? window.location.search : "";
    let currentUrl = window.location.pathname + search;

    return <li className={url === currentUrl ? "active-link list-group-item" : "list-group-item"}>
        <Link to={url}><div><span className="header-menu-text-left">{label}</span></div></Link>
      </li>;
  }

  render () {
    var { linked_organization_we_vote_id, voter_photo_url } = this.props;

    let image_placeholder = "";
    let speaker_type = "V";  // TODO DALE make this dynamic
    if (speaker_type === "O") {
        image_placeholder = <span className="position-statement__avatar"><Icon name="avatar-generic" width={34} height={34} /></span>;
    } else {
        image_placeholder = <span className="position-statement__avatar"><Icon name="avatar-generic" width={34} height={34} /></span>;
    }

    let search = window.location.search ? window.location.search : "";
    let currentUrl = window.location.pathname + search;
    let show_your_page_from_twitter = this.props.signed_in_twitter && this.props.twitter_screen_name;
    let show_your_page_from_facebook = this.props.signed_in_facebook && linked_organization_we_vote_id && !show_your_page_from_twitter;

    return <div>
      <div className="device-menu--large">
        <ul className="list-group">
          <li className="list-group-item">
            <span className="we-vote-promise">Our Promise: We'll never sell your email.</span>
          </li>
        </ul>
        <h4 className="text-left" />
        <ul className="list-group">
          { show_your_page_from_twitter ?
            <li className={"/" + this.props.twitter_screen_name === currentUrl ? "active-link list-group-item" : "list-group-item"}>
              <Link to={"/" + this.props.twitter_screen_name}><div>
                { voter_photo_url ?
                  <img className="position-statement__avatar"
                        src={voter_photo_url}
                        width="34px"
                  /> :
                  image_placeholder }
                <span className="header-menu-text-left">Your Voter Guide</span>
              </div></Link>
            </li> :
            null
          }
          { show_your_page_from_facebook ?
            <li className={"/voterguide/" + linked_organization_we_vote_id === currentUrl ? "active-link list-group-item" : "list-group-item"}>
              <Link to={"/voterguide/" + linked_organization_we_vote_id}><div>
                { voter_photo_url ?
                  <img className="position-statement__avatar"
                        src={voter_photo_url}
                        width="34px"
                  /> :
                  image_placeholder }
                <span className="header-menu-text-left">Your Voter Guide</span>
              </div></Link>
            </li> :
            null
          }
          { !show_your_page_from_twitter && !show_your_page_from_facebook ?
            this.menuLink("/yourpage", "Your Voter Guide") :
            null
          }
          {this.menuLink("/more/sign_in", "Your Account")}
        </ul>
        <h4 className="text-left" />
        <span className="terms-and-privacy">
          <br />
          <Link to="/more/terms">Terms of Service</Link>&nbsp;&nbsp;&nbsp;<Link to="/more/privacy">Privacy Policy</Link>
        </span>
      </div>
      </div>;
  }
}
