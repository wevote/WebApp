import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import ActivityActions from '../../actions/ActivityActions';
import AnalyticsActions from '../../actions/AnalyticsActions';
import FriendActions from '../../actions/FriendActions';
import FacebookSignInCard from '../../components/Facebook/FacebookSignInCard';
import AddFriendsByEmail from '../../components/Friends/AddFriendsByEmail';
import FriendInvitationsSentByMePreview from '../../components/Friends/FriendInvitationsSentByMePreview';
import FriendInvitationsSentToMePreview from '../../components/Friends/FriendInvitationsSentToMePreview';
import FriendsCurrentPreview from '../../components/Friends/FriendsCurrentPreview';
import FriendsPromoBox from '../../components/Friends/FriendsPromoBox';
import SuggestedFriendsPreview from '../../components/Friends/SuggestedFriendsPreview';
import LoadingWheel from '../../common/components/Widgets/LoadingWheel';
import TwitterSignInCard from '../../components/Twitter/TwitterSignInCard';
import BrowserPushMessage from '../../components/Widgets/BrowserPushMessage';
import MessageCard from '../../components/Widgets/MessageCard';
import TooltipIcon from '../../components/Widgets/TooltipIcon';
// import AppObservableStore, { messageService } from '../../stores/AppObservableStore';
import FriendStore from '../../stores/FriendStore';
import VoterStore from '../../stores/VoterStore';
import { cordovaFriendsWrapper } from '../../utils/cordovaOffsets';
import normalizedImagePath from '../../common/utils/normalizedImagePath';
import historyPush from '../../common/utils/historyPush';
import displayFriendsTabs from '../../utils/displayFriendsTabs';
import sortFriendListByMutualFriends from '../../utils/friendFunctions';
import { renderLog } from '../../common/utils/logging';
import { PageContentContainer } from '../../utils/pageLayoutStyles';
import FriendInvitationsSentByMe from './FriendInvitationsSentByMe';
import FriendInvitationsSentToMe from './FriendInvitationsSentToMe';
import FriendsCurrent from './FriendsCurrent';
import InviteByEmail from './InviteByEmail';
import SuggestedFriends from './SuggestedFriends';
import apiCalming from '../../utils/apiCalming';

const FirstAndLastNameRequiredAlert = React.lazy(() => import(/* webpackChunkName: 'FirstAndLastNameRequiredAlert' */ '../../components/Widgets/FirstAndLastNameRequiredAlert'));

const testimonialPhoto = '../../../img/global/photos/Dale_McGrew-48x48.jpg';

const testimonialAuthor = 'Dale M., Oakland, California';
const imageUrl = normalizedImagePath(testimonialPhoto);
const testimonial = 'Instead of searching through emails and social media for recommendations, I can see how my friends are voting on We Vote.';

class Friends extends Component {
  static getDerivedStateFromProps (props, state) {
    const { defaultTabItem } = state;
    const { match: { params: { tabItem } } } = props;
    // console.log('Friends getDerivedStateFromProps defaultTabItem:', defaultTabItem, ', tabItem:', tabItem);
    // We only redirect when in mobile mode (when "displayFriendsTabs()" is true), a tab param has not been passed in, and we have a defaultTab specified
    // This solves an edge case where you re-click the Friends Footer tab when you are in the friends section
    if (displayFriendsTabs() && tabItem === undefined && defaultTabItem && defaultTabItem.length) {
      historyPush(`/friends/${defaultTabItem}`);
    }
    return null;
  }

  constructor (props) {
    super(props);
    this.state = {
      currentFriendList: [],
      defaultTabItem: '',
      friendActivityExists: false,
      friendInvitationsSentByMe: [],
      friendInvitationsSentToMe: [],
      // friendsHeaderUnpinned: false,
      suggestedFriendList: [],
      voterIsSignedIn: false,
    };
  }

