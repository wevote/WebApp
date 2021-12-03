import { IconButton, Tooltip } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { Facebook, GitHub, Instagram, Mail, Twitter } from '@material-ui/icons';
import { styled as muiStyled } from '@material-ui/styles';
import React, { Suspense } from 'react';
import styled from 'styled-components';
import cordovaDot from '../../../utils/cordovaDot';
import { renderLog } from '../../utils/logging';

const OpenExternalWebSite = React.lazy(() => import(/* webpackChunkName: 'OpenExternalWebSite' */ '../../../components/Widgets/OpenExternalWebSite'));


function ToolBar (params) {
  renderLog('ToolBar');  // Set LOG_RENDER_EVENTS to log all renders
  // const { classes } = this.params;
  const hideGitHub = params.hideGitHub ? params.hideGitHub : false;

  return (
    <div>
      <ToolBarContainer className="btn-toolbar">
        <Suspense fallback={<></>}>
          <OpenExternalWebSite
            linkIdAttribute="wevoteTwitter"
            className="u-no-underline"
            url="https://twitter.com/WeVote"
            target="_blank"
            body={(
              <Tooltip title="Twitter">
                <IconButton>
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
                <IconButton>
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
                <IconButton>
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
                <IconButton>
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
                  <IconButton>
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
                <IconButton>
                  <img src={cordovaDot('/img/global/svg-icons/wordpress-logo.svg')}
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

const ToolBarContainer = styled.div`
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
