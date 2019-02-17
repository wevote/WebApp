import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import FriendActions from '../../actions/FriendActions';
import FriendStore from '../../stores/FriendStore';
import LoadingWheel from '../LoadingWheel';
import { renderLog } from '../../utils/logging';
import VoterStore from '../../stores/VoterStore';

/* VISUAL DESIGN HERE: https://projects.invisionapp.com/share/2R41VR3XW#/screens/89479679 */
export default class AddFriendsByFacebook extends Component {
  static propTypes = {
  };

  constructor (props) {
    super(props);
    this.state = {
      add_friends_message: 'Please join me in preparing for the upcoming election.',
      email_addresses: '',
      loading: false,
      onEnterEmailAddressesStep: true,
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

  onKeyDown = (event) => {
    const enterAndSpaceKeyCodes = [13, 32];
    const scope = this;
    if (enterAndSpaceKeyCodes.includes(event.keyCode)) {
      scope.addFriendsByFacebookStepsManager(event).bind(scope);
    }
  }

  addFriendsByFacebookStepsManager = (event) => {
    // This function is called when the form is submitted
    console.log('addFriendsByFacebookStepsManager');

    // Validate email_addresses
    let emailAddressesError = false;
    if (!this.state.email_addresses) {
      emailAddressesError = true;
    }

    if (emailAddressesError) {
      console.log('addFriendsByFacebookStepsManager, emailAddressesError');
      this.setState({
        loading: false,
      });
    } else if (!this.hasValidEmail()) {
      console.log('addFriendsByFacebookStepsManager, NOT hasValidEmail');
      this.setState({
        loading: false,
        onRequestEmailStep: true,
      });
    } else {
      console.log('addFriendsByFacebookStepsManager, calling friendInvitationByEmailSend');
      this.friendInvitationByEmailSend(event);
    }
  }

  cacheAddFriendsByFacebookMessage (e) {
    this.setState({
      add_friends_message: e.target.value,
    });
  }

  friendInvitationByEmailSend (e) {
    e.preventDefault();
    FriendActions.friendInvitationByEmailSend('', '', '', this.state.email_addresses, this.state.add_friends_message);
    this.setState({
      loading: true,
      email_addresses: '',
      onEnterEmailAddressesStep: true,
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

        {this.state.onEnterEmailAddressesStep ? (
          <div>
            <form onSubmit={this.addFriendsByFacebookStepsManager.bind(this)} className="u-stack--md">
              <div>
            ADD_FRIENDS_BY_FACEBOOK - NOT FINISHED YET
              </div>
            </form>

            <div>
              <span style={floatRight}>
                <Button
                  tabIndex="0"
                  onKeyDown={this.onKeyDown}
                  onClick={this.addFriendsByFacebookStepsManager}
                  variant="primary"
                  disabled={!this.state.email_addresses}
                >
                  { this.hasValidEmail() ?
                    <span>Send &gt;</span> :
                    <span>Next &gt;</span>
                  }
                </Button>
              </span>
              <p>These friends will see what you support, oppose, and which opinions you follow.</p>
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
