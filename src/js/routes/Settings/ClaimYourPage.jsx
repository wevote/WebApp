import React, { Component } from 'react';
import Helmet from 'react-helmet';
import TwitterHandleBox from '../../components/Twitter/TwitterHandleBox';
import { renderLog } from '../../utils/logging';

export default class ClaimYourPage extends Component {
  render () {
    renderLog(__filename);
    return (
      <div>
        <Helmet title="Claim Your Page - We Vote" />
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
      </div>
    );
  }
}
