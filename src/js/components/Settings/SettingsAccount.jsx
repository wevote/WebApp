import React, { Component } from "react";
import { Button } from "react-bootstrap";
import Helmet from "react-helmet";
import AnalyticsActions from "../../actions/AnalyticsActions";
import BrowserPushMessage from "../Widgets/BrowserPushMessage";
import FacebookActions from "../../actions/FacebookActions";
import FacebookStore from "../../stores/FacebookStore";
import { historyPush } from "../../utils/cordovaUtils";
import FacebookSignIn from "../Facebook/FacebookSignIn";
import LoadingWheel from "../LoadingWheel";
import { oAuthLog, renderLog } from "../../utils/logging";
import TwitterActions from "../../actions/TwitterActions";
import TwitterSignIn from "../Twitter/TwitterSignIn";
import VoterActions from "../../actions/VoterActions";
import VoterEmailAddressEntry from "../VoterEmailAddressEntry";
import VoterSessionActions from "../../actions/VoterSessionActions";
import VoterStore from "../../stores/VoterStore";

const debugMode = false;

export default class SettingsAccount extends Component {
  constructor (props) {
    super(props);
    this.state = {
      facebookAuthResponse: {},
      showTwitterDisconnect: false,
    };
    this.toggleTwitterDisconnectClose = this.toggleTwitterDisconnectClose.bind(this);
    this.toggleTwitterDisconnectOpen = this.toggleTwitterDisconnectOpen.bind(this);
    this.voterSplitIntoTwoAccounts = this.voterSplitIntoTwoAccounts.bind(this);
  }

  // See https://reactjs.org/docs/error-boundaries.html
  static getDerivedStateFromError (error) { // eslint-disable-line no-unused-vars
    // Update state so the next render will show the fallback UI, We should have a "Oh snap" page
    return { hasError: true };
  }

