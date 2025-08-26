import React from 'react';
import { Helmet } from 'react-helmet-async';
import ChildSafetyBody from '../../common/components/ChildSafetyBody';
import { renderLog } from '../../common/utils/logging';
import { PageContentContainer } from '../../components/Style/pageLayoutStyles';

export default class ChildSafety extends React.Component {
  static getProps () {
    return {};
  }

  componentDidMount () {
    window.scrollTo(0, 0);
  }

  render () {
    renderLog('ChildSafety');  // Set LOG_RENDER_EVENTS to log all renders
    return (
      <PageContentContainer>
        <Helmet>
          <title>Standards Against Child Sexual Abuse and Exploitation (CSAE) - WeVote</title>
          <link rel="canonical" href="https://wevote.us/standards-against-child-sexual-abuse-and-exploitation-csae" />
        </Helmet>
        <div className="container-fluid well">
          <ChildSafetyBody />
        </div>
      </PageContentContainer>
    );
  }
}

