import React, { Component } from 'react';

import { Chip } from '@material-ui/core';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { renderLog } from '../../utils/logging';
import { voterFeaturePackageExceedsOrEqualsRequired } from '../../utils/pricingFunctions';
import AppActions from '../../actions/AppActions';

class SettingsAccountLevelChip extends Component {
  constructor (props) {
    super(props);

    this.state = {};
  }

  onClickHandler = () => {
    const paidAccountUpgradeMode = this.props.requiredFeaturePackage === 'PROFESSIONAL' ? 'professional' : 'enterprise';
    this.openPaidAccountUpgradeModal(paidAccountUpgradeMode);
  };

  openPaidAccountUpgradeModal = (paidAccountUpgradeMode) => {
    AppActions.setShowPaidAccountUpgradeModal(paidAccountUpgradeMode);
  };

  preventFocus = (e) => {
    e.preventDefault();
  };

  render () {
    renderLog('SettingsAccountLevelChip');  // Set LOG_RENDER_EVENTS to log all renders
    const { chosenFeaturePackage, classes, ignoreIfUpgraded, onClickDisabled, requiredFeaturePackage } = this.props;
    let chipLabel;
    const yourFeaturePackageExceedsOrEquals = voterFeaturePackageExceedsOrEqualsRequired(chosenFeaturePackage, requiredFeaturePackage);
    switch (requiredFeaturePackage.toUpperCase()) {
      default:
      case 'PROFESSIONAL':
        chipLabel = 'PRO';
        break;
      case 'ENTERPRISE':
        chipLabel = 'ENTERPRISE';
        break;
    }
    return (
      <Chip
        classes={{
          root: `${classes.root} ${yourFeaturePackageExceedsOrEquals && !ignoreIfUpgraded ? classes.alreadyUpgraded : (ignoreIfUpgraded ? classes.notUpgradedNoHover : classes.notUpgraded)}`, // eslint-disable-line no-nested-ternary
          label: classes.label,
        }}
        label={chipLabel}
        onClick={yourFeaturePackageExceedsOrEquals || onClickDisabled ? undefined : this.onClickHandler}
        onMouseDown={this.preventFocus}
        clickable
      />
    );
  }
}
SettingsAccountLevelChip.propTypes = {
  chosenFeaturePackage: PropTypes.oneOf(['FREE', 'PROFESSIONAL', 'ENTERPRISE']),
  classes: PropTypes.object,
  ignoreIfUpgraded: PropTypes.bool,
  onClickDisabled: PropTypes.bool,
  requiredFeaturePackage: PropTypes.oneOf(['PROFESSIONAL', 'ENTERPRISE']),
};

const styles = {
  root: {
    height: 20,
    marginLeft: 4,
  },
  label: {
    paddingLeft: 8,
    paddingRight: 8,
    fontSize: 12,
  },
  notUpgraded: {
    backgroundColor: 'rgb(242, 230, 210)',
    color: 'rgb(192, 133, 17)',
    '&:hover, &:focus, &:active': {
      backgroundColor: 'rgb(44, 58, 95)',
      color: 'white',
    },
  },
  notUpgradedNoHover: {
    backgroundColor: 'rgb(242, 230, 210)',
    color: 'rgb(192, 133, 17)',
    '&:hover, &:focus, &:active, &:visited': {
      backgroundColor: 'rgb(242, 230, 210)',
      color: 'rgb(192, 133, 17)',
      textDecoration: 'none', // Not working
    },
  },
  alreadyUpgraded: {
    backgroundColor: 'rgb(232, 232, 232)',
    color: 'rgb(170, 170, 170)',
    '&:hover, &:focus, &:active': {
      backgroundColor: 'rgb(4,193,108)',
      color: 'white',
    },
  },
};

export default withStyles(styles)(SettingsAccountLevelChip);
