import React, { Component } from 'react';
import Chip from '@material-ui/core/Chip';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { renderLog } from '../../utils/logging';
import AppActions from '../../actions/AppActions';

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
    '&:hover, &:focus': {
      backgroundColor: 'rgb(44, 58, 95)',
      color: 'white',
    },
  },
  alreadyUpgraded: {
    backgroundColor: 'rgb(232, 232, 232)',
    color: 'rgb(170, 170, 170)',
    '&:hover, &:focus': {
      backgroundColor: 'rgb(4,193,108)',
      color: 'white',
    },
  },
};

class SettingsAccountLevelChip extends Component {
  static propTypes = {
    userAccountLevel: PropTypes.oneOf(['free', 'pro', 'enterprise']),
    featureAccountLevel: PropTypes.oneOf(['pro', 'enterprise']),
    classes: PropTypes.object,
  };

  onClickHandler = () => {
    const mode = this.props.featureAccountLevel === 'pro' ? 'professional' : 'enterprise';
    this.openPaidAccountUpgradeModal(mode);
  }

  openPaidAccountUpgradeModal = (paidAccountUpgradeMode) => {
    AppActions.setShowPaidAccountUpgradeModal(paidAccountUpgradeMode);
  }

  render () {
    renderLog(__filename);
    const { userAccountLevel, featureAccountLevel, classes } = this.props;
    const userAlreadyUpgraded = userAccountLevel === 'enterprise' || (userAccountLevel === 'pro' && featureAccountLevel === 'pro');
    const chipLabel = userAccountLevel === 'enterprise' ? 'ENTERPRISE' : featureAccountLevel.toUpperCase();
    return (
      <Chip
        classes={{
          root: `${classes.root} ${userAlreadyUpgraded ? classes.alreadyUpgraded : classes.notUpgraded}`,
          label: classes.label,
        }}
        label={chipLabel}
        onClick={userAlreadyUpgraded ? undefined : this.onClickHandler}
        clickable
      />
    );
  }
}

export default withStyles(styles)(SettingsAccountLevelChip);
