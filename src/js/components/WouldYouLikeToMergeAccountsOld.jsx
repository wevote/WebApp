import React, { Component } from "react";
import PropTypes from "prop-types";
import { Alert, Button } from "react-bootstrap";
import FacebookActions from "../actions/FacebookActions";
import FacebookStore from "../stores/FacebookStore";
import { historyPush } from "../utils/cordovaUtils";
import LoadingWheel from "./LoadingWheel";
import { renderLog } from "../utils/logging";
import VoterActions from "../actions/VoterActions";
import VoterStore from "../stores/VoterStore";

export default class WouldYouLikeToMergeAccountsOld extends Component {
  static propTypes = {
    emailSecretKey: PropTypes.string,
    facebookSecretKey: PropTypes.string,
  };

  constructor (props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount () {
    this.facebookStoreListener = FacebookStore.addListener(this.onFacebookStoreChange.bind(this));
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    if (this.props.emailSecretKey && this.props.emailSecretKey !== "") {
      VoterActions.voterEmailAddressRetrieve();
    } else if (this.props.facebookSecretKey && this.props.facebookSecretKey !== "") {
      FacebookActions.voterFacebookSignInRetrieve();
    }
  }

  componentWillUnmount () {
    this.facebookStoreListener.remove();
    this.voterStoreListener.remove();
  }

  onFacebookStoreChange () {
    this.setState({
      saving: false,
    });
  }

  onVoterStoreChange () {
    this.setState({
      email_sign_in_status: VoterStore.getEmailSignInStatus(),
      saving: false,
    });
  }

  cancelMerge = () => {
    historyPush("/settings/account");
  }

  voterFacebookSignInConfirm = () => {
    FacebookActions.voterFacebookSignInConfirm();
    this.setState({ saving: true });
  }

  voterEmailAddressSignInConfirm = (emailSecretKey) => {
    // console.log("voterEmailAddressSignInConfirm, emailSecretKey:", emailSecretKey);
    VoterActions.voterEmailAddressSignInConfirm(emailSecretKey);
    this.setState({
      saving: true,
    });
  }

  render () {
    renderLog(__filename);
    const { saving } = this.state;
    if (saving || !this.state.email_sign_in_status) {
      return LoadingWheel;
    }

    const mergeStatusHtml = (
      <span>
        { !this.state.email_sign_in_status.yes_please_merge_accounts ? (
          <Alert variant="danger">
            The choices you&apos;ve made in this browser (when not signed in) can be merged with choices stored the previous time you signed in.
            <br />
            <br />
            Press &quot;Cancel Sign In&quot; to stop signing in, and keep your recent changes.
            <br />
            <br />
            Press &quot;Sign In and Merge My Offline Changes&quot; to merge your recent choices with the choices that were saved when you previously signed in.
          </Alert>
        ) : null
        }
        { this.state.email_sign_in_status.email_address_created ? (
          <Alert variant="success">
            { this.state.email_sign_in_status.email_address_created ? <span>Your email address was saved. </span> : null }
          </Alert>
        ) : null
        }
      </span>
    );

    let mergeActionButton;
    if (this.props.emailSecretKey && this.props.emailSecretKey !== "") {
      mergeActionButton = (
        <Button
          onClick={this.voterEmailAddressSignInConfirm(this.props.emailSecretKey)}
          variant="primary"
        >
          Sign In and Merge My Offline Changes
        </Button>
      );
    } else {
      mergeActionButton = (
        <Button
          onClick={this.voterFacebookSignInConfirm}
          variant="primary"
        >
          Sign In and Merge My Offline Changes
        </Button>
      );
    }

    return (
      <div className="guidelist card-child__list-group">
        {mergeStatusHtml}

        <div className="u-stack--md">
          <Button
            onClick={this.cancelMerge}
            variant="default"
            size="small"
          >
            Cancel Sign In
          </Button>
          {mergeActionButton}
        </div>
      </div>
    );
  }
}
