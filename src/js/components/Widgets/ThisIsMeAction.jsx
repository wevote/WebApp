import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import styled from 'styled-components';
import { renderLog } from '../../utils/logging';
import VoterStore from '../../stores/VoterStore';
import SplitIconButton from './SplitIconButton';

class ThisIsMeAction extends Component {
  static propTypes = {
    kindOfOwner: PropTypes.string,
    nameBeingViewed: PropTypes.string,
    twitterHandleBeingViewed: PropTypes.string,
    whiteOnBlue: PropTypes.bool,
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
    renderLog('ThisIsMeAction');  // Set LOG_RENDER_EVENTS to log all renders
    const { twitterHandleBeingViewed } = this.props;
    if (!twitterHandleBeingViewed) {
      // We do not want to show the "This is me" link if there isn't a twitter_handle associated with this organization
      return <span />;
    }
    const { kindOfOwner, nameBeingViewed, whiteOnBlue } = this.props;
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
              <Container>
                <div className="endorsement-card">
                  <Link to={`/verifythisisme/${twitterHandleBeingViewed}`} className="u-no-underline">
                    <SplitIconButton
                      title={`Claim @${this.props.twitterHandleBeingViewed}`}
                      id="candidateVerifyThisIsMeAction"
                      icon={<i className="fab fa-twitter-square" />}
                      buttonText={`Claim @${this.props.twitterHandleBeingViewed}`}
                      whiteOnBlue={whiteOnBlue}
                    />
                  </Link>
                  <div className="endorsement-card__text">
                    {thisIsMeActionText}
                  </div>
                </div>
              </Container>
            </div>
          )
        }
      </div>
    );
  }
}

const Container = styled.div`
  padding: 16px;
`;

export default ThisIsMeAction;
