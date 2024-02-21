import React, { Component } from 'react';
import { Helmet } from 'react-helmet-async';
import PrivacyBody from '../../common/components/PrivacyBody';
import { renderLog } from '../../common/utils/logging';
import compileDate from '../../compileDate';
import { PageContentContainer } from '../../components/Style/pageLayoutStyles';

export default class Privacy extends Component {
  static getProps () {
    return {};
  }

  componentDidMount () {
    window.scrollTo(0, 0);
  }

  render () {
    renderLog('Privacy');  // Set LOG_RENDER_EVENTS to log all renders
    return (
      <PageContentContainer>
        <Helmet>
          <title>Privacy Policy - WeVote</title>
          <link rel="canonical" href="https://wevote.us/privacy" />
        </Helmet>
        <div className="container-fluid well">
          <PrivacyBody />
        </div>
        <div style={{ padding: '16px' }}>
          Compile date:&nbsp;&nbsp;
          { compileDate }
        </div>
      </PageContentContainer>
    );
  }
}

