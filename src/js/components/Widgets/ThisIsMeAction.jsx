import { Twitter } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import VoterStore from '../../stores/VoterStore';
import { renderLog } from '../../common/utils/logging';
import SplitIconButton from '../../common/components/Widgets/SplitIconButton';

class ThisIsMeAction extends Component {
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
    const { classes, kindOfOwner, nameBeingViewed, whiteOnBlue } = this.props;
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
    let backgroundColor = '#fff';
    let fontColor = '#2e3c5d';
    let icon = <Twitter classes={{ root: classes.twitterLogo }} />;
    if (whiteOnBlue) {
      backgroundColor = '#2e3c5d';
      fontColor = '#fff';
      icon = <Twitter classes={{ root: classes.twitterLogoWhite }} />;
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
                      backgroundColor={backgroundColor}
                      buttonText={`Claim @${this.props.twitterHandleBeingViewed}`}
                      externalUniqueId="candidateVerifyThisIsMeAction"
                      fontColor={fontColor}
                      icon={icon}
                      id="candidateVerifyThisIsMeAction"
                      title={`Claim @${this.props.twitterHandleBeingViewed}`}
                    />
                  </Link>
                  <div className="endorsement-card__text">
                    {thisIsMeActionText}
                  </div>
                </div>
              </Container>
            </div>
          )}
      </div>
    );
  }
}
ThisIsMeAction.propTypes = {
  classes: PropTypes.object,
  kindOfOwner: PropTypes.string,
  nameBeingViewed: PropTypes.string,
  twitterHandleBeingViewed: PropTypes.string,
  whiteOnBlue: PropTypes.bool,
};

const styles = () => ({
  twitterLogo: {
    color: '#1d9bf0',
  },
  twitterLogoWhite: {
    color: '#fff',
  },
});

const Container = styled.div`
  padding: 16px;
`;

export default withStyles(styles)(ThisIsMeAction);
