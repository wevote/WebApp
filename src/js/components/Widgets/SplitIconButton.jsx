import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import { shortenText } from '../../utils/textFormat';
import { getTextColorFromBackground } from '../../utils/color';

class SplitIconButton extends PureComponent {
  static propTypes = {
    buttonText: PropTypes.string,
    classes: PropTypes.object,
    icon: PropTypes.node,
    backgroundColor: PropTypes.string,
    iconRight: PropTypes.bool,
    seperatorColor: PropTypes.string,
    title: PropTypes.string,
  };

  render () {
    const { classes, buttonText, icon, backgroundColor, title } = this.props;
    const buttonStyle = { background: this.props.backgroundColor ? backgroundColor : '#2e3c5d', color: getTextColorFromBackground(this.props.backgroundColor ? backgroundColor : '#2e3c5d') };

    return (
      <Button
        className={classes.splitButton}
        classes={{ root: classes.splitButton, label: classes.label }}
        variant="contained"
        title={title}
        style={{
          background: buttonStyle.background,
          color: buttonStyle.color,
          fontSize: buttonStyle.fontSize,
        }}
      >
        <SplitButtonIcon>
          {icon}
        </SplitButtonIcon>
        {this.props.iconRight ? (
          <SplitButtonSeperatorRight
            style={this.props.seperatorColor ? (
              {
                backgroundColor: this.props.seperatorColor,
              }
            ) : null}
          />
        ) : (
          <SplitButtonSeperatorLeft
            style={this.props.seperatorColor ? (
              {
                backgroundColor: this.props.seperatorColor,
              }
            ) : null}
          />
        )}
        <SplitButtonText>
          {shortenText(buttonText, 22)}
        </SplitButtonText>
      </Button>
    );
  }
}

const styles = () => ({
  splitButton: {
    boxShadow: 'none !important',
    padding: '12px 0',
    width: '100%',
    whiteSpace: 'nowrap',
    transition: '150ms ease-in',
    '&:hover': {
      filter: 'brightness(92%)',
    },
  },
  label: {
    // padding: '10px 0 !important',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
  },
});

const SplitButtonSeperatorLeft = styled.div`
  display: inline-block;
  height: 100%;
  width: 1.5px !important;
  flex: none;
  background: rgba(204, 204, 204, .425);
  z-index: 1;
  position: absolute;
  left: 44px;
`;

const SplitButtonSeperatorRight = styled.div`
  display: inline-block;
  height: 100%;
  width: 1.5px !important;
  flex: none;
  background: rgba(204, 204, 204, .425);
  z-index: 1;
  position: absolute;
  right: 44px;
`;

const SplitButtonIcon = styled.span`
  width: 44px;
  flex: none;
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 12px;
  * {
    width: 100%;
    font-size: 22px;
  }
`;

const SplitButtonText = styled.span`
  padding: 0 8px 0;
  text-align: center;
  flex: 1 1 0;
  font-weight: 500;
  font-size: 13px;
`;

export default withStyles(styles)(SplitIconButton);
