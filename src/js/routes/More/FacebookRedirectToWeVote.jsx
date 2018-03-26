import React, { Component } from "react";
import { historyPush } from "../../utils/cordovaUtils";
import { renderLog } from "../../utils/logging";
import webAppConfig from "../../config";

export default class FacebookRedirectToWeVote extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    renderLog(__filename);
    //let facebook_request_link = "/more/facebooklandingprocess/";
    let facebook_request_link = webAppConfig.WE_VOTE_HOSTNAME + "/more/facebooklandingprocess";
    console.log("Redirecting to live we vote site on facebooklandingprocess page");

    return <div className="facebook-redirect" id="facebook-landing-id">
      { historyPush(facebook_request_link) }
    </div>;
  }

}
