import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Card from '@material-ui/core/Card';
import { renderLog } from '../../utils/logging';
import DelayedLoad from '../../components/Widgets/DelayedLoad';
import LoadingWheel from '../../components/LoadingWheel';
import OrganizationStore from '../../stores/OrganizationStore';
import TwitterActions from '../../actions/TwitterActions';
import TwitterStore from '../../stores/TwitterStore';
import VoterGuideFollowing
  from '../../components/VoterGuide/VoterGuideFollowing';
import VoterGuideFollowers
  from '../../components/VoterGuide/VoterGuideFollowers';

class OrganizationVoterGuideMobileDetails extends Component {
  static propTypes = {
    activeRoute: PropTypes.string,
    params: PropTypes.object,
  };

  constructor (props) {
    super(props);
    this.state = {
      activeRoute: '',
      organization: {},
      twitterHandle: '',
    };
  }

  componentDidMount () {
    this.setState({
      activeRoute: this.props.activeRoute,
    });
    TwitterActions.twitterIdentityRetrieve(this.props.params.twitter_handle);
    this.twitterStoreListener = TwitterStore.addListener(this.onTwitterStoreChange.bind(this));
    this.onOrganizationStoreChange();
    this.organizationStoreListener = OrganizationStore.addListener(this.onOrganizationStoreChange.bind(this));
  }

  componentWillReceiveProps (nextProps) {
    // console.log('OrganizationVoterGuideMobileDetails componentWillReceiveProps');
    this.setState({
      activeRoute: nextProps.activeRoute,
    });
    if (nextProps.params.twitter_handle && this.state.twitterHandle.toLowerCase() !== nextProps.params.twitter_handle.toLowerCase()) {
      // We need this test to prevent an infinite loop
      // console.log('OrganizationVoterGuideMobileDetails componentWillReceiveProps, different twitterHandle: ', nextProps.params.twitter_handle);
      TwitterActions.twitterIdentityRetrieve(nextProps.params.twitter_handle);
    }
  }

  componentWillUnmount () {
    this.twitterStoreListener.remove();
  }

  onTwitterStoreChange () {
    // console.log('OrganizationVoterGuideMobileDetails onTwitterStoreChange');
    const { owner_we_vote_id: ownerWeVoteId, twitter_handle: twitterHandle } = TwitterStore.get();
    this.setState({
      ownerWeVoteId,
      twitterHandle,
    });
  }

  onOrganizationStoreChange () {
    const { ownerWeVoteId } = this.state;
    this.setState({
      organization: OrganizationStore.getOrganizationByWeVoteId(ownerWeVoteId),
    });
  }

  render () {
    renderLog('OrganizationVoterGuideMobileDetails');  // Set LOG_RENDER_EVENTS to log all renders
    const {  activeRoute, organization, ownerWeVoteId } = this.state;
    if (!activeRoute || !organization || !ownerWeVoteId) {
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
        DisplayContent = <VoterGuideFollowing organization={this.state.organization} />;
        break;
      case 'followers':
        DisplayContent = <VoterGuideFollowers organization={this.state.organization} />;
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
