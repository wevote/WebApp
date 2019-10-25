import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import { withStyles, withTheme } from '@material-ui/core';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import PollingPlaceLocator from '../../components/Vote/PollingPlaceLocator';
import { renderLog } from '../../utils/logging';
import {
  cordovaOpenSafariView, hasIPhoneNotch, historyPush, isWebApp,
} from '../../utils/cordovaUtils';


class PollingPlaceLocatorModal extends Component {
  static propTypes = {
    classes: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.state = {
      showPollingLocatorModal: true,
    };
    this.openPollingLocationModal = this.openPollingLocationModal.bind(this);
  }

  openPollingLocationModal () {
    const { showPollingLocatorModal } = this.state;
    this.setState({ showPollingLocatorModal: !showPollingLocatorModal });
    historyPush('/ballot/vote');
  }

  render () {
    renderLog('PollingPlaceLocatorModal');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes } = this.props;

    if (isWebApp()) {
      return (
        <Dialog
          classes={{ paper: classes.dialogPaper }}
          open
          onClose={() => { this.openPollingLocationModal(); }}
        >
          <DialogTitle>
            <Typography variant="h6" className="text-center">Find Your Polling Location</Typography>
            <IconButton
              aria-label="Close"
              classes={{ root: classes.closeButton }}
              onClick={() => { this.openPollingLocationModal(); }}
              id="profileClosePollingPlaceLocatorModal"
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <DialogContent classes={{ root: classes.dialogContent }}>
            <div key={1}><PollingPlaceLocator /></div>
          </DialogContent>
        </Dialog>
      );
    } else {
      return (
        <div>
          { cordovaOpenSafariView('https://wevote.us/vip.html', historyPush('/ballot/vote'), 50) }
        </div>
      );
    }
  }
}
const styles = theme => ({
  dialogPaper: {
    marginTop: hasIPhoneNotch() ? 68 : 48,
    [theme.breakpoints.up('sm')]: {
      minWidth: '80%',
      maxWidth: '80%',
      width: '80%',
      minHeight: '90%',
      maxHeight: '90%',
      height: '90%',
      margin: '0 auto',
    },
    [theme.breakpoints.down('sm')]: {
      minWidth: '95%',
      maxWidth: '95%',
      width: '95%',
      minHeight: '90%',
      maxHeight: '90%',
      height: '90%',
      margin: '0 auto',
    },
  },
  dialogContent: {
    [theme.breakpoints.down('md')]: {
      padding: '0 8px 8px',
      overflow: 'hidden',
    },
  },
  closeButton: {
    position: 'absolute',
    right: `${theme.spacing(1)}px`,
    top: `${theme.spacing(1)}px`,
  },
});

export default withTheme(withStyles(styles)(PollingPlaceLocatorModal));
