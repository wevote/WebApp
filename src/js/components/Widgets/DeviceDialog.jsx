import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Table, TableBody, TableCell, TableHead, TableRow, TextField } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { getAndroidSize, getIOSSizeString, hasIPhoneNotch, isAndroid, isIOS, isSimulator } from '../../common/utils/cordovaUtils';
import historyPush from '../../common/utils/historyPush';
import { getTabletSize } from '../../common/utils/isMobileScreenSize';
import { renderLog } from '../../common/utils/logging';
import compileDate from '../../compileDate';
import VoterStore from '../../stores/VoterStore';
import { TermsAndPrivacyText } from '../Style/pageLayoutStyles';


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

  jumpTo () {    // /findfriends/set_up_page
    const { $ } = window;
    const val = $('#outlinedJump').val();  // none
    console.log('DeviceDialog jumpTo historyPush', val);
    historyPush(val);
  }


  render () {
    renderLog('DeviceDialog');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes } = this.props;
    if (!this.props.show) {
      return null;
    }
    // HACK 10/2/23 const { diameter } = window.pbakondyScreenSize;
    const diameter = 'unknown';

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
                <StyledTableCell>Param</StyledTableCell>
                <StyledTableCell>Value</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <StyledTableCell>window.device.model</StyledTableCell>
                <StyledTableCell>{window.device.model}</StyledTableCell>
              </TableRow>
              <TableRow>
                <StyledTableCell>device OS version</StyledTableCell>
                <StyledTableCell>{`${window.device.platform} ${window.device.version}`}</StyledTableCell>
              </TableRow>
              <TableRow>
                <StyledTableCell>Diagonal Screen Size</StyledTableCell>
                <StyledTableCell>{diameter || 'n/a'}</StyledTableCell>
              </TableRow>
              {isAndroid() && (
                <TableRow>
                  <StyledTableCell>Android Size Code</StyledTableCell>
                  <StyledTableCell>{getAndroidSize()}</StyledTableCell>
                </TableRow>
              )}
              {isIOS() && (
                <TableRow>
                  <StyledTableCell>iPhone Size Code</StyledTableCell>
                  <StyledTableCell>{getIOSSizeString()}</StyledTableCell>
                </TableRow>
              )}
              <TableRow>
                <StyledTableCell>Cordova Tablet Size</StyledTableCell>
                <StyledTableCell>{getTabletSize()}</StyledTableCell>
              </TableRow>
              <TableRow>
                <StyledTableCell>window.screen.width</StyledTableCell>
                <StyledTableCell>{window.screen.width}</StyledTableCell>
              </TableRow>
              <TableRow>
                <StyledTableCell>window.screen.height</StyledTableCell>
                <StyledTableCell>{window.screen.height}</StyledTableCell>
              </TableRow>
              <TableRow>
                <StyledTableCell>window.devicePixelRatio</StyledTableCell>
                <StyledTableCell>{window.devicePixelRatio}</StyledTableCell>
              </TableRow>
              <TableRow>
                <StyledTableCell>width</StyledTableCell>
                <StyledTableCell>{window.screen.width * window.devicePixelRatio}</StyledTableCell>
              </TableRow>
              <TableRow>
                <StyledTableCell>height</StyledTableCell>
                <StyledTableCell>{window.screen.height * window.devicePixelRatio}</StyledTableCell>
              </TableRow>
              <TableRow>
                <StyledTableCell>Version</StyledTableCell>
                <StyledTableCell>{window.weVoteAppVersion}</StyledTableCell>
              </TableRow>
              <TableRow>
                <StyledTableCell>Compile date</StyledTableCell>
                <StyledTableCell>{compileDate}</StyledTableCell>
              </TableRow>
              <TableRow>
                <StyledTableCell>Your internal We Vote id</StyledTableCell>
                <StyledTableCell>{VoterStore.getVoter().we_vote_id}</StyledTableCell>
              </TableRow>
            </TableBody>
          </Table>
          {/* Show the developer options if on the simulator in iOS, or the SHOW_TEST_OPTIONS is on, or Cordova offset logging is turned on -- should not show in release builds */}
          { isSimulator() &&
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
            <span style={{ padding: '10px 25px 10px 0px' }}>Attributions:</span>
            <Link to="/more/attributions" style={{ color: 'blue', textDecoration: 'underline' }}>Attributions</Link>
          </DeviceFinePrint>
          { isSimulator() && (
            <div style={{ padding: 10 }}>
              <TextField
                id="outlinedJump"
                label="relative url"
                defaultValue={window.location.hash.replace('#', '')}
                variant="outlined"
                className={classes.root}
                autoFocus
              />
              <Button
                classes={{ root: classes.saveButton }}
                color="primary"
                id="editAddressOneHorizontalRowSaveButton"
                onClick={() => this.jumpTo()}
                variant="contained"
                style={{ margin: 10 }}
              >
                Jump
              </Button>
            </div>
          )}
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
  font-size: 1rem;
  margin: 1rem;
`;

const StyledTableCell = styled(TableCell)`
  padding: 8px 16px;
`;


export default withTheme(withStyles(styles)(DeviceDialog));
