import { Button } from '@material-ui/core';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';
import OrganizationActions from '../actions/OrganizationActions';
import TwitterActions from '../actions/TwitterActions';
import LoadingWheel from '../components/LoadingWheel';
import TwitterStore from '../stores/TwitterStore';
import VoterStore from '../stores/VoterStore';
import { renderLog } from '../utils/logging';

const DelayedLoad = React.lazy(() => import('../components/Widgets/DelayedLoad'));
const Candidate = React.lazy(() => import('./Ballot/Candidate'));
const OrganizationVoterGuide = React.lazy(() => import('./VoterGuide/OrganizationVoterGuide'));
const PositionListForFriends = React.lazy(() => import('./VoterGuide/PositionListForFriends'));
const UnknownTwitterAccount = React.lazy(() => import('./VoterGuide/UnknownTwitterAccount'));

// The component that gets called for paths like https://localhost:3000/sierraclub
// A Twitter handle is the username that appears at the end of your unique Twitter URL
export default class TwitterHandleLanding extends Component {
  constructor (props) {
    super(props);
    this.state = {
      activeRoute: '',
      twitterHandle: '',
    };
  }

  componentDidMount () {
    this.twitterStoreListener = TwitterStore.addListener(this.onTwitterStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));

    const { activeRoute, match: { params: { twitter_handle: twitterHandle } } } = this.props;
    const twitterHandle2 = twitterHandle || window.location.pathname.substring(1);
    // console.log(`TwitterHandleLanding componentDidMount, twitterHandle: ${twitterHandle}`);
    this.setState({
      activeRoute,
      twitterHandle2,
    });
    TwitterActions.twitterIdentityRetrieve(twitterHandle2);
    this.onVoterStoreChange();
  }

  // eslint-disable-next-line camelcase,react/sort-comp
  UNSAFE_componentWillReceiveProps (nextProps) {
    // console.log('TwitterHandleLanding componentWillReceiveProps');
    const { match: { location: { pathname: activeRoute }, params: { twitter_handle: nextTwitterHandle } } } = nextProps;
    const { twitterHandle } = this.state;
    this.setState({
      activeRoute,
    });
    // console.log('TwitterHandleLanding componentWillReceiveProps activeRoute:', activeRoute);
    if (nextTwitterHandle && twitterHandle.toLowerCase() !== nextTwitterHandle.toLowerCase()) {
      // We need this test to prevent an infinite loop
      console.log('TwitterHandleLanding componentWillReceiveProps, different twitterHandle: ', nextProps.params.twitter_handle);
      TwitterActions.resetTwitterHandleLanding();
      TwitterActions.twitterIdentityRetrieve(nextTwitterHandle);
      this.setState({
        twitterHandle: nextTwitterHandle,
      });
    }
  }

  componentWillUnmount () {
    this.twitterStoreListener.remove();
    this.voterStoreListener.remove();
    // console.log('TwitterHandleLanding componentWillUnmount, TwitterActions.resetTwitterHandleLanding()');
    // Dec 2020: caused "invariant.js:42 Uncaught Invariant Violation: Dispatch.dispatch(...): Cannot dispatch in the middle of a dispatch."
    // so hopefully this is not needed:
    // TwitterActions.resetTwitterHandleLanding();
  }

  onTwitterStoreChange () {
    // console.log('TwitterHandleLanding onTwitterStoreChange');
    let { twitter_followers_count: twitterFollowersCount } = TwitterStore.get();
    const {
      kind_of_owner: kindOfOwner, owner_we_vote_id: ownerWeVoteId, twitter_handle: twitterHandle,
      twitter_description: twitterDescription,  twitter_name: twitterName,
      twitter_photo_url: twitterPhotoUrl, twitter_user_website: twitterUserWebsite, status,
    } = TwitterStore.get();

    if (typeof twitterFollowersCount !== 'number') {
      twitterFollowersCount = 0;
    }

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

  onVoterStoreChange () {
    // console.log('TwitterHandleLanding onTwitterStoreChange');
    this.setState({ voter: VoterStore.getVoter() });
  }

  organizationCreateFromTwitter (newTwitterHandle) {
    // console.log('TwitterHandleLanding organizationCreateFromTwitter');
    OrganizationActions.saveFromTwitter(newTwitterHandle);
  }

  render () {
    renderLog('TwitterHandleLanding');  // Set LOG_RENDER_EVENTS to log all renders
    if (this.state.status === undefined) {
      // console.log('TwitterHandleLanding this.state.status undefined');
      // Show a loading wheel while this component's data is loading
      return LoadingWheel;
    }

    const {
      activeRoute, voter, kindOfOwner, ownerWeVoteId, twitterHandle: twitterHandleBeingViewed,
    } = this.state;
    const { match: { params } } = this.props;
    const signedInTwitter = voter === undefined ? false : voter.signed_in_twitter;
    let signedInWithThisTwitterAccount = false;
    let lookingAtPositionsForFriendsOnly = false;
    if (signedInTwitter) {
      // That is, you are looking at yourself
      signedInWithThisTwitterAccount = voter.twitter_screen_name === twitterHandleBeingViewed;

      // If we want to give people a way to only see the positions that are only visible to their friends, this is how
      lookingAtPositionsForFriendsOnly = false;
    }
    // If signedInWithThisTwitterAccount AND not an ORGANIZATION or POLITICIAN, then create ORGANIZATION
    // We *may* eventually have a 'VOTER' type, but for now ORGANIZATION is all we need for both orgs and voters
    const isNeitherOrganizationNorPolitician = kindOfOwner !== 'ORGANIZATION' && kindOfOwner !== 'POLITICIAN';
    if (signedInWithThisTwitterAccount && isNeitherOrganizationNorPolitician) {
      // We make the API call to create a new organization for this Twitter handle. This will create a cascade so that
      // js/routes/TwitterHandleLanding will switch the view to an Organization card / PositionList
      // console.log('TwitterHandleLanding, calling organizationCreateFromTwitter because isNeitherOrganizationNorPolitician');
      this.organizationCreateFromTwitter(voter.twitter_screen_name);
    }

    // } else if (signedInWithThisTwitterAccount && voter_not_linked_to_organization) {
    //   // We (TODO DALE *should*) link the voter record to the organization with Twitter sign in -- this is for safety
    //   // TODO DALE 2016-10-30 Moving this to Twitter sign in
    //   // console.log('TwitterHandleLanding, calling organizationCreateFromTwitter because voter_not_linked_to_organization');
    //   // this.organizationCreateFromTwitter(voter.twitter_screen_name);
    // }

    if (kindOfOwner === 'CANDIDATE') {
      params.candidate_we_vote_id = ownerWeVoteId;
      return <Candidate candidate_we_vote_id {...this.props} />;
    } else if (kindOfOwner === 'ORGANIZATION') {
      params.organization_we_vote_id = ownerWeVoteId;
      if (lookingAtPositionsForFriendsOnly) {
        return <PositionListForFriends params={params} />;
      } else {
        return (
          <OrganizationVoterGuide
            {...this.props}
            params={params}
            activeRoute={activeRoute}
          />
        );
      }
    } else if (kindOfOwner === 'TWITTER_HANDLE_NOT_FOUND_IN_WE_VOTE') {
      // console.log('TwitterHandleLanding TWITTER_HANDLE_NOT_FOUND_IN_WE_VOTE calling UnknownTwitterAccount');
      return <UnknownTwitterAccount {...this.state} />;
    } else {
      // console.log('render in TwitterHandleLanding  else, kindOfOwner');
      return (
        <DelayedLoad showLoadingText waitBeforeShow={2000}>
          <div className="container-fluid well u-stack--md u-inset--md">
            <Helmet title="Not Found - We Vote" />
            <h3 className="h3">Claim Your Page</h3>
            <div className="medium">
              We were not able to find an account for this Twitter Handle
              { twitterHandleBeingViewed ? (
                <span>
                  {' '}
                  &quot;
                  {twitterHandleBeingViewed}
                  &quot;
                </span>
              ) :
                <span />}
              .
            </div>
            <br />
            <Link
              id="TwitterHandleLandingSignIntoTwitterToCreateVoterGuideButton"
              to="/twittersigninprocess/signinswitchstart"
            >
              <Button
                color="primary"
                variant="contained"
              >
                Sign Into Twitter to Create Voter Guide
              </Button>
            </Link>
            <br />
            <br />
            <br />
          </div>
        </DelayedLoad>
      );
    }
  }
}
TwitterHandleLanding.propTypes = {
  activeRoute: PropTypes.string,
  match: PropTypes.object,
  params: PropTypes.object,
};
