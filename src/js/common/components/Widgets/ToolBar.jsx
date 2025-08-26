import { Facebook, GitHub, Instagram, Mail, Twitter } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';
import { styled as muiStyled } from '@mui/styles';
import withStyles from '@mui/styles/withStyles';
import React, { Suspense } from 'react';
import styled from 'styled-components';
import { isCordova } from '../../utils/isCordovaOrWebApp';
import isMobileScreenSize from '../../utils/isMobileScreenSize';
import { renderLog } from '../../utils/logging';
import normalizedImagePath from '../../utils/normalizedImagePath';

const OpenExternalWebSite = React.lazy(() => import(/* webpackChunkName: 'OpenExternalWebSite' */ './OpenExternalWebSite'));


function ToolBar (params) {
  renderLog('ToolBar');  // Set LOG_RENDER_EVENTS to log all renders
  // const { classes } = this.params;
  const hideGitHub = params.hideGitHub ? params.hideGitHub : false;

  if (isCordova()) {
    // Turning off this display for the Cordova app
    return null;
  }

  return (
    <div>
      <ToolBarContainer>
        <Suspense fallback={<></>}>
          <OpenExternalWebSite
            linkIdAttribute="weVoteTikTok"
            className="u-no-underline"
            url="https://tiktok.com/@wevoteus"
            target="_blank"
            trackingOn
            ariaLabel="TikTok"
            body={(
              <Tooltip title="TikTok">
                <IconButton size="large">
                  <TikTokStyled />
                </IconButton>
              </Tooltip>
            )}
          />
        </Suspense>

        <Suspense fallback={<></>}>
          <OpenExternalWebSite
            linkIdAttribute="weVoteTwitter"
            className="u-no-underline"
            url="https://x.com/WeVote"
            target="_blank"
            trackingOn
            ariaLabel="X / Twitter"
            body={(
              <Tooltip title="X / Twitter">
                <IconButton size="large">
                  <TwitterStyled />
                </IconButton>
              </Tooltip>
            )}
          />
        </Suspense>

        <Suspense fallback={<></>}>
          <OpenExternalWebSite
            linkIdAttribute="weVoteFacebook"
            className="u-no-underline"
            url="https://www.facebook.com/WeVoteUSA"
            target="_blank"
            trackingOn
            ariaLabel="Facebook"
            body={(
              <Tooltip title="Facebook">
                <IconButton size="large">
                  <FacebookStyled />
                </IconButton>
              </Tooltip>
            )}
          />
        </Suspense>

        <Suspense fallback={<></>}>
          <OpenExternalWebSite
            linkIdAttribute="weVoteInstagram"
            className="u-no-underline"
            url="https://www.instagram.com/WeVote"
            target="_blank"
            trackingOn
            ariaLabel="Instagram"
            body={(
              <Tooltip title="Instagram">
                <IconButton size="large">
                  <InstagramStyled />
                </IconButton>
              </Tooltip>
            )}
          />
        </Suspense>

        <Suspense fallback={<></>}>
          <OpenExternalWebSite
            linkIdAttribute="eepurl"
            className="u-no-underline"
            url="https://eepurl.com/cx_frP"
            target="_blank"
            trackingOn
            ariaLabel="Newsletter"
            body={(
              <Tooltip title="Newsletter">
                <IconButton size="large">
                  <MailStyled />
                </IconButton>
              </Tooltip>
            )}
          />
        </Suspense>

        {!hideGitHub && (
          <Suspense fallback={<></>}>
            <OpenExternalWebSite
              linkIdAttribute="weVoteGithub"
              className="u-no-underline"
              url="https://github.com/WeVote"
              target="_blank"
              trackingOn
              ariaLabel="Github"
              body={isMobileScreenSize() ? (<></>) : (
                <Tooltip title="Github">
                  <IconButton size="large">
                    <GitHubStyled />
                  </IconButton>
                </Tooltip>
              )}
            />
          </Suspense>
        )}
        <Suspense fallback={<></>}>
          <OpenExternalWebSite
            linkIdAttribute="weVoteBlog"
            className="u-no-underline"
            url="https://blog.wevote.us/"
            target="_blank"
            trackingOn
            ariaLabel="Blog"
            body={(
              <Tooltip title="Blog">
                <IconButton size="large">
                  <img src={normalizedImagePath('/img/global/svg-icons/wordpress-logo.svg')}
                       width={24}
                       height={24}
                       color="white"
                       alt="Wordpress"
                  />
                </IconButton>
              </Tooltip>
            )}
          />
        </Suspense>
      </ToolBarContainer>
    </div>
  );
}

const ToolBarContainer = styled('div')`
  text-align: center;
  margin-top: 0;
  justify-content: center;
  display: flex;
  position: relative;
  top: -10px;
`;

const styles = (theme) => ({
  iconButtonRoot: {
    '&:hover': {
      backgroundColor: 'transparent',
    },
    color: 'white',
    outline: 'none !important',
    [theme.breakpoints.down('md')]: {
      marginLeft: '.1rem',
    },
  },
});

const TwitterStyled = muiStyled(Twitter)({ color: 'white' });
const GitHubStyled = muiStyled(GitHub)({ color: 'white' });
const FacebookStyled = muiStyled(Facebook)({ color: 'white' });
const InstagramStyled = muiStyled(Instagram)({ color: 'white' });
const MailStyled = muiStyled(Mail)({ color: 'white' });

const TikTokStyled = ({ color = 'white' }) => (
  <svg
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 50 50"
      width="24"
      height="24"
  >
    <path d="M41,4H9C6.243,4,4,6.243,4,9v32c0,2.757,2.243,5,5,5h32c2.757,0,5-2.243,5-5V9C46,6.243,43.757,4,41,4z M37.006,22.323 c-0.227,0.021-0.457,0.035-0.69,0.035c-2.623,0-4.928-1.349-6.269-3.388c0,5.349,0,11.435,0,11.537c0,4.709-3.818,8.527-8.527,8.527 s-8.527-3.818-8.527-8.527s3.818-8.527,8.527-8.527c0.178,0,0.352,0.016,0.527,0.027v4.202c-0.175-0.021-0.347-0.053-0.527-0.053 c-2.404,0-4.352,1.948-4.352,4.352s1.948,4.352,4.352,4.352s4.527-1.894,4.527-4.298c0-0.095,0.042-19.594,0.042-19.594h4.016 c0.378,3.591,3.277,6.425,6.901,6.685V22.323z" />
  </svg>
);

export default withStyles(styles)(ToolBar);
