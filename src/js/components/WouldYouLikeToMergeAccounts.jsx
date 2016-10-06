import React, { Component, PropTypes } from "react";
import { Alert, Button } from "react-bootstrap";
import { browserHistory } from "react-router";
import LoadingWheel from "../components/LoadingWheel";
import VoterActions from "../actions/VoterActions";
import VoterStore from "../stores/VoterStore";

export default class WouldYouLikeToMergeAccounts extends Component {
  static propTypes = {
    currentVoterWeVoteId: PropTypes.string.isRequired,
    mergeIntoVoterWeVoteId: PropTypes.string.isRequired,
    emailSecretKey: PropTypes.string.isRequired
  };

  constructor (props) {
      super(props);
      this.state = {
        loading: true,
        email_address_status: {
          email_address_already_owned_by_other_voter: false,
          email_address_created: false,
          email_address_deleted: false,
          verification_email_sent: false
        },
        voter_email_address: "",
        voter_email_address_list: []
      };
  }

  componentDidMount () {
    this.voterStoreListener = VoterStore.addListener(this._onVoterStoreChange.bind(this));
    VoterActions.retrieveEmailAddress();
  }

  componentWillUnmount (){
    this.voterStoreListener.remove();
  }

  _onVoterStoreChange () {
    this.setState({
      email_sign_in_status: VoterStore.getEmailSignInStatus(),
      saving: false
    });
  }

  cancelMerge () {
    browserHistory.push("/more/sign_in");
  }

  voterEmailAddressSignInConfirm (email_secret_key) {
    console.log("voterEmailAddressSignInConfirm, email_secret_key:", email_secret_key);
    VoterActions.voterEmailAddressSignInConfirm(email_secret_key);
    this.setState({
      saving: true
    });
  }

  render () {
    var { saving } = this.state;
    if (saving || !this.state.email_sign_in_status){
      return LoadingWheel;
    }
    const email_address_status_html = <span>
      { !this.state.email_sign_in_status.yes_please_merge_accounts ?
        <Alert bsStyle="danger">
          If you sign in now, all of your positions and friends will be merged with the account
          that is already signed into this browser. Would you like to merge? (If NOT, please cancel.)
        </Alert> :
        null }
      { this.state.email_sign_in_status.email_address_created ?
        <Alert bsStyle="success">
          { this.state.email_sign_in_status.email_address_created ? <span>Your email address was saved. </span> : null }
        </Alert> :
        null }
      </span>;

    return <div className="guidelist card-child__list-group">
      {email_address_status_html}

        <div className="u-gutter__top--small">
          <Button onClick={this.cancelMerge.bind(this)}
                  bsStyle="default"
                  bsSize="small">
            Cancel
          </Button>
          <Button onClick={this.voterEmailAddressSignInConfirm.bind(this, this.props.emailSecretKey)}
                  bsStyle="primary">
            Merge These Accounts</Button>
        </div>
      </div>;
  }
}
