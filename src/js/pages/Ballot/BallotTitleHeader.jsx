import { Tooltip } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import { Settings } from '@mui/icons-material';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import styled from '@mui/material/styles/styled';
import { isAndroid, isAndroidSizeFold, isIOSAppOnMac, isIPad, isIPhone3p5in, isIPhone4in } from '../../common/utils/cordovaUtils';
import { isWebApp } from '../../common/utils/isCordovaOrWebApp';
import isMobileScreenSize from '../../common/utils/isMobileScreenSize';
import { renderLog } from '../../common/utils/logging';
import { shortenText } from '../../utils/textFormat';

const ShareButtonDesktopTablet = React.lazy(() => import(/* webpackChunkName: 'ShareButtonDesktopTablet' */ '../../components/Share/ShareButtonDesktopTablet'));


class BallotTitleHeader extends Component {
  // shouldComponentUpdate (nextProps) {
  //   // This lifecycle method tells the component to NOT render if componentWillReceiveProps didn't see any changes
  //   if (this.props.electionName !== nextProps.electionName) {
  //     // console.log('this.props.electionName:', this.props.electionName, ', nextProps.electionName:', nextProps.electionName);
  //     return true;
  //   }
  //   return false;
  // }

  shortenElectionNameCordova () {
    if (isIPhone3p5in() || isIPhone4in()) {
      return 26;  // iphone5-or-smaller
    } if (isIPad()) {
      return 60;
    } else {
      return 30;
    }
  }

  marginTopOffset () {
    if (isIOSAppOnMac()) {
      return '44px';
    } else if (isIPad()) {
      return '12px';
    } else if (isAndroidSizeFold()) {
      return '41px';
    } else if (!isAndroid() && this.props.scrolled) {  // 2020-08-19, not sure if this is needed for ios or webapp
      return '12px';
    }
    return 0;
  }

  render () {
    renderLog('BallotTitleHeader');  // Set LOG_RENDER_EVENTS to log all renders
    // const nextReleaseFeaturesEnabled = webAppConfig.ENABLE_NEXT_RELEASE_FEATURES === undefined ? false : webAppConfig.ENABLE_NEXT_RELEASE_FEATURES;
    const { classes, electionName, electionDayTextObject } = this.props;

    if (electionName) {
      return (
        <Wrapper/* margintop={this.marginTopOffset()} */>
          <Tooltip title="Change my election" aria-label="Change Election" classes={{ tooltipPlacementBottom: classes.tooltipPlacementBottom }}>
            <Title onClick={() => this.props.toggleSelectBallotModal('', false, false)} id="ballotTitleHeaderSelectBallotModal">
              <ElectionName/* scrolled={scrolled} */>
                {isWebApp() ? (
                  <>
                    <span className="u-show-mobile-iphone5-or-smaller">
                      {shortenText(electionName, 22)}
                    </span>
                    <span className="u-show-mobile-bigger-than-iphone5">
                      {shortenText(electionName, 27)}
                    </span>
                    <span className="u-show-desktop-tablet">
                      {electionName}
                    </span>
                  </>
                ) : (
                  <span className="electionNameCordova">
                    {shortenText(electionName, this.shortenElectionNameCordova())}
                  </span>
                )}
                <SettingsIconWrapper>
                  <Settings classes={{ root: classes.settingsIcon }} />
                </SettingsIconWrapper>
              </ElectionName>
              {electionDayTextObject && (
                <>
                  {' '}
                  <span className="d-none d-sm-inline">&mdash;</span>
                  {' '}
                  <ElectionDate>{electionDayTextObject}</ElectionDate>
                </>
              )}
            </Title>
          </Tooltip>
          {electionDayTextObject && (
            <ShareButtonWrapper>
              <Suspense fallback={<></>}>
                <ShareButtonDesktopTablet />
              </Suspense>
            </ShareButtonWrapper>
          )}
        </Wrapper>
      );
    } else {
      return (
        <span className="u-push--sm" onClick={this.props.toggleSelectBallotModal} id="ballotTitleHeaderSelectBallotModalLoadingElection">
          Choose Election...
          <SettingsIconWrapper>
            <Settings classes={{ root: classes.settingsIcon }} />
          </SettingsIconWrapper>
        </span>
      );
    }
  }
}
BallotTitleHeader.propTypes = {
  electionName: PropTypes.string,
  electionDayTextObject: PropTypes.object,
  scrolled: PropTypes.bool,
  toggleSelectBallotModal: PropTypes.func,
  classes: PropTypes.object,
};

const styles = {
  settingsIcon: {
    color: '#999',
    marginTop: '-5px',
    marginLeft: '3px',
    width: 16,
    height: 16,
  },
  tooltipPlacementBottom: {
    marginTop: 0,
  },
};

const Wrapper = styled('div')`
  display: flex;
  align-items: center;
  justify-content: space-between;
  // margin-top: ${(props) => (props.margintop)};
  ${() => {
    if (isWebApp() && !isMobileScreenSize()) {
      // TODO: Steve 10/4/21, this is temporary and needs to be more responsive
      return {
        paddingTop: '58px',
        paddingBottom: '12px',
        height: '25px',
      };
    } else {
      return {};
    }
  }};
`;

const Title = styled('h1')`
  cursor: pointer;
  margin: 0;
  @media (min-width: 576px) {
  }
`;

const ElectionName = styled('span')`
  font-size: 16px;
  font-weight: bold;
  @media (min-width: 576px) {
    font-size: 16px;
    font-weight: bold;
  }
`;

const ElectionDate = styled('span')`
  font-size: 14px;
  @media (min-width: 576px) {
    font-size: 16px;
  }
`;

const SettingsIconWrapper = styled('span')`
`;

const ShareButtonWrapper = styled('div')`
  display: none;
  margin-left: auto;
  margin-top: 4px;
  @media (min-width: 576px) {
    display: block;
  }
`;

export default withStyles(styles)(BallotTitleHeader);
