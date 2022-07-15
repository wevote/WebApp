import { InputBase } from '@mui/material';
import styled from 'styled-components';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { renderLog } from '../../common/utils/logging';

class TextBox extends Component {
  render () {
    renderLog('TextBox');  // Set LOG_RENDER_EVENTS to log all renders
    const { classes, placeholder, inputProps, icon, value, inputRef } = this.props;
    return (
      <Container>
        <IconContainer>{icon}</IconContainer>
        <InputBase
          classes={{ root: classes.root, input: classes.input }}
          placeholder={placeholder}
          inputProps={inputProps}
          value={value}
          icon={icon}
          inputRef={inputRef}
        />
      </Container>
    );
  }
}
TextBox.propTypes = {
  classes: PropTypes.object,
  icon: PropTypes.node,
  placeholder: PropTypes.string,
  inputProps: PropTypes.object,
  value: PropTypes.string,
  inputRef: PropTypes.func,
};

const styles = (theme) => ({
  input: {
    paddingTop: 4,
    color: '#555',
    [theme.breakpoints.down('md')]: {
      fontSize: 12,
      paddingTop: 8,
    },
  },
  root: {
    width: '100%',
  },
});

const Container = styled('div')(({ theme }) => (`
  border-radius: 32px;
  min-width: 100px;
  width: 100%;
  display: flex;
  padding: 12px 16px;
  background: rgb(243, 243, 247);
  text-align: left;
  padding-bottom: 8px;
  margin-bottom: 1em;
  ${theme.breakpoints.down('md')} {
    height: 36px;
    padding: 8px 16px;
    font-size: 10px;
  }
`));

const IconContainer = styled('div')(({ theme }) => (`
  color: rgb(107, 122, 155);
  padding-right: 4px;
  ${theme.breakpoints.down('md')} {
    margin-top: -2px;
  }
`));

export default withStyles(styles)(TextBox);
