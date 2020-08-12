import React, { Component } from 'react';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import { Card, CircularProgress } from '@material-ui/core';
import ActivityActions from '../../actions/ActivityActions';
import ActivityStore from '../../stores/ActivityStore';
import ActivityTidbitItem from '../../components/Activity/ActivityTidbitItem';
import AddFriendsByEmail from '../../components/Friends/AddFriendsByEmail';
import AnalyticsActions from '../../actions/AnalyticsActions';
import BallotActions from '../../actions/BallotActions';
import BallotStore from '../../stores/BallotStore';
import BrowserPushMessage from '../../components/Widgets/BrowserPushMessage';
import { cordovaDot } from '../../utils/cordovaUtils';
import DelayedLoad from '../../components/Widgets/DelayedLoad';
import FacebookSignInCard from '../../components/Facebook/FacebookSignInCard';
import FriendActions from '../../actions/FriendActions';
import LoadingWheel from '../../components/LoadingWheel';
import OrganizationActions from '../../actions/OrganizationActions';
import OrganizationStore from '../../stores/OrganizationStore';
import { PreviewImage } from '../../components/Settings/SettingsStyled';
import { renderLog } from '../../utils/logging';
import SettingsAccount from '../../components/Settings/SettingsAccount';
import ShowMoreItems from '../../components/Widgets/ShowMoreItems';
import SuggestedFriendsPreview from '../../components/Friends/SuggestedFriendsPreview';
import Testimonial from '../../components/Widgets/Testimonial';
import { formatDateToMonthDayYear, timeFromDate } from '../../utils/textFormat';
import TwitterSignInCard from '../../components/Twitter/TwitterSignInCard';
import VoterStore from '../../stores/VoterStore';

const STARTING_NUMBER_OF_ACTIVITY_TIDBITS_TO_DISPLAY = 10;


class News extends Component {
  static propTypes = {};

  constructor (props) {
    super(props);
    this.state = {
      activityTidbitsList: [],
      dateVoterJoined: '',
      activityTidbitsListLength: 0,
      loadingMoreItems: false,
      localPositionListForOrgHasBeenRetrieved: [],
      numberOfActivityTidbitsToDisplay: STARTING_NUMBER_OF_ACTIVITY_TIDBITS_TO_DISPLAY,
      voter: {},
      voterSignedInFacebook: false,
      voterSignedInTwitter: false,
    };
  }

  componentDidMount () {
    this.onActivityStoreChange();
    this.onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    this.activityStoreListener = ActivityStore.addListener(this.onActivityStoreChange.bind(this));
    ActivityActions.activityListRetrieve();
    FriendActions.currentFriends();  // We need this so we can identify if the voter is friends with this organization/person
    if (!BallotStore.allBallotItemsRetrieveCalled()) {
      BallotActions.voterBallotItemsRetrieve(0, '', '');
    }
    OrganizationActions.organizationsFollowedRetrieve();
    AnalyticsActions.saveActionNetwork(VoterStore.electionId());
  }

  componentWillUnmount () {
    this.activityStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onActivityStoreChange () {
    const activityTidbitsList = ActivityStore.allActivity();
    // console.log('activityTidbitsList:', activityTidbitsList);
    let activityTidbit = {};
    for (let count = 0; count < activityTidbitsList.length; count++) {
      activityTidbit = activityTidbitsList[count];
      if (activityTidbit && activityTidbit.speaker_organization_we_vote_id) {
        this.retrievePositionListIfNeeded(activityTidbit.speaker_organization_we_vote_id);
      }
    }
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
    } = voter;
    this.setState({
      dateVoterJoined,
      voter,
      voterIsSignedIn,
      voterSignedInFacebook,
      voterSignedInTwitter,
    });
  }

