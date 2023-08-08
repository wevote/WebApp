import React from 'react';
import { Helmet } from 'react-helmet-async';
import TermsOfServiceBody from '../../common/components/TermsOfServiceBody';
import { renderLog } from '../../common/utils/logging';
import compileDate from '../../compileDate';
import { PageContentContainer } from '../../components/Style/pageLayoutStyles';

export default class TermsOfService extends React.Component {
  static getProps () {
    return {};
  }

  componentDidMount () {
    window.scrollTo(0, 0);
  }

  render () {
    renderLog('TermsOfService');  // Set LOG_RENDER_EVENTS to log all renders
    return (
      <PageContentContainer>
        <Helmet>
          <title>Terms of Service - We Vote</title>
          <link rel="canonical" href="https://wevote.us/more/terms" />
        </Helmet>
        <div className="container-fluid well">
          <TermsOfServiceBody />
        </div>
        <div style={{ padding: '16px' }}>
          Compile date:&nbsp;&nbsp;
          { compileDate }
        </div>
      </PageContentContainer>
    );
  }
}

