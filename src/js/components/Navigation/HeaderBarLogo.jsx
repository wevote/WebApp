import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { cordovaDot } from '../../utils/cordovaUtils';

const HeaderBarLogo = ({ isBeta }) => (
  <span>
    <Link to="/welcome" className="page-logo page-logo-full-size">
      <img className="header-logo-img" alt="We Vote logo" src={cordovaDot('/img/global/svg-icons/we-vote-logo-horizontal-color-dark.svg')} />
      {isBeta && <span className="beta-marker"><span className="beta-marker-inner">beta</span></span>}
    </Link>
  </span>
);

HeaderBarLogo.propTypes = {
  isBeta: PropTypes.bool,
};

export default HeaderBarLogo;
