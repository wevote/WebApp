import React, { Component, PropTypes } from "react";
import FriendActions from "./actions/FriendActions";
import HeaderBar from "./components/Navigation/HeaderBar";
import Headroom from "react-headroom";
import MoreMenu from "./components/Navigation/MoreMenu";
import NavigatorInFooter from "./components/Navigation/NavigatorInFooter";
import StarActions from "./actions/StarActions";
import VoterActions from "./actions/VoterActions";
import VoterStore from "./stores/VoterStore";
import { exitSearch } from "./utils/search-functions";
const web_app_config = require("./config");

var loadingScreenStyles = {
  position: "fixed",
  height: "100vh",
  width: "100vw",
  display: "flex",
  top: 0,
  left: 0,
  backgroundColor: "#337ec9",
  justifyContent: "center",
  alignItems: "center",
  fontSize: "30px",
  color: "#fff",
  flexDirection: "column"
};

export default class Application extends Component {
  static propTypes = {
    children: PropTypes.element,
    route: PropTypes.object,
    location: PropTypes.object
  };

  constructor (props) {
    super(props);
    this.state = {};
    this.initFacebook();
  }

  initFacebook (){
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: web_app_config.FACEBOOK_APP_ID,
        xfbml: true,
        version: "v2.6"
      });
    };

    (function (d, s, id){
       var js;
       var fjs = d.getElementsByTagName(s)[0];
       if (d.getElementById(id)) {return;}
       js = d.createElement(s); js.id = id;
       js.src = "//connect.facebook.net/en_US/sdk.js";
       fjs.parentNode.insertBefore(js, fjs);
     }(document, "script", "facebook-jssdk"));
  }

  componentDidMount () {
    let voter_device_id = VoterStore.voterDeviceId();
    VoterActions.voterRetrieve();
    // console.log("Application, componentDidMount, voter_device_id:", voter_device_id);
    if (voter_device_id && voter_device_id !== "") {
      VoterActions.voterEmailAddressRetrieve();
      StarActions.voterAllStarsStatusRetrieve();
      FriendActions.friendInvitationsSentToMe();
    }

    this.voterStoreListener = VoterStore.addListener(this._onChange.bind(this));
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
  }

  _onChange () {
    this.setState({
      voter: VoterStore.getVoter(),
      location: VoterStore.getAddress()
    });
  }

  hideSearchContainer () {
    exitSearch();
  }

  render () {
    var { location: { pathname }} = this.props;
    var { voter, location } = this.state;

    if (voter === undefined || location === undefined ) {
      return <div style={loadingScreenStyles}>
                <div>
                  <h1 className="h1">We Vote</h1>
                  <div className="u-loading-spinner u-loading-spinner--light">Loading...</div>
                </div>
              </div>;
    }
    // console.log("voter:", voter);
    // let voter_device_id = VoterStore.voterDeviceId();
    // console.log("voter_device_id:", voter_device_id);
    // console.log("pathname:", pathname);

    // If looking at these paths, we want to enter theater mode
    var in_theater_mode = false;
    if (pathname === "/intro/story" || pathname === "/intro/sample_ballot") {
      in_theater_mode = true;
    }

    if (in_theater_mode) {
      return <div className="app-base" id="app-base-id">
        <div className="page-content-container">
          <div className="container-fluid">
            <div className="row">
              <div className="col-xs-12-container col-xs-12 container-main">
                { this.props.children }
              </div>
            </div>
          </div>
        </div>
      </div>;
    }

    return <div className="app-base" id="app-base-id">
      <Headroom>
        <div className="page-header__container">
          <HeaderBar pathname={pathname} voter={voter} />
        </div>
      </Headroom>
      <div className="page-content-container">
        <div className="container-fluid">
          <div className="row">
            <div className="col-xs-4 sidebar-menu">
              { voter.is_signed_in ? <MoreMenu {...voter} /> : <MoreMenu /> }
            </div>
            <div className="col-xs-8-container col-xs-8 container-main">
              { this.props.children }
            </div>
          </div>
        </div>
      </div>
      <NavigatorInFooter pathname={pathname} />
    </div>;
  }
}