  // Set up this component upon first entry
  // componentWillMount is used in WebApp
  componentDidMount () {
    // console.log("SignIn componentDidMount");
    this.onVoterStoreChange();
    this.facebookListener = FacebookStore.addListener(this.onFacebookChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    AnalyticsActions.saveActionAccountPage(VoterStore.election_id());
  }

  componentWillUnmount () {
    // console.log("SignIn ---- UN mount");
    this.facebookListener.remove();
    this.voterStoreListener.remove();
    this.timer = null;
  }

  onVoterStoreChange () {
    this.setState({ voter: VoterStore.getVoter() });
  }

  onFacebookChange () {
    this.setState({
      facebookAuthResponse: FacebookStore.getFacebookAuthResponse(),
    });
  }

  componentDidCatch (error, info) {
    // We should get this information to Splunk!
    console.error("SignIn caught error: ", `${error} with info: `, info);
  }

  facebookLogOutOnKeyDown (event) {
    const enterAndSpaceKeyCodes = [13, 32];
    if (enterAndSpaceKeyCodes.includes(event.keyCode)) {
      FacebookActions.appLogout();
    }
  }

  twitterLogOutOnKeyDown (event) {
    const enterAndSpaceKeyCodes = [13, 32];
    if (enterAndSpaceKeyCodes.includes(event.keyCode)) {
      TwitterActions.appLogout();
    }
  }

  toggleTwitterDisconnectOpen () {
    this.setState({ showTwitterDisconnect: true });
  }

  toggleTwitterDisconnectClose () {
    this.setState({ showTwitterDisconnect: false });
  }

  voterSplitIntoTwoAccounts () {
    VoterActions.voterSplitIntoTwoAccounts();
    this.setState({ showTwitterDisconnect: false });
  }

  render () {
    renderLog(__filename);
    if (!this.state.voter) {
      return LoadingWheel;
    }

    // console.log("SignIn.jsx this.state.facebookAuthResponse:", this.state.facebookAuthResponse);
    if (!this.state.voter.signed_in_facebook && this.state.facebookAuthResponse && this.state.facebookAuthResponse.facebook_retrieve_attempted) {
      oAuthLog("SignIn.jsx facebook_retrieve_attempted");
      historyPush("/facebook_sign_in");

      // return <span>SignIn.jsx facebook_retrieve_attempted</span>;
      return LoadingWheel;
    }

    let pageTitle = "Sign In - We Vote";
    let yourAccountTitle = "Your Account";
    let yourAccountExplanation = "";
    if (this.state.voter.is_signed_in) {
      pageTitle = "Your Account - We Vote";
      if (this.state.voter.signed_in_facebook && !this.state.voter.signed_in_twitter) {
        yourAccountTitle = "Have Twitter Too?";
        yourAccountExplanation = "By adding your Twitter account to your We Vote profile, you get access to the voter guides of everyone you follow.";
      } else if (this.state.voter.signed_in_twitter && !this.state.voter.signed_in_facebook) {
        yourAccountTitle = "Have Facebook Too?";
        yourAccountExplanation = "By adding Facebook to your We Vote profile, it is easier to invite friends.";
      }
    }

    return (
      <div className="">
        <Helmet title={pageTitle} />
        <BrowserPushMessage incomingProps={this.props} />
        <div className="card">
          <div className="card-main">
            {this.state.voter.signed_in_twitter && this.state.voter.signed_in_facebook ?
              null :
              <h1 className="h3">{this.state.voter.is_signed_in ? <span>{yourAccountTitle}</span> : null}</h1>
            }
            {this.state.voter.is_signed_in ?
              <div className="u-stack--sm">{yourAccountExplanation}</div> : (
                <div>
                  <div className="u-f3">Please sign in so you can share.</div>
                  <div className="u-stack--sm">Don&apos;t worry, we won&apos;t post anything automatically.</div>
                </div>
              )
            }
            {!this.state.voter.signed_in_twitter || !this.state.voter.signed_in_facebook ? (
              <div className="u-stack--md">
                { !this.state.voter.signed_in_twitter && (
                  <span>
                    <TwitterSignIn className="btn btn-social btn-lg btn-twitter" />
                  </span>
                )
                }
                { !this.state.voter.signed_in_twitter && !this.state.voter.signed_in_facebook && (
                  <span>
                    <span className="u-margin-left--sm" />
                  </span>
                )
                }
                { !this.state.voter.signed_in_facebook && (
                  <span>
                    <FacebookSignIn className="btn btn-social btn-lg btn-facebook" />
                  </span>
                )
                }
              </div>
            ) : null
            }
            {this.state.voter.is_signed_in ? (
              <div className="u-stack--md">
                <div className="u-stack--sm">
                  <span className="h3">Currently Signed In</span>
                  <span className="u-margin-left--sm" />
                  <span className="account-edit-action" onKeyDown={this.twitterLogOutOnKeyDown.bind(this)}>
                    <span className="pull-right" onClick={VoterSessionActions.voterSignOut}>sign out</span>
                  </span>
                </div>
                <div className="u-stack--sm">
                  {this.state.voter.signed_in_twitter ? (
                    <div>
                      <span className="btn btn-social btn-md btn-twitter" href="#">
                        <i className="fa fa-twitter" />
                        @
                        {this.state.voter.twitter_screen_name}
                      </span>
                      <span className="u-margin-left--sm" />
                    </div>
                  ) : null
                  }
                  {this.state.voter.signed_in_twitter && (this.state.voter.signed_in_facebook || this.state.voter.signed_in_with_email) ? (
                    <div className="u-margin-top--xs">
                      {this.state.showTwitterDisconnect ? (
                        <div>
                          <Button
                            className="btn-sm"
                            variant="danger"
                            type="submit"
                            onClick={this.voterSplitIntoTwoAccounts}
                          >
                            Are you sure you want to un-link?
                          </Button>
                          <span className="u-margin-left--sm" onClick={this.toggleTwitterDisconnectClose}>cancel</span>
                        </div>
                      ) : (
                        <div>
                          <span onClick={this.toggleTwitterDisconnectOpen}>
                            un-link @
                            {this.state.voter.twitter_screen_name}
                            {" "}
                            twitter account
                          </span>
                        </div>
                      )}
                    </div>
                  ) : null
                  }
                  <div className="u-margin-top--sm">
                    {this.state.voter.signed_in_facebook && (
                    <span>
                      <span className="btn btn-social-icon btn-lg btn-facebook">
                        <span className="fa fa-facebook" />
                      </span>
                      <span className="u-margin-left--sm" />
                    </span>
                    )}
                    {this.state.voter.signed_in_with_email && (
                    <span>
                      <span className="btn btn-social-icon btn-lg btn-openid">
                        <span className="fa fa-envelope-o" />
                      </span>
                    </span>
                    )}
                  </div>
                </div>
              </div>
            ) : null
            }

            <VoterEmailAddressEntry />

            {debugMode && (
            <div className="text-center">
              is_signed_in:
              {" "}
              {this.state.voter.is_signed_in ? <span>True</span> : null}
              <br />
              signed_in_facebook:
              {" "}
              {this.state.voter.signed_in_facebook ? <span>True</span> : null}
              <br />
              signed_in_twitter:
              {" "}
              {this.state.voter.signed_in_twitter ? <span>True</span> : null}
              <br />
              we_vote_id:
              {" "}
              {this.state.voter.we_vote_id ? <span>{this.state.voter.we_vote_id}</span> : null}
              <br />
              email:
              {" "}
              {this.state.voter.email ? <span>{this.state.voter.email}</span> : null}
              <br />
              facebook_email:
              {" "}
              {this.state.voter.facebook_email ? <span>{this.state.voter.facebook_email}</span> : null}
              <br />
              facebook_profile_image_url_https:
              {" "}
              {this.state.voter.facebook_profile_image_url_https ? <span>{this.state.voter.facebook_profile_image_url_https}</span> : null}
              <br />
              first_name:
              {" "}
              {this.state.voter.first_name ? <span>{this.state.voter.first_name}</span> : null}
              <br />
              facebook_id:
              {" "}
              {this.state.voter.facebook_id ? <span>{this.state.voter.facebook_id}</span> : null}
              <br />
            </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
