import React, { Component, PropTypes } from "react";
import { Link } from "react-router";
import FriendStore from "../../stores/FriendStore";

const links = {
  ballot: function (active) {
    var icon = "glyphicon glyphicon-list-alt glyphicon-line-adjustment nav-icon";

    var jsx =
      <Link to="/ballot" className={ "header-nav__item" + (active ? " active-icon" : "")}>
        <span className={icon} title="Ballot" />
        <span className="header-nav__label">
          Ballot
          </span>
      </Link>;

    return jsx;
  },

  requests: function (active, number_of_incoming_friend_requests) {
    var icon = "glyphicon glyphicon-inbox glyphicon-line-adjustment nav-icon";

    var jsx =
      <Link to="/requests" className={ "header-nav__item" + (active ? " active-icon" : "")}>
        <span className={icon} title="Requests">
          {number_of_incoming_friend_requests ?
            <span className="badge-total badge">{number_of_incoming_friend_requests}</span> :
            null }
        </span>
        <span className="header-nav__label">
          Requests
          </span>
      </Link>;

    return jsx;
  },

  connect: function (active) {
    var icon = "glyphicon icon-icon-connect-1-3 glyphicon-line-adjustment nav-icon";

    var jsx =
      <Link to="/more/connect" className={ "header-nav__item" + (active ? " active-icon" : "")}>
        <span className={icon} title="Connect" />
        <span className="header-nav__label">
          Connect
          </span>
      </Link>;

    return jsx;
  },

  activity: function (active) {
    var icon = "glyphicon icon-icon-activity-1-4 glyphicon-line-adjustment nav-icon";

    var jsx =
      <Link to="/activity" className={ "header-nav__item" + (active ? " active-icon" : "")}>
        <span className={icon} title="Activity" />
        <span className="header-nav__label">
          Activity
          </span>
      </Link>;

    return jsx;
  },

  donate: function (active) {

    var jsx =
      <Link to="/more/donate" className={ "donate header-nav__item" + (active ? " active-icon" : "")}>
        <img className = "glyphicon" src="/img/global/svg-icons/glyphicons-20-heart-empty.svg" />
        <span className="header-nav__label">
          Donate
          </span>
      </Link>;

    return jsx;
  }
};

export default class NavigatorInHeader extends Component {
  static propTypes = {
    pathname: PropTypes.string
  };

  constructor (props) {
      super(props);
      this.state = {
        friend_invitations_sent_to_me: FriendStore.friendInvitationsSentToMe(),
        about_menu_open: false
      };
      this.toggleAboutMenu = this.toggleAboutMenu.bind(this);
      this.aboutMenu = this.aboutMenu.bind(this);
  }

  componentDidMount () {
    this.friendStoreListener = FriendStore.addListener(this._onFriendStoreChange.bind(this));
  }

  componentWillUnmount (){
    this.friendStoreListener.remove();
  }

  _onFriendStoreChange () {
    this.setState({
      friend_invitations_sent_to_me: FriendStore.friendInvitationsSentToMe()
    });
  }
  toggleAboutMenu () {
    this.setState({about_menu_open: !this.state.about_menu_open});
  }
  aboutMenu () {

    let aboutMenuOpen = this.state.about_menu_open ? "about-menu-open" : "";

    return (
      <div className={aboutMenuOpen}>
      <div className="page-overlay" onClick={this.toggleAboutMenu} />
      <div className="about-menu">

          <ul className="nav nav-stacked">
              <li>
                <Link onClick={this.toggleAboutMenu} to={"/more/howtouse"}>
                  <div>
                    <span className="header-slide-out-menu-text-left">How to use We Vote</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link onClick={this.toggleAboutMenu} to={"/more/vision"}>
                  <div>
                    <span className="header-slide-out-menu-text-left">Vision</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link onClick={this.toggleAboutMenu} to={"/more/organization"}>
                  <div>
                    <span className="header-slide-out-menu-text-left">Organization</span>
                  </div>
                </Link>
              </li>
            <li>
              <Link onClick={this.toggleAboutMenu} to={"/more/team"}>
                <div>
                  <span className="header-slide-out-menu-text-left">Team</span>
                </div>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    );
  }

  render () {
    //console.log(this.props.accountMenu);
    var { props: { pathname } } = this;
    var { ballot, requests, connect, donate } = links;
    let number_of_incoming_friend_requests = this.state.friend_invitations_sent_to_me.length;
    const navigator =
      <div className="header-nav">
        {ballot(pathname === "/ballot")}
        {requests(pathname === "/requests", number_of_incoming_friend_requests)}
        {connect(pathname === "/more/connect")}

      <Link onClick={this.toggleAboutMenu} className={ "about header-nav__item" + (pathname === "/more/about" ? " active-icon" : "")}>
           <div id="aboutIcon">About</div>
        <span className="header-nav__label">
          We Vote
          </span>
          <div>{this.aboutMenu()}</div>
      </Link>;

        {donate(pathname === "/more/donate")}
      </div>;

      return navigator;
  }
}


