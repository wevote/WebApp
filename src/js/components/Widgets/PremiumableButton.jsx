import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';

import { Button } from '@material-ui/core';

class PremiumableButton extends PureComponent {
  render () {
    const { premium, children, classes } = this.props;
    return (
      <>
        {premium ?
          (
            <Button
              {...this.props}
              color="primary"
              variant="contained"
            >
              {children}
            </Button>
          ) :
          (
            <Button
              {...this.props}
              classes={{ root: classes.containedSecondary }}
              variant="contained"
            >
              {children}
            </Button>
          )}
      </>
    );
  }
}
PremiumableButton.propTypes = {
  premium: PropTypes.number, // This can't be a bool or else there'll be a warning.
  children: PropTypes.node,
  classes: PropTypes.object,
};

const styles = ({
  containedSecondary: {
    background: 'linear-gradient(70deg, rgba(219,179,86,1) 14%, rgba(162,124,33,1) 94%)',
    color: 'white',
    whiteSpace: 'nowrap',
  },
  root: {},
});

export default withStyles(styles)(PremiumableButton);