  componentDidMount () {
    // console.log('Friends componentDidMount');
    window.scrollTo(0, 0);

    // this.appStateSubscription = messageService.getMessage().subscribe(() => this.onAppObservableStoreChange());
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    this.friendStoreListener = FriendStore.addListener(this.onFriendStoreChange.bind(this));
    if (apiCalming('friendListsAll', 30000)) {
      FriendActions.getAllFriendLists();
    }
    const friendInvitationsSentByMe = FriendStore.friendInvitationsSentByMe();
    const friendInvitationsSentToMe = FriendStore.friendInvitationsSentToMe();
    const suggestedFriendListUnsorted = FriendStore.suggestedFriendList();
    const suggestedFriendList = sortFriendListByMutualFriends(suggestedFriendListUnsorted);
    const voter = VoterStore.getVoter();
    let voterIsSignedIn = false;
    if (voter && voter.is_signed_in) {
      voterIsSignedIn = voter.is_signed_in;
    }

    const currentFriendListUnsorted = FriendStore.currentFriends();
    const currentFriendList = sortFriendListByMutualFriends(currentFriendListUnsorted);
    this.setState({
      currentFriendList,
      friendInvitationsSentToMe,
      friendInvitationsSentByMe,
      suggestedFriendList,
      voter,
      voterIsSignedIn,
    });
    this.resetDefaultTabForMobile(friendInvitationsSentToMe, suggestedFriendList, friendInvitationsSentByMe);
    if (apiCalming('activityNoticeListRetrieve', 10000)) {
      ActivityActions.activityNoticeListRetrieve();
    }
    AnalyticsActions.saveActionNetwork(VoterStore.electionId());
  }

  // eslint-disable-next-line no-unused-vars
  componentDidUpdate (prevProps, prevState, snapshot) {
    const { match: { params: { tabItem } } } = this.props;
    const { match: { params: { tabItem: previousTabItem } } } = prevProps;

    if (tabItem && previousTabItem && tabItem !== previousTabItem) {
      window.scrollTo(0, 0);
    }
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
    this.friendStoreListener.remove();
    // this.appStateSubscription.unsubscribe();
  }

  onVoterStoreChange () {
    const voter = VoterStore.getVoter();
    let voterIsSignedIn = false;
    if (voter && voter.is_signed_in) {
      voterIsSignedIn = voter.is_signed_in;
    }
    this.setState({
      voter,
      voterIsSignedIn,
    });
  }

  onFriendStoreChange () {
    let {
      currentFriendList,
      friendInvitationsSentByMe, friendInvitationsSentToMe, suggestedFriendList,
    } = this.state;
    let resetDefaultTab = false;
    if (currentFriendList && currentFriendList.length !== FriendStore.currentFriends().length) {
      const currentFriendListUnsorted = FriendStore.currentFriends();
      currentFriendList = sortFriendListByMutualFriends(currentFriendListUnsorted);
      this.setState({ currentFriendList });
      // console.log('currentFriendList has changed, currentFriendList:', currentFriendList);
    }
    if (friendInvitationsSentByMe && friendInvitationsSentByMe.length !== FriendStore.friendInvitationsSentByMe().length) {
      friendInvitationsSentByMe = FriendStore.friendInvitationsSentByMe();
      this.setState({ friendInvitationsSentByMe });
      // console.log('friendInvitationsSentByMe has changed, friendInvitationsSentByMe:', friendInvitationsSentByMe);
      resetDefaultTab = true;
    }
    if (friendInvitationsSentToMe && friendInvitationsSentToMe.length !== FriendStore.friendInvitationsSentToMe().length) {
      friendInvitationsSentToMe = FriendStore.friendInvitationsSentToMe();
      this.setState({ friendInvitationsSentToMe });
      // console.log('friendInvitationsSentToMe has changed, friendInvitationsSentToMe:', friendInvitationsSentToMe);
      resetDefaultTab = true;
    }
    if (suggestedFriendList && suggestedFriendList.length !== FriendStore.suggestedFriendList().length) {
      const suggestedFriendListUnsorted = FriendStore.suggestedFriendList();
      suggestedFriendList = sortFriendListByMutualFriends(suggestedFriendListUnsorted);
      this.setState({ suggestedFriendList });
      // console.log('suggestedFriends has changed, suggestedFriendList:', suggestedFriendList);
      resetDefaultTab = true;
    }
    if (resetDefaultTab) {
      this.resetDefaultTabForMobile(FriendStore.friendInvitationsSentToMe(), FriendStore.suggestedFriendList(), FriendStore.friendInvitationsSentByMe());
    }
    const friendActivityExists = Boolean((currentFriendList && currentFriendList.length) || (friendInvitationsSentByMe && friendInvitationsSentByMe.length) || (friendInvitationsSentToMe && friendInvitationsSentToMe.length) || (suggestedFriendList && suggestedFriendList.length));
    // console.log('friendActivityExists:', friendActivityExists);
    if (friendActivityExists) {
      // Only set to true -- never false in order to avoid a weird loop
      this.setState({ friendActivityExists });
    }
  }

