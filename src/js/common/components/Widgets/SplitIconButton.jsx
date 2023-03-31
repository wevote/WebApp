import { Button } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { getTextColorFromBackground } from '../../utils/color';
import { renderLog } from '../../utils/logging';

class SplitIconButton extends PureComponent {
  render () {
    renderLog('SplitIconButton');  // Set LOG_RENDER_EVENTS to log all renders
    const {
      adjustedIconWidth,
      backgroundColor,
      buttonText,
      classes,
      compressedSize,
      disabled,
      externalUniqueId,
      fontColor,
      fontSize,
      icon,
      iconRight,
      separatorColor,
      styles,
      title,
      variant,
    } = this.props;
    const defaultButtonStyles = {
      background: backgroundColor || '#2e3c5d',
      border: '1px solid rgba(46, 60, 93, .5)',
      color: fontColor || getTextColorFromBackground(backgroundColor || '#2e3c5d'),
      fontSize: fontSize || '16px',
    };

    let buttonStyles;
    if (styles) {
      buttonStyles = {
        ...defaultButtonStyles,
        ...styles,
      };
    } else {
      buttonStyles = defaultButtonStyles;
    }

    if (compressedSize) {
      buttonStyles.border = '1px solid rgba(46, 60, 93, .5)';
      buttonStyles.padding = 4;
      buttonStyles.width = 160;
      buttonStyles.height = 32;
    }

    return (
      <Button
        className={classes.splitButton}
        classes={{ root: classes.splitButton, label: classes.label }}
        disabled={disabled}
        id={`${externalUniqueId}-splitIconButton`}
        title={title}
        style={buttonStyles}
        onClick={this.props.onClick}
        onKeyDown={this.props.onKeyDown}
        variant={variant || 'contained'}
      >
        <SplitButtonIcon adjustedIconWidth={adjustedIconWidth}>
          {icon}
        </SplitButtonIcon>
        {iconRight ? (
          <SplitButtonSeparatorRight
            style={
              separatorColor ? {
                backgroundColor: separatorColor,
              } : null
            }
          />
        ) : (
          <SplitButtonSeparatorLeft
              style={
                separatorColor ? {
                  backgroundColor: separatorColor,
                } : null
              }
          />
        )}
        <SplitButtonText>{buttonText}</SplitButtonText>
      </Button>
    );
  }
}
SplitIconButton.propTypes = {
  adjustedIconWidth: PropTypes.number,
  backgroundColor: PropTypes.string,
  buttonText: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  classes: PropTypes.object,
  compressedSize: PropTypes.bool,
  disabled: PropTypes.bool,
  externalUniqueId: PropTypes.string,
  fontColor: PropTypes.string,
  fontSize: PropTypes.string,
  icon: PropTypes.node,
  iconRight: PropTypes.bool,
  onClick: PropTypes.func,
  onKeyDown: PropTypes.func,
  separatorColor: PropTypes.string,
  styles: PropTypes.object,
  title: PropTypes.string,
  variant: PropTypes.string,
};

const styles = () => ({
  label: {
    // padding: '10px 0 !important',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
  },
  splitButton: {
    boxShadow: 'none !important',
    // minWidth: 270,
    padding: '0 !important',
    width: '100%',
    whiteSpace: 'nowrap',
    transition: '150ms ease-in',
    '&:hover': {
      filter: 'brightness(92%)',
    },
  },
});

const SplitButtonSeparatorLeft = styled('div')`
  display: inline-block;
  height: 100%;
  width: 1.5px !important;
  flex: none;
  background: rgba(204, 204, 204, 0.425);
  z-index: 1;
  position: absolute;
  left: 44px;
`;

const SplitButtonSeparatorRight = styled('div')`
  display: inline-block;
  height: 100%;
  width: 1.5px !important;
  flex: none;
  background: rgba(204, 204, 204, 0.425);
  z-index: 1;
  position: absolute;
  right: 44px;
`;

const SplitButtonIcon = styled('span', {
  shouldForwardProp: (prop) => !['adjustedIconWidth'].includes(prop),
})(({ adjustedIconWidth }) => (`
  flex: none;
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 13.3px;
  width: ${adjustedIconWidth ? `${adjustedIconWidth}px;` : 'width: 44px;'}
`));

const SplitButtonText = styled('span')`
  padding: 8px 8px 8px;
  text-align: center;
  flex: 1 1 0;
  font-size: 18px;
  font-weight: 500;
`;

export default withStyles(styles)(SplitIconButton);
