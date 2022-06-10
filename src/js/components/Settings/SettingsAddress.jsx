import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Helmet from 'react-helmet';
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
          <Helmet title="Enter Address - We Vote" />
          <BrowserPushMessage incomingProps={this.props} />
          <div className="card">
            <div className="card-main">
              <h3 className="h3">
                Enter address where you are registered to vote
              </h3>
              <div className={isWebApp() ? 'u-padding-bottom--md' : 'SettingsCardBottomCordova'}>
                <AddressBox
                  classes={this.props.classes}
                  externalUniqueId={this.props.externalUniqueId}
                  returnNewTextForMapSearch={this.props.returnNewTextForMapSearch}
                  saveUrl="/ballot"
                  showCancelEditAddressButton={this.props.showCancelEditAddressButton}
                  toggleEditingAddress={this.props.toggleEditingAddress}
                  toggleSelectAddressModal={this.props.toggleSelectAddressModal}
                  waitingMessage={this.props.waitingMessage}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
SettingsAddress.propTypes = {
  classes: PropTypes.object,
  externalUniqueId: PropTypes.string,
  returnNewTextForMapSearch: PropTypes.func,
  saveUrl: PropTypes.string.isRequired,
  showCancelEditAddressButton: PropTypes.bool,
  toggleEditingAddress: PropTypes.func,
  toggleSelectAddressModal: PropTypes.func,
  waitingMessage: PropTypes.string,
};
