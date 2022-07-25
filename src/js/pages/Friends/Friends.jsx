import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import FriendsCurrent from './FriendsCurrent';
import FriendInvitationsSentByMe from './FriendInvitationsSentByMe';
import InviteByEmail from './InviteByEmail';
import ActivityActions from '../../actions/ActivityActions';
import AnalyticsActions from '../../actions/AnalyticsActions';
import FriendActions from '../../actions/FriendActions';
import VoterActions from '../../actions/VoterActions';
import LoadingWheel from '../../common/components/Widgets/LoadingWheel';
import apiCalming from '../../common/utils/apiCalming';
import historyPush from '../../common/utils/historyPush';
import { isCordova } from '../../common/utils/isCordovaOrWebApp';
import { renderLog } from '../../common/utils/logging';
import normalizedImagePath from '../../common/utils/normalizedImagePath';
import FacebookSignInCard from '../../components/Facebook/FacebookSignInCard';
import AddFriendsByEmail from '../../components/Friends/AddFriendsByEmail';
import FriendInvitationsSentByMePreview from '../../components/Friends/FriendInvitationsSentByMePreview';
import SuggestedContacts from '../../components/Friends/SuggestedContacts';
import FriendInvitationsSentToMe from '../../components/Friends/FriendInvitationsSentToMe';
import FriendsPromoBox from '../../components/Friends/FriendsPromoBox';
import SuggestedFriends from '../../components/Friends/SuggestedFriends';
import SuggestedFriendsPreview from '../../components/Friends/SuggestedFriendsPreview';
import { PageContentContainer } from '../../components/Style/pageLayoutStyles';
import TwitterSignInCard from '../../components/Twitter/TwitterSignInCard';
import BrowserPushMessage from '../../components/Widgets/BrowserPushMessage';
import MessageCard from '../../components/Widgets/MessageCard';
import SnackNotifier, { openSnackbar } from '../../components/Widgets/SnackNotifier';
import TooltipIcon from '../../components/Widgets/TooltipIcon';
import AppObservableStore from '../../stores/AppObservableStore';
import FriendStore from '../../stores/FriendStore';
import VoterStore from '../../stores/VoterStore';
import { cordovaFriendsWrapper } from '../../utils/cordovaOffsets';
import displayFriendsTabs from '../../utils/displayFriendsTabs';
import sortFriendListByMutualFriends from '../../utils/friendFunctions';
import { SectionDescription } from '../../components/Style/friendStyles';

