import React, { Component } from "react";
import Helmet from "react-helmet";
import ReactPlayer from "react-player";
import AnalyticsActions from "../../actions/AnalyticsActions";
import { renderLog } from "../../utils/logging";
import OpenExternalWebSite from "../../utils/OpenExternalWebSite";
import ToolBar from "./ToolBar";
import VoterStore from "../../stores/VoterStore";

export default class Vision extends Component {
  constructor (props) {
    super(props);
  }

  static getProps () {
    return {};
  }

  componentDidMount () {
    AnalyticsActions.saveActionAboutVision(VoterStore.election_id());
  }

  render () {
    renderLog(__filename);
    return <div>
      <Helmet title="Vision - We Vote"/>
      <div className="container-fluid card">
        <h1 className="h1">Our Vision</h1>
        <ToolBar />

        <br />
        <ReactPlayer url="https://player.vimeo.com/video/121315141" width="400px" height="308px"/>
        <br />
        We Vote is building the next generation of voting tech. We're creating a digital voter guide
        informed by issues you care about and people you trust. Through our nonpartisan, open source platform,
        we'll help you become a better voter, up and down the ballot.<br />
        <br />
        You have a lot of decisions to make when you vote, and political campaigns don't always tell the
        whole truth. With fake news and misinformation, it's hard to tell which candidate or ballot initiative
        is on your side. Does that candidate for state legislature care about the same issues that you do?
        Does the awkwardly-worded ballot initiative support what you believe or is it the exact opposite
        (and was it purposely written to be so confusing?!)<br />
        <br />
        We Vote cuts through the clutter to help you understand what's on your ballot.
        Our open platform empowers voters to create and share voter guides that aggregate information
        and opinions across personal networks. So you can help your friends be better voters too.<br />
        <br />
        <h3 className="h3">
          <OpenExternalWebSite url="https://help.wevote.us/hc/en-us/sections/115000140947-What-is-We-Vote-"
                               target="_blank"
                               className="open-web-site open-web-site__no-left-padding"
                               body={<span>Visit our help center to learn more about We Vote.&nbsp;<i className="fa fa-external-link"/></span>} />
        </h3>
     </div>
    </div>;
  }
}
