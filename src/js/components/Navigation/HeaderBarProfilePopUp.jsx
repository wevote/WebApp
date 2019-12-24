import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { withStyles } from '@material-ui/core/esm/styles';
import Button from '@material-ui/core/esm/Button';
import { isWebApp } from '../../utils/cordovaUtils';
import { renderLog } from '../../utils/logging';

class HeaderBarProfilePopUp extends Component {
  static propTypes = {
    classes: PropTypes.object,
    hideProfilePopUp: PropTypes.func.isRequired,
    profilePopUpOpen: PropTypes.bool,
    signOutAndHideProfilePopUp: PropTypes.func.isRequired,
    toggleProfilePopUp: PropTypes.func.isRequired,
    toggleSignInModal: PropTypes.func.isRequired,
    transitionToYourVoterGuide: PropTypes.func.isRequired,
    voter: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.hideProfilePopUp = this.props.hideProfilePopUp.bind(this);
    this.signOutAndHideProfilePopUp = this.props.signOutAndHideProfilePopUp.bind(this);
    this.toggleProfilePopUp = this.props.toggleProfilePopUp.bind(this);
    this.toggleSignInModal = this.props.toggleSignInModal.bind(this);
    this.transitionToYourVoterGuide = this.props.transitionToYourVoterGuide.bind(this);
  }

  signInFromPopUp = () => {
    this.hideProfilePopUp();
    this.toggleSignInModal();
  };

  render () {
    renderLog('HeaderBarProfilePopUp');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes, voter, profilePopUpOpen } = this.props;
    const isSignedIn = voter && voter.is_signed_in;

    /* eslint-disable no-extra-parens */
    const popUpOpen = (function opener () {
      if (profilePopUpOpen) {
        return (isWebApp() ? 'profile-menu--open' : 'profile-pop-up-menu-cordova--open');
      }
      return '';
    }());

    return (
      <div className={popUpOpen}>
        <div className="page-overlay" onClick={this.hideProfilePopUp} />
        <div className={isWebApp() ? 'profile-menu' : 'profile-pop-up-menu-cordova'}>
          <span className="we-vote-promise">Our Promise: We&apos;ll never sell your email.</span>
          <ul className="nav flex-column">
            {/* Desktop only */}
            <li className="d-none d-sm-block">
              <Link id="profilePopUpYourSettings" onClick={this.hideProfilePopUp} to="/settings/profile">
                <Button
                  variant="text"
                  color="primary"
                  classes={{ root: classes.signOutButton }}
                >
                  <span className="header-slide-out-menu-text-left">Your Settings</span>
                </Button>
              </Link>
            </li>
            {/* Mobile only */}
            <li className="navli d-block d-sm-none">
              <Link id="profilePopUpYourSettingsMobile" onClick={this.hideProfilePopUp} to="/settings/menu">
                <Button
                  variant="text"
                  color="primary"
                  classes={{ root: classes.signOutButton }}
                >
                  <span className="header-slide-out-menu-text-left">Your Settings</span>
                </Button>
              </Link>
            </li>
            {/* Desktop or Mobile */}
            <li>
              <Link id="profilePopUpYourEndorsements" onClick={this.hideProfilePopUp} to="/settings/voterguidelist">
                <Button
                  variant="text"
                  color="primary"
                  classes={{ root: classes.signOutButton }}
                >
                  <span className="header-slide-out-menu-text-left">Your Endorsements</span>
                </Button>
              </Link>
            </li>
            {/* Desktop or Mobile */}
            {voter && isSignedIn ?
              null : (
                <li>
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
                </li>
              )}
            {/* Desktop or Mobile */}
            {voter && isSignedIn ? (
              <li>
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
              </li>
            ) : null
            }
          </ul>
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
          {/* Commented out since this pop-up is so small. We still show attributions on Settings page
          <div>
            <span className="terms-and-privacy">
              <Link id="profilePopUpAttributions" onClick={this.hideProfilePopUp} to="/more/attributions">Attributions</Link>
            </span>
          </div>
          */}
        </div>
      </div>
    );
  }
}

const styles = {
  signOutButton: {
    '&:hover': {
      backgroundColor: 'transparent',
    },
    color: 'rgb(6, 95, 212)',
    outline: 'none !important',
    textAlign: 'left',
  },
};

export default withStyles(styles)(HeaderBarProfilePopUp);
