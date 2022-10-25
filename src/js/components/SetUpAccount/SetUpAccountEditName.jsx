import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React, { Suspense } from 'react';
import VoterActions from '../../actions/VoterActions';
import { renderLog } from '../../common/utils/logging';
import VoterStore from '../../stores/VoterStore';
import { validateEmail } from '../../utils/regex-checks';
import {
  InputFieldsWrapper,
  OneInputFieldWrapper,
  SetUpAccountTitle,
  StepCenteredWrapper,
} from '../Style/SetUpAccountStyles';

const SettingsVerifySecretCode = React.lazy(() => import(/* webpackChunkName: 'SettingsVerifySecretCode' */ '../Settings/SettingsVerifySecretCode'));
const VoterEmailInputField = React.lazy(() => import(/* webpackChunkName: 'VoterEmailInputField' */ '../Settings/VoterEmailInputField'));
const VoterFirstNameInputField = React.lazy(() => import(/* webpackChunkName: 'VoterFirstNameInputField' */ '../Settings/VoterFirstNameInputField'));
const VoterLastNameInputField = React.lazy(() => import(/* webpackChunkName: 'VoterLastNameInputField' */ '../Settings/VoterLastNameInputField'));

class SetUpAccountEditName extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      secretCodeVerificationProcessed: false,
      voterEmailQueuedToSaveLocal: '',
    };
  }

  componentDidMount () {
    window.scrollTo(0, 0);
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
  }

  componentDidUpdate (prevProps) {
    // console.log('SetUpAccountEditName componentDidUpdate prevProps.nextButtonClicked:', prevProps.nextButtonClicked, ', this.props.nextButtonClicked:', this.props.nextButtonClicked);
    if (prevProps.nextButtonClicked === false && this.props.nextButtonClicked === true) {
      this.submitSaveNameAndEmail();
    }
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
    if (this.functionToUseWhenProfileCompleteTimer) {
      clearTimeout(this.functionToUseWhenProfileCompleteTimer);
    }
    if (this.goToNextStepTimer) {
      clearTimeout(this.goToNextStepTimer);
    }
    if (this.voterTimer) {
      clearTimeout(this.voterTimer);
    }
  }

  onVoterStoreChange () {
    const { voterWeVoteId: voterWeVoteIdPrevious, secretCodeVerificationProcessed } = this.state;
    const emailAddressStatus = VoterStore.getEmailAddressStatus();
    // const { secret_code_system_locked_for_this_voter_device_id: secretCodeSystemLocked } = emailAddressStatus;
    const secretCodeVerificationStatus = VoterStore.getSecretCodeVerificationStatus();
    const { secretCodeVerified } = secretCodeVerificationStatus;
    // console.log('onVoterStoreChange emailAddressStatus:', emailAddressStatus);

    const voter = VoterStore.getVoter();
    const { signed_in_with_email: voterIsSignedInWithEmail, we_vote_id: voterWeVoteId } = voter;
    // console.log(`SetUpAccountEditName onVoterStoreChange voterIsSignedInWithEmail: ${voterIsSignedInWithEmail}`);
    if (secretCodeVerified) {
      // Mark that voter supports this campaign
      // console.log('SetUpAccountEditName secretCodeVerified');
      if (!secretCodeVerificationProcessed) {
        VoterActions.voterRetrieve();
        this.functionToUseWhenProfileCompleteTimer = setTimeout(() => {
          this.functionToUseWhenProfileCompleteLocal();
        }, 500);
        this.setState({
          secretCodeVerificationProcessed: true,
        });
      }
    } else if (emailAddressStatus.verification_email_sent) {
      // console.log('emailAddressStatus.verification_email_sent');
      this.setState({
        showVerifyModal: true,
        voterWeVoteId,
      });
    } else if (emailAddressStatus.email_address_already_owned_by_this_voter) {
      this.setState({
        showVerifyModal: false,
        voterWeVoteId,
      });
    } else if (voterWeVoteId !== voterWeVoteIdPrevious) {
      this.setState({
        voterWeVoteId,
      });
    } else if (voterIsSignedInWithEmail) {
      // console.log('SetUpAccountEditName onVoterStoreChange voterIsSignedInWithEmail');
      if (voterWeVoteId !== voterWeVoteIdPrevious) {
        this.setState({
          voterWeVoteId,
        });
      }
    }
  }

  closeVerifyModal = (verified = false) => {
    // console.log('SetUpAccountEditName closeVerifyModal, verified:', verified);
    VoterActions.clearSecretCodeVerificationStatusAndEmail();
    const delayBeforeVoterRetrieve = 250;
    this.voterTimer = setTimeout(() => {
      VoterActions.voterRetrieve();
    }, delayBeforeVoterRetrieve);
    if (verified) {
      // console.log('SetUpAccountEditName closeVerifyModal');
      this.functionToUseWhenProfileCompleteLocal();
    }
    const delayBeforeClosingVerifyModal = 400;
    this.closeVerifyModalTimer = setTimeout(() => {
      this.setState({
        showVerifyModal: false,
      });
    }, delayBeforeClosingVerifyModal);
  };

  functionToUseWhenProfileCompleteLocal = () => {
    if (this.props.functionToUseWhenProfileComplete) {
      this.props.functionToUseWhenProfileComplete();
    }
  }

  functionToUseWhenProfileNotCompleteLocal = () => {
    if (this.props.functionToUseWhenProfileNotComplete) {
      this.props.functionToUseWhenProfileNotComplete();
    }
  }

  goToNextStepLocal = () => {
    if (this.props.goToNextStep) {
      this.props.goToNextStep();
    }
  }

  submitSaveNameAndEmail = () => {
    // console.log('SetUpAccountEditName submitSaveNameAndEmail');
    let voterEmailMissing = false;
    let voterFirstNameMissing = false;
    let voterLastNameMissing = false;
    const voterFirstNameQueuedToSave = VoterStore.getVoterFirstNameQueuedToSave();
    const voterFirstNameQueuedToSaveSet = VoterStore.getVoterFirstNameQueuedToSaveSet();
    const voterLastNameQueuedToSave = VoterStore.getVoterLastNameQueuedToSave();
    const voterLastNameQueuedToSaveSet = VoterStore.getVoterLastNameQueuedToSaveSet();
    VoterActions.voterCompleteYourProfileSave(voterFirstNameQueuedToSave, voterFirstNameQueuedToSaveSet, voterLastNameQueuedToSave, voterLastNameQueuedToSaveSet);
    VoterActions.voterFirstNameQueuedToSave(undefined);
    VoterActions.voterLastNameQueuedToSave(undefined);
    const voterIsSignedInWithEmail = VoterStore.getVoterIsSignedInWithEmail();
    const voterEmail = VoterStore.getVoterEmail();
    const voterEmailQueuedToSave = VoterStore.getVoterEmailQueuedToSave();
    // const voterEmailQueuedToSaveSet = VoterStore.getVoterEmailQueuedToSaveSet();
    if (!voterIsSignedInWithEmail && !voterEmailQueuedToSave) {
      voterEmailMissing = true;
    } else if (voterEmailQueuedToSave) {
      // Check to see if valid email format
      // if so,
      this.setState({
        voterEmailQueuedToSaveLocal: voterEmailQueuedToSave,
      });
    }
    if (!voterFirstNameQueuedToSave && !VoterStore.getFirstName()) {
      voterFirstNameMissing = true;
    }
    if (!voterLastNameQueuedToSave && !VoterStore.getLastName()) {
      voterLastNameMissing = true;
    }
    const validAlternateEmail = (validateEmail(voterEmailQueuedToSave) && validateEmail(voterEmail) && voterEmailQueuedToSave.toLowerCase() !== voterEmail.toLowerCase);
    if (voterEmailMissing || voterFirstNameMissing || voterLastNameMissing) {
      this.setState({
        voterEmailMissing,
        voterFirstNameMissing,
        voterLastNameMissing,
      }, () => this.functionToUseWhenProfileNotCompleteLocal());
    } else if (!voterIsSignedInWithEmail || validAlternateEmail) {
      // All required fields were found
      VoterActions.sendSignInCodeEmail(voterEmailQueuedToSave);
    } else {
      // VoterActions.voterRetrieve(); // This might set up a race condition with voterUpdate, and not allow a new name to show up
      this.goToNextStepTimer = setTimeout(() => {
        this.goToNextStepLocal();
      }, 500);
    }
  }

  render () {
    renderLog('SetUpAccountEditName');  // Set LOG_RENDER_EVENTS to log all renders
    const { remindMode } = this.props;
    const {
      showVerifyModal, voterEmailMissing,
      voterFirstNameMissing, voterLastNameMissing, voterEmailQueuedToSaveLocal,
    } = this.state;

    let pageTitle = 'Set up your account';
    if (remindMode) {
      pageTitle = 'Add your name so your friends know its you';
    }
    return (
      <StepCenteredWrapper>
        <SetUpAccountTitle>
          {pageTitle}
        </SetUpAccountTitle>
        <InputFieldsWrapper>
          <Suspense fallback={<></>}>
            <OneInputFieldWrapper>
              <VoterFirstNameInputField showLabel voterFirstNameMissing={voterFirstNameMissing} />
            </OneInputFieldWrapper>
            <OneInputFieldWrapper>
              <VoterLastNameInputField showLabel voterLastNameMissing={voterLastNameMissing} />
            </OneInputFieldWrapper>
            <OneInputFieldWrapper>
              <VoterEmailInputField showLabel voterEmailMissing={voterEmailMissing} />
            </OneInputFieldWrapper>
          </Suspense>
        </InputFieldsWrapper>
        {showVerifyModal && (
          <Suspense fallback={<></>}>
            <SettingsVerifySecretCode
              show={showVerifyModal}
              closeVerifyModal={this.closeVerifyModal}
              voterEmailAddress={voterEmailQueuedToSaveLocal}
            />
          </Suspense>
        )}
      </StepCenteredWrapper>
    );
  }
}
SetUpAccountEditName.propTypes = {
  functionToUseWhenProfileComplete: PropTypes.func,
  functionToUseWhenProfileNotComplete: PropTypes.func,
  goToNextStep: PropTypes.func,
  nextButtonClicked: PropTypes.bool,
  remindMode: PropTypes.bool,
};

const styles = () => ({
});

export default withStyles(styles)(SetUpAccountEditName);
