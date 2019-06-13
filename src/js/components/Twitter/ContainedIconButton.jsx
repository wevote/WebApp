import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import { shortenText } from '../../utils/textFormat';
import { getTextColorFromBackground } from '../../utils/color';

class ContainedIconButton extends PureComponent {
  static propTypes = {
    buttonText: PropTypes.string,
    classes: PropTypes.object,
    icon: PropTypes.node,
    color: PropTypes.string,
    onClick: PropTypes.func,
    onKeyDown: PropTypes.func,
  };

  render () {
    const { classes, buttonText, icon, color } = this.props;
    const buttonStyle = { background: color, color: getTextColorFromBackground(color) };

    return (
      <Button
        variant="contained"
        classes={{ root: classes.fabRoot, label: classes.buttonLabel }}
        style={buttonStyle}
        onClick={this.props.onClick}
        onKeyDown={this.props.onKeyDown}
      >
        <IconContainer>{icon}</IconContainer>
        <ButtonText>{shortenText(buttonText, 22)}</ButtonText>
      </Button>
    );
  }
}

const styles = theme => ({
  fabRoot: {
    fontSize: 20,
    width: 300,
    maxWidth: '100%',
    padding: 0,
    whiteSpace: 'nowrap',
    margin: '8px',
    transition: '150ms ease-in',
    '&:hover': {
      filter: 'brightness(92%)',
    },
    [theme.breakpoints.down('md')]: {
      fontSize: 16,
    },
  },
  buttonLabel: {
    height: 48,
    justifyContent: 'space-evenly',
  },
});

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 1px solid rgba(0, 0, 0, .1);
  width: 16%;
  height: 100%;
  padding-left: 2px;
  font-size: 1.2em;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 20%;
    font-size: 1.4em;
  }
`;

const ButtonText = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  width: 84%;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 12px;
    width: 80%;
  }
`;

export default withStyles(styles)(ContainedIconButton);
