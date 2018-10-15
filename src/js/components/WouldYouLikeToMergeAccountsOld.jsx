import React, { Component } from "react";
import PropTypes from "prop-types";
import { Alert, Button } from "react-bootstrap";
import FacebookActions from "../actions/FacebookActions";
import FacebookStore from "../stores/FacebookStore";
import { historyPush } from "../utils/cordovaUtils";
import LoadingWheel from "../components/LoadingWheel";
import { renderLog } from "../utils/logging";
import VoterActions from "../actions/VoterActions";
import VoterStore from "../stores/VoterStore";

export default class WouldYouLikeToMergeAccountsOld extends Component {
  static propTypes = {
    currentVoterWeVoteId: PropTypes.string.isRequired,
    emailSecretKey: PropTypes.string,
    facebookSecretKey: PropTypes.string,
    mergeIntoVoterWeVoteId: PropTypes.string.isRequired,
  };

  constructor (props) {
    super(props);
    this.state = {
      loading: true,
      email_address_status: {
        email_address_already_owned_by_other_voter: false,
        email_address_created: false,
        email_address_deleted: false,
        verification_email_sent: false,
      },
      facebook_sign_in_status: {
        email_address_created: false,
        email_address_deleted: false,
        verification_email_sent: false,
      },
      voter_email_address: "",
      voter_email_address_list: [],
    };
  }

  componentDidMount () {
    this.facebookStoreListener = FacebookStore.addListener(this._onFacebookStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this._onVoterStoreChange.bind(this));
    if (this.props.emailSecretKey && this.props.emailSecretKey !== "") {
      VoterActions.voterEmailAddressRetrieve();
    } else if (this.props.facebookSecretKey && this.props.facebookSecretKey !== "") {
      FacebookActions.voterFacebookSignInRetrieve();
    }
  }

  componentWillUnmount (){
    this.facebookStoreListener.remove();
    this.voterStoreListener.remove();
  }

  _onFacebookStoreChange () {
    this.setState({
      facebook_sign_in_status: FacebookStore.getFacebookAuthResponse(),
      saving: false,
    });
  }

  _onVoterStoreChange () {
    this.setState({
      email_sign_in_status: VoterStore.getEmailSignInStatus(),
      saving: false,
    });
  }

  cancelMerge () {
    historyPush("/settings/account");
  }

  voterEmailAddressSignInConfirm (email_secret_key) {
    // console.log("voterEmailAddressSignInConfirm, email_secret_key:", email_secret_key);
    VoterActions.voterEmailAddressSignInConfirm(email_secret_key);
    this.setState({
      saving: true,
    });
  }

  voterFacebookSignInConfirm () {
    FacebookActions.voterFacebookSignInConfirm();
    this.setState({saving: true});
  }

  render () {
    renderLog(__filename);
    let { saving } = this.state;
    if (saving || !this.state.email_sign_in_status){
      return LoadingWheel;
    }

    const merge_status_html = <span>
      { !this.state.email_sign_in_status.yes_please_merge_accounts ?
        <Alert variant="danger">
          The choices you've made in this browser (when not signed in) can be merged with choices stored the previous time you signed in.<br />
          <br />
          Press "Cancel Sign In" to stop signing in, and keep your recent changes.<br />
          <br />
          Press "Sign In and Merge My Offline Changes" to merge your recent choices with the choices that were saved when you previously signed in.
        </Alert> :
        null }
      { this.state.email_sign_in_status.email_address_created ?
        <Alert variant="success">
          { this.state.email_sign_in_status.email_address_created ? <span>Your email address was saved. </span> : null }
        </Alert> :
        null }
      </span>;

    let merge_action_button;
    if (this.props.emailSecretKey && this.props.emailSecretKey !== "") {
      merge_action_button = <Button onClick={this.voterEmailAddressSignInConfirm.bind(this, this.props.emailSecretKey)}
                  variant="primary">
            Sign In and Merge My Offline Changes</Button>;
    } else {
      merge_action_button = <Button onClick={this.voterFacebookSignInConfirm.bind(this)}
                  variant="primary">
            Sign In and Merge My Offline Changes</Button>;
    }

    return <div className="guidelist card-child__list-group">
      {merge_status_html}

        <div className="u-stack--md">
          <Button onClick={this.cancelMerge.bind(this)}
                  variant="default"
                  size="small">
            Cancel Sign In
          </Button>
          {merge_action_button}
        </div>
      </div>;
  }
}
