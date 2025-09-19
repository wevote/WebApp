import { Card, CircularProgress } from '@mui/material';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import styled from 'styled-components';
import ActivityActions from '../../actions/ActivityActions';
import AnalyticsActions from '../../actions/AnalyticsActions';
import BallotActions from '../../actions/BallotActions';
import FriendActions from '../../actions/FriendActions';
import OrganizationActions from '../../actions/OrganizationActions';
import ReactionActions from '../../actions/ReactionActions';
import LoadingWheel from '../../common/components/Widgets/LoadingWheel';
import LoadingWheelComp from '../../common/components/Widgets/LoadingWheelComp';
import apiCalming from '../../common/utils/apiCalming';
import { isIPad } from '../../common/utils/cordovaUtils';
import { formatDateToMonthDayYear, timeFromDate } from '../../common/utils/dateFormat';
import historyPush from '../../common/utils/historyPush';
import { isCordova } from '../../common/utils/isCordovaOrWebApp';
import { displayNoneIfSmallerThanDesktop } from '../../common/utils/isMobileScreenSize';
import { renderLog } from '../../common/utils/logging';
import normalizedImagePath from '../../common/utils/normalizedImagePath';
import ActivityCommentAdd from '../../components/Activity/ActivityCommentAdd';
import ActivityPostAdd from '../../components/Activity/ActivityPostAdd';
import FacebookSignInCard from '../../components/Facebook/FacebookSignInCard';
import AddFriendsByEmail from '../../components/Friends/AddFriendsByEmail';
import SuggestedFriendsPreview from '../../components/Friends/SuggestedFriendsPreview';
import { PreviewImage } from '../../components/Settings/SettingsStyled';
import { PageContentContainer } from '../../components/Style/pageLayoutStyles';
import TwitterSignInCard from '../../components/Twitter/TwitterSignInCard';
import BrowserPushMessage from '../../components/Widgets/BrowserPushMessage';
import Testimonial from '../../components/Widgets/Testimonial';
import ActivityStore from '../../stores/ActivityStore';
import AppObservableStore from '../../common/stores/AppObservableStore';
import BallotStore from '../../stores/BallotStore';
import OrganizationStore from '../../stores/OrganizationStore';
import VoterStore from '../../stores/VoterStore';
import { cordovaSimplePageContainerTopOffset } from '../../utils/cordovaCalculatedOffsets';
// Lint is not smart enough to know that lazyPreloadPages will not attempt to preload/reload this page
// eslint-disable-next-line import/no-cycle
import lazyPreloadPages from '../../utils/lazyPreloadPages';

const ActivityTidbitAddReaction = React.lazy(() => import(/* webpackChunkName: 'ActivityTidbitAddReaction' */ '../../components/Activity/ActivityTidbitAddReaction'));
const ActivityTidbitComments = React.lazy(() => import(/* webpackChunkName: 'ActivityTidbitComments' */ '../../components/Activity/ActivityTidbitComments'));
const ActivityTidbitItem = React.lazy(() => import(/* webpackChunkName: 'ActivityTidbitItem' */ '../../components/Activity/ActivityTidbitItem'));
const ActivityTidbitReactionsSummary = React.lazy(() => import(/* webpackChunkName: 'ActivityTidbitReactionsSummary' */ '../../components/Activity/ActivityTidbitReactionsSummary'));
// const DelayedLoad = React.lazy(() => import(/* webpackChunkName: 'DelayedLoad' */ '../../components/Widgets/DelayedLoad'));
const FirstAndLastNameRequiredAlert = React.lazy(() => import(/* webpackChunkName: 'FirstAndLastNameRequiredAlert' */ '../../components/Widgets/FirstAndLastNameRequiredAlert'));
const SignInOptionsPanel = React.lazy(() => import(/* webpackChunkName: 'SignInOptionsPanel' */ '../../common/components/SignIn/SignInOptionsPanel'));
const ShowMoreItems = React.lazy(() => import(/* webpackChunkName: 'ShowMoreItems' */ '../../components/Widgets/ShowMoreItems'));

