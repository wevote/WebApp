import React, { Component } from "react";
import Helmet from "react-helmet";
import { Link } from "react-router";
import AnalyticsActions from "../../actions/AnalyticsActions";
import { isWebApp } from "../../utils/cordovaUtils";
import { renderLog } from "../../utils/logging";
import OpenExternalWebSite from "../../utils/OpenExternalWebSite";
import PositionPublicToggle from "../../components/Widgets/PositionPublicToggle";
import VoterStore from "../../stores/VoterStore";

export default class HowToUse extends Component {
  static getProps () {
    return {};
  }

  componentDidMount () {
    AnalyticsActions.saveActionAboutGettingStarted(VoterStore.election_id());
  }

  render () {
    renderLog(__filename);
    const supportProps = { is_public_position: false };
    return (
      <div className="gettingStarted">
        <Helmet title="Getting Started" />
        <div className="container-fluid card">
          <h1 className="h1">Getting Started</h1>
        Here are the top 6 things to try.

          <h3 className="h3">Step 1: Listen to Voter Guides</h3>
          <span>
            <Link to="/opinions">Find organizations</Link>
            {" "}
            that you trust, and listen to those organizations.
            <strong>Why?</strong>
            {" "}
            When you listen to an organization&apos;s voter guide, their recommendations will show up on your ballot.
            This will make it easier for you to make choices all the way down your ballot.
          </span>
          <br />

          <h3 className="h3">Step 2: Support or Oppose Candidates</h3>
          <span>
            <Link to="/ballot">Look at the politicians on your ballot</Link>
            . Support the candidates you know you agree with.
            <strong>Why?</strong>
            {" "}
            See how easy it is to take a stance, and then work through your ballot.
          </span>
          <strong>What about privacy?</strong>
          {" "}
          When you support or oppose a ballot item, your position is friends-only
          by default. Use the privacy button (sample below) to switch your views to public, or back to only being
          visible to your We Vote friends.
          <PositionPublicToggle
            ballot_item_we_vote_id="null"
            className="null"
            type="MEASURE"
            supportProps={supportProps}
          />
          <br />

          <h3 className="h3">Step 3: Sign In</h3>
          <span>
            <Link to="/settings/account">
            Sign in with Twitter, Facebook, or your email
            address
            </Link>
            .
          </span>
          <strong>Why?</strong>
          {" "}
          Signing in with Twitter makes it
          easier to find groups you already trust. Signing in with Facebook makes it easier to find friends
          to ask for advice.
          <br />
          <br />

          <h3 className="h3">Step 4: Invite a Few Friends</h3>
          <span>
            <Link to="/more/connect">Invite friends</Link>
            {" "}
            so you can discuss your views with friends.
            <strong>Why?</strong>
            {" "}
            You will make better voting decisions with help from the friends you trust and respect.
          </span>
          <br />

          <h3 className="h3">Step 5: Share your Views</h3>
          Easily create your own voter guide, showing candidates and propositions you support.
          {" "}
          <strong>Why?</strong>
          {" "}
          By sharing your views with your friends, you are helping them learn how
          to make their voices heard. When more people vote, we get better outcomes.
          <br />
          <br />

          <h3 className="h3">Step 6: Share the Love</h3>
          { isWebApp() ? (
            <span>
              If you like We Vote, please
              {" "}
              <Link to="/more/donate">give what you can</Link>
              {" "}
              to help us reach more voters.
              Since we are a nonprofit, your donations make our work possible! Thank you.
              <br />
            </span>
          ) : (
            <span>
            If you like We Vote, please go to our website and
              <OpenExternalWebSite
                url="http://wevote.us/donate"
                target="_blank"
                body={<span>WeVote.US/donate</span>}
              />

              <strong>give what you can</strong>
              {" "}
              to help us reach more voters.
              Since we are a nonprofit, your donations make our work possible! Thank you.
              <br />
            </span>
          )}
          <br />

          <h3 className="h3">
            <OpenExternalWebSite
              url="https://help.wevote.us/hc/en-us/categories/115000098688-Using-We-Vote"
              target="_blank"
              className="open-web-site open-web-site__no-left-padding"
              body={(
                <span>
                  Visit our help center for answers to common questions.&nbsp;
                  <i className="fa fa-external-link" />
                </span>
              )}
            />
          </h3>
          <span className="terms-and-privacy">
            <br />
            <Link to="/more/terms">Terms of Service</Link>
            &nbsp;&nbsp;&nbsp;
            <Link to="/more/privacy">Privacy Policy</Link>
          </span>
          <br />
          <br />
        </div>
      </div>
    );
  }
}
