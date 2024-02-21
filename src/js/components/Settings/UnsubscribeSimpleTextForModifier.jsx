import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React from 'react';
import VoterActions from '../../actions/VoterActions';
import { renderLog } from '../../common/utils/logging';
import VoterStore from '../../stores/VoterStore';
import {
  SetUpAccountContactsText,
  SetUpAccountTitle,
  StepCenteredWrapper,
} from '../Style/SetUpAccountStyles';

class UnsubscribeSimpleTextForModifier extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      notificationSettingIsOn: false,
    };
  }

  componentDidMount () {
    window.scrollTo(0, 0);
    const { nextButtonClicked, unsubscribeModifier } = this.props;
    // console.log('UnsubscribeSimpleTextForModifier componentDidMount nextButtonClicked:', nextButtonClicked);
    if (nextButtonClicked) {
      const notificationSettingConstant = VoterStore.getNotificationSettingConstantFromUnsubscribeModifier(unsubscribeModifier);
      // console.log('unsubscribeModifier:', unsubscribeModifier, ', notificationSettingConstant:', notificationSettingConstant);
      this.setState({
        notificationSettingConstant,
      }, () => this.submitChangeNotificationSetting());
    }
    this.onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
  }

  componentDidUpdate (prevProps) {
    // console.log('UnsubscribeSimpleTextForModifier componentDidUpdate prevProps.nextButtonClicked:', prevProps.nextButtonClicked, ', this.props.nextButtonClicked:', this.props.nextButtonClicked);
    if (prevProps.nextButtonClicked === false && this.props.nextButtonClicked === true) {
      this.submitChangeNotificationSetting();
    }
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
    if (this.goToNextStepTimer) {
      clearTimeout(this.goToNextStepTimer);
    }
  }

  onVoterStoreChange () {
    const { unsubscribeModifier } = this.props;
    const notificationSettingConstant = VoterStore.getNotificationSettingConstantFromUnsubscribeModifier(unsubscribeModifier);

    const voterNotificationSettingsUpdateStatus = VoterStore.getVoterNotificationSettingsUpdateStatus();
    // console.log('onVoterStoreChange voterNotificationSettingsUpdateStatus:', voterNotificationSettingsUpdateStatus);
    const { emailFound } = voterNotificationSettingsUpdateStatus; // apiResponseReceived, normalizedEmailAddress, notificationSettingsFlags, voterFound
    let notificationSettingIsOn = false;
    if (emailFound) {
      notificationSettingIsOn = VoterStore.getNotificationSettingsFlagStateFromSecretKey(notificationSettingConstant);
    }
    // console.log('unsubscribeModifier:', unsubscribeModifier, ', notificationSettingIsOn:', notificationSettingIsOn);

    this.setState({
      // emailFound,
      notificationSettingConstant,
      notificationSettingIsOn,
    });
  }

  goToNextStepLocal = () => {
    if (this.props.goToNextStep) {
      this.props.goToNextStep();
    }
  }

  submitChangeNotificationSetting = () => {
    const { subscriptionSecretKey } = this.props;
    const { notificationSettingConstant } = this.state;
    // console.log('UnsubscribeSimpleTextForModifier submitChangeNotificationSetting subscriptionSecretKey:', subscriptionSecretKey, ', notificationSettingConstant:', notificationSettingConstant);
    VoterActions.voterNotificationSettingsUpdateFromSecretKey(subscriptionSecretKey, '', 0, false, notificationSettingConstant, true);
    this.goToNextStepLocal();
  }

  render () {
    renderLog('UnsubscribeSimpleTextForModifier');  // Set LOG_RENDER_EVENTS to log all renders
    const { unsubscribeModifier } = this.props;
    const { notificationSettingIsOn } = this.state;

    let unsubscribeTitle;
    let unsubscribeDescriptionText;
    const clickUnsubscribeText = (
      <span>
        Click
        {' '}
        <strong>
          Unsubscribe
        </strong>
        {' '}
        below to turn off
        {' '}
      </span>
    );
    const notYourEmailAddressText = 'Not your email address? This email may have been forwarded to you by a friend or colleague. Please contact them directly to stop receiving forwarded emails.';
    const weVoteNoBreak = (
      <span className="u-no-break">
        {' '}
        WeVote
      </span>
    );
    const pleaseContactWeVoteSupport = (
      <span>
        Please contact
        {weVoteNoBreak}
        {' '}
        at info@WeVote.US with any questions.
      </span>
    );
    if (unsubscribeModifier === 'friendaccept' || unsubscribeModifier === 'friendinvite') {  // Split apart when WeVoteServer supports this
      unsubscribeTitle = 'Friend Invitations';
      unsubscribeDescriptionText = notificationSettingIsOn ? (
        <>
          {clickUnsubscribeText}
          email notifications when you are invited by a friend
          to connect on
          {weVoteNoBreak}
          .
          <br />
          <br />
          {notYourEmailAddressText}
        </>
      ) : (
        <>
          Notifications when you are invited by a friend to connect on
          {weVoteNoBreak}
          {' '}
          are already turned off.
        </>
      );
    } else if (unsubscribeModifier === 'login') {
      unsubscribeTitle = 'Login Requests';
      unsubscribeDescriptionText = notificationSettingIsOn ? (
        <>
          {clickUnsubscribeText}
          email notifications when you are signing into
          {weVoteNoBreak}
          .
          <br />
          <br />
          If you unsubscribe from this notification, you will no longer be able to sign into
          {weVoteNoBreak}
          {' '}
          with this email address.
          <br />
          <br />
          {pleaseContactWeVoteSupport}
          <br />
          <br />
          {notYourEmailAddressText}
        </>
      ) : (
        <>
          Notifications when you are signing into
          {weVoteNoBreak}
          {' '}
          are already turned off. You are no longer able to sign into
          {weVoteNoBreak}
          with this email address.
          <br />
          {pleaseContactWeVoteSupport}
        </>
      );
    } else if (unsubscribeModifier === 'notfound') {
      unsubscribeTitle = 'Email Not Found';
      unsubscribeDescriptionText = (
        <>
          We were not able to find the email address you are trying to unsubscribe.
          <br />
          {pleaseContactWeVoteSupport}
        </>
      );
    } else {
      unsubscribeTitle = 'WeVote Newsletter';
      unsubscribeDescriptionText = notificationSettingIsOn ? (
        <>
          Click
          {' '}
          <strong>
            Unsubscribe
          </strong>
          {' '}
          below to stop receiving emails from the
          {weVoteNoBreak}
          {' '}
          newsletter.
          <br />
          <br />
          {notYourEmailAddressText}
        </>
      ) : (
        <>
          You are unsubscribed from the
          {weVoteNoBreak}
          {' '}
          newsletter.
        </>
      );
    }
    return (
      <StepCenteredWrapper>
        <SetUpAccountTitle>{unsubscribeTitle}</SetUpAccountTitle>
        <SetUpAccountContactsText>
          {unsubscribeDescriptionText}
        </SetUpAccountContactsText>
      </StepCenteredWrapper>
    );
  }
}
UnsubscribeSimpleTextForModifier.propTypes = {
  goToNextStep: PropTypes.func,
  nextButtonClicked: PropTypes.bool,
  subscriptionSecretKey: PropTypes.string,
  unsubscribeModifier: PropTypes.string,
};

const styles = () => ({
});

export default withStyles(styles)(UnsubscribeSimpleTextForModifier);
