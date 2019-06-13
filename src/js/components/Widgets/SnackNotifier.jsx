import React, { Component } from 'react';
import Snackbar from '@material-ui/core/Snackbar';

let openSnackbarFn;

export default class SnackNotifier extends Component {
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
    console.log('openSnackBar message:', message);
    this.setState({ open: true, message });
  };

  render () {
    const { message } = this.state;
    // console.log('SnackNotifier.jsx message: ', message);

    return (
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        message={<span id="message-id">{ message }</span>}
        autoHideDuration={3000}
        onClose={this.handleSnackbarClose}
        open={this.state.open}
        ContentProps={{
          'aria-describedby': 'snackbar-message-id',
        }}
      />
    );
  }
}

export function openSnackbar ({ message }) {
  console.log('function openSnackBar, message: ', message);
  openSnackbarFn({ message });
}
