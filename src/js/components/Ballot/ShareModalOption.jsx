import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { openSnackbar } from '../Widgets/SnackNotifier';

class ShareModalOption extends Component {
  static propTypes = {
    link: PropTypes.string,
    icon: PropTypes.string,
    title: PropTypes.string,
    background: PropTypes.string,
    copyLink: PropTypes.bool,
  };

  constructor (props) {
    super(props);
    this.state = {};

    this.textAreaRef = React.createRef();
    this.copyLink = this.copyLink.bind(this);
  }

  copyLink (e) {
    this.textAreaRef.current.select();

    document.execCommand('copy');
    e.target.focus();

    openSnackbar({ message: 'Copied!' });
  }

  render () {
    return (
      <Wrapper href={this.props.copyLink || this.props.onClickFunction ? null : this.props.link || '/'} onClick={this.props.copyLink ? this.copyLink : this.props.onClickFunction ? this.props.onClickFunction : null}>
        <Icon background={this.props.background}>
          {this.props.icon}
        </Icon>
        <Text>
          {this.props.title}
        </Text>
        {this.props.copyLink ? (
          <TextArea ref={this.textAreaRef} value={this.props.link} />
        ) : null}
      </Wrapper>
    );
  }
}

const Wrapper = styled.a`
  display: block !important;
  flex: 1 1 0;
  height: 100%;
  text-align: center;
  text-decoration: none !important;
  color: black !important;
  &:hover {
    text-decoration: none !important;
    color: black !important;
  }
`;

const Icon = styled.div`
  margin: 0 auto;
  width: 65px;
  height: 65px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.background || 'black'};
  padding: 0px;
  border-radius: 60px;
  font-size: 30px;
  font-weight: bold;
  color: white !important;
  & * {
    color: white !important;
  }
  & svg, & path {
    width: 30px !important;
    height: 30px !important;
  }
  & img {
    width: 42px;
    height: 42px;
  }
  margin-bottom: 8px;
`;

const Text = styled.h3`
  font-weight: normal;
  font-size: 16px;
`;

const TextArea = styled.textarea`
  display: none;
  visibility: hidden;
  position: absolute;
  left: 999999999999999px;
`;

export default ShareModalOption;
