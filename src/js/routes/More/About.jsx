import React, { Component } from "react";
import Helmet from "react-helmet";
import { Link } from "react-router";
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
      <Helmet title="About Us - We Vote" />
        <div className="container-fluid card">
          <h1 className="h1">About We Vote</h1>
          <div className="btn-toolbar">
          <a className="btn btn-social-icon btn-twitter" href="https://twitter.com/WeVote" target="_blank">
            <span className="fa fa-twitter" />
          </a>

          <a className="btn btn-social-icon btn-facebook" href="https://www.facebook.com/WeVoteUSA" target="_blank">
            <span className="fa fa-facebook" />
          </a>

          <a className="btn btn-social-icon btn-github" href="https://github.com/WeVote" target="_blank">
            <span className="fa fa-github" />
          </a>

          <a className="btn btn-social-icon btn-medium" href="https://medium.com/@WeVote" target="_blank">
            <span className="fa fa-medium" />
          </a>
          </div>

          <br />
            <ReactPlayer url="https://player.vimeo.com/video/121315141" width="300px" height="231px" />
            <br />
          <strong>Vote with Confidence</strong><br />
            We Vote is the political social network for America. That means a place to share what you believe, and
            find opinions on candidates and propositions before you vote. We Vote is a one-stop-shop for voter
            preparation, where you can:
            <ul><li>
            see candidate info, proposition info, and ratings from trusted nonprofit groups
            </li><li>
            easily create your own voter guide showing which candidates and propositions you support
            </li><li>
            share your views with friends
            </li></ul>

            <strong>How does it work?</strong><br />
            Sign in using Twitter or Facebook. Enter your address to view your ballot and start supporting and
            opposing candidates and propositions. Follow nonprofit groups and add friends to build your network, so you
            have voting recommendations all the way down your ballot.<br />
            <br />
            <strong>What about privacy?</strong><br />
            When you support or oppose a ballot item, your position is friends-only
            by default. Use the privacy button (sample below) to switch your views to public, or back to private.
            <PositionPublicToggle ballot_item_we_vote_id="null"
                                  className="null"
                                  type="MEASURE"
                                  supportProps={supportProps}
            />
            Like email, We Vote is built to run on many servers all over America, which means that no one person or company owns
            the data on the site. We will never sell your email.<br />
            <br />

            <strong>How do I use We Vote?</strong><br />
            <a href="https://help.wevote.us/hc/en-us/" target="_blank">Visit our help center for answers.&nbsp;<i className="fa fa-external-link" /></a><br />
            <br />

            <strong>More questions?</strong><br />
            <Link to="/more/faq/">Visit our frequently asked questions page</Link> for answers.<br />
            <br />
            <strong>Credits</strong><br />
            <Link to="/more/credits/">We are thankful for our volunteers, our board of directors, and the organizations</Link> that are critical to our work.
            <br />
            <br />

            <h3>WHO WE ARE</h3>

            <div className="Our-Story">
            <strong>Our Story</strong><br />
            After meeting in Oakland in the spring of 2013, We Vote co-founders <a href="#Dale">Dale McGrew</a>, <a href="#Jen">Jenifer Fernandez Ancona</a>, Dan Ancona,
            and their families became fast friends and bought a home together,
            forming an intentional community. Through
            daily conversations, the idea of a nonprofit social voter network was born.
            &quot;We&#39;re living our values,&quot; says Jenifer. We Vote would be a community for voters, they decided, created
            from a communal home of people concerned about where this country is heading. Being an open
            source, volunteer-driven project means anyone can contribute. Kind of like democracy.<br />
            <br />
            <strong>A Nonprofit Startup</strong><br />
            We Vote is made of two 501(c)(3) and 501(c)(4) nonpartisan nonprofit organizations based in
            Oakland, California. This site is managed by the 501(c)(4), We Vote USA. Our
            software is open source, and our work is driven by the nearly 100 volunteers who have contributed so far.
            Inspired by groups like <a href="http://codeforsanfrancisco.org/" target="_blank">Code for America&nbsp;<i className="fa fa-external-link" />
            </a> and the <a href="https://www.mozilla.org/en-US/foundation/" target="_blank">Mozilla Foundation&nbsp;<i className="fa fa-external-link" /></a>, we use technology to
            make democracy stronger.<br />
            <br/><br/><br/>
            </div>
        <div className="container-fluid">
        <h3><strong>We Vote Boards</strong></h3>
        <br/>
        <div className="row centered">
        <div className="col-xs-4 col-md-3">
          <div className="media">
            <ImageHandler className="img-responsive" imageUrl="/img/global/photos/JeniferAncona-300x300.jpg"
                alt="Jenifer Fernandez Ancona"/>
            <div className="media-body">
                <h2><strong>Jenifer Fernandez Ancona</strong></h2>
                <h3>Co-founder &amp; Board Chair</h3>
                <span className="xx-small hidden-xs">
                  <span>Vice President, Strategy & Member Engagement at the Women Donors Network. 10 yrs of experience
                  in social change philanthropy. Was reporter at the LA Times. </span>
                <a className="smaller" href="https://twitter.com/JenAncona" target="_blank">@JenAncona</a>
                <br />
                <br />
                </span>
            </div>
         </div>
        </div>
        <div className="col-xs-4 col-md-3">
          <div className="media">
            <ImageHandler className="img-responsive" imageUrl="/img/global/photos/TianaEpps-Johnson-512x512.jpg"
                alt="Tiana Epps-Johnson"/>
            <div className="media-body">
                <h2><strong>Tiana Epps-Johnson</strong></h2>
                <h3>C3 Board Chair</h3>
                <span className="xx-small hidden-xs">Lorem ipsum dolor sit amet, consectetur.
                <br />
                <br />
                </span>
            </div>
          </div>
        </div>
        <div className="col-xs-4 col-md-3">
          <div className="media">
            <ImageHandler className="img-responsive" imageUrl="/img/global/photos/DebraCleaver-300x300.png"
            alt="Debra Cleaver"/>
            <div className="media-body">
              <h2><strong>Debra Cleaver</strong></h2>
              <h3>C3 Board Member</h3>
              <span className="xx-small hidden-xs">
                <span>Founder & Exec. Dir. of VOTE.org, the web's most heavily trafficked site for accurate voting
                information. Recognized expert in technology, product development, and voting. Recent recipient of
                Knight News Challenge grant. </span>
              <a className="smaller" href="https://twitter.com/VoteDotOrg" target="_blank">@VoteDotOrg</a>
              <br />
              <br />
              </span>
            </div>
          </div>
        </div>
        <div className="clearfix visible-xs-block" />
        <div className="col-xs-4 col-md-3">
          <div className="media">
            <ImageHandler className="img-responsive" imageUrl="/img/global/photos/ToryGavito_400x400.jpeg"
            alt="Tory Gavito"/>
            <div className="media-body">
              <h2><strong>Tory Gavito</strong></h2>
              <h3>C4 Board Member</h3>
              <span className="xx-small hidden-xs">Lorem ipsum dolor sit amet, consectetur.
              <br />
              <br />
              </span>
            </div>
          </div>
        </div>
        <div className="clearfix visible-md-block" />
        <div className="col-xs-4 col-md-3">
          <div className="media">
            <ImageHandler className="img-responsive" imageUrl="/img/global/photos/LawrenceGrodeska-200x200.jpg"
            alt="Lawrence Grodeska"/>
            <div className="media-body">
              <h2><strong>Lawrence Grodeska</strong></h2>
              <h3>C3 Board Member</h3>
              <span className="xx-small hidden-xs">Lorem ipsum dolor sit amet, consectetur.
              <br />
              <br />
              </span>
            </div>
          </div>
        </div>
         <div className="col-xs-4 col-md-3">
          <div className="media">
            <ImageHandler className="img-responsive" imageUrl="/img/global/photos/DaleMcGrew-300x300.jpg"
            alt="Dale John McGrew"/>
            <div className="media-body">
              <h2><strong>Dale John McGrew</strong></h2>
              <h3>Executive Director &amp; Board Member</h3>
              <span className="xx-small hidden-xs">
                <span>Has managed large interactive software projects for companies like Disney, Intel, IBM, Frogdesign
                and Crayola, and nonprofits like Clinton Global Initiative, American Red Cross, American Lung
                Association, and over 60 other nonprofits. </span>
              <a className="smaller" href="https://twitter.com/WeVote" target="_blank">@WeVote</a>
              <br />
              <br />
              </span>
            </div>
          </div>
        </div>
        <div className="clearfix visible-xs-block" />
        <div className="col-xs-4 col-md-3">
          <div className="media">
            <ImageHandler className="img-responsive" imageUrl="/img/global/photos/AnatShenker-300x300.jpeg"
            alt="Anat Shenker-Osorio"/>
            <div className="media-body">
              <h2><strong>Anat Shenker-Osorio</strong></h2>
              <h3>C4 Board Member</h3>
              <span className="xx-small hidden-xs">
                <span>Communications expert, researcher and political pundit. The author of the acclaimed book “Don’t
                Buy It: The Trouble with Talking Nonsense About the Economy.” Anat’s writing & research has appeared in
                The Atlantic, Boston Globe, Huffington Post, among other publications. </span>
              <a className="smaller" href="https://twitter.com/anatosaurus" target="_blank">@anatosaurus</a>
              <br />
              <br />
              </span>
            </div>
          </div>
        </div>
        <div className="col-xs-4 col-md-3">
          <div className="media">
            <ImageHandler className="img-responsive" imageUrl="/img/global/photos/WilliamWinters-300x300.jpg"
            alt="William Winters"/>
            <div className="media-body">
              <h2><strong>William Winters</strong></h2>
              <h3>C4 Board Member</h3>
              <span className="xx-small hidden-xs">
                <span>Sr. Strategist at Citizen Engagement Laboratory. Previously: Sr. Campaigner at Change.org,
                Campaign Manager at Color Of Change. </span>
              <a href="https://twitter.com/wwintersiii" target="_blank">@wwintersiii</a>
              <br />
              <br />
              </span>
            </div>
          </div>
        </div>
        </div>
    </div>
