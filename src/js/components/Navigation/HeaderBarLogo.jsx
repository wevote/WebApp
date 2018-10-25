import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router";
import { cordovaDot } from "../../utils/cordovaUtils";

const HeaderBarLogo = ({ isBeta, showFullNavigation }) =>
  <span>
    <Link to="/welcome" className={"page-logo page-logo-full-size d-none d-sm-inline-block"}>
      <img src={cordovaDot("/img/global/svg-icons/we-vote-logo-horizontal-color.svg")} />
      {isBeta && <span className="beta-marker"><span className="beta-marker-inner">beta</span></span>}
    </Link>
    <span>
      <Link to="/welcome" className={"page-logo page-logo-short h4 d-inline-block d-sm-none " + (showFullNavigation ? "wikiki" : "WAKAKA")}>
        <img className="glyphicon" src={cordovaDot("/img/global/svg-icons/we-vote-icon-square-color.svg")}/>
        {isBeta && <span className="beta-marker"><span className="beta-marker-inner">beta</span></span>}
      </Link>
    </span>
  </span>
;

HeaderBarLogo.propTypes = {
  showFullNavigation: PropTypes.bool.isRequired,
  isBeta: PropTypes.bool
};

export default HeaderBarLogo;