  onScroll () {
    const showMoreItemsElement =  document.querySelector('#showMoreItemsId');
    if (showMoreItemsElement) {
      const {
        activityTidbitsListLength, isSearching, numberOfActivityTidbitsToDisplay,
        totalNumberOfPositionSearchResults,
      } = this.state;

      if ((isSearching && (numberOfActivityTidbitsToDisplay < totalNumberOfPositionSearchResults)) ||
          (!isSearching && (numberOfActivityTidbitsToDisplay < activityTidbitsListLength))) {
        if (showMoreItemsElement.getBoundingClientRect().bottom <= window.innerHeight) {
          this.setState({ loadingMoreItems: true });
          this.increaseNumberOfPositionItemsToDisplay();
        } else {
          this.setState({ loadingMoreItems: false });
        }
      } else {
        this.setState({ loadingMoreItems: false });
      }
    }
  }

  increaseNumberOfPositionItemsToDisplay = () => {
    let { numberOfActivityTidbitsToDisplay } = this.state;
    // console.log('Number of position items before increment: ', numberOfActivityTidbitsToDisplay);

    numberOfActivityTidbitsToDisplay += 5;
    // console.log('Number of position items after increment: ', numberOfActivityTidbitsToDisplay);

    this.positionItemTimer = setTimeout(() => {
      this.setState({
        numberOfActivityTidbitsToDisplay,
      });
    }, 500);
  }