  // onAppObservableStoreChange () {
  //   this.setState({
  //     friendsHeaderUnpinned: AppObservableStore.getScrolledDown(),
  //   });
  // }

  getSelectedTab () {
    const { match: { params: { tabItem } } } = this.props;
    const { currentFriendList, defaultTabItem, friendInvitationsSentByMe, friendInvitationsSentToMe, suggestedFriendList } = this.state;
    // console.log('getSelectedTab tabItem:', tabItem, ', defaultTabItem:', defaultTabItem);
    let selectedTab = tabItem || defaultTabItem;
    // Don't return a selected tab if the tab isn't available
    if (String(selectedTab) === 'requests') {
      if (friendInvitationsSentToMe.length < 1) {
        selectedTab = 'all';
      }
    } else if (String(selectedTab) === 'suggested') {
      if (suggestedFriendList.length < 1) {
        selectedTab = 'all';
      }
    } else if (String(selectedTab) === 'friends') {
      if (currentFriendList.length < 1) {
        selectedTab = 'all';
      }
    } else if (String(selectedTab) === 'sent-requests') {
      if (friendInvitationsSentByMe.length < 1) {
        selectedTab = 'all';
      }
    }
    return selectedTab;
  }

  handleNavigation = (to) => historyPush(to);

  resetDefaultTabForMobile (friendInvitationsSentToMe, suggestedFriendList, friendInvitationsSentByMe) {
    const { match: { params: { tabItem } } } = this.props;
    let defaultTabItem;
    if (tabItem) {
      // If the voter is directed to a friends tab, make that the default
      defaultTabItem = tabItem;
    } else if (friendInvitationsSentToMe && friendInvitationsSentToMe.length > 0) {
      defaultTabItem = 'requests';
    } else if (suggestedFriendList && suggestedFriendList.length > 0) {
      defaultTabItem = 'suggested';
    } else if (friendInvitationsSentByMe && friendInvitationsSentByMe.length > 0) {
      defaultTabItem = 'sent-requests';
    } else {
      defaultTabItem = 'all';
    }
    this.setState({ defaultTabItem });
    // console.log('resetDefaultTabForMobile defaultTabItem:', defaultTabItem, ', tabItem:', tabItem);
    // We only redirect when in mobile mode, when "displayFriendsTabs()" is true
    if (displayFriendsTabs() && defaultTabItem !== tabItem) {
      this.handleNavigation(`/friends/${defaultTabItem}`);
    }
  }

