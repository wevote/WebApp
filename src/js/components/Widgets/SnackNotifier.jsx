import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';
import { isWebApp } from '../../utils/cordovaUtils';
import { renderLog } from '../../utils/logging';

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

  openSnackbar = ({ message, duration }) => {
    let autoHideDuration = 3000;
    if (duration) {
      autoHideDuration = duration;
    }

    this.setState({ open: true, message, autoHideDuration  });
  };

  render () {
    renderLog('SnackNotifier');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes } = this.props;
    const { message, autoHideDuration } = this.state;
    // console.log('SnackNotifier.jsx message: ', message);

    return (
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        autoHideDuration={autoHideDuration}
        message={<span id="message-id">{ message }</span>}
        onClose={this.handleSnackbarClose}
        open={this.state.open}
        ContentProps={{
          'aria-describedby': 'snackbar-message-id',
        }}
        classes={{ anchorOriginBottomCenter: isWebApp() ? classes.anchorOriginBottomCenter : classes.anchorOriginBottomCenterCordova }}
      />
    );
  }
}

const styles = () => ({
  anchorOriginBottomCenter: {
    bottom: '75px !important',
  },
  anchorOriginBottomCenterCordova: {
    bottom: '118px !important',
  },
});

function isFunction (functionToCheck) {
  return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}

export function openSnackbar ({ message, duration }) {
  if (isFunction(openSnackbarFn)) {
    openSnackbarFn({ message, duration });
  } else {
    console.log('*** SnackNotifier openSnackbarFn not a Function');
  }
}

export default withStyles(styles)(SnackNotifier);
