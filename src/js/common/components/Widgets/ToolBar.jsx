import { Facebook, GitHub, Instagram, Mail, Twitter } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';
import { styled as muiStyled } from '@mui/styles';
import withStyles from '@mui/styles/withStyles';
import React, { Suspense } from 'react';
import styled from 'styled-components';
import { renderLog } from '../../utils/logging';
import normalizedImagePath from '../../utils/normalizedImagePath';

const OpenExternalWebSite = React.lazy(() => import(/* webpackChunkName: 'OpenExternalWebSite' */ './OpenExternalWebSite'));


function ToolBar (params) {
  renderLog('ToolBar');  // Set LOG_RENDER_EVENTS to log all renders
  // const { classes } = this.params;
  const hideGitHub = params.hideGitHub ? params.hideGitHub : false;

  return (
    <div>
      <ToolBarContainer>
        <Suspense fallback={<></>}>
          <OpenExternalWebSite
            linkIdAttribute="wevoteTwitter"
            className="u-no-underline"
            url="https://twitter.com/WeVote"
            target="_blank"
            body={(
              <Tooltip title="Twitter">
                <IconButton size="large">
                  <TwitterStyled />
                </IconButton>
              </Tooltip>
            )}
          />
        </Suspense>

        <Suspense fallback={<></>}>
          <OpenExternalWebSite
            linkIdAttribute="wevoteFacebook"
            className="u-no-underline"
            url="https://www.facebook.com/WeVoteUSA"
            target="_blank"
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
            linkIdAttribute="wevoteInstagram"
            className="u-no-underline"
            url="https://www.instagram.com/WeVote"
            target="_blank"
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
            url="http://eepurl.com/cx_frP"
            target="_blank"
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
              linkIdAttribute="wevoteGithub"
              className="u-no-underline"
              url="https://github.com/WeVote"
              target="_blank"
              body={(
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
            linkIdAttribute="wevoteBlog"
            className="u-no-underline"
            url="https://blog.wevote.us/"
            target="_blank"
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


export default withStyles(styles)(ToolBar);
