import { Button } from '@mui/material';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import AnalyticsActions from '../../actions/AnalyticsActions';
import FriendActions from '../../actions/FriendActions';
import OrganizationActions from '../../actions/OrganizationActions';
import LoadingWheel from '../../common/components/Widgets/LoadingWheel';
import apiCalming from '../../common/utils/apiCalming';
import { isIPad } from '../../common/utils/cordovaUtils';
import historyPush from '../../common/utils/historyPush';
import { isWebApp } from '../../common/utils/isCordovaOrWebApp';
import { renderLog } from '../../common/utils/logging';
import FriendToggle from '../../components/Friends/FriendToggle';
import { PageContentContainer } from '../../components/Style/pageLayoutStyles';
import OrganizationCard from '../../components/VoterGuide/OrganizationCard';
import OrganizationVoterGuideCard from '../../components/VoterGuide/OrganizationVoterGuideCard';
import OrganizationVoterGuideTabs from '../../components/VoterGuide/OrganizationVoterGuideTabs';
import AppObservableStore from '../../common/stores/AppObservableStore';
import OrganizationStore from '../../stores/OrganizationStore';
import VoterGuideStore from '../../stores/VoterGuideStore';
import VoterStore from '../../stores/VoterStore';
import { isSpeakerTypePrivateCitizen } from '../../utils/organization-functions';
import EndorsementCard from '../../components/Widgets/EndorsementCard';
import ThisIsMeAction from '../../components/Widgets/ThisIsMeAction';

const DelayedLoad = React.lazy(() => import(/* webpackChunkName: 'DelayedLoad' */ '../../common/components/Widgets/DelayedLoad'));
const FollowToggle = React.lazy(() => import(/* webpackChunkName: 'FollowToggle' */ '../../components/Widgets/FollowToggle'));
const ShareButtonDesktopTablet = React.lazy(() => import(/* webpackChunkName: 'ShareButtonDesktopTablet' */ '../../components/Share/ShareButtonDesktopTablet'));

const AUTO_FOLLOW = 'af';


