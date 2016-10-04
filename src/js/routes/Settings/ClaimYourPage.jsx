import React, { Component } from "react";
import Helmet from "react-helmet";
import TwitterHandleBox from "../../components/Twitter/TwitterHandleBox";

export default class ClaimYourPage extends Component {
  render () {
    return <div>
      <Helmet title="Claim Your Page - We Vote" />
      <div className="container-fluid well u-gutter__top--small fluff-full1">
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
