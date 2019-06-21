import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import { withStyles, withTheme } from '@material-ui/core';
import DialogTitle from '@material-ui/core/DialogTitle';
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
    renderLog(__filename);
    const { classes } = this.props;

    if (isWebApp()) {
      return (
        <Dialog
          classes={{ paper: classes.dialogPaper }}
          open
          onClose={() => { this.openPollingLocationModal(); }}
        >
          <DialogTitle>
            <div className="intro-modal__h1">
              Find Your Polling Location
            </div>
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
    [theme.breakpoints.down('sm')]: {
      minWidth: '90%',
      maxWidth: '90%',
      width: '90%',
      minHeight: '90%',
      maxHeight: '90%',
      height: '90%',
      margin: '0 auto',
    },
  },
  dialogContent: {
    [theme.breakpoints.down('md')]: {
      padding: '0 8px 8px',
    },
  },
});

export default withTheme()(withStyles(styles)(PollingPlaceLocatorModal));
