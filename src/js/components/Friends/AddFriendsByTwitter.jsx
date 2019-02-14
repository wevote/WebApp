import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import LoadingWheel from '../LoadingWheel';
import FriendActions from '../../actions/FriendActions';
import FriendStore from '../../stores/FriendStore';
import { renderLog } from '../../utils/logging';
import VoterStore from '../../stores/VoterStore';

/* VISUAL DESIGN HERE: https://projects.invisionapp.com/share/2R41VR3XW#/screens/89479679 */
export default class AddFriendsByTwitter extends Component {
  static propTypes = {
  };

  constructor (props) {
    super(props);
    this.state = {
      addFriendsMessage: 'Please join me in preparing for the upcoming election.',
      twitterHandles: '',
      loading: false,
      onEnterTwitterHandlesStep: true,
      onFriendInvitationsSentStep: false,
      voter: {},
    };
  }

  componentDidMount () {
    this.setState({ voter: VoterStore.getVoter() });
    this.friendStoreListener = FriendStore.addListener(this.onFriendStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
  }

  componentWillUnmount () {
    this.friendStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onFriendStoreChange () {
    this.setState({ loading: false });
  }

  onVoterStoreChange () {
    this.setState({ voter: VoterStore.getVoter(), loading: false });
  }

  // cacheTwitterHandles (e) {
  //   this.setState({
  //     twitterHandles: e.target.value,
  //     onFriendInvitationsSentStep: false,
  //   });
  // }

  // cacheAddFriendsByTwitterMessage (e) {
  //   this.setState({
  //     addFriendsMessage: e.target.value,
  //   });
  // }

  onKeyDown = (event) => {
    const enterAndSpaceKeyCodes = [13, 32];
    const scope = this;
    if (enterAndSpaceKeyCodes.includes(event.keyCode)) {
      scope.AddFriendsByTwitterStepsManager(event).bind(scope);
    }
  }

  AddFriendsByTwitterStepsManager = (event) => {
    // This function is called when the form is submitted
    console.log('AddFriendsByTwitterStepsManager');

    // Validate twitterHandles
    let twitterHandlesError = false;
    if (!this.state.twitterHandles) {
      twitterHandlesError = true;
    }

    if (twitterHandlesError) {
      console.log('AddFriendsByTwitterStepsManager, twitterHandlesError');
      this.setState({
        loading: false,
      });
    } else if (!this.hasValidEmail()) {
      console.log('AddFriendsByTwitterStepsManager, NOT hasValidEmail');
      this.setState({
        loading: false,
        onRequestEmailStep: true,
      });
    } else {
      console.log('AddFriendsByTwitterStepsManager, calling friendInvitationByTwitterHandleSend');
      this.friendInvitationByTwitterHandleSend(event);
    }
  }

  friendInvitationByTwitterHandleSend (e) {
    e.preventDefault();
    FriendActions.friendInvitationByTwitterHandleSend(this.state.twitterHandles, this.state.addFriendsMessage);
    this.setState({
      loading: true,
      twitterHandles: '',
      onEnterTwitterHandlesStep: true,
      onRequestEmailStep: false,
      onFriendInvitationsSentStep: true,
    });
  }

  hasValidEmail () {
    const { voter } = this.state;
    return voter !== undefined ? voter.has_valid_email : false;
  }

  render () {
    renderLog(__filename);
    const { loading } = this.state;
    if (loading) {
      return LoadingWheel;
    }

    const floatRight = {
      float: 'right',
    };

    return (
      <div>
        {this.state.onFriendInvitationsSentStep ? (
          <div className="alert alert-success">
          Invitations sent. Is there anyone else you&apos;d like to invite?
          </div>
        ) : null
        }

        {this.state.onEnterTwitterHandlesStep ? (
          <div>
            <form onSubmit={this.AddFriendsByTwitterStepsManager} className="u-stack--md">
              <div>
            ADD_FRIENDS_BY_TWITTER - NOT FINISHED YET
                {/* <input type="text" name="email_address"
                   className="form-control"
                   onChange={this.cacheTwitterHandles.bind(this)}
                   placeholder="Enter twitter handles here, separated by commas" />
            {this.state.twitter_handles ?
              <span>
                <label htmlFor="last-name">Include a Message <span className="small">(Optional)</span></label><br />
                <input type="text" name="addFriendsMessage"
                       className="form-control"
                       onChange={this.cacheAddFriendsByTwitterMessage.bind(this)}
                       defaultValue="Please join me in preparing for the upcoming election." />
              </span> :
              null } */}
              </div>
            </form>

            <div>
              <span style={floatRight}>
                <Button
                  tabIndex="0"
                  onKeyDown={this.onKeyDown}
                  onClick={this.AddFriendsByTwitterStepsManager}
                  variant="primary"
                  disabled={!this.state.twitter_handles}
                >
                  { this.hasValidEmail() ?
                    <span>Send &gt;</span> :
                    <span>Next &gt;</span>
                  }
                </Button>
              </span>
              <p>
                These friends will see what you support, oppose, and which opinions you listen to.
              </p>
            </div>
          </div>
        ) : null
        }

        {this.state.onRequestEmailStep ? (
          <div>
          ON REQUEST EMAIL STEP
          </div>
        ) : null
        }
      </div>
    );
  }
}
