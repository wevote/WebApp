import React, { Component } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import VoterActions from '../../actions/VoterActions';
import { renderLog } from '../../common/utils/logging';
import DeleteYourAccountButton from './DeleteYourAccountButton';
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
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    VoterActions.voterContactListRetrieve();
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
          <Helmet title="Your Privacy & Data - WeVote" />
          <BrowserPushMessage incomingProps={this.props} />
          <div className="card">
            <div className="card-main">
              <h1 className="h2">
                Your Privacy &amp; Data
              </h1>
              <DataSettingSection>
                <h4 className="h4" id = "yourAddressBookText">
                  Your Address Book Contact Data
                </h4>
                {voterContactEmailListCount > 0 ? (
                  <DeleteAllContactsWrapper>
                    <DeleteAllContactsButton leftAlign />
                  </DeleteAllContactsWrapper>
                ) : (
                  <DataSettingText>
                    WeVote is not storing any of your contact data. If contacts from your address book were previously stored in WeVote, they have been completely removed.
                    {' '}
                    <Link to="/findfriends/importcontacts" className="u-link-color" id = "importContactsLink">Import your contacts to find your friends</Link>
                    .
                  </DataSettingText>
                )}
              </DataSettingSection>
              <DataSettingSection>
                <h4 className="h4" id = "deleteAccountText">
                  Delete Your Account
                </h4>
                <DeleteAllContactsWrapper>
                  <DeleteYourAccountButton leftAlign />
                </DeleteAllContactsWrapper>
              </DataSettingSection>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const DataSettingSection = styled('div')`
  margin-top: 24px;
`;

const DataSettingText = styled('div')`
  color: #999;
`;

const DeleteAllContactsWrapper = styled('div')`
  margin-top: 8px;
  width: 100%;
`;
