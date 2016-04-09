import React, { PropTypes, Component } from "react";
import { Link } from "react-router";

export default class MoreMenu extends Component {
  static propTypes = {
    email: PropTypes.string,
    first_name: PropTypes.string,
    voter_photo_url: PropTypes.string,
    signed_in_personal: PropTypes.bool
  };

  menuLink (url, label){
    let search = window.location.search ? window.location.search : "";
    let currentUrl = window.location.pathname + search;

    return <li className={url === currentUrl? "active-link list-group-item" : "list-group-item"}>
        <Link to={url}><div>{label}</div></Link>
      </li>;
  }

  render () {

  return <div>
    <div className="device-menu--large container-fluid well well-90">
      {/* Please keep these styles up-to-date since we need to turn this on soon
      {this.props.signed_in_personal ?
        <span></span>
        : <span>
          <ul className="list-group">
            <li className="list-group-item"><Link to="/more/sign_in"><div>Sign In</div></Link></li>
          </ul>
          <h4 className="text-left"></h4>
        </span>
        }
      */}
      <ul className="list-group">
        {this.menuLink("/ballot", "My Voter Guide")}
        {this.menuLink("/more/opinions/followed", "Opinions I'm Following")}
        {this.menuLink("/ballot?type=filterSupport", "What I Support")}
        {this.menuLink("/ballot?type=filterRemaining", "Choices Remaining")}
        {this.menuLink("/settings/location", "My Address")}
        {this.props.signed_in_personal ?
          <li className="list-group-item"><Link to="/more/sign_in"><div>Account Settings</div></Link></li> : <span></span>
        }
      </ul>
      <h4 className="text-left"></h4>
      <ul className="list-group">
      {this.menuLink("/more/about", "About We Vote")}
        {this.props.signed_in_personal ?
          <li className="list-group-item"><Link to="/signout">Sign Out</Link></li> :
          <span></span>
        }
      </ul>
    </div>
    </div>;
  }
}
