import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import { renderLog } from '../../utils/logging';

const styles = theme => ({
  anchorOriginBottomCenter: {
    bottom: 54,
    [theme.breakpoints.up('md')]: {
      bottom: 20,
    },
  },
});

class BrowserPushMessage extends Component {
  static propTypes = {
    incomingProps: PropTypes.object, // needs more specificity
    classes: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.state = {
      open: true,
    };
  }

  componentWillReceiveProps (nextProps) {
    // When a new candidate is passed in, update this component to show the new data
    if (nextProps.incomingProps && nextProps.incomingProps.location && nextProps.incomingProps.location.state) {
      this.setState({
        message: nextProps.incomingProps.location.state.message,
        name: nextProps.incomingProps.location.state.message_name,
        type: nextProps.incomingProps.location.state.message_type,
      });
    }
  }

  handleClose = () => this.setState({ open: false });

  render () {
    renderLog(__filename);
    const { classes } = this.props;
    let { message, type } = this.state;
    const { name } = this.state;

    if (name === 'test') {
      type = 'danger';
      message = 'Test message';
    }

    if (!type) {
      type = 'info';
    }

    return (
      <Snackbar
        classes={{ anchorOriginBottomCenter: classes.anchorOriginBottomCenter }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        open={this.state.open && message}
        autoHideDuration={5000}
        onClose={this.handleClose}
        ContentProps={{
          'aria-describedby': 'message-id',
        }}
        message={<span id="message-id">{message}</span>}
        action={[
          <IconButton
            key="close"
            aria-label="Close"
            color="inherit"
            onClick={this.handleClose}
          >
            <CloseIcon />
          </IconButton>,
        ]}
      />
    );
  }
}

export default withStyles(styles)(BrowserPushMessage);
