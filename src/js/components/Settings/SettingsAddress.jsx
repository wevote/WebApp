import React, { Component } from 'react';
import { Helmet } from 'react-helmet-async';
import AnalyticsActions from '../../actions/AnalyticsActions';
import VoterStore from '../../stores/VoterStore';
import { isWebApp } from '../../common/utils/isCordovaOrWebApp';
import { renderLog } from '../../common/utils/logging';
import AddressBox from '../AddressBox';
import BrowserPushMessage from '../Widgets/BrowserPushMessage';

export default class SettingsAddress extends Component {
  constructor (props) {
    super(props);
    this.state = {
    };
  }

  static getProps () {
    return {};
  }

  componentDidMount () {
    AnalyticsActions.saveActionElections(VoterStore.electionId());
  }

  render () {
    renderLog('SettingsAddress');  // Set LOG_RENDER_EVENTS to log all renders
    return (
      <div>
        <div className="u-stack--md">
          <Helmet title="Enter Address - WeVote" />
          <BrowserPushMessage incomingProps={this.props} />
          <div className="card">
            <div className="card-main">
              <div className={isWebApp() ? 'u-padding-bottom--md' : 'SettingsCardBottomCordova'}>
                <AddressBox
                  introductionHtml={(
                    <h3 className="h3 row">
                      Enter address where you are registered to vote
                    </h3>
                  )}
                  saveUrl="/ballot"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
