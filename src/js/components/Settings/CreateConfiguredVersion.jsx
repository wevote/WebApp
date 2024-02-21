import styled from 'styled-components';
import withStyles from '@mui/styles/withStyles';
import React, { Component, Suspense } from 'react';
import { renderLog } from '../../common/utils/logging';

const OpenExternalWebSite = React.lazy(() => import(/* webpackChunkName: 'OpenExternalWebSite' */ '../../common/components/Widgets/OpenExternalWebSite'));


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
          Want to create a configured version of WeVote you can send out to your followers or friends?
          {' '}
          <Suspense fallback={<></>}>
            <OpenExternalWebSite
              linkIdAttribute="learnMoreCreateConfiguredVersion"
              url="https://help.wevote.us/hc/en-us/articles/360037725754-Customizing-Your-Voter-Guide"
              target="_blank"
              body={(<span>Learn more here.</span>)}
            />
          </Suspense>
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

const Introduction = styled('p')`
  margin: 0 0 16px 0;
  font-size: 14px;
`;

export default withStyles(styles)(CreateConfiguredVersion);
