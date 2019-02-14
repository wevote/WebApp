import React, { Component } from 'react';
import Helmet from 'react-helmet';
import AddressBox from '../AddressBox';
import AnalyticsActions from '../../actions/AnalyticsActions';
import BrowserPushMessage from '../Widgets/BrowserPushMessage';
import { isWebApp } from '../../utils/cordovaUtils';
import { renderLog } from '../../utils/logging';
import VoterStore from '../../stores/VoterStore';

export default class SettingsAddress extends Component {
  static propTypes = {
  };

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
    renderLog(__filename);
    return (
      <div>
        <div className="u-stack--md">
          <Helmet title="Enter Address - We Vote" />
          <BrowserPushMessage incomingProps={this.props} />
          <div className="card">
            <div className="card-main">
              <h3 className="h3">
                Enter address where you are registered to vote
              </h3>
              <div className={isWebApp() ? 'u-padding-bottom--md' : 'SettingsCardBottomCordova'}>
                <AddressBox {...this.props} saveUrl="/ballot" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
