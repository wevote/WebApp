import React, { Component } from "react";
import cookies from "../../utils/cookies";
import { historyPush, isCordova } from "../../utils/cordovaUtils";
import Helmet from "react-helmet";
import { renderLog } from "../../utils/logging";

export default class IntroNetworkBallotIsNext extends Component {

  constructor (props) {
    super(props);
    this.state = {};
  }

  static goToBallotLink () {
    const goToBallot = "/ballot";
    historyPush(goToBallot);
  }

  componentWillMount () {
    document.body.style.backgroundColor = "#A3A3A3";
    document.body.className = "story-view";
    cookies.setItem("show_full_navigation", "1", Infinity, "/");
  }

  componentWillUnmount () {
    document.body.style.backgroundColor = null;
    document.body.className = "";
  }

  render () {
    renderLog(__filename);
    return <div className="intro-story intro-story__background background--image3"
                style={isCordova() ? { backgroundImage: "url(./img/global/intro-story/slide3-historic-place-698x600.jpg)" } : null} >
      <Helmet title="See Your Ballot - We Vote" />
      <div className="intro-story__h1--alt">We Vote</div>
      <div ref="header2" className="intro-story__h2 intro-story__padding-top">
        Ready to <strong>vote your values</strong>?<br />
        Research what's on your ballot<br />
        and invite your friends.
      </div>
      <div ref="header2" className="intro-story__h2">On the next screen, you'll see<br />
       the next election<br />
       in your area.
      </div>
      <div><br /></div>
      <div className="intro-story__padding">
        <button type="button"
                className="btn btn-lg btn-success"
                onClick={IntroNetworkBallotIsNext.goToBallotLink}>Go to Your Ballot&nbsp;&nbsp;&gt;</button>
      </div>
      <div className="intro-story__padding-top">{/* Stay tuned for the latest election data! */}</div>
    </div>;
  }
}
