import React, { Component } from 'react';
import { Alert } from 'react-bootstrap';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Mail from '@material-ui/icons/Mail';
import InputBase from '@material-ui/core/InputBase';
import LoadingWheel from '../LoadingWheel';
import { renderLog } from '../../utils/logging';
import SettingsVerifySecretCode from './SettingsVerifySecretCode';
import VoterActions from '../../actions/VoterActions';
import VoterStore from '../../stores/VoterStore';

class VoterEmailAddressEntry extends Component {
  static propTypes = {
    classes: PropTypes.object,
    inModal: PropTypes.bool,
  };

  constructor (props) {
    super(props);
    this.state = {
      disableEmailVerificationButton: false,
      displayEmailVerificationButton: false,
      editEmailsToVerifyOn: false,
      emailAddressStatus: {
        email_address_already_owned_by_other_voter: false,
        email_address_already_owned_by_this_voter: false,
        email_address_created: false,
        email_address_deleted: false,
        link_to_sign_in_email_sent: false,
        make_primary_email: false,
        sign_in_code_email_sent: false,
        verification_email_sent: false,
      },
      loading: true,
      showVerifyModal: false,
      voter: VoterStore.getVoter(),
      voterEmailAddress: '',
      voterEmailAddressIsValid: false,
      voterEmailAddressList: [],
    };

    // this.updateVoterEmailAddress = this.updateVoterEmailAddress.bind(this);
  }

  componentDidMount () {
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
    VoterActions.voterRetrieve();
    VoterActions.voterEmailAddressRetrieve();
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
  }

  onVoterStoreChange () {
    const emailAddressStatus = VoterStore.getEmailAddressStatus();
    const secretCodeVerificationStatus = VoterStore.getSecretCodeVerificationStatus();
    const { secretCodeVerified } = secretCodeVerificationStatus;
    if (secretCodeVerified) {
      this.setState({
        showVerifyModal: false,
      });
    } else if (emailAddressStatus.sign_in_code_email_sent) {
      this.setState({
        displayEmailVerificationButton: false,
        emailAddressStatus: {
          sign_in_code_email_sent: false,
        },
        voterEmailAddress: '',
        showVerifyModal: true,
      });
    } else if (emailAddressStatus.email_address_already_owned_by_this_voter) {
      this.setState({
        displayEmailVerificationButton: false,
        emailAddressStatus,
        showVerifyModal: false,
        voterEmailAddress: '',
      });
    } else {
      this.setState({
        emailAddressStatus,
      });
    }
    this.setState({
      loading: false,
      voter: VoterStore.getVoter(),
      voterEmailAddressList: VoterStore.getEmailAddressList(),
    });
  }

  setEditEmailsToVerifyOn () {
    this.setState({ editEmailsToVerifyOn: true });
  }

  setEditEmailsToVerifyOff () {
    this.setState({ editEmailsToVerifyOn: false });
  }

  setAsPrimaryEmailAddress (emailWeVoteId) {
    VoterActions.setAsPrimaryEmailAddress(emailWeVoteId);
  }

  voterEmailAddressSave = (event) => {
    // console.log('VoterEmailAddressEntry this.voterEmailAddressSave');
    event.preventDefault();
    const sendLinkToSignIn = true;
    VoterActions.voterEmailAddressSave(this.state.voterEmailAddress, sendLinkToSignIn);
    this.setState({ loading: true });
  }

  sendSignInCodeEmail = (event) => {
    event.preventDefault();
    const { voterEmailAddress, voterEmailAddressIsValid } = this.state;
    if (voterEmailAddressIsValid) {
      VoterActions.sendSignInCodeEmail(voterEmailAddress);
      this.setState({
        emailAddressStatus: {
          email_address_already_owned_by_other_voter: false,
        },
        loading: true,
      });
    } else {
      this.setState({ showError: true });
    }
  }

  displayEmailVerificationButton = () => {
    this.setState({
      displayEmailVerificationButton: true,
    });
  }

  hideEmailVerificationButton = () => {
    const { voterEmailAddress } = this.state;
    if (!voterEmailAddress) {
      // Only hide if no email entered
      this.setState({
        displayEmailVerificationButton: false,
      });
    }
  }

  closeVerifyModal = () => {
    this.setState({
      displayEmailVerificationButton: false,
      emailAddressStatus: {
        sign_in_code_email_sent: false,
      },
      showVerifyModal: false,
      voterEmailAddress: '',
    });
  }

  updateVoterEmailAddress = (e) => {
    const voterEmailAddress = e.target.value;
    const voterEmailAddressIsValid = true;
    this.setState({
      voterEmailAddress,
      voterEmailAddressIsValid,
    });
  }

  sendVerificationEmail (emailWeVoteId) {
    VoterActions.sendVerificationEmail(emailWeVoteId);
    this.setState({ loading: true });
  }

