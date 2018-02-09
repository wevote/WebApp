import React, {PropTypes} from "react";
import { Link } from "react-router";
import { cordovaDot } from "../../utils/cordovaUtils";

const GettingStartedBarItem = props => {
  return props.isExternal ?
        <a href={props.url} target="_blank" className={ (props.printIcon ? "hidden-xs " : "") + "header-getting-started-nav__item header-getting-started-nav__item--has-icon"}>
          <span className="header-getting-started-nav__item-image-wrapper" title={props.title}>
             { props.twitterIcon ? <i className="fa fa-twitter fa-2x"/> : null }
             { !props.printIcon && !props.emailIcon && !props.mapMarkerIcon && !props.twitterIcon ? <img className={`glyphicon nav-getting-started__image${props.completed ? "-fade" : ""}`} src={props.source} /> : null }
          </span>
          <span className={`visible-xs header-getting-started-nav__label${props.completed ? "-fade" : ""}`}>
             {props.titleMobile ? props.titleMobile : props.title}
          </span>
          <span className={`hidden-xs header-getting-started-nav__label${props.completed ? "-fade" : ""}`}>
             {props.titleDesktop ? props.titleDesktop : props.title}
          </span>
        </a> :
        <Link onClick={props.show} className={ (props.printIcon ? "hidden-xs " : "") + "header-getting-started-nav__item header-getting-started-nav__item--has-icon"}>
          <span className="header-getting-started-nav__item-image-wrapper" title={props.title}>
            { props.completed ?
              <img className="glyphicon nav-getting-started__image-checked"
                src={cordovaDot("/img/global/svg-icons/check-mark-v2-21x21.svg")} /> :
              null
            }
            { props.printIcon ? <span className="glyphicon glyphicon-print fa-2x"/> : null }
            { props.emailIcon ? <span className="glyphicon glyphicon-envelope fa-2x"/> : null }
            { props.facebookIcon ? <i className="fa fa-facebook-square fa-2x"/> : null }
            { props.mapMarkerIcon ? <span className="glyphicon glyphicon-map-marker fa-2x"/> : null }
            { !props.printIcon && !props.emailIcon && !props.mapMarkerIcon ? <img className={`glyphicon nav-getting-started__image${props.completed ? "-fade" : ""}`} src={props.source} /> : null }
          </span>
          <span className={`visible-xs header-getting-started-nav__label${props.completed ? "-fade" : ""}`}>
             {props.titleMobile ? props.titleMobile : props.title}
          </span>
          <span className={`hidden-xs header-getting-started-nav__label${props.completed ? "-fade" : ""}`}>
             {props.titleDesktop ? props.titleDesktop : props.title}
          </span>
        </Link>;
};

GettingStartedBarItem.propTypes = {
  show: PropTypes.func,
  completed: PropTypes.number,
  source: PropTypes.string,
  title: PropTypes.string,
  titleDesktop: PropTypes.string,
  titleMobile: PropTypes.string,
  printIcon: PropTypes.bool,
  emailIcon: PropTypes.bool,
  facebookIcon: PropTypes.bool,
  twitterIcon: PropTypes.bool,
  mapMarkerIcon: PropTypes.bool,
  isExternal: PropTypes.bool,
  url: PropTypes.string,
};

export default GettingStartedBarItem;
