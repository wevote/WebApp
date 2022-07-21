import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React from 'react';
import { renderLog } from '../../common/utils/logging';
import VoterStore from '../../stores/VoterStore';
import {
  SetUpAccountContactsText,
  SetUpAccountTitle,
  StepCenteredWrapper,
} from '../Style/SetUpAccountStyles';

class UnsubscribeThankYou extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      normalizedEmailAddress: '',
    };
  }

  componentDidMount () {
    window.scrollTo(0, 0);
    this.onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
  }

  componentDidUpdate (prevProps) {
    // console.log('UnsubscribeThankYou componentDidUpdate prevProps.nextButtonClicked:', prevProps.nextButtonClicked, ', this.props.nextButtonClicked:', this.props.nextButtonClicked);
    if (prevProps.nextButtonClicked === false && this.props.nextButtonClicked === true) {
      this.goToNextStepLocal();
    }
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
    if (this.goToNextStepTimer) {
      clearTimeout(this.goToNextStepTimer);
    }
  }

  onVoterStoreChange () {
    // const { unsubscribeModifier } = this.props;

    const voterNotificationSettingsUpdateStatus = VoterStore.getVoterNotificationSettingsUpdateStatus();
    // console.log('onVoterStoreChange voterNotificationSettingsUpdateStatus:', voterNotificationSettingsUpdateStatus);
    const { normalizedEmailAddress } = voterNotificationSettingsUpdateStatus; // apiResponseReceived, emailFound, normalizedEmailAddress, notificationSettingsFlags, voterFound

    // let notificationSettingIsOn = false;
    // const notificationSettingConstant = VoterStore.getNotificationSettingConstantFromUnsubscribeModifier(unsubscribeModifier);
    // if (emailFound) {
    //   // displayStep = this.props.convertUnsubscribeModifierToDisplayStep(unsubscribeModifier);
    //   notificationSettingIsOn = VoterStore.getNotificationSettingsFlagStateFromSecretKey(notificationSettingConstant);
    // }
    this.setState({
      // emailFound,
      normalizedEmailAddress,
      // notificationSettingIsOn,
    });
  }

  goToNextStepLocal = () => {
    if (this.props.goToNextStep) {
      this.props.goToNextStep();
    }
  }

  // submitChangeNotificationSetting = () => {
  //   // console.log('UnsubscribeThankYou submitChangeNotificationSetting');
  //   const conditionX = true;
  //   if (conditionX) {
  //     // VoterActions.voterRetrieve(); // This might set up a race condition with voterUpdate, and not allow a new name to show up
  //     this.goToNextStepTimer = setTimeout(() => {
  //       this.goToNextStepLocal();
  //     }, 500);
  //   }
  // }

  render () {
    renderLog('UnsubscribeThankYou');  // Set LOG_RENDER_EVENTS to log all renders
    const { normalizedEmailAddress } = this.state;

    return (
      <StepCenteredWrapper>
        <SetUpAccountTitle>Thank you</SetUpAccountTitle>
        <SetUpAccountContactsText>
          Your notification settings for
          {' '}
          <strong>
            {normalizedEmailAddress}
          </strong>
          {' '}
          have been updated.
        </SetUpAccountContactsText>
      </StepCenteredWrapper>
    );
  }
}
UnsubscribeThankYou.propTypes = {
  goToNextStep: PropTypes.func,
  nextButtonClicked: PropTypes.bool,
  // unsubscribeModifier: PropTypes.string,
};

const styles = () => ({
});

export default withStyles(styles)(UnsubscribeThankYou);
