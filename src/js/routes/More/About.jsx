import React, { Component } from "react";
import Helmet from "react-helmet";
import { Link } from "react-router";
import ReactPlayer from "react-player";
import AnalyticsActions from "../../actions/AnalyticsActions";
import ImageHandler from "../../components/ImageHandler";
import VoterStore from "../../stores/VoterStore";
import { weVoteBoard, weVoteStaff } from "./people";

export default class About extends Component {
  constructor (props) {
    super(props);
  }

  static getProps () {
    return {};
  }

  componentDidMount () {
    AnalyticsActions.saveActionAboutMobile(VoterStore.election_id());
  }

  render () {
    return <div className="about-us">
      <Helmet title="About Us - We Vote"/>
      <div className="card u-inset--md">
        <h1 className="h1">About We Vote</h1>
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

          <a className="btn btn-social-icon btn--medium" href="https://medium.com/@WeVote" target="_blank">
            <span className="fa fa-medium"/>
          </a>
        </div>


        <ReactPlayer url="https://player.vimeo.com/video/121315141" width="300px" height="231px"/>
        <div className="our-story">
          <h3 className="h3">A Nonprofit Startup</h3>
          <p>
            We Vote is made of two 501(c)(3) and 501(c)(4) nonpartisan nonprofit organizations based in Oakland, California. This site is managed by the 501(c)(4), We Vote USA. Our software is open source, and our work is driven by the nearly 100 volunteers who have contributed so far. Inspired by groups like <a href="http://codeforsanfrancisco.org/" target="_blank">Code for America&nbsp;<i className="fa fa-external-link" />
        </a> and the <a href="https://www.mozilla.org/en-US/foundation/" target="_blank">Mozilla Foundation&nbsp;
            <i className="fa fa-external-link" /></a>, we use technology to
          make democracy stronger by increasing voter turnout.
        </p>

        <section>
          <h1 className="h1">Our Team</h1>
          <h3 className="h3">We Vote Board Members &amp; Advisers</h3>
          <div className="row">
            {
              weVoteBoard.map((item) => <div className="col-4 col-sm-3" key={item.name}>
                <div className="team-member">
                  <ImageHandler className="img-responsive team-member__photo"
                                imageUrl={item.image}
                                alt={item.name} />
                  <div className="media-body">
                    <h4 className="team-member__name"><strong>{item.name}</strong></h4>
                    <p className="team-member__title">{item.title[0]}</p>
                    <p className="xx-small hidden-xs">{item.title[1]}</p>
                  </div>
                </div>
              </div>)
            }
         </div>
          <h3 className="h3">We Vote Staff</h3>
          <div className="row">
            {
              weVoteStaff.map((item) => <div className="col-4 col-sm-3" key={item.name}>
                <div className="team-member">
                  <ImageHandler className="img-responsive team-member__photo"
                                imageUrl={item.image}
                                alt={item.name} />
                  <div className="media-body">
                    <h4 className="team-member__name"><strong>{item.name}</strong></h4>
                    <p className="team-member__title">{item.title[0]}</p>
                    <p className="xx-small hidden-xs">{item.title[1]}</p>
                  </div>
                </div>
              </div>)
            }
          </div>
        </section>

        <section>
          <h3 className="h3">Our Story</h3>
          <p>
            After meeting in Oakland in the spring of 2013, We Vote co-founders Dale McGrew, Jenifer Fernandez Ancona, Dan Ancona, and their families became fast friends and bought a home together, forming an intentional community. Through daily conversations, the idea of a nonprofit social voter network was born.
            &quot;We&#39;re living our values,&quot; says Jenifer. We Vote would be a community for voters, they
            decided, created
            from a communal home of people concerned about where this country is heading. Being an open
            source, volunteer-driven project means anyone can contribute. Kind of like democracy.
          </p>
        </section>

        <section>
          <h3 className="h3">Credits &amp; Gratitude</h3>
          <p>
            <Link to="/more/credits">We are thankful for our volunteers, our board of directors, and the organizations</Link> that are critical to our work.
          </p>
          <h3 className="h3"><a href="https://help.wevote.us/hc/en-us/sections/115000140947-What-is-We-Vote-"
                            target="_blank">Visit our help center to learn more about We Vote.&nbsp;<i
          className="fa fa-external-link"/></a></h3>
        </section>

        </div>
      </div>
    </div>;
  }
}
