import React, { Component } from "react";
import { browserHistory } from "react-router";
import Helmet from "react-helmet";
import { Button, FormGroup, Row} from "react-bootstrap";


export default class Intro extends Component {
  static propTypes = {
  };

  constructor (props) {
    super(props);
    this.state = {
    };
  }

  static getProps () {
    return {};
  }

  componentDidMount () {
  }

  goToGetStarted () {
    var getStartedNow = "/intro/sample_ballot";
    browserHistory.push(getStartedNow);
  }

  render () {

    return <div className="welcome-page">
      <Helmet title="Welcome to We Vote" />
      <section className="hero-section">
        <div className="container">
          <Row>
            <div className="col-md-11 push-md-1">
              <h1 className="u-f1 u-bold u-stack--lg">
                View your ballot.<br />
                Learn from friends.<br />
                Share your vision.
              </h1>

              <h2 className="u-f3 u-stack--md">Launching Fall 2017!</h2>
              <p>Sign up for updates and be the first to use We Vote</p>

              <form className="form-inline">
                <FormGroup className="u-inline--sm">
                  <label className="sr-only" htmlFor="name">Name</label>
                  <input className="form-control" type="text" name="name" id="" placeholder="Name" />
                </FormGroup>
                <FormGroup className="u-inline--sm">
                  <label className="sr-only" htmlFor="exampleEmail">Email</label>
                  <input className="form-control" type="email" name="email" id="" placeholder="Email Address" />
                </FormGroup>
                <Button bsStyle="danger" type="submit">Sign Up</Button>
              </form>
            </div>
          </Row>
        </div>
      </section>

      <section className="features-section">
        <div className="container">
          <Row className="u-stack--lg">
            <div className="col-sm-6 col-md-4 u-flex u-justify-center">
              <div className="features__block">
                <img className="features__image" src="/img/welcome/benefits/view-your-ballot.png" width="50%" height="50%" />
                <h3 className="features__text">View Your Ballot</h3>
              </div>
            </div>
            <div className="col-sm-6 col-md-4 u-flex u-justify-center">
              <div className="features__block">
                <img className="features__image" src="/img/welcome/benefits/learn-from-orgs.png" width="50%" height="50%" />
                <h3 className="features__text">Learn from Organizations</h3>
              </div>
            </div>
            <div className="col-sm-6 col-md-4 u-flex u-justify-center">
              <div className="features__block">
                <img className="features__image" src="/img/welcome/benefits/see-position.png" width="50%" height="50%" />
                <h3 className="features__text">See your Network's Positions</h3>
              </div>
            </div>
            <div className="col-sm-6 col-md-4 u-flex u-justify-center">
              <div className="features__block">
                <img className="features__image" src="/img/welcome/benefits/choose-friends.png" width="50%" height="50%" />
                <h3 className="features__text">Invite Friends to your Network</h3>
              </div>
            </div>
            <div className="col-sm-6 col-md-4 u-flex u-justify-center">
              <div className="features__block">
                <img className="features__image" src="/img/welcome/benefits/share-vision.png" width="50%" height="50%" />
                <h3 className="features__text">Share Your Vision</h3>
              </div>
            </div>
            <div className="col-sm-6 col-md-4 u-flex u-justify-center">
              <div className="features__block">
                <img className="features__image" src="/img/welcome/benefits/decide.png" width="50%" height="50%" />
                <h3 className="features__text">Decide & Vote</h3>
              </div>
            </div>
          </Row>

          <Button bsStyle="danger" bsSize="large" className="u-stack--md center-block" onClick={this.goToGetStarted}>Get Started</Button>
        </div>

      </section>

      <section className="network-section">
        <div className="container">
          <h2 className="h2">Our Network</h2>
        </div>
      </section>

      <section className="footer-section">
        <div className="container">
          <h3 className="u-f3 u-stack--lg">Share or Donate to help us reach more voters.</h3>
          <div className="u-stack--xl">
            <button className="btn btn-social btn-facebook u-inline--sm">
              <span className="fa fa-facebook" /> Facebook
            </button>
            <button className="btn btn-social btn-twitter u-inline--sm">
              <span className="fa fa-twitter" /> Twitter
            </button>
            <button className="btn btn-social btn--email u-inline--sm">
              <span className="fa fa-envelope" /> Email
            </button>
            <button className="btn btn-social btn-danger u-inline--sm">
              <span className="fa fa-heart" /> Donate
            </button>
          </div>

          <div className="u-f--small">
            <p>
              WeVote.US is brought to you be registered 501(c)(3) and 501(c)(4) nonprofit organizations.<br />
              We do not support or oppose any political candidate or party. The software that powers We Vote is open source.
            </p>
          </div>

        </div>
      </section>


    </div>;
  }
}
