const web_app_config = require("../config");
import React, { Component, PropTypes } from "react";
import { Link } from "react-router";
import Headroom from "react-headroom";
import VoterStore from "../stores/VoterStore";

export default class Header extends Component {
  static propTypes = {
    email: PropTypes.string,
    first_name: PropTypes.string,
    voter_photo_url: PropTypes.string,
    signed_in_personal: PropTypes.bool
  };

  constructor (props) {
    super(props);
    this.state = {
      visible: false
    };
  }

  componentDidMount () {
    VoterStore.getLocation( (err, location) => {
      if (err) console.error(err);

      this.setState({ location });

    });
  }

  show () {
    var mainContainer = document.querySelector(".container-main");
    if (this.state.visible) {
      document.addEventListener("click", this.setState({visible: false}));
      mainContainer.style.opacity = 1;
    } else {
      document.addEventListener("click", this.setState({visible: true}));
      mainContainer.style.opacity = 0.2;
    }
  }

  hide () {
    this.setState({visible: false});
    document.querySelector(".container-main").style.opacity = 1;
  }

  render () {
    var { location, visible } = this.state;
    var { voter_photo_url: url, signed_in_personal: signedIn } = this.props;
    // var image;
    //
    // if (url)
    //   image = <img src={url} className="img-circle" width="25px" height="25px" />;

    const header =
      <header className="header row">
        <Headroom>
          <section className="separate-bottom container-fluid">
            <h4 className="pull-left gutter-left--window bold">
              <span onClick={this.show.bind(this)} className="glyphicon glyphicon-menu-hamburger glyphicon-line-adjustment device-icon--large">
              </span>
              My Ballot
            </h4>
            <aside className="header-address pull-right gutter-right--window gutter-top--small">
              <Link to="/settings/location" className="font-lightest">
                {location}
              </Link>
            </aside>
          </section>
        </Headroom>
      {/* The menu has to be reproduced for mobile */}
        <div className={(visible ? "visible" : "hidden") + " device-menu--mobile container-fluid well well-90"}>
          { signedIn ? <span></span> :
            <span>
              <ul className="list-group">
                <li className="list-group-item">
                  <Link onClick={this.hide.bind(this)} to="/more/sign_in">
                    Sign In
                  </Link>
                </li>
              </ul>
              <h4 className="text-left"></h4>
            </span>
          }
          <ul className="list-group">
            {/*<li className="list-group-item"><Link to="/more/email_ballot">Print or Email Ballot</Link></li>*/}
            <li className="list-group-item">
              <Link onClick={this.hide.bind(this)} to="/more/opinions/followed">
                Opinions I'm Following
              </Link>
            </li>
            <li className="list-group-item">
              <Link onClick={this.hide.bind(this)} to="/settings/location">
                My Ballot Location
              </Link>
            </li>
            { signedIn ?
                <li className="list-group-item">
                  <Link onClick={this.hide.bind(this)} to="/more/sign_in">
                    Account Settings
                  </Link>
                </li>
                : <span></span>
            }
          </ul>
          {/*
          <ul className="list-group">
             <li className="list-group-item">
              <LanguageSwitchNavigation />
             </li>
          </ul>
          */}
          <h4 className="text-left"></h4>
          <ul className="list-group">
            <li className="list-group-item">
              <Link onClick={this.hide.bind(this)} to="/more/about">
                About <strong>We Vote</strong>
              </Link>
            </li>

            {/*<li className="list-group-item"><Link to="/more/privacy">Terms &amp; Policies</Link></li>*/}

            <li className="list-group-item">
              <a href={ web_app_config.WE_VOTE_SERVER_ADMIN_ROOT_URL } target="_blank">
                Admin
              </a>
            </li>

            {/* To be implemented in a coming release
            { signedIn ?
              <li className="list-group-item">
                <Link onClick={this.hide.bind(this)} to="/signout">
                  Sign Out
                </Link>
              </li> : <span></span> }
            */}
          </ul>
        </div>
      </header>;

    return header;
  }
}