  componentDidCatch (error, info) {
    console.log('News.jsx caught: ', error, info.componentStack);
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

  render () {
    renderLog('News');  // Set LOG_RENDER_EVENTS to log all renders
    const {
      activityTidbitsList, dateVoterJoined, activityTidbitsListLength,
      loadingMoreItems, numberOfActivityTidbitsToDisplay,
      voter, voterIsSignedIn, voterSignedInFacebook, voterSignedInTwitter,
    } = this.state;
    // console.log('voter:', voter);
    if (!voter) {
      return LoadingWheel;
    }
    let numberOfActivityTidbitsDisplayed = 0;

    const testimonialAuthor = 'Alissa B., Oakland, California';
    const imageUrl = cordovaDot('/img/global/photos/Alissa_B-128x128.jpg');
    const testimonial = 'Great way to sort through my ballot! My husband and I used We Vote during the last election to learn more about our ballots and make some tough choices. Between following various organizations, and friending a couple of trusted friends, we felt like we had an excellent pool of information to draw from.';
    return (
      <span>
        <Helmet title="News - We Vote" />
        <BrowserPushMessage incomingProps={this.props} />
        <div className="row">
          <div className="col-sm-12 col-md-8">
            <>
              {activityTidbitsList.map((oneActivityTidbit) => {
                // console.log('oneActivityTidbit position_we_vote_id:', oneActivityTidbit.position_we_vote_id);
                // console.log('numberOfActivityTidbitsDisplayed:', numberOfActivityTidbitsDisplayed);
                if (numberOfActivityTidbitsDisplayed >= numberOfActivityTidbitsToDisplay) {
                  return null;
                }
                numberOfActivityTidbitsDisplayed += 1;
                // console.log('numberOfActivityTidbitsDisplayed: ', numberOfActivityTidbitsDisplayed);
                return (
                  <ActivityTidbitWrapper key={`${oneActivityTidbit.kind_of_activity}-${oneActivityTidbit.id}`}>
                    <Card className="card">
                      <CardNewsWrapper className="card-main">
                        <ActivityTidbitItem
                          activityTidbitId={`${oneActivityTidbit.kind_of_activity}-${oneActivityTidbit.id}`}
                        />
                      </CardNewsWrapper>
                    </Card>
                  </ActivityTidbitWrapper>
                );
              })}
            </>
            {(voterIsSignedIn && dateVoterJoined) && (
              <DelayedLoad waitBeforeShow={1000}>
                <Card className="card">
                  <div className="card-main">
                    <DateVoterJoinedWrapper>
                      <VoterAndWeVoteLogos>
                        <PreviewImage
                          alt="we vote logo"
                          width="96px"
                          src={cordovaDot('/img/global/svg-icons/we-vote-icon-square-color-dark.svg')}
                        />
                      </VoterAndWeVoteLogos>
                      <DateVoterJoined>
                        You joined We Vote
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
              </DelayedLoad>
            )}
            <div className="card u-show-mobile">
              <AddFriendsMobileWrapper className="card-main">
                <SectionTitle>
                  Voting Is Better with Friends
                </SectionTitle>
                <SectionDescription>
                  Add friends you feel comfortable talking politics with. Hear about upcoming elections and what you can do to get ready to vote.
                </SectionDescription>
                <AddFriendsByEmail inSideColumn uniqueExternalId="mobile" />
              </AddFriendsMobileWrapper>
            </div>
            {!voterIsSignedIn && (
              <DelayedLoad waitBeforeShow={1000}>
                <SettingsAccountWrapper>
                  <SettingsAccount
                    pleaseSignInTitle="Sign in to See Your News"
                    pleaseSignInSubTitle="We Vote is a community of friends who care about voting and democracy."
                  />
                </SettingsAccountWrapper>
              </DelayedLoad>
            )}
          </div>
          <div className="col-md-4 d-none d-md-block">
            <div className="card">
              <div className="card-main">
                <SectionTitle>
                  Voting Is Better with Friends
                </SectionTitle>
                <SectionDescription>
                  Hear about upcoming elections and what you can do to get ready to vote. Add friends you feel comfortable talking politics with.
                </SectionDescription>
                <AddFriendsByEmail inSideColumn uniqueExternalId="sidebar" />
              </div>
            </div>
            <SuggestedFriendsPreview inSideColumn />
            <div className="card">
              <div className="card-main">
                <Testimonial
                  imageUrl={imageUrl}
                  testimonialAuthor={testimonialAuthor}
                  testimonial={testimonial}
                />
              </div>
            </div>
            <SignInOptionsWrapper className="u-show-desktop">
              {!voterSignedInTwitter && (
                <TwitterSignInWrapper>
                  <TwitterSignInCard />
                </TwitterSignInWrapper>
              )}
              {!voterSignedInFacebook && (
                <FacebookSignInWrapper>
                  <FacebookSignInCard />
                </FacebookSignInWrapper>
              )}
            </SignInOptionsWrapper>
          </div>
        </div>
        <ShowMoreItemsWrapper id="showMoreItemsId" onClick={this.increaseNumberOfPositionItemsToDisplay}>
          <ShowMoreItems
            loadingMoreItemsNow={loadingMoreItems}
            numberOfItemsDisplayed={numberOfActivityTidbitsDisplayed}
            numberOfItemsTotal={activityTidbitsListLength}
          />
        </ShowMoreItemsWrapper>
        <LoadingItemsWheel>
          {loadingMoreItems && (
            <CircularProgress />
          )}
        </LoadingItemsWheel>
      </span>
    );
  }
}

const ActivityTidbitWrapper = styled.div`
`;

const AddFriendsMobileWrapper = styled.div`
  margin: 0 15px;
`;

const CardNewsWrapper = styled.div`
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    margin: 0 15px;
  }
`;

const DateVoterJoined = styled.div`
  align-items: center;
  color: #2e3c5d;
  display: flex;
  font-size: 22px;
  justify-content: center;
  text-align: center;
`;

const DateVoterJoinedWrapper = styled.div`
  align-items: center;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  margin: 0 20px 24px 20px;
`;

const FacebookSignInWrapper = styled.div`
  flex: 1;
  @media (min-width: 614px) and (max-width: 991px) {
    padding-left: 8px;
  }
`;

const LoadingItemsWheel = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SectionDescription = styled.div`
  color: #999;
  font-size: 14px;
  margin-bottom: 4px;
`;

const SectionTitle = styled.h2`
  width: fit-content;
  font-weight: bolder;
  font-size: 18px;
  margin-bottom: 4px;
  display: inline;
`;

const SettingsAccountWrapper = styled.div`
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    margin: 0 12px;
  }
`;

const ShowMoreItemsWrapper = styled.div`
  margin-bottom: 16px;
  padding-left: 16px;
  padding-right: 26px;
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding-right: 16px;
  }
  @media print{
    display: none;
  }
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

const VoterAndWeVoteLogos = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
`;

const styles = theme => ({
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
