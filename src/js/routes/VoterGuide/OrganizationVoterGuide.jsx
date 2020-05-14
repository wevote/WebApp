import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from 'react-router';
import Button from '@material-ui/core/Button';
import AnalyticsActions from '../../actions/AnalyticsActions';
import DelayedLoad from '../../components/Widgets/DelayedLoad';
import { historyPush } from '../../utils/cordovaUtils';
import FollowToggle from '../../components/Widgets/FollowToggle';
import FriendActions from '../../actions/FriendActions';
import FriendToggle from '../../components/Friends/FriendToggle';
import LoadingWheel from '../../components/LoadingWheel';
import OrganizationActions from '../../actions/OrganizationActions';
import OrganizationCard from '../../components/VoterGuide/OrganizationCard';
import { isSpeakerTypePrivateCitizen } from '../../utils/organization-functions';
import OrganizationStore from '../../stores/OrganizationStore';
import OrganizationVoterGuideCard from '../../components/VoterGuide/OrganizationVoterGuideCard';
import OrganizationVoterGuideTabs from '../../components/VoterGuide/OrganizationVoterGuideTabs';
import { renderLog } from '../../utils/logging';
import VoterGuideStore from '../../stores/VoterGuideStore';
import VoterStore from '../../stores/VoterStore';

const AUTO_FOLLOW = 'af';

export default class OrganizationVoterGuide extends Component {
  static propTypes = {
    activeRoute: PropTypes.string,
    location: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = {
      activeRoute: '',
      autoFollowRedirectHappening: false,
      // linkedOrganizationWeVoteId: '',
      organizationBannerUrl: '',
      organizationWeVoteId: '',
      organization: {},
      organizationHasBeenRetrievedOnce: {},
      voter: {},
      voterGuideAnalyticsHasBeenSavedOnce: {},
      voterGuideFollowedList: [],
      voterGuideFollowersList: [],
    };
    this.organizationVoterGuideTabsReference = {};
    this.onEdit = this.onEdit.bind(this);
    this.ballotItemLinkHasBeenClicked = this.ballotItemLinkHasBeenClicked.bind(this);
  }

