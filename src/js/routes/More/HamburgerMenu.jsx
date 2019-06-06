import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { Link } from 'react-router';
import { Table } from 'react-bootstrap';
import { cordovaDot, isCordova, isWebApp } from '../../utils/cordovaUtils';
import VoterStore from '../../stores/VoterStore';
import HamburgerMenuRow from '../../components/Navigation/HamburgerMenuRow';
import LoadingWheel from '../../components/LoadingWheel';
import VoterSessionActions from '../../actions/VoterSessionActions';
import { renderLog } from '../../utils/logging';

export default class HamburgerMenu extends Component {
  // This can only be called by a developer running Cordova in an emulator.  Voters will never see it.
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
    };
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
            />
          </div>
        ) : (
          <div id="anonIcon" className={isWebApp() ? 'header-nav__avatar' : 'header-nav__avatar-cordova header-nav__cordova'}>
            <img src={cordovaDot('/img/global/svg-icons/avatar-generic.svg')} width="34" height="34" color="#c0c0c0" alt="generic voter" />
          </div>
        )}
      </span>
    );
  }

  render () {
    renderLog(__filename);
    const { voter } = this.state;
    if (voter === undefined) {
      return LoadingWheel;
    }

    let { is_signed_in: isSignedIn } = voter;
    const { voter_photo_url_medium: photoUrl } = voter;
    isSignedIn = isSignedIn === undefined || isSignedIn === null ? false : isSignedIn;

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

            <tr className="hamburger-menu__tr">
              <td colSpan={3} style={{ padding: 15 }}>
                <span className="we-vote-promise" style={{ fontSize: 18, color: 'black', opacity: 0.7 }}>Settings:</span>
              </td>
            </tr>

            <HamburgerMenuRow
              onClickAction={null}
              to="/settings/profile"
              icon="fa fa-address-card"
              iconStyle={{ fontSize: 28, color: '#1c2f4b' }}
              linkText="Profile"
              indented
            />

            {isSignedIn && (
              <HamburgerMenuRow
                onClickAction={null}
                to="/settings/account"
                fullIcon={this.yourAccountIcon(photoUrl)}
                linkText="Account"
                indented
              />
            )}

            <HamburgerMenuRow
              onClickAction={null}
              to="/settings/address"
              icon="fa fa-home"
              iconStyle={{ fontSize: 30, color: '#1c2f4b' }}
              linkText="Address"
              indented
            />

            <HamburgerMenuRow
              onClickAction={null}
              to="/settings/election"
              icon="fa fa-cog"
              iconStyle={{ fontSize: 28, color: '#1c2f4b' }}
              linkText="Election Choice"
              indented
            />


            {isSignedIn && (
              <HamburgerMenuRow
                onClickAction={null}
                to="/settings/notifications"
                icon="fa fa-bell"
                iconStyle={{ fontSize: 26, color: '#1c2f4b' }}
                linkText="Notifications"
                indented
              />
            )}

            <HamburgerMenuRow
              onClickAction={null}
              to="/settings/voterguidesmenu"
              icon="fa fa-list"
              iconStyle={{ fontSize: 24, color: '#1c2f4b' }}
              linkText="Your Voter Guides"
            />

            <HamburgerMenuRow
              onClickAction={null}
              to="/more/about"
              icon="fa fa-users"
              iconStyle={{ fontSize: 22, color: '#1c2f4b' }}
              linkText="About We Vote"
            />

            {isSignedIn && (
            <HamburgerMenuRow
              onClickAction={() => VoterSessionActions.voterSignOut()}
              to="/settings/account"
              icon={isSignedIn ? 'fa fa-sign-out' : 'fa fa-sign-in'}
              iconStyle={{ fontSize: 28, color: '#1c2f4b' }}
              linkText="Sign Out"
            />
            )}

            <tr className="hamburger-terms__tr">
              <td className="hamburger-terms__td" colSpan={3}>
                <div>
                  <span className="hamburger-terms__text">
                    <Link to="/more/terms">
                      <span className="u-no-break">Terms of Service</span>
                    </Link>
                    <span style={{ paddingLeft: 20 }} />
                    <Link to="/more/privacy">
                      <span className="u-no-break">Privacy Policy</span>
                    </Link>
                  </span>
                </div>
                <div>
                  <span className="hamburger-terms__text">
                    <Link onClick={this.hideProfilePopUp} to="/more/attributions">Attributions</Link>
                  </span>
                </div>
                { isCordova() && (window.location.href.startsWith('file:///Users') || window.location.href.startsWith('file:///android')) ?
                  (
                    <div>
                      <div>
                        <span className="hamburger-terms__text">
                          <Link onClick={HamburgerMenu.clearAllCookies} to="/">Clear Cookies</Link>
                        </span>
                      </div>
                      <div>
                        <span className="hamburger-terms__text">
                          <Link to="/wevoteintro/network">Navigate to Welcome</Link>
                        </span>
                      </div>
                    </div>
                  ) :
                  null
                }
              </td>
            </tr>
          </tbody>
        </Table>
      </div>
    );
  }
}
