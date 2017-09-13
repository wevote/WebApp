import React, {Component} from "react";
import Helmet from "react-helmet";
import {Link} from "react-router";
import AnalyticsActions from "../../actions/AnalyticsActions";
import ImageHandler from "../../components/ImageHandler";
import VoterStore from "../../stores/VoterStore";

export default class Team extends Component {
  constructor (props) {
    super(props);
  }

  static getProps () {
    return {};
  }

  componentDidMount (){
    AnalyticsActions.saveActionAboutTeam(VoterStore.election_id());
  }

  render () {
    return <div>
      <Helmet title="Team - We Vote"/>
      <div className="container-fluid card u-inset__v--md">

        <section>
          <h1 className="h1">Our Team</h1>
          <h3 className="h3">We Vote Board Members &amp; Advisers</h3>
          <div className="row">
            <div className="col-4 col-sm-3">
              <div className="team-member">
                <ImageHandler className="img-responsive team-member__photo"
                              imageUrl="/img/global/photos/Jenifer_Fernandez_Ancona-200x200.jpg"
                              alt="Jenifer Fernandez Ancona"/>
                <div className="media-body">
                  <h4 className="team-member__name"><strong>Jenifer Fernandez Ancona</strong></h4>
                  <p className="team-member__title">Co-Founder &amp; c4 Board Chair</p>
                <p className="xx-small hidden-xs">
                  VP, Strategy &amp; Member Engagement at the Women Donors Network.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-4 col-sm-3">
              <div className="team-member">
                <ImageHandler className="img-responsive team-member__photo" imageUrl="/img/global/photos/Tiana_Epps_Johnson-200x200.jpg"
                              alt="Tiana Epps-Johnson"/>
                <div className="media-body">
                  <h4 className="team-member__name"><strong>Tiana Epps-Johnson</strong></h4>
                  <p className="team-member__title">Senior Adviser</p>
                <p className="xx-small hidden-xs">
                  Exec. Dir. of CTCL, software for election administrators. Former Voting Info Project &amp;
                  Harvard Ash Center for Democratic Governance and Innovation.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-4 col-sm-3">
              <div className="team-member">
                <ImageHandler className="img-responsive team-member__photo" imageUrl="/img/global/photos/Debra_Cleaver-200x200.jpg"
                              alt="Debra Cleaver"/>
                <div className="media-body">
                  <h4 className="team-member__name"><strong>Debra Cleaver</strong></h4>
                  <p className="team-member__title">c3 Board Member</p>
              <p className="xx-small hidden-xs">
                Founder &amp; CEO of VOTE.org, the web's most heavily trafficked site for accurate voting
                information.
              </p>
                </div>
              </div>
            </div>

            <div className="col-4 col-sm-3">
              <div className="team-member">
                <ImageHandler className="img-responsive team-member__photo" imageUrl="/img/global/photos/Tory_Gavito-200x200.jpg"
                              alt="Tory Gavito"/>
                <div className="media-body">
                  <h4 className="team-member__name"><strong>Tory Gavito</strong></h4>
                  <p className="team-member__title">c4 Board Member</p>
                  <p className="xx-small hidden-xs">
                    Exec. Dir. at Texas Future Project.
                  </p>
                </div>
              </div>
            </div>
            <div className="clearfix visible-sm-block visible-md-block visible-lg-block"/>{/* After every 4 */}
            <div className="col-4 col-sm-3">
              <div className="team-member">
                <ImageHandler className="img-responsive team-member__photo" imageUrl="/img/global/photos/Lawrence_Grodeska-200x200.jpg"
                              alt="Lawrence Grodeska"/>
                <div className="media-body">
                  <h4 className="team-member__name"><strong>Lawrence Grodeska</strong></h4>
                  <p className="team-member__title">c3 Board Chair</p>
                  <p className="xx-small hidden-xs">
                    Civic Tech communications and innovation at CivicMakers. Formerly at Change.org.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-4 col-sm-3">
              <div className="team-member">
                <ImageHandler className="img-responsive team-member__photo" imageUrl="/img/global/photos/Dale_McGrew-200x200.jpg"
                              alt="Dale John McGrew"/>
                <div className="media-body">
                  <h4 className="team-member__name"><strong>Dale John McGrew</strong></h4>
                  <p className="team-member__title">Co-Founder / CTO &amp; c3 + c4 Board Member</p>
                  <p className="xx-small hidden-xs">
                    Managed large software projects for companies like Disney and over 60 nonprofits.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-4 col-sm-3">
              <div className="team-member">
                <ImageHandler className="img-responsive team-member__photo" imageUrl="/img/global/photos/Barbara_Shannon-200x200.jpg"
                              alt="Barbara Shannon"/>
                <div className="media-body">
                  <h4 className="team-member__name"><strong>Barbara Shannon</strong></h4>
                  <p className="team-member__title">c3 Board Member</p>
                  <p className="xx-small hidden-xs">
                    Adviser to entrepreneurs and C-level Fortune 500 leaders. MBA The Wharton School.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-4 col-sm-3">
              <div className="team-member">
                <ImageHandler className="img-responsive team-member__photo" imageUrl="/img/global/photos/Anat_Shenker_Osario-200x200.jpg"
                              alt="Anat Shenker-Osorio"/>
                <div className="media-body">
                  <h4 className="team-member__name"><strong>Anat Shenker-Osorio</strong></h4>
                  <p className="team-member__title">c4 Board Member</p>
                  <p className="xx-small hidden-xs">
                    Communications expert, researcher and political pundit.
                  </p>
                </div>
              </div>
            </div>
            <div className="clearfix visible-sm-block visible-md-block visible-lg-block"/>{/* After every 4 */}
            <div className="col-4 col-sm-3">
              <div className="team-member">
                <ImageHandler className="img-responsive team-member__photo" imageUrl="/img/global/photos/Betsy_Sikma-200x200.jpg"
                              alt="Betsy Sikma"/>
                <div className="media-body">
                  <h4 className="team-member__name"><strong>Betsy Sikma</strong></h4>
                  <p className="team-member__title">c3 Board Member</p>
                </div>
              </div>
            </div>

            <div className="col-4 col-sm-3">
              <div className="team-member">
                <ImageHandler className="img-responsive team-member__photo" imageUrl="/img/global/photos/William_Winters-200x200.jpg"
                              alt="William Winters"/>
                <div className="media-body">
                  <h4 className="team-member__name"><strong>William Winters</strong></h4>
                  <p className="team-member__title">c4 Board Member</p>
                  <p className="xx-small hidden-xs">
                    Campaign Manager at Color Of Change, CEL &amp; Change.org.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <h3 className="h3">We Vote Staff</h3>
          <div className="row">
            <div className="col-4 col-sm-3">
              <div className="team-member">
                <ImageHandler className="img-responsive team-member__photo" imageUrl="/img/global/photos/Alicia_Prevost-200x200.jpg"
                              alt="Alicia Prevost"/>
                <div className="media-body">
                  <h4 className="team-member__name"><strong>Alicia Prevost</strong></h4>
                  <p className="team-member__title">Executive Director</p>
                </div>
              </div>
            </div>
            <div className="col-4 col-sm-3">
              <div className="team-member">
                <ImageHandler className="img-responsive team-member__photo" imageUrl="/img/global/photos/Dale_McGrew-200x200.jpg"
                              alt="Dale John McGrew"/>
                <div className="media-body">
                  <h4 className="team-member__name"><strong>Dale John McGrew</strong></h4>
                  <p className="team-member__title">Co-Founder / CTO</p>
                </div>
              </div>
            </div>
            <div className="col-4 col-sm-3">
              <div className="team-member">
                <ImageHandler className="img-responsive team-member__photo" imageUrl="/img/global/photos/Rohan_Bhambhoria-200x200.jpg"
                              alt="Rohan Bhambhoria"/>
                <div className="media-body">
                  <h4 className="team-member__name"><strong>Rohan Bhambhoria</strong></h4>
                  <p className="team-member__title">Engineering Intern</p>
                </div>
              </div>
            </div>

            <div className="col-4 col-sm-3">
              <div className="team-member">
                <ImageHandler className="img-responsive team-member__photo" imageUrl="/img/global/photos/Yuanhsin_Chang-200x200.jpg"
                              alt="Yuanhsin Chang"/>
                <div className="media-body">
                  <h4 className="team-member__name"><strong>Yuanhsin Chang</strong></h4>
                  <p className="team-member__title">User Experience Design Intern</p>
                </div>
              </div>
            </div>
            <div className="clearfix visible-sm-block visible-md-block visible-lg-block"/>{/* After every 4 */}
            <div className="col-4 col-sm-3">
              <div className="team-member">
                <ImageHandler className="img-responsive team-member__photo" imageUrl="/img/global/photos/Sarah_Clements-200x200.jpg"
                              alt="Sarah Clements"/>
                <div className="media-body">
                  <h4 className="team-member__name"><strong>Sarah Clements</strong></h4>
                  <p className="team-member__title">Engineering Intern</p>
                </div>
              </div>
            </div>
            <div className="col-4 col-sm-3">
              <div className="team-member">
                <ImageHandler className="img-responsive team-member__photo" imageUrl="/img/global/photos/Mansi_Desai-200x200.jpg"
                              alt="Mansi Desai"/>
                <div className="media-body">
                  <h4 className="team-member__name"><strong>Mansi Desai</strong></h4>
                  <p className="team-member__title">Digital Marketing Intern</p>
                </div>
              </div>
            </div>
            <div className="col-4 col-sm-3">
              <div className="team-member">
                <ImageHandler className="img-responsive team-member__photo" imageUrl="/img/global/photos/Irene_Florez-200x200.jpg"
                              alt="Irene Florez"/>
                <div className="media-body">
                  <h4 className="team-member__name"><strong>Irene Florez</strong></h4>
                  <p className="team-member__title">Engineering Intern</p>
                </div>
              </div>
            </div>
            <div className="col-4 col-sm-3">
              <div className="team-member">
                <ImageHandler className="img-responsive team-member__photo" imageUrl="/img/global/photos/Jeff_French-200x200.jpg"
                              alt="Jeff French"/>
                <div className="media-body">
                  <h4 className="team-member__name"><strong>Jeff French</strong></h4>
                  <p className="team-member__title">Lead Designer</p>
                </div>
              </div>
            </div>
            <div className="clearfix visible-sm-block visible-md-block visible-lg-block"/>{/* After every 4 */}
            <div className="col-4 col-sm-3">
              <div className="team-member">
                <ImageHandler className="img-responsive team-member__photo" imageUrl="/img/global/photos/Anisha_Jain-200x200.jpg"
                              alt="Anisha Jain"/>
                <div className="media-body">
                  <h4 className="team-member__name"><strong>Anisha Jain</strong></h4>
                  <p className="team-member__title">Sr. Software Engineer</p>
                </div>
              </div>
            </div>
            <div className="col-4 col-sm-3">
              <div className="team-member">
                <ImageHandler className="img-responsive team-member__photo" imageUrl="/img/global/photos/Judy_Johnson-200x200.jpg"
                              alt="Judy Johnson"/>
                <div className="media-body">
                  <h4 className="team-member__name"><strong>Judy Johnson</strong></h4>
                  <p className="team-member__title">Operations</p>
                </div>
              </div>
            </div>
            <div className="col-4 col-sm-3">
              <div className="team-member">
                <ImageHandler className="img-responsive team-member__photo" imageUrl="/img/global/photos/Neelam_Joshi-200x200.jpg"
                              alt="Neelam Joshi"/>
                <div className="media-body">
                  <h4 className="team-member__name"><strong>Neelam Joshi</strong></h4>
                  <p className="team-member__title">Sr. Software Engineer</p>
                </div>
              </div>
            </div>
            <div className="col-4 col-sm-3">
              <div className="team-member">
                <ImageHandler className="img-responsive team-member__photo" imageUrl="/img/global/photos/Ciero_Kilpatrick-200x200.jpg"
                              alt="Ciero Kilpatrick"/>
                <div className="media-body">
                  <h4 className="team-member__name"><strong>Ciero Kilpatrick</strong></h4>
                  <p className="team-member__title">User Experience Design Intern</p>
                </div>
              </div>
            </div>
            <div className="clearfix visible-sm-block visible-md-block visible-lg-block"/>{/* After every 4 */}
            <div className="col-4 col-sm-3">
              <div className="team-member">
                <ImageHandler className="img-responsive team-member__photo" imageUrl="/img/global/photos/Edward_Ly-200x200.jpg"
                              alt="Edward Ly"/>
                <div className="media-body">
                  <h4 className="team-member__name"><strong>Edward Ly</strong></h4>
                  <p className="team-member__title">Engineering Intern</p>
                </div>
              </div>
            </div>
            <div className="col-4 col-sm-3">
              <div className="team-member">
                <ImageHandler className="img-responsive team-member__photo" imageUrl="/img/global/photos/Eric_Ogawa-200x200.jpg"
                              alt="Eric Ogawa"/>
                <div className="media-body">
                  <h4 className="team-member__name"><strong>Eric Ogawa</strong></h4>
                  <p className="team-member__title">User Experience Design Intern</p>
                </div>
              </div>
            </div>
            <div className="col-4 col-sm-3">
              <div className="team-member">
                <ImageHandler className="img-responsive team-member__photo" imageUrl="/img/global/photos/Steve_Podell-200x200.jpg"
                              alt="Steve Podell"/>
                <div className="media-body">
                  <h4 className="team-member__name"><strong>Steve Podell</strong></h4>
                  <p className="team-member__title">Volunteer</p>
                </div>
              </div>
            </div>
            <div className="col-4 col-sm-3">
              <div className="team-member">
                <ImageHandler className="img-responsive team-member__photo" imageUrl="/img/global/photos/Bharath_Reddy-200x200.jpg"
                              alt="Bharath Reddy"/>
                <div className="media-body">
                  <h4 className="team-member__name"><strong>Bharath Reddy</strong></h4>
                  <p className="team-member__title">Software Engineer</p>
                </div>
              </div>
            </div>
          </div>

        </section>

        <section>
          <h3 className="h3">Credits &amp; Gratitude</h3>
          <Link to="/more/credits">We are thankful for our volunteers, our board of directors, and the
            organizations</Link> that are critical to our work.<br />
          <br />
          <h3 className="h3"><a href="https://help.wevote.us/hc/en-us/sections/115000140947-What-is-We-Vote-"
                            target="_blank">Visit our help center to learn more about We Vote.&nbsp;<i
          className="fa fa-external-link"/></a></h3>

        </section>
      </div>
    </div>;
  }
}
