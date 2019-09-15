import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getApplicationViewBooleans } from '../../utils/applicationUtils';
import { cordovaTopHeaderTopMargin } from '../../utils/cordovaOffsets';
import { hasIPhoneNotch, isCordova, isIOS, isWebApp, isIPad } from '../../utils/cordovaUtils';
import HeaderBackToBallot from './HeaderBackToBallot';
import HeaderBackTo from './HeaderBackTo';
import HeaderBackToVoterGuides from './HeaderBackToVoterGuides';
import HeaderBar from './HeaderBar';
import { stringContains } from '../../utils/textFormat';
import { renderLog } from '../../utils/logging';


export default class Header extends Component {
  static propTypes = {
    params: PropTypes.object,
    location: PropTypes.object,
    pathname: PropTypes.string,
    voter: PropTypes.object,
    weVoteBrandingOff: PropTypes.bool,
  };

  componentDidUpdate () {
    // console.log("React Header ---------------   componentDidMount ()");
    // let heightA = $("#app-header").outerHeight();
    // let heightHC = $("#header-container").outerHeight();
    // let height2N = $("#secondary-nav-bar").outerHeight();
    // let heightW = $("#headroom-wrapper").outerHeight();
    // console.log("header rectangle height: " + heightA + ", " + heightHC + ", " + height2N + ", " + heightW);
  }

