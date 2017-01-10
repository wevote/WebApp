import React, { Component, PropTypes } from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router";
import Candidate from "./Ballot/Candidate";
import Helmet from "react-helmet";
import LoadingWheel from "../components/LoadingWheel";
import GuidePositionList from "./Guide/GuidePositionList";
import OrganizationActions from "../actions/OrganizationActions";
import PositionListForFriends from "./Guide/PositionListForFriends";
import TwitterActions from "../actions/TwitterActions";
import TwitterStore from "../stores/TwitterStore";
import UnknownTwitterAccount from "./Guide/UnknownTwitterAccount";
import VoterStore from "../stores/VoterStore";

export default class NotFound extends Component {
  static propTypes = {
    params: PropTypes.object
  };

  constructor (props) {
    super(props);
    this.state = {};
  }

  componentDidMount () {
    TwitterActions.twitterIdentityRetrieve(this.props.params.twitter_handle);
    this.twitterStoreListener = TwitterStore.addListener(this._onTwitterStoreChange.bind(this));

    this._onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this._onVoterStoreChange.bind(this));
  }

  componentWillReceiveProps (nextProps) {
    TwitterActions.twitterIdentityRetrieve(nextProps.params.twitter_handle);
  }

  componentWillUnmount (){
    this.twitterStoreListener.remove();
    this.voterStoreListener.remove();
  }

  _onTwitterStoreChange (){
    let { kind_of_owner, owner_we_vote_id, twitter_handle, twitter_description, twitter_followers_count, twitter_name,
      twitter_photo_url, twitter_user_website,
      status } = TwitterStore.get();

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

  _onVoterStoreChange () {
    this.setState({ voter: VoterStore.getVoter() });
  }

  organizationCreateFromTwitter (new_twitter_handle) {
    OrganizationActions.saveFromTwitter(new_twitter_handle);
  }

  render () {
    if (this.state.status === undefined){
      // Show a loading wheel while this component's data is loading
      return LoadingWheel;
    }

    const { voter, kind_of_owner, owner_we_vote_id, twitter_handle } = this.state;
    let signed_in_twitter = voter === undefined ? false : voter.signed_in_twitter;
    let signed_in_with_this_twitter_account = false;
    let looking_at_positions_for_friends_only = false;
    if (signed_in_twitter) {
      let twitter_handle_being_viewed = twitter_handle;  // Variable copied for code clarity
      // That is, you are looking at yourself
      signed_in_with_this_twitter_account = voter.twitter_screen_name === twitter_handle_being_viewed;

      // If we want to give people a way to only see the positions that are only visible to their friends, this is how
      looking_at_positions_for_friends_only = false;
    }

    // If signed_in_with_this_twitter_account AND not an ORGANIZATION or POLITICIAN, then create ORGANIZATION
    // We *may* eventually have a "VOTER" type, but for now ORGANIZATION is all we need for both orgs and voters
    var is_neither_organization_nor_politician = kind_of_owner !== "ORGANIZATION" && kind_of_owner !== "POLITICIAN";
    var voter_not_linked_to_organization = kind_of_owner === "ORGANIZATION" && voter.linked_organization_we_vote_id !== owner_we_vote_id;
    if (signed_in_with_this_twitter_account && is_neither_organization_nor_politician) {
      // We make the API call to create a new organization for this Twitter handle. This will create a cascade so that
      // js/routes/NotFound will switch the view to an Organization card / PositionList
      console.log("NotFound, calling organizationCreateFromTwitter because is_neither_organization_nor_politician");
      this.organizationCreateFromTwitter(voter.twitter_screen_name);
    } else if (signed_in_with_this_twitter_account && voter_not_linked_to_organization) {
      // We (TODO DALE *should*) link the voter record to the organization with Twitter sign in -- this is for safety
      // TODO DALE 2016-10-30 Moving this to Twitter sign in
      // console.log("NotFound, calling organizationCreateFromTwitter because voter_not_linked_to_organization");
      // this.organizationCreateFromTwitter(voter.twitter_screen_name);
    }

    if (this.state.kind_of_owner === "CANDIDATE"){
      this.props.params.candidate_we_vote_id = this.state.owner_we_vote_id;
      return <Candidate candidate_we_vote_id {...this.props} />;
    } else if (this.state.kind_of_owner === "ORGANIZATION"){
      this.props.params.organization_we_vote_id = this.state.owner_we_vote_id;
      if (looking_at_positions_for_friends_only) {
        return <PositionListForFriends we_vote_id {...this.props} />;
      } else {
        return <GuidePositionList we_vote_id {...this.props} />;
      }
    } else if (this.state.kind_of_owner === "TWITTER_HANDLE_NOT_FOUND_IN_WE_VOTE"){
      return <UnknownTwitterAccount {...this.state} />;
    } else {
      return <div className="container-fluid well u-gutter__top--small fluff-full1">
              <Helmet title="Not Found - We Vote" />
              <h3 className="h3">Claim Your Page</h3>
                <div className="medium">
                  We were not able to find an account for this
                  Twitter Handle{ this.props.params.twitter_handle ?
                    <span> "{this.props.params.twitter_handle}"</span> :
                    <span />}.
                </div>
                <br />
                <Link to="/twittersigninprocess/signinswitchstart">
                  <Button bsStyle="primary">Sign Into Twitter to Create Voter Guide</Button>
                </Link>
                <br />
                <br />
                <br />
                <img src="https://github.com/wevote/WebApp/raw/develop/unclesamewevote.jpg" width="210" height="450" />
            </div>;
    }
  }
}
