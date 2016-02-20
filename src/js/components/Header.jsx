const web_app_config = require("../config");
import React, { Component, PropTypes } from "react";
import { Link } from "react-router";
import Headroom from "react-headroom";
import LanguageSwitchNavigation from "../components/LanguageSwitchNavigation";
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

  show() {
    var mainContainer = document.querySelector('.container-main');
    if (this.state.visible) {
      document.addEventListener("click", this.setState({visible: false}));
      mainContainer.style.opacity = 1;
    } else {
      document.addEventListener("click", this.setState({visible: true}));
      mainContainer.style.opacity = .2;
    }
  }

  render () {
    var voter_image = "";
      if (this.props.voter_photo_url) {
        voter_image = <img
          src={this.props.voter_photo_url}
          className="img-circle"
          width="25px"
          height="25px" />
      }
    var {location} = this.state;

    return <header className="row">
      <Headroom>
        <section className="separate-bottom container-fluid">
          <h4 className="pull-left gutter-left--window bold">
            <span onClick={this.show.bind(this)} className="glyphicon glyphicon-menu-hamburger glyphicon-line-adjustment device-icon--large"></span>
            My Ballot
          </h4>
          <aside className="header-address pull-right gutter-right--window gutter-top--small">
            <Link to="/settings/location"className="font-lightest">
              {location}
            </Link>
          </aside>
        </section>
      </Headroom>
    {/* The menu has to be reproduced for mobile */}
      <div className={(this.state.visible ? "visible" : "hidden") + " device-menu--mobile container-fluid well well-90"}>
        {this.props.signed_in_personal ?
          <span></span>
          :
          <span>
            <ul className="list-group">
              <li className="list-group-item"><Link to="/more/sign_in">Sign In</Link></li>
            </ul>
            <h4 className="text-left"></h4>
          </span>
          }
        <ul className="list-group">
          {/*<li className="list-group-item"><Link to="/more/email_ballot">Print or Email Ballot</Link></li>*/}
          <li className="list-group-item"><Link to="/more/opinions/followed">Opinions I'm Following</Link></li>
          <li className="list-group-item"><Link to="/settings/location">My Ballot Location</Link></li>
          <li className="list-group-item"><Link to="/more/sign_in">Account Settings</Link></li>
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
          <li className="list-group-item"><Link to="/more/about">About <strong>We Vote</strong></Link></li>
          {/*<li className="list-group-item"><Link to="/more/privacy">Terms &amp; Policies</Link></li>*/}
          <li className="list-group-item"><a href={ web_app_config.WE_VOTE_SERVER_ADMIN_ROOT_URL }
                             target="_blank">Admin</a></li>
          {/*
          {this.props.signed_in_personal ?
            <li className="list-group-item"><Link to="/signout">Sign Out</Link></li>
            :
            <span></span>
          }
          */}
        </ul>
      </div>
    </header>;
  }
}
