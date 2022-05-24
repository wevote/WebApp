import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import React from 'react';
import { renderLog } from '../../common/utils/logging';
import VoterStore from '../../stores/VoterStore';
import {
  SetUpAccountIntroText,
  SetUpAccountTitle,
  SetUpAccountTop,
  StepCenteredWrapper,
} from '../Style/SetUpAccountStyles';


class SetUpAccountInviteContacts extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount () {
    window.scrollTo(0, 0);
    this.onVoterStoreChange();
    this.voterStoreListener = VoterStore.addListener(this.onVoterStoreChange.bind(this));
  }

  componentDidUpdate (prevProps) {
    // console.log('SetUpAccountInviteContacts componentDidUpdate prevProps.nextButtonClicked:', prevProps.nextButtonClicked, ', this.props.nextButtonClicked:', this.props.nextButtonClicked);
    if (prevProps.nextButtonClicked === false && this.props.nextButtonClicked === true) {
      this.props.goToNextStep();
    }
  }

  componentWillUnmount () {
    this.voterStoreListener.remove();
  }

  onVoterStoreChange () {
  }

  render () {
    renderLog('SetUpAccountInviteContacts');  // Set LOG_RENDER_EVENTS to log all renders

    return (
      <StepCenteredWrapper>
        <SetUpAccountTop>
          <SetUpAccountTitle>
            177
            {' '}
            contacts found
          </SetUpAccountTitle>
          <SetUpAccountIntroText>An email invitation will be sent to each contact.</SetUpAccountIntroText>
        </SetUpAccountTop>
      </StepCenteredWrapper>
    );
  }
}
SetUpAccountInviteContacts.propTypes = {
  goToNextStep: PropTypes.func.isRequired,
  nextButtonClicked: PropTypes.bool,
};

const styles = () => ({
});

export default withStyles(styles)(SetUpAccountInviteContacts);
