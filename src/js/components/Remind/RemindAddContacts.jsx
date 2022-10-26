import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import SuggestedContactListWithController from '../Friends/SuggestedContactListWithController';
import { renderLog } from '../../common/utils/logging';
import {
  SetUpAccountContactsText,
  SetUpAccountContactsTextWrapper,
  SetUpAccountTitle,
  SetUpAccountTop,
  StepCenteredWrapper,
} from '../Style/SetUpAccountStyles';

class RemindAddContacts extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount () {
    window.scrollTo(0, 0);
  }

  componentDidUpdate (prevProps) {
    // console.log('RemindAddContacts componentDidUpdate prevProps.nextButtonClicked:', prevProps.nextButtonClicked, ', this.props.nextButtonClicked:', this.props.nextButtonClicked);
    if (prevProps.nextButtonClicked === false && this.props.nextButtonClicked === true) {
      this.props.goToNextStep();
    }
  }

  render () {
    renderLog('RemindAddContacts');  // Set LOG_RENDER_EVENTS to log all renders
    return (
      <StepCenteredWrapper>
        <SetUpAccountTop>
          <SetUpAccountTitle>
            Remind 5 of your friends to vote today
          </SetUpAccountTitle>
          <SetUpAccountContactsTextWrapper>
            <SetUpAccountContactsText>
              We expect to have this feature ready in the next few days. Please come back!
            </SetUpAccountContactsText>
          </SetUpAccountContactsTextWrapper>
        </SetUpAccountTop>
        {/*
        <SuggestedContactListWithControllerOuterWrapper>
          <SuggestedContactListWithController remindMode />
        </SuggestedContactListWithControllerOuterWrapper>
        */}
      </StepCenteredWrapper>
    );
  }
}
RemindAddContacts.propTypes = {
  goToNextStep: PropTypes.func.isRequired,
  nextButtonClicked: PropTypes.bool,
};

const SuggestedContactListWithControllerOuterWrapper = styled('div')`
  margin-top: 64px;
`;

export default RemindAddContacts;
