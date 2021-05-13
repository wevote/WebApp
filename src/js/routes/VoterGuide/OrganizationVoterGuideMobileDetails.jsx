import { Card } from '@material-ui/core';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
import TwitterActions from '../../actions/TwitterActions';
import LoadingWheel from '../../components/LoadingWheel';
import VoterGuideFollowers from '../../components/VoterGuide/VoterGuideFollowers';
import VoterGuideFollowing from '../../components/VoterGuide/VoterGuideFollowing';
import TwitterStore from '../../stores/TwitterStore';
import { renderLog } from '../../utils/logging';

const DelayedLoad = React.lazy(() => import(/* webpackChunkName: 'DelayedLoad' */ '../../components/Widgets/DelayedLoad'));

class OrganizationVoterGuideMobileDetails extends Component {
  constructor (props) {
    super(props);
    this.state = {
      incomingTwitterHandle: '',
      organizationWeVoteId: '',
    };
  }

  componentDidMount () {
    this.twitterStoreListener = TwitterStore.addListener(this.onTwitterStoreChange.bind(this));
    const { match: { params } } = this.props;
    const { twitter_handle: incomingTwitterHandle } = params;
    // console.log('OrganizationVoterGuideMobileDetails, twitter_handle:', incomingTwitterHandle);
    TwitterActions.twitterIdentityRetrieve(incomingTwitterHandle);
    this.setState({
      incomingTwitterHandle,
    });
  }

  // eslint-disable-next-line camelcase,react/sort-comp
  UNSAFE_componentWillReceiveProps (nextProps) {
    // console.log('OrganizationVoterGuideMobileDetails componentWillReceiveProps');
    const { match: { params: nextParams } } = nextProps;
    const { incomingTwitterHandle } = this.state;
    const { twitter_handle: nextIncomingTwitterHandle } = nextParams;
    if (incomingTwitterHandle && nextIncomingTwitterHandle && incomingTwitterHandle.toLowerCase() !== nextIncomingTwitterHandle.toLowerCase()) {
      // We need this test to prevent an infinite loop
      // console.log('OrganizationVoterGuideMobileDetails componentWillReceiveProps, different twitterHandle: ', nextParams.twitter_handle);
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
OrganizationVoterGuideMobileDetails.propTypes = {
  activeRoute: PropTypes.string,
  match: PropTypes.object,
};

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
