import { Button } from '@mui/material';
import styled from 'styled-components';
import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';
import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import VoterActions from '../../../actions/VoterActions';
import VoterPhotoUpload from './VoterPhotoUpload';
import DelayedLoad from '../Widgets/DelayedLoad';
import OpenExternalWebSite from '../Widgets/OpenExternalWebSite';
import { renderLog } from '../../utils/logging';
import AppObservableStore from '../../stores/AppObservableStore';
import CampaignStore from '../../stores/CampaignStore';
import VoterStore from '../../../stores/VoterStore';
import initializejQuery from '../../utils/initializejQuery';
import VisibleToPublicCheckbox from '../CampaignSupport/VisibleToPublicCheckbox';
import SettingsVerifySecretCode from './SettingsVerifySecretCode';
import VoterEmailInputField from './VoterEmailInputField';
import VoterFirstNameInputField from './VoterFirstNameInputField';
import VoterLastNameInputField from './VoterLastNameInputField';

const SignInButton = React.lazy(() => import(/* webpackChunkName: 'SignInButton' */ '../Navigation/SignInButton'));
// const SignInModalController = React.lazy(() => import(/* webpackChunkName: 'SignInModalController' */ './SignInModalController'));
// const SignInModal = React.lazy(() => import(/* webpackChunkName: 'SignInModal' */ '../SignIn/SignInModal'));

class CompleteYourProfile extends Component {
  constructor (props) {
    super(props);
    this.state = {
      showVerifyModal: false,
    };
  }

  componentDidMount () {
    this.voterFirstRetrieve();
    this.onCampaignStoreChange();
    this.campaignStoreListener = CampaignStore.addListener(this.onCampaignStoreChange.bind(this));
    this.onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
  }

  componentDidUpdate (prevProps) {
    // console.log('CompleteYourProfile componentDidUpdate');
    const {
      campaignXWeVoteId: campaignXWeVoteIdPrevious,
    } = prevProps;
    const {
      campaignXWeVoteId,
    } = this.props;
    if (campaignXWeVoteId) {
      if (campaignXWeVoteId !== campaignXWeVoteIdPrevious) {
        this.onCampaignStoreChange();
      }
    }
  }

  componentDidCatch (error, info) {
    // We should get this information to Splunk!
    console.error('CompleteYourProfile caught error: ', `${error} with info: `, info);
  }

  componentWillUnmount () {
    // console.log('CompleteYourProfile componentWillUnmount');
    this.campaignStoreListener.remove();
    this.voterStoreListener.remove();
    if (this.closeVerifyModalTimer) {
      clearTimeout(this.closeVerifyModalTimer);
    }
    if (this.functionToUseWhenProfileCompleteTimer) {
      clearTimeout(this.functionToUseWhenProfileCompleteTimer);
    }
  }

  // See https://reactjs.org/docs/error-boundaries.html
  static getDerivedStateFromError (error) { // eslint-disable-line no-unused-vars
    console.error('Error caught in CompleteYourProfile: ', error);
    // Update state so the next render will show the fallback UI, We should have a "Oh snap" page
    return { hasError: true };
  }

  onCampaignStoreChange () {
    const { campaignXWeVoteId } = this.props;
    if (campaignXWeVoteId) {
      const voterCanVoteForPoliticianInCampaign = CampaignStore.getVoterCanVoteForPoliticianInCampaign(campaignXWeVoteId);
      this.setState({
        voterCanVoteForPoliticianInCampaign,
      });
    }
  }

