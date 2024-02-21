import React, { Component } from 'react';
import { Helmet } from 'react-helmet-async';
import TwitterHandleBox from '../../components/Twitter/TwitterHandleBox';
import { renderLog } from '../../common/utils/logging';
import { PageContentContainer } from '../../components/Style/pageLayoutStyles';

export default class ClaimYourPage extends Component {
  render () {
    renderLog('ClaimYourPage');  // Set LOG_RENDER_EVENTS to log all renders
    return (
      <PageContentContainer>
        <Helmet title="Claim Your Page - WeVote" />
        <div className="container-fluid well u-stack--md u-inset--md">
          <h3 className="text-center">
            Claim Your Page
          </h3>
          <h1 className="h4 u-stack--md">
            Enter your Twitter handle to create a public voter guide.
          </h1>
          <div>
            <TwitterHandleBox />
          </div>
        </div>
      </PageContentContainer>
    );
  }
}
