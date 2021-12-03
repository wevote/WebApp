import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { cordovaOpenSafariView, isWebApp } from '../../../utils/cordovaUtils';
import { renderLog } from '../../utils/logging';
import { stringContains } from '../../../utils/textFormat';

export default class OpenExternalWebSite extends Component {
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

    if (isWebApp()) {
      return (
        <a
          id={linkIdAttribute || ''}
          href={externalUrl}
          className={classNameString}
          target={this.props.target || ''}
          rel="noopener noreferrer"
          title={this.props.title || ''}
        >
          {this.props.body ? this.props.body : ''}
        </a>
      );
    } else {
      return (
        <span
          id={linkIdAttribute || ''}
          className={classNameString}
          title={this.props.title || ''}
          onClick={() => cordovaOpenSafariView(externalUrl, null, integerDelay)}
        >
          {this.props.body || ''}
        </span>
      );
    }
  }
}
OpenExternalWebSite.propTypes = {
  url: PropTypes.string.isRequired,
  className: PropTypes.string,
  linkIdAttribute: PropTypes.string,
  target: PropTypes.string,
  title: PropTypes.string,
  body: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]),
  delay: PropTypes.number,
};
