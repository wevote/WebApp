import React, {Component} from "react";
import Helmet from "react-helmet";
import {Link} from "react-router";
import ImageHandler from "../../components/ImageHandler";

export default class Team extends Component {
  constructor (props) {
    super(props);
  }

  static getProps () {
    return {};
  }

  render () {
    return <div>
      <Helmet title="Team - We Vote"/>
      <div className="container-fluid card">
        <h1 className="h1">Our Team</h1>

        <div className="Our-Story">
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

          <h3 className="h3">Credits &amp; Gratitude</h3>
          <Link to="/more/credits/">We are thankful for our volunteers, our board of directors, and the
            organizations</Link> that are critical to our work.<br />
          <br />
        </div>
      </div>
    </div>;
  }
}
