import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { getTextColorFromBackground } from '../../utils/color';

class SplitIconButton extends PureComponent {
  render () {
    const {
      backgroundColor,
      buttonText,
      classes,
      compressedSize,
      fontColor,
      fontSize,
      icon,
      title,
      variant,
    } = this.props;
    const buttonStyle = {
      background: backgroundColor || '#2e3c5d',
      border: '1px solid rgba(46, 60, 93, .5)',
      color: fontColor || getTextColorFromBackground(backgroundColor || '#2e3c5d'),
      fontSize: fontSize || '13px',
    };
    if (compressedSize) {
      buttonStyle.border = '1px solid rgba(46, 60, 93, .5)';
      buttonStyle.padding = 4;
      buttonStyle.width = 160;
      buttonStyle.height = 32;
    }

    return (
      <Button
        className={classes.splitButton}
        classes={{ root: classes.splitButton, label: classes.label }}
        disabled={this.props.disabled}
        id={`${this.props.externalUniqueId}-splitIconButton`}
        title={title}
        style={buttonStyle}
        onClick={this.props.onClick}
        onKeyDown={this.props.onKeyDown}
        variant={variant || 'contained'}
      >
        <SplitButtonIcon adjustedIconWidth={this.props.adjustedIconWidth}>
          {icon}
        </SplitButtonIcon>
        {this.props.iconRight ? (
          <SplitButtonSeparatorRight
            style={
              this.props.separatorColor ? {
                backgroundColor: this.props.separatorColor,
              } : null
            }
          />
        ) : (
          <SplitButtonSeparatorLeft
              style={
                this.props.separatorColor ? {
                  backgroundColor: this.props.separatorColor,
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
  buttonText: PropTypes.string,
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
    padding: '0 !important',
    width: '100%',
    whiteSpace: 'nowrap',
    transition: '150ms ease-in',
    '&:hover': {
      filter: 'brightness(92%)',
    },
  },
});

const SplitButtonSeparatorLeft = styled.div`
  display: inline-block;
  height: 100%;
  width: 1.5px !important;
  flex: none;
  background: rgba(204, 204, 204, 0.425);
  z-index: 1;
  position: absolute;
  left: 44px;
`;

const SplitButtonSeparatorRight = styled.div`
  display: inline-block;
  height: 100%;
  width: 1.5px !important;
  flex: none;
  background: rgba(204, 204, 204, 0.425);
  z-index: 1;
  position: absolute;
  right: 44px;
`;

const SplitButtonIcon = styled.span`
  flex: none;
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 13.3px;
  ${({ adjustedIconWidth }) => (adjustedIconWidth ? `width: ${adjustedIconWidth}px;` : 'width: 44px;')}
  * {
    width: 100%;
    font-size: 22px;
  }
`;

const SplitButtonText = styled.span`
  padding: 8px 8px 8px;
  text-align: center;
  flex: 1 1 0;
  font-weight: 500;
`;

export default withStyles(styles)(SplitIconButton);
