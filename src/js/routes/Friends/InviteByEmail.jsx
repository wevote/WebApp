import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { Link } from 'react-router';
import AddFriendsByEmail from '../../components/Friends/AddFriendsByEmail';
import AnalyticsActions from '../../actions/AnalyticsActions';
import CurrentFriends from '../../components/Connect/CurrentFriends';
import FriendActions from '../../actions/FriendActions';
import FriendStore from '../../stores/FriendStore';
import { renderLog } from '../../utils/logging';
import VoterStore from '../../stores/VoterStore';

export default class InviteByEmail extends Component {
  static propTypes = {
  };

  constructor (props) {
    super(props);
    this.state = {
      currentFriendsList: FriendStore.currentFriends(),
      maximumFriendDisplay: 25,
    };
  }

  componentDidMount () {
    if (this.state.currentFriendsList) {
      FriendActions.currentFriends();
    }
    this.friendStoreListener = FriendStore.addListener(this.onFriendStoreChange.bind(this));
    AnalyticsActions.saveActionInviteByEmail(VoterStore.electionId());
  }

  componentWillUnmount () {
    this.friendStoreListener.remove();
  }

  onFriendStoreChange () {
    this.setState({
      currentFriendsList: FriendStore.currentFriends(),
    });
  }

  render () {
    renderLog(__filename);
    return (
      <div>
        <Helmet title="Build Your We Vote Network" />
        <h1 className="h1">Add Friends by Email</h1>

        <div className="container-fluid well u-stack--md u-inset--md">
          <AddFriendsByEmail />
        </div>

        { this.state.currentFriendsList && this.state.currentFriendsList.length ? (
          <div className="container-fluid well u-stack--md u-inset--md">
            <Link className="u-cursor--pointer u-no-underline" to="/friends">
              <h4 className="text-left">Your Current Friends</h4>
            </Link>
            <div className="card-child__list-group">
              {
                <CurrentFriends
                  currentFriendsList={this.state.currentFriendsList}
                  maximumFriendDisplay={this.state.maximumFriendDisplay}
                />
              }
              <Link className="pull-right" to="/friends">See Full Friend List</Link>
            </div>
          </div>
        ) : null
        }
      </div>
    );
  }
}
