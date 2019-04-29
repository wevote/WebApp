import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { cordovaOpenSafariView, isWebApp } from './cordovaUtils';
import { renderLog } from './logging';

export default class OpenExternalWebSite extends Component {
  static propTypes = {
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

  render () {
    renderLog(__filename);
    const { delay, className } = this.props;
    const integerDelay = delay && delay >= 0 ? delay : 50;
    const classNameString = className !== undefined ? className : 'open-web-site';

    if (isWebApp()) {
      return (
        <a
          id={this.props.linkIdAttribute ? this.props.linkIdAttribute : ''}
          href={this.props.url}
          className={classNameString}
          target={this.props.target ? this.props.target : ''}
          title={this.props.title ? this.props.title : ''}
        >
          {this.props.body ? this.props.body : ''}
        </a>
      );
    } else {
      return (
        <span
          id={this.props.linkIdAttribute ? this.props.linkIdAttribute : ''}
          className={classNameString}
          title={this.props.title ? this.props.title : ''}
          onClick={() => cordovaOpenSafariView(this.props.url, null, integerDelay)}
        >
          {this.props.body ? this.props.body : ''}
        </span>
      );
    }
  }
}