  componentDidMount () {
    // We can enter OrganizationVoterGuide with either organizationWeVoteId or voter_guide_we_vote_id
    // console.log('OrganizationVoterGuide, componentDidMount, this.props.params: ', this.props.params);
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));
    this.organizationStoreListener = OrganizationStore.addListener(this.onOrganizationStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    this.setState({
      voterGuideFollowersList: VoterGuideStore.getVoterGuidesFollowingOrganization(this.props.params.organization_we_vote_id),
      voterGuideFollowedList: VoterGuideStore.getVoterGuidesFollowedByOrganization(this.props.params.organization_we_vote_id),
    });
    const { organization_we_vote_id: organizationWeVoteId } = this.props.params;
    const { organizationHasBeenRetrievedOnce, voterGuideAnalyticsHasBeenSavedOnce } = this.state;
    if (organizationWeVoteId) {
      OrganizationActions.organizationRetrieve(this.props.params.organization_we_vote_id);
      organizationHasBeenRetrievedOnce[organizationWeVoteId] = true;
      AnalyticsActions.saveActionVoterGuideVisit(organizationWeVoteId, VoterStore.electionId());
      voterGuideAnalyticsHasBeenSavedOnce[organizationWeVoteId] = true;
      this.setState({
        organizationHasBeenRetrievedOnce,
        voterGuideAnalyticsHasBeenSavedOnce,
      });
    }

    // positionListForOpinionMaker is called in js/components/VoterGuide/VoterGuidePositions
    // console.log('action_variable:' + this.props.params.action_variable);
    if (this.props.params.action_variable === AUTO_FOLLOW && organizationWeVoteId) {
      // If we are here,
      // console.log('Auto following');
      AnalyticsActions.saveActionVoterGuideAutoFollow(organizationWeVoteId, VoterStore.electionId());
      OrganizationActions.organizationFollow(organizationWeVoteId);

      // Now redirect to the same page without the '/af' in the route
      const currentPathName = this.props.location.pathname;

      // AUTO_FOLLOW is 'af'
      const currentPathNameWithoutAutoFollow = currentPathName.replace(`/${AUTO_FOLLOW}`, '');

      // console.log('OrganizationVoterGuide, currentPathNameWithoutAutoFollow: ', currentPathNameWithoutAutoFollow);
      historyPush(currentPathNameWithoutAutoFollow);
      this.setState({
        autoFollowRedirectHappening: true,
      });
    }
    // console.log('VoterStore.getAddressObject(): ', VoterStore.getAddressObject());
    const voter = VoterStore.getVoter();
    this.setState({
      activeRoute: this.props.activeRoute || '',
      // linkedOrganizationWeVoteId: voter.linked_organization_we_vote_id,
      organizationWeVoteId,
      voter,
    });
    FriendActions.currentFriends();  // We need this so we can identify if the voter is friends with this organization/person
  }

  componentWillReceiveProps (nextProps) {
    // console.log('OrganizationVoterGuide, componentWillReceiveProps, nextProps.params.organization_we_vote_id: ', nextProps.params.organization_we_vote_id);
    // When a new organization is passed in, update this component to show the new data
    // if (nextProps.params.action_variable === AUTO_FOLLOW) {
    // Wait until we get the path without the '/af' action variable
    // console.log('OrganizationVoterGuide, componentWillReceiveProps - waiting');
    // } else

    // console.log('OrganizationVoterGuide, componentWillReceiveProps, nextProps.params: ', nextProps.params);
    const { organization_we_vote_id: organizationWeVoteId } = nextProps.params;
    if (organizationWeVoteId) {
      this.setState({
        organizationWeVoteId,
        autoFollowRedirectHappening: false,
        voterGuideFollowersList: VoterGuideStore.getVoterGuidesFollowingOrganization(nextProps.params.organization_we_vote_id),
        voterGuideFollowedList: VoterGuideStore.getVoterGuidesFollowedByOrganization(nextProps.params.organization_we_vote_id),
      });

      // We refresh the data for all three tabs here on the top level
      const { organizationHasBeenRetrievedOnce, voterGuideAnalyticsHasBeenSavedOnce } = this.state;
      if (!this.localOrganizationHasBeenRetrievedOnce(organizationWeVoteId)) {
        // console.log('OrganizationVoterGuide organizationHasBeenRetrievedOnce NOT true');
        OrganizationActions.organizationRetrieve(organizationWeVoteId);
        organizationHasBeenRetrievedOnce[organizationWeVoteId] = true;
        this.setState({
          organizationHasBeenRetrievedOnce,
        });
      }

      // console.log('VoterStore.getAddressObject(): ', VoterStore.getAddressObject());
      // AnalyticsActions.saveActionVoterGuideVisit(organizationWeVoteId, VoterStore.electionId());
      if (!this.localVoterGuideAnalyticsHasBeenSavedOnce(organizationWeVoteId)) {
        voterGuideAnalyticsHasBeenSavedOnce[organizationWeVoteId] = true;
        this.setState({
          voterGuideAnalyticsHasBeenSavedOnce,
        });
      }
    }

    // positionListForOpinionMaker is called in js/components/VoterGuide/VoterGuidePositions
    // DALE 2020-05-13 We only use activeRoute from the props on the first entry
    // if (nextProps.activeRoute) {
    //   console.log('OrganizationVoterGuide, componentWillReceiveProps, nextProps.activeRoute: ', nextProps.activeRoute);
    //   this.setState({
    //     activeRoute: nextProps.activeRoute || '',
    //   });
    // }
  }

  // shouldComponentUpdate (nextProps, nextState) {
  //   if (this.state.activeRoute !== nextState.activeRoute) {
  //     // console.log('shouldComponentUpdate: this.state.activeRoute', this.state.activeRoute, ', nextState.activeRoute', nextState.activeRoute);
  //     return true;
  //   }
  //   if (this.state.autoFollowRedirectHappening !== nextState.autoFollowRedirectHappening) {
  //     // console.log('shouldComponentUpdate: this.state.autoFollowRedirectHappening', this.state.autoFollowRedirectHappening, ', nextState.autoFollowRedirectHappening', nextState.autoFollowRedirectHappening);
  //     return true;
  //   }
  //   if (this.state.linkedOrganizationWeVoteId !== nextState.linkedOrganizationWeVoteId) {
  //     // console.log('shouldComponentUpdate: this.state.linkedOrganizationWeVoteId', this.state.linkedOrganizationWeVoteId, ', nextState.linkedOrganizationWeVoteId', nextState.linkedOrganizationWeVoteId);
  //     return true;
  //   }
  //   if (this.state.organizationBannerUrl !== nextState.organizationBannerUrl) {
  //     // console.log('shouldComponentUpdate: this.state.organizationBannerUrl', this.state.organizationBannerUrl, ', nextState.organizationBannerUrl', nextState.organizationBannerUrl);
  //     return true;
  //   }
  //   if (this.state.organizationId !== nextState.organizationId) {
  //     // console.log('shouldComponentUpdate: this.state.organizationId', this.state.organizationId, ', nextState.organizationId', nextState.organizationId);
  //     return true;
  //   }
  //   if (this.state.organizationWeVoteId !== nextState.organizationWeVoteId) {
  //     // console.log('shouldComponentUpdate: this.state.organizationWeVoteId', this.state.organizationWeVoteId, ', nextState.organizationWeVoteId', nextState.organizationWeVoteId);
  //     return true;
  //   }
  //   // console.log('shouldComponentUpdate no changes');
  //   return false;
  // }

  componentWillUnmount () {
    this.voterGuideStoreListener.remove();
    this.organizationStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onEdit () {
    historyPush(`/voterguideedit/${this.state.organizationWeVoteId}`);
    return <div>{LoadingWheel}</div>;
  }

  onVoterGuideStoreChange () {
    const { organizationWeVoteId } = this.state;
    if (organizationWeVoteId) {
      const organization = OrganizationStore.getOrganizationByWeVoteId(organizationWeVoteId);
      if (organization.organization_id) {
        this.setState({
          organization,
          organizationId: organization.organization_id,
          linkedVoterWeVoteId: organization.linked_voter_we_vote_id,
          organizationType: organization.organization_type,
          voterGuideFollowedList: VoterGuideStore.getVoterGuidesFollowedByOrganization(organizationWeVoteId),
          voterGuideFollowersList: VoterGuideStore.getVoterGuidesFollowingOrganization(organizationWeVoteId),
        });
        if (organization.organization_banner_url) {
          this.setState({
            organizationBannerUrl: organization.organization_banner_url,
          });
        }
      }
    }
  }

  onOrganizationStoreChange () {
    const { organizationWeVoteId } = this.state;
    if (organizationWeVoteId) {
      const organization = OrganizationStore.getOrganizationByWeVoteId(organizationWeVoteId);
      if (organization.organization_id) {
        this.setState({
          organization,
          organizationId: organization.organization_id,
          linkedVoterWeVoteId: organization.linked_voter_we_vote_id,
          organizationType: organization.organization_type,
        });
        if (organization.organization_banner_url) {
          this.setState({
            organizationBannerUrl: organization.organization_banner_url,
          });
        }
      }
    }
  }

  onVoterStoreChange () {
    const voter = VoterStore.getVoter();
    this.setState({
      // linkedOrganizationWeVoteId: voter.linked_organization_we_vote_id,
      voter,
    });
  }

  changeActiveRoute = (newActiveRoute) => {
    this.setState({
      activeRoute: newActiveRoute,
    });
  }

  ballotItemLinkHasBeenClicked (selectedBallotItemId) {
    if (this.organizationVoterGuideTabsReference &&
        this.organizationVoterGuideTabsReference.voterGuideBallotReference &&
        this.organizationVoterGuideTabsReference.voterGuideBallotReference.ballotItemsCompressedReference &&
        this.organizationVoterGuideTabsReference.voterGuideBallotReference.ballotItemsCompressedReference[selectedBallotItemId] &&
        this.organizationVoterGuideTabsReference.voterGuideBallotReference.ballotItemsCompressedReference[selectedBallotItemId].ballotItem) {
      this.organizationVoterGuideTabsReference.voterGuideBallotReference.ballotItemsCompressedReference[selectedBallotItemId].ballotItem.toggleExpandDetails(true);
    }
  }

  localOrganizationHasBeenRetrievedOnce (organizationWeVoteId) {
    if (organizationWeVoteId) {
      const { organizationHasBeenRetrievedOnce } = this.state;
      return organizationHasBeenRetrievedOnce[organizationWeVoteId];
    }
    return false;
  }

  localVoterGuideAnalyticsHasBeenSavedOnce (organizationWeVoteId) {
    if (organizationWeVoteId) {
      const { voterGuideAnalyticsHasBeenSavedOnce } = this.state;
      return voterGuideAnalyticsHasBeenSavedOnce[organizationWeVoteId];
    }
    return false;
  }

  goToVoterGuideDetailsPage (destinationTab) {
    const { pathname: editLink } = window.location;
    historyPush(`${editLink}/m/${destinationTab}`);
  }

  render () {
    renderLog('OrganizationVoterGuide');  // Set LOG_RENDER_EVENTS to log all renders
    const { activeRoute, linkedVoterWeVoteId, organizationBannerUrl, organizationId, organizationType, organizationWeVoteId } = this.state;
    if (!this.state.organization || !this.state.voter || this.state.autoFollowRedirectHappening) {
      return <div>{LoadingWheel}</div>;
    }

    const isVoterOwner = this.state.organization.organization_we_vote_id !== undefined &&
      this.state.organization.organization_we_vote_id === this.state.voter.linked_organization_we_vote_id;

    let voterGuideFollowersList = this.state.voterGuideFollowersList || [];
    const friendsList = []; // Dummy placeholder till the actual logic is in place
    if (this.state.voter.linked_organization_we_vote_id === organizationWeVoteId) {
      // If looking at your own voter guide, filter out your own entry as a follower
      voterGuideFollowersList = voterGuideFollowersList.filter(oneVoterGuide => (oneVoterGuide.organization_we_vote_id !== this.state.voter.linked_organization_we_vote_id ? oneVoterGuide : null));
    }
    const developmentFeatureTurnedOn = false;

    if (!organizationId) {
      return (
        <DelayedLoad showLoadingText waitBeforeShow={2000}>
          <div style={{ margin: 'auto', width: '50%' }}>
            <Link
              id="OrganizationVoterGuideGoToBallot"
              to="/ballot"
            >
              <Button
                color="primary"
                variant="outlined"
              >
                Go to Ballot
              </Button>
            </Link>
          </div>
        </DelayedLoad>
      );
    }

    return (
      <Wrapper>
        {/* Header Banner Spacing for Desktop */}
        <BannerContainer>
          { organizationBannerUrl !== '' ? (
            <div className="organization-banner-image-div d-print-none">
              <img alt="Organization Banner Image" className="organization-banner-image-img" src={organizationBannerUrl} aria-hidden="true" />
            </div>
          ) :
            <div className="organization-banner-image-non-twitter-users" />
          }
        </BannerContainer>
        {/* Header Banner Spacing for Mobile */}
        <div className="d-block d-sm-none d-print-none">
          { organizationBannerUrl !== '' ? (
            <div className="organization-banner-image-div d-print-none">
              <img alt="Organization Banner Image" className="organization-banner-image-img" src={organizationBannerUrl} aria-hidden="true" />
            </div>
          ) :
            <div className="organization-banner-image-non-twitter-users" />
          }
        </div>

        <div className="d-block d-sm-none">
          <div className="col-12">
            <div className="card">
              <div className="card-main">
                <OrganizationCard
                  organization={this.state.organization}
                  useReadMoreForTwitterDescription
                />
                { isVoterOwner && (
                  <div className="u-float-right">
                    <Button
                      id="organizationVoterGuideEdit"
                      onClick={this.onEdit}
                      size="small"
                      variant="outlined"
                    >
                      <span>Edit Your Endorsements</span>
                    </Button>
                  </div>
                )}
                { !isVoterOwner && (
                  <>
                    <FollowToggleMobileWrapper>
                      <FollowToggle
                        platformType="mobile"
                        organizationWeVoteId={organizationWeVoteId}
                        otherVoterWeVoteId={linkedVoterWeVoteId}
                        showFollowingText
                      />
                    </FollowToggleMobileWrapper>
                    { isSpeakerTypePrivateCitizen(organizationType) && (
                      <FriendToggleMobileWrapper>
                        <FriendToggle
                          displayFullWidth
                          otherVoterWeVoteId={linkedVoterWeVoteId}
                          showFriendsText
                        />
                      </FriendToggleMobileWrapper>
                    )}
                  </>
                )}
                <div className="tabs-container d-print-none">
                  <ul className="nav tabs">
                    {developmentFeatureTurnedOn && (
                      <li className="tab-default">
                        <a // eslint-disable-line
                          style={{ padding: '5px 5px' }}
                          onClick={() => this.goToVoterGuideDetailsPage('friends')}
                        >
                          <span className="u-show-mobile u-bold">
                            {friendsList.length}
                            <TabText>{' Friends'}</TabText>
                          </span>
                        </a>
                      </li>
                    )}
                    <li className="tab-default">
                      <a // eslint-disable-line
                        style={{ padding: '5px 5px' }}
                        onClick={() => this.goToVoterGuideDetailsPage('following')}
                      >
                        <span className="u-show-mobile u-bold">
                          {this.state.voterGuideFollowedList.length}
                          <TabText>{' Following'}</TabText>
                        </span>
                      </a>
                    </li>
                    <li className="tab-default">
                      <a // eslint-disable-line
                        style={{ padding: '5px 5px' }}
                        onClick={() => this.goToVoterGuideDetailsPage('followers')}
                      >
                        <span className="u-show-mobile u-bold">
                          {voterGuideFollowersList.length}
                          <TabText>{' Followers'}</TabText>
                        </span>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container-fluid">
          <div className="row">
            <div className="d-none d-sm-block col-md-4">
              <CardContainer bannerUrl={organizationBannerUrl}>
                <div className="card">
                  <div className="card-main">
                    <OrganizationVoterGuideCard organization={this.state.organization} isVoterOwner={isVoterOwner} />
                  </div>
                  <br />
                </div>
              </CardContainer>
            </div>

            <div className="col-12 col-md-8">
              <OrganizationVoterGuideTabs
                activeRoute={activeRoute}
                activeRouteChanged={this.changeActiveRoute}
                location={this.props.location}
                organizationWeVoteId={organizationWeVoteId}
                params={this.props.params}
                ref={(ref) => { this.organizationVoterGuideTabsReference = ref; }}
              />
            </div>
          </div>
        </div>
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  display: flex;
  flex-flow: column;
`;

const BannerContainer = styled.div`
  display: block;
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    align-self: flex-end;
    width: 640px;
    display: flex;
    padding: 0 15px;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.md - 1}) {
    display: none;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    display: none;
  }
`;

const CardContainer = styled.div`
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    margin-top: ${({ bannerUrl }) => (bannerUrl ? '-203px' : '0')};
  }
`;

const FollowToggleMobileWrapper = styled.div`
  margin-top: 4px;
`;

const FriendToggleMobileWrapper = styled.div`
  margin-top: 4px;
`;

const TabText = styled.span`
  color: #999;
  font-weight: 500;
`;
