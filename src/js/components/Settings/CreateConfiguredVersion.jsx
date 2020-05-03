import React, { Component } from 'react';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import OpenExternalWebSite from '../Widgets/OpenExternalWebSite';
import { renderLog } from '../../utils/logging';

class CreateConfiguredVersion extends Component {
  constructor (props) {
    super(props);
    this.state = {
    };
  }

  render () {
    renderLog('CreateConfiguredVersion');  // Set LOG_RENDER_EVENTS to log all renders
    return (
      <div>
        <Introduction>
          Want to create a configured version of We Vote you can send out to your followers or friends?
          {' '}
          <OpenExternalWebSite
            url="https://help.wevote.us/hc/en-us/articles/360037725754-Customizing-Your-Voter-Guide"
            target="_blank"
            body={(<span>Learn more here.</span>)}
          />
        </Introduction>
      </div>
    );
  }
}

const styles = () => ({
  formControl: {
    width: '100%',
  },
});

const Introduction = styled.p`
  margin: 0 0 16px 0;
  font-size: 14px;
`;

export default withStyles(styles)(CreateConfiguredVersion);
