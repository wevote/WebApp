import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { Button } from 'react-bootstrap';
import { _ } from 'lodash';
import AnalyticsActions from '../actions/AnalyticsActions';
import CheckBox from '../components/Connect/CheckBox';
import webAppConfig from '../config';
import { historyPush } from '../utils/cordovaUtils';
import FacebookActions from '../actions/FacebookActions';
import FriendActions from '../actions/FriendActions';
import FacebookStore from '../stores/FacebookStore';
import LoadingWheel from '../components/LoadingWheel';
import { oAuthLog, renderLog } from '../utils/logging';
import VoterStore from '../stores/VoterStore';
import VoterActions from '../actions/VoterActions';
import WouldYouLikeToMergeAccounts from '../components/WouldYouLikeToMergeAccounts';

// December 2018:  We want to work toward being airbnb style compliant, but for now these are disabled in this file to minimize massive changes
/* eslint no-restricted-syntax: 1 */

/*
    NOTE August 2017:  This component uses the Facebook "games" api "invitiable_friends" call.  There is some legacy
    code on the server side in import_export_facebook/models.py retrieve_facebook_friends_from_facebook() which is in
    the login execution path, and uses an older "friends" api technique, that may not work anymore.

    If when you press the press the "f Choose Friends" button, no friends show up...
    1) Get the FACEBOOK_APP_ID: value for your config.js from Dale.  Also put that same value in your server side
       "SOCIAL_AUTH_FACEBOOK_KEY" in the environment_variables.json file.  The environment_variables.json file also
       requires a SOCIAL_AUTH_FACEBOOK_SECRET" value to be set that Dale will give you.
    2) Go to your facebook home page, go to settings then apps.  Delete the WeVote app if it exists.
    3) Go to the live server at https://wevote.us/welcome
    4) Logout if you are logged in
    5) Login with facebook (and note that within the login pop-up you are agreeing to "We Vote will receive:
        your public profile, friend list and email address")
    6) You now should be able navigate to "Network" in the live WeVote app, press the "f Choose Friends" button,
       and see a list of your friends.
    7) After these steps you should be able to login with facebook on your local server, and see the
       invitable_friends list.
*/

export default class FacebookInvitableFriends extends Component {
  static propTypes = {
  };

  constructor (props) {
    super(props);
    this.state = {
      facebookLoggedIn: false,
      facebookAuthResponse: {},
      facebookInvitableFriends: FacebookStore.facebookInvitableFriends(),
      facebookInvitableFriendsImageWidth: 148,
      facebookInvitableFriendsImageHeight: 148,
      add_friends_message: 'Please join me in preparing for the upcoming election.',
      saving: false,
      searchFilter: false,
      searchTerm: '',
      facebookInvitableFriendsFilteredBySearch: [],
      yes_please_merge_accounts: false,
      merging_two_accounts: false,
    };
  }

  componentWillMount () {
    this.selectedCheckBoxes = [];
  }

  componentDidMount () {
    this.onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    this.onFacebookStoreChange();
    this.facebookStoreListener = FacebookStore.addListener(this.onFacebookStoreChange.bind(this));
    AnalyticsActions.saveActionFacebookInvitableFriends(VoterStore.electionId());
  }

