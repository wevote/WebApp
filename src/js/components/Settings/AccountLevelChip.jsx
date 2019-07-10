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

class AccountLevelChip extends Component {
  static propTypes={ classes: PropTypes.object };

  constructor (props) {
    super(props);
    this.state = {};
  }

  render () {
    renderLog(__filename);
    const { classes } = this.props;
    return (
      <Chip
        classes={{
          root: classes.root,
          label: classes.label,
        }}
        label="testing chip"
        size="small"
      />
    );
  }
}

export default withStyles(styles)(AccountLevelChip);
