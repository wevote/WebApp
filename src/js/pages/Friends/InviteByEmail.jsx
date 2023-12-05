import React, { Component } from 'react';
import styled from 'styled-components';
import AnalyticsActions from '../../actions/AnalyticsActions';
import isMobileScreenSize from '../../common/utils/isMobileScreenSize';
import { renderLog } from '../../common/utils/logging';
import AddFriendsByEmail from '../../components/Friends/AddFriendsByEmail';
import VoterStore from '../../stores/VoterStore';
import { SectionTitle } from '../../components/Style/friendStyles';
import TooltipIcon from '../../components/Widgets/TooltipIcon';

export default class InviteByEmail extends Component {
  constructor (props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount () {
    window.scrollTo(0, 0);
    AnalyticsActions.saveActionInviteByEmail(VoterStore.electionId());
  }

  render () {
    renderLog('InviteByEmail');  // Set LOG_RENDER_EVENTS to log all renders
    return (
      <InviteByEmailWrapper>
        <SectionTitle>
          Invite Friends
          <span className="u-show-desktop-tablet">
            {isMobileScreenSize() ? (<span />) : (
              <TooltipIcon title="These friends will see what you support and oppose." />
            )}
          </span>
        </SectionTitle>
        <AddFriendsByEmail />
      </InviteByEmailWrapper>
    );
  }
}

const InviteByEmailWrapper = styled('div')`
  margin-bottom: 48px;
`;
