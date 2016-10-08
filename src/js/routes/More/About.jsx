import React, { Component } from "react";
import Helmet from "react-helmet";
import { Link } from "react-router";
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
    return <div>
      <Helmet title="About Us - We Vote" />
        <div className="container-fluid card">
          <h1 className="h1">About We Vote</h1>
          <p><strong>Vote with Confidence</strong><br />
            We Vote is the political social network for America. That means a place to share what you believe and
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
            opposing candidates and propositions. Follow nonprofit groups and add friends to build your network.<br />
            <br />
            <strong>What about privacy?</strong><br />
            When you support or oppose a ballot item, your position is friends-only
            by default. Use the privacy button (sample below) to switch your views to public, or back to private.
            <PositionPublicToggle ballot_item_we_vote_id="null"
                                  className="null"
                                  type="null"
                                  supportProps="null"
            />
            Like email, We Vote is built to run on many servers all over America, which means that no one person or company owns
            the data on the site. We will never sell your email.<br />
            <br />
            <strong>Our Story - 42 Million</strong><br />
            That was the figure on the screen. 42,000,000 fewer voters in the 2010 midterm election than there
            had been just two years prior in 2008. When We Vote cofounder Dan Ancona saw this negative number
            on the front page of his web site, Democracy Dash, he knew things had to change.
            Through the rise and fall of Democracy Dash, the first social site for voters, it became clear that social
            technology meant to empower voters should not be owned by a corporation.<br />
            <br />
            After meeting in Oakland in the spring of 2013, We Vote co-founders <a href="#Dale">Dale McGrew</a>, <a href="#Jen">Jenifer Fernandez Ancona</a>, <a href="#Dan">Dan Ancona</a>,
            and their families became fast friends and bought a home together,
            forming an intentional community. Through
            daily conversations, the idea of a nonprofit social voter network was born.
            &quot;We&#39;re living our values,&quot; says Jenifer. We Vote would be a community for voters, they decided, created
            from a communal home of people concerned about where this country is heading. Being an open
            source, volunteer-driven project means anyone can contribute. Kind of like democracy.<br />
            <br />
            <h3>WHO WE ARE</h3>
            <br />
            <strong>A Nonprofit Startup</strong><br />
            We Vote is made of two 501c3/501c4 nonpartisan nonprofit organization based in Oakland, California. Our
            software is open source, and our work is driven by the nearly 100 volunteers who&#39;ve contributed so far.
            Inspired by groups like <a href="http://codeforsanfrancisco.org/">Code for America</a>
            and the <a href="https://www.mozilla.org/en-US/foundation/">Mozilla Foundation</a>, we use technology to
            make democracy stronger.<br />
            <br />
  <ImageHandler className="about-photo"
                imageUrl="http://res.cloudinary.com/hrscywv4p/image/upload/c_limit,f_auto,h_1440,q_80,w_720/v1/181340/JeniferAncona-300x300_jbqmlu.jpg"
                alt="Jen-photo" />
<h3 id="Jen">Jenifer Fernandez Ancona</h3>

Co-founder &amp; Board Member
<br /><br />
<i>&quot;We need to match the values of the people with the values of the leadership in this country.&quot;</i>
<br />
Inspired by her grandmother&#39;s experience of immigrating to the U.S. from El Salvador and the
knowledge that some people were treated differently from others, Jenifer has worked to make large-scale
change to address inequality. She is Senior Director of Membership &amp; Communications at Women
Donors Network and serves on the board of Citizen Engagement Laboratory. Once a Los Angeles Times
reporter, Jenifer left journalism to tell stories that had a direct impact on social justice. She has worked
as a legislative aide in the California State Assembly and sees We Vote as a means to bridge the
disconnect between voters and government.
<br /><br />
  <ImageHandler className="about-photo"
                imageUrl="http://res.cloudinary.com/hrscywv4p/image/upload/c_limit,f_auto,h_1440,q_80,w_720/v1/181340/DaleMcGrew-300x300_ofybhb.jpg"
                alt="Dale-photo" />
<h3 id="Dale">Dale McGrew</h3>

Co-founder &amp; Executive Director
<br /><br />
<i>&quot;When you deal with something like democracy, you&#39;ve got to take the long view.&quot;</i>
<br />
Dale is a serial entrepreneur and founder of GoLightly and Gravity, Inc. Growing up in a political

household meant Dale&#39;s idea of fun later on would be to throw ballot parties where friends would

discuss the important voting choices they&#39;d be making before an election. Yet the sensationalized

&quot;hockey game&quot; version of politics Dale saw portrayed in the media, where candidates would brutally

compete for voter attention, never felt right. He envisioned We Vote as a place where voters could

make informed decisions based on rational discussion rather than debates that dodged the issues. Dale

has managed software projects for companies like Intel and IBM and for nonprofits like the Red Cross

and American Lung Association.
<br /><br />
  <ImageHandler className="about-photo"
                imageUrl="https://avatars0.githubusercontent.com/u/17035647?v=3&s=466"
                alt="Zach-photo" />

<h3 id="Zach">Zach Monteith</h3>
Engineering Intern
<br /><br />
<i>&quot;In an age where we are so connected, we can't let our political discourse be so fragmented.&quot;</i>
<br />
Zach brings a unique blend of experience in front end web development, political campaigning, and

adding puns to any conversation. He&#39;s worked as a Canvass Director for the Fund for the Public Interest

and Campaign Manager for an Oakland mayoral race. Zach probably first knew we needed We Vote

when working as a USPS carrier, where he actually injured himself from lifting the bags of 200-page

voter information guides issued by the State of California. Motivated by his own idea for a social voter

site, Zach met We Vote at Code for San Francisco&#39;s Civic Hack Night, and the rest is history.
<br /><br />
  <ImageHandler className="about-photo"
                imageUrl="http://res.cloudinary.com/hrscywv4p/image/upload/c_limit,h_1440,w_720,f_auto,q_90/v1/181340/Me-WeVoteProfile_dati1v.jpg"
                alt="Colette-photo" />
<h3>Colette Phair</h3>
Manager of Communications &amp; Community Engagement
<br /><br />
What do science fiction novel writing, women&#39;s rights work in sub-Saharan Africa, and briefly fronting a

black metal band have in common? Not much, except they&#39;re all things Colette has done. Studying

political science at the University of California and Paris Institute of Political Studies led to work with

several nonprofit and media groups. Colette took part in Get Out The Vote efforts in 2016 and has

written everything from academic articles to other people&#39;s dating profiles.
<br /><br />
<h3>Our Boards</h3>
501c3 Board: Jenifer Fernandez Ancona, Debra Cleaver, Dale McGrew, Anat Shenker-Osorio, William
Winters (coming soon: Tiana Epps-Johnson and Lawrence Grodeska)<br />
            <br />
501c4 Board: coming soon<br />
            <br />
<h3>Our Volunteers</h3>

We can&#39;t say thank you enough times to the <Link to="/more/credits"> nearly 100 volunteers</Link> who&#39;ve generously
donated their time and skills to build We Vote.
<br /><br />
          </p>

        </div>
      </div>;
  }
}
