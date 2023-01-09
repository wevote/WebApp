import { Snackbar } from '@mui/material';
import Alert from '@mui/material/Alert';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { snackOffset } from '../../utils/cordovaUtils';
import { renderLog } from '../../utils/logging';
import AppObservableStore from '../../stores/AppObservableStore';

// Alert is in Mui Version 5, and won't have to be included from the "Lab"

let openSnackbarFn;

class SnackNotifier extends Component {
  constructor (props) {
    super(props);
    this.state = {
      open: false,
      message: '',
      severity: '',
    };
  }

  componentDidMount () {
    // console.log('SnackNotifier componentDidMount');
    openSnackbarFn = this.openSnackbar;
  }

  handleSnackbarClose = () => {
    this.setState({
      open: false,
      message: '',
      severity: '',
    });
  };

  openSnackbar = ({ message, severity, duration }) => {
    const autoHideDuration = duration || 3000;
    if (!message) {
      // eslint-disable-next-line no-param-reassign
      message = AppObservableStore.getPendingSnackMessage();
      if (message && message.length === 0) {
        return;
      }
    }
    AppObservableStore.setPendingSnackMessage('');
    if (!severity) {
      // eslint-disable-next-line no-param-reassign
      severity = AppObservableStore.getPendingSnackSeverity();
      if (!['error', 'info', 'success', 'warning'].includes(severity)) {
        // console.log('SnackNotifier received invalid severity: ', severity, ', message:', message);
        // eslint-disable-next-line no-param-reassign
        severity = 'success';
      }
    }

    this.setState({ open: true, message, severity, autoHideDuration  });
  };

  getStyles  = (severity) => {
    switch (severity) {
      case 'error':
        return {
          color: 'white',
          backgroundColor: '#313131',
        };
      case 'info':
        return {
          color: 'white',
          backgroundColor: '#313131',
        };
      case 'warning':
        return {
          color: 'white',
          backgroundColor: '#313131',
        };
      default:
      case 'success':
        return {
          color: 'white',
          backgroundColor: '#313131',
        };
    }
  }

  render () {
    renderLog('SnackNotifier');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes } = this.props;
    const { open, message, severity, autoHideDuration } = this.state;

    if (!message || message.length === 0) return <></>;
    // console.log('severity:', severity);
    return (
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        autoHideDuration={autoHideDuration}
        onClose={this.handleSnackbarClose}
        open={open}
        ContentProps={{
          'aria-describedby': 'snackbar-message-id',
        }}
        classes={{ anchorOriginBottomCenter: classes.anchorOriginBottomCenter }}
      >
        <Alert
          classes={{ root: classes.alertStyle }}
          severity={severity}
          style={this.getStyles(severity)}
          variant="standard"
        >
          {message}
        </Alert>
      </Snackbar>
    );
  }
}
SnackNotifier.propTypes = {
  classes: PropTypes.object,
};

const styles = () => ({
  alertStyle: {
    zIndex: '9020 !important', // z-index: 9020
  },
  anchorOriginBottomCenter: {
    bottom: snackOffset(),
  },
});

function isFunction (functionToCheck) {
  return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}

export function openSnackbar ({ message, severity, duration }) {
  if (isFunction(openSnackbarFn)) {
    openSnackbarFn({ message, severity, duration });
  } else {
    console.error('*** SnackNotifier was not initialized before first use in the parent class ***');
  }
}

export default withStyles(styles)(SnackNotifier);
