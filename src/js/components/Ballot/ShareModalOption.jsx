import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { openSnackbar } from '../Widgets/SnackNotifier';
import OpenExternalWebSite from '../Widgets/OpenExternalWebSite';

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
      <Wrapper onClick={this.props.copyLink ? this.copyLink : this.props.onClickFunction ? this.props.onClickFunction : null}>
        {this.props.copyLink || this.props.onClickFunction ? (
          <>
            <Icon background={this.props.background}>
              {this.props.icon}
            </Icon>
            <Text>
              {this.props.title}
            </Text>
            {this.props.copyLink ? (
              <TextArea ref={this.textAreaRef} value={this.props.link} />
            ) : null}
          </>
        ) : (
          <OpenExternalWebSite
            className="no-decoration"
            url={this.props.link}
            target="_blank"
            body={(
              <>
                <Icon background={this.props.background}>
                  {this.props.icon}
                </Icon>
                <Text>
                  {this.props.title}
                </Text>
                {this.props.copyLink ? (
                  <TextArea ref={this.textAreaRef} value={this.props.link} />
                ) : null}
              </>
            )}
          />
        )}
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  cursor: pointer;
  display: block !important;
  margin-bottom: 12px;
  @media (min-width: 380px) {
    flex: 1 1 0;
  }
  height: 100%;
  text-align: center;
  text-decoration: none !important;
  color: black !important;
  transition-duration: .25s;
  &:hover {
    text-decoration: none !important;
    color: black !important;
    transform: scale(1.05);
    transition-duration: .25s;
  }
  @media (max-width: 576px) {
    width: 33.333%;
  }
  @media (max-width: 379px) {
    width: 50%;
  }
`;

const Icon = styled.div`
  text-decoration: none !important;
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
  color: black !important;
`;

const TextArea = styled.textarea`
  display: none;
  visibility: hidden;
  position: absolute;
  left: 999999999999999px;
`;

export default ShareModalOption;
