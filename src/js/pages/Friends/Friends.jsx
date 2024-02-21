import withStyles from '@mui/styles/withStyles';
import { filter } from 'lodash-es';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import styled from 'styled-components';
import isMobileScreenSize from '../../common/utils/isMobileScreenSize';
import FriendsCurrent from './FriendsCurrent';
import FriendInvitationsSentByMe from './FriendInvitationsSentByMe';
import InviteByEmail from './InviteByEmail';
import ActivityActions from '../../actions/ActivityActions';
import AnalyticsActions from '../../actions/AnalyticsActions';
import FriendActions from '../../actions/FriendActions';
import VoterActions from '../../actions/VoterActions';
import LoadingWheel from '../../common/components/Widgets/LoadingWheel';
import { publicFigureQuotes } from '../../common/constants/whyVoteQuotes';
import apiCalming from '../../common/utils/apiCalming';
import historyPush from '../../common/utils/historyPush';
import { renderLog } from '../../common/utils/logging';
import normalizedImagePath from '../../common/utils/normalizedImagePath';
import FacebookSignInCard from '../../components/Facebook/FacebookSignInCard';
import AddFriendsByEmail from '../../components/Friends/AddFriendsByEmail';
import FriendInvitationsSentByMePreview from '../../components/Friends/FriendInvitationsSentByMePreview';
import FriendInvitationsSentToMe from '../../components/Friends/FriendInvitationsSentToMe';
import FriendsPromoBox from '../../components/Friends/FriendsPromoBox';
import SuggestedFriends from '../../components/Friends/SuggestedFriends';
import SuggestedFriendsPreview from '../../components/Friends/SuggestedFriendsPreview';
import WhyVoteQuote from '../../components/Remind/WhyVoteQuote';
import { PageContentContainer } from '../../components/Style/pageLayoutStyles';
import TwitterSignInCard from '../../components/Twitter/TwitterSignInCard';
import BrowserPushMessage from '../../components/Widgets/BrowserPushMessage';
import MessageCard from '../../components/Widgets/MessageCard';
import SnackNotifier, { openSnackbar } from '../../common/components/Widgets/SnackNotifier';
import TooltipIcon from '../../components/Widgets/TooltipIcon';
import AppObservableStore from '../../common/stores/AppObservableStore';
import FriendStore from '../../stores/FriendStore';
import VoterStore from '../../stores/VoterStore';
import { SetUpAccountTitle } from '../../components/Style/SetUpAccountStyles';
import { cordovaFriendsWrapper } from '../../utils/cordovaOffsets';
import displayFriendsTabs from '../../utils/displayFriendsTabs';
import sortFriendListByMutualFriends from '../../utils/friendFunctions';
import { SectionDescription } from '../../components/Style/friendStyles';

const AddContactsFromGoogleButton = React.lazy(() => import(/* webpackChunkName: 'AddContactsFromGoogleButton' */ '../../components/SetUpAccount/AddContactsFromGoogleButton'));
const ContactsImportedPreview = React.lazy(() => import(/* webpackChunkName: 'ContactsImportedPreview' */ '../../components/Friends/ContactsImportedPreview'));
const FindFriendsStart = React.lazy(() => import(/* webpackChunkName: 'FindFriendsStart' */ '../../components/Friends/FindFriendsStart'));
const FirstAndLastNameRequiredAlert = React.lazy(() => import(/* webpackChunkName: 'FirstAndLastNameRequiredAlert' */ '../../components/Widgets/FirstAndLastNameRequiredAlert'));
const RemindContactsStart = React.lazy(() => import(/* webpackChunkName: 'RemindContactsStart' */ '../../components/Remind/RemindContactsStart'));
const SuggestedContacts = React.lazy(() => import(/* webpackChunkName: 'SuggestedContacts' */ '../../components/Friends/SuggestedContacts'));

const testimonialPhoto = '../../../img/global/photos/Dale_McGrew-48x48.jpg';
const testimonialAuthor = 'Dale M., Oakland, California';
const imageUrl = normalizedImagePath(testimonialPhoto);
const testimonial = 'Instead of searching through emails and social media for recommendations, I can see how my friends are voting on WeVote.';

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
      // currentFriendList: [],
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
    const { location: { pathname: currentPathname } } = window;
    AppObservableStore.setSetUpAccountBackLinkPath(currentPathname);
    const { setUpAccountEntryPath } = this.state;
    AppObservableStore.setSetUpAccountEntryPath(setUpAccountEntryPath);
    if (apiCalming('friendListsAll', 30000)) {
      FriendActions.friendListsAll();
    }
    if (apiCalming('voterContactListRetrieve', 20000)) {
      VoterActions.voterContactListRetrieve();
    }
    if (apiCalming('voterContactListSave', 60000)) {
      VoterActions.voterContactListAugmentWithWeVoteData(true);
    }
    this.resetDefaultTabForMobile();
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
    const voterContactEmailList = VoterStore.getVoterContactEmailList();
    const voterContactEmailListCount = VoterStore.getVoterContactEmailListCount();
    const contactsWithAccountList = filter(voterContactEmailList, (contact) => contact.voter_we_vote_id);
    const contactsWithAccountCount = contactsWithAccountList.length;
    this.setState({
      contactsWithAccountCount,
      voter,
      voterContactEmailListCount,
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
      // currentFriendList,
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

  resetDefaultTabForMobile () {
    const friendInvitationsSentToMe = FriendStore.friendInvitationsSentToMe();
    const suggestedFriendList = FriendStore.suggestedFriendList();
    const friendInvitationsSentByMe = FriendStore.friendInvitationsSentByMe();
    const voterContactEmailListCount = VoterStore.getVoterContactEmailListCount();

    const { match: { params: { tabItem } } } = this.props;
    let defaultTabItem;
    if (tabItem) {
      // If the voter is directed to a friends tab, make that the default
      defaultTabItem = tabItem;
    } else if (friendInvitationsSentToMe && friendInvitationsSentToMe.length > 0) {
      defaultTabItem = 'requests';
    } else if ((suggestedFriendList && suggestedFriendList.length > 0) || (voterContactEmailListCount > 0)) {
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
      contactsWithAccountCount,
      friendActivityExists, friendInvitationsSentByMe,
      friendInvitationsSentToMe, suggestedFriendList,
      voter, voterContactEmailListCount, voterIsSignedIn,
    } = this.state;
    const { /* classes, */ match: { params: { tabItem } } } = this.props;

    // console.log('friendsHeaderUnpinned', friendsHeaderUnpinned);

    if (!voter) {
      return LoadingWheel;
    }

    const findFriendsOn = true;
    // const expandSideMarginsIfCordova = isCordova() ? { marginRight: 23, marginLeft: 23 } : {};
    let mobileContentToDisplay;
    let desktopContentToDisplay;
    // console.log('friendActivityExists:', friendActivityExists, ', voterIsSignedIn:', voterIsSignedIn);

    // Generate ContentToDisplay
    if (voterIsSignedIn) {
      switch (tabItem) {
        case 'remind':
          desktopContentToDisplay = (
            <RemindOuterWrapper>
              <RemindContactsWrapper>
                <Suspense fallback={<></>}>
                  <RemindContactsStart />
                </Suspense>
              </RemindContactsWrapper>
            </RemindOuterWrapper>
          );
          mobileContentToDisplay = (
            <>
              <Suspense fallback={<></>}>
                <RemindContactsStart />
              </Suspense>
            </>
          );
          break;
        case 'suggested':
          desktopContentToDisplay = (
            <>
              {voterIsSignedIn && (
                <Suspense fallback={<></>}>
                  <FirstAndLastNameRequiredAlert />
                </Suspense>
              )}
              <SuggestedFriends displayedOnDedicatedPage />
              <Suspense fallback={<></>}>
                <SuggestedContacts />
              </Suspense>
            </>
          );
          mobileContentToDisplay = (
            <>
              {voterIsSignedIn && (
                <Suspense fallback={<></>}>
                  <FirstAndLastNameRequiredAlert />
                </Suspense>
              )}
              {suggestedFriendList.length > 0 ? (
                <>
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
                    <>
                      {voterContactEmailListCount === 0 && (
                        <MessageCard
                          mainText="Invite your friends to connect!"
                          buttonText="Invite Friends"
                          buttonURL="/friends/invite"
                        />
                      )}
                    </>
                  )}
                </>
              )}
              <Suspense fallback={<></>}>
                <SuggestedContacts />
              </Suspense>
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
                      Find Your Friends on WeVote
                    </SectionTitle>
                    <SectionDescription>
                      Importing your contacts helps you find your friends on We
                      Vote. You can delete your contact information at any time.
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
                  Find Your Friends on WeVote
                </SectionTitle>
                <SectionDescription>
                  Importing your contacts helps you find your friends on We
                  Vote. You can delete your contact information at any time.
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
          mobileContentToDisplay = (
            <>
              <FriendsCurrent />
              <FriendInvitationsSentByMePreview />
              <InviteByEmail />
              {friendInvitationsSentToMe.length > 0 ? (
                <MessageCard
                  mainText="You have friend requests. Check them out!"
                  buttonText="View Requests"
                  buttonURL="/friends/requests"
                />
              ) : (
                <>
                  {(voterContactEmailListCount > 0) && (
                    <>
                      <MessageCard
                        mainText="Add friends from your contacts"
                        buttonText="Choose friends to add"
                        buttonURL="/friends/suggested"
                      />
                    </>
                  )}
                </>
              )}
              <div className="u-show-mobile">
                <WhyVoteQuoteBlockOuterWrapper>
                  <WhyVoteQuoteBlock>
                    {publicFigureQuotes.map((oneQuote) => (
                      <WhyVoteQuote
                        key={`whyVoteQuote-${oneQuote.testimonialAuthor}`}
                        imageUrl={oneQuote.imageUrl}
                        testimonial={oneQuote.testimonial}
                        testimonialAuthor={oneQuote.testimonialAuthor}
                      />
                    ))}
                  </WhyVoteQuoteBlock>
                </WhyVoteQuoteBlockOuterWrapper>
              </div>
            </>
          );
          desktopContentToDisplay = (
            <div className="row">
              <div className="col-sm-12 col-md-8">
                {mobileContentToDisplay}
              </div>
              <div className="col-md-4">
                <WhyVoteQuoteBlock>
                  {publicFigureQuotes.map((oneQuote) => (
                    <WhyVoteQuote
                      key={`whyVoteQuote-${oneQuote.testimonialAuthor}`}
                      imageUrl={oneQuote.imageUrl}
                      testimonial={oneQuote.testimonial}
                      testimonialAuthor={oneQuote.testimonialAuthor}
                    />
                  ))}
                </WhyVoteQuoteBlock>
              </div>
            </div>
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
              <Helmet title="Friends - WeVote" />
              <BrowserPushMessage incomingProps={this.props} />
              <div className="row">
                <div className="col-sm-12 col-md-8">
                  <>
                    {(!friendActivityExists && contactsWithAccountCount) ? (
                      <ContactsImportedPreviewOuterWrapper>
                        <SetUpAccountTitle>
                          {contactsWithAccountCount}
                          {' '}
                          of your friends
                          {' '}
                          {contactsWithAccountCount === 1 ? 'is' : 'are'}
                          {' '}
                          already on WeVote
                          {' '}
                        </SetUpAccountTitle>
                        <Suspense fallback={<></>}>
                          <ContactsImportedPreview showOnlyContactsWithAccounts />
                        </Suspense>
                        <MessageCard
                          inShareModal
                          mainText=""
                          buttonText="Choose friends to add"
                          buttonURL="/friends/suggested"
                        />
                      </ContactsImportedPreviewOuterWrapper>
                    ) : null}
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
                    {((voterContactEmailListCount > 0) && !(!friendActivityExists && contactsWithAccountCount)) && (
                      <>
                        <MessageCard
                          mainText="Add friends from your contacts"
                          buttonText="Choose friends to add"
                          buttonURL="/friends/suggested"
                        />
                      </>
                    )}
                  </>
                </div>
                <div className="col-sm-12 col-md-4">
                  {!!(voterIsSignedIn && friendActivityExists) && (
                    <div>
                      <div>
                        <SectionTitle>
                          Invite Friends
                          <>
                            {isMobileScreenSize() ? (<span />) : (
                              <TooltipIcon title="These friends will see what you support and oppose." />
                            )}
                          </>
                        </SectionTitle>
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
              {(!friendActivityExists && contactsWithAccountCount) ? (
                <ContactsImportedPreviewOuterWrapper>
                  <SetUpAccountTitle>
                    {contactsWithAccountCount}
                    {' '}
                    of your friends
                    {' '}
                    {contactsWithAccountCount === 1 ? 'is' : 'are'}
                    {' '}
                    already on WeVote
                    {' '}
                  </SetUpAccountTitle>
                  <Suspense fallback={<></>}>
                    <ContactsImportedPreview showOnlyContactsWithAccounts />
                  </Suspense>
                  <MessageCard
                    inShareModal
                    mainText=""
                    buttonText="Choose friends to add"
                    buttonURL="/friends/suggested"
                  />
                </ContactsImportedPreviewOuterWrapper>
              ) : null}
              <>
                {voterIsSignedIn && (
                  <Suspense fallback={<></>}>
                    <FirstAndLastNameRequiredAlert />
                  </Suspense>
                )}
                <FriendInvitationsSentToMe />
                <SuggestedFriends />
                <InviteFriendsMobileWrapper>
                  <SectionTitle>
                    Invite Friends
                  </SectionTitle>
                  <AddFriendsByEmail inSideColumn />
                </InviteFriendsMobileWrapper>
              </>
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
    } else {
      // NOT voterIsSignedIn
    }

    return (
      <PageContentContainer>
        <SnackNotifier />
        {voterIsSignedIn ? (
          <>
            {displayFriendsTabs() ? (
              <div className="container-fluid debugStyleBottom">
                <div className="FriendsWrapper" style={cordovaFriendsWrapper()}>
                  {mobileContentToDisplay}
                </div>
              </div>
            ) : (
              <div className="container-fluid">
                <div className="container-main">
                  {desktopContentToDisplay}
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            {findFriendsOn ? (
              <RemindOuterWrapper>
                <Helmet title="Find Your Friends - WeVote" />
                <RemindContactsWrapper>
                  <Suspense fallback={<></>}>
                    <FindFriendsStart />
                  </Suspense>
                </RemindContactsWrapper>
              </RemindOuterWrapper>
            ) : (
              <RemindOuterWrapper>
                <Helmet title="Remind Your Friends - WeVote" />
                <RemindContactsWrapper>
                  <Suspense fallback={<></>}>
                    <RemindContactsStart />
                  </Suspense>
                </RemindContactsWrapper>
              </RemindOuterWrapper>
            )}
          </>
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

const ContactsImportedPreviewOuterWrapper = styled('div')`
  margin-top: 12px;
  margin-bottom: 42px;
`;

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

const InviteFriendsMobileWrapper = styled('div')`
  margin-bottom: 42px;
`;

const RemindContactsWrapper = styled('div')`
  max-width: 660px;
`;

const RemindOuterWrapper = styled('div')`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const SectionTitle = styled('h2')`
  width: fit-content;
  font-weight: bolder;
  font-size: 18px;
  margin-bottom: 4px;
  display: inline;
`;

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

const WhyVoteQuoteBlock = styled('div')`
  max-width: 450px;
`;

const WhyVoteQuoteBlockOuterWrapper = styled('div')`
  display: flex;
  justify-content: center;
  margin-bottom: 48px;
  margin-top: 36px;
  width: 100%;
`;

export default withStyles(styles)(Friends);