const AddContactsFromGoogleButton = React.lazy(() => import(/* webpackChunkName: 'AddContactsFromGoogleButton' */ '../../components/SetUpAccount/AddContactsFromGoogleButton'));
const FirstAndLastNameRequiredAlert = React.lazy(() => import(/* webpackChunkName: 'FirstAndLastNameRequiredAlert' */ '../../components/Widgets/FirstAndLastNameRequiredAlert'));
const SignInOptionsPanel = React.lazy(() => import(/* webpackChunkName: 'SignInOptionsPanel' */ '../../components/SignIn/SignInOptionsPanel'));

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
    this.onFriendStoreChange();
    this.onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    this.friendStoreListener = FriendStore.addListener(this.onFriendStoreChange.bind(this));
    if (apiCalming('friendListsAll', 30000)) {
      FriendActions.friendListsAll();
    }
    if (apiCalming('voterContactListRetrieve', 20000)) {
      VoterActions.voterContactListRetrieve();
    }
    if (apiCalming('voterContactListSave', 60000)) {
      VoterActions.voterContactListAugmentWithWeVoteData(true);
    }
    this.resetDefaultTabForMobile(FriendStore.friendInvitationsSentToMe(), FriendStore.suggestedFriendList(), FriendStore.friendInvitationsSentByMe());
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
    if (AppObservableStore.isSnackMessagePending()) openSnackbar({});
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
    // let resetDefaultTab = false;
    const currentFriendListUnsorted = FriendStore.currentFriends();
    const currentFriendList = sortFriendListByMutualFriends(currentFriendListUnsorted);
    const friendInvitationsSentByMe = FriendStore.friendInvitationsSentByMe();
    const friendInvitationsSentToMe = FriendStore.friendInvitationsSentToMe();
    const suggestedFriendListUnsorted = FriendStore.suggestedFriendList();
    const suggestedFriendList = sortFriendListByMutualFriends(suggestedFriendListUnsorted);
    this.setState({
      currentFriendList,
      friendInvitationsSentByMe,
      friendInvitationsSentToMe,
      suggestedFriendList,
    });
    // if (resetDefaultTab) {
    //   this.resetDefaultTabForMobile(FriendStore.friendInvitationsSentToMe(), FriendStore.suggestedFriendList(), FriendStore.friendInvitationsSentByMe());
    // }
    const friendActivityExists = Boolean((currentFriendList && currentFriendList.length) || (friendInvitationsSentByMe && friendInvitationsSentByMe.length) || (friendInvitationsSentToMe && friendInvitationsSentToMe.length) || (suggestedFriendList && suggestedFriendList.length));
    // console.log('friendActivityExists:', friendActivityExists);
    if (friendActivityExists) {
      // Only set to true -- never false in order to avoid a weird loop
      this.setState({ friendActivityExists });
    }
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
      defaultTabItem = 'requests';
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

    const expandSideMarginsIfCordova = isCordova() ? { marginRight: 23, marginLeft: 23 } : {};
    let mobileContentToDisplay;
    let desktopContentToDisplay;
    // console.log('friendActivityExists:', friendActivityExists, ', voterIsSignedIn:', voterIsSignedIn);

    // Generate ContentToDisplay
    switch (tabItem) {
      case 'suggested':
        desktopContentToDisplay = (
          <SuggestedFriends displayedOnDedicatedPage />
        );
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
        desktopContentToDisplay = (
          <div className="row">
            <div className="col-sm-12 col-md-8">
              <>
                {voterIsSignedIn && (
                  <Suspense fallback={<></>}>
                    <FirstAndLastNameRequiredAlert />
                  </Suspense>
                )}
                <FindYourContactsWrapper>
                  <SectionTitle>
                    Find Your Friends on We Vote
                  </SectionTitle>
                  <SectionDescription>
                    Importing your contacts helps you find your friends on We Vote. You can delete your contact information at any time.
                  </SectionDescription>
                  <div>
                    <Suspense fallback={<></>}>
                      <AddContactsFromGoogleButton darkButton />
                    </Suspense>
                  </div>
                </FindYourContactsWrapper>
                <InviteByEmail />
              </>
            </div>
            <div className="col-sm-12 col-md-4">
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
        mobileContentToDisplay = (
          <>
            {voterIsSignedIn && (
              <Suspense fallback={<></>}>
                <FirstAndLastNameRequiredAlert />
              </Suspense>
            )}
            <FindYourContactsWrapper>
              <SectionTitle>
                Find Your Friends on We Vote
              </SectionTitle>
              <SectionDescription>
                Importing your contacts helps you find your friends on We Vote. You can delete your contact information at any time.
              </SectionDescription>
              <div>
                <Suspense fallback={<></>}>
                  <AddContactsFromGoogleButton darkButton />
                </Suspense>
              </div>
            </FindYourContactsWrapper>
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
        desktopContentToDisplay = (
          <>
            <FriendsCurrent />
            <FriendInvitationsSentByMePreview />
          </>
        );
        mobileContentToDisplay = (
          <>
            {currentFriendList.length > 0 ? (
              <>
                <FriendsCurrent />
                <FriendInvitationsSentByMePreview />
              </>
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
        desktopContentToDisplay = (
          <FriendInvitationsSentByMe />
        );
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
      case 'requests':
      default:
        desktopContentToDisplay = (
          <>
            <Helmet title="Friends - We Vote" />
            <BrowserPushMessage incomingProps={this.props} />
            <div className="row">
              <div className="col-sm-12 col-md-8">
                <>
                  {voterIsSignedIn && (
                    <Suspense fallback={<></>}>
                      <FirstAndLastNameRequiredAlert />
                    </Suspense>
                  )}
                  {!!(!voterIsSignedIn || !friendActivityExists) && (
                    <InviteByEmail />
                  )}
                  <FriendInvitationsSentToMe />
                  <SuggestedFriendsPreview />
                  <SuggestedContacts />
                </>
              </div>
              <div className="col-sm-12 col-md-4">
                {!!(voterIsSignedIn && friendActivityExists) && (
                  <div>
                    <div>
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
              <FriendInvitationsSentToMe />
              <SuggestedFriends />
              <SuggestedContacts />
            </>
            {!!(voterIsSignedIn && friendActivityExists) && (
              <div>
                <div>
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
        break;
    }

    return (
      <PageContentContainer>
        <SnackNotifier />
        {voterIsSignedIn ? (
          <>
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
          </>
        ) : (
          // <DelayedLoad waitBeforeShow={1000}>
          <OuterSignInOptionsWrapper>
            <InnerSignInOptionsWrapper style={expandSideMarginsIfCordova}>
              <Suspense fallback={<></>}>
                <SignInOptionsPanel
                  pleaseSignInTitle="Sign In to Find Your Friends"
                  pleaseSignInSubTitle="We Vote is a community of friends who care about voting and democracy."
                />
              </Suspense>
            </InnerSignInOptionsWrapper>
          </OuterSignInOptionsWrapper>
          // </DelayedLoad>
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

const FacebookSignInWrapper = styled('div')`
  flex: 1;
  margin-top: 25px;
  @media (min-width: 614px) and (max-width: 991px) {
    padding-left: 8px;
  }
`;

const FindYourContactsWrapper = styled('div')`
  margin-bottom: 48px;
`;

const FriendsHeading = styled('div')`
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
  // box-shadow: {standardBoxShadow('wide')};
`;

const OuterSignInOptionsWrapper = styled('div')`
  display: flex;
  justify-content: center;
`;

const SectionTitle = styled('h2')`
  width: fit-content;
  font-weight: bolder;
  font-size: 18px;
  margin-bottom: 4px;
  display: inline;
`;

const InnerSignInOptionsWrapper = styled('div')(({ theme }) => (`
  max-width: 500px;
  ${theme.breakpoints.down('sm')} {
    margin: 0 12px;
  }
`));

const SignInOptionsWrapper = styled('div')`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const TwitterSignInWrapper = styled('div')`
  flex: 1;
  margin-top: 25px;
  @media (min-width: 614px) and (max-width: 991px) {
    padding-right: 8px;
  }
`;

export default withStyles(styles)(Friends);
