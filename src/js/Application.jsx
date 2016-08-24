import React, { Component, PropTypes } from "react";
import NavigatorInFooter from "./components/Navigation/NavigatorInFooter";
import MoreMenu from "./components/MoreMenu";
import Header from "./components/Header";
import SubHeader from "./components/SubHeader";
import VoterStore from "./stores/VoterStore";
import StarActions from "./actions/StarActions";
import VoterActions from "./actions/VoterActions";
import { exitSearch } from "./utils/search-functions";
import Headroom from "react-headroom";
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
    VoterActions.retrieveVoter(voter_device_id);
    StarActions.retrieveAll();
    this.token = VoterStore.addListener(this._onChange.bind(this));
  }

  componentWillUnmount () {
    this.token.remove();
  }

  _onChange () {
    this.setState({
      voter: VoterStore.voter(),
      location: VoterStore.getAddress()
    });
  }

  hideSearchContainer () {
    exitSearch();
  }

  render () {
    var { location: { pathname }} = this.props;
    var { voter, location } = this.state;
    var ballotItemWeVoteId = ""; /* TODO Dale: Store the ballot item that is "on stage" in Ballot store? (wv02cand3) */

    if (voter === undefined || location === undefined ) {
      return <div style={loadingScreenStyles}>
                <div>
                  <h1>We Vote</h1>
                  <div className="u-loading-spinner u-loading-spinner--light">Loading...</div>
                </div>
              </div>;
    }

    return <div className="app-base" id="app-base-id">
      <Headroom>
        <header className="page-header">
          <Header pathname={pathname} voter={voter} />
          <SubHeader ballotItemWeVoteId={ballotItemWeVoteId} />
        </header>
      </Headroom>
      <div className="container-fluid">
        <div className="row">
          <div className="col-xs-4 sidebar-menu">
            { voter.signed_in_personal ? <MoreMenu {...voter} /> : <MoreMenu /> }
          </div>
          <div className="col-xs-8-container col-xs-8 container-main">
            { this.props.children }
          </div>
        </div>
      </div>
        <NavigatorInFooter pathname={pathname} />
    </div>;
  }
}
