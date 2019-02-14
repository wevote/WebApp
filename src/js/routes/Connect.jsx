import React, { Component } from 'react';
import { Link } from 'react-router';
import Helmet from 'react-helmet';
import AddFriendsByEmail from '../components/Friends/AddFriendsByEmail';
import CurrentFriends from '../components/Connect/CurrentFriends';
import VoterGuideStore from '../stores/VoterGuideStore';
import FriendActions from '../actions/FriendActions';
import FriendStore from '../stores/FriendStore';
import FacebookActions from '../actions/FacebookActions';
import FacebookStore from '../stores/FacebookStore';
import { renderLog } from '../utils/logging';
import OrganizationActions from '../actions/OrganizationActions';
import OrganizationsFollowedOnTwitter from '../components/Connect/OrganizationsFollowedOnTwitter';
import OrganizationStore from '../stores/OrganizationStore';
import AddFacebookFriends from '../components/Connect/AddFacebookFriends';
import ItemTinyOpinionsToFollow from '../components/VoterGuide/ItemTinyOpinionsToFollow';

export default class Connect extends Component {
  static propTypes = {

  };

  constructor (props) {
    super(props);
    this.state = {
      currentFriendsList: FriendStore.currentFriends(),
      facebookInvitableFriendsList: FacebookStore.facebookInvitableFriends(),
      voterGuidesToFollowAll: VoterGuideStore.getVoterGuidesToFollowAll(),
      organizationsFollowedOnTwitterList: OrganizationStore.getOrganizationsFollowedByVoterOnTwitter(),
      maximumNumberOfOrganizationsToDisplay: 25,
      maximumNumberOfFriendsToDisplay: 25,
      facebookInvitableFriendsImageWidth: 24,
      facebookInvitableFriendsImageHeight: 24,
    };
  }

  componentDidMount () {
    if (this.state.organizationsFollowedOnTwitterList) {
      OrganizationActions.organizationsFollowedRetrieve();
    }
    this.voterGuideStoreListener = VoterGuideStore.addListener(this.onVoterGuideStoreChange.bind(this));

    if (this.state.currentFriendsList) {
      FriendActions.currentFriends();
    }
    this.friendStoreListener = FriendStore.addListener(this.onFriendStoreChange.bind(this));

    this.onFacebookStoreChange.bind(this);
    this.facebookStoreListener = FacebookStore.addListener(this.onFacebookStoreChange.bind(this));
    if (this.state.facebookInvitableFriendsList) {
      FacebookActions.getFacebookInvitableFriendsList(this.state.facebookInvitableFriendsImageWidth,
        this.state.facebookInvitableFriendsImageHeight);
    }
  }

  componentWillUnmount () {
    this.friendStoreListener.remove();
    this.voterGuideStoreListener.remove();
    this.facebookStoreListener.remove();
  }

  onFacebookStoreChange () {
    this.setState({
      facebookInvitableFriendsList: FacebookStore.facebookInvitableFriends(),
    });
  }

  onFriendStoreChange () {
    this.setState({
      currentFriendsList: FriendStore.currentFriends(),
    });
  }

  onVoterGuideStoreChange () {
    const organizationsFollowedOnTwitterList = OrganizationStore.getOrganizationsFollowedByVoterOnTwitter();
    const voterGuidesToFollowAll = VoterGuideStore.getVoterGuidesToFollowAll();
    if (organizationsFollowedOnTwitterList !== undefined && organizationsFollowedOnTwitterList.length > 0) {
      this.setState({ organizationsFollowedOnTwitterList });
    }
    if (voterGuidesToFollowAll !== undefined && voterGuidesToFollowAll.length > 0) {
      this.setState({ voterGuidesToFollowAll: VoterGuideStore.getVoterGuidesToFollowAll() });
    }
  }

  static getProps () {
    return {};
  }

  onKeyDownEditMode (event) {
    const enterAndSpaceKeyCodes = [13, 32];
    const scope = this;
    if (enterAndSpaceKeyCodes.includes(event.keyCode)) {
      const { editMode } = this.state;
      scope.setState({ editMode: !editMode });
    }
  }

  getCurrentRoute () {
    const currentRoute = '/more/connect';
    return currentRoute;
  }

  getFollowingType () {
    switch (this.getCurrentRoute()) {
      case '/more/connect':
      default:
        return 'YOUR_FRIENDS';
    }
  }

  toggleEditMode () {
    const { editMode } = this.state;
    this.setState({ editMode: !editMode });
  }

  render () {
    renderLog(__filename);
    return (
      <div>
        <Helmet title="Build Your We Vote Network" />
        <h1 className="h1">Build Your We Vote Network</h1>

        { this.state.voterGuidesToFollowAll && this.state.voterGuidesToFollowAll.length ? (
          <div className="container-fluid well u-stack--md u-inset--md">
            <Link className="u-cursor--pointer u-no-underline" to="/opinions">
              <h4 className="text-left">Organizations to Listen To</h4>
              <p>Listen to organizations to see what they recommend</p>
            </Link>
            <div className="card-child__list-group">
              <ItemTinyOpinionsToFollow
                organizationsToFollow={this.state.voterGuidesToFollowAll}
                maximumOrganizationDisplay={this.state.maximumNumberOfOrganizationsToDisplay}
              />
              <Link className="pull-right" to="/opinions">See all</Link>
            </div>
          </div>
        ) : null
        }
        <div className="container-fluid well u-stack--md u-inset--md">
          <h4 className="text-left">Add Friends from Facebook</h4>
          <div className="card-child__list-group">
            <AddFacebookFriends
              facebookInvitableFriendsList={this.state.facebookInvitableFriendsList}
              facebookInvitableFriendsImageWidth={this.state.facebookInvitableFriendsImageWidth}
              facebookInvitableFriendsImageHeight={this.state.facebookInvitableFriendsImageHeight}
              maximumFriendDisplay={this.state.maximumNumberOfFriendsToDisplay}
            />
            <Link className="pull-right" to="/facebook_invitable_friends">See all</Link>
          </div>
        </div>

        { this.state.organizationsFollowedOnTwitterList && this.state.organizationsFollowedOnTwitterList.length ? (
          <div className="container-fluid well u-stack--md u-inset--md">
            <h4 className="text-left">Organizations you follow on Twitter</h4>
            <div className="card-child__list-group">
              <OrganizationsFollowedOnTwitter
                organizationsFollowedOnTwitter={this.state.organizationsFollowedOnTwitterList}
                maximumOrganizationDisplay={this.state.maximumNumberOfOrganizationsToDisplay}
              />
              <Link className="pull-right" to="/opinions_followed">See all organizations you listen to </Link>
            </div>
          </div>
        ) : null
        }
        <div className="container-fluid well u-stack--md u-inset--md">
          <h4 className="text-left">Add Friends by Email</h4>
          <AddFriendsByEmail />
        </div>

        { this.state.currentFriendsList && this.state.currentFriendsList.length ? (
          <div className="container-fluid well u-stack--md u-inset--md">
            <Link className="u-cursor--pointer u-no-underline" to="/friends">
              <h4 className="text-left">Your Current Friends</h4>
            </Link>
            <div className="card-child__list-group">
              <CurrentFriends
                currentFriendsList={this.state.currentFriendsList}
                maximumFriendDisplay={this.state.maximumNumberOfFriendsToDisplay}
              />
              <Link className="pull-right" to="/friends">See Full Friend List</Link>
            </div>
          </div>
        ) : null
        }
      </div>
    );
  }
}
