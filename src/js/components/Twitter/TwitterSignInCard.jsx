import React, { Component } from 'react';
import TwitterSignIn from "./TwitterSignIn";

const twitterInfoText = (
  <span className="social-btn-description">
    <i className="fa fa-info-circle" />
      Signing into Twitter is the fastest way to find voter guides related to your
      values. We Vote will find the voter guides for everyone you are following on
      Twitter
  </span>
);

class TwitterSignInCard extends Component {
  render() {
    return (
      <div className="col-md-4 d-none d-md-block">
        {this.props.voter.signed_in_twitter ? null : (
          <div className="card">
            <div className="card-main">
              <div className="network-btn">
                <TwitterSignIn
                  className="btn btn-social btn-lg btn-twitter btn-twitter-values text-center"
                  buttonText="Sign in to Find Voter Guides"
                />
                {twitterInfoText}
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }
}

export default TwitterSignInCard;
