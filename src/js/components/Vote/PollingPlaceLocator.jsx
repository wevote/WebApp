import React, { Component } from 'react';
import { renderLog } from '../../utils/logging';
import styled from 'styled-components';

const iframeStyle = {
  border: 'none',
  height: '500px',
  width: '100%',
};

export default class PollingPlaceLocator extends Component {
  static propTypes = {};

  render () {
    renderLog(__filename);
    return (
      <Wrapper>
        <iframe className="vit_modal_iframe" title="voter-information-project" style={iframeStyle} src="https://tool.votinginfoproject.org/iframe-embed.html" />
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  padding: 0;
  overflow: none;
`;