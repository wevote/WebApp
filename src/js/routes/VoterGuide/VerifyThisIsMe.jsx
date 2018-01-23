import React, { Component, PropTypes } from "react";
import { Button } from "react-bootstrap";
import { browserHistory, Link } from "react-router";
import CandidateItem from "../../components/Ballot/CandidateItem";
import CandidateStore from "../../stores/CandidateStore";
import FollowToggle from "../../components/Widgets/FollowToggle";
import Helmet from "react-helmet";
import LoadingWheel from "../../components/LoadingWheel";
import OrganizationCard from "../../components/VoterGuide/OrganizationCard";
import OrganizationStore from "../../stores/OrganizationStore";
import TwitterAccountCard from "../../components/Twitter/TwitterAccountCard";
import TwitterActions from "../../actions/TwitterActions";
import TwitterStore from "../../stores/TwitterStore";
import VoterStore from "../../stores/VoterStore";

export default class VerifyThisIsMe extends Component {
  static propTypes = {
    params: PropTypes.object,
    twitter_handle: PropTypes.string
  };

  constructor (props) {
    super(props);
    this.state = {
      candidate: {},
      organization: {},
      position_list_from_advisers_followed_by_voter: [],
      voter: {},
      kind_of_owner: "",
      owner_we_vote_id: "",
      twitter_handle: "",
      twitter_description: "",
      twitter_followers_count: 0,
      twitter_name: "",
      twitter_photo_url: "",
      twitter_user_website: "",
      status: ""
    };
  }

  componentDidMount () {
    console.log("VerifyThisIsMe, Entering componentDidMount");

    this._onVoterStoreChange();
    console.log("VerifyThisIsMe, componentDidMount: " + this.props.params.twitter_handle);
    TwitterActions.twitterIdentityRetrieve(this.props.params.twitter_handle);

    this.organizationStoreListener = OrganizationStore.addListener(this._onOrganizationStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this._onVoterStoreChange.bind(this));

    this.candidateStoreListener = CandidateStore.addListener(this._onCandidateStoreChange.bind(this));

    this.twitterStoreListener = TwitterStore.addListener(this._onTwitterStoreChange.bind(this));
  }

  componentWillUnmount (){
    this.candidateStoreListener.remove();
    this.organizationStoreListener.remove();
    this.voterStoreListener.remove();
    this.twitterStoreListener.remove();
  }

  _onVoterStoreChange () {
    console.log("Entering _onVoterStoreChange");
    this.setState({ voter: VoterStore.getVoter() });
  }

  _onOrganizationStoreChange (){
    let { owner_we_vote_id } = TwitterStore.get();
    console.log("Entering _onOrganizationStoreChange, owner_we_vote_id: " + owner_we_vote_id);
    this.setState({
      organization: OrganizationStore.getOrganizationByWeVoteId(owner_we_vote_id),
    });
  }

  _onCandidateStoreChange (){
    let { owner_we_vote_id } = TwitterStore.get();
    this.setState({
      candidate: CandidateStore.getCandidate(owner_we_vote_id),
      position_list_from_advisers_followed_by_voter: CandidateStore.getPositionList(owner_we_vote_id),
    });
  }

  _onTwitterStoreChange () {
    let { kind_of_owner, owner_we_vote_id, twitter_handle, twitter_description, twitter_followers_count, twitter_name,
      twitter_photo_url, twitter_user_website,
      status } = TwitterStore.get();

    console.log("Entering _onTwitterStoreChange, owner_we_vote_id: " + owner_we_vote_id);

    this.setState({
      kind_of_owner: kind_of_owner,
      owner_we_vote_id: owner_we_vote_id,
      twitter_handle: twitter_handle,
      twitter_description: twitter_description,
      twitter_followers_count: twitter_followers_count,
      twitter_name: twitter_name,
      twitter_photo_url: twitter_photo_url,
      twitter_user_website: twitter_user_website,
      status: status
   });
  }

