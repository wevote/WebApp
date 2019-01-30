import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button } from "react-bootstrap";
import { Link } from "react-router";
import Helmet from "react-helmet";
import CandidateItem from "../../components/Ballot/CandidateItem";
import CandidateStore from "../../stores/CandidateStore";
import { historyPush } from "../../utils/cordovaUtils";
import FollowToggle from "../../components/Widgets/FollowToggle";
import LoadingWheel from "../../components/LoadingWheel";
import { renderLog } from "../../utils/logging";
import OrganizationCard from "../../components/VoterGuide/OrganizationCard";
import OrganizationStore from "../../stores/OrganizationStore";
import TwitterAccountCard from "../../components/Twitter/TwitterAccountCard";
import TwitterActions from "../../actions/TwitterActions";
import TwitterStore from "../../stores/TwitterStore";
import VoterStore from "../../stores/VoterStore";

export default class VerifyThisIsMe extends Component {
  static propTypes = {
    params: PropTypes.object,
    twitter_handle: PropTypes.string,
  };

  constructor (props) {
    super(props);
    this.state = {
      candidate: {},
      organization: {},
      position_list_from_advisers_followed_by_voter: [],
      voter: {},
      kindOfOwner: "",
      ownerWeVoteId: "",
      twitterHandle: "",
      twitterDescription: "",
      twitterFollowersCount: 0,
      twitterName: "",
      twitterPhotoUrl: "",
      twitterUserWebsite: "",
      status: "",
    };
  }

  componentDidMount () {
    console.log("VerifyThisIsMe, Entering componentDidMount");

    this._onVoterStoreChange();
    console.log(`VerifyThisIsMe, componentDidMount: ${this.props.params.twitter_handle}`);
    TwitterActions.twitterIdentityRetrieve(this.props.params.twitter_handle);

    this.organizationStoreListener = OrganizationStore.addListener(this._onOrganizationStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this._onVoterStoreChange.bind(this));

    this.candidateStoreListener = CandidateStore.addListener(this._onCandidateStoreChange.bind(this));

    this.twitterStoreListener = TwitterStore.addListener(this._onTwitterStoreChange.bind(this));
  }

  componentWillUnmount () {
    this.candidateStoreListener.remove();
    this.organizationStoreListener.remove();
    this.voterStoreListener.remove();
    this.twitterStoreListener.remove();
  }

  _onVoterStoreChange () {
    console.log("Entering _onVoterStoreChange");
    this.setState({ voter: VoterStore.getVoter() });
  }

  _onOrganizationStoreChange () {
    const { owner_we_vote_id: ownerWeVoteId } = TwitterStore.get();
    console.log(`Entering _onOrganizationStoreChange, ownerWeVoteId: ${ownerWeVoteId}`);
    this.setState({
      organization: OrganizationStore.getOrganizationByWeVoteId(ownerWeVoteId),
    });
  }

  _onCandidateStoreChange () {
    const { owner_we_vote_id: ownerWeVoteId } = TwitterStore.get();
    this.setState({
      candidate: CandidateStore.getCandidate(ownerWeVoteId),
      position_list_from_advisers_followed_by_voter: CandidateStore.getPositionList(ownerWeVoteId),
    });
  }

  _onTwitterStoreChange () {
    const {
      kind_of_owner, owner_we_vote_id, twitter_handle, twitter_description, twitter_followers_count, twitter_name,
      twitter_photo_url, twitter_user_website,
      status,
    } = TwitterStore.get();

    console.log(`Entering _onTwitterStoreChange, owner_we_vote_id: ${owner_we_vote_id}`);

    this.setState({
      kindOfOwner: kind_of_owner,
      ownerWeVoteId: owner_we_vote_id,
      twitterHandle: twitter_handle,
      twitterDescription: twitter_description,
      twitterFollowersCount: twitter_followers_count,
      twitterName: twitter_name,
      twitterPhotoUrl: twitter_photo_url,
      twitterUserWebsite: twitter_user_website,
      status,
    });
  }

