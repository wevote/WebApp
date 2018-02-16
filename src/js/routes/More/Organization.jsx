import React, {Component} from "react";
import Helmet from "react-helmet";
import AnalyticsActions from "../../actions/AnalyticsActions";
import ReactPlayer from "react-player";
import VoterStore from "../../stores/VoterStore";


export default class Organization extends Component {
  constructor (props) {
    super(props);
  }

  static getProps () {
    return {};
  }

  componentDidMount (){
    AnalyticsActions.saveActionAboutOrganization(VoterStore.election_id());
  }

  render () {
    return <div>
      <Helmet title="Organization - We Vote"/>
      <div className="container-fluid card">
        <div className="Our-Story">
           <h1 className="h1">Our Vision</h1>
          <div className="btn-toolbar">
            <a className="btn btn-social-icon btn-twitter" href="https://twitter.com/WeVote" target="_blank">
              <span className="fa fa-twitter"/>
            </a>

            <a className="btn btn-social-icon btn-facebook" href="https://www.facebook.com/WeVoteUSA" target="_blank">
              <span className="fa fa-facebook"/>
            </a>

            <a className="btn btn--email" href="http://eepurl.com/cx_frP" target="_blank">
              <span>
                <span className="btn--email__icon glyphicon glyphicon-envelope"/> Join Newsletter
              </span>
            </a>

            <a className="btn btn-social-icon btn-github" href="https://github.com/WeVote" target="_blank">
              <span className="fa fa-github"/>
            </a>

            <a className="btn btn-social-icon btn--medium" href="https://medium.com/@WeVote" target="_blank">
              <span className="fa fa-medium"/>
            </a>
          </div>

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
        </div>

        <div className="Our-Story">
          <h3 className="h3">A Nonprofit Startup</h3>
          We Vote is made of two 501(c)(3) and 501(c)(4) nonpartisan nonprofit organizations based in
          Oakland, California. This site is managed by the 501(c)(4), We Vote USA. Our
          software is open source, and our work is driven by the nearly 100 volunteers who have contributed so far.
          Inspired by groups like <a href="http://codeforsanfrancisco.org/" target="_blank">Code for America&nbsp;<i
          className="fa fa-external-link"/>
          </a> and the <a href="https://www.mozilla.org/en-US/foundation/" target="_blank">Mozilla Foundation&nbsp;<i
          className="fa fa-external-link"/></a>, we use technology to
          make democracy stronger by increasing voter turnout.<br />

          <h3 className="h3">Our Story</h3>
          After meeting in Oakland in the spring of 2012, We Vote co-founders Dale McGrew, Jenifer Fernandez Ancona, Dan Ancona,
          and their families became fast friends and bought a home together,
          forming an intentional community. Through
          daily conversations, the idea of a nonprofit social voter network was born.
          &quot;We&#39;re living our values,&quot; says Jenifer. We Vote would be a community for voters, they
          decided, created
          from a communal home of people concerned about where this country is heading. Being an open
          source, volunteer-driven project means anyone can contribute. Kind of like democracy.<br />
          <br />
           <h3 className="h3"><a href="https://help.wevote.us/hc/en-us/sections/115000140947-What-is-We-Vote-"
                              target="_blank">Visit our help center to learn more about We Vote.&nbsp;<i
             className="fa fa-external-link"/></a></h3>
       </div>
      </div>
    </div>;
  }
}
