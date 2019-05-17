import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { cordovaDot } from '../../utils/cordovaUtils';
import OpenExternalWebSite from '../Widgets/OpenExternalWebSite';
import { renderLog } from '../../utils/logging';

export default class SecondaryNavBarItem extends Component {
  static propTypes = {
    show: PropTypes.func,
    completed: PropTypes.number,
    source: PropTypes.string,
    title: PropTypes.string,
    titleDesktop: PropTypes.string,
    titleMobile: PropTypes.string,
    iconPrint: PropTypes.bool,
    iconEmail: PropTypes.bool,
    iconFacebook: PropTypes.bool,
    iconTwitter: PropTypes.bool,
    iconMapMarker: PropTypes.bool,
    isExternal: PropTypes.bool,
    url: PropTypes.string,
  };


  render () {
    renderLog(__filename);

    let icon;
    if (this.props.iconFacebook) {
      icon = <i className="fa fa-facebook-square" style={{ color: '#0d5470' }} />;
    } else if (this.props.iconTwitter) {
      icon = <i className="fa fa-twitter" />;
    } else {
      icon = <img className={`nav-secondary-nav__image${this.props.completed ? '--fade' : ''}`} src={this.props.source} alt="twtter" />;
    }

    return this.props.isExternal ? (
      <OpenExternalWebSite
        url={this.props.url}
        target="_blank"
        className={`${this.props.iconPrint || this.props.completed ? 'd-none d-sm-block ' : ''}header-secondary-nav__item`}
        body={(
          <div>
            <div className="header-secondary-nav__item-image-wrapper" title={this.props.title}>
              {this.props.iconTwitter ? <i className="fa fa-twitter fa-2x" /> : null}
              {!this.props.iconPrint && !this.props.iconEmail && !this.props.iconMapMarker && !this.props.iconTwitter ? (
                <img
                  className={`glyphicon nav-secondary-nav__image${this.props.completed ? '--fade' : ''}`}
                  src={this.props.source}
                />
              ) : null}
            </div>
            <div className={`d-block d-sm-none header-secondary-nav__label${this.props.completed ? '--fade' : ''}`}>
              {this.props.titleMobile ? this.props.titleMobile : this.props.title}
            </div>
            <div className={`d-none d-sm-block header-secondary-nav__label${this.props.completed ? '--fade' : ''}`}>
              {this.props.titleDesktop ? this.props.titleDesktop : this.props.title}
            </div>
          </div>
        )}
      />
    ) : (
      <Link // eslint-disable-line
        onClick={this.props.show}
        className={`${this.props.iconPrint ? 'd-none d-md-flex ' : ''}header-secondary-nav__item`}
      >
        <div className="header-secondary-nav__item-image-wrapper" title={this.props.title}>
          {this.props.completed ? (
            <img
              className="nav-secondary-nav__image--checked"
              src={cordovaDot('/img/global/svg-icons/check-mark-v2-21x21.svg')}
              alt="check"
            />
          ) : null
          }
          {icon}
        </div>
        <div className={`d-block d-sm-none header-secondary-nav__label${this.props.completed ? '--fade' : ''}`}>
          {this.props.titleMobile ? this.props.titleMobile : this.props.title}
        </div>
        <div className={`d-none d-sm-block header-secondary-nav__label${this.props.completed ? '--fade' : ''}`}>
          {this.props.titleDesktop ? this.props.titleDesktop : this.props.title}
        </div>
      </Link>
    );
  }
}
