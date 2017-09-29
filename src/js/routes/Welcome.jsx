import React, { Component, PropTypes } from "react";
import { browserHistory, Link } from "react-router";
import cookies from "../utils/cookies";
import Helmet from "react-helmet";
import { Button, FormGroup, Row, OverlayTrigger, Tooltip } from "react-bootstrap";
import AnalyticsActions from "../actions/AnalyticsActions";
import { validateEmail } from "../utils/email-functions";
import FacebookStore from "../stores/FacebookStore";
import FacebookActions from "../actions/FacebookActions";
import VoterActions from "../actions/VoterActions";
import VoterConstants from "../constants/VoterConstants";
import VoterStore from "../stores/VoterStore";

const web_app_config = require("../config");

export default class Intro extends Component {
  static propTypes = {
    location: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.state = {
      newsletter_opt_in_true: false,
      voter: {},
      is_verification_email_sent: false,
      show_features_ballot: false,
      show_features_organizations: false,
      show_features_positions: false,
      show_features_network: false,
      show_features_vision: false,
      show_features_vote: false,
      facebook_friends_image_width: 60,
      facebook_friends_image_height: 60,
      maximum_friends_display: 5,
      facebook_friends_using_we_vote_list: FacebookStore.facebookFriendsUsingWeVoteList(),
      submit_enabled: false,
      voter_email_address: "",
      voter_full_name: "",
    };

    this._toggleBallotFeature = this._toggleBallotFeature.bind(this);
    this._toggleOrganizationsFeature = this._toggleOrganizationsFeature.bind(this);
    this._togglePositionsFeature = this._togglePositionsFeature.bind(this);
    this._toggleNetworkFeature = this._toggleNetworkFeature.bind(this);
    this._toggleVisionFeature = this._toggleVisionFeature.bind(this);
    this._toggleVoteFeature = this._toggleVoteFeature.bind(this);
  }

  static getProps () {
    return {};
  }