export default class OrganizationVoterGuide extends Component {
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
    window.scrollTo(0, 0);
    const { match: { params: {
      organization_we_vote_id: organizationWeVoteId,
      modal_to_show: modalToShow,
      shared_item_code: sharedItemCode,
      action_variable: actionVariable,
    } } } = this.props;
    // We can enter OrganizationVoterGuide with either organizationWeVoteId or voter_guide_we_vote_id
    // console.log('OrganizationVoterGuide, componentDidMount, params: ', params);
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));
    this.organizationStoreListener = OrganizationStore.addListener(this.onOrganizationStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    this.setState({
      voterGuideFollowersList: VoterGuideStore.getVoterGuidesFollowingOrganization(organizationWeVoteId),
      voterGuideFollowedList: VoterGuideStore.getVoterGuidesFollowedByOrganization(organizationWeVoteId),
    });
    const { organizationHasBeenRetrievedOnce, voterGuideAnalyticsHasBeenSavedOnce } = this.state;
    if (organizationWeVoteId) {
      OrganizationActions.organizationRetrieve(organizationWeVoteId);
      organizationHasBeenRetrievedOnce[organizationWeVoteId] = true;
      AnalyticsActions.saveActionVoterGuideVisit(organizationWeVoteId, VoterStore.electionId());
      voterGuideAnalyticsHasBeenSavedOnce[organizationWeVoteId] = true;
      this.setState({
        organizationHasBeenRetrievedOnce,
        voterGuideAnalyticsHasBeenSavedOnce,
      });
    }

    const modalToOpen = modalToShow || '';
    // console.log('componentDidMount modalToOpen:', modalToOpen);
    if (modalToOpen === 'share') {
      this.modalOpenTimer = setTimeout(() => {
        AppObservableStore.setShowShareModal(true);
      }, 1000);
    } else if (modalToOpen === 'sic') { // sic = Shared Item Code
      // console.log('componentDidMount sharedItemCode:', sharedItemCode);
      if (sharedItemCode) {
        this.modalOpenTimer = setTimeout(() => {
          AppObservableStore.setShowSharedItemModal(sharedItemCode);
        }, 1000);
      }
    } else {
      this.viewingVoterGuideTimer = setTimeout(() => {
        AppObservableStore.setViewingOrganizationVoterGuide(true);
      }, 750);
    }

    // positionListForOpinionMaker is called in js/components/VoterGuide/VoterGuidePositions
    // console.log('action_variable:' + params.action_variable);
    if (actionVariable === AUTO_FOLLOW && organizationWeVoteId) {
      // If we are here,
      // console.log('Auto following');
      AnalyticsActions.saveActionVoterGuideAutoFollow(organizationWeVoteId, VoterStore.electionId());
      OrganizationActions.organizationFollow(organizationWeVoteId);

      // Now redirect to the same page without the '/af' in the route
      const { location: { pathname: currentPathName } } = this.props;

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
    if (apiCalming('friendListsAll', 10000)) {
      FriendActions.friendListsAll(); // We need this so we can identify if the voter is friends with this organization/person
    }
  }

  componentDidUpdate (prevProps) {
    // When a new organization is passed in, update this component to show the new data
    if (prevProps.match.params !== this.props.match.params) {
      const nextParams = this.props.match.params;
      const { organization_we_vote_id: organizationWeVoteId } = nextParams;
      if (organizationWeVoteId) {
        this.setState({
          organizationWeVoteId,
          autoFollowRedirectHappening: false,
          voterGuideFollowersList: VoterGuideStore.getVoterGuidesFollowingOrganization(nextParams.organization_we_vote_id),
          voterGuideFollowedList: VoterGuideStore.getVoterGuidesFollowedByOrganization(nextParams.organization_we_vote_id),
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
  }

  componentWillUnmount () {
    this.organizationStoreListener.remove();
    this.voterGuideStoreListener.remove();
    this.voterStoreListener.remove();
    if (this.modalOpenTimer) clearTimeout(this.modalOpenTimer);
    if (this.viewingVoterGuideTimer) clearTimeout(this.viewingVoterGuideTimer);
    AppObservableStore.setViewingOrganizationVoterGuide(false);
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
          organizationLinkedVoterWeVoteId: organization.linked_voter_we_vote_id,
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
          organizationLinkedVoterWeVoteId: organization.linked_voter_we_vote_id,
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
    const { pathname: editLink, href: editLinkCordova } = window.location;
    const editPathCordova = editLinkCordova.replace(/file:\/\/.*?Vote.app\/www\/index.html#\//, '')
      .replace(/app.*?index.html#/, '');
    historyPush(`${isWebApp() ? editLink : editPathCordova}/m/${destinationTab}`);
  }

  render () {
    renderLog('OrganizationVoterGuide');  // Set LOG_RENDER_EVENTS to log all renders
    const { activeRoute, organization, organizationLinkedVoterWeVoteId, organizationBannerUrl, organizationId, organizationType, organizationWeVoteId } = this.state;
    if (!organization || !this.state.voter || this.state.autoFollowRedirectHappening) {
      return <div>{LoadingWheel}</div>;
    }
    const { location, match: { params } } = this.props;

    const titleText = `${organization.organization_name} - We Vote`;

    const isVoterOwner = organization.organization_we_vote_id !== undefined &&
      organization.organization_we_vote_id === this.state.voter.linked_organization_we_vote_id;

    let voterGuideFollowersList = this.state.voterGuideFollowersList || [];
    const friendsList = []; // Dummy placeholder till the actual logic is in place
    if (this.state.voter.linked_organization_we_vote_id === organizationWeVoteId) {
      // If looking at your own voter guide, filter out your own entry as a follower
      voterGuideFollowersList = voterGuideFollowersList.filter((oneVoterGuide) => (oneVoterGuide.organization_we_vote_id !== this.state.voter.linked_organization_we_vote_id ? oneVoterGuide : null));
    }
    const developmentFeatureTurnedOn = false;

    if (!organizationId) {
      return (
        <Suspense fallback={<></>}>
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
        </Suspense>
      );
    }

    return (
      <PageContentContainer>
        <WrapperFlex>
          {organization.organization_twitter_handle && (
            <Helmet>
              <title>{titleText}</title>
              <link rel="canonical" href={location.pathname} />
            </Helmet>
          )}
          {/* Header Banner Spacing for Desktop */}
          <BannerOverlayDesktopOuterWrapper>
            <BannerOverlayDesktopInnerWrapper>
              <BannerOverlayDesktopShareButtonWrapper>
                <BannerOverlayDesktopShareButtonInnerWrapper>
                  <Suspense fallback={<></>}>
                    <ShareButtonDesktopTablet
                      organizationShare
                      organizationWeVoteId={organizationWeVoteId}
                    />
                  </Suspense>
                </BannerOverlayDesktopShareButtonInnerWrapper>
              </BannerOverlayDesktopShareButtonWrapper>
              <BannerContainerDesktop>
                { organizationBannerUrl !== '' ? (
                  <OrganizationBannerImageDiv className="d-print-none">
                    <OrganizationBannerImageImg alt="Organization Banner Image" src={organizationBannerUrl} aria-hidden="true" />
                  </OrganizationBannerImageDiv>
                ) :
                  <OrganizationEmptyBannerImageDesktop />}
              </BannerContainerDesktop>
            </BannerOverlayDesktopInnerWrapper>
          </BannerOverlayDesktopOuterWrapper>
          {/* Header Banner Spacing for Mobile */}
          <div className="d-block d-sm-none d-print-none">
            { organizationBannerUrl !== '' ? (
              <OrganizationBannerImageDiv className="d-print-none">
                <OrganizationBannerImageImg alt="Organization Banner Image" src={organizationBannerUrl} aria-hidden="true" />
              </OrganizationBannerImageDiv>
            ) :
              <OrganizationEmptyBannerImageMobile />}
          </div>
          <div className="u-show-mobile">
            <div className="col-12">
              <div className="card">
                <div className="card-main">
                  <OrganizationCard
                    organization={organization}
                    useReadMoreForTwitterDescription
                  />
                  { isVoterOwner && (
                    <EditYourEndorsementsWrapper>
                      <Button
                        id="organizationVoterGuideEdit"
                        onClick={this.onEdit}
                        size="small"
                        variant="outlined"
                      >
                        <span>Edit Your Endorsements</span>
                      </Button>
                    </EditYourEndorsementsWrapper>
                  )}
                  { !isVoterOwner && (
                    <Suspense fallback={<></>}>
                      <FollowToggleMobileWrapper>
                        <FollowToggle
                          platformType="mobile"
                          organizationWeVoteId={organizationWeVoteId}
                          // otherVoterWeVoteId={organizationLinkedVoterWeVoteId}
                          showFollowingText
                        />
                      </FollowToggleMobileWrapper>
                      { (isSpeakerTypePrivateCitizen(organizationType) && organizationLinkedVoterWeVoteId) && (
                        <FriendToggleMobileWrapper>
                          <FriendToggle
                            displayFullWidth
                            otherVoterWeVoteId={organizationLinkedVoterWeVoteId}
                            showFriendsText
                          />
                        </FriendToggleMobileWrapper>
                      )}
                    </Suspense>
                  )}
                  <FriendsFollowingFollowersMobileWrapper className="d-print-none">
                    <FriendsFollowingFollowersMobileUl>
                      {developmentFeatureTurnedOn && (
                        <li>
                          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                          <a
                            style={{ padding: '5px 5px' }}
                            onClick={() => this.goToVoterGuideDetailsPage('friends')}
                          >
                            <TabNumber>{friendsList.length}</TabNumber>
                            <TabText>{' Friends'}</TabText>
                          </a>
                        </li>
                      )}
                      <li>
                        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                        <a
                          style={{ padding: '5px 5px' }}
                          onClick={() => this.goToVoterGuideDetailsPage('following')}
                        >
                          <TabNumber>{this.state.voterGuideFollowedList.length}</TabNumber>
                          <TabText>{' Following'}</TabText>
                        </a>
                      </li>
                      <li>
                        <a // eslint-disable-line
                          style={{ padding: '5px 5px' }}
                          onClick={() => this.goToVoterGuideDetailsPage('followers')}
                        >
                          <TabNumber>{voterGuideFollowersList.length}</TabNumber>
                          <TabText>{' Followers'}</TabText>
                        </a>
                      </li>
                    </FriendsFollowingFollowersMobileUl>
                  </FriendsFollowingFollowersMobileWrapper>
                </div>
              </div>
            </div>
          </div>
          <div className="container-fluid">
            <div className="row">
              <DesktopLeftColumn className="u-show-desktop-tablet col-4">
                <CardContainer bannerUrl={organizationBannerUrl}>
                  <div className="card">
                    <div className="card-main">
                      <OrganizationVoterGuideCard organization={organization} isVoterOwner={isVoterOwner} />
                    </div>
                    <br />
                  </div>
                </CardContainer>
                <ExtraActionsWrapper>
                  <EndorsementCard
                    buttonText="Endorsements missing?"
                    narrowColumnDisplay
                    organizationWeVoteId={organizationWeVoteId}
                    // text={`Are there endorsements from ${organization.organization_name} that you expected to see?`}
                    title="Endorsements Missing?"
                  />
                  {organization.organization_twitter_handle && (
                    <ThisIsMeAction
                      kindOfOwner="ORGANIZATION"
                      nameBeingViewed={organization.organization_name}
                      narrowColumnDisplay
                      twitterHandleBeingViewed={organization.organization_twitter_handle}
                    />
                  )}
                </ExtraActionsWrapper>
              </DesktopLeftColumn>

              <div className="col-12 col-sm-8">
                <OrganizationVoterGuideTabs
                  activeRoute={activeRoute}
                  activeRouteChanged={this.changeActiveRoute}
                  location={location}
                  organizationWeVoteId={organizationWeVoteId}
                  params={params}
                  ref={(ref) => { this.organizationVoterGuideTabsReference = ref; }}
                />
              </div>
            </div>
          </div>
        </WrapperFlex>
      </PageContentContainer>
    );
  }
}
OrganizationVoterGuide.propTypes = {
  activeRoute: PropTypes.string,
  location: PropTypes.object,
  match: PropTypes.object.isRequired,
};

const WrapperFlex = styled('div')`
  display: flex;
  flex-flow: column;
  // padding-bottom: 625px;  // This is a lame way of pinning the bottom menu to the bottom on iOS
`;

const BannerContainerDesktop = styled('div')`
  margin-top: ${() => (isIPad() ? '-11px' : '-37px')}; // -29px (BannerOverlayDesktopShareButtonWrapper height) - 8px from BannerOverlayDesktopShareButtonInnerWrapper
`;

const BannerOverlayDesktopShareButtonWrapper = styled('div')`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  position: relative;
  z-index: 1;
  transform: ${() => (isIPad() ? 'translate(0%, 100%)' : '')}
`;

const BannerOverlayDesktopShareButtonInnerWrapper = styled('div')`
  // margin-top: 8px;
  margin-right: 8px;
  z-index: 2;
`;

const BannerOverlayDesktopOuterWrapper = styled('div')(({ theme }) => (`
  display: block;
  ${theme.breakpoints.up('lg')} {
    align-self: flex-end;
    width: 640px;
    display: flex;
    padding: 0 15px;
  }
  ${theme.breakpoints.down('md')} {
    display: none;
  }
  ${theme.breakpoints.down('sm')} {
    display: none;
  }
`));

const BannerOverlayDesktopInnerWrapper = styled('div')(({ theme }) => (`
  min-height: 37px;
  ${theme.breakpoints.down('lg')} {
    margin-right: 7px;
    min-height: 37px;
  }
  ${theme.breakpoints.up('lg')} {
    // background-color: #fff;
    // box-shadow: {standardBoxShadow()};
    // min-height: 37px;
    width: 100%;
  }
`));

const CardContainer = styled('div', {
  shouldForwardProp: (prop) => !['bannerUrl'].includes(prop),
})(({ bannerUrl, theme }) => (`
  ${theme.breakpoints.up('lg')} {
    margin-top: ${bannerUrl ? '-203px' : '0'};
  }
`));

const DesktopLeftColumn = styled('div')`
  padding-left: 0 !important;
  padding-right: 0 !important;
`;

const EditYourEndorsementsWrapper = styled('div')`
  margin-top: 4px;
`;

const ExtraActionsWrapper = styled('div')`
  margin-top: 48px;
  margin-bottom: 20px;
`;

const FollowToggleMobileWrapper = styled('div')`
  margin-top: 4px;
`;

const FriendsFollowingFollowersMobileWrapper = styled('div')`
  margin-top: 6px;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
`;

const FriendsFollowingFollowersMobileUl = styled('ul')`
  display: flex;
  flex-wrap: wrap;
  padding-left: 0;
  margin-bottom: 0;
  list-style: none;
`;

const FriendToggleMobileWrapper = styled('div')`
  margin-top: 4px;
`;

const OrganizationEmptyBannerImageDesktop = styled('div')`
  height: 29px;
  display: block;
`;

const OrganizationEmptyBannerImageMobile = styled('div')`
  height: 47px;
  background-color: #999;
  display: block;
`;

const OrganizationBannerImageDiv = styled('div')`
  min-height: 200px;
  max-height: 300px;
  overflow: hidden;
  @media (max-width: 767px) {
    max-height: 200px;
    min-height: 0;
  }
  @media (min-width: 768px) and (max-width: 959px) {
    min-height: 0;
  }
`;

const OrganizationBannerImageImg = styled('img')`
  width: 100%;
`;

const TabNumber = styled('span')`
  color: #333;
  font-weight: bold;
`;

const TabText = styled('span')`
  color: #999;
  font-weight: 500;
`;
