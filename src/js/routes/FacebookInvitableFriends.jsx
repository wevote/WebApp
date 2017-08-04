import React, {Component, PropTypes } from "react";
import { browserHistory } from "react-router";
import { Button } from "react-bootstrap";
import CheckBox from "../components/Connect/CheckBox";
import LoadingWheel from "../components/LoadingWheel";
import FacebookActions from "../actions/FacebookActions";
import FriendActions from "../actions/FriendActions";
import FacebookStore from "../stores/FacebookStore";
import VoterStore from "../stores/VoterStore";
import VoterActions from "../actions/VoterActions";
import WouldYouLikeToMergeAccounts from "../components/WouldYouLikeToMergeAccounts";
var _ = require("lodash");

import Helmet from "react-helmet";
const web_app_config = require("../config");

export default class FacebookInvitableFriends extends Component {
  static propTypes = {
    history: PropTypes.object,
    children: PropTypes.object
  };

  constructor (props){
    super(props);
    this.state = {
      isChecked: false,
      facebook_logged_in: false,
      facebook_auth_response: {},
      facebook_invitable_friends: FacebookStore.facebookInvitableFriends(),
      facebook_invitable_friends_image_width: 48,
      facebook_invitable_friends_image_height: 48,
      add_friends_message: "Please join me in preparing for the upcoming election.",
      saving: false,
      search_filter: false,
      search_term: "",
      facebook_invitable_friends_filtered_by_search: [],
      yes_please_merge_accounts: false,
      merging_two_accounts: false
    };
  }

