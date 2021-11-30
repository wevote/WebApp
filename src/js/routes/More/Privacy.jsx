import React, { Component } from 'react';
import Helmet from 'react-helmet';
import PrivacyBody from '../../common/components/PrivacyBody';
import { renderLog } from '../../utils/logging';
import { PageContentContainer } from '../../utils/pageLayoutStyles';

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
        <Helmet title="Privacy Policy - We Vote" />
        <div className="container-fluid well">
          <PrivacyBody />
        </div>
      </PageContentContainer>
    );
  }
}

