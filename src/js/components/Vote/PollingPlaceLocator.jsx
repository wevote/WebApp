import React, { Component } from 'react';
import styled from 'styled-components';
import { renderLog } from '../../utils/logging';

const iframeStyle = {
  border: 'none',
  height: '500px',
  width: '100%',
};

export default class PollingPlaceLocator extends Component {
  static propTypes = {};

  render () {
    renderLog('PollingPlaceLocator');  // Set LOG_RENDER_EVENTS to log all renders
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