  componentDidMount () {
    this._onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this._onVoterStoreChange.bind(this));
    this._onFacebookStoreChange();
    this.facebookStoreListener = FacebookStore.addListener(this._onFacebookStoreChange.bind(this));
  }

  componentWillMount () {
    this.selectedCheckBoxes = [];
  }

  componentWillUnmount (){
    this.facebookStoreListener.remove();
    this.voterStoreListener.remove();
  }

  _onVoterStoreChange () {
    this.setState({ voter: VoterStore.getVoter() });
  }

  _onVoterStoreChange () {
    this.setState({ voter: VoterStore.getVoter() });
  }

  _onFacebookStoreChange () {
    this.setState({
      facebook_logged_in: FacebookStore.loggedIn,
      facebook_auth_response: FacebookStore.getFacebookAuthResponse(),
      facebook_invitable_friends: FacebookStore.facebookInvitableFriends(),
      saving: false
    });
  }

  cancelMergeFunction () {
    browserHistory.push({
      pathname: "/more/network",
      state: {
      }
    });
  }

  voterMergeTwoAccountsByFacebookKey (facebook_secret_key, voter_has_data_to_preserve = false) {
    if (!this.state.merging_two_accounts) {
      VoterActions.voterMergeTwoAccountsByFacebookKey(facebook_secret_key);
      // Prevent voterMergeTwoAccountsByFacebookKey from being called multiple times
      console.log("voter_has_data_to_preserve: ", voter_has_data_to_preserve);
      this.setState({merging_two_accounts: true});
    }
  }

  voterFacebookSaveToCurrentAccount () {
    VoterActions.voterFacebookSaveToCurrentAccount();
  }

  yesPleaseMergeAccounts () {
    this.setState({yes_please_merge_accounts: true});
  }

  facebookLogin () {
    FacebookActions.login();
  }

  getFacebookInvitableFriends () {
    FacebookActions.getFacebookInvitableFriendsList(this.state.facebook_invitable_friends_image_width,
      this.state.facebook_invitable_friends_image_height);
    this.setState({saving: true});
  }

  toggleCheckBox (facebook_invitable_friend_id, facebook_invitable_friend_name) {
    const friend_selected_checkbox = {id: facebook_invitable_friend_id, name: facebook_invitable_friend_name};
    if (this.selectedCheckBoxes.length === 0) {
      this.selectedCheckBoxes.push(friend_selected_checkbox);
    } else {
      for (const checkBox of this.selectedCheckBoxes) {
        var checkBoxNotAdded = false;
        if ( checkBox.id === facebook_invitable_friend_id ) {
          const index = this.selectedCheckBoxes.indexOf(checkBox);
          this.selectedCheckBoxes.splice(index, 1);
          break;
        } else {
          checkBoxNotAdded = true;
        }
      }
      if (checkBoxNotAdded) {
        this.selectedCheckBoxes.push(friend_selected_checkbox);
      }
    }
    // console.log("Selected Check Boxes: ", this.selectedCheckBoxes);
  }

  sendInviteRequestToFacebookFriends = formSubmitEvent => {
    formSubmitEvent.preventDefault();
    let selected_facebook_friends_ids = [];
    let selected_facebook_friends_names = [];
    for (const checkbox of this.selectedCheckBoxes) {
      selected_facebook_friends_ids.push(checkbox.id);
      selected_facebook_friends_names.push(checkbox.name);
    }
     this.sendFacebookAppRequest(selected_facebook_friends_ids, selected_facebook_friends_names);
  }

  cacheAddFriendsByFacebookMessage (e) {
    this.setState({
      add_friends_message: e.target.value
    });
  }

  sendFacebookAppRequest (selected_facebook_friends_ids, selected_facebook_friends_names) {
      window.FB.ui({
        title: "We Vote USA",
        redirect_uri: web_app_config.WE_VOTE_HOSTNAME + "/more/network",
        method: "apprequests",
        message: this.state.add_friends_message,
        to: selected_facebook_friends_ids,
      }, function (response) {
        if ( response.error_code === 4201 ) {
          // console.log("User Canceled the request");
        } else if ( response ) {
          // console.log("Successfully Invited", response, selected_facebook_friends_names);
          const data = {request_id: response.request, recipients_facebook_id_array: response.to, recipients_facebook_name_array: selected_facebook_friends_names};
          // console.log("Final data for all invitations", data);
          FriendActions.friendInvitationByFacebookSend(data);
          browserHistory.push({
            pathname: "/more/network",
            state: {
              message: "You have successfully sent Invitation to your friends.",
              message_type: "success"
            }
          });
        } else {
          // console.log("Failed To Invite");
        }
      });
  }

  searchFacebookFriends (event) {
    let search_term = event.target.value;
    if (search_term.length === 0) {
      this.setState({
        search_filter: false,
        search_term: "",
        facebook_invitable_friends_filtered_by_search: [],
      });
    } else {
      let search_term_lowercase = search_term.toLowerCase();
      var searched_friends_list = _.filter(this.state.facebook_invitable_friends.facebook_invitable_friends_list,
        function (user) {
            return user.name.toLowerCase().includes(search_term_lowercase);
          });

      this.setState({
        search_filter: true,
        search_term: search_term,
        facebook_invitable_friends_filtered_by_search: searched_friends_list,
      });
    }
  }

  render () {
    // console.log("this.state.voter", this.state.voter);
    if (!this.state.voter || this.state.saving) {
      // Show a loading wheel while this component's data is loading
      return LoadingWheel;
    }

    // console.log("facebook logged in: ", this.state.facebook_logged_in);
    if (!this.state.facebook_logged_in ) {
      // console.log("Voter is not logged in through facebook");
      this.facebookLogin();
      return LoadingWheel;
    }

    if (this.state.facebook_auth_response.facebook_sign_in_failed) {
      // console.log("Facebook sign in failed - push to /more/sign_in");
      browserHistory.push({
        pathname: "/more/network",
        state: {
          message: "Facebook sign in failed. Please try again.",
          message_type: "success"
        }
      });
      return LoadingWheel;
    }

    // console.log("SignIn.jsx this.state.facebook_auth_response:", this.state.facebook_auth_response);
    if (!this.state.voter.signed_in_facebook && this.state.facebook_auth_response && this.state.facebook_auth_response.facebook_retrieve_attempted) {
      // console.log("SignIn.jsx facebook_retrieve_attempted");
      let { facebook_secret_key } = this.state.facebook_auth_response;

      if (this.state.yes_please_merge_accounts) {
        // Go ahead and merge this voter record with the voter record that the facebook_secret_key belongs to
        // console.log("this.voterMergeTwoAccountsByFacebookKey -- yes please merge accounts");
        this.voterMergeTwoAccountsByFacebookKey(facebook_secret_key);
        return LoadingWheel;
      }

      // Is there a collision of two accounts?
      if (this.state.facebook_auth_response.existing_facebook_account_found) {
        // Is there anything to save from this voter account?
        if (this.state.facebook_auth_response.voter_has_data_to_preserve) {
          // console.log("FacebookSignInProcess voter_has_data_to_preserve is TRUE");
          const cancel_merge_function = this.cancelMergeFunction.bind(this);
          const please_merge_accounts_function = this.yesPleaseMergeAccounts.bind(this);
          // Display the question of whether to merge accounts or not
          return <WouldYouLikeToMergeAccounts cancelMergeFunction={cancel_merge_function}
                                            pleaseMergeAccountsFunction={please_merge_accounts_function} />;
        } else {
          // Go ahead and merge the accounts, which means deleting the current voter and switching to the facebook-linked account
          // console.log("FacebookSignInProcess this.voterMergeTwoAccountsByFacebookKey - No data to merge");
          this.voterMergeTwoAccountsByFacebookKey(facebook_secret_key, this.state.facebook_auth_response.voter_has_data_to_preserve);
          return LoadingWheel;
        }
      } else {
        // console.log("Setting up new Facebook entry - voterFacebookSaveToCurrentAccount");
        this.voterFacebookSaveToCurrentAccount();
        return LoadingWheel;
      }
    }

    // console.log("Voter is signed in through facebook facebook_invitable_friends: ", this.state.facebook_invitable_friends);
    if (!this.state.facebook_invitable_friends.facebook_invitable_friends_retrieved) {
      // If facebook log in finished successfully then get facebook invitable friends
      // console.log("Get facebook invitable friends");
      this.getFacebookInvitableFriends();
      return LoadingWheel;
    }

    // console.log("Facebook friends list", this.state.facebook_invitable_friends.facebook_invitable_friends_list);
    // console.log("facebook friends not exist:", this.state.facebook_invitable_friends.facebook_friends_not_exist);
    if (this.state.facebook_invitable_friends.facebook_friends_not_exist) {
      browserHistory.push({
        pathname: "/more/network",
        state: {
          message: "There are no friends to invite from Facebook. Either there is an error, or you already invited all of your friends on Facebook!",
          message_type: "success"
        }
      });
      return LoadingWheel;
    }


    var facebook_invitable_friends_list = [];
    if (!this.state.search_filter) {
      facebook_invitable_friends_list = this.state.facebook_invitable_friends.facebook_invitable_friends_list;
    } else {
      facebook_invitable_friends_list = this.state.facebook_invitable_friends_filtered_by_search;
    }

    const facebook_friend_list_for_display = facebook_invitable_friends_list.map( (friend) => {
        return <div key={friend.id} className="card-child">
          <CheckBox
            friendId={friend.id}
            friendName={friend.name}
            friendImage={friend.picture.data.url}
            handleCheckboxChange={this.toggleCheckBox.bind(this)}
          />
        </div>;
      });

    return <div className="opinion-view">
      <Helmet title="Your Facebook Friends - We Vote" />
      <section className="card">
        <div className="card-main">
          <h4 className="h4">Add Friends from Facebook</h4>
          <div>
            <p>
                See the candidates and measures your friends recommend.
                Friends will see what you support and oppose.
            </p>
            <input type="text"
                   className="form-control"
                   name="search_facebook_friends_text"
                   placeholder="Search for facebook friends."
                   onChange={this.searchFacebookFriends.bind(this)} />
            <form onSubmit={this.sendInviteRequestToFacebookFriends.bind(this)}>
              <div className="display-in-column-with-vertical-scroll-contain">
                <div className="display-in-column-with-vertical-scroll">
                  { facebook_invitable_friends_list.length > 0 ?
                    facebook_friend_list_for_display :
                    <h4>No friends found with the search string '{this.state.search_term}'.</h4>
                  }
                </div>
              </div>
              <br />
              <span>
                <label htmlFor="message">Message </label>
                <br />
                <input type="text" name="add_friends_message"
                       className="form-control"
                       onChange={this.cacheAddFriendsByFacebookMessage.bind(this)}
                       defaultValue="Please join me on We Vote." />
              </span>
              <br />
              <Button bsStyle="primary" type="submit">Send</Button>
            </form>
          </div>
        </div>
      </section>
    </div>;
  }
}
