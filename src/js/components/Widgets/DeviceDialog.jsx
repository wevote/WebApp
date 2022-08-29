import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { getAndroidSize, hasIPhoneNotch, isAndroid } from '../../common/utils/cordovaUtils';
import { renderLog } from '../../common/utils/logging';
import compileDate from '../../compileDate';
import VoterStore from '../../stores/VoterStore';
import { TermsAndPrivacyText } from '../Style/pageLayoutStyles';


const webAppConfig = require('../../config');

class DeviceDialog extends Component {
  static clearAllCookies () {
    // 11/6/21  need to reimplement for new Cookies... if it is even needed
    // const cookies = document.cookie.split(';');
    // const d = new Date();
    // d.setDate(d.getDate() - 1);
    //
    // for (let i = 0; i < cookies.length; i++) {
    //   const spcook =  cookies[i].split('=');
    //
    //   console.log('DEBUG CORDOVA delete one Cookie: ', spcook[0]);
    //   document.cookie = `${spcook[0]}=; expires=${d}; path=/;`;
    // }
    //
    // window.location = ''; // TO REFRESH THE "PAGE"
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
          <div className="text-center"><TermsAndPrivacyText>Device Information</TermsAndPrivacyText></div>
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
                <TableCell>device OS version</TableCell>
                <TableCell>{`${window.device.platform} ${window.device.version}`}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Usable Screen Size</TableCell>
                <TableCell>{window.devicePixelRatio || 'n/a'}</TableCell>
              </TableRow>
              {isAndroid() && (
                <TableRow>
                  <TableCell>Android Size Code</TableCell>
                  <TableCell>{getAndroidSize()}</TableCell>
                </TableRow>
              )}
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
          {(window.location.href.startsWith('file:///Users') || webAppConfig.SHOW_TEST_OPTIONS || webAppConfig.LOG_CORDOVA_OFFSETS) &&
            (
              <div style={{ marginTop: 20 }}>
                <div style={{ marginTop: 5 }}>
                  <span className="card-main__candidate-name-link">
                    <Link to="/wevoteintro/network">Navigate to Welcome</Link>
                  </span>
                </div>
                <div style={{ marginTop: 5 }}>
                  <span className="card-main__candidate-name-link">
                    <Link onClick={DeviceDialog.clearLocationGuessClosedCookie} to="/">Clear Location Guess Cookie</Link>
                  </span>
                </div>
                <div style={{ marginTop: 5 }}>
                  <span className="card-main__candidate-name-link">
                    <Link onClick={DeviceDialog.clearAllCookies} to="/">Clear Cookies</Link>
                  </span>
                </div>
              </div>
            )}
          <DeviceFinePrint>
            <TermsAndPrivacyText>
              Your internal We Vote id: &nbsp;
              {VoterStore.getVoter().we_vote_id}
            </TermsAndPrivacyText>
          </DeviceFinePrint>
          <DeviceFinePrint>
            <TermsAndPrivacyText>
              Version: &nbsp;
              {window.weVoteAppVersion}
            </TermsAndPrivacyText>
          </DeviceFinePrint>
          <DeviceFinePrint>
            <TermsAndPrivacyText>
              Compile date:&nbsp;
              {compileDate}
            </TermsAndPrivacyText>
          </DeviceFinePrint>
          <DeviceFinePrint>
            <Link to="/more/faq">Attributions:</Link>
            <span style={{ paddingLeft: 20 }} />
            <Link to="/more/attributions">Attributions</Link>
          </DeviceFinePrint>
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

const DeviceFinePrint = styled('div')`
  color: #555;
  font-size: .75rem;
  margin-top: 0.5rem;
`;

export default withTheme(withStyles(styles)(DeviceDialog));
