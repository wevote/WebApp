import { Settings } from '@mui/icons-material';
import { Tooltip } from '@mui/material';
import styled from '@mui/material/styles/styled';
import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import { isAndroid, isAndroidSizeFold, isIOSAppOnMac, isIPad } from '../../common/utils/cordovaUtils';
import { isWebApp } from '../../common/utils/isCordovaOrWebApp';
import isMobileScreenSize from '../../common/utils/isMobileScreenSize';
import { renderLog } from '../../common/utils/logging';

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

  // shortenElectionNameCordova () {
  //   if (isIPhone3p5in() || isIPhone4in()) {
  //     return 26;  // iphone5-or-smaller
  //   } if (isIPad()) {
  //     return 60;
  //   } else {
  //     return 30;
  //   }
  // }

  marginTopOffset () {
    const { scrolled } = this.props;
    if (isIOSAppOnMac()) {
      return '44px';
    } else if (isIPad()) {
      return '12px';
    } else if (isWebApp() && isMobileScreenSize()) {
      return '24px';
    } else if (isWebApp()) {
      if (scrolled) {
        return '64px';
      } else {
        return '110px';
      }
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
        <BallotTitleHeaderWrapper marginTopOffset={this.marginTopOffset()}>
          <ContentWrapper>
            <OverflowContainer>
              <OverflowContent>
                <ElectionNameScrollContent>
                  <Tooltip title="Change my election" aria-label="Change Election" classes={{ tooltipPlacementBottom: classes.tooltipPlacementBottom }}>
                    <Title onClick={() => this.props.toggleSelectBallotModal('', false, false)} id="ballotTitleHeaderSelectBallotModal">
                      <ElectionName>
                        {electionName}
                        {/*
                        {isWebApp() ? (
                          <span>
                            {electionName}
                          </span>
                        ) : (
                          <span className="electionNameCordova">
                            {shortenText(electionName, this.shortenElectionNameCordova())}
                          </span>
                        )}
                        */}
                        <SettingsIconWrapper>
                          <Settings classes={{ root: classes.settingsIcon }} />
                        </SettingsIconWrapper>
                      </ElectionName>
                    </Title>
                  </Tooltip>
                </ElectionNameScrollContent>
              </OverflowContent>
            </OverflowContainer>
            {electionDayTextObject && (
              <ShareButtonWrapper>
                <Suspense fallback={<></>}>
                  <ShareButtonDesktopTablet />
                </Suspense>
              </ShareButtonWrapper>
            )}
          </ContentWrapper>
          {electionDayTextObject && (
            <div>
              {' '}
              <ElectionDate>{electionDayTextObject}</ElectionDate>
            </div>
          )}
        </BallotTitleHeaderWrapper>
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

const BallotTitleHeaderWrapper = styled('div', {
  shouldForwardProp: (prop) => !['marginTopOffset'].includes(prop),
})(({ marginTopOffset }) => (`
  margin-top: ${marginTopOffset};
  height: 45px;
  transition: all 150ms ease-in;
`));

const ContentWrapper = styled('div')`
  display: flex;
  flex: 1;
  min-height: 0px;
`;

const ElectionName = styled('div')(({ theme }) => (`
  font-size: 32px;
  ${theme.breakpoints.down('sm')} {
    font-size: 28px;
  }
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`));

const ElectionNameScrollContent = styled('div')`
`;

const OverflowContent = styled('div')(({ theme }) => (`
  display: block;
  flex: 1;
  height: 40px;
  ${theme.breakpoints.down('sm')} {
    height: 32px;
  }
`));

const OverflowContainer = styled('div')`
  flex: 1;
  // overflow-x: hidden;
  // overflow-y: hidden;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ElectionDate = styled('div')(({ theme }) => (`
  font-size: 14px;
  ${theme.breakpoints.up('sm')} {
    font-size: 16px;
  }
`));

const SettingsIconWrapper = styled('span')`
`;

const ShareButtonWrapper = styled('div')(({ theme }) => (`
  display: none;
  margin-left: auto;
  margin-top: 4px;
  ${theme.breakpoints.up('sm')} {
    display: block;
  }
`));

const Title = styled('h1')`
  cursor: pointer;
  margin: 0;
`;

export default withTheme(withStyles(styles)(BallotTitleHeader));