<br/><br/>
  <div className="container-fluid">
        <h3><strong>We Vote Staff</strong></h3>
        <br/>
        <div className="row centered">
        <div className="col-xs-4 col-md-3">
          <div className="media">
            <ImageHandler className="img-responsive" imageUrl="/img/global/photos/SarahClements-400x400.jpg"
            alt="Sarah Clements"/>
            <div className="media-body">
              <h2><strong>Sarah Clements</strong></h2>
              <h3>Engineering Intern</h3>
              <span className="xx-small hidden-xs">Lorem ipsum dolor sit amet, consectetur.
              <br />
              <br />
              </span>
            </div>
          </div>
        </div>
        <div className="col-xs-4 col-md-3">
          <div className="media">
            <ImageHandler className="img-responsive" imageUrl="/img/global/photos/IreneFlorez-400x400.jpg"
            alt="Irene Florez"/>
            <div className="media-body">
              <h2><strong>Irene Florez</strong></h2>
              <h3>Engineering Intern</h3>
              <span className="xx-small hidden-xs">Lorem ipsum dolor sit amet, consectetur.
              <br />
              <br />
              </span>
            </div>
          </div>
        </div>
        <div className="col-xs-4 col-md-3">
          <div className="media">
            <ImageHandler className="img-responsive" imageUrl="/img/global/photos/JeffFrench-500x500.jpg"
            alt="Jeff French"/>
            <div className="media-body">
              <h2><strong>Jeff French</strong></h2>
              <h3>Lead Designer</h3>
              <span className="xx-small hidden-xs">Lorem ipsum dolor sit amet, consectetur.
              <br />
              <br />
              </span>
            </div>
          </div>
        </div>
        <div className="clearfix visible-xs-block" />
        <div className="col-xs-4 col-md-3">
          <div className="media">
            <ImageHandler className="img-responsive" imageUrl="/img/global/photos/AnishaJain-200x200.jpg"
            alt="Anisha Jain"/>
            <div className="media-body">
              <h2><strong>Anisha Jain</strong></h2>
              <h3>Engineering Intern</h3>
              <span className="xx-small hidden-xs">Lorem ipsum dolor sit amet, consectetur.
              <br />
              <br />
              </span>
            </div>
          </div>
        </div>
        <div className="clearfix visible-md-block" />
        <div className="col-xs-4 col-md-3">
          <div className="media">
            <ImageHandler className="img-responsive" imageUrl="/img/global/photos/JudyJohnson-300x300.jpg"
            alt="Judy Johnson"/>
            <div className="media-body">
              <h2><strong>Judy Johnson</strong></h2>
              <h3>Operations</h3>
              <span className="xx-small hidden-xs">Lorem ipsum dolor sit amet, consectetur.
              <br />
              <br />
              </span>
            </div>
          </div>
        </div>
         <div className="col-xs-4 col-md-3">
          <div className="media">
            <ImageHandler className="img-responsive" imageUrl="/img/global/photos/NeelamJoshi_415x400.jpg"
            alt="Neelam Joshi"/>
            <div className="media-body">
              <h2><strong>Neelam Joshi</strong></h2>
              <h3>Engineering Intern</h3>
              <span className="xx-small hidden-xs">Lorem ipsum dolor sit amet, consectetur.
              <br />
              <br />
              </span>
            </div>
          </div>
        </div>
        <div className="clearfix visible-xs-block" />
        <div className="col-xs-4 col-md-3">
          <div className="media">
            <ImageHandler className="img-responsive" imageUrl="/img/global/photos/CieroKilpatrrick_400x401.jpg"
            alt="Ciero Kilpatrick"/>
            <div className="media-body">
              <h2><strong>Ciero Kilpatrick</strong></h2>
              <h3>User Experience Intern</h3>
              <span className="xx-small hidden-xs">Lorem ipsum dolor sit amet, consectetur.
              <br />
              <br />
              </span>
            </div>
          </div>
        </div>
        <div className="col-xs-4 col-md-3">
          <div className="media">
            <ImageHandler className="img-responsive" imageUrl="/img/global/photos/DaleMcGrew-300x300.jpg"
            alt="Dale John McGrew"/>
            <div className="media-body">
              <h2><strong>Dale John McGrew</strong></h2>
              <h3>Executive Director</h3>
              <span className="xx-small hidden-xs">Lorem ipsum dolor sit amet, consectetur.
              <br />
              <br />
              </span>
            </div>
          </div>
        </div>
        <div className="clearfix visible-md-block" />
        <div className="col-xs-4 col-md-3">
          <div className="media">
            <ImageHandler className="img-responsive" imageUrl="/img/global/photos/ColettePhair-300x300.png"
            alt="Colette Phair"/>
            <div className="media-body">
              <h2><strong>Colette Phair</strong></h2>
              <h3>Manager of Communications and Community Outreach</h3>
              <span className="xx-small hidden-xs">Lorem ipsum dolor sit amet, consectetur.
              <br />
              <br />
              </span>
            </div>
          </div>
        </div>
        <div className="col-xs-4 col-md-3 col-">
          <div className="media">
            <ImageHandler className="img-responsive" imageUrl="/img/global/photos/EricOgawa-400x400.jpg"
            alt="Eric"/>
            <div className="media-body">
              <h2><strong>Eric Ogawa</strong></h2>
              <h3>User Experience Design Intern</h3>
              <span className="xx-small hidden-xs">Lorem ipsum dolor sit amet, consectetur.
              <br />
              <br />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

<h3>Our Volunteers</h3>

We can&#39;t say thank you enough times to the <Link to="/more/credits/"> nearly 100 volunteers</Link> who&#39;ve generously
donated their time and skills to build We Vote. Join us! Please sign up to volunteer at
            <a href="http://WeVoteTeam.org/volunteer"
               target="_blank"> http://WeVoteTeam.org</a>.
<br /><br />


        </div>
      </div>;
  }
}
