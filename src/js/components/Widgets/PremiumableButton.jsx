import { Button } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';

class PremiumableButton extends PureComponent {
  render () {
    const { premium, children, classes, id, onClick, disabled } = this.props;

    return (
      <>
        {premium ?
          (
            <Button
              id={id}
              onClick={onClick}
              disabled={disabled}
              classes={{ root: classes.root }}
              color="primary"
              variant="contained"
            >
              {children}
            </Button>
          ) :
          (
            <Button
              id={id}
              onClick={onClick}
              disabled={disabled}
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
  id: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
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
