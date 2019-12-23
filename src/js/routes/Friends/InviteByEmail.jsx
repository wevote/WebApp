import React, { Component } from 'react';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import AddFriendsByEmail from '../../components/Friends/AddFriendsByEmail';
import AnalyticsActions from '../../actions/AnalyticsActions';
import { renderLog } from '../../utils/logging';
import VoterStore from '../../stores/VoterStore';

export default class InviteByEmail extends Component {
  static propTypes = {
  };

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
        <Helmet title="Build Your We Vote Network" />
        <SectionTitle>Invite Friends by Email</SectionTitle>
        <section className="card">
          <div className="card-main">
            <AddFriendsByEmail />
          </div>
        </section>
      </div>
    );
  }
}

const SectionTitle = styled.h2`
  width: fit-content;  font-weight: bold;
  font-size: 18px;
  margin-bottom: 16px;
`;
