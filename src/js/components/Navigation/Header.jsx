import React, { Component } from "react";
import PropTypes from "prop-types";
import { getApplicationViewBooleans } from "../../utils/applicationUtils";
import { hasIPhoneNotch, isAndroid, isCordova, isIOS, isWebApp } from "../../utils/cordovaUtils";
import HeaderBackToBar from "./HeaderBackToBar";
import HeaderBackToVoterGuides from "./HeaderBackToVoterGuides";
import HeaderBar from "./HeaderBar";
import { stringContains } from "../../utils/textFormat";
import HeaderSecondaryNavBar from "./HeaderSecondaryNavBar";
import { renderLog } from "../../utils/logging";
import HeaderBackToSettings from "./HeaderBackToSettings";


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
    const { settingsMode, voterGuideMode, voterGuideShowGettingStartedNavigation,
      showBackToHeader, showBackToSettings, showBackToVoterGuides } = getApplicationViewBooleans(pathname);
    const hideGettingStartedButtons = voterGuideShowGettingStartedNavigation;

    let iPhoneSpacer = "";
    if (isCordova() && isIOS() && hasIPhoneNotch()) {
      iPhoneSpacer = <div className="ios-notched-spacer" />;
    } else if (isCordova() && isIOS() && !hasIPhoneNotch()) {
      iPhoneSpacer = <div className="ios-no-notch-spacer" />;
    }

    let pageHeaderStyle = weVoteBrandingOff ? "page-header__container_branding_off headroom" : "page-header__container headroom";
    if (isIOS()) {
      pageHeaderStyle = "page-header__container headroom page-header-cordova-ios";   // Note March 2018: no headroom.js for Cordova
    } else if (isAndroid()) {
      pageHeaderStyle = "page-header__container headroom";
    }

    if (voterGuideMode) {
      return (
        <div id="app-header">
          {iPhoneSpacer}
          <div className={isWebApp ? "headroom-wrapper-webapp__voter-guide" : ""}>
            <div ref="pageHeader" className={pageHeaderStyle} id="header-container">
              {showBackToHeader ?
                <HeaderBackToBar location={location} params={params} pathname={pathname} voter={voter} /> : (
                  <span>
                    {showBackToVoterGuides ?
                      <HeaderBackToVoterGuides location={location} params={params} pathname={pathname} voter={voter} /> :
                      <HeaderBar location={location} pathname={pathname} voter={voter} />
                    }
                  </span>
                )
              }
              {voterGuideShowGettingStartedNavigation || stringContains("/ballot", pathname) ? (
                <HeaderSecondaryNavBar hideGettingStartedOrganizationsButton={hideGettingStartedButtons}
                                       hideGettingStartedIssuesButton={hideGettingStartedButtons}
                                       pathname={pathname}
                                       voter={voter}
                                       id="secondary-nav-bar"
                />
              ) : null
              }
            </div>
          </div>
        </div>
      );
    } else if (settingsMode) {
      return (
        <div id="app-header">
          { iPhoneSpacer }
          <div className={isWebApp ? "headroom-wrapper-webapp__default" : ""} id="headroom-wrapper">
            <div ref="pageHeader" className={pageHeaderStyle} id="header-container">
              { showBackToSettings ? (
                <span>
                  <span className="d-block d-sm-none">
                    <HeaderBackToSettings location={location} params={params} pathname={pathname} voter={voter} />
                  </span>
                  <span className="d-none d-sm-block">
                    <HeaderBar location={location} pathname={pathname} voter={voter} />
                  </span>
                </span>
              ) : (
                <span>
                  { showBackToVoterGuides ?
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
    } else {
      // This handles other pages, like Welcome and the Ballot display
      return (
        <div id="app-header">
          { iPhoneSpacer }
          <div className={isWebApp() ?    // eslint-disable-line no-nested-ternary
            pathname === "/ballot" ? "headroom-wrapper-webapp__ballot" : "headroom-wrapper-webapp__default" : ""}
            id="headroom-wrapper"
          >
            <div ref="pageHeader" className={pageHeaderStyle} id="header-container">
              { showBackToHeader ?
                <HeaderBackToBar location={location} params={params} pathname={pathname} voter={voter} /> :
                <HeaderBar location={location} pathname={pathname} voter={voter} />
              }
              { stringContains("/ballot", pathname) || pathname === "/bookmarks" ?
                <HeaderSecondaryNavBar pathname={pathname} voter={voter} /> :
                null }
            </div>
          </div>
        </div>
      );
    }
  }
}
