import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@material-ui/core';
import { ArrowBack, ArrowBackIos } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import { historyPush, isIOS } from '../../utils/cordovaUtils';

import { shortenText } from '../../utils/textFormat';
import { renderLog } from '../../utils/logging';

const styles = {
  root: {
    outline: 'none !important',
    '& span': {
      textTransform: 'none',
      fontSize: '18px',
      fontWeight: 'bold',
    },
  },
};

class HeaderBackToButton extends Component {
  static propTypes = {
    backToLink: PropTypes.string.isRequired,
    backToLinkText: PropTypes.string,
    classes: PropTypes.object,
  };

  render () {
    renderLog('HeaderBackToButton');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes, backToLink, backToLinkText } = this.props;

    return (
      <Button
        variant="text"
        color="primary"
        classes={{ root: classes.root }}
        className="page-header__backToButton"
        id="backToLinkTabHeader"
        onClick={() => historyPush(backToLink)}
      >
        {isIOS() ? (
          <ArrowBackIos className="button-icon" />
        ) : (
          <ArrowBack className="button-icon" />
        )}
        <span className="u-show-desktop-tablet u-no-break">{shortenText(backToLinkText, 60)}</span>
        <span className="u-show-mobile-bigger-than-iphone5 u-no-break">{shortenText(backToLinkText, 23)}</span>
        <span className="u-show-mobile-iphone5-or-smaller u-no-break">{shortenText(backToLinkText, 18)}</span>
      </Button>
    );
  }
}

export default withStyles(styles)(HeaderBackToButton);
