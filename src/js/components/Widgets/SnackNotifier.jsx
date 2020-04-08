import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';

let openSnackbarFn;

class SnackNotifier extends Component {
  static propTypes = {
    classes: PropTypes.object,
  };

  state = {
    open: false,
    message: '',
  };

  componentDidMount () {
    openSnackbarFn = this.openSnackbar;
  }

  handleSnackbarClose = () => {
    this.setState({
      open: false,
      message: '',
    });
  };

  openSnackbar = ({ message }) => {
    this.setState({ open: true, message });
  };

  render () {
    const { classes } = this.props;
    const { message } = this.state;
    // console.log('SnackNotifier.jsx message: ', message);

    return (
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        autoHideDuration={3000}
        message={<span id="message-id">{ message }</span>}
        onClose={this.handleSnackbarClose}
        open={this.state.open}
        ContentProps={{
          'aria-describedby': 'snackbar-message-id',
        }}
        classes={{ anchorOriginBottomCenter: classes.anchorOriginBottomCenter }}
      />
    );
  }
}

const styles = () => ({
  anchorOriginBottomCenter: {
    bottom: '75px !important',
  },
});

function isFunction (functionToCheck) {
  return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}

export function openSnackbar ({ message }) {
  if (isFunction(openSnackbarFn)) {
    openSnackbarFn({ message });
  } else {
    console.log('*** SnackNotifier openSnackbarFn not a Function');
  }
}

export default withStyles(styles)(SnackNotifier);
