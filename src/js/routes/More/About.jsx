import React, {Component} from "react";
import Helmet from "react-helmet";
import {Link} from "react-router";
import ReactPlayer from "react-player";
import ImageHandler from "../../components/ImageHandler";

export default class About extends Component {
  constructor (props) {
    super(props);
  }

  static getProps () {
    return {};
  }

  render () {
    return <div className="about-us">
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

          <a className="btn btn--email" href="http://eepurl.com/cx_frP" target="_blank">
            <span>
              <span className="btn--email__icon glyphicon glyphicon-envelope"/> Join Newsletter
            </span>
          </a>

          <a className="btn btn-social-icon btn--medium" href="https://medium.com/@WeVote" target="_blank">
            <span className="fa fa-medium"/>
          </a>
        </div>

        <br />
        <ReactPlayer url="https://player.vimeo.com/video/121315141" width="300px" height="231px"/>
        <div className="our-story">
          <h3 className="h3">A Nonprofit Startup</h3>
          We Vote is made of two 501(c)(3) and 501(c)(4) nonpartisan nonprofit organizations based in
          Oakland, California. This site is managed by the 501(c)(4), We Vote USA. Our
          software is open source, and our work is driven by the nearly 100 volunteers who have contributed so far.
          Inspired by groups like <a href="http://codeforsanfrancisco.org/" target="_blank">Code for America&nbsp;<i
          className="fa fa-external-link"/>
        </a> and the <a href="https://www.mozilla.org/en-US/foundation/" target="_blank">Mozilla Foundation&nbsp;<i
          className="fa fa-external-link"/></a>, we use technology to
          make democracy stronger by increasing voter turnout.<br />

          <h3 className="h3">We Vote Board Members &amp; Advisers</h3>
          <div className="row centered team-members-list">
            <div className="col-4 col-sm-3 col-md-3 team-member">
              <div className="media">
                <ImageHandler className="img-responsive"
                              imageUrl="/img/global/photos/Jenifer_Fernandez_Ancona-200x200.jpg"
                              alt="Jenifer Fernandez Ancona"/>
                <div className="media-body">
                  <h4><strong>Jenifer Fernandez Ancona</strong>, Co-Founder &amp; c4 Board Chair</h4>
                <h5 className="xx-small hidden-xs">
                  VP, Strategy &amp; Member Engagement at the Women Donors Network.<br />
                  <br />
                </h5>
                </div>
              </div>
            </div>
            <div className="col-4 col-sm-3 col-md-3 team-member">
              <div className="media">
                <ImageHandler className="img-responsive" imageUrl="/img/global/photos/Tiana_Epps_Johnson-200x200.jpg"
                              alt="Tiana Epps-Johnson"/>
                <div className="media-body">
                  <h4><strong>Tiana Epps-Johnson</strong>, Senior Adviser</h4>
                <h5 className="xx-small hidden-xs">
                  Exec. Dir. of CTCL, software for election administrators. Former Voting Info Project &amp;
                  Harvard Ash Center for Democratic Governance and Innovation.<br />
                  <br />
                </h5>
                </div>
              </div>
            </div>
            <div className="col-4 col-sm-3 col-md-3 team-member">
              <div className="media">
                <ImageHandler className="img-responsive" imageUrl="/img/global/photos/Debra_Cleaver-200x200.jpg"
                              alt="Debra Cleaver"/>
                <div className="media-body">
                  <h4><strong>Debra Cleaver</strong>, c3 Board Member</h4>
              <h5 className="xx-small hidden-xs">
                Founder &amp; CEO of VOTE.org, the web's most heavily trafficked site for accurate voting
                information.<br />
                <br />
              </h5>
                </div>
              </div>
            </div>
            <div className="clearfix visible-xs-block"/>{/* After every 3 */}
            <div className="col-4 col-sm-3 col-md-3 team-member">
              <div className="media">
                <ImageHandler className="img-responsive" imageUrl="/img/global/photos/Tory_Gavito-200x200.jpg"
                              alt="Tory Gavito"/>
                <div className="media-body">
                  <h4><strong>Tory Gavito</strong>, c4 Board Member</h4>
              <h5 className="xx-small hidden-xs">
                Exec. Dir. at Texas Future Project.<br />
                <br />
              </h5>
                </div>
              </div>
            </div>
            <div className="clearfix visible-sm-block visible-md-block visible-lg-block"/>{/* After every 4 */}
            <div className="col-4 col-sm-3 col-md-3 team-member">
              <div className="media">
                <ImageHandler className="img-responsive" imageUrl="/img/global/photos/Lawrence_Grodeska-200x200.jpg"
                              alt="Lawrence Grodeska"/>
                <div className="media-body">
                  <h4><strong>Lawrence Grodeska</strong>, c3 Board Member</h4>
              <h5 className="xx-small hidden-xs">
                Civic Tech communications and innovation at CivicMakers. Formerly at Change.org.<br />
                <br />
              </h5>
                </div>
              </div>
            </div>
            <div className="col-4 col-sm-3 col-md-3 team-member">
              <div className="media">
                <ImageHandler className="img-responsive" imageUrl="/img/global/photos/Dale_McGrew-200x200.jpg"
                              alt="Dale John McGrew"/>
                <div className="media-body">
                  <h4><strong>Dale John McGrew</strong>, Co-Founder / CTO &amp; c3 + c4 Board Member</h4>
              <h5 className="xx-small hidden-xs">
                Managed large software projects for companies like Disney and over 60 nonprofits.<br />
                <br />
              </h5>
                </div>
              </div>
            </div>
            <div className="clearfix visible-xs-block"/>{/* After every 3 */}
            <div className="col-4 col-sm-3 col-md-3 team-member">
              <div className="media">
                <ImageHandler className="img-responsive" imageUrl="/img/global/photos/Barbara_Shannon-200x200.jpg"
                              alt="Barbara Shannon"/>
                <div className="media-body">
                  <h4><strong>Barbara Shannon</strong>, c3 Board Member</h4>
              <h5 className="xx-small hidden-xs">
                Adviser to entrepreneurs and C-level Fortune 500 leaders. MBA The Wharton School.<br />
                <br />
              </h5>
                </div>
              </div>
            </div>
            <div className="col-4 col-sm-3 col-md-3 team-member">
              <div className="media">
                <ImageHandler className="img-responsive" imageUrl="/img/global/photos/Anat_Shenker_Osario-200x200.jpg"
                              alt="Anat Shenker-Osorio"/>
                <div className="media-body">
                  <h4><strong>Anat Shenker-Osorio</strong>, c4 Board Member</h4>
              <h5 className="xx-small hidden-xs">
                Communications expert, researcher and political pundit.
                <br />
                <br />
              </h5>
                </div>
              </div>
            </div>
            <div className="clearfix visible-sm-block visible-md-block visible-lg-block"/>{/* After every 4 */}
            <div className="col-4 col-sm-3 col-md-3 team-member">
              <div className="media">
                <ImageHandler className="img-responsive" imageUrl="/img/global/photos/Betsy_Sikma-200x200.jpg"
                              alt="Betsy Sikma"/>
                <div className="media-body">
                  <h4><strong>Betsy Sikma</strong>, c3 Board Member</h4>
              <h5 className="xx-small hidden-xs">
                <br />
                <br />
              </h5>
                </div>
              </div>
            </div>
            <div className="clearfix visible-xs-block"/>{/* After every 3 */}
            <div className="col-4 col-sm-3 col-md-3 team-member">
              <div className="media">
                <ImageHandler className="img-responsive" imageUrl="/img/global/photos/William_Winters-200x200.jpg"
                              alt="William Winters"/>
                <div className="media-body">
                  <h4><strong>William Winters</strong>, c4 Board Member</h4>
              <h5 className="xx-small hidden-xs">
                Campaign Manager at Color Of Change, CEL &amp; Change.org.
                <br />
                <br />
              </h5>
                </div>
              </div>
            </div>
          </div>

          <h3 className="h3">We Vote Staff</h3>
          <div className="row centered team-members-list">
            <div className="col-4 col-sm-3 col-md-3 team-member">
              <div className="media">
                <ImageHandler className="img-responsive" imageUrl="/img/global/photos/Alicia_Prevost-200x200.jpg"
                              alt="Alicia Prevost"/>
                <div className="media-body">
                  <h4><strong>Alicia Prevost</strong>, Executive Director</h4>
                </div>
              </div>
            </div>
            <div className="col-4 col-sm-3 col-md-3 team-member">
              <div className="media">
                <ImageHandler className="img-responsive" imageUrl="/img/global/photos/Dale_McGrew-200x200.jpg"
                              alt="Dale John McGrew"/>
                <div className="media-body">
                  <h4><strong>Dale John McGrew</strong>, Co-Founder / CTO</h4>
                </div>
              </div>
            </div>
            <div className="col-4 col-sm-3 col-md-3 team-member">
              <div className="media">
                <ImageHandler className="img-responsive" imageUrl="/img/global/photos/Sarah_Clements-200x200.jpg"
                              alt="Sarah Clements"/>
                <div className="media-body">
                  <h4><strong>Sarah Clements</strong>, Engineering Intern</h4>
                </div>
              </div>
            </div>
            <div className="clearfix visible-xs-block"/>{/* After every 3 */}
            <div className="col-4 col-sm-3 col-md-3 team-member">
              <div className="media">
                <ImageHandler className="img-responsive" imageUrl="/img/global/photos/Irene_Florez-200x200.jpg"
                              alt="Irene Florez"/>
                <div className="media-body">
                  <h4><strong>Irene Florez</strong>, Engineering Intern</h4>
                </div>
              </div>
            </div>
            <div className="clearfix visible-sm-block visible-md-block visible-lg-block"/>{/* After every 4 */}
            <div className="col-4 col-sm-3 col-md-3 team-member">
              <div className="media">
                <ImageHandler className="img-responsive" imageUrl="/img/global/photos/Jeff_French-200x200.jpg"
                              alt="Jeff French"/>
                <div className="media-body">
                  <h4><strong>Jeff French</strong>, Lead Designer</h4>
                </div>
              </div>
            </div>
            <div className="col-4 col-sm-3 col-md-3 team-member">
              <div className="media">
                <ImageHandler className="img-responsive" imageUrl="/img/global/photos/Anisha_Jain-200x200.jpg"
                              alt="Anisha Jain"/>
                <div className="media-body">
                  <h4><strong>Anisha Jain</strong>, Sr. Software Engineer</h4>
                </div>
              </div>
            </div>
            <div className="clearfix visible-xs-block"/>{/* After every 3 */}
            <div className="col-4 col-sm-3 col-md-3 team-member">
              <div className="media">
                <ImageHandler className="img-responsive" imageUrl="/img/global/photos/Judy_Johnson-200x200.jpg"
                              alt="Judy Johnson"/>
                <div className="media-body">
                  <h4><strong>Judy Johnson</strong>, Operations</h4>
                </div>
              </div>
            </div>
            <div className="col-4 col-sm-3 col-md-3 team-member">
              <div className="media">
                <ImageHandler className="img-responsive" imageUrl="/img/global/photos/Neelam_Joshi-200x200.jpg"
                              alt="Neelam Joshi"/>
                <div className="media-body">
                  <h4><strong>Neelam Joshi</strong>, Sr. Software Engineer</h4>
                </div>
              </div>
            </div>
            <div className="clearfix visible-sm-block visible-md-block visible-lg-block"/>{/* After every 4 */}
            <div className="col-4 col-sm-3 col-md-3 team-member">
              <div className="media">
                <ImageHandler className="img-responsive" imageUrl="/img/global/photos/Ciero_Kilpatrick-200x200.jpg"
                              alt="Ciero Kilpatrick"/>
                <div className="media-body">
                  <h4><strong>Ciero Kilpatrick</strong>, User Experience Design Intern</h4>
                </div>
              </div>
            </div>
            <div className="clearfix visible-xs-block"/>{/* After every 3 */}
            <div className="col-4 col-sm-3 col-md-3 team-member">
              <div className="media">
                <ImageHandler className="img-responsive" imageUrl="/img/global/photos/Eric_Ogawa-200x200.jpg"
                              alt="Eric"/>
                <div className="media-body">
                  <h4><strong>Eric Ogawa</strong>, User Experience Design Intern</h4>
                </div>
              </div>
            </div>
          </div>

          <h3 className="h3">Our Story</h3>
          After meeting in Oakland in the spring of 2013, We Vote co-founders Dale McGrew, Jenifer Fernandez Ancona, Dan Ancona,
          and their families became fast friends and bought a home together,
          forming an intentional community. Through
          daily conversations, the idea of a nonprofit social voter network was born.
          &quot;We&#39;re living our values,&quot; says Jenifer. We Vote would be a community for voters, they
          decided, created
          from a communal home of people concerned about where this country is heading. Being an open
          source, volunteer-driven project means anyone can contribute. Kind of like democracy.<br />

          <h3 className="h3">Credits &amp; Gratitude</h3>
          <Link to="/more/credits/">We are thankful for our volunteers, our board of directors, and the
            organizations</Link> that are critical to our work.<br />

          <br />
        </div>
      </div>
    </div>;
  }
}
