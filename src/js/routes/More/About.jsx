import React, { Component } from 'react';
import { Link } from 'react-router';

{/* VISUAL DESIGN HERE: https://projects.invisionapp.com/share/2R41VR3XW#/screens/90192590 */}

export default class About extends Component {
  constructor(props) {
    super(props);
  }

  static getProps() {
    return {};
  }

  render() {
    return (
      <div>
        <div className="container-fluid well gutter-top--small fluff-full1">
          <h3 className="text-center">About We Vote</h3>
          <p>
              We Vote USA is nonprofit and nonpartisan. For more information, please visit www.WeVoteUSA.org.
          </p>

          <h3 className="text-center">Acknowledgements</h3>

          <p>We are grateful for these organizations that are critical to our work.<br />
              <br />
              Ballotpedia - Data<br />
              CivicMakers - Event Collaborations<br />
              Code for San Francisco &amp; Code for America - Our Home for Volunteer Work<br />
              DLA Piper - Legal<br />
              Facebook - Data<br />
              Google Civic - Data<br />
              Twitter - Data<br />
              Vote Smart - Data<br />
              Voting Information Project, Pew Charitable Trusts - Data<br />
              Wikipedia - Data<br />
              We Vote Education - Data
          </p>
          <p>
              Special thanks to our team of volunteers.
              Thank you everyone! (This is a list of volunteers who have contributed 10 or more hours, in rough order of hours contributed.)</p>
          <p>
              Dale McGrew - Oakland, CA<br />
              Jenifer Fernandez Ancona - Oakland, CA<br />
              Rob Simpson - Vienna, VA<br />
              Nicolas Fiorini - Arlington, VA<br />
              Niko Barry - Berkeley, CA<br />
              Joe Evans - Santa Cruz, CA<br />
              Mary O'Connor - Sebastopol, CA<br />
              Marissa Luna - Lansing, MI<br />
              Aaron Borden - San Francisco, CA<br />
              Judy Johnson - Oakland, CA<br />
              Robin Braverman - Walnut Creek, CA<br />
              Mike McConnell - San Francisco, CA<br />
              Dan Ancona - Oakland, CA<br />
              Zak Zaidman - Ojai, CA<br />
              Debra Cleaver - San Francisco, CA<br />
              William Winters - Oakland, CA<br />
              Andrea Moed - San Francisco, CA<br />
              Anat Shenker-Osorio - Oakland, CA<br />
              Kad Smith - Berkeley, CA<br />
              Courtney Gonzales - Benicia, CA<br />
              Jenna Haywood - Berkeley, CA<br />
              Tom Furlong - Menlo Park, CA<br />
              Susan Clark - Oakland, CA<br />
              Kim Anderson - San Francisco, CA<br />
              Adam Barry - San Francisco, CA<br />
              Raphael Merx - San Francisco, CA<br />
              Jesse Aldridge - San Francisco, CA<br />
              Josh Levinger - Oakland, CA<br />
              Leslie Castellanos - San Francisco, CA<br />
              Jennifer Holmes - Pacifica, CA<br />
              Miguel Elasmar - Sarasota, FL<br />
              Nicole Shanahan - Palo Alto, CA<br />
              Steve Whetstone - San Francisco, CA<br />
              Marcus Busby - San Francisco, CA<br />
              lulu - New York, NY<br />
              Chris Griffith - Santa Cruz, CA<br />
              Nathan Stankowski - San Rafael, CA<br />
              Sean McMahon - Redwood City, CA<br />
              Scott Wasserman - Philadelphia, PA<br />
              Adrienne Yang - Oakland, CA<br />
              Mark Rosenthal - Oakland, CA<br />
          </p>

        </div>
      </div>
    );
  }
}
