import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Suspense } from 'react';
import styled from 'styled-components';
import { isCordova } from '../../common/utils/isCordovaOrWebApp';
import { renderLog } from '../../common/utils/logging';
import normalizedImagePath from '../../common/utils/normalizedImagePath';

const OpenExternalWebSite = React.lazy(() => import(/* webpackChunkName: 'OpenExternalWebSite' */ '../../common/components/Widgets/OpenExternalWebSite'));

const appStoreIcon = '../../../img/global/logos/download_on_the_app_store_badge_us-uk_blk.svg';
const googlePlayIcon = '../../../img/global/logos/google-play-badge-cropped.png';


// React functional component example
function DownloadAppsButtons (props) {
  renderLog('DownloadAppsButtons functional component');
  const { classes, showDownloadText } = props;
  return (
    <AppStoreIconsOuterWrapper>
      {showDownloadText && (
        <DownloadAppText>
          Prefer to text friends?
          <br />
          Download the We Vote App:
        </DownloadAppText>
      )}
      <AppStoreIconsWrapper>
        <span
          role="presentation"
        >
          <Suspense fallback={<></>}>
            <OpenExternalWebSite
              linkIdAttribute="googleBadge"
              className={classes.openExternalWebsiteLink}
              url="https://play.google.com/store/apps/details?id=org.wevote.cordova&hl=en_US"
              target="_blank"
              body={(
                <img
                  alt="Google Play Store badge"
                  src={normalizedImagePath(googlePlayIcon)}
                  className={classes.googleBadgeIcon}
                />
              )}
            />
          </Suspense>
        </span>
        <span
          role="presentation"
        >
          <Suspense fallback={<></>}>
            <OpenExternalWebSite
              linkIdAttribute="appleBadge"
              className={classes.openExternalWebsiteLink}
              url="https://apps.apple.com/us/app/we-vote-voter-guide/id1347335726"
              target="_blank"
              body={(
                <img
                  alt="Apple App Store badge"
                  src={normalizedImagePath(appStoreIcon)}
                  className={classes.appleBadgeIcon}
                />
              )}
            />
          </Suspense>
        </span>
      </AppStoreIconsWrapper>
    </AppStoreIconsOuterWrapper>
  );
}
DownloadAppsButtons.propTypes = {
  classes: PropTypes.object,
  showDownloadText: PropTypes.bool,
};

const styles = (theme) => ({
  appleBadgeIcon: {
    width: 179,
    marginLeft: '.5em',
    cursor: 'pointer',
    [theme.breakpoints.down('md')]: {
      width: 160,
    },
    [theme.breakpoints.down('xs')]: {
      width: 135,
      marginLeft: '.2em',
    },
  },
  openExternalWebsiteLink: {
    color: 'rgb(255, 255, 255, .6)',
    fontSize: 13,
    marginBottom: '1em',
    '&:hover': {
      color: 'white',
    },
    [theme.breakpoints.down('md')]: {
      fontSize: 16,
    },
  },
  googleBadgeIcon: {
    width: 200,
    height: 60,
    marginRight: '.5em',
    cursor: 'pointer',
    [theme.breakpoints.down('md')]: {
      width: 175,
      height: 53,
    },
    [theme.breakpoints.down('xs')]: {
      width: 150,
      height: 45,
      marginRight: '.2em',
    },
  },
});

const AppStoreIconsOuterWrapper = styled('div')`
  width: 100%;
  margin-bottom: 64px;
  margin-top: 40px;
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
`;

const AppStoreIconsWrapper = styled('div')`
  width: 100%;
  display: flex;
  flex-flow: row;
  align-items: center;
  justify-content: center;
`;

const DownloadAppText = styled('div')`
  font-weight: 600;
  margin-bottom: ${isCordova() ? '6px' : '4px'};
  text-align: center;
`;

export default withStyles(styles)(DownloadAppsButtons);
