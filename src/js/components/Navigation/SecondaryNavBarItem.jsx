import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router";
import { cordovaDot } from "../../utils/cordovaUtils";
import OpenExternalWebSite from "../../utils/OpenExternalWebSite";
import { renderLog } from "../../utils/logging";
import Icon from "react-svg-icons";

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

  constructor (props) {
    super(props);
  }

  render () {
    renderLog(__filename);

    let icon;
    if (this.props.iconPrint) {
      // icon = <span className="glyphicon glyphicon-print fa-2x"/>;
      icon = <Icon name="glyphicons-pro-halflings/glyphicons-halflings-45-print" color={"#51708e"} width={36} height={36} />;
    } else if (this.props.iconEmail) {
      // icon = <span className="glyphicon glyphicon-envelope fa-2x"/>;
      // icon = <i className="fa fa-envelope fa-2x"/>;
      icon = <Icon name="glyphicons-pro-halflings/glyphicons-halflings-4-envelope" className={{margin: -10}} color={"#51708e"} width={40} height={40} />;
    } else if (this.props.iconFacebook) {
      icon = <i className="fa fa-facebook-square fa-2x"/>;
    } else if (this.props.iconTwitter) {
      icon = <i className="fa fa-twitter fa-2x"/>;
    } else if (this.props.iconMapMarker) {
      // icon = <span className="glyphicon glyphicon-map-marker fa-2x"/>;
      // icon = <i className="fa fa-map-marker fa-2x"/>;
      icon = <Icon name="glyphicons-pro-halflings/glyphicons-halflings-62-map-marker" color={"#51708e"} width={40} height={40} />;
    } else {
      icon = <img className={`glyphicon nav-secondary-nav__image${this.props.completed ? "--fade" : ""}`} src={this.props.source}/>;
    }

    return this.props.isExternal ?
      <OpenExternalWebSite url={this.props.url}
                           target="_blank"
                           className={(this.props.iconPrint || this.props.completed ? "d-none d-sm-block " : "") + "header-secondary-nav__item header-secondary-nav__item--has-icon"}
                           body={
          <span>
            <span className="header-secondary-nav__item-image-wrapper" title={this.props.title}>
              {this.props.iconTwitter ? <i className="fa fa-twitter fa-2x"/> : null}
              {!this.props.iconPrint && !this.props.iconEmail && !this.props.iconMapMarker && !this.props.iconTwitter ?
                <img className={`glyphicon nav-secondary-nav__image${this.props.completed ? "--fade" : ""}`}
                     src={this.props.source}/> : null}
            </span>
            <span className={`d-block d-sm-none header-secondary-nav__label${this.props.completed ? "--fade" : ""}`}>
               {this.props.titleMobile ? this.props.titleMobile : this.props.title}
            </span>
            <span className={`d-none d-sm-block header-secondary-nav__label${this.props.completed ? "--fade" : ""}`}>
               {this.props.titleDesktop ? this.props.titleDesktop : this.props.title}
            </span>
          </span>}
      /> :
      <Link onClick={this.props.show}
            className={(this.props.iconPrint ? "d-none d-sm-block " : "") + "header-secondary-nav__item header-secondary-nav__item--has-icon"}>
        <span className="header-secondary-nav__item-image-wrapper" title={this.props.title}>
          {this.props.completed ?
            <img className="glyphicon nav-secondary-nav__image--checked"
                 src={cordovaDot("/img/global/svg-icons/check-mark-v2-21x21.svg")}/> :
            null
          }
          {icon}
        </span>
        <span className={`d-block d-sm-none header-secondary-nav__label${this.props.completed ? "--fade" : ""}`}>
           {this.props.titleMobile ? this.props.titleMobile : this.props.title}
        </span>
        <span className={`d-none d-sm-block header-secondary-nav__label${this.props.completed ? "--fade" : ""}`}>
           {this.props.titleDesktop ? this.props.titleDesktop : this.props.title}
        </span>
      </Link>;
  }
}