  removeVoterEmailAddress (emailWeVoteId) {
    VoterActions.removeVoterEmailAddress(emailWeVoteId);
  }

  render () {
    renderLog(__filename);
    // console.log('VoterEmailAddressEntry render');
    if (this.state.loading) {
      return LoadingWheel;
    }

    const { classes } = this.props;
    const { disableEmailVerificationButton, displayEmailVerificationButton, emailAddressStatus, showVerifyModal, voterEmailAddress } = this.state;

    const signInLinkOrCodeSent = (emailAddressStatus.link_to_sign_in_email_sent || emailAddressStatus.sign_in_code_email_sent);
    const emailAddressStatusHtml = (
      <span>
        { emailAddressStatus.email_address_already_owned_by_this_voter ||
        (emailAddressStatus.email_address_already_owned_by_other_voter && !signInLinkOrCodeSent) ? (
          <Alert variant="warning">
            { emailAddressStatus.email_address_already_owned_by_other_voter && !signInLinkOrCodeSent && (
              <span>
                That email is already being used by another account.
                <br />
                <br />
                Please click &quot;Send Login Code in an Email&quot; below to sign into that account.
              </span>
            )}
            { emailAddressStatus.email_address_already_owned_by_this_voter && !emailAddressStatus.email_address_deleted && !emailAddressStatus.make_primary_email ? <span>That email address was already verified by you. </span> : null }
          </Alert>
          ) : null
        }
        { emailAddressStatus.email_address_created ||
        emailAddressStatus.email_address_deleted ||
        emailAddressStatus.email_ownership_is_verified ||
        emailAddressStatus.verification_email_sent ||
        emailAddressStatus.link_to_sign_in_email_sent ||
        emailAddressStatus.make_primary_email ||
        emailAddressStatus.sign_in_code_email_sent ? (
          <Alert variant="success">
            { emailAddressStatus.email_address_created &&
            !emailAddressStatus.verification_email_sent ? <span>Your email address was saved. </span> : null }
            { emailAddressStatus.email_address_deleted ? <span>Your email address was deleted. </span> : null }
            { emailAddressStatus.email_ownership_is_verified ? <span>Your email address was verified. </span> : null }
            { emailAddressStatus.verification_email_sent ? <span>Please check your email. A verification email was sent. </span> : null }
            { emailAddressStatus.link_to_sign_in_email_sent ? <span>Please check your email. A sign in link was sent. </span> : null }
            { emailAddressStatus.make_primary_email ? <span>Your have chosen a new primary email. </span> : null }
            { emailAddressStatus.sign_in_code_email_sent ? <span>Please check your email. A sign in verification code was sent. </span> : null }
          </Alert>
          ) : null
        }
      </span>
    );

    let enterEmailTitle = 'Sign in with Email';
    // let enterEmailExplanation = isWebApp() ? "You'll receive a magic link in your email. Click that link to be signed into your We Vote account." :
    //   "You'll receive a magic link in the email on this phone. Click that link to be signed into your We Vote account.";
    if (this.state.voter && this.state.voter.is_signed_in) {
      enterEmailTitle = 'Add New Email';
      // enterEmailExplanation = isWebApp() ? "You'll receive a magic link in your email. Click that link to verify this new email." :
      //   "You'll receive a magic link in the email on this phone. Click that link to verify this new email.";
    }

    const enterEmailHtml = (
      <div>
        <div className="u-stack--sm u-tl">
          <strong>
            {enterEmailTitle}
          </strong>
          {' '}
          {/* enterEmailExplanation */}
        </div>
        <form className="form-inline">
          <Paper className={classes.root} elevation={1}>
            <Mail />
            <InputBase
              className={classes.input}
              type="email"
              name="voter_email_address"
              id="enterVoterEmailAddress"
              value={this.state.voterEmailAddress}
              onBlur={this.hideEmailVerificationButton}
              onChange={this.updateVoterEmailAddress}
              onFocus={this.displayEmailVerificationButton}
              placeholder="Type email here..."
            />
          </Paper>
          {displayEmailVerificationButton && (
            <Button
              className={classes.button}
              color="primary"
              disabled={disableEmailVerificationButton}
              id="voterEmailAddressEntrySendMagicLink"
              onClick={this.sendSignInCodeEmail}
              variant="contained"
            >
              Email Verification Code
            </Button>
          )
          }
        </form>
      </div>
    );

    let allowRemoveEmail;
    let emailOwnershipIsVerified;
    let isPrimaryEmailAddress;

    // ///////////////////////////////////
    // LIST OF VERIFIED EMAILS
    let verifiedEmailsFound = false;
    const verifiedEmailListHtml = this.state.voterEmailAddressList.map((voterEmailAddressFromList) => {
      emailOwnershipIsVerified = !!voterEmailAddressFromList.email_ownership_is_verified;

      if (emailOwnershipIsVerified) {
        verifiedEmailsFound = true;
        allowRemoveEmail = voterEmailAddressFromList.primary_email_address !== true;
        isPrimaryEmailAddress = voterEmailAddressFromList.primary_email_address === true;

        return (
          <div key={voterEmailAddressFromList.email_we_vote_id}>
            <div>
              <span><strong>{voterEmailAddressFromList.normalized_email_address}</strong></span>

              {isPrimaryEmailAddress && (
                <span>
                  <span>&nbsp;&nbsp;&nbsp;</span>
                Primary email
                </span>
              )}
            </div>
            {!isPrimaryEmailAddress && (
              <div>
                <span>&nbsp;&nbsp;&nbsp;</span>
                <span>
                  <a // eslint-disable-line
                    onClick={this.setAsPrimaryEmailAddress.bind(this, voterEmailAddressFromList.email_we_vote_id)}
                  >
                    Make Primary
                  </a>
                  &nbsp;&nbsp;&nbsp;
                </span>
                <span>&nbsp;&nbsp;&nbsp;</span>
                {allowRemoveEmail && (
                  <a // eslint-disable-line
                    onClick={this.removeVoterEmailAddress.bind(this, voterEmailAddressFromList.email_we_vote_id)}
                  >
                    Remove Email
                  </a>
                )}
              </div>
            )}
          </div>
        );
      } else {
        return null;
      }
    });

    // ////////////////////////////////////
    // LIST OF EMAILS TO VERIFY
    let unverifiedEmailsFound = false;
    const toVerifyEmailListHtml = this.state.voterEmailAddressList.map((voterEmailAddressFromList) => {
      emailOwnershipIsVerified = !!voterEmailAddressFromList.email_ownership_is_verified;
      if (!emailOwnershipIsVerified) {
        unverifiedEmailsFound = true;
        allowRemoveEmail = !voterEmailAddressFromList.primary_email_address;
        isPrimaryEmailAddress = !!voterEmailAddressFromList.primary_email_address;
        return (
          <div key={voterEmailAddressFromList.email_we_vote_id}>
            <div className="position-item card-child">
              <span><strong>{voterEmailAddressFromList.normalized_email_address}</strong></span>
              <span>&nbsp;&nbsp;&nbsp;</span>
              <span>To Be Verified</span>
            </div>
            {this.state.editEmailsToVerifyOn && (
              <div className="position-item card-child">
                <span>&nbsp;&nbsp;&nbsp;</span>
                {voterEmailAddressFromList.email_ownership_is_verified ?
                  null : (
                    <a // eslint-disable-line
                      onClick={this.sendVerificationEmail.bind(this, voterEmailAddressFromList.email_we_vote_id)}
                    >
                      Send Verification Again
                    </a>
                  )}

                <span>&nbsp;&nbsp;&nbsp;</span>
                {allowRemoveEmail && (
                  <a // eslint-disable-line
                    onClick={this.removeVoterEmailAddress.bind(this, voterEmailAddressFromList.email_we_vote_id)}
                  >
                    Remove Email
                  </a>
                )}
              </div>
            )}
          </div>
        );
      } else {
        return null;
      }
    });

    return (
      <Wrapper>
        {verifiedEmailsFound && !this.props.inModal ? (
          <div>
            <span className="h3">Your Emails</span>
            {emailAddressStatusHtml}
            {verifiedEmailListHtml}
          </div>
        ) : (
          <span>
            {emailAddressStatusHtml}
          </span>
        )}

        {unverifiedEmailsFound && !this.props.inModal && (
          <div>
            <span className="h3">Emails to Verify</span>
            { this.state.editEmailsToVerifyOn ? (
              <span>
                <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <span className="pull-right" onClick={this.setEditEmailsToVerifyOff.bind(this)}>
                stop editing
                </span>
              </span>
            ) : (
              <span>
                <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <span className="pull-right" onClick={this.setEditEmailsToVerifyOn.bind(this)}>
                edit
                </span>
              </span>
            )}
            <br />
            {toVerifyEmailListHtml}
          </div>
        )}
        <div className="u-stack--sm">{ enterEmailHtml }</div>
        {showVerifyModal && (
          <SettingsVerifySecretCode
            show={showVerifyModal}
            closeVerifyModal={this.closeVerifyModal}
            voterEmailAddress={voterEmailAddress}
          />
        )}
      </Wrapper>
    );
  }
}

const styles = {
  root: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingLeft: 8,
    marginBottom: 8,
  },
  input: {
    marginLeft: 8,
    flex: 1,
    padding: 8,
  },
  button: {
    width: '100%',
    padding: '12px',
  },
};

const Wrapper = styled.div`
  margin-top: 32px;
`;

export default withStyles(styles)(VoterEmailAddressEntry);