  componentWillUnmount () {
    this.facebookStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onVoterStoreChange () {
    this.setState({ voter: VoterStore.getVoter() });
  }

  onFacebookStoreChange () {
    this.setState({
      facebookLoggedIn: FacebookStore.loggedIn,
      facebookAuthResponse: FacebookStore.getFacebookAuthResponse(),
      facebookInvitableFriends: FacebookStore.facebookInvitableFriends(),
      saving: false,
    });
  }

  getFacebookInvitableFriends () {
    // If you are not receiving a list of friends in your local environment, see the not at the top of this file.
    FacebookActions.getFacebookInvitableFriendsList(this.state.facebookInvitableFriendsImageWidth,
      this.state.facebookInvitableFriendsImageHeight);

    // May 20, 2018: The following line "this.setState" has no effect if called from render, and throws an error:
    // [Error] Warning: setState(...): Cannot update during an existing state transition (such as within `render` or another component's constructor). Render methods should be a pure function of props and state; constructor side-effects are an anti-pattern, but can be moved to `componentWillMount`.
    // this.setState({ saving: true });
  }

  cancelMergeFunction = () => {
    historyPush({
      pathname: '/more/network',
      state: {},
    });
  }

  toggleCheckBox = (facebookInvitableFriendId, facebookInvitableFriendName) => {
    const friendSelectedCheckbox = { id: facebookInvitableFriendId, name: facebookInvitableFriendName };
    if (this.selectedCheckBoxes.length === 0) {
      this.selectedCheckBoxes.push(friendSelectedCheckbox);
    } else {
      let checkBoxNotAdded = false;
      for (const checkBox of this.selectedCheckBoxes) {
        if (checkBox.id === facebookInvitableFriendId) {
          const index = this.selectedCheckBoxes.indexOf(checkBox);
          this.selectedCheckBoxes.splice(index, 1);
          break;
        } else {
          checkBoxNotAdded = true;
        }
      }

      if (checkBoxNotAdded) {
        this.selectedCheckBoxes.push(friendSelectedCheckbox);
      }
    }
  }

  sendInviteRequestToFacebookFriends = (formSubmitEvent) => {
    formSubmitEvent.preventDefault();
    const selectedFacebookFriendsIds = [];
    const selectedFacebookFriendsNames = [];
    for (const checkbox of this.selectedCheckBoxes) {
      selectedFacebookFriendsIds.push(checkbox.id);
      selectedFacebookFriendsNames.push(checkbox.name);
    }

    this.sendFacebookAppRequest(selectedFacebookFriendsIds, selectedFacebookFriendsNames);
  };

  yesPleaseMergeAccounts = () => {
    this.setState({ yes_please_merge_accounts: true });
  }

  cacheAddFriendsByFacebookMessage (e) {
    this.setState({
      add_friends_message: e.target.value,
    });
  }

  searchFacebookFriends (event) {
    const searchTerm = event.target.value;
    if (searchTerm.length === 0) {
      this.setState({
        searchFilter: false,
        searchTerm: '',
        facebookInvitableFriendsFilteredBySearch: [],
      });
    } else {
      const searchTermLowercase = searchTerm.toLowerCase();
      const { facebookInvitableFriends } = this.state;
      const searchedFriendsList = _.filter(facebookInvitableFriends.facebook_invitable_friends_list,
        user => user.name.toLowerCase().includes(searchTermLowercase));

      this.setState({
        searchFilter: true,
        searchTerm,
        facebookInvitableFriendsFilteredBySearch: searchedFriendsList,
      });
    }
  }

  sendFacebookAppRequest (selectedFacebookFriendsIds, selectedFacebookFriendsNames) {
    const api = isWebApp() ? window.FB : window.facebookConnectPlugin; // eslint-disable-line no-undef
    api.ui({
      title: 'We Vote USA',
      redirect_uri: `${webAppConfig.WE_VOTE_HOSTNAME}/more/network`,
      method: 'apprequests',
      message: this.state.add_friends_message,
      to: selectedFacebookFriendsIds,
    }, (response) => {
      if (response.error_code === 4201) {
        oAuthLog('User Canceled the request');
      } else if (response) {
        oAuthLog('Successfully Invited', response, selectedFacebookFriendsNames);
        const data = { request_id: response.request, recipients_facebook_id_array: response.to, recipients_facebook_name_array: selectedFacebookFriendsNames };

        oAuthLog('Final data for all invitations', data);
        FriendActions.friendInvitationByFacebookSend(data);
        historyPush({
          pathname: '/friends',
          state: {
            message: 'You have successfully sent Invitation to your friends.',
            message_type: 'success',
          },
        });
      } else {
        oAuthLog('Failed To Invite');
      }
    });
  }

  voterMergeTwoAccountsByFacebookKey (facebookSecretKey, voterHasDataToPreserve = false) {
    if (!this.state.merging_two_accounts) {
      VoterActions.voterMergeTwoAccountsByFacebookKey(facebookSecretKey);

      // Prevent voterMergeTwoAccountsByFacebookKey from being called multiple times
      console.log('voter_has_data_to_preserve: ', voterHasDataToPreserve);
      this.setState({ merging_two_accounts: true });
    }
  }

  facebookLogin () {
    FacebookActions.login();
  }

  voterFacebookSaveToCurrentAccount () {
    VoterActions.voterFacebookSaveToCurrentAccount();
  }

  render () {
    renderLog(__filename);

    // console.log("this.state.voter", this.state.voter);
    if (!this.state.voter || this.state.saving) {
      // Show a loading wheel while this component's data is loading
      return LoadingWheel;
    }

    // console.log("facebook logged in: ", this.state.facebookLoggedIn);
    if (!this.state.facebookLoggedIn) {
      // console.log("Voter is not logged in through facebook");
      this.facebookLogin();
      return LoadingWheel;
    }

    if (this.state.facebookAuthResponse.facebook_sign_in_failed) {
      // console.log("Facebook sign in failed - push to /more/sign_in");
      historyPush({
        pathname: '/more/network',
        state: {
          message: 'Facebook sign in failed. Please try again.',
          message_type: 'success',
        },
      });
      return LoadingWheel;
    }

    // console.log("SignIn.jsx this.state.facebookAuthResponse:", this.state.facebookAuthResponse);
    if (!this.state.voter.signed_in_facebook && this.state.facebookAuthResponse && this.state.facebookAuthResponse.facebook_retrieve_attempted) {
      const { facebook_secret_key: facebookSecretKey } = this.state.facebookAuthResponse;

      if (this.state.yes_please_merge_accounts) {
        // Go ahead and merge this voter record with the voter record that the facebookSecretKey belongs to
        this.voterMergeTwoAccountsByFacebookKey(facebookSecretKey);
        return LoadingWheel;
      }

      // Is there a collision of two accounts?
      if (this.state.facebookAuthResponse.existing_facebook_account_found) {
        // Is there anything to save from this voter account?
        if (this.state.facebookAuthResponse.voter_has_data_to_preserve) {
          // console.log("FacebookSignInProcess voter_has_data_to_preserve is TRUE");
          // Display the question of whether to merge accounts or not
          return (
            <WouldYouLikeToMergeAccounts
              cancelMergeFunction={this.cancelMergeFunction}
              pleaseMergeAccountsFunction={this.yesPleaseMergeAccounts}
            />
          );
        } else {
          // Go ahead and merge the accounts, which means deleting the current voter and switching to the facebook-linked account
          // console.log("FacebookSignInProcess this.voterMergeTwoAccountsByFacebookKey - No data to merge");
          this.voterMergeTwoAccountsByFacebookKey(facebookSecretKey, this.state.facebookAuthResponse.voter_has_data_to_preserve);
          return LoadingWheel;
        }
      } else {
        // console.log("Setting up new Facebook entry - voterFacebookSaveToCurrentAccount");
        this.voterFacebookSaveToCurrentAccount();
        return LoadingWheel;
      }
    }

    // console.log("Voter is signed in through facebook facebookInvitableFriends: ", this.state.facebookInvitableFriends);
    if (!this.state.facebookInvitableFriends.facebook_invitable_friends_retrieved) {
      // If facebook log in finished successfully then get facebook invitable friends
      // console.log("Get facebook invitable friends");
      this.getFacebookInvitableFriends();
      return LoadingWheel;
    }

    // console.log("Facebook friends list", this.state.facebookInvitableFriends.facebook_invitable_friends_list);
    // console.log("facebook friends not exist:", this.state.facebookInvitableFriends.facebook_friends_not_exist);
    if (this.state.facebookInvitableFriends.facebook_friends_not_exist) {
      historyPush({
        pathname: '/friends',
        state: {
          message: 'There are no friends to invite from Facebook. Either there is an error, or you already invited all of your friends on Facebook!',
          message_type: 'success',
        },
      });
      return LoadingWheel;
    }

    let facebookInvitableFriendsList = [];
    if (!this.state.searchFilter) {
      facebookInvitableFriendsList = this.state.facebookInvitableFriends.facebook_invitable_friends_list;
    } else {
      facebookInvitableFriendsList = this.state.facebookInvitableFriendsFilteredBySearch;
    }

    const facebookFriendListForDisplay = facebookInvitableFriendsList.map(friend => (
      <CheckBox
        key={friend.id}
        friendId={friend.id}
        friendName={friend.name}
        friendImage={friend.picture.data.url}
        grid="col-4 col-sm-2"
        handleCheckboxChange={this.toggleCheckBox}
      />
    ));

    return (
      <div className="opinion-view">
        <Helmet title="Your Facebook Friends - We Vote" />
        <section className="card">
          <div className="card-main">
            <h4 className="h4">Add Friends from Facebook</h4>
            <div>
              <p>
                See the candidates and measures your friends recommend.
                Friends will see what you support and oppose.
              </p>
              <input
                type="text"
                className="form-control"
                name="search_facebook_friends_text"
                placeholder="Search for facebook friends."
                onChange={this.searchFacebookFriends.bind(this)}
              />
              <form onSubmit={this.sendInviteRequestToFacebookFriends.bind(this)}>
                <div className="display-in-column-with-vertical-scroll-contain">
                  <div className="display-in-column-with-vertical-scroll card">
                    <div className="row friends-list__grid">
                      { facebookInvitableFriendsList.length ?
                        facebookFriendListForDisplay : (
                          <h4 className="friends-list__default-text">
                            No friends found with the search string &apos;
                            {this.state.searchTerm}
                            &apos;.
                          </h4>
                        )}
                    </div>
                  </div>
                </div>
                <br />
                <span>
                  <label htmlFor="facebook-friends">
                    Message
                    <br />
                    <input
                      className="form-control"
                      defaultValue="Please join me on We Vote."
                      id="facebook-friends"
                      name="add_friends_message"
                      onChange={this.cacheAddFriendsByFacebookMessage.bind(this)}
                      type="text"
                    />
                  </label>
                </span>
                <br />
                <Button variant="primary" type="submit">Send</Button>
              </form>
            </div>
          </div>
        </section>
      </div>
    );
  }
}
