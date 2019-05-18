import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import IconButton from '@material-ui/core/IconButton';
import styled from 'styled-components';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core';
import { renderLog } from '../../utils/logging';
import OpenExternalWebSite from '../../components/Widgets/OpenExternalWebSite';

class ToolBar extends Component {
  static propTypes = {
    // classes: PropTypes.object,
    hideGitHub: PropTypes.bool,
  };

  render () {
    renderLog(__filename);
    // const { classes } = this.props;
    const hideGitHub = this.props.hideGitHub ? this.props.hideGitHub : false;

    return (
      <div>
        <Helmet>
          <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.2/css/all.css" integrity="sha384-oS3vJWv+0UjzBfQzYUhtDYW+Pj2yciDJxpsK1OYPAYjqT085Qq/1cq5FLXAZQ7Ay" crossOrigin="anonymous" />
        </Helmet>
        <ToolBarContainer className="btn-toolbar">
          <OpenExternalWebSite
            className="u-no-underline"
            url="https://twitter.com/WeVote"
            target="_blank"
            body={(
              <Tooltip title="Twitter">
                <IconButton>
                  <Icon className="fab fa-twitter" />
                </IconButton>
              </Tooltip>
            )}
          />

          <OpenExternalWebSite
            className="u-no-underline"
            url="https://www.facebook.com/WeVoteUSA"
            target="_blank"
            body={(
              <Tooltip title="Facebook">
                <IconButton>
                  <Icon className="fab fa-facebook-square" />
                </IconButton>
              </Tooltip>
            )}
          />

          <OpenExternalWebSite
            className="u-no-underline"
            url="http://eepurl.com/cx_frP"
            target="_blank"
            body={(
              <Tooltip title="Newsletter">
                <IconButton>
                  <Icon className="fas fa-envelope" />
                </IconButton>
              </Tooltip>
            )}
          />

          {!hideGitHub && (
            <OpenExternalWebSite
              className="u-no-underline"
              url="https://github.com/WeVote"
              target="_blank"
              body={(
                <Tooltip title="Github">
                  <IconButton>
                    <Icon className="fab fa-github" />
                  </IconButton>
                </Tooltip>
              )}
            />
          )
          }
          <OpenExternalWebSite
            className="u-no-underline"
            url="https://blog.wevote.us/"
            target="_blank"
            body={(
              <Tooltip title="Blog">
                <IconButton>
                  <Icon className="fab fa-wordpress" />
                </IconButton>
              </Tooltip>
            )}
          />
        </ToolBarContainer>
      </div>
    );
  }
}

const Icon = styled.i`
  color: white;
  text-decoration: none;
`;

const ToolBarContainer = styled.div`
  text-align: center;
  margin-top: 0;
  justify-content: center;
  display: flex;
  position: relative;
  top: -10px;
`;

const styles = theme => ({
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

export default withStyles(styles)(ToolBar);
