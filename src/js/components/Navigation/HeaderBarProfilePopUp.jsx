import { Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { isCordova, isWebApp, restoreStylesAfterCordovaKeyboard } from '../../utils/cordovaUtils';
import { renderLog } from '../../utils/logging';

class HeaderBarProfilePopUp extends Component {
  constructor (props) {
    super(props);
    this.hideProfilePopUp = this.props.hideProfilePopUp.bind(this);
    this.signOutAndHideProfilePopUp = this.props.signOutAndHideProfilePopUp.bind(this);
    this.toggleProfilePopUp = this.props.toggleProfilePopUp.bind(this);
    this.toggleSignInModal = this.props.toggleSignInModal.bind(this);
    this.transitionToYourVoterGuide = this.props.transitionToYourVoterGuide.bind(this);
  }

  componentWillUnmount () {
    restoreStylesAfterCordovaKeyboard('HeaderBarProfilePopUp');
  }

  signInFromPopUp = () => {
    this.hideProfilePopUp();
    this.toggleSignInModal();
  };

  render () {
    renderLog('HeaderBarProfilePopUp');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes, isWelcomeMobilePage, voter, profilePopUpOpen } = this.props;
    let isSignedIn = false;
    let voterOrganizationWeVoteId = '';
    let voterTwitterScreenName = '';
    if (voter) {
      ({
        is_signed_in: isSignedIn,
        linked_organization_we_vote_id: voterOrganizationWeVoteId,
        twitter_screen_name: voterTwitterScreenName,
      } = voter);
    }

    /* eslint-disable no-extra-parens */
    const popUpOpen = (function opener () {
      if (profilePopUpOpen) {
        return (isWebApp() ? `${isWelcomeMobilePage ? 'profile-menu-welcome-mobile-page--open' : 'profile-menu--open'}` : 'profile-pop-up-menu-cordova--open');
      }
      return '';
    }());

    const yourVoterGuideLink = voterTwitterScreenName ?
      `/${voterTwitterScreenName}` :
      `/voterguide/${voterOrganizationWeVoteId}`;

    return (
      <div className={popUpOpen}>
        <div className="page-overlay" onClick={this.hideProfilePopUp} />
        <div className={isWebApp() ? `${isWelcomeMobilePage ? 'profile-menu-welcome-mobile-page' : 'profile-menu'}` : 'profile-pop-up-menu-cordova'}>
          <span className="we-vote-promise">Our Promise: We&apos;ll never sell your email.</span>
          <ul className="nav flex-column">
            {/* Desktop only */}
            {isWebApp() && (
            <li className="d-none d-sm-block">
              <ListItemWrapper>
                <Link id="profilePopUpYourSettings"
                      onClick={this.hideProfilePopUp}
                      to="/settings/profile"
                >
                  <Button
                    variant="text"
                    color="primary"
                    classes={{ root: classes.signOutButton }}
                  >
                    <span className="header-slide-out-menu-text-left">Your Settings</span>
                  </Button>
                </Link>
              </ListItemWrapper>
            </li>
            )}
            {/* Mobile and cordova  */}
            <li className={isCordova() ? 'navli' : 'navli d-block d-sm-none'}>
              <ListItemWrapper>
                <Link id="profilePopUpYourSettingsMobile" onClick={this.hideProfilePopUp} to="/settings/hamburger">
                  <Button
                    variant="text"
                    color="primary"
                    classes={{ root: classes.signOutButton }}
                  >
                    <span className="header-slide-out-menu-text-left">Your Settings</span>
                  </Button>
                </Link>
              </ListItemWrapper>
            </li>
            {/* Desktop or Mobile */}
            <li>
              <ListItemWrapper>
                <Link id="profilePopUpYourEndorsements" onClick={this.hideProfilePopUp} to={yourVoterGuideLink}>
                  <Button
                    variant="text"
                    color="primary"
                    classes={{ root: classes.signOutButton }}
                  >
                    <span className="header-slide-out-menu-text-left">Your Endorsements</span>
                  </Button>
                </Link>
              </ListItemWrapper>
            </li>
            {/* Desktop or Mobile */}
            <li>
              <ListItemWrapper>
                <Link id="profilePopUpYourFriends" onClick={this.hideProfilePopUp} to="/friends">
                  <Button
                    variant="text"
                    color="primary"
                    classes={{ root: classes.signOutButton }}
                  >
                    <span className="header-slide-out-menu-text-left">Your Friends</span>
                  </Button>
                </Link>
              </ListItemWrapper>
            </li>
            {/* Desktop or Mobile */}
            <li>
              <ListItemWrapper>
                <Link id="profilePopUpYourValues" onClick={this.hideProfilePopUp} to="/values/list">
                  <Button
                    variant="text"
                    color="primary"
                    classes={{ root: classes.signOutButton }}
                  >
                    <span className="header-slide-out-menu-text-left">Your Values</span>
                  </Button>
                </Link>
              </ListItemWrapper>
            </li>
            {/* Desktop or Mobile */}
            {voter && isSignedIn ?
              null : (
                <li>
                  <ListItemWrapper>
                    <Link // eslint-disable-line
                      to=""
                    >
                      <Button
                        variant="text"
                        color="primary"
                        classes={{ root: classes.signOutButton }}
                        id="profilePopUpSignIn"
                        onClick={this.signInFromPopUp}
                      >
                        <span className="header-slide-out-menu-text-left">Sign In</span>
                      </Button>
                    </Link>
                  </ListItemWrapper>
                </li>
              )}
            {/* Desktop or Mobile */}
            {voter && isSignedIn ? (
              <li>
                <ListItemWrapper>
                  <Link // eslint-disable-line
                    to=""
                  >
                    <Button
                      variant="text"
                      color="primary"
                      classes={{ root: classes.signOutButton }}
                      id="profilePopUpSignOut"
                      onClick={this.signOutAndHideProfilePopUp}
                    >
                      <span className="header-slide-out-menu-text-left">Sign Out</span>
                    </Button>
                  </Link>
                </ListItemWrapper>
              </li>
            ) : null}
          </ul>
          <div>
            <span className="terms-and-privacy">
              <Link id="profilePopUpFAQ" onClick={this.hideProfilePopUp} to="/more/faq">
                <span className="u-no-break">Frequently Asked Questions</span>
              </Link>
            </span>
          </div>
          <div>
            <span className="terms-and-privacy">
              <Link id="profilePopUpTermsOfService" onClick={this.hideProfilePopUp} to="/more/terms">
                <span className="u-no-break">Terms of Service</span>
              </Link>
              <span style={{ paddingLeft: 20 }} />
              <Link id="profilePopUpPrivacyPolicy" onClick={this.hideProfilePopUp} to="/more/privacy">
                <span className="u-no-break">Privacy Policy</span>
              </Link>
            </span>
          </div>
        </div>
      </div>
    );
  }
}
HeaderBarProfilePopUp.propTypes = {
  classes: PropTypes.object,
  hideProfilePopUp: PropTypes.func.isRequired,
  isWelcomeMobilePage: PropTypes.bool,
  profilePopUpOpen: PropTypes.bool,
  signOutAndHideProfilePopUp: PropTypes.func.isRequired,
  toggleProfilePopUp: PropTypes.func.isRequired,
  toggleSignInModal: PropTypes.func.isRequired,
  transitionToYourVoterGuide: PropTypes.func.isRequired,
  voter: PropTypes.object,
};

const styles = {
  signOutButton: {
    '&:hover': {
      backgroundColor: 'transparent',
    },
    color: 'rgb(6, 95, 212)',
    outline: 'none !important',
    paddingLeft: 0,
    paddingRight: 0,
    textAlign: 'left',
  },
};

const ListItemWrapper = styled.div`
  padding: 5px 0 5px 0;
`;

export default withStyles(styles)(HeaderBarProfilePopUp);
