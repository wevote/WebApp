import React, {Component} from "react";
import Helmet from "react-helmet";
import {Link} from "react-router";
import ReactPlayer from "react-player";
import ImageHandler from "../../components/ImageHandler";
import PositionPublicToggle from "../../components/Widgets/PositionPublicToggle";
// const Icon = require("react-svg-icons");

export default class About extends Component {
  constructor (props) {
    super(props);
  }

  static getProps () {
    return {};
  }

  render () {
    let supportProps = { is_public_position: false };
    return <div>
      <Helmet title="About Us - We Vote"/>
      <div className="container-fluid card">
        <h1 className="h1">About We Vote</h1>
        <div className="btn-toolbar">
          <a className="btn btn-social-icon btn-twitter" href="https://twitter.com/WeVote" target="_blank">
            <span className="fa fa-twitter"/>
          </a>

          <a className="btn btn-social-icon btn-facebook" href="https://www.facebook.com/WeVoteUSA" target="_blank">
            <span className="fa fa-facebook"/>
          </a>

          <a className="btn btn-email" href="http://eepurl.com/cx_frP" target="_blank">
            <span>
              <span className="email-icon glyphicon glyphicon-envelope" /> Join Newsletter
            </span>
          </a>

          <a className="btn btn-social-icon btn-github" href="https://github.com/WeVote" target="_blank">
            <span className="fa fa-github"/>
          </a>

          <a className="btn btn-social-icon btn-medium" href="https://medium.com/@WeVote" target="_blank">
            <span className="fa fa-medium"/>
          </a>
        </div>

        <br />
        <ReactPlayer url="https://player.vimeo.com/video/121315141" width="300px" height="231px"/>
        <br />
        <strong>Vote with Confidence</strong><br />
        We Vote is the place to find your network's opinions on candidates and propositions before you vote, and share what you believe:
        <ul>
          <li>
            follow the <strong>voter guides</strong> of trusted groups and thought leaders
          </li>
          <li>
            see voting recommendations <strong>all the way down your ballot</strong>
          </li>
          <li>
            easily <strong>create your own voter guide</strong>, showing which candidates and propositions you support
          </li>
          <li>
            discuss your views <strong>with friends</strong>
          </li>
        </ul>
        <br />
        <strong>What about privacy?</strong><br />
        When you support or oppose a ballot item, your position is friends-only
        by default. Use the privacy button (sample below) to switch your views to public, or back to private.
        <PositionPublicToggle ballot_item_we_vote_id="null"
                              className="null"
                              type="MEASURE"
                              supportProps={supportProps}
        />
        <br />

        <strong>How do I use We Vote?</strong><br />
        <a href="https://help.wevote.us/hc/en-us/" target="_blank">Visit our help center for answers.&nbsp;<i
          className="fa fa-external-link"/></a><br />
        <br />
        More questions? <Link to="/more/faq">Visit our frequently asked questions page</Link> for answers.<br />

        <h3 className="h3">A Nonprofit Startup</h3>
          We Vote is made of two 501(c)(3) and 501(c)(4) nonpartisan nonprofit organizations based in
          Oakland, California. This site is managed by the 501(c)(4), We Vote USA. Our
          software is open source, and our work is driven by the nearly 100 volunteers who have contributed so far.
          Inspired by groups like <a href="http://codeforsanfrancisco.org/" target="_blank">Code for America&nbsp;<i
          className="fa fa-external-link"/>
        </a> and the <a href="https://www.mozilla.org/en-US/foundation/" target="_blank">Mozilla Foundation&nbsp;<i
          className="fa fa-external-link"/></a>, we use technology to
          make democracy stronger by increasing voter turnout.<br />

        <h3 className="h3">We Vote Board Members</h3>
        <div className="row centered">
          <div className="col-xs-4 col-sm-3 col-md-3">
            <div className="media">
              <ImageHandler className="img-responsive" imageUrl="/img/global/photos/JeniferAncona-300x300.jpg"
                            alt="Jenifer Fernandez Ancona"/>
              <div className="media-body">
                <h3><strong>Jenifer Fernandez Ancona</strong>, Co-founder &amp; Board Chair</h3>
                <span className="xx-small hidden-xs">
                  VP, Strategy &amp; Member Engagement at the Women Donors Network.<br />
                  <br />
                </span>
              </div>
            </div>
          </div>
          <div className="col-xs-4 col-sm-3 col-md-3">
            <div className="media">
              <ImageHandler className="img-responsive" imageUrl="/img/global/photos/TianaEpps-Johnson-512x512.jpg"
                            alt="Tiana Epps-Johnson"/>
              <div className="media-body">
                <h3><strong>Tiana Epps-Johnson</strong>, c3 Board Chair</h3>
                <span className="xx-small hidden-xs">
                  Exec. Dir. of CTCL, software for local election administrators. Former Voting Info Project &amp; Harvard Ash Center for Democratic Governance and Innovation.<br />
                  <br />
                </span>
              </div>
            </div>
          </div>
          <div className="col-xs-4 col-sm-3 col-md-3">
            <div className="media">
              <ImageHandler className="img-responsive" imageUrl="/img/global/photos/DebraCleaver-300x300.png"
                            alt="Debra Cleaver"/>
              <div className="media-body">
                <h3><strong>Debra Cleaver</strong>, c3 Board Member</h3>
              <span className="xx-small hidden-xs">
                Founder &amp; Exec. Dir. of VOTE.org, the web's most heavily trafficked site for accurate voting
                information.<br />
                <br />
              </span>
              </div>
            </div>
          </div>
          <div className="clearfix visible-xs-block" />
          <div className="col-xs-4 col-sm-3 col-md-3">
            <div className="media">
              <ImageHandler className="img-responsive" imageUrl="/img/global/photos/ToryGavito_400x400.jpeg"
                            alt="Tory Gavito"/>
              <div className="media-body">
                <h3><strong>Tory Gavito</strong>, c4 Board Member</h3>
              <span className="xx-small hidden-xs">
                Exec. Dir. at Texas Future Project.<br />
                <br />
              </span>
              </div>
            </div>
          </div>
          <div className="clearfix visible-sm-block visible-md-block visible-lg-block" />
          <div className="col-xs-4 col-sm-3 col-md-3">
            <div className="media">
              <ImageHandler className="img-responsive" imageUrl="/img/global/photos/LawrenceGrodeska-200x200.jpg"
                            alt="Lawrence Grodeska"/>
              <div className="media-body">
                <h3><strong>Lawrence Grodeska</strong>, c3 Board Member</h3>
              <span className="xx-small hidden-xs">
                Civic Tech communications and innovation at CivicMakers. Formerly at Change.org.<br />
                <br />
              </span>
              </div>
            </div>
          </div>
          <div className="col-xs-4 col-sm-3 col-md-3">
            <div className="media">
              <ImageHandler className="img-responsive" imageUrl="/img/global/photos/DaleMcGrew-300x300.jpg"
                            alt="Dale John McGrew"/>
              <div className="media-body">
                <h3><strong>Dale John McGrew</strong>, Exec. Dir. &amp; c4 Board Member</h3>
              <span className="xx-small hidden-xs">
                Managed large software projects for companies like Disney and over 60 nonprofits.<br />
                <br />
              </span>
              </div>
            </div>
          </div>
          <div className="clearfix visible-xs-block" />
          <div className="col-xs-4 col-sm-3 col-md-3">
            <div className="media">
              <ImageHandler className="img-responsive" imageUrl="/img/global/photos/Barbara_Shannon-200x200.jpg"
                            alt="Barbara Shannon"/>
              <div className="media-body">
                <h3><strong>Barbara Shannon</strong>, c3 Board Member</h3>
              <span className="xx-small hidden-xs">
                Advisor to entrepreneurs and C-level Fortune 500 leaders. MBA The Wharton School.<br />
                <br />
              </span>
              </div>
            </div>
          </div>
          <div className="col-xs-4 col-sm-3 col-md-3">
            <div className="media">
              <ImageHandler className="img-responsive" imageUrl="/img/global/photos/AnatShenker-300x300.jpeg"
                            alt="Anat Shenker-Osorio"/>
              <div className="media-body">
                <h3><strong>Anat Shenker-Osorio</strong>, c4 Board Member</h3>
              <span className="xx-small hidden-xs">
                Communications expert, researcher and political pundit.
                <br />
                <br />
              </span>
              </div>
            </div>
          </div>
          <div className="clearfix visible-sm-block visible-md-block visible-lg-block" />
          <div className="col-xs-4 col-sm-3 col-md-3">
            <div className="media">
              <ImageHandler className="img-responsive" imageUrl="/img/global/photos/WilliamWinters-300x300.jpg"
                            alt="William Winters"/>
              <div className="media-body">
                <h3><strong>William Winters</strong>, c4 Board Member</h3>
              <span className="xx-small hidden-xs">
                Campaign Manager at Color Of Change.
                <br />
                <br />
              </span>
              </div>
            </div>
          </div>
        </div>

        <h3 className="h3">We Vote Staff</h3>
        <div className="row centered">
          <div className="col-xs-4 col-sm-3 col-md-3">
            <div className="media">
              <ImageHandler className="img-responsive" imageUrl="/img/global/photos/SarahClements-400x400.jpg"
                            alt="Sarah Clements"/>
              <div className="media-body">
                <h3><strong>Sarah Clements</strong>, Engineering Intern</h3>
              </div>
            </div>
          </div>
          <div className="col-xs-4 col-sm-3 col-md-3">
            <div className="media">
              <ImageHandler className="img-responsive" imageUrl="/img/global/photos/IreneFlorez-400x400.jpg"
                            alt="Irene Florez"/>
              <div className="media-body">
                <h3><strong>Irene Florez</strong>, Engineering Intern</h3>
              </div>
            </div>
          </div>
          <div className="col-xs-4 col-sm-3 col-md-3">
            <div className="media">
              <ImageHandler className="img-responsive" imageUrl="/img/global/photos/JeffFrench-500x500.jpg"
                            alt="Jeff French"/>
              <div className="media-body">
                <h3><strong>Jeff French</strong>, Lead Designer</h3>
              </div>
            </div>
          </div>
          <div className="clearfix visible-xs-block" />
          <div className="col-xs-4 col-sm-3 col-md-3">
            <div className="media">
              <ImageHandler className="img-responsive" imageUrl="/img/global/photos/AnishaJain-200x200.jpg"
                            alt="Anisha Jain"/>
              <div className="media-body">
                <h3><strong>Anisha Jain</strong>, Engineering Intern</h3>
              </div>
            </div>
          </div>
          <div className="clearfix visible-sm-block visible-md-block visible-lg-block" />
          <div className="col-xs-4 col-sm-3 col-md-3">
            <div className="media">
              <ImageHandler className="img-responsive" imageUrl="/img/global/photos/JudyJohnson-300x300.jpg"
                            alt="Judy Johnson"/>
              <div className="media-body">
                <h3><strong>Judy Johnson</strong>, Operations</h3>
              </div>
            </div>
          </div>
          <div className="col-xs-4 col-sm-3 col-md-3">
            <div className="media">
              <ImageHandler className="img-responsive" imageUrl="/img/global/photos/NeelamJoshi_415x400.jpg"
                            alt="Neelam Joshi"/>
              <div className="media-body">
                <h3><strong>Neelam Joshi</strong>, Engineering Intern</h3>
              </div>
            </div>
          </div>
          <div className="clearfix visible-xs-block" />
          <div className="col-xs-4 col-sm-3 col-md-3">
            <div className="media">
              <ImageHandler className="img-responsive" imageUrl="/img/global/photos/CieroKilpatrrick_400x401.jpg"
                            alt="Ciero Kilpatrick"/>
              <div className="media-body">
                <h3><strong>Ciero Kilpatrick</strong>, User Experience Intern</h3>
              </div>
            </div>
          </div>
          <div className="col-xs-4 col-sm-3 col-md-3">
            <div className="media">
              <ImageHandler className="img-responsive" imageUrl="/img/global/photos/DaleMcGrew-300x300.jpg"
                            alt="Dale John McGrew"/>
              <div className="media-body">
                <h3><strong>Dale John McGrew</strong>, Executive Director</h3>
              <span className="xx-small hidden-xs">
                Managed large software projects for companies like Disney and over 60 nonprofits.<br />
              <br />
              </span>
              </div>
            </div>
          </div>
          <div className="clearfix visible-sm-block visible-md-block visible-lg-block" />
          <div className="col-xs-4 col-sm-3 col-md-3">
            <div className="media">
              <ImageHandler className="img-responsive" imageUrl="/img/global/photos/ColettePhair-300x300.png"
                            alt="Colette Phair"/>
              <div className="media-body">
                <h3><strong>Colette Phair</strong>, Manager of Communications and Community Outreach</h3>
              <span className="xx-small hidden-xs">
              Formerly Tides &amp; Pachamama Alliance. Studied political science at the University of California and Paris Institute of Political Studies.<br />
              <br />
              </span>
              </div>
            </div>
          </div>
          <div className="clearfix visible-xs-block" />
          <div className="col-xs-4 col-sm-3 col-md-3">
            <div className="media">
              <ImageHandler className="img-responsive" imageUrl="/img/global/photos/EricOgawa-400x400.jpg"
                            alt="Eric"/>
              <div className="media-body">
                <h3><strong>Eric Ogawa</strong>, User Experience Design Intern</h3>
              </div>
            </div>
          </div>
        </div>

        <h3 className="h3">Our Story</h3>
        After meeting in Oakland in the spring of 2013, We Vote co-founders <a href="#Dale">Dale McGrew</a>, <a
        href="#Jen">Jenifer Fernandez Ancona</a>, Dan Ancona,
        and their families became fast friends and bought a home together,
        forming an intentional community. Through
        daily conversations, the idea of a nonprofit social voter network was born.
        &quot;We&#39;re living our values,&quot; says Jenifer. We Vote would be a community for voters, they
        decided, created
        from a communal home of people concerned about where this country is heading. Being an open
        source, volunteer-driven project means anyone can contribute. Kind of like democracy.<br />

        <h3 className="h3">Credits &amp; Gratitude</h3>
        <Link to="/more/credits/">We are thankful for our volunteers, our board of directors, and the
          organizations</Link> that are critical to our work.
        <br /><br />
      </div>
    </div>;
  }
}