  onVoterStoreChange () {
    const { voterWeVoteId: voterWeVoteIdPrevious } = this.state;
    const emailAddressStatus = VoterStore.getEmailAddressStatus();
    // const { secret_code_system_locked_for_this_voter_device_id: secretCodeSystemLocked } = emailAddressStatus;
    const secretCodeVerificationStatus = VoterStore.getSecretCodeVerificationStatus();
    const { secretCodeVerified } = secretCodeVerificationStatus;
    // console.log('onVoterStoreChange emailAddressStatus:', emailAddressStatus);

    const voter = VoterStore.getVoter();
    const { signed_in_with_email: voterIsSignedInWithEmail, we_vote_id: voterWeVoteId } = voter;
    const voterIsSignedIn = VoterStore.getVoterIsSignedIn();
    this.setState({
      voterIsSignedIn,
    });
    // console.log(`CompleteYourProfile onVoterStoreChange isSignedIn: ${isSignedIn}, voterIsSignedInWithEmail: ${voterIsSignedInWithEmail}`);
    if (voterIsSignedInWithEmail) {
      // console.log('CompleteYourProfile onVoterStoreChange voterIsSignedInWithEmail');
      if (voterWeVoteId !== voterWeVoteIdPrevious) {
        this.setState({
          voterWeVoteId,
        });
      }
    } else if (secretCodeVerified) {
      // Mark that voter supports this campaign
      // console.log('CompleteYourProfile secretCodeVerified');
      VoterActions.voterRetrieve();
      this.functionToUseWhenProfileCompleteTimer = setTimeout(() => {
        this.props.functionToUseWhenProfileComplete();
      }, 500);
    } else if (emailAddressStatus.sign_in_code_email_sent) {
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
    }
  }

  closeVerifyModal = (verified = false) => {
    // console.log('CompleteYourProfile closeVerifyModal, verified:', verified);
    VoterActions.clearEmailAddressStatus();
    VoterActions.clearSecretCodeVerificationStatus();
    VoterActions.voterRetrieve();
    if (verified && this.props.functionToUseWhenProfileComplete) {
      // console.log('CompleteYourProfile closeVerifyModal, functionToUseWhenProfileComplete exists');
      this.props.functionToUseWhenProfileComplete();
    }
    const delayBeforeClosingVerifyModal = 400;
    this.closeVerifyModalTimer = setTimeout(() => {
      this.setState({
        showVerifyModal: false,
      });
    }, delayBeforeClosingVerifyModal);
  };

  onKeyDown = (event) => {
    event.preventDefault();
  };

  submitCompleteYourProfile = (event) => {
    // console.log('CompleteYourProfile submitCompleteYourProfile');
    let voterEmailMissing = false;
    let voterFirstNameMissing = false;
    let voterLastNameMissing = false;
    const voterFirstNameQueuedToSave = VoterStore.getVoterFirstNameQueuedToSave();
    const voterFirstNameQueuedToSaveSet = VoterStore.getVoterFirstNameQueuedToSaveSet();
    const voterLastNameQueuedToSave = VoterStore.getVoterLastNameQueuedToSave();
    const voterLastNameQueuedToSaveSet = VoterStore.getVoterLastNameQueuedToSaveSet();
    const voterPhotoQueuedToSave = VoterStore.getVoterPhotoQueuedToSave();
    const voterPhotoQueuedToSaveSet = VoterStore.getVoterPhotoQueuedToSaveSet();
    VoterActions.voterCompleteYourProfileSave(voterFirstNameQueuedToSave, voterFirstNameQueuedToSaveSet, voterLastNameQueuedToSave, voterLastNameQueuedToSaveSet, voterPhotoQueuedToSave, voterPhotoQueuedToSaveSet);
    VoterActions.voterFirstNameQueuedToSave(undefined);
    VoterActions.voterLastNameQueuedToSave(undefined);
    VoterActions.voterPhotoQueuedToSave(undefined);
    const voterIsSignedInWithEmail = VoterStore.getVoterIsSignedInWithEmail();
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
    if (voterEmailMissing || voterFirstNameMissing || voterLastNameMissing) {
      this.setState({
        voterEmailMissing,
        voterFirstNameMissing,
        voterLastNameMissing,
      });
    } else if (!voterIsSignedInWithEmail) {
      // All required fields were found
      AppObservableStore.setBlockCampaignXRedirectOnSignIn(false);
      this.sendSignInCodeEmail(event, voterEmailQueuedToSave);
    } else {
      VoterActions.voterRetrieve();
      this.functionToUseWhenProfileCompleteTimer = setTimeout(() => {
        AppObservableStore.setBlockCampaignXRedirectOnSignIn(false);
        this.props.functionToUseWhenProfileComplete();
      }, 500);
    }
  }

