import { Button } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import { OverlayTrigger } from 'react-bootstrap'; // TODO APRIL 2021:  Replace with MUI
import Popover from 'react-bootstrap/Popover';
import { isAndroid, isIOS } from '../../common/utils/cordovaUtils';
import { isWebApp } from '../../common/utils/isCordovaOrWebApp';
import isMobileScreenSize from '../../common/utils/isMobileScreenSize';
import { renderLog } from '../../common/utils/logging';


class ReadyInformationDisclaimer extends React.Component {
  render () {
    renderLog('ReadyInformationDisclaimer');  // Set LOG_RENDER_EVENTS to log all renders

    const cardStyles = {
      backgroundClip: 'border-box',
      backgroundColor: 'white',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.14), 0 2px 1px -1px rgba(0, 0, 0, 0.12)',
      display: 'flex',
      flexDirection: 'column',
      // margin: '16px -16px 16px -16px',
      minWidth: 0,
      padding: '18px 16px 18px 16px',
      position: 'relative',
      wordWrap: 'break-word',
    };

    const { top, bottom } = this.props;

    if ((isAndroid() && bottom) || (isIOS() && top) || (isWebApp() && top)) {
      return null;
    }
    return (
      <div style={cardStyles}>
        <span>
          <span style={{ fontWeight: 'bold' }}>
            WeVote helps you make your voting choices, but it does not electronically submit your vote.
          </span>
          <div style={{ padding: '6px' }} />
          You will still need to vote by mail, or vote in person, to have your vote count.
        </span>
        <OverlayTrigger
          trigger="click"
          key="top"
          placement="top"
          overlay={isMobileScreenSize() ? (<span />) : (
            <Popover id="popover-positioned-top">
              <Popover.Content>
                <strong>
                  WeVote aggregates ballot data from non-partisan, non-profit, and government ballot databases.
                </strong>
                <br />
                <br />
                A balanced selection of clearly identified voting guides from newspapers
                and media is provided, along with partisan voter guides from a diversity of sources.
                <br />
                <br />
                These voting guides are captured and updated by volunteers.
              </Popover.Content>
            </Popover>
          )}
        >
          <div style={{ justifyContent: 'center', paddingTop: '10px' }}>
            <div style={{ width: '50%', margin: '0 auto' }}>
              <Button
                variant="outlined"
                fullwidth="false"
                size="small"
                style={{
                  backgroundColor: 'rgb(46, 60, 93)',
                  fontSize: '.75rem',
                  lineHeight: 1,
                  color: 'white',
                }}
              >
                Where WeVote gets its data
              </Button>
            </div>
          </div>
        </OverlayTrigger>
      </div>
    );
  }
}
ReadyInformationDisclaimer.propTypes = {
  bottom: PropTypes.bool,
  top: PropTypes.bool,
};

export default ReadyInformationDisclaimer;
