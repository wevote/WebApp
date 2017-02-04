import React, {Component} from "react";
import {browserHistory} from "react-router";
import Helmet from "react-helmet";

export default class SampleBallot extends Component {

  constructor (props) {
    super(props);
    this.state = {};
  }

 goToBallotLink () {
    var goToBallot = "/ballot";
    browserHistory.push(goToBallot);
  }

  componentWillMount () {
    document.body.style.backgroundColor = "#A3A3A3";
    document.body.className = "story-view";
  }

  componentWillUnmount () {
    document.body.style.backgroundColor = null;
    document.body.className = "";
  }

  render () {

    return <div className="intro-story intro-story__background background--image3">
      <Helmet title="See Your Ballot - We Vote" />
      <div className="intro-story__h1--alt">See Your Ballot</div>
      <div ref="header2" className="intro-story__h2">On the next screen, you'll see<br />
       your ballot from the 2016 <br />
        General Election.
      </div>
      <div ref="header2" className="intro-story__h2 intro-story__padding-top">Get ready for the next election<br />
        now by following voter guides<br />
        and inviting your friends.
      </div>
      <div className="intro-story__padding">
        <button type="button" className="btn btn-lg btn-success" onClick={this.goToBallotLink}>Go to Your Ballot</button>
      </div>
      <div className="intro-story__padding-top">Stay tuned for 2017-2018 election data!</div>
    </div>;
  }
}
