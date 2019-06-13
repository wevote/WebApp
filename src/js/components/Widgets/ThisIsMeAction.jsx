import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router';
import { renderLog } from '../../utils/logging';
import VoterStore from '../../stores/VoterStore';
import { cordovaDot } from '../../utils/cordovaUtils';

export default class ThisIsMeAction extends Component {
  static propTypes = {
    bsPrefix: PropTypes.string,
    kindOfOwner: PropTypes.string,
    nameBeingViewed: PropTypes.string,
    twitterHandleBeingViewed: PropTypes.string,
  };

  constructor (props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount () {
    this.onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
  }

  onVoterStoreChange () {
    this.setState({ voter: VoterStore.getVoter() });
  }

  render () {
    renderLog(__filename);
    const { twitterHandleBeingViewed } = this.props;
    if (!twitterHandleBeingViewed) {
      // We do not want to show the "This is me" link if there isn't a twitter_handle associated with this organization
      return <span />;
    }
    const { kindOfOwner, nameBeingViewed } = this.props;
    // Manage the control over this organization voter guide
    const { voter } = this.state;
    const signedInTwitter = voter === undefined ? false : voter.signed_in_twitter;
    let signedInWithThisTwitterAccount = false;
    if (signedInTwitter && voter.twitter_screen_name && twitterHandleBeingViewed) {
      signedInWithThisTwitterAccount = voter.twitter_screen_name.toLowerCase() === twitterHandleBeingViewed.toLowerCase();
    }
    let thisIsMeActionText;
    if (kindOfOwner === 'ORGANIZATION') {
      if (nameBeingViewed) {
        thisIsMeActionText = `Is this you, or do you work with ${nameBeingViewed}?`;
      } else {
        thisIsMeActionText = 'Is this you, or do you work here?';
      }
    } else if (kindOfOwner === 'POLITICIAN') {
      if (nameBeingViewed) {
        thisIsMeActionText = `Is this you, or do you work for ${nameBeingViewed}?`;
      } else {
        thisIsMeActionText = 'Is this you, or do you work for this politician?';
      }
    } else {
      thisIsMeActionText = 'Is this you, or do you work here?';
    }

    return (
      <div>
        {signedInWithThisTwitterAccount ?
          <span /> : (
            <div className="card">
              <div className="card-main">
                <div className="endorsement-card">
                  <Link to={`/verifythisisme/${twitterHandleBeingViewed}`}>
                    <Button className="btn endorsement-card__btn btn-social" bsPrefix={this.props.bsPrefix} variant="primary">
                      <span>
                        <img src={cordovaDot('/img/global/svg-icons/glyphicons-pro-social/glyphicons-social-32-twitter.svg')} className="endorsement-card__btn--icon" alt="" />
                      </span>
                      Claim
                      {' '}
                      @
                      {this.props.twitterHandleBeingViewed}
                    </Button>
                  </Link>
                  <div className="endorsement-card__text">
                    {thisIsMeActionText}
                  </div>
                </div>
              </div>
            </div>
          )
        }
      </div>
    );
  }
}