  render () {
    renderLog(__filename);

    // Manage the control over this organization voter guide
    const { candidate, organization, voter } = this.state;
    const signedInTwitter = voter === undefined ? false : voter.signed_in_twitter;
    let signedInWithThisTwitterAccount = false;
    if (signedInTwitter) {
      console.log("VerifyThisIsMe render, signedInTwitter: ", signedInTwitter);
      console.log(`VerifyThisIsMe this.state.twitterHandle: ${this.state.twitterHandle}`);
      signedInWithThisTwitterAccount = voter.twitter_screen_name.toLowerCase() === this.state.twitterHandle.toLowerCase();
      if (signedInWithThisTwitterAccount) {
        // If we are being asked to verify the account we are already signed into, return to the TwitterHandle page
        console.log("VerifyThisIsMe signedInWithThisTwitterAccount is True");
        historyPush(`/${voter.twitter_screen_name}`);
        return LoadingWheel;
      }
    }

    if (this.state.status === undefined) {
      // Show a loading wheel while this component's data is loading
      return LoadingWheel;
    } else if (this.state.kindOfOwner === "CANDIDATE") {
      console.log("VerifyThisIsMe this.state.kindOfOwner === CANDIDATE");
      this.props.params.we_vote_id = this.state.ownerWeVoteId;
      return (
        <span>
          <Helmet title="Claim This Page - We Vote" />
          <section className="card">
            <CandidateItem
              {...candidate}
              showLargeImage
            />
          </section>
          <div>
            <br />
            <h1 className="h1">
              Please verify that you have the right to manage statements by this politician
              by signing into this Twitter account:
            </h1>
            <h2 className="h2">
              @
              {this.state.twitterHandle}
            </h2>
            <br />
          </div>
          { signedInTwitter ? (
            <Link to="/twittersigninprocess/signinswitchstart">
              <Button variant="primary">
                Sign In With @
                {this.state.twitterHandle}
                {" "}
                Account
              </Button>
            </Link>
          ) : (
            <Link to="/twittersigninprocess/signinswitchstart">
              <Button variant="primary">
                Sign Into Twitter
              </Button>
            </Link>
          )}
        </span>
      );
    } else if (this.state.kindOfOwner === "ORGANIZATION") {
      console.log("VerifyThisIsMe this.state.kindOfOwner === ORGANIZATION");
      console.log(`VerifyThisIsMe this.state.ownerWeVoteId: ${this.state.ownerWeVoteId}`);
      this.props.params.we_vote_id = this.state.ownerWeVoteId;

      if (!organization) {
        return <div>{LoadingWheel}</div>;
      }

      return (
        <span>
          <Helmet title="Claim This Page - We Vote" />
          <div className="card">
            <div className="card-main">
              <FollowToggle organizationWeVoteId={this.props.params.we_vote_id} />
              <OrganizationCard organization={organization} />
            </div>
          </div>
          <div>
            <p className="h4">
              Verify that you represent @
              {this.state.twitterHandle}
              {" "}
              by signing into this Twitter account.
            </p>
          </div>
          { signedInTwitter ? (
            <Link to="/twittersigninprocess/signinswitchstart">
              <Button variant="primary">
                Sign In With @
                {this.state.twitterHandle}
                {" "}
                Account
              </Button>
            </Link>
          ) : (
            <Link to="/twittersigninprocess/signinswitchstart">
              <Button variant="primary">
                Sign Into Twitter
              </Button>
            </Link>
          )}
        </span>
      );
    } else if (this.state.kindOfOwner === "TWITTER_HANDLE_NOT_FOUND_IN_WE_VOTE") {
      console.log("VerifyThisIsMe this.state.kindOfOwner === TWITTER_HANDLE_NOT_FOUND_IN_WE_VOTE");
      return (
        <div>
          <Helmet title="Claim This Page - We Vote" />
          <TwitterAccountCard {...this.state} />
          <div>
            <br />
            <h1 className="h1">Please verify that this is you by signing into this Twitter account:</h1>
            <h2 className="h2">
              @
              {this.state.twitterHandle}
            </h2>
            <br />
          </div>
          { signedInTwitter ? (
            <Link to="/twittersigninprocess/signinswitchstart">
              <Button variant="primary">
                Sign In With @
                {this.state.twitterHandle}
                {" "}
                Account
              </Button>
            </Link>
          ) : (
            <Link to="/twittersigninprocess/signinswitchstart">
              <Button variant="primary">
                Sign Into Twitter
              </Button>
            </Link>
          )}
        </div>
      );
    } else {
      return (
        <div className="container-fluid well u-stack--md u-inset--md">
          <Helmet title="Could Not Confirm - We Vote" />
          <h3 className="h3">Could Not Confirm</h3>
          <div className="small">
            We were not able to find an account for this Twitter Handle
            { this.state.twitterHandle ? (
              <span>
                {" "}
                &quot;
                {this.state.twitterHandle}
                &quot;
              </span>
            ) :
              <span />
            }
            .
          </div>
          <br />
        </div>
      );
    }
  }
}
