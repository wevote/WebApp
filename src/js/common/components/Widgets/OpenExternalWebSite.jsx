import PropTypes from 'prop-types';
import React, { Component } from 'react';
import TagManager from 'react-gtm-module';
import CandidateStore from '../../../stores/CandidateStore';
import VoterStore from '../../../stores/VoterStore';
import lookupPageNameAndPageTypeDict from '../../../utils/lookupPageNameAndPageTypeDict';
import lookupPageNameAndPageTypeDictForExternalUrls from '../../../utils/lookupPageNameAndPageTypeDictForExternalUrls';
import PoliticianStore from '../../stores/PoliticianStore';
import { cordovaOpenSafariView, isIOS } from '../../utils/cordovaUtils';
import historyPush from '../../utils/historyPush';
import { isAndroid, isWebApp } from '../../utils/isCordovaOrWebApp';
import { renderLog } from '../../utils/logging';
import stringContains from '../../utils/stringContains';

export default class OpenExternalWebSite extends Component {
  sendExternalLinkInfoToGTM = () => {
    const { candidateWeVoteId, politicianWeVoteId, destinationPageName, destinationPageType, linkIdAttribute, pageName, pageType, trackingOn, url } = this.props;
    if (trackingOn) {
      const { location: { pathname: currentPathname } } = window;
      const currentPage = lookupPageNameAndPageTypeDict(currentPathname);
      const pageNameLocalBackup = currentPage.pageName;
      const pageTypeLocalBackup = currentPage.pageType;
      const destinationPage = lookupPageNameAndPageTypeDictForExternalUrls(url);
      const destinationPageNameLocalBackup = destinationPage.pageName;
      const destinationPageTypeLocalBackup = destinationPage.pageType;
      // console.log('External link clicked:', this.props.url);
      const dataLayerObject = {
        actionDetails: {
          actionType: 'navigate',
          buttonId: linkIdAttribute || 'externalLink',
        },
        event: 'click',
        destinationDetails: {
          destinationPageName: destinationPageName || destinationPageNameLocalBackup,
          destinationPageType: destinationPageType || destinationPageTypeLocalBackup,
          destinationPathname: url,
        },
        pageDetails: {
          pageName: pageName || pageNameLocalBackup,
          pageType: pageType || pageTypeLocalBackup,
          pathname: currentPathname,
        },
        userDetails: VoterStore.getAnalyticsUserDetails(),
      };
      if (candidateWeVoteId) {
        dataLayerObject.candidateDetails = CandidateStore.getAnalyticsCandidateDetails(candidateWeVoteId);
      }
      if (politicianWeVoteId) {
        dataLayerObject.politicianDetails = PoliticianStore.getAnalyticsPoliticianDetails(politicianWeVoteId);
      }
      // console.log('Sending dataLayerObject to GTM:', dataLayerObject);
      TagManager.dataLayer({ dataLayer: dataLayerObject });
    }
  };

  clicked = (externalUrl, route) => {
    // console.log('Open External Web clicked -- externalUrl: ', externalUrl);
    const { delay } = this.props;
    const integerDelay = delay && delay >= 0 ? delay : 50;

    if (route) {
      // OpenExternalWebSite was called for an internal route (ok, but not the way it is supposed to be used)
      // console.log('---------- route: ', route);
      historyPush(route);
    } else if (isIOS()) {
      this.sendExternalLinkInfoToGTM();
      cordovaOpenSafariView(externalUrl, null, integerDelay);
    } else {
      this.sendExternalLinkInfoToGTM();
      window.cordova.InAppBrowser.open(externalUrl, '_blank', 'location=yes');
    }
  }

  render () {
    renderLog('OpenExternalWebSite');  // Set LOG_RENDER_EVENTS to log all renders
    // console.log('OpenExternalWebSite props ', this.props);
    const { className, linkIdAttribute, url } = this.props;
    const classNameString = className !== undefined ? className : 'open-web-site';
    let route = null;
    let externalUrl = url;
    if (stringContains('app://localhost', externalUrl)) {
      // console.log('---------- OpenExternalWebSite externalUrl ', externalUrl);
      route = externalUrl.split('localhost')[1];
      // console.log('---------- OpenExternalWebSite route ', route);
    } else if (!stringContains('http', externalUrl)) {
      externalUrl = `http://${externalUrl}`;
    }
    if (isAndroid()) {
      // Rendered message:
      // "Webpage not available"
      // "The webpage at http://www.sos.ca.gov/elections/ballot-measures/qualified-ballot-measures could not be loaded because: net::ERR_CLEARTEXT_NOT_PERMITTED"
      // Cordova Android 8 and higher will not open an http link, and if the site doesn't handle SSL, tough luck
      externalUrl = externalUrl.replace('http://', 'https://');
    }

    if (isWebApp()) {
      return (
        <a
          aria-label={this.props.ariaLabel || this.props.title || ''}
          className={classNameString}
          href={externalUrl}
          id={linkIdAttribute || ''}
          onClick={this.sendExternalLinkInfoToGTM}
          rel="noopener noreferrer"
          target={this.props.target || ''}
          title={this.props.title || ''}
          style={this.props.padRight ? { paddingRight: `${this.props.padRight}` } : undefined}
        >
          {this.props.body ? this.props.body : ''}
        </a>
      );
    } else {
      return (
        <span
          className={classNameString}
          id={linkIdAttribute || ''}
          onClick={() => this.clicked(externalUrl, route)}
          title={this.props.title || ''}
          style={this.props.padRight ? { paddingRight: `${this.props.padRight}` } : undefined}
        >
          {this.props.body || ''}
        </span>
      );
    }
  }
}
OpenExternalWebSite.propTypes = {
  ariaLabel: PropTypes.string,
  className: PropTypes.string,
  body: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]),
  delay: PropTypes.number,
  destinationPageName: PropTypes.string,
  destinationPageType: PropTypes.string,
  linkIdAttribute: PropTypes.string,
  pageName: PropTypes.string,
  pageType: PropTypes.string,
  target: PropTypes.string,
  title: PropTypes.string,
  trackingOn: PropTypes.bool,
  url: PropTypes.string.isRequired,
  candidateWeVoteId: PropTypes.string,
  politicianWeVoteId: PropTypes.string,
  padRight: PropTypes.string,
};