  sendSignInCodeEmail = (event, voterEmailQueuedToSaveLocal) => {
    if (event) {
      event.preventDefault();
    }
    // console.log('voterEmailQueuedToSaveLocal: ', voterEmailQueuedToSaveLocal);
    VoterActions.sendSignInCodeEmail(voterEmailQueuedToSaveLocal);
  };

  voterFirstRetrieve = () => {
    initializejQuery(() => {
      const voterFirstRetrieveInitiated = AppObservableStore.voterFirstRetrieveInitiated();
      // console.log('CompleteYourProfile voterFirstRetrieveInitiated: ', voterFirstRetrieveInitiated);
      if (!voterFirstRetrieveInitiated) {
        AppObservableStore.setVoterFirstRetrieveInitiated(true);
        VoterActions.voterRetrieve();
      }
    });
  }

  render () {
    renderLog('CompleteYourProfile');  // Set LOG_RENDER_EVENTS to log all renders
    const {
      becomeMember, campaignXWeVoteId, classes,
      startCampaign, supportCampaign, supportCampaignOnCampaignHome,
    } = this.props;

    const {
      showVerifyModal, voterWeVoteId, voterCanVoteForPoliticianInCampaign,
      voterEmailMissing, voterIsSignedIn,
      voterFirstNameMissing, voterLastNameMissing, voterEmailQueuedToSaveLocal,
    } = this.state;
    if (!voterWeVoteId) {
      // console.log('CompleteYourProfile render voter NOT found');
      return (
        <div className="undefined-props">Please sign in</div>
      );
    }

    // console.log('CompleteYourProfile render voter found');
    let buttonText = 'Continue';
    let introductionText = null;
    let outerMarginsOff = false;
    if (becomeMember) {
      buttonText = 'Continue';
      introductionText = <span>Thank you for becoming a member of WeVote.US!</span>;
    } else if (startCampaign) {
      buttonText = 'Continue';
      introductionText = <span>Let people you know see you, so they can feel safe supporting your campaign.</span>;
    } else if (supportCampaign) {
      if (voterCanVoteForPoliticianInCampaign) {
        buttonText = 'Support with my vote';
      } else {
        buttonText = 'Show your support';
      }
      introductionText = <span>Leading up to election day, WeVote.US will remind you to vote for all of the candidates you support. We keep your email secure and confidential.</span>;
    } else if (supportCampaignOnCampaignHome) {
      if (voterCanVoteForPoliticianInCampaign) {
        buttonText = 'Support with my vote';
      } else {
        buttonText = 'Show your support';
      }
      outerMarginsOff = true;
    }
    return (
      <Wrapper>
        {/* <Suspense fallback={<span>&nbsp;</span>}><SignInModalController /></Suspense> */}
        <section>
          {!!(introductionText) && (
            <IntroductionText>
              {introductionText}
              {!voterIsSignedIn && (
                <DelayedLoad waitBeforeShow={500}>
                  <Suspense fallback={<span>&nbsp;</span>}>
                    <SignInWrapper>
                      <AlreadyHaveAccount>
                        Already have an account?
                        {' '}
                      </AlreadyHaveAccount>
                      <div className="u-cursor--pointer u-link-color u-link-underline">
                        <SignInButton hideSignOut />
                      </div>
                    </SignInWrapper>
                  </Suspense>
                </DelayedLoad>
              )}
            </IntroductionText>
          )}
          <InputFieldsWrapper outerMarginsOff={outerMarginsOff}>
            <VoterFirstNameInputField voterFirstNameMissing={voterFirstNameMissing} />
            <VoterLastNameInputField voterLastNameMissing={voterLastNameMissing} />
            <VoterEmailInputField voterEmailMissing={voterEmailMissing} />
            <VoterPhotoUpload />
          </InputFieldsWrapper>
          {!!(supportCampaign || supportCampaignOnCampaignHome) && (
            <CheckboxWrapper outerMarginsOff={outerMarginsOff}>
              <VisibleToPublicCheckbox campaignXWeVoteId={campaignXWeVoteId} />
            </CheckboxWrapper>
          )}
          <CompleteYourProfileButtonWrapper outerMarginsOff={outerMarginsOff}>
            <Button
              classes={{ root: classes.buttonDesktop }}
              color="primary"
              id="saveCompleteYourProfile"
              onClick={this.submitCompleteYourProfile}
              variant="contained"
            >
              {buttonText}
            </Button>
          </CompleteYourProfileButtonWrapper>
          <FinePrint outerMarginsOff={outerMarginsOff}>
            By continuing, you accept WeVote.US&apos;s
            {' '}
            <OpenExternalWebSite
              linkIdAttribute="termsOfService"
              url="/terms"
              target="_blank"
              body={(
                <span>Terms of Service</span>
              )}
              className={classes.link}
            />
            {' '}
            and
            {' '}
            <OpenExternalWebSite
              linkIdAttribute="privacyPolicy"
              url="/privacy"
              target="_blank"
              body={(
                <span>Privacy Policy</span>
              )}
              className={classes.link}
            />
            {' '}
            and agree to receive occasional emails about this campaign and upcoming elections. You can unsubscribe at any time. We will never sell your email address.
          </FinePrint>
        </section>
        {showVerifyModal && (
          <SettingsVerifySecretCode
            show={showVerifyModal}
            closeVerifyModal={this.closeVerifyModal}
            voterEmailAddress={voterEmailQueuedToSaveLocal}
          />
        )}
      </Wrapper>
    );
  }
}
CompleteYourProfile.propTypes = {
  becomeMember: PropTypes.bool,
  campaignXWeVoteId: PropTypes.string,
  classes: PropTypes.object,
  functionToUseWhenProfileComplete: PropTypes.func.isRequired,
  politicianSEOFriendlyPath: PropTypes.string,
  politicianWeVoteId: PropTypes.string,
  startCampaign: PropTypes.bool,
  supportCampaign: PropTypes.bool,
  supportCampaignOnCampaignHome: PropTypes.bool,
};

