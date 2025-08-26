import PropTypes from 'prop-types';
import React, { Component } from 'react';
import TagManager from 'react-gtm-module';
import CandidateStore from '../../../stores/CandidateStore';
import PoliticianStore from '../../stores/PoliticianStore';
import VoterStore from '../../../stores/VoterStore';
import { cordovaOpenSafariView } from '../../utils/cordovaUtils';
import { isAndroid, isWebApp } from '../../utils/isCordovaOrWebApp';
import lookupPageNameAndPageTypeDict from '../../../utils/lookupPageNameAndPageTypeDict';
import lookupPageNameAndPageTypeDictForExternalUrls from '../../../utils/lookupPageNameAndPageTypeDictForExternalUrls';
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
  }

  render () {
    renderLog('OpenExternalWebSite');  // Set LOG_RENDER_EVENTS to log all renders
    // console.log('OpenExternalWebSite props ', this.props);
    const { delay, className, linkIdAttribute, url } = this.props;
    const integerDelay = delay && delay >= 0 ? delay : 50;
    const classNameString = className !== undefined ? className : 'open-web-site';
    let externalUrl = url;
    if (!stringContains('http', externalUrl)) {
      externalUrl = `http://${externalUrl}`;
    }
    if (isAndroid()) {
      // Rendered message:
      // "Webpage not available"
      // "The webpage at http://www.sos.ca.gov/elections/ballot-measures/qualified-ballot-measures could not be loaded because: net::ERR_CLEARTEXT_NOT_PERMITTED"
      // Cordova Android 8 and higher will not open a http link, and if the site doesn't handle SSL, tough luck
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
        >
          {this.props.body ? this.props.body : ''}
        </a>
      );
    } else {
      return (
        <span
          className={classNameString}
          id={linkIdAttribute || ''}
          onClick={() => {
            this.sendExternalLinkInfoToGTM();
            cordovaOpenSafariView(externalUrl, null, integerDelay);
          }}
          title={this.props.title || ''}
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
};
