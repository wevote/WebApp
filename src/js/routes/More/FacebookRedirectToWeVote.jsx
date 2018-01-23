import React, { Component } from "react";
import { historyPush } from "../../utils/cordovaUtils";
const web_app_config = require("../../config");

export default class FacebookRedirectToWeVote extends Component {
  constructor (props) {
    super(props);
  }
  render () {
    //let facebook_request_link = "/more/facebooklandingprocess/";
    let facebook_request_link = web_app_config.WE_VOTE_HOSTNAME + "/more/facebooklandingprocess";
    console.log("Redirecting to live we vote site on facebooklandingprocess page");

    return <div className="facebook-redirect" id="facebook-landing-id">
      { historyPush(facebook_request_link) }
    </div>;
  }

}