  componentDidMount () {
    this._onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this._onVoterStoreChange.bind(this));
    AnalyticsActions.saveActionWelcomeVisit(VoterStore.election_id());
    FacebookActions.facebookFriendsAction();
    this._onFacebookStoreChange();
    this.facebookStoreListener = FacebookStore.addListener(this._onFacebookStoreChange.bind(this));
    let we_vote_branding_off_from_url = this.props.location.query ? this.props.location.query.we_vote_branding_off : 0;
    let we_vote_branding_off_from_cookie = cookies.getItem("we_vote_branding_off");
    this.setState({
      we_vote_branding_off: we_vote_branding_off_from_url || we_vote_branding_off_from_cookie,
    });

  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
    this.facebookStoreListener.remove();
  }

  _toggleBallotFeature () {
    this.setState({ show_features_ballot: !this.state.show_features_ballot });
  }

  _toggleOrganizationsFeature () {
    this.setState({ show_features_organizations: !this.state.show_features_organizations });
  }

  _togglePositionsFeature () {
    this.setState({ show_features_positions: !this.state.show_features_positions });
  }

  _toggleNetworkFeature () {
    this.setState({ show_features_network: !this.state.show_features_network });
  }

  _toggleVisionFeature () {
    this.setState({ show_features_vision: !this.state.show_features_vision });
  }

  _toggleVoteFeature () {
    this.setState({ show_features_vote: !this.state.show_features_vote });
  }

  _onVoterStoreChange () {
    // console.log("is_verification_email_sent:  " + VoterStore.isVerificationEmailSent());
    this.setState({
      newsletter_opt_in_true: VoterStore.getNotificationSettingsFlagState(VoterConstants.NOTIFICATION_NEWSLETTER_OPT_IN),
      // is_verification_email_sent: VoterStore.isVerificationEmailSent(),
      voter: VoterStore.getVoter(),
    });
  }

  _onFacebookStoreChange () {
    this.setState({
      facebook_friends_using_we_vote_list: FacebookStore.facebookFriendsUsingWeVoteList(),
    });
  }

  goToGetStarted () {
    var getStartedNow = "/ballot";
    browserHistory.push(getStartedNow);
  }

  updateVoterFullName (event) {
    this.setState({
      voter_full_name: event.target.value
    });
  }

  updateVoterEmailAddress (event) {
    let is_email_valid = validateEmail(event.target.value);
    let submit_enabled = false;
    if (is_email_valid) {
      submit_enabled = true;
    }
    this.setState({
      voter_email_address: event.target.value,
      submit_enabled: submit_enabled,
    });
  }

  voterEmailAddressSignUpSave (event) {
    // Only proceed after we have a valid email address, which will enable the submit
    if (this.state.submit_enabled) {
      event.preventDefault();
      let send_link_to_sign_in = true;
      VoterActions.voterEmailAddressSave(this.state.voter_email_address, send_link_to_sign_in);
      VoterActions.voterFullNameSoftSave("", "", this.state.voter_full_name);
      VoterActions.voterUpdateNotificationSettingsFlags(VoterConstants.NOTIFICATION_NEWSLETTER_OPT_IN);
      this.setState({loading: true});
    }
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
          console.log("Voter Canceled the share request");
        } else if ( response ) {
          //console.log("Successfully Shared", response);
        }
      });
  }

  shareToTwitterButton () {
    let url = "https://twitter.com/share?url=https%3A%2F%2FWeVote.US%2F%20&text=Check%20out%20https%3A%2F%2FWeVote.US%2F!%20View%20your%20ballot.%20Learn%20from%20friends.%20Share%20your%20vision.%20@WeVote&hashtags=Voting,WeVote";
    let title = "Share On Twitter";
    let default_width = 600;
    let default_height = 600;
    let half_screen_width = screen.width / 2;
    let half_default_width = default_width / 2;
    let half_screen_height = screen.height / 2;
    let half_default_height = default_height / 2;
    var left = half_screen_width - half_default_width;
    var top = half_screen_height - half_default_height;
    return window.open(url, title, "toolbar=no, width=" + default_width + ", height=" + default_height + ", top=" + top + " left=" + left);
  }

  render () {
    let actual_full_name = "";
    let voter_signed_in = false;
    let mailto_url = "mailto:" + "?subject=Check out We Vote" + "&body=I am using We Vote to discuss what is on my ballot. You can see it at https://WeVote.US too.";
    if (this.state.voter) {
      voter_signed_in = this.state.voter.is_signed_in;
      if (this.state.voter.first_name || this.state.voter.last_name) {
        actual_full_name = this.state.voter.full_name;
        if (actual_full_name.startsWith("voter")) {
          actual_full_name = "";
        }
      }
    }

    let local_counter = 0;
    const facebook_friends_using_we_vote_list_for_display = this.state.facebook_friends_using_we_vote_list.map( (friend) => {
      local_counter++;
      if (friend.facebook_profile_image_url_https && local_counter <= this.state.maximum_friends_display) {
        const friendName = friend.facebook_user_name ? <Tooltip id="tooltip">{friend.facebook_user_name}</Tooltip> : <span />;
        return <OverlayTrigger key={friend.facebook_user_id} placement="bottom" overlay={friendName} >
            <img className="friends-list__welcome-image"
              src={friend.facebook_profile_image_url_https}
              height={this.state.facebook_friends_image_height}
              width={this.state.facebook_friends_image_width} />
          </OverlayTrigger>;
      } else {
        return null;
      }
      });

    // && this.state.is_verification_email_sent ?
    return <div className="welcome-page">
      <Helmet title="Welcome to We Vote" />
      <section className="hero-section-container">
        <div className="hero-section">
          <div className="container">
            <Row>
              <div className="col-md-12">
                <Row className="visible-xs">
                  <h1 className="col-sm-12 u-f1 u-bold u-stack--lg">
                    View your ballot.<br />
                    Learn from friends.<br />
                    { this.state.facebook_friends_using_we_vote_list.length ?
                      <div className="u-flex-row friends-list__welcome">
                        { facebook_friends_using_we_vote_list_for_display }
                      </div> :
                      null
                    }
                    Share your vision.
                  </h1>
                </Row>
                <Row className="hidden-xs">
                  <h1 className="col-md-6 u-f1 u-bold u-stack--lg">
                    View your ballot.<br />
                    Learn from friends.
                    { this.state.facebook_friends_using_we_vote_list.length ?
                      <div className="u-flex-row friends-list__welcome">
                        { facebook_friends_using_we_vote_list_for_display }
                      </div> :
                      null
                    }
                  </h1>
                  <h1 className="col-md-6 u-f1 u-bold u-stack--lg">
                    Share your vision.
                  </h1>
                </Row>
              </div>
            </Row>
          </div>
        </div>
      </section>

      <section className="quick-links-section u-flex">
        <a className="quick-links__button quick-links__button-left" onClick={() => browserHistory.push("/ballot")}>Get Started</a>
        <a className="quick-links__button quick-links__button-right" onClick={() => browserHistory.push("/voterguidegetstarted")}>Create Voter Guide</a>
      </section>

      { voter_signed_in ?
        null :
        <section className="form-section">
          <div className="container">
            <Row>
              <div className="col-md-12">
                { this.state.we_vote_branding_off ? null :
                  <span>
                    { this.state.newsletter_opt_in_true ?
                      <h1 className="u-f1 u-bold u-stack--lg">Please check your email for a verification link.</h1> :
                      <div className="form-container">
                        <h2 className="form-header">Sign up for updates and be the first to use We Vote.</h2>

                        <form className="row form-inline" onSubmit={this.voterEmailAddressSignUpSave.bind(this)}>
                          <FormGroup className="col-md-4">
                            <label className="sr-only" htmlFor="name">Name</label>
                            <input className="form-control"
                                   type="text"
                                   name="voter_full_name"
                                   id=""
                                   value={this.state.voter_full_name}
                                   onChange={this.updateVoterFullName.bind(this)}
                                   placeholder="Name"/>
                          </FormGroup>
                          <FormGroup className="col-md-4">
                            <label className="sr-only" htmlFor="exampleEmail">Email</label>
                            <input className="form-control"
                                   type="email"
                                   name="voter_email_address"
                                   id=""
                                   value={this.state.voter_email_address}
                                   onChange={this.updateVoterEmailAddress.bind(this)}
                                   placeholder="Email Address"/>
                          </FormGroup>
                          <FormGroup className="col-md-4">
                            {this.state.submit_enabled ?
                              <Button className="form-control"
                                      bsStyle="success"
                                      type="submit"
                                      onClick={this.voterEmailAddressSignUpSave.bind(this)}
                              >Sign Up</Button> :
                              <Button className="form-control form-button-disabled"
                                      bsStyle="success"
                                      type="submit"
                                      disabled
                                      onClick={this.voterEmailAddressSignUpSave.bind(this)}
                              >Enter Your Email to Sign Up</Button>
                            }
                          </FormGroup>
                        </form>
                      </div>
                    }
                  </span>
                }
              </div>
            </Row>
          </div>
        </section>
      }

      <section className="features-section">
        <div className="container">
          <div className="features-your-mission__block">
            <div className="h1 u-bold">Your Mission:<br /><span className="h2">Make the world a better place.</span></div>
          </div>
          <Row className="u-stack--lg">
            <div className="col-6 col-md-4 u-flex u-justify-center features__block-container">
              <div className="features__block" onClick={this._toggleBallotFeature}>
                <img className={ this.state.show_features_ballot ? "hidden-xs features__image" : "features__image" } src="/img/welcome/benefits/view-your-ballot.png" width="25%" />
                <h3 className="features__h3">View Your Ballot</h3>
                <p className={ this.state.show_features_ballot ? "features__p" : "features__p hidden-xs" }>See your actual ballot, including candidates and measures.</p>
              </div>
            </div>
            <div className="col-6 col-md-4 u-flex u-justify-center features__block-container">
              <div className="features__block" onClick={this._toggleOrganizationsFeature}>
                <img className={ this.state.show_features_organizations ? "hidden-xs features__image" : "features__image" } src="/img/welcome/benefits/learn-from-orgs.png" width="50%" />
                <h3 className="features__h3">Learn From Organizations</h3>
                <p className={ this.state.show_features_organizations ? "features__p" : "features__p hidden-xs" }>Follow the voter guides of groups you trust. See what they support or oppose.</p>
              </div>
            </div>
            <div className="col-6 col-md-4 u-flex u-justify-center features__block-container">
              <div className="features__block" onClick={this._togglePositionsFeature}>
                <img className={ this.state.show_features_positions ? "hidden-xs features__image" : "features__image" } src="/img/welcome/benefits/see-position.png" />
                <h3 className="features__h3">See Your Network's Positions</h3>
                <p className={ this.state.show_features_positions ? "features__p" : "features__p hidden-xs" }>See how many in your network support or oppose each candidate or measure.</p>
              </div>
            </div>
            <div className="col-6 col-md-4 u-flex u-justify-center features__block-container">
              <div className="features__block" onClick={this._toggleNetworkFeature}>
                <img className={ this.state.show_features_network ? "hidden-xs features__image" : "features__image" } src="/img/welcome/benefits/choose-friends.png" width="50%" />
                <h3 className="features__h3">Invite Friends to Your We Vote Network</h3>
                <p className={ this.state.show_features_network ? "features__p" : "features__p hidden-xs" }>Talk politics with friends who share your values. Avoid flame wars!</p>
              </div>
            </div>
            <div className="col-sm-6 col-md-4 u-flex u-justify-center features__block-container">
              <div className="features__block" onClick={this._toggleVisionFeature}>
                <img className={ this.state.show_features_vision ? "hidden-xs features__image" : "features__image" } src="/img/welcome/benefits/share-vision.png" width="50%" />
                <h3 className="features__h3">Share Your Vision</h3>
                <p className={ this.state.show_features_vision ? "features__p" : "features__p hidden-xs" }>Empower other voters with what you've learned. Help your friends.</p>
              </div>
            </div>
            <div className="col-sm-6 col-md-4 u-flex u-justify-center features__block-container">
              <div className="features__block" onClick={this._toggleVoteFeature}>
                <img className={ this.state.show_features_vote ? "hidden-xs features__image" : "features__image" } src="/img/welcome/benefits/decide.png" width="50%" />
                <h3 className="features__h3">Decide & Vote</h3>
                <p className={ this.state.show_features_vote ? "features__p" : "features__p hidden-xs" }>Cast your vote with confidence after using We Vote.</p>
              </div>
            </div>
          </Row>

          <Button bsStyle="danger" bsSize="large" className="u-stack--md center-block" onClick={this.goToGetStarted}>Get Started</Button>
        </div>

      </section>
      { this.state.we_vote_branding_off ? null :
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
      }

      <section className="footer-section">
        <div className="container">
          { this.state.we_vote_branding_off ? null :
            <span>
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
                <a href={mailto_url} title="Submit this to Email">
                  <button className="btn btn-social btn--email u-push--sm">
                    <span className="fa fa-envelope" />Email
                  </button>
                </a>
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
                <li className="u-push--md u-stack--lg">
                  <Link to={"/more/tools"}>Tools For Your Website</Link>
                </li>
              </ul>
            </span>
          }

          <div className="u-f--small u-stack--lg">
            <p>
              WeVote.US is brought to you by a partnership between two registered nonprofit organizations,
               one <span className="u-no-break">501(c)(3)</span> and one <span className="u-no-break">501(c)(4)</span>.
               We do not support or oppose any political candidate or party.
            </p>
            <p>
              <a href="https://github.com/WeVote" target="_blank">The software that powers We Vote is open source and built by volunteers.</a>
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