  render () {
    renderLog(__filename);

    const { params, location, pathname, voter, weVoteBrandingOff } = this.props;
    const { friendsMode, settingsMode, valuesMode, voterGuideMode,
      showBackToFriends, showBackToBallotHeader, showBackToSettingsDesktop, showBackToSettingsMobile, showBackToValues, showBackToVoterGuides } = getApplicationViewBooleans(pathname);
    // const hideGettingStartedButtons = voterGuideShowGettingStartedNavigation;
    let iPhoneSpacer = '';
    if (isCordova() && isIOS() && hasIPhoneNotch()) {
      iPhoneSpacer = <div className="ios-notched-spacer" />;
    } else if (isCordova() && isIOS() && !hasIPhoneNotch()) {
      iPhoneSpacer = <div className="ios-no-notch-spacer" style={{ height: `${isIPad() ? '0px' : 'undefined'}` }} />;
    }

    const pageHeaderStyle = weVoteBrandingOff ? 'page-header__container_branding_off headroom' : 'page-header__container headroom';
    // console.log(`Header href: ${window.location.href}  cordovaStyle: `, cordovaTopHeaderTopMargin());


    if (voterGuideMode) {
      // console.log('Header in voterGuideMode');
      return (
        <div id="app-header">
          {iPhoneSpacer}
          <div className={isWebApp ? 'headroom-wrapper-webapp__voter-guide' : ''}>
            <div className={pageHeaderStyle} style={cordovaTopHeaderTopMargin()} id="header-container">
              {showBackToBallotHeader ?
                <HeaderBackToBallot location={location} params={params} pathname={pathname} voter={voter} /> : (
                  <span>
                    {showBackToVoterGuides ?
                      <HeaderBackToVoterGuides location={location} params={params} pathname={pathname} voter={voter} /> :
                      <HeaderBar location={location} pathname={pathname} voter={voter} />
                    }
                  </span>
                )
              }
            </div>
          </div>
        </div>
      );
    } else if (settingsMode) {
      // console.log('Header in settingsMode, showBackToSettingsDesktop:', showBackToSettingsDesktop, ', showBackToSettingsMobile:', showBackToSettingsMobile);
      const backToSettingsLinkDesktop = '/settings/profile';
      const backToSettingsLinkMobile = '/settings/hamburger';
      const backToSettingsLinkText = 'Settings';
      const classNameHeadroom = showBackToVoterGuides ? 'headroom-wrapper-webapp__voter-guide' : 'headroom-wrapper-webapp__default';

      return (
        <div id="app-header">
          { iPhoneSpacer }
          <div className={isWebApp ? classNameHeadroom : ''} id="headroom-wrapper">
            <div className={pageHeaderStyle} style={cordovaTopHeaderTopMargin()} id="header-container">
              { showBackToSettingsDesktop && (
                <span>
                  <span className="u-show-desktop-tablet">
                    <HeaderBackTo backToLink={backToSettingsLinkDesktop} backToLinkText={backToSettingsLinkText} location={location} params={params} voter={voter} />
                  </span>
                  { !showBackToVoterGuides && !showBackToSettingsMobile && (
                    <span className="u-show-mobile">
                      <HeaderBar location={location} pathname={pathname} voter={voter} />
                    </span>
                  )}
                </span>
              )}
              { showBackToSettingsMobile && (
                <span>
                  <span className="u-show-mobile-tablet">
                    <HeaderBackTo backToLink={backToSettingsLinkMobile} backToLinkText={backToSettingsLinkText} location={location} params={params} voter={voter} />
                  </span>
                  { !showBackToVoterGuides && !showBackToSettingsDesktop && (
                    <span className="u-show-desktop-tablet">
                      <HeaderBar location={location} pathname={pathname} voter={voter} />
                    </span>
                  )}
                </span>
              )}
              { showBackToVoterGuides &&
                <HeaderBackToVoterGuides location={location} params={params} pathname={pathname} voter={voter} />
              }
              { !showBackToVoterGuides && !showBackToSettingsDesktop && !showBackToSettingsMobile &&
                <HeaderBar location={location} pathname={pathname} voter={voter} />
              }
            </div>
          </div>
        </div>
      );
    } else if (valuesMode) {
      let backToValuesLink = '/values';
      if (stringContains('/value/', pathname)) {
        backToValuesLink = '/values/list';
      } else if (stringContains('/values/list', pathname)) {
        backToValuesLink = '/values';
      }
      const backToValuesLinkText = 'Back';

      return (
        <div id="app-header">
          { iPhoneSpacer }
          <div className={isWebApp ? 'headroom-wrapper-webapp__default' : ''} id="headroom-wrapper">
            <div className={pageHeaderStyle} style={cordovaTopHeaderTopMargin()} id="header-container">
              { showBackToValues ?
                <HeaderBackTo backToLink={backToValuesLink} backToLinkText={backToValuesLinkText} location={location} params={params} voter={voter} /> :
                <HeaderBar location={location} pathname={pathname} voter={voter} />
              }
            </div>
          </div>
        </div>
      );
    } else if (friendsMode) {
      const backToFriendsLink = '/friends';
      const backToFriendsLinkText = 'Back';

      return (
        <div id="app-header">
          { iPhoneSpacer }
          <div className={isWebApp ? 'headroom-wrapper-webapp__default' : ''} id="headroom-wrapper">
            <div className={pageHeaderStyle} style={cordovaTopHeaderTopMargin()} id="header-container">
              { showBackToFriends ?
                <HeaderBackTo backToLink={backToFriendsLink} backToLinkText={backToFriendsLinkText} location={location} params={params} voter={voter} /> :
                <HeaderBar location={location} pathname={pathname} voter={voter} />
              }
            </div>
          </div>
        </div>
      );
    } else if (pathname === '/for-campaigns' ||
               pathname === '/for-organizations' ||
               pathname.startsWith('/how') ||
               pathname === '/more/about' ||
               pathname === '/more/credits' ||
               pathname.startsWith('/more/donate') ||
               pathname.startsWith('/more/pricing') ||
               pathname === '/welcome') {
      return null;
    } else {
      // console.log('Header not in any mode');
      let classNameHeadroom = '';  // Value for isCordova is ''
      if (isWebApp()) {
        if (stringContains('/ballot', pathname.toLowerCase())) {
          classNameHeadroom = 'headroom-wrapper-webapp__ballot';
        } else if (stringContains('/office', pathname.toLowerCase())) {
          classNameHeadroom = 'headroom-wrapper-webapp__office';
        } else {
          classNameHeadroom = 'headroom-wrapper-webapp__default';
        }
      }
      // This handles other pages, like the Ballot display
      return (
        <div id="app-header">
          { iPhoneSpacer }
          <div className={classNameHeadroom}
            id="headroom-wrapper"
          >
            <div className={pageHeaderStyle} style={cordovaTopHeaderTopMargin()} id="header-container">
              { showBackToBallotHeader ?
                <HeaderBackToBallot location={location} params={params} pathname={pathname} voter={voter} /> :
                <HeaderBar location={location} pathname={pathname} voter={voter} />
              }
            </div>
          </div>
        </div>
      );
    }
  }
}
