import React, { Component } from 'react';
import Chip from '@material-ui/core/Chip';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { renderLog } from '../../utils/logging';

const styles = {
  root: {
    height: 24,
    marginLeft: 4,
  },
  label: {
    paddingLeft: 8,
    paddingRight: 8,
  },
};

class SettingsAccountLevelChip extends Component {
  static propTypes = {
    accountLevel: PropTypes.oneOf(['free', 'pro', 'enterprise']),
    featureIsEnterpriseLevel: PropTypes.bool,
    classes: PropTypes.object,
    size: PropTypes.string,
  };

  constructor (props) {
    super(props);
    this.state = {};
  }

  render () {
    renderLog(__filename);
    const { accountLevel, classes, size } = this.props;
    return (
      <Chip
        classes={size === 'small' ? {
          root: classes.root,
          label: classes.label,
        } : {}}
        label={accountLevel === 'enterprise' ? 'ENTERPRISE' : 'PRO'}
      />
    );
  }
}

export default withStyles(styles)(SettingsAccountLevelChip);
