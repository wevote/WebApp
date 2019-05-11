import React, { Component } from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core';
import { renderLog } from '../../utils/logging';
import OpenExternalWebSite from '../../utils/OpenExternalWebSite';

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
      <div className="btn-toolbar">
        <OpenExternalWebSite
          url="https://twitter.com/WeVote"
          target="_blank"
          body={<Tooltip title="Twitter"><IconButton><ion-icon name="logo-twitter" /></IconButton></Tooltip>}
        />

        <OpenExternalWebSite
          url="https://www.facebook.com/WeVoteUSA"
          target="_blank"
          body={<Tooltip title="Facebook"><IconButton><ion-icon name="logo-facebook" /></IconButton></Tooltip>}
        />

        <OpenExternalWebSite
          url="http://eepurl.com/cx_frP"
          target="_blank"
          body={<Tooltip title="Newsletter"><IconButton><ion-icon name="mail" /></IconButton></Tooltip>}
        />

        {!hideGitHub && (
          <OpenExternalWebSite
            url="https://github.com/WeVote"
            target="_blank"
            body={<Tooltip title="GitHub"><IconButton><ion-icon name="logo-github" /></IconButton></Tooltip>}
          />
        )
        }
        <OpenExternalWebSite
          url="https://blog.wevote.us/"
          target="_blank"
          body={<Tooltip title="Blog"><IconButton><ion-icon name="logo-wordpress" /></IconButton></Tooltip>}
        />
      </div>
    );
  }
}

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
