import React, { Component } from "react";
import { browserHistory, Link } from "react-router";
import Helmet from "react-helmet";
import { Button, FormGroup, Row} from "react-bootstrap";
import VoterActions from "../actions/VoterActions";
import VoterConstants from "../constants/VoterConstants";
import VoterStore from "../stores/VoterStore";

const web_app_config = require("../config");

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
    this._onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this._onVoterStoreChange.bind(this));
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
  }

  _onVoterStoreChange () {
    this.setState({voter: VoterStore.getVoter()});
  }

  goToGetStarted () {
    var getStartedNow = "/intro/sample_ballot";
    browserHistory.push(getStartedNow);
  }

  updateVoterFullName (event) {
    this.setState({
      voter_full_name: event.target.value
    });
  }

  updateVoterEmailAddress (event) {
    this.setState({
      voter_email_address: event.target.value
    });
  }

  voterEmailAddressSignUpSave (event) {
    event.preventDefault();
    let send_link_to_sign_in = true;
    VoterActions.voterEmailAddressSave(this.state.voter_email_address, send_link_to_sign_in);
    VoterActions.voterFullNameSoftSave("", "", this.state.voter_full_name);
    VoterActions.voterUpdateNotificationSettingsFlags(VoterConstants.NOTIFICATION_NEWSLETTER_OPT_IN);
    this.setState({loading: true});
  }

  shareToFacebookButton () {
      window.FB.ui({
        display: "popup",
        redirect_uri: web_app_config.WE_VOTE_HOSTNAME + "/welcome",
        method: "share",
        mobile_iframe: true,
        href: web_app_config.WE_VOTE_HOSTNAME,
        quote: "Check out https://WeVote.US! View your ballot. Learn from friends. Share your vision. @WeVote #Voting #WeVote",
      }, function (response) {
        if ( response === undefined || response.error_code === 4201 ) {
          console.log("User Canceled the share request");
        } else if ( response ) {
          //console.log("Successfully Shared", response);
        }
      });
  }

  shareToTwitterButton () {
    let url = "https://twitter.com/share?text=Check%20out%20https%3A%2F%2FWeVote.Us%2F!%20View%20you%20ballot.%20Learn%20from%20friends.%20Share%20your%20vision.%20@WeVote&hashtags=Voting,WeVote";
    let title = "Share On Twitter";
    let w = 600;
    let h = 600;
    var left = (screen.width / 2) - (w / 2);
    var top = (screen.height / 2) - (h / 2);
    return window.open(url, title, 'toolbar=no, width=' + w + ', height=' + h + ', top=' + top + ' left=' + left);
  }

  shareToEmailButton () {
    let subject = "Check out WeVote https://WeVote.US!";
    let body = "Check out https://WeVote.US! View your ballot. Learn from friends. Share your vision. @WeVote #Voting #WeVote";
    var link = "mailto:" + "&subject=" + subject + "&body=" + body;
    window.location.href = link;
  }

  render () {
    let newsletter_opt_in_true = VoterStore.getNotificationSettingsFlagState(VoterConstants.NOTIFICATION_NEWSLETTER_OPT_IN);
    let actual_full_name = "";
    let voter_signed_in = false;
    if (this.state.voter) {
      voter_signed_in = true;
      if (this.state.voter.first_name || this.state.voter.last_name) {
        actual_full_name = this.state.voter.full_name;
      }
    }

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
              { newsletter_opt_in_true ?
                <span>
                    { voter_signed_in ?
                      <h1 className="u-f1 u-bold u-stack--lg">{ actual_full_name ?
                        "Welcome Back, " + actual_full_name + "." :
                        <Button bsStyle="danger" bsSize="large" className="u-stack--md center-block" onClick={this.goToGetStarted}>
                          Get Started
                        </Button>
                      }</h1> :
                      <h1 className="u-f1 u-bold u-stack--lg">Your request to sign up has been sent.</h1>
                    }
                </span> :
                <div>
                  <p>Sign up for updates and be the first to use We Vote</p>

                  <form className="form-inline" onSubmit={this.voterEmailAddressSignUpSave.bind(this)}>
                    <FormGroup className="u-push--sm">
                      <label className="sr-only" htmlFor="name">Name</label>
                      <input className="form-control"
                             type="text"
                             name="voter_full_name"
                             id=""
                             value={this.state.voter_full_name}
                             onChange={this.updateVoterFullName.bind(this)}
                             placeholder="Name"/>
                    </FormGroup>
                    <FormGroup className="u-push--sm">
                      <label className="sr-only" htmlFor="exampleEmail">Email</label>
                      <input className="form-control"
                             type="email"
                             name="voter_email_address"
                             id=""
                             value={this.state.voter_email_address}
                             onChange={this.updateVoterEmailAddress.bind(this)}
                             placeholder="Email Address"/>
                    </FormGroup>
                    <Button bsStyle="danger"
                            type="submit"
                            onClick={this.voterEmailAddressSignUpSave.bind(this)}
                            >Sign Up</Button>
                  </form>
                </div>
              }
            </div>
          </Row>
        </div>
      </section>

      <section className="features-section">
        <div className="container">
          <Row className="u-stack--lg">
            <div className="col-6 col-md-4 u-flex u-justify-center">
              <div className="features__block">
                <img className="features__image" src="/img/welcome/benefits/view-your-ballot.png" width="50%" height="50%" />
                <h3 className="features__text">View Your Ballot</h3>
              </div>
            </div>
            <div className="col-6 col-md-4 u-flex u-justify-center">
              <div className="features__block">
                <img className="features__image" src="/img/welcome/benefits/learn-from-orgs.png" width="50%" height="50%" />
                <h3 className="features__text">Learn From Organizations</h3>
              </div>
            </div>
            <div className="col-6 col-md-4 u-flex u-justify-center">
              <div className="features__block">
                <img className="features__image" src="/img/welcome/benefits/see-position.png" width="50%" height="50%" />
                <h3 className="features__text">See Your Network's Positions</h3>
              </div>
            </div>
            <div className="col-6 col-md-4 u-flex u-justify-center">
              <div className="features__block">
                <img className="features__image" src="/img/welcome/benefits/choose-friends.png" width="50%" height="50%" />
                <h3 className="features__text">Invite Friends to Your We&nbsp;Vote Network</h3>
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
          <h2 className="u-f2 u-stack--lg">Our Network</h2>
          <div className="partner-logos">
              <img className="partner-logo u-push--lg u-stack--lg" src="/img/welcome/partners/google-logo.svg" alt="Google" width="150" />
              <img className="partner-logo u-push--lg u-stack--lg" src="/img/welcome/partners/center-for-technology.png" alt="Center for Technology and Civic Life" width="200" />
              <img className="partner-logo u-push--lg u-stack--lg" src="/img/welcome/partners/vote-org.png" alt="Vote.org" width="169" />
              <img className="partner-logo u-push--lg u-stack--lg" src="/img/welcome/partners/voting-information-project.png" alt="Voting Information Project" width="193" />
          </div>
        </div>
      </section>

      <section className="footer-section">
        <div className="container">
          <h3 className="u-f3 u-stack--lg">Please share or donate to help us reach more voters.</h3>
          <div className="u-stack--xl">
            <Button className="btn btn-social btn-facebook u-push--sm"
                bsStyle="danger"
                type="submit"
                onClick={this.shareToFacebookButton}>
              <span className="fa fa-facebook" /> Facebook
            </Button>
            <Button className="btn btn-social btn-twitter u-push--sm"
                bsStyle="danger"
                onClick={this.shareToTwitterButton}>
              <span className="fa fa-twitter" /> Twitter
            </Button>
            <Button className="btn btn-social btn--email u-push--sm"
                bsStyle="danger"
                onClick={this.shareToEmailButton}>
              <span className="fa fa-envelope" /> Email
            </Button>
            <Link to="/more/donate">
              <button className="btn btn-social btn-danger u-push--sm">
                <span className="fa fa-heart" /> Donate
              </button>
            </Link>
          </div>


          <ul className="footer-nav u-f4 list-unstyled list-inline u-stack--xl">
            <li className="u-push--md u-stack--lg">
              <Link to={"/more/about"}>About</Link>
            </li>
              <li className="u-push--md u-stack--lg">
                <Link to={"/more/vision"}>Our Vision</Link>
              </li>
            <li className="u-push--md u-stack--lg">
              <Link to={"/more/team"}>Our Team</Link>
            </li>
            <li className="u-push--md u-stack--lg">
              <Link to={"/intro/sample_ballot"}>Get Started</Link>
            </li>
            <li className="u-push--md u-stack--lg">
              <Link to={"/more/sign_in"}>Sign In</Link>
            </li>
          </ul>


          <div className="u-f--small u-stack--lg">
            <p>
              WeVote.US is brought to you by a partnership between two registered nonprofit organizations, one <nobr>501(c)(3)</nobr> and one <nobr>501(c)(4)</nobr>.
            </p>
            <p>
              We do not support or oppose any political candidate or party. <a href="https://github.com/WeVote" target="_blank">The software that powers We Vote is open source and built by volunteers.</a>
            </p>
          </div>

          <ul className="u-tc list-unstyled list-inline">
            <li className="u-push--lg">
              <Link to="/more/privacy">Privacy Policy</Link>
            </li>
            <li className="u-push--lg">
              <Link to="/more/terms">Terms of Use</Link>
            </li>
            <li>
              <a href="https://help.wevote.us/hc/en-us/requests/new" target="_blank">Contact</a>
            </li>
          </ul>

        </div>
      </section>
    </div>;
  }
}
