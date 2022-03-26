import React, { Component } from 'react';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import AnalyticsActions from '../../actions/AnalyticsActions';
import { renderLog } from '../../common/utils/logging';
import AddFriendsByEmail from '../../components/Friends/AddFriendsByEmail';
import VoterStore from '../../stores/VoterStore';

export default class InviteByEmail extends Component {
  constructor (props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount () {
    AnalyticsActions.saveActionInviteByEmail(VoterStore.electionId());
  }

  render () {
    renderLog('InviteByEmail');  // Set LOG_RENDER_EVENTS to log all renders
    return (
      <div>
        <Helmet title="Invite Friends" />
        <SectionTitle>Invite Friends by Email</SectionTitle>
        <div className="card">
          <div className="card-main">
            <AddFriendsByEmail />
          </div>
        </div>
      </div>
    );
  }
}

const SectionTitle = styled('h2')`
  width: fit-content;  font-weight: bold;
  font-size: 18px;
  margin-bottom: 16px;
`;