  render () {
    // Manage the control over this organization voter guide
    var {candidate, organization, voter} = this.state;
    var signed_in_twitter = voter === undefined ? false : voter.signed_in_twitter;
    var signed_in_with_this_twitter_account = false;
    if (signed_in_twitter) {
      console.log("In render, voter: ", voter);
      console.log("this.props.params.twitter_handle: " + this.props.params.twitter_handle);
      signed_in_with_this_twitter_account = voter.twitter_screen_name.toLowerCase() === this.props.params.twitter_handle.toLowerCase();
      if (signed_in_with_this_twitter_account) {
        // If we are being asked to verify the account we are already signed into, return to the TwitterHandle page
        console.log("signed_in_with_this_twitter_account is True");
        historyPush("/" + voter.twitter_screen_name);
        return LoadingWheel;
      }
    }

    if (this.state.status === undefined){
      // Show a loading wheel while this component's data is loading
      return LoadingWheel;
    } else if (this.state.kind_of_owner === "CANDIDATE"){
      console.log("this.state.kind_of_owner === CANDIDATE");
      this.props.params.we_vote_id = this.state.owner_we_vote_id;
      return <span>
        <Helmet title="Claim This Page - We Vote" />
        <section className="card">
          <CandidateItem {...candidate}
                         position_list={this.state.position_list_from_advisers_followed_by_voter}
                         showLargeImage />
        </section>
        <div>
          <br />
          <h1 className="h1">Please verify that you have the right to manage statements by this politician
            by signing into this Twitter account:</h1>
          <h2 className="h2">@{this.props.params.twitter_handle}</h2>
          <br />
        </div>
        { signed_in_twitter ?
          <Link to="/twittersigninprocess/signinswitchstart"><Button bsStyle="primary">Sign In
            With @{this.props.params.twitter_handle} Account</Button></Link> :
          <Link to="/twittersigninprocess/signinswitchstart"><Button bsStyle="primary">Sign Into
            Twitter</Button></Link>
        }
      </span>;
    } else if (this.state.kind_of_owner === "ORGANIZATION"){
      console.log("this.state.kind_of_owner === ORGANIZATION");
      console.log("this.state.owner_we_vote_id: " + this.state.owner_we_vote_id);
      this.props.params.we_vote_id = this.state.owner_we_vote_id;

      if (!organization){
        return <div>{LoadingWheel}</div>;
      }

      return <span>
        <Helmet title="Claim This Page - We Vote" />
          <div className="card">
            <div className="card-main">
              <FollowToggle we_vote_id={this.props.params.we_vote_id} />
              <OrganizationCard organization={organization} />
            </div>
          </div>
          <div>
            <p className="h4">Verify that you represent @{this.props.params.twitter_handle} by signing into this Twitter account.</p>
          </div>
          { signed_in_twitter ?
            <Link to="/twittersigninprocess/signinswitchstart"><Button bsStyle="primary">Sign In
              With @{this.props.params.twitter_handle} Account</Button></Link> :
            <Link to="/twittersigninprocess/signinswitchstart"><Button bsStyle="primary">Sign Into
              Twitter</Button></Link>
          }
        </span>;
    } else if (this.state.kind_of_owner === "TWITTER_HANDLE_NOT_FOUND_IN_WE_VOTE"){
      console.log("this.state.kind_of_owner === TWITTER_HANDLE_NOT_FOUND_IN_WE_VOTE");
      return <div>
        <Helmet title="Claim This Page - We Vote" />
        <TwitterAccountCard {...this.state}/>
        <div>
          <br />
          <h1 className="h1">Please verify that this is you by signing into this Twitter account:</h1>
          <h2 className="h2">@{this.props.params.twitter_handle}</h2>
          <br />
        </div>
        { signed_in_twitter ?
          <Link to="/twittersigninprocess/signinswitchstart"><Button bsStyle="primary">Sign In
            With @{this.props.params.twitter_handle} Account</Button></Link> :
          <Link to="/twittersigninprocess/signinswitchstart"><Button bsStyle="primary">Sign Into
            Twitter</Button></Link>
        }
      </div>;
    } else {
      return <div className="container-fluid well u-stack--md u-inset--md">
        <Helmet title="Could Not Confirm - We Vote" />
              <h3 className="h3">Could Not Confirm</h3>
                <div className="small">We were not able to find an account for this
                  Twitter Handle{ this.props.params.twitter_handle ?
                  <span> "{this.props.params.twitter_handle}"</span> :
                <span />}.
                </div>
                <br />
            </div>;
    }

  }
}
