import { Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import Alert from 'react-bootstrap/Alert';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import AppObservableStore from '../../stores/AppObservableStore';
import TwitterActions from '../../actions/TwitterActions';
import VoterSessionActions from '../../actions/VoterSessionActions';
import LoadingWheel from '../../common/components/Widgets/LoadingWheel';
import TwitterAccountCard from '../../components/Twitter/TwitterAccountCard';
import TwitterSignIn from '../../components/Twitter/TwitterSignIn';
import OrganizationCard from '../../components/VoterGuide/OrganizationCard';
import CandidateStore from '../../stores/CandidateStore';
import OrganizationStore from '../../stores/OrganizationStore';
import TwitterStore from '../../stores/TwitterStore';
import VoterStore from '../../stores/VoterStore';
import historyPush from '../../common/utils/historyPush';
import { PageContentContainer } from '../../components/Style/pageLayoutStyles';
import { renderLog } from '../../common/utils/logging';

const CandidateItem = React.lazy(() => import(/* webpackChunkName: 'CandidateItem' */ '../../components/Ballot/CandidateItem'));
const FollowToggle = React.lazy(() => import(/* webpackChunkName: 'FollowToggle' */ '../../components/Widgets/FollowToggle'));

class VerifyThisIsMe extends Component {
  constructor (props) {
    super(props);
    this.state = {
      candidate: {},
      kindOfOwner: '',
      organization: {},
      ownerWeVoteId: '',
      twitterHandle: '',
      twitterDescription: '',
      twitterFollowersCount: 0,
      twitterName: '',
      twitterPhotoUrl: '',
      twitterUserWebsite: '',
      status: '',
      voter: {},
    };
  }

  componentDidMount () {
    const { match: { params } } = this.props;
    // console.log("VerifyThisIsMe, Entering componentDidMount");
    AppObservableStore.setSignInStartFullUrl(); // Store cookie so we return to this page after sign in
    this.onVoterStoreChange();
    // console.log(`VerifyThisIsMe, componentDidMount: ${params.twitter_handle}`);
    TwitterActions.twitterIdentityRetrieve(params.twitter_handle);

    this.organizationStoreListener = OrganizationStore.addListener(this.onOrganizationStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));

    this.candidateStoreListener = CandidateStore.addListener(this.onCandidateStoreChange.bind(this));

    this.twitterStoreListener = TwitterStore.addListener(this.onTwitterStoreChange.bind(this));
  }

  componentWillUnmount () {
    this.candidateStoreListener.remove();
    this.organizationStoreListener.remove();
    this.voterStoreListener.remove();
    this.twitterStoreListener.remove();
  }

  onVoterStoreChange () {
    // console.log("Entering onVoterStoreChange");
    this.setState({ voter: VoterStore.getVoter() });
  }

  onOrganizationStoreChange () {
    const { owner_we_vote_id: ownerWeVoteId } = TwitterStore.get();
    // console.log(`Entering onOrganizationStoreChange, ownerWeVoteId: ${ownerWeVoteId}`);
    this.setState({
      organization: OrganizationStore.getOrganizationByWeVoteId(ownerWeVoteId),
    });
  }

  onCandidateStoreChange () {
    const { owner_we_vote_id: ownerWeVoteId } = TwitterStore.get();
    this.setState({
      candidate: CandidateStore.getCandidate(ownerWeVoteId),
    });
  }

  onTwitterStoreChange () {
    const {
      kind_of_owner: kindOfOwner, owner_we_vote_id: ownerWeVoteId, twitter_handle: twitterHandle,
      twitter_description: twitterDescription, twitter_followers_count: twitterFollowersCount,
      twitter_name: twitterName, twitter_photo_url: twitterPhotoUrl, twitter_user_website: twitterUserWebsite,
      status,
    } = TwitterStore.get();

    // console.log(`Entering onTwitterStoreChange, twitterHandle: ${twitterHandle}`);
    // Only clear if there is a value in twitterHandle
    if (twitterHandle) {
      this.setState({
        kindOfOwner,
        ownerWeVoteId,
        twitterHandle,
        twitterDescription,
        twitterFollowersCount,
        twitterName,
        twitterPhotoUrl,
        twitterUserWebsite,
        status,
      });
    }
  }

  goToVoterGuideDisplay = () => {
    let voterGuideDisplay = '/ballot';
    if (this.state.twitterHandle) {
      voterGuideDisplay = `/${this.state.twitterHandle}`;
    }
    historyPush(voterGuideDisplay);
  }

  voterSignOut = () => {
    const { match: { params } } = this.props;
    VoterSessionActions.voterSignOut();
    TwitterActions.twitterIdentityRetrieve(params.twitter_handle);
  }

  render () {
    renderLog('VerifyThisIsMe');  // Set LOG_RENDER_EVENTS to log all renders

    // Manage the control over this organization voter guide
    const { candidate, organization, twitterHandle, voter } = this.state;

    if (twitterHandle === undefined) {
      // December 16, 2020
      console.log('ERROR: twitterHandle is undefined in VerifyThisIsMe, skipping verification');
      return '';
    }

    const { match: { params } } = this.props;
    const signedInTwitter = voter === undefined ? false : voter.signed_in_twitter;
    let signedInWithThisTwitterAccount = false;
    if (signedInTwitter) {
      // console.log("VerifyThisIsMe render, signedInTwitter: ", signedInTwitter);
      // console.log(`VerifyThisIsMe twitterHandle: ${twitterHandle}`);
      signedInWithThisTwitterAccount = voter.twitter_screen_name.toLowerCase() === twitterHandle.toLowerCase();
      if (signedInWithThisTwitterAccount) {
        // If we are being asked to verify the account we are already signed into, return to the TwitterHandle page
        // console.log("VerifyThisIsMe signedInWithThisTwitterAccount is True");
        historyPush(`/${voter.twitter_screen_name}`);
        return LoadingWheel;
      }
    }

    if (this.state.status === undefined) {
      // Show a loading wheel while this component's data is loading
      return LoadingWheel;
    } else if (this.state.kindOfOwner === 'POLITICIAN') {
      // console.log("VerifyThisIsMe this.state.kindOfOwner === POLITICIAN");
      params.we_vote_id = this.state.ownerWeVoteId;
      return (
        <PageContentContainer>
          <Helmet title="Claim This Page - We Vote" />
          <div className="card">
            <div className="card-main">
              <div>
                <br />
                <h1 className="h1">
                  Please verify that you have the right to manage statements by this politician
                  by signing into this Twitter account:
                </h1>
                <h2 className="h2">
                  @
                  {twitterHandle}
                </h2>
                <br />
              </div>
              { signedInTwitter ? (
                <div>
                  Sign out from the Twitter account @
                  {voter.twitter_screen_name}
                  , and then Sign in with
                  {' '}
                  @
                  {twitterHandle}
                </div>
              ) : (
                <TwitterSignIn
                  buttonText={`Sign in to @${twitterHandle}`}
                  id="signInToVerifyAccess"
                />
              )}
            </div>
          </div>
          <section className="card">
            <Suspense fallback={<></>}>
              <CandidateItem
                candidateWeVoteId={candidate.we_vote_id}
                showLargeImage
                showOfficeName
              />
            </Suspense>
          </section>
        </PageContentContainer>
      );
    } else if (this.state.kindOfOwner === 'ORGANIZATION') {
      // console.log("VerifyThisIsMe this.state.kindOfOwner === ORGANIZATION");
      // console.log(`VerifyThisIsMe this.state.ownerWeVoteId: ${this.state.ownerWeVoteId}`);
      params.we_vote_id = this.state.ownerWeVoteId;

      if (!organization) {
        return <div>{LoadingWheel}</div>;
      }

      return (
        <PageContentContainer>
          <Helmet title={`Claim @${twitterHandle} - We Vote`} />
          <div className="card">
            <div className="card-main">
              { signedInTwitter ? (
                <div>
                  <Alert variant="danger">
                    You are signed into We Vote with @
                    {voter.twitter_screen_name}
                    .
                    To claim
                    {' '}
                    @
                    {twitterHandle}
                    ,
                    {' '}
                    <FakeLink onClick={this.voterSignOut}>
                      sign out
                    </FakeLink>
                    {' '}
                    of We Vote, and then sign in again with your
                    {' '}
                    @
                    {twitterHandle}
                    {' '}
                    Twitter account.
                  </Alert>
                </div>
              ) : (
                <div>
                  <Alert variant="danger">
                    Verify that you represent @
                    {twitterHandle}
                    {' '}
                    by clicking this Twitter sign in button.
                  </Alert>
                  <TwitterSignIn
                    buttonText={`Sign into @${twitterHandle}`}
                    id="signInToVerifyAccess"
                  />
                </div>
              )}
              <BackToVoterGuideWrapper>
                <Button
                  color="primary"
                  id="voterGuideSettingsPositionsSeeFullBallot"
                  onClick={this.goToVoterGuideDisplay}
                  variant="contained"
                >
                  &lt;&nbsp;&nbsp;Back to
                  {' '}
                  @
                  {twitterHandle}
                </Button>
              </BackToVoterGuideWrapper>
            </div>
          </div>
          {params.we_vote_id && (
            <div className="card">
              <div className="card-main">
                <OrganizationCard organization={organization} />
                <Suspense fallback={<></>}>
                  <FollowToggle organizationWeVoteId={params.we_vote_id} />
                </Suspense>
              </div>
            </div>
          )}
        </PageContentContainer>
      );
    } else if (this.state.kindOfOwner === 'TWITTER_HANDLE_NOT_FOUND_IN_WE_VOTE') {
      // console.log("VerifyThisIsMe this.state.kindOfOwner === TWITTER_HANDLE_NOT_FOUND_IN_WE_VOTE");
      return (
        <PageContentContainer>
          <Helmet title={`Claim @${twitterHandle} - We Vote`} />
          <TwitterAccountCard {...this.state} />
          <div>
            <br />
            <h1 className="h1">Please verify that this is you by signing into this Twitter account:</h1>
            <h2 className="h2">
              @
              {twitterHandle}
            </h2>
            <br />
          </div>
          { signedInTwitter ? (
            <div>
              You are signed into We Vote with @
              {voter.twitter_screen_name}
              .
              To claim
              {' '}
              @
              {twitterHandle}
              , sign out of We Vote, and then sign in again with your
              {' '}
              @
              {twitterHandle}
              {' '}
              Twitter account.
            </div>
          ) : (
            <TwitterSignIn
              buttonText={`Sign in to @${twitterHandle}`}
              id="signInToVerifyAccess"
            />
          )}
        </PageContentContainer>
      );
    } else {
      return (
        <PageContentContainer>
          <Helmet title={`Claim @${twitterHandle} - We Vote`} />
          <h3 className="h3">Could Not Confirm</h3>
          <div className="small">
            We were not able to find an account for this Twitter Handle
            { twitterHandle ? (
              <span>
                {' '}
                &quot;
                {twitterHandle}
                &quot;
              </span>
            ) :
              <span />}
            .
          </div>
          <br />
        </PageContentContainer>
      );
    }
  }
}
VerifyThisIsMe.propTypes = {
  match: PropTypes.object,
  twitter_handle: PropTypes.string,
};

const BackToVoterGuideWrapper = styled.div`
  text-align: left;
  margin: 20px 0;
`;

const FakeLink = styled.span`
  text-decoration: underline;
`;

const styles = () => ({
  ballotIconRoot: {
    width: 150,
    height: 150,
    color: 'rgb(171, 177, 191)',
  },
});

export default withStyles(styles)(VerifyThisIsMe);
