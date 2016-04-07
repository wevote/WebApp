import React, { PropTypes, Component } from "react";
import { Link } from "react-router";

export default class MoreMenu extends Component {
  static propTypes = {
    email: PropTypes.string,
    first_name: PropTypes.string,
    voter_photo_url: PropTypes.string,
    signed_in_personal: PropTypes.bool
  };

  constructor (props) {
    super(props);
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
        <li className="list-group-item"><Link to="/ballot"><div>My Voter Guide</div></Link></li>
        <li className="list-group-item"><Link to="/more/opinions/followed"><div>Opinions I'm Following</div></Link></li>
        <li className="list-group-item"><Link to={{ pathname: "/ballot", query: { filterSupport: true } }}><div>What I Support</div></Link></li>
        <li className="list-group-item"><Link to="/ballot"><div>What I've Starred</div></Link></li>
        <li className="list-group-item"><Link to="/settings/location"><div>My Address</div></Link></li>
        {this.props.signed_in_personal ?
          <li className="list-group-item"><Link to="/more/sign_in"><div>Account Settings</div></Link></li> : <span></span>
        }
      </ul>
      <h4 className="text-left"></h4>
      <ul className="list-group">
        <li className="list-group-item"><Link to="/more/about"><div>About <strong>We Vote</strong></div></Link></li>
        {this.props.signed_in_personal ?
          <li className="list-group-item"><Link to="/signout">Sign Out</Link></li> :
          <span></span>
        }
      </ul>
    </div>
    </div>;
  }
}
