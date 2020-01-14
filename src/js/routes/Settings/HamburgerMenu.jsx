import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { Link } from 'react-router';
import Table from 'react-bootstrap/esm/Table';
import { cordovaDot, isCordova, isWebApp } from '../../utils/cordovaUtils';
import DeviceDialog from '../../components/Widgets/DeviceDialog';
import VoterStore from '../../stores/VoterStore';
import HamburgerMenuRow from '../../components/Navigation/HamburgerMenuRow';
import LoadingWheel from '../../components/LoadingWheel';
import { renderLog } from '../../utils/logging';
import avatarGeneric from '../../../img/global/svg-icons/avatar-generic.svg';


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
            <img
              alt="Signed in voter"
              src={voterPhotoUrlMedium}
              height={34}
              width={34}
              style={{ maxWidth: 'unset' }}
            />
          </div>
        ) : (
          <div id="anonIcon" className={isWebApp() ? 'header-nav__avatar' : 'header-nav__avatar-cordova header-nav__cordova'}>
            <img src={cordovaDot(avatarGeneric)} width="34" height="34" color="#c0c0c0" alt="generic voter" />
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
    const { voter_photo_url_medium: photoUrl } = voter;
    isSignedIn = isSignedIn === undefined || isSignedIn === null ? false : isSignedIn;

    // console.log("Hamburger menu this.state.showDeviceDialog " + this.state.showDeviceDialog);

    return (
      <div>
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
                onClickAction={null}
                to="/settings/account"
                fullIcon={this.yourAccountIcon(photoUrl)}
                linkText="Sign In"
              />
            )}

            {isSignedIn && (
              <HamburgerMenuRow
                onClickAction={null}
                to="/settings/profile"
                icon="fa fa-address-card"
                iconStyle={{ fontSize: 28, color: '#1c2f4b' }}
                linkText="General"
              />
            )}

            {isSignedIn && (
              <HamburgerMenuRow
                onClickAction={null}
                to="/settings/account"
                fullIcon={this.yourAccountIcon(photoUrl)}
                linkText="Security & Sign In"
              />
            )}

            {isSignedIn && (
              <HamburgerMenuRow
                onClickAction={null}
                to="/settings/notifications"
                icon="fa fa-bell"
                iconStyle={{ fontSize: 26, color: '#1c2f4b' }}
                linkText="Notifications"
              />
            )}

            {isSignedIn && (
              <HamburgerMenuRow
                onClickAction={null}
                to="/settings/domain"
                icon="fa fa-globe-americas"
                iconStyle={{ fontSize: 24, color: '#1c2f4b' }}
                linkText="Domain"
              />
            )}

            {isSignedIn && (
              <HamburgerMenuRow
                onClickAction={null}
                to="/settings/sharing"
                icon="fa fa-share"
                iconStyle={{ fontSize: 24, color: '#1c2f4b' }}
                linkText="Sharing"
              />
            )}

            {isSignedIn && (
              <HamburgerMenuRow
                onClickAction={null}
                to="/settings/subscription"
                icon="fa fa-shopping-cart"
                iconStyle={{ fontSize: 24, color: '#1c2f4b' }}
                linkText="Subscription Plan"
              />
            )}

            {isSignedIn && (
              <HamburgerMenuRow
                onClickAction={null}
                to="/settings/analytics"
                icon="fa fa-chart-line"
                iconStyle={{ fontSize: 24, color: '#1c2f4b' }}
                linkText="Analytics"
              />
            )}

            {isSignedIn && (
              <HamburgerMenuRow
                onClickAction={null}
                to="/settings/promoted"
                icon="fa fa-bullhorn"
                iconStyle={{ fontSize: 24, color: '#1c2f4b' }}
                linkText="Promoted Organizations"
              />
            )}

            {isWebApp() && (
              <HamburgerMenuRow
                onClickAction={null}
                to="/settings/tools"
                icon="fa fa-tools"
                iconStyle={{ fontSize: 24, color: '#1c2f4b' }}
                linkText="Tools for Your Website"
              />
            )}

            <HamburgerMenuRow
              onClickAction={null}
              to="/more/about"
              icon="fa fa-users"
              iconStyle={{ fontSize: 22, color: '#1c2f4b' }}
              linkText="About We Vote"
            />

            <tr className="hamburger-terms__tr-terms">
              <td className="hamburger-terms__td" colSpan={3}>
                <div>
                  <span className="hamburger-terms__text">
                    <Link to="/more/terms">
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
          </tbody>
        </Table>
      </div>
    );
  }
}
