import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

class ShareModalOption extends Component {
  static propTypes = {
    link: PropTypes.string,
    icon: PropTypes.string,
    title: PropTypes.string,
    background: PropTypes.string,
  };

  constructor (props) {
    super(props);
    this.state = {};
  }

  render () {
    return (
      <Wrapper href={this.props.link || '/'}>
        <Icon background={this.props.background}>
          {this.props.icon}
        </Icon>
        <Text>
          {this.props.title}
        </Text>
      </Wrapper>
    );
  }
}

const Wrapper = styled.a`
  text-decoration: none !important;
  display: flex;
  align-items: center;
  flex-direction: column;
  color: black !important;
  &:hover {
    text-decoration: none !important;
    color: black !important;
  }
`;

const Icon = styled.div`
  width: 65px;
  height: 65px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.background || 'black'};
  padding: 0px;
  border-radius: 60px;
  font-size: 28px;
  font-weight: bold;
  color: white !important;
  & * {
    color: white !important;
  }
  & svg {
    width: 28px !important;
    height: 28px !important;
  }
  & path {
    width: 28px !important;
    height: 28px !important;
  }
  margin-bottom: 8px;
`;

const Text = styled.h3`
  font-weight: normal;
  font-size: 16px;
`;

export default ShareModalOption;
