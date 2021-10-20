import React, { Component } from 'react';
import Table from 'react-bootstrap/Table';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';
import LazyImage from '../../common/components/LazyImage';
import LoadingWheel from '../../components/LoadingWheel';
import HamburgerMenuRow from '../../components/Navigation/HamburgerMenuRow';
import DeviceDialog from '../../components/Widgets/DeviceDialog';
import VoterStore from '../../stores/VoterStore';
import { avatarGeneric } from '../../utils/applicationUtils';
import { isCordova, isWebApp } from '../../utils/cordovaUtils';
import { renderLog } from '../../utils/logging';
import { PageContentContainer } from '../../utils/pageLayoutStyles';
import { voterPhoto } from '../../utils/voterPhoto';

const webAppConfig = require('../../config');


export default class HamburgerMenu extends Component {
  // This can only be called by a developer running Cordova in an Simulator.  Voters will never see it.
  static clearAllCookies () {
    const cookies = document.cookie.split(';');
    const d = new Date();
    d.setDate(d.getDate() - 1);

    for (let i = 0; i < cookies.length; i++) {
      const spcook =  cookies[i].split('=');

      console.log('DEBUG CORDOVA delete one Cookie: ', spcook[0]);
      document.cookie = `${spcook[0]}=; expires=${d}; path=/;`;
    }

    window.location = ''; // TO REFRESH THE PAGE
  }

  constructor (props) {
    super(props);
    this.state = {
      voter: undefined,
      showDeviceDialog: false,
    };
    this.deviceTableVisibilityOn = this.deviceTableVisibilityOn.bind(this);
    this.deviceTableVisibilityOff = this.deviceTableVisibilityOff.bind(this);
  }

  componentDidMount () {
    // console.log("SignIn componentDidMount");
    this.onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    window.scrollTo(0, 0);
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
    this.timer = null;
  }

  onVoterStoreChange () {
    this.setState({ voter: VoterStore.getVoter() });
  }

  yourAccountIcon (voterPhotoUrlMedium) {
    return (
      <span
        className="header-nav__avatar-wrapper u-cursor--pointer u-flex-none"
        id="profileAvatarHeaderBar"
        onClick={this.toggleProfilePopUp}
      >
        {voterPhotoUrlMedium ? (
          <div className={isWebApp() ? 'header-nav__avatar' : 'header-nav__avatar-cordova header-nav__cordova'}>
            <LazyImage
              alt="Signed in voter"
              src={voterPhotoUrlMedium}
              placeholder={avatarGeneric()}
              height={34}
              width={34}
              style={{ maxWidth: 'unset' }}
            />
          </div>
        ) : (
          <div id="anonIcon" className={isWebApp() ? 'header-nav__avatar' : 'header-nav__avatar-cordova header-nav__cordova'}>
            <img src={avatarGeneric()} width="34" height="34" color="#c0c0c0" alt="generic voter" />
          </div>
        )}
      </span>
    );
  }

  deviceTableVisibilityOff () {
    const { showDeviceDialog } = this.state;
    if (showDeviceDialog === true) {
      this.setState({ showDeviceDialog: false });
    }
  }

  deviceTableVisibilityOn () {
    this.setState({ showDeviceDialog: true });
  }

