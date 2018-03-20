import React, { Component } from "react";
import Helmet from "react-helmet";
import { Link } from "react-router";
import OpenExternalWebSite from "../../utils/OpenExternalWebSite";
import ToolBar from "./ToolBar";

export default class About extends Component {
  constructor (props) {
    super(props);
  }

  static getProps () {
    return {};
  }

  render () {
    return <div>
      <Helmet title="FAQ - We Vote" />
        <div className="container-fluid card">
          <h1 className="h1">Frequently Asked Questions</h1>
          <ToolBar />

          <br />
          <strong>What is We Vote?</strong><br />
            Putting the voter in the driver’s seat. Helping you
            vote your values. Making voting more social.<br />
          <br />

          <strong>How does We Vote help voters?</strong><br />
            We Vote is where you view your ballot, see endorsements from your network for all
            candidates and measures, and collaborate with
            folks who share your values.<br />
          <br />

          <strong>Who’s behind We Vote?</strong><br />
            We Vote is a 501(c)(3) and 501(c)(4) nonprofit
            based in Oakland, CA.<br />
          <br />

          <strong>No really, who are you?</strong><br />
            We Vote is a volunteer-driven movement. We
            rely on volunteers across the country who use
            their engineering, design, and other skills to build
            We Vote. We are over 70 people who have donated 1,800+ volunteer hours, including
            <OpenExternalWebSite url="https://github.com/WeVote"
                                 target="_blank"
                                 body="25+ contributors on GitHub" />
            We also have a small team of
            core staff that eats way too much Thai food, and volunteer board members.<br />
          <br />

          <strong>How does We Vote work?</strong><br />
            Listen to people and groups you trust to get info on candidates and ballot measures. Ask your friends
            what they think. Then take We Vote with you to
            the polls for an easy-to-use cheat sheet.<br />
          <br />

          <strong>Is this an app or a website?</strong><br />
            We have a mobile-ready website now, and we’re working on iPhone and Android apps for 2018.
            We are free and open source:
            <OpenExternalWebSite url="https://github.com/WeVote"
                                 target="_blank"
                                 body="https://github.com/WeVote" />
          <br />

          <strong>So who should I vote for?</strong><br />
            That’s up to you.<br />
          <br />

          <strong>Wait, what?</strong><br />
            We Vote does not endorse any candidate or party.
            Our job is to help you make your own decisions,
            with help from your friends and trusted network.<br />
          <br />

          <strong>How does We Vote help nonprofits?</strong><br />
            We provide a free place where organizations can share and promote their voter guides, including
            endorsements of candidates and
            ballot measures, and connect to new constituents.<br />
          <br />

          <strong>Will you sell my email address?</strong><br />
            Not a chance. We Vote will not sell your email address or any other individually identifiable information.
            (We don't want our email addresses sold either!) We may sell aggregated data.<br />
          <br />

          <strong>What does We Vote cost?</strong><br />
            It’s free! If you like We Vote, <Link to="/more/donate">please donate</Link> so we can do more to help voters.<br />
          <br />

          <strong>How do you make money?</strong><br />
            Like most nonprofits, we take in donations from individuals and foundations. We also plan to generate
            revenues by offering premium features.<br />
          <br />

          <strong>How will you use my donation?</strong><br />
            While most of the We Vote software is written by unpaid volunteers, we use financial donations to pay the staff
            required
            to gather and groom election data, as well as manage communications, operations, and our internship program.
            Other expenses include server costs and fees required to buy political data.<br />
          <br />

          <strong>How will you handle trolls?</strong><br />
            Unless your name is J.R.R. Tolkien, we know how much you hate trolls. That’s why on We Vote you only hear from
            people and organizations that you Friend or Listen to. We Vote eliminates noise from people with radically
            different values.<br />
          <br />

          <strong>What’s next for We Vote?</strong><br />
            iPhone and Android apps in 2018. Better tools to let organizations promote their voter guides and
            poll their members. Plus more ways to share and discuss a wide range of political topics.<br />
          <br />

          <strong>Sounds great! How can I help?</strong><br />
            We couldn’t do what we do without volunteers and donors. Please sign up to volunteer at
            <OpenExternalWebSite url="http://WeVoteTeam.org/volunteer"
                                 target="_blank"
                                 className="open-web-site open-web-site__no-right-padding"
                                 body="http://WeVoteTeam.org" />
            , and if you live in the San Francisco Bay Area, come find us every Wednesday night at
          <OpenExternalWebSite url="http://codeforsanfrancisco.org/"
                               target="_blank"
                               className="open-web-site open-web-site__no-right-padding"
                               body={<span>Code for America&nbsp;<i className="fa fa-external-link" /></span>} />
          .<br />
          <br />

          <Link to="/ballot">Let's get started!</Link><br />

          <br /><br />

        </div>
      </div>;
  }
}
