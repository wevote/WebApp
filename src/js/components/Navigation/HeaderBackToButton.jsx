import { ArrowBack } from '@mui/icons-material';
import { Button } from '@mui/material';
import styled from 'styled-components';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import historyPush from '../../common/utils/historyPush';
import { isCordova } from '../../common/utils/isCordovaOrWebApp';
import isMobileScreenSize from '../../common/utils/isMobileScreenSize';
import { renderLog } from '../../common/utils/logging';
import shortenText from '../../common/utils/shortenText';

class HeaderBackToButton extends Component {
  render () {
    renderLog('HeaderBackToButton');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes, className, backToLink, backToLinkText, leftAligned } = this.props;

    return (
      <StyledButton
        variant="text"
        color="primary"
        classes={{ root: classes.root }}
        className={`${className}`}
        id="backToLinkTabHeaderBackToButton"
        onClick={() => historyPush(backToLink)}
        style={leftAligned ? { paddingLeft: `${isMobileScreenSize() || isCordova() ? '20px' : ''}`, marginLeft: '0 !important', minWidth: 24, width: 24 } : { paddingLeft: `${isMobileScreenSize() || isCordova() ? '20px' : ''}` }}
      >
        <ArrowBack className="button-icon" />
        <span className="u-show-desktop-tablet u-no-break">{shortenText(backToLinkText, 60)}</span>
        <span className="u-show-mobile-bigger-than-iphone5 u-no-break">{shortenText(backToLinkText, 23)}</span>
        <span className="u-show-mobile-iphone5-or-smaller u-no-break">{shortenText(backToLinkText, 18)}</span>
      </StyledButton>
    );
  }
}
HeaderBackToButton.propTypes = {
  backToLink: PropTypes.string.isRequired,
  backToLinkText: PropTypes.string,
  className: PropTypes.string,
  classes: PropTypes.object,
  leftAligned: PropTypes.bool,
};

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

// July 2021: A working example of styled mui-core components -- enabled by the newly added StylesProvider in App.js
const StyledButton = styled(Button)(({ theme }) => (`
  ${theme.breakpoints.down('sm')} {
    padding-left: ${() => (isCordova() ? '0 !important' : '40px')};
  }
`));

export default withStyles(styles)(HeaderBackToButton);