  render () {
    renderLog('HamburgerMenu');  // Set LOG_RENDER_EVENTS to log all renders
    const { voter } = this.state;
    if (voter === undefined) {
      return LoadingWheel;
    }

    let { is_signed_in: isSignedIn } = voter;
    const voterPhotoUrlMedium = voterPhoto(voter);

    isSignedIn = isSignedIn === undefined || isSignedIn === null ? false : isSignedIn;
    const nextReleaseFeaturesEnabled = webAppConfig.ENABLE_NEXT_RELEASE_FEATURES === undefined ? false : webAppConfig.ENABLE_NEXT_RELEASE_FEATURES;

    // console.log("Hamburger menu this.state.showDeviceDialog " + this.state.showDeviceDialog);

    return (
      <PageContentContainer>
        <Helmet title="Settings Menu" />
        <Table responsive className="hamburger-menu__table">
          <tbody>
            <tr className="hamburger-menu__tr">
              <td colSpan={3} style={{ padding: 15 }}>
                <span className="we-vote-promise" style={{ fontSize: 15 }}>Our Promise: We&apos;ll never sell your email.</span>
              </td>
            </tr>

            {!isSignedIn && (
              <HamburgerMenuRow
                fullIcon={this.yourAccountIcon(voterPhotoUrlMedium)}
                linkText="Sign In"
                onClickAction={null}
                to="/settings/account"
              />
            )}

            {isSignedIn && (
              <HamburgerMenuRow
                icon="fa fa-address-card"
                iconStyle={{ fontSize: 28, color: '#1c2f4b' }}
                linkText="General"
                onClickAction={null}
                to="/settings/profile"
              />
            )}

            {isSignedIn && (
              <HamburgerMenuRow
                fullIcon={this.yourAccountIcon(voterPhotoUrlMedium)}
                linkText="Security & Sign In"
                onClickAction={null}
                to="/settings/account"
              />
            )}

            {isSignedIn && (
              <HamburgerMenuRow
                icon="fa fa-bell"
                iconStyle={{ fontSize: 26, color: '#1c2f4b' }}
                linkText="Notifications"
                onClickAction={null}
                to="/settings/notifications"
              />
            )}

            <HamburgerMenuRow
              icon="fa fa-users"
              iconStyle={{ fontSize: 22, color: '#1c2f4b' }}
              linkText="About We Vote"
              onClickAction={null}
              to="/more/about"
            />

            {isSignedIn && (
              <HamburgerMenuRow
                icon="fa fa-globe-americas"
                iconStyle={{ fontSize: 24, color: '#1c2f4b' }}
                linkText="Domain"
                onClickAction={null}
                showProChip
                to="/settings/domain"
              />
            )}

            {isSignedIn && (
              <HamburgerMenuRow
                icon="fa fa-file-alt"
                iconStyle={{ fontSize: 24, color: '#1c2f4b' }}
                linkText="Site Text"
                onClickAction={null}
                to="/settings/text"
              />
            )}

            {isSignedIn && (
              <HamburgerMenuRow
                icon="fa fa-share"
                iconStyle={{ fontSize: 24, color: '#1c2f4b' }}
                linkText="Logo & Sharing"
                onClickAction={null}
                showProChip
                to="/settings/sharing"
              />
            )}

            {isSignedIn && (
              <HamburgerMenuRow
                icon="fa fa-shopping-cart"
                iconStyle={{ fontSize: 24, color: '#1c2f4b' }}
                linkText="Subscription Plan"
                onClickAction={null}
                showProChip
                to="/settings/subscription"
              />
            )}

            {isSignedIn && (
              <HamburgerMenuRow
                icon="fa fa-chart-line"
                iconStyle={{ fontSize: 24, color: '#1c2f4b' }}
                linkText="Analytics"
                onClickAction={null}
                showProChip
                to="/settings/analytics"
              />
            )}

            {isSignedIn && nextReleaseFeaturesEnabled && (
              <HamburgerMenuRow
                icon="fa fa-bullhorn"
                iconStyle={{ fontSize: 24, color: '#1c2f4b' }}
                linkText="Promoted Organizations"
                onClickAction={null}
                showProChip
                to="/settings/promoted"
              />
            )}

            {isWebApp() && (
              <HamburgerMenuRow
                icon="fa fa-tools"
                iconStyle={{ fontSize: 24, color: '#1c2f4b' }}
                linkText="Tools for Your Website"
                onClickAction={null}
                showProChip
                to="/settings/tools"
              />
            )}

            <tr className="hamburger-terms__tr-terms">
              <td className="hamburger-terms__td" colSpan={3}>
                <div>
                  <span className="hamburger-terms__text">
                    <Link to="/more/faq" id="frequentlyAskedQuestions">
                      <span className="u-no-break">Questions?</span>
                    </Link>
                  </span>
                </div>
              </td>
            </tr>
            <tr className="hamburger-terms__tr-terms">
              <td className="hamburger-terms__td" colSpan={3}>
                <div>
                  <span className="hamburger-terms__text">
                    <Link to="/more/terms" id="termsOfService">
                      <span className="u-no-break">Terms of Service</span>
                    </Link>
                  </span>
                </div>
              </td>
            </tr>
            <tr className="hamburger-terms__tr-terms">
              <td className="hamburger-terms__td" colSpan={3}>
                <div>
                  <span className="hamburger-terms__text">
                    <Link to="/more/privacy">
                      <span className="u-no-break">Privacy Policy</span>
                    </Link>
                  </span>
                </div>
              </td>
            </tr>
            <tr className="hamburger-terms__tr-terms">
              <td className="hamburger-terms__td" colSpan={3}>
                <div>
                  <span className="hamburger-terms__text">
                    <Link onClick={this.hideProfilePopUp} to="/more/attributions">Attributions</Link>
                  </span>
                </div>
              </td>
            </tr>
            {isCordova() && (
            <tr className="hamburger-terms__tr-terms">
              <td className="hamburger-terms__td" colSpan={3}>
                <div>
                  <span className="hamburger-terms__text" onClick={() => this.deviceTableVisibilityOn()} style={{ color: 'black' }}>
                    Device Information
                  </span>
                  <DeviceDialog visibilityOffFunction={this.deviceTableVisibilityOff} show={this.state.showDeviceDialog} />
                </div>
              </td>
            </tr>
            )}
            {isCordova() && (
            <tr className="hamburger-terms__tr-terms">
              <td className="hamburger-terms__td" colSpan={3}>
                <div>
                  <span className="hamburger-terms__text" style={{ color: 'black', opacity: '0.7' }}>
                    Version:&nbsp;&nbsp;
                    {window.weVoteAppVersion}
                  </span>
                  <DeviceDialog visibilityOffFunction={this.deviceTableVisibilityOff} show={this.state.showDeviceDialog} />
                </div>
              </td>
            </tr>
            )}
          </tbody>
        </Table>
      </PageContentContainer>
    );
  }
}
