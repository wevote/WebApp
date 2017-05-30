import React, { Component } from "react";
import { browserHistory } from "react-router";
import Helmet from "react-helmet";
import { Button, FormGroup, Row} from "react-bootstrap";
import VoterActions from "../actions/VoterActions";
import VoterConstants from "../constants/VoterConstants";
import VoterStore from "../stores/VoterStore";


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

  render () {
    let newsletter_opt_in_true = VoterStore.getNotificationSettingsFlagState(VoterConstants.NOTIFICATION_NEWSLETTER_OPT_IN);
    let actual_full_name = "";
    if (this.state.voter) {
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
                  <h1 className="u-f1 u-bold u-stack--lg">
                    Welcome Back{ actual_full_name ? ", " + actual_full_name : ""}.
                  </h1>
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
            <div className="col-sm-6 col-md-4 u-flex u-justify-center">
              <div className="features__block">
                <img className="features__image" src="/img/welcome/benefits/view-your-ballot.png" width="50%" height="50%" />
                <h3 className="features__text">View Your Ballot</h3>
              </div>
            </div>
            <div className="col-sm-6 col-md-4 u-flex u-justify-center">
              <div className="features__block">
                <img className="features__image" src="/img/welcome/benefits/learn-from-orgs.png" width="50%" height="50%" />
                <h3 className="features__text">Learn From Organizations</h3>
              </div>
            </div>
            <div className="col-sm-6 col-md-4 u-flex u-justify-center">
              <div className="features__block">
                <img className="features__image" src="/img/welcome/benefits/see-position.png" width="50%" height="50%" />
                <h3 className="features__text">See Your Network's Positions</h3>
              </div>
            </div>
            <div className="col-sm-6 col-md-4 u-flex u-justify-center">
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
          <h2 className="h2">Our Network</h2>
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
          {/* <h3 className="u-f3 u-stack--lg">Share or Donate to help us reach more voters.</h3>
          <div className="u-stack--xl">
            <button className="btn btn-social btn-facebook u-push--sm">
              <span className="fa fa-facebook" /> Facebook
            </button>
            <button className="btn btn-social btn-twitter u-push--sm">
              <span className="fa fa-twitter" /> Twitter
            </button>
            <button className="btn btn-social btn--email u-push--sm">
              <span className="fa fa-envelope" /> Email
            </button>
            <button className="btn btn-social btn-danger u-push--sm">
              <span className="fa fa-heart" /> Donate
            </button>
          </div> */}

          <div className="u-f--small">
            <p>
              WeVote.US is brought to you by a partnership between two registered nonprofit organizations, one 501(c)(3) and one 501(c)(4).<br />
              We do not support or oppose any political candidate or party. <a href="https://github.com/WeVote" target="_blank">&nbsp;</a>The software that powers We Vote is open source and built by volunteers.
            </p>
          </div>

        </div>
      </section>


    </div>;
  }
}