const STARTING_NUMBER_OF_ACTIVITY_TIDBITS_TO_DISPLAY = 10;


class News extends Component {
  constructor (props) {
    super(props);
    this.state = {
      activityTidbitsList: [],
      componentDidMountFinished: false,
      dateVoterJoined: '',
      activityTidbitsListLength: 0,
      loadingMoreItems: false,
      localLikedItemWeVoteIdsHaveBeenRetrieved: {},
      localPositionListForOrgHasBeenRetrieved: {},
      numberOfActivityTidbitsToDisplay: STARTING_NUMBER_OF_ACTIVITY_TIDBITS_TO_DISPLAY,
      voter: {},
      voterSignedInFacebook: false,
      voterSignedInTwitter: false,
      voterWeVoteId: '',
    };
    this.onScroll = this.onScroll.bind(this);
  }

  componentDidMount () {
    cordovaSimplePageContainerTopOffset(VoterStore.getVoterIsSignedIn());
    const { match: { params } } = this.props;
    const activityTidbitWeVoteIdForDrawer = params.activity_tidbit_we_vote_id || '';
    let redirectInProgress = false;
    if (activityTidbitWeVoteIdForDrawer) {
      const destinationLocalUrlWithModal = `/news/a/${activityTidbitWeVoteIdForDrawer}`;
      const { pathname: pathnameRaw, href: hrefRaw } = window.location;
      let pathname = pathnameRaw;
      if (isCordova()) {
        pathname = hrefRaw.replace(/.*?index.html#/, '');
      }
      // console.log('pathname:', pathname, ', destinationLocalUrlWithModal:', destinationLocalUrlWithModal, ', activityTidbitWeVoteIdForDrawer:', activityTidbitWeVoteIdForDrawer);
      if (pathname && pathname !== destinationLocalUrlWithModal) {
        historyPush(destinationLocalUrlWithModal);
        redirectInProgress = true;
      }
    }
    if (!redirectInProgress) {
      this.onActivityStoreChange();
      this.onVoterStoreChange();
      this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
      this.activityStoreListener = ActivityStore.addListener(this.onActivityStoreChange.bind(this));
      window.addEventListener('scroll', this.onScroll);
      const activityTidbitWeVoteIdList = [activityTidbitWeVoteIdForDrawer];
      if (activityTidbitWeVoteIdList && activityTidbitWeVoteIdList.length > 0 && activityTidbitWeVoteIdForDrawer.length > 0) {
        // Retrieve just the one activity being shown in the drawer
        ActivityActions.activityListRetrieve(activityTidbitWeVoteIdList);
      } else if (apiCalming('activityListRetrieve', 2000)) {
        ActivityActions.activityListRetrieve();
      }
      if (apiCalming('friendListsAll', 30000)) {
        FriendActions.friendListsAll(); // We need this so we can identify if the voter is friends with this organization/person
      }
      if (!BallotStore.allBallotItemsRetrieveCalled()) {
        if (apiCalming('voterBallotItemsRetrieve', 30000)) {
          BallotActions.voterBallotItemsRetrieve(0, '', '');
        }
      }
      if (apiCalming('organizationsFollowedRetrieve', 60000)) {
        OrganizationActions.organizationsFollowedRetrieve();
      }
      this.setState({
        componentDidMountFinished: true,
      }, () => this.openActivityTidbitDrawer(activityTidbitWeVoteIdForDrawer));
      AnalyticsActions.saveActionNews(VoterStore.electionId());
    }
    AppObservableStore.setShowSelectBallotModal(false, false, false);
    this.preloadTimer = setTimeout(() => lazyPreloadPages(), 2000);
    window.scrollTo(0, 0);
  }

  componentDidCatch (error, info) {
    console.log('News.jsx caught: ', error, info.componentStack);
  }

  componentWillUnmount () {
    const { componentDidMountFinished } = this.state;
    if (componentDidMountFinished) {
      this.activityStoreListener.remove();
      this.voterStoreListener.remove();
      window.removeEventListener('scroll', this.onScroll);
      if (this.positionItemTimer) clearTimeout(this.positionItemTimer);
      if (this.activityTidbitDrawerTimer) clearTimeout(this.activityTidbitDrawerTimer);
    }
  }

  onActivityStoreChange () {
    const activityTidbitsList = ActivityStore.allActivity();
    const activityTidbitsWeVoteIdList = [];
    let activityTidbit = {};
    for (let count = 0; count < activityTidbitsList.length; count++) {
      activityTidbit = activityTidbitsList[count];
      if (activityTidbit && activityTidbit.speaker_organization_we_vote_id) {
        this.retrievePositionListIfNeeded(activityTidbit.speaker_organization_we_vote_id);
      }
      if (activityTidbit && activityTidbit.we_vote_id) {
        activityTidbitsWeVoteIdList.push(activityTidbit.we_vote_id);
      }
    }
    if (activityTidbitsWeVoteIdList.length > 0) {
      this.retrieveReactionLikeStatusListIfNeeded(activityTidbitsWeVoteIdList);
    }
    // console.log('activityTidbitsList:', activityTidbitsList);
    this.setState({
      activityTidbitsList,
      activityTidbitsListLength: activityTidbitsList.length,
    });
  }

  onVoterStoreChange () {
    const voter = VoterStore.getVoter();
    const {
      date_joined: dateVoterJoined,
      is_signed_in: voterIsSignedIn,
      signed_in_facebook: voterSignedInFacebook,
      signed_in_twitter: voterSignedInTwitter,
      we_vote_id: voterWeVoteId,
    } = voter;
    this.setState({
      dateVoterJoined,
      voter,
      voterIsSignedIn,
      voterSignedInFacebook,
      voterSignedInTwitter,
      voterWeVoteId,
    });
  }

  onScroll () {
    const { componentDidMountFinished } = this.state;
    if (componentDidMountFinished) {
      const showMoreItemsElement = document.querySelector('#showMoreItemsId');
      if (showMoreItemsElement) {
        const {
          activityTidbitsListLength, isSearching, numberOfActivityTidbitsToDisplay,
          totalNumberOfPositionSearchResults,
        } = this.state;

        if ((isSearching && (numberOfActivityTidbitsToDisplay < totalNumberOfPositionSearchResults)) ||
          (!isSearching && (numberOfActivityTidbitsToDisplay < activityTidbitsListLength))) {
          if (showMoreItemsElement.getBoundingClientRect().bottom <= window.innerHeight) {
            this.setState({ loadingMoreItems: true });
            this.increaseNumberOfActivityTidbitsToDisplay();
          } else {
            this.setState({ loadingMoreItems: false });
          }
        } else {
          this.setState({ loadingMoreItems: false });
        }
      }
    }
  }

  increaseNumberOfActivityTidbitsToDisplay = () => {
    let { numberOfActivityTidbitsToDisplay } = this.state;
    // console.log('Number of position items before increment: ', numberOfActivityTidbitsToDisplay);

    numberOfActivityTidbitsToDisplay += 5;
    // console.log('Number of position items after increment: ', numberOfActivityTidbitsToDisplay);

    if (this.positionItemTimer) clearTimeout(this.positionItemTimer);
    this.positionItemTimer = setTimeout(() => {
      this.setState({
        numberOfActivityTidbitsToDisplay,
      });
    }, 500);
  }

  openActivityTidbitDrawer (activityTidbitWeVoteIdForDrawer) {
    if (activityTidbitWeVoteIdForDrawer) {
      if (this.activityTidbitDrawerTimer) clearTimeout(this.activityTidbitDrawerTimer);
      this.activityTidbitDrawerTimer = setTimeout(() => {
        AppObservableStore.setActivityTidbitWeVoteIdForDrawerAndOpen(activityTidbitWeVoteIdForDrawer);
      }, 500);
    }
  }

  retrievePositionListIfNeeded (speakerOrganizationWeVoteId) {
    const { localPositionListForOrgHasBeenRetrieved } = this.state;
    const doNotRetrievePositionList =
      localPositionListForOrgHasBeenRetrieved[speakerOrganizationWeVoteId] ||
      OrganizationStore.positionListForOpinionMakerHasBeenRetrievedOnce(0, speakerOrganizationWeVoteId);
    if (!doNotRetrievePositionList) {
      localPositionListForOrgHasBeenRetrieved[speakerOrganizationWeVoteId] = true;
      this.setState({
        localPositionListForOrgHasBeenRetrieved,
      });
      OrganizationActions.positionListForOpinionMaker(speakerOrganizationWeVoteId, false);
      OrganizationActions.positionListForOpinionMakerForFriends(speakerOrganizationWeVoteId, false);
    }
  }

  retrieveReactionLikeStatusListIfNeeded (activityTidbitsWeVoteIdList) {
    const { localLikedItemWeVoteIdsHaveBeenRetrieved } = this.state;
    const activityTidbitsWeVoteIdListToRequest = [];
    for (let count = 0; count < activityTidbitsWeVoteIdList.length; count++) {
      if (!localLikedItemWeVoteIdsHaveBeenRetrieved[activityTidbitsWeVoteIdList[count]]) {
        activityTidbitsWeVoteIdListToRequest.push(activityTidbitsWeVoteIdList[count]);
        localLikedItemWeVoteIdsHaveBeenRetrieved[activityTidbitsWeVoteIdList[count]] = true;
      }
    }
    if (activityTidbitsWeVoteIdListToRequest.length > 0) {
      ReactionActions.reactionLikeStatusRetrieve(activityTidbitsWeVoteIdListToRequest);
      this.setState({
        localLikedItemWeVoteIdsHaveBeenRetrieved,
      });
    }
  }

  render () {
    renderLog('News');  // Set LOG_RENDER_EVENTS to log all renders
    const {
      activityTidbitsList, componentDidMountFinished, dateVoterJoined, activityTidbitsListLength,
      loadingMoreItems, numberOfActivityTidbitsToDisplay,
      voter, voterIsSignedIn, voterSignedInFacebook, voterSignedInTwitter, voterWeVoteId,
    } = this.state;
    // console.log('voter:', voter);
    if (!voter || !componentDidMountFinished) {
      return LoadingWheel;
    }
    let numberOfActivityTidbitsDisplayed = 0;

    const testimonialAuthor = 'Alissa B., Oakland, California';
    const imageUrl = normalizedImagePath('/img/global/photos/Alissa_B-128x128.jpg');
    const testimonial = 'Great way to sort through my ballot! My husband and I used WeVote during the last election to learn more about our ballots and make some tough choices. Between following various organizations, and friending a couple of trusted friends, we felt like we had an excellent pool of information to draw from.';

    // August 23, 2020: These resolve a problem that exists in the WebApp, but looks much worse in
    // Cordova -- Stop allowing horizontal scroll, (and vertical scroll of the entire window in some cases)
    // by removing some styles that force some elements to be wider than the device window
    const unsetMarginsIfCordova = isCordova() ? { margin: 'unset' } : {};
    const unsetSideMarginsIfCordova = isCordova() ? { marginRight: 'unset', marginLeft: 'unset' } : {};
    const unsetSomeRowStylesIfCordova = isCordova() ? {
      paddingRight: 0,
      paddingLeft: 0,
      marginRight: 0,
      marginLeft: 0,
    } : {};
    const reduceConstraintsIfCordova = isCordova() ? { margin: '5px 0' } : {};
    const expandSideMarginsIfCordova = isCordova() ? { marginRight: 23, marginLeft: 23 } : {};
    let activityTidbitWeVoteId;

    if (isCordova()) {
      // If the previous render of the Ballot__Wrapper is less than the device height, pad it
      // temporarily for Cordova to stop the footer menu from bouncing when initially rendered
      const { $, visualViewport: { height, scale } } = window;
      const deviceHeight = height / scale;
      const ballotWrapperHeight = $('[class^="class=Ballot__Wrapper"]').outerHeight() || 0;
      if (ballotWrapperHeight < deviceHeight) {
        unsetSomeRowStylesIfCordova.paddingBottom = '625px';  // big enough for the largest phone with a footer menu
      }
    }

    // eslint-disable-next-line prefer-object-spread
    const unsetSomeRowStylesIfCordovaMdBlock = Object.assign({}, unsetSomeRowStylesIfCordova);
    if (isIPad() /* || isAndroidSizeWide() */) {
      unsetSomeRowStylesIfCordovaMdBlock.transform = isIPad() ? 'translate(0, 0.2%)' : 'translate(0, 5%)';
      unsetSomeRowStylesIfCordovaMdBlock.marginLeft = isIPad() ? 15 : 0;
      unsetSomeRowStylesIfCordovaMdBlock.flex = isIPad() ? '0 0 31%' : '';
    }

    // The leading '<>' is needed for Cordova, please do not remove
    return (
      <>
        <Suspense fallback={<LoadingWheelComp />}>
          <PageContentContainer>
            <div className="container-fluid">
              <Helmet title="Discuss - WeVote" />
              <BrowserPushMessage incomingProps={this.props} />
              <div className="row" style={unsetSomeRowStylesIfCordova}>
                <div className="col-sm-12 col-md-8" style={unsetSomeRowStylesIfCordova}>
                  <>
                    {voterIsSignedIn && (
                      <ActivityPostAddWrapper style={reduceConstraintsIfCordova}>
                        <ActivityPostAdd
                          activityTidbitWeVoteId={activityTidbitWeVoteId}
                        />
                      </ActivityPostAddWrapper>
                    )}
                    {voterIsSignedIn && (
                      <Suspense fallback={<></>}>
                        <FirstAndLastNameRequiredAlert />
                      </Suspense>
                    )}
                    {voterIsSignedIn && (
                      <>
                        {activityTidbitsList.map((oneActivityTidbit) => {
                          // console.log('oneActivityTidbit:', oneActivityTidbit);
                          // console.log('numberOfActivityTidbitsDisplayed:', numberOfActivityTidbitsDisplayed);
                          const speakerNameNotValid = !oneActivityTidbit.speaker_name ||
                            (oneActivityTidbit.speaker_name && oneActivityTidbit.speaker_name.startsWith('Voter-'));
                          const isVotersPost = voterWeVoteId === oneActivityTidbit.speaker_voter_we_vote_id;
                          if (!oneActivityTidbit || (speakerNameNotValid && !isVotersPost) || !oneActivityTidbit.we_vote_id) {
                            // console.log('Missing oneActivityTidbit.we_vote_id:', oneActivityTidbit);
                            return null;
                          }
                          if (numberOfActivityTidbitsDisplayed >= numberOfActivityTidbitsToDisplay) {
                            return null;
                          }
                          numberOfActivityTidbitsDisplayed += 1;
                          // console.log('numberOfActivityTidbitsDisplayed: ', numberOfActivityTidbitsDisplayed);
                          activityTidbitWeVoteId = oneActivityTidbit.we_vote_id;
                          return (
                            <ActivityTidbitWrapper key={activityTidbitWeVoteId}>
                              <a // eslint-disable-line jsx-a11y/anchor-has-content, jsx-a11y/control-has-associated-label
                                href={`#${activityTidbitWeVoteId}`}
                                name={activityTidbitWeVoteId}
                              />
                              <Card className="card" style={unsetSideMarginsIfCordova}>
                                <CardNewsWrapper className="card-main" id="steveCardNewsWrapper-main" style={unsetMarginsIfCordova}>
                                  <ActivityTidbitItemWrapper>
                                    <Suspense fallback={<></>}>
                                      <ActivityTidbitItem
                                        activityTidbitWeVoteId={activityTidbitWeVoteId}
                                      />
                                    </Suspense>
                                  </ActivityTidbitItemWrapper>
                                  <Suspense fallback={<></>}>
                                    <ActivityTidbitReactionsSummary
                                      activityTidbitWeVoteId={activityTidbitWeVoteId}
                                    />
                                  </Suspense>
                                  <Suspense fallback={<></>}>
                                    <ActivityTidbitAddReaction
                                      activityTidbitWeVoteId={activityTidbitWeVoteId}
                                    />
                                  </Suspense>
                                  <Suspense fallback={<></>}>
                                    <ActivityTidbitComments
                                      activityTidbitWeVoteId={activityTidbitWeVoteId}
                                      editingTurnedOff
                                    />
                                  </Suspense>
                                  <Suspense fallback={<></>}>
                                    <ActivityCommentAdd
                                      activityTidbitWeVoteId={activityTidbitWeVoteId}
                                    />
                                  </Suspense>
                                </CardNewsWrapper>
                              </Card>
                            </ActivityTidbitWrapper>
                          );
                        })}
                      </>
                    )}
                  </>
                  {(voterIsSignedIn && dateVoterJoined) && (
                    // <DelayedLoad waitBeforeShow={1000}>
                    <Card className="card" style={unsetMarginsIfCordova}>
                      <div className="card-main" style={unsetMarginsIfCordova}>
                        <DateVoterJoinedWrapper>
                          <VoterAndWeVoteLogos>
                            <PreviewImage
                              alt="we vote logo"
                              width="96px"
                              src={normalizedImagePath('/img/global/svg-icons/we-vote-icon-square-color-dark.svg')}
                            />
                          </VoterAndWeVoteLogos>
                          <DateVoterJoined>
                            You joined WeVote
                            {' '}
                            {timeFromDate(dateVoterJoined)}
                            , on
                            {' '}
                            {formatDateToMonthDayYear(dateVoterJoined)}
                            .
                          </DateVoterJoined>
                        </DateVoterJoinedWrapper>
                      </div>
                    </Card>
                    // </DelayedLoad>
                  )}
                  {voterIsSignedIn && (
                    <AddFriendsMobileWrapper className="u-show-mobile" style={unsetSideMarginsIfCordova}>
                      <SuggestedFriendsPreview inSideColumn />
                    </AddFriendsMobileWrapper>
                  )}
                  {voterIsSignedIn && (
                    <div className="card u-show-mobile" style={unsetSideMarginsIfCordova}>
                      <AddFriendsMobileWrapper className="card-main" style={unsetMarginsIfCordova}>
                        <SectionTitle>
                          Voting Is Better with Friends
                        </SectionTitle>
                        <SectionDescription>
                          Add friends you feel comfortable talking politics with. Hear about upcoming elections and what you can do to get ready to vote.
                        </SectionDescription>
                        <AddFriendsByEmail inSideColumn uniqueExternalId="mobile" />
                      </AddFriendsMobileWrapper>
                    </div>
                  )}
                  {!voterIsSignedIn && (
                    // <DelayedLoad waitBeforeShow={1000}>
                    <Suspense fallback={<></>}>
                      <SignInOptionsWrapper style={expandSideMarginsIfCordova}>
                        <SignInOptionsPanel
                          pleaseSignInTitle="Sign In to Join the Discussion"
                          pleaseSignInSubTitle="WeVote is a community of friends who care about voting and democracy."
                        />
                      </SignInOptionsWrapper>
                    </Suspense>
                    // </DelayedLoad>
                  )}
                </div>
                <div className="col-md-4 d-none d-md-block" style={unsetSomeRowStylesIfCordovaMdBlock}>
                  {voterIsSignedIn && (
                    <div className="card">
                      <div className="card-main" style={unsetMarginsIfCordova}>
                        <SectionTitle>
                          Voting Is Better with Friends
                        </SectionTitle>
                        <SectionDescription>
                          Hear about upcoming elections and what you can do to get ready to vote. Add friends you feel comfortable talking politics with.
                        </SectionDescription>
                        <AddFriendsByEmail inSideColumn uniqueExternalId="sidebar" />
                      </div>
                    </div>
                  )}
                  {voterIsSignedIn && (
                    <SuggestedFriendsPreview inSideColumn />
                  )}
                  <div className="card">
                    <div className="card-main" style={unsetMarginsIfCordova}>
                      <Testimonial
                        imageUrl={imageUrl}
                        testimonialAuthor={testimonialAuthor}
                        testimonial={testimonial}
                      />
                    </div>
                  </div>
                  {voterIsSignedIn && (
                    <SignInSmallOptionsWrapper>
                      {!voterSignedInTwitter && (
                        <div className="card">
                          <div className="card-main">
                            <TwitterSignInWrapper>
                              <TwitterSignInCard />
                            </TwitterSignInWrapper>
                          </div>
                        </div>
                      )}
                      {!voterSignedInFacebook && (
                        <div className="card">
                          <div className="card-main">
                            <FacebookSignInWrapper>
                              <FacebookSignInCard />
                            </FacebookSignInWrapper>
                          </div>
                        </div>
                      )}
                    </SignInSmallOptionsWrapper>
                  )}
                </div>
              </div>
              <ShowMoreItemsWrapper
                id="showMoreItemsId"
                onClick={this.increaseNumberOfActivityTidbitsToDisplay}
              >
                <Suspense fallback={<></>}>
                  <ShowMoreItems
                    loadingMoreItemsNow={loadingMoreItems}
                    numberOfItemsDisplayed={numberOfActivityTidbitsDisplayed}
                    numberOfItemsTotal={activityTidbitsListLength}
                  />
                </Suspense>
              </ShowMoreItemsWrapper>
              {/* August 2020:  This height adjustment for Cordova stops the footer-container from bouncing up about 60px on first render of the page */}
              <LoadingItemsWheel style={isCordova() ? { height: 150 } : {}}>
                {loadingMoreItems && (
                  <CircularProgress />
                )}
              </LoadingItemsWheel>
            </div>
          </PageContentContainer>
        </Suspense>
      </>
    );
  }
}
News.propTypes = {
  match: PropTypes.object,
};

const ActivityPostAddWrapper = styled('div')`
`;

const ActivityTidbitItemWrapper = styled('div')`
  margin-bottom: 4px;
`;

const ActivityTidbitWrapper = styled('div')`
`;

const AddFriendsMobileWrapper = styled('div')`
  margin: 0 15px;
`;

const CardNewsWrapper = styled('div')`
`;

const DateVoterJoined = styled('div')`
  align-items: center;
  color: #2e3c5d;
  display: flex;
  font-size: 22px;
  justify-content: center;
  text-align: center;
`;

const DateVoterJoinedWrapper = styled('div')`
  align-items: center;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  margin: 0 20px 24px 20px;
`;

const FacebookSignInWrapper = styled('div')`
  flex: 1;
  @media (min-width: 614px) and (max-width: 991px) {
    padding-left: 8px;
  }
`;

const LoadingItemsWheel = styled('div')`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SectionDescription = styled('div')`
  color: #999;
  font-size: 14px;
  margin-bottom: 4px;
`;

const SectionTitle = styled('h2')`
  width: fit-content;
  font-weight: bolder;
  font-size: 18px;
  margin-bottom: 4px;
  display: inline;
`;

const SignInOptionsWrapper = styled('div')(({ theme }) => (`
  ${theme.breakpoints.down('sm')} {
    margin: 0 12px;
  }
`));

const ShowMoreItemsWrapper = styled('div')(({ theme }) => (`
  margin-bottom: 16px;
  padding-left: 16px;
  padding-right: 26px;
  ${theme.breakpoints.down('sm')} {
    padding-right: 16px;
  }
  @media print{
    display: none;
  }
`));

const SignInSmallOptionsWrapper = styled('div')`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-wrap: wrap;
  ${() => displayNoneIfSmallerThanDesktop()};
`;

const TwitterSignInWrapper = styled('div')`
  flex: 1;
  @media (min-width: 614px) and (max-width: 991px) {
    padding-right: 8px;
  }
`;

const VoterAndWeVoteLogos = styled('div')`
  align-items: center;
  display: flex;
  justify-content: center;
`;

const styles = (theme) => ({
  ballotIconRoot: {
    width: 150,
    height: 150,
    color: 'rgb(171, 177, 191)',
  },
  ballotButtonIconRoot: {
    marginRight: 8,
  },
  ballotButtonRoot: {
    width: 250,
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
});

export default withStyles(styles)(News);
