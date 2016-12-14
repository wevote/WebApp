import React, { Component } from "react";
import Helmet from "react-helmet";

export default class Credits extends Component {
  constructor (props) {
    super(props);
  }

  static getProps () {
    return {};
  }

  render () {
    return <div>
      <Helmet title="Credits - We Vote" />
        <div className="container-fluid card">
          <h1 className="h1">Credits</h1>

          <h3 className="h4">We are grateful for these organizations that are critical to our work.</h3>
          <ul>
              <li><strong>Ballotpedia</strong> - Data</li>
              <li><strong>Center for Technology and Civic Life</strong> - Data</li>
              <li><strong>Change.org</strong> - Data</li>
              <li><strong>CivicMakers</strong> - Event Collaborations</li>
              <li><strong>Code for San Francisco &amp; Code for America</strong> - Our Home for Volunteer Work</li>
              <li><strong>DLA Piper</strong> - Legal</li>
              <li><strong>Facebook</strong> - Authentication &amp; Data</li>
              <li><strong>Google Civic</strong> - Data</li>
              <li><strong>League of Women Voters</strong> - Data</li>
              <li><strong>MapLight</strong> - Data</li>
              <li><strong>Microsoft</strong> - For supporting Code for San Francisco</li>
              <li><strong>Sunlight Foundation</strong> - Data</li>
              <li><strong>TurboVote, Democracy Works</strong> - Data</li>
              <li><strong>Twitter</strong> - Authentication &amp; Data</li>
              <li><strong>Vote Smart</strong> - Data</li>
              <li><strong>Voting Information Project, Pew Charitable Trusts</strong> - Data</li>
              <li><strong>We Vote Education</strong> - Data</li>
              <li><strong>Wikipedia</strong> - Data</li>
          </ul>

          <h3 className="h4">Thank you to our Board of Directors.</h3>
          <p> <em>We Vote USA: coming soon</em><br />
            We Vote Education: Jenifer Fernandez Ancona, Debra Cleaver, Dale McGrew, Anat Shenker-Osorio,
            William Winters (coming soon: Tiana Epps-Johnson and Lawrence Grodeska)<br />
          </p>
          <h3 className="h4">Special thanks to our team of volunteers.</h3>
          <p>You are the best! <br />
            (This is a list of volunteers who have contributed 10 or more hours, in rough order of hours contributed.)<br />
          </p>
          <ul>
            <li>Dale McGrew - Oakland, CA</li>
            <li>Jenifer Fernandez Ancona - Oakland, CA</li>
            <li>Rob Simpson - Warrenton, VA</li>
            <li>Jeff French - Oakland, CA</li>
            <li>Zach Monteith - San Francisco, CA</li>
            <li>Lisa Cho - San Francisco, CA</li>
            <li>Nicolas Fiorini - Arlington, VA</li>
            <li>Colette Phair - Oakland, CA</li>
            <li>Jennifer Holmes - Pacifica, CA</li>
            <li>Joe Evans - Santa Cruz, CA</li>
            <li>Andrea Moed - San Francisco, CA</li>
            <li>Adam Barry - San Francisco, CA</li>
            <li>Mary O'Connor - Sebastopol, CA</li>
            <li>Harsha Dronamraju - San Francisco, CA</li>
            <li>Nitin Garg - San Francisco, CA</li>
            <li>Niko Barry - Berkeley, CA</li>
            <li>Marissa Luna - Lansing, MI</li>
            <li>Aaron Borden - San Francisco, CA</li>
            <li>Judy Johnson - Oakland, CA</li>
            <li>Udi Davidovich - Walnut Creek, CA</li>
            <li>Mikel Duffy - San Francisco, CA</li>
            <li>Robin Braverman - Walnut Creek, CA</li>
            <li>Mike McConnell - San Francisco, CA</li>
            <li>Dan Ancona - Oakland, CA</li>
            <li>Zak Zaidman - Ojai, CA</li>
            <li>Debra Cleaver - San Francisco, CA</li>
            <li>William Winters - Oakland, CA</li>
            <li>Anat Shenker-Osorio - Oakland, CA</li>
            <li>Kad Smith - Berkeley, CA</li>
            <li>Courtney Gonzales - Benicia, CA</li>
            <li>Jenna Haywood - Berkeley, CA</li>
            <li>Tom Furlong - Menlo Park, CA</li>
            <li>Jayadev Akkiraju - Santa Clara, CA</li>
            <li>Raphael Merx - San Francisco, CA</li>
            <li>Susan Clark - Oakland, CA</li>
            <li>Kim Anderson - San Francisco, CA</li>
            <li>Sarah Clements - San Francisco, CA</li>
            <li>Jesse Aldridge - San Francisco, CA</li>
            <li>Josh Levinger - Oakland, CA</li>
            <li>Leslie Castellanos - San Francisco, CA</li>
            <li>Miguel Elasmar - Sarasota, FL</li>
            <li>Cindy Cruz - Daly City, CA</li>
            <li>Nicole Shanahan - Palo Alto, CA</li>
            <li>Steve Whetstone - San Francisco, CA</li>
            <li>Brian Bordley - Berkeley, CA</li>
            <li>Marcus Busby - San Francisco, CA</li>
            <li>lulu - New York, NY</li>
            <li>Chris Griffith - Santa Cruz, CA</li>
            <li>Nathan Stankowski - San Rafael, CA</li>
            <li>Sean McMahon - Redwood City, CA</li>
            <li>Scott Wasserman - Philadelphia, PA</li>
            <li>Adrienne Yang - Oakland, CA</li>
            <li>Mark Rosenthal - Oakland, CA</li>
          </ul>
        </div>
      </div>;
  }
}
