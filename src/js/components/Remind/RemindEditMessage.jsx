import PropTypes from 'prop-types';
import React, { Suspense } from 'react';
import styled from 'styled-components';
import { renderLog } from '../../common/utils/logging';
import {
  SetUpAccountContactsText,
  SetUpAccountContactsTextWrapper,
  SetUpAccountTitle,
  SetUpAccountTop,
  StepCenteredWrapper,
} from '../Style/SetUpAccountStyles';

const ContactFriendsByMessageType = React.lazy(() => import(/* webpackChunkName: 'ContactFriendsByMessageType' */ '../Friends/ContactFriendsByMessageType'));
const MessageToFriendInputField = React.lazy(() => import(/* webpackChunkName: 'MessageToFriendInputField' */ '../Friends/MessageToFriendInputField'));

class RemindEditMessage extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount () {
    window.scrollTo(0, 0);
  }

  componentDidUpdate (prevProps) {
    // console.log('RemindEditMessage componentDidUpdate prevProps.nextButtonClicked:', prevProps.nextButtonClicked, ', this.props.nextButtonClicked:', this.props.nextButtonClicked);
    if (prevProps.nextButtonClicked === false && this.props.nextButtonClicked === true) {
      this.props.goToNextStep();
    }
  }

  render () {
    renderLog('RemindEditMessage');  // Set LOG_RENDER_EVENTS to log all renders
    const pigsCanFly = false;
    return (
      <StepCenteredWrapper>
        <SetUpAccountTop>
          <SetUpAccountTitle>
            Remind 3 of your friends to vote today
          </SetUpAccountTitle>
          <SetUpAccountContactsTextWrapper>
            <SetUpAccountContactsText>
              Personalized messages work best.
            </SetUpAccountContactsText>
          </SetUpAccountContactsTextWrapper>
        </SetUpAccountTop>
        <MessageToSendWrapper>
          <Suspense fallback={<></>}>
            <MessageToFriendInputField messageToFriendType="remindContacts" />
          </Suspense>
        </MessageToSendWrapper>
        {pigsCanFly && (
          <EnterEmailsWrapper>
            <Suspense fallback={<></>}>
              <ContactFriendsByMessageType messageToFriendType="remindContacts" />
            </Suspense>
          </EnterEmailsWrapper>
        )}
      </StepCenteredWrapper>
    );
  }
}
RemindEditMessage.propTypes = {
  goToNextStep: PropTypes.func.isRequired,
  nextButtonClicked: PropTypes.bool,
};

const EnterEmailsWrapper = styled('div')`
  margin-bottom: 24px;
  width: 100%;
`;

const MessageToSendWrapper = styled('div')`
  margin-top: 24px;
  width: 100%;
`;

export default RemindEditMessage;