const styles = () => ({
  buttonDesktop: {
    boxShadow: 'none !important',
    fontSize: '18px',
    height: '45px !important',
    padding: '0 12px',
    textTransform: 'none',
    width: '100%',
  },
  link: {
    color: '#999',
    '&:hover': {
      color: '#4371cc',
    },
  },
});

const AlreadyHaveAccount = styled('div')`
  margin-right: 2px;
`;

const CompleteYourProfileButtonWrapper = styled('div', {
  shouldForwardProp: (prop) => !['outerMarginsOff'].includes(prop),
})(({ outerMarginsOff }) => (`
  background-color: #fff;
  margin: ${outerMarginsOff ? '8px 0 0 0' : '8px 15px 0 15px'};
`));

const CheckboxWrapper = styled('div', {
  shouldForwardProp: (prop) => !['outerMarginsOff'].includes(prop),
})(({ outerMarginsOff }) => (`
  margin: ${outerMarginsOff ? '25px 0 0 0' : '25px 15px 0 15px'};
`));

const FinePrint = styled('div', {
  shouldForwardProp: (prop) => !['outerMarginsOff'].includes(prop),
})(({ outerMarginsOff }) => (`
  color: #999;
  font-size: 13px;
  margin: ${outerMarginsOff ? '10px 0 15px 0' : '10px 15px 15px 15px'};
`));

const InputFieldsWrapper = styled('div', {
  shouldForwardProp: (prop) => !['outerMarginsOff'].includes(prop),
})(({ outerMarginsOff }) => (`
  margin: ${outerMarginsOff ? '0 0 !important' : '0 15px !important'};
`));

const IntroductionText = styled('div')`
  font-size: 15px;
  margin: 10px 15px;
`;

const SignInWrapper = styled('div')`
  display: flex;
  justify-content: flex-start;
  margin-top: 4px;
  width: 100%;
`;

const Wrapper = styled('div')`
`;

export default withTheme(withStyles(styles)(CompleteYourProfile));
