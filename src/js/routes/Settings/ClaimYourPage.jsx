import React, { Component } from "react";
import TwitterHandleBox from "../../components/Twitter/TwitterHandleBox";

export default class ClaimYourPage extends Component {
  render () {
    return <div>
      <div className="container-fluid well u-gutter-top--small fluff-full1">
        <h3 className="text-center">
          Claim Your Page
        </h3>
        <h4 className="text-center">
          Enter your Twitter handle to create a public voter guide.
        </h4>
        <div>
          <TwitterHandleBox {...this.props} />
        </div>
      </div>
    </div>;
  }
}
