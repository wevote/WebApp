import React, { Component } from 'react';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import VoterActions from '../../actions/VoterActions';
import { renderLog } from '../../common/utils/logging';
import DeleteAllContactsButton from '../SetUpAccount/DeleteAllContactsButton';
import VoterStore from '../../stores/VoterStore';
import BrowserPushMessage from '../Widgets/BrowserPushMessage';

export default class SettingsYourData extends Component {
  constructor (props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount () {
    window.scrollTo(0, 0);
    this.onVoterStoreChange();
    VoterActions.voterContactListRetrieve();
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
  }

  onVoterStoreChange () {
    const voterContactEmailListCount = VoterStore.getVoterContactEmailListCount();
    this.setState({
      voterContactEmailListCount,
    });
  }

  render () {
    renderLog('SettingsYourData');  // Set LOG_RENDER_EVENTS to log all renders
    const { voterContactEmailListCount } = this.state;
    return (
      <div>
        <div className="u-stack--md">
          <Helmet title="Your Privacy & Data - We Vote" />
          <BrowserPushMessage incomingProps={this.props} />
          <div className="card">
            <div className="card-main">
              <h3 className="h3">
                Your Privacy &amp; Data
              </h3>
              {voterContactEmailListCount > 0 ? (
                <DeleteAllContactsWrapper>
                  <DeleteAllContactsButton />
                </DeleteAllContactsWrapper>
              ) : (
                <div>You have no contact data to delete. Any contacts from your address book, which may have previously been stored, have been completely removed.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const DeleteAllContactsWrapper = styled('div')`
  margin-top: 8px;
`;