  render () {
    renderLog('Friends');  // Set LOG_RENDER_EVENTS to log all renders
    const {
      currentFriendList, friendActivityExists, friendInvitationsSentByMe,
      friendInvitationsSentToMe, suggestedFriendList, voter, voterIsSignedIn,
    } = this.state;
    const { /* classes, */ match: { params: { tabItem } } } = this.props;

    // console.log('friendsHeaderUnpinned', friendsHeaderUnpinned);

    if (!voter) {
      return LoadingWheel;
    }

    let mobileContentToDisplay;
    let desktopContentToDisplay;
    // console.log('friendActivityExists:', friendActivityExists, ', voterIsSignedIn:', voterIsSignedIn);

    // Generate mobileContentToDisplay
    switch (tabItem) {
      case 'requests':
        mobileContentToDisplay = (
          <>
            {friendInvitationsSentToMe.length > 0 ? (
              <FriendInvitationsSentToMe />
            ) : (
              <>
                {suggestedFriendList.length > 0 ? (
                  <MessageCard
                    mainText="You have no incoming friend requests. Check out people you may know."
                    buttonText="View Suggested Friends"
                    buttonURL="/friends/suggested"
                  />
                ) : (
                  <MessageCard
                    mainText="Invite your friends to connect!"
                    buttonText="Invite Friends"
                    buttonURL="/friends/invite"
                  />
                )}
              </>
            )}
          </>
        );
        break;
      case 'suggested':
        mobileContentToDisplay = (
          <>
            {suggestedFriendList.length > 0 ? (
              <>
                {voterIsSignedIn && (
                  <Suspense fallback={<></>}>
                    <FirstAndLastNameRequiredAlert />
                  </Suspense>
                )}
                <SuggestedFriends />
              </>
            ) : (
              <>
                {friendInvitationsSentToMe.length > 0 ? (
                  <MessageCard
                    mainText="Check out your incoming friend requests!"
                    buttonText="View Requests"
                    buttonURL="/friends/requests"
                  />
                ) : (
                  <MessageCard
                    mainText="Invite your friends to connect!"
                    buttonText="Invite Friends"
                    buttonURL="/friends/invite"
                  />
                )}
              </>
            )}
          </>
        );
        break;
      case 'invite':
        mobileContentToDisplay = (
          <>
            {voterIsSignedIn && (
              <Suspense fallback={<></>}>
                <FirstAndLastNameRequiredAlert />
              </Suspense>
            )}
            <InviteByEmail />
            <SignInOptionsWrapper>
              {voter.signed_in_twitter ? null : (
                <TwitterSignInWrapper>
                  <TwitterSignInCard />
                </TwitterSignInWrapper>
              )}
              {voter.signed_in_facebook ? null : (
                <FacebookSignInWrapper>
                  <FacebookSignInCard />
                </FacebookSignInWrapper>
              )}
            </SignInOptionsWrapper>
            <FriendsPromoBox
              imageUrl={imageUrl}
              testimonialAuthor={testimonialAuthor}
              testimonial={testimonial}
              isMobile
            />
          </>
        );
        break;
      case 'current':
        mobileContentToDisplay = (
          <>
            {currentFriendList.length > 0 ? (
              <FriendsCurrent />
            ) : (
              <>
                {friendInvitationsSentToMe.length > 0 ? (
                  <MessageCard
                    mainText="You have friend requests. Check them out!"
                    buttonText="View Requests"
                    buttonURL="/friends/requests"
                  />
                ) : (
                  <MessageCard
                    mainText="Invite your friends to connect!"
                    buttonText="Invite Friends"
                    buttonURL="/friends/invite"
                  />
                )}
              </>
            )}
          </>
        );
        break;
      case 'sent-requests':
        mobileContentToDisplay = (
          <>
            {friendInvitationsSentByMe.length > 0 ? (
              <FriendInvitationsSentByMe />
            ) : (
              <MessageCard
                mainText="Invite more friends now!"
                buttonText="Invite Friends"
                buttonURL="/friends/invite"
              />
            )}
          </>
        );
        break;
      case 'all':
      default:
        mobileContentToDisplay = (
          <>
            <>
              {voterIsSignedIn && (
                <Suspense fallback={<></>}>
                  <FirstAndLastNameRequiredAlert />
                </Suspense>
              )}
              {!!(!voterIsSignedIn || !friendActivityExists) && (
                <InviteByEmail />
              )}
              <FriendInvitationsSentToMePreview />
              <SuggestedFriendsPreview />
              <FriendsCurrentPreview />
              {voterIsSignedIn && (
                <FriendInvitationsSentByMePreview />
              )}
            </>
            {!!(voterIsSignedIn && friendActivityExists) && (
              <div className="card">
                <div className="card-main">
                  <SectionTitle>
                    Invite Friends
                  </SectionTitle>
                  <TooltipIcon title="These friends will see what you support and oppose." />
                  <AddFriendsByEmail inSideColumn />
                </div>
              </div>
            )}
            <SignInOptionsWrapper>
              {voter.signed_in_twitter ? null : (
                <TwitterSignInWrapper>
                  <TwitterSignInCard />
                </TwitterSignInWrapper>
              )}
              {voter.signed_in_facebook ? null : (
                <FacebookSignInWrapper>
                  <FacebookSignInCard />
                </FacebookSignInWrapper>
              )}
            </SignInOptionsWrapper>
            <FriendsPromoBox
              imageUrl={imageUrl}
              testimonialAuthor={testimonialAuthor}
              testimonial={testimonial}
            />
          </>
        );
    }

    // Generate desktopContentToDisplay
    switch (tabItem) {
      case 'requests':
        desktopContentToDisplay = (
          <FriendInvitationsSentToMe />
        );
        break;
      case 'suggested':
        desktopContentToDisplay = (
          <SuggestedFriends />
        );
        break;
      case 'invite':
        desktopContentToDisplay = (
          <div className="row">
            <div className="col-sm-12 col-lg-8">
              <>
                {voterIsSignedIn && (
                  <Suspense fallback={<></>}>
                    <FirstAndLastNameRequiredAlert />
                  </Suspense>
                )}
                <InviteByEmail />
              </>
            </div>
            <div className="col-md-12 col-lg-4">
              <SignInOptionsWrapper>
                {voter.signed_in_twitter ? null : (
                  <TwitterSignInWrapper>
                    <TwitterSignInCard />
                  </TwitterSignInWrapper>
                )}
                {voter.signed_in_facebook ? null : (
                  <FacebookSignInWrapper>
                    <FacebookSignInCard />
                  </FacebookSignInWrapper>
                )}
              </SignInOptionsWrapper>
              <FriendsPromoBox
                imageUrl={imageUrl}
                testimonialAuthor={testimonialAuthor}
                testimonial={testimonial}
              />
            </div>
          </div>
        );
        break;
      case 'current':
        desktopContentToDisplay = (
          <FriendsCurrent />
        );
        break;
      case 'sent-requests':
        desktopContentToDisplay = (
          <FriendInvitationsSentByMe />
        );
        break;
      case 'all':
      default:
        desktopContentToDisplay = (
          <>
            <Helmet title="Friends - We Vote" />
            <BrowserPushMessage incomingProps={this.props} />
            <div className="row">
              <div className="col-sm-12 col-lg-8">
                <>
                  {voterIsSignedIn && (
                    <Suspense fallback={<></>}>
                      <FirstAndLastNameRequiredAlert />
                    </Suspense>
                  )}
                  {!!(!voterIsSignedIn || !friendActivityExists) && (
                    <InviteByEmail />
                  )}
                  <FriendInvitationsSentToMePreview />
                  <SuggestedFriendsPreview />
                  <FriendsCurrentPreview />
                  {voterIsSignedIn && (
                    <FriendInvitationsSentByMePreview />
                  )}
                </>
              </div>
              <div className="col-md-12 col-lg-4">
                {!!(voterIsSignedIn && friendActivityExists) && (
                  <div className="card">
                    <div className="card-main">
                      <SectionTitle>
                        Invite Friends
                      </SectionTitle>
                      <TooltipIcon title="These friends will see what you support and oppose." />
                      <AddFriendsByEmail inSideColumn />
                    </div>
                  </div>
                )}
                <SignInOptionsWrapper>
                  {voter.signed_in_twitter ? null : (
                    <TwitterSignInWrapper>
                      <TwitterSignInCard />
                    </TwitterSignInWrapper>
                  )}
                  {voter.signed_in_facebook ? null : (
                    <FacebookSignInWrapper>
                      <FacebookSignInCard />
                    </FacebookSignInWrapper>
                  )}
                </SignInOptionsWrapper>
                <FriendsPromoBox
                  imageUrl={imageUrl}
                  testimonialAuthor={testimonialAuthor}
                  testimonial={testimonial}
                />
              </div>
            </div>
          </>
        );
    }


    return (
      <PageContentContainer>
        {displayFriendsTabs() ? (
          <FriendsHeading>
            <div className="container-fluid debugStyleBottom">
              <div className="Friends__Wrapper" style={cordovaFriendsWrapper()}>
                {mobileContentToDisplay}
              </div>
            </div>
          </FriendsHeading>
        ) : (
          <div className="container-fluid">
            <div className="container-main">
              {desktopContentToDisplay}
            </div>
          </div>
        )}
      </PageContentContainer>
    );
  }
}
Friends.propTypes = {
  // classes: PropTypes.object,
  match: PropTypes.object,
};

const styles = () => ({
  tooltip: {
    display: 'inline !important',
  },
});

const FacebookSignInWrapper = styled.div`
  flex: 1;
  @media (min-width: 614px) and (max-width: 991px) {
    padding-left: 8px;
  }
`;

const FriendsHeading = styled.div`
  // width: 100%;
  // background-color: #fff;
  // border-bottom: 1px solid #aaa;
  // // overflow: hidden;
  // // position: fixed;
  // z-index: 1;
  // left: 0;
  // padding-top: 50px;
  // // transform: translate3d(0, -53px, 0);
  // // transition: all 100ms ease-in-out 0s;
  // box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.2), 0 4px 5px 0 rgba(0, 0, 0, 0.14), 0 1px 10px 0 rgba(0, 0, 0, 0.12);
`;

const SectionTitle = styled.h2`
  width: fit-content;
  font-weight: bolder;
  font-size: 18px;
  margin-bottom: 4px;
  display: inline;
`;

const SignInOptionsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const TwitterSignInWrapper = styled.div`
  flex: 1;
  @media (min-width: 614px) and (max-width: 991px) {
    padding-right: 8px;
  }
`;

export default withStyles(styles)(Friends);
