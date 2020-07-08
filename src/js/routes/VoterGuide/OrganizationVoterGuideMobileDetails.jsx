import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {Card} from '@material-ui/core';
import { renderLog } from '../../utils/logging';
import DelayedLoad from '../../components/Widgets/DelayedLoad';
import LoadingWheel from '../../components/LoadingWheel';
import TwitterActions from '../../actions/TwitterActions';
import TwitterStore from '../../stores/TwitterStore';
import VoterGuideFollowing from '../../components/VoterGuide/VoterGuideFollowing';
import VoterGuideFollowers from '../../components/VoterGuide/VoterGuideFollowers';

class OrganizationVoterGuideMobileDetails extends Component {
  static propTypes = {
    activeRoute: PropTypes.string,
    params: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.state = {
      incomingTwitterHandle: '',
      organizationWeVoteId: '',
    };
  }

  componentDidMount () {
    this.twitterStoreListener = TwitterStore.addListener(this.onTwitterStoreChange.bind(this));
    const { params } = this.props;
    const { twitter_handle: incomingTwitterHandle } = params;
    // console.log('OrganizationVoterGuideMobileDetails, twitter_handle:', incomingTwitterHandle);
    TwitterActions.twitterIdentityRetrieve(incomingTwitterHandle);
    this.setState({
      incomingTwitterHandle,
    });
  }

  componentWillReceiveProps (nextProps) {
    // console.log('OrganizationVoterGuideMobileDetails componentWillReceiveProps');
    const { params } = nextProps;
    const { incomingTwitterHandle } = this.state;
    const { twitter_handle: nextIncomingTwitterHandle } = params;
    if (incomingTwitterHandle && nextIncomingTwitterHandle && incomingTwitterHandle.toLowerCase() !== nextIncomingTwitterHandle.toLowerCase()) {
      // We need this test to prevent an infinite loop
      // console.log('OrganizationVoterGuideMobileDetails componentWillReceiveProps, different twitterHandle: ', nextProps.params.twitter_handle);
      TwitterActions.twitterIdentityRetrieve(nextIncomingTwitterHandle);
    }
  }

  componentWillUnmount () {
    this.twitterStoreListener.remove();
  }

  onTwitterStoreChange () {
    const { owner_we_vote_id: organizationWeVoteId } = TwitterStore.get();
    // console.log('OrganizationVoterGuideMobileDetails onTwitterStoreChange organizationWeVoteId:', organizationWeVoteId);
    this.setState({
      organizationWeVoteId,
    });
  }

  render () {
    renderLog('OrganizationVoterGuideMobileDetails');  // Set LOG_RENDER_EVENTS to log all renders
    const {  activeRoute } = this.props;
    const {  organizationWeVoteId } = this.state;
    if (!organizationWeVoteId) {
      return <div>{LoadingWheel}</div>;
    }
    let DisplayContent = null;
    switch (activeRoute) {
      default:
      case 'friends':
        DisplayContent = (
          <div className="page-content-container">
            <div className="container-fluid">
              <Card>
                <EmptyContainer>
                  <EmptyText>Page under construction...</EmptyText>
                </EmptyContainer>
              </Card>
            </div>
          </div>
        );
        break;
      case 'following':
        DisplayContent = <VoterGuideFollowing organizationWeVoteId={organizationWeVoteId} />;
        break;
      case 'followers':
        DisplayContent = <VoterGuideFollowers organizationWeVoteId={organizationWeVoteId} />;
        break;
    }
    return (
      <div>
        <DelayedLoad showLoadingText waitBeforeShow={500}>
          {DisplayContent}
        </DelayedLoad>
      </div>
    );
  }
}


const EmptyContainer = styled.div`
  padding: 3em 2em;
  display: flex;
  flex-flow: column;
  align-items: center;
`;

const EmptyText = styled.p`
  font-size: 20px;
  text-align: center;
  margin: 1em 2em 3em;
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin: 1em;
  }
`;

export default (OrganizationVoterGuideMobileDetails);
