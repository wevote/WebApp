import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/esm/Button';
import { withStyles } from '@material-ui/core/esm/styles';

class BallotShareButton extends Component {
  static propTypes = {
    classes: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.state = {

    };
  }

  render () {
    const { classes } = this.props;

    return (
      <Button className={classes.button} variant="outlined" color="primary">
        <i className="fas fa-share" />
        {' '}
        Share
      </Button>
    );
  }
}

const styles = () => ({
  button: {
    padding: '0 12px',
  },
});

export default withStyles(styles)(BallotShareButton);
