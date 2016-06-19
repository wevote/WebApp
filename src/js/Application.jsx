import React, { Component, PropTypes } from "react";
import Navigator from "./components/Navigator";
import MoreMenu from "./components/MoreMenu";
import Header from "./components/Header";
import SubHeader from "./components/SubHeader";
import VoterStore from "./stores/VoterStore";
import StarActions from "./actions/StarActions";
import VoterActions from "./actions/VoterActions";
import Headroom from "react-headroom";
const web_app_config = require("./config");

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

  render () {
    var { location: { pathname }} = this.props;
    var { voter, location } = this.state;
    var ballotItemWeVoteId = ""; /* TODO Dale: Store the ballot item that is "on stage" in Ballot store? (wv02cand3) */

    if (voter === undefined || location === undefined ) {
      return <div id="loading">
                <div>
                  <h1>We Vote</h1>
                  <p>Loading...</p>
                </div>
              </div>;
    }

    return <div className="app-base">
      <Headroom>
        <header className="page-header">
          <Header location={location} voter={voter}/>
          <SubHeader pathname={pathname} ballotItemWeVoteId={ballotItemWeVoteId} />
        </header>
      </Headroom>
      <div className="bs-container-fluid">
        <div className="bs-row">
          <div className="bs-col-xs-4 sidebar-menu">
            { voter.signed_in_personal ? <MoreMenu {...voter} /> : <MoreMenu /> }
          </div>
          <div className="col-xs-8-container bs-col-xs-8 container-main">
            { this.props.children }
          </div>
        </div>
      </div>
        <Navigator pathname={pathname} />
    </div>;
  }
}
