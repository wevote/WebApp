import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import KeyboardBackspaceIcon from '@material-ui/icons/ArrowBack';
import KeyboardBackSpaceIconCordovaIOS from '@material-ui/icons/ArrowBackIos';
import { withStyles } from '@material-ui/core/styles';
import { hasIPhoneNotch, historyPush, isIOS } from '../../utils/cordovaUtils';

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
    renderLog(__filename);
    const { classes, backToLink, backToLinkText } = this.props;

    return (
      <Button
        variant="text"
        color="primary"
        classes={{ root: classes.root }}
        className={`page-header__backToButton ${hasIPhoneNotch() ? 'page-header__backToButtonIPhoneX' : ''}`}
        id="backToLinkTabHeader"
        onClick={() => historyPush(backToLink)}
      >
        {isIOS() ? (
          <KeyboardBackSpaceIconCordovaIOS className="button-icon" />
        ) : (
          <KeyboardBackspaceIcon className="button-icon" />
        )}
        <span className="u-show-desktop-tablet u-no-break">{shortenText(backToLinkText, 60)}</span>
        <span className="u-show-mobile u-no-break">{shortenText(backToLinkText, 23)}</span>
      </Button>

    );
  }
}

export default withStyles(styles)(HeaderBackToButton);
