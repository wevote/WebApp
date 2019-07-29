import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

class PremiumableButton extends PureComponent {
  static propTypes = {
    premium: PropTypes.number, // This can't be a bool or else there'll be a warning.
    children: PropTypes.node,
    classes: PropTypes.object,
  };

  render () {
    const { premium, children, classes } = this.props;
    return (
      <React.Fragment>
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
              classes={{ root: classes.goldButton }}
              variant="contained"
            >
              {children}
            </Button>
          )
        }
      </React.Fragment>
    );
  }
}

const styles = ({
  goldButton: {
    background: 'linear-gradient(70deg, rgba(219,179,86,1) 14%, rgba(162,124,33,1) 94%)',
    color: 'white',
    whiteSpace: 'nowrap',
  },
});

export default withStyles(styles)(PremiumableButton);
