import React, {PropTypes} from "react";
import { Link } from "react-router";

const GettingStartedBarItem = props =>
  <Link onClick={props.show} className={ "header-getting-started-nav__item header-getting-started-nav__item--has-icon"}>
    <span className="header-getting-started-nav__item-image-wrapper" title="Issues">
      { props.completed ?
        <img className="glyphicon nav-getting-started__image intro-checked"
          src="/img/global/svg-icons/check-mark-v2-21x21.svg" /> :
        null
      }
      <img className={`glyphicon nav-getting-started__image${props.completed ? "-fade" : ""}`} src={props.source} />
    </span>
    <span className={`header-getting-started-nav__label${props.completed ? "-fade" : ""}`}>
      {props.title}
      </span>
  </Link>;

GettingStartedBarItem.propTypes = {
  show: PropTypes.bool.isRequired,
  completed: PropTypes.bool.isRequired,
  source: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired
};

export default GettingStartedBarItem;
