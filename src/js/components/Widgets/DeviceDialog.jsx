import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogActions, DialogContent, DialogTitle, Table, TableBody, TableCell, TableHead, TableRow, Button } from '@material-ui/core';
import { withStyles, withTheme } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import { hasIPhoneNotch } from '../../utils/cordovaUtils';
import { renderLog } from '../../utils/logging';
import { startsWith } from '../../utils/textFormat';
import VoterStore from '../../stores/VoterStore';

const webAppConfig = require('../../config');

class DeviceDialog extends Component {
  // This can only be called by a developer running Cordova in an Simulator.  Voters will never see it.
  static clearAllCookies () {
    const cookies = document.cookie.split(';');
    const d = new Date();
    d.setDate(d.getDate() - 1);

    for (let i = 0; i < cookies.length; i++) {
      const spcook =  cookies[i].split('=');

      console.log('DEBUG CORDOVA delete one Cookie: ', spcook[0]);
      document.cookie = `${spcook[0]}=; expires=${d}; path=/;`;
    }

    window.location = ''; // TO REFRESH THE "PAGE"
  }

  static clearLocationGuessClosedCookie () {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    document.cookie = `location_guess_closed=; expires=${d}; path=/;`;
  }

  constructor (props) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
  }

  handleClose () {
    console.log('Cordova device handleClose() was called');
    this.props.show = false;
  }


  render () {
    renderLog('DeviceDialog');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes } = this.props;

    if (!this.props.show) {
      return null;
    }

    return (
      <Dialog
        classes={{ paper: classes.dialogPaper }}
        open={this.props.show}
      >
        <DialogTitle>
          <div className="text-center">Device Information</div>
        </DialogTitle>
        <DialogContent classes={{ root: classes.dialogContent }}>
          This dialog contains technical information about your device, that might be requested by We Vote&apos;s support engineers.
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>Param</TableCell>
                <TableCell>Value</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>window.device.model</TableCell>
                <TableCell>{window.device.model}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>window.screen.width</TableCell>
                <TableCell>{window.screen.width}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>window.screen.height</TableCell>
                <TableCell>{window.screen.height}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>window.devicePixelRatio</TableCell>
                <TableCell>{window.devicePixelRatio}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>width</TableCell>
                <TableCell>{window.screen.width * window.devicePixelRatio}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>height</TableCell>
                <TableCell>{window.screen.height * window.devicePixelRatio}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          {/* Show the developer options if on the simulator in iOS, or the SHOW_TEST_OPTIONS is on, or Cordova offset logging is turned on -- should not show in release builds */}
          {(startsWith('file:///Users', window.location.href) || webAppConfig.SHOW_TEST_OPTIONS || webAppConfig.LOG_CORDOVA_OFFSETS) &&
            (
              <div style={{ marginTop: 20 }}>
                <div style={{ marginTop: 5 }}>
                  <span className="card-main__candidate-name-link">
                    <Link to="/wevoteintro/network" onlyActiveOnIndex>Navigate to Welcome</Link>
                  </span>
                </div>
                <div style={{ marginTop: 5 }}>
                  <span className="card-main__candidate-name-link">
                    <Link onClick={DeviceDialog.clearLocationGuessClosedCookie} to="/" onlyActiveOnIndex>Clear Location Guess Cookie</Link>
                  </span>
                </div>
                <div style={{ marginTop: 5 }}>
                  <span className="card-main__candidate-name-link">
                    <Link onClick={DeviceDialog.clearAllCookies} to="/" onlyActiveOnIndex>Clear Cookies</Link>
                  </span>
                </div>
              </div>
            )}
          <div className="card-child__fine_print" style={{ marginTop: '0.5rem', fontSize: '0.75rem' }}>
            Your internal We Vote id: &nbsp;
            {VoterStore.getVoter().we_vote_id}
          </div>
          <div className="card-child__fine_print" style={{ marginTop: '0.5rem', fontSize: '0.75rem' }}>
            Version: &nbsp;
            {window.weVoteAppVersion}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.visibilityOffFunction} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
DeviceDialog.propTypes = {
  classes: PropTypes.object,
  show: PropTypes.bool,
  visibilityOffFunction: PropTypes.func.isRequired,
};

const styles = (theme) => ({
  dialogPaper: {
    marginTop: hasIPhoneNotch() ? 68 : 48,
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
  table: {
    width: '85%',
    paddingTop: 10,
  },
  dialogContent: {
    padding: '8px 8px 8px',
  },
});

export default withTheme(withStyles(styles)(DeviceDialog));
