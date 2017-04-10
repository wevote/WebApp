import React, {Component} from "react";
import Helmet from "react-helmet";
import {Link} from "react-router";
import PositionPublicToggle from "../../components/Widgets/PositionPublicToggle";

export default class HowToUse extends Component {
  constructor (props) {
    super(props);
  }

  static getProps () {
    return {};
  }

  render () {
    let supportProps = { is_public_position: false };
    return <div>
      <Helmet title="Using We Vote"/>
      <div className="container-fluid card">
        <h1 className="h1">Using We Vote</h1>

        <br />
        <div className="Our-Story">
          <strong>What is We Vote?</strong><br />
          We Vote is the place to find your network's opinions on candidates and propositions before you vote, and share
          what you believe:
          <ul>
            <li>
              follow the <strong>voter guides</strong> of trusted groups and thought leaders
            </li>
            <li>
              see voting recommendations <strong>all the way down your ballot</strong>
            </li>
            <li>
              easily <strong>create your own voter guide</strong>, showing candidates and propositions you support
            </li>
            <li>
              discuss your views <strong>with friends</strong>
            </li>
          </ul>

          <strong>What about privacy?</strong><br />
          When you support or oppose a ballot item, your position is friends-only
          by default. Use the privacy button (sample below) to switch your views to public, or back to private.
          <PositionPublicToggle ballot_item_we_vote_id="null"
                                className="null"
                                type="MEASURE"
                                supportProps={supportProps}
          />

          <h3 className="h3"><a href="https://help.wevote.us/hc/en-us/categories/115000098688-Using-We-Vote" target="_blank">Visit our help center for answers to more common questions.&nbsp;<i
            className="fa fa-external-link"/></a></h3>
          <span className="terms-and-privacy">
            <br />
            <Link to="/more/terms">Terms of Service</Link>&nbsp;&nbsp;&nbsp;<Link to="/more/privacy">Privacy Policy</Link>
          </span>
          <br />
          <br />
        </div>
      </div>
    </div>;
  }
}
