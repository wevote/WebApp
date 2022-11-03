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

class RemindInviteContacts extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount () {
    window.scrollTo(0, 0);
  }

  componentDidUpdate (prevProps) {
    // console.log('RemindInviteContacts componentDidUpdate prevProps.nextButtonClicked:', prevProps.nextButtonClicked, ', this.props.nextButtonClicked:', this.props.nextButtonClicked);
    if (prevProps.nextButtonClicked === false && this.props.nextButtonClicked === true) {
      this.props.goToNextStep();
    }
  }

  render () {
    renderLog('RemindInviteContacts');  // Set LOG_RENDER_EVENTS to log all renders
    return (
      <StepCenteredWrapper>
        <SetUpAccountTop>
          <SetUpAccountTitle>
            Remind your friends to vote today
          </SetUpAccountTitle>
          <SetUpAccountContactsTextWrapper>
            <SetUpAccountContactsText>
              Polls predict fewer than 50% of eligible Americans will vote in the next election.
              {' '}
              <span className="u-no-break">
                Let&apos;s change that!
              </span>
            </SetUpAccountContactsText>
          </SetUpAccountContactsTextWrapper>
        </SetUpAccountTop>
        <SuggestedContactListWithControllerOuterWrapper>
          <SuggestedContactListWithController remindMode />
        </SuggestedContactListWithControllerOuterWrapper>
      </StepCenteredWrapper>
    );
  }
}
RemindInviteContacts.propTypes = {
  goToNextStep: PropTypes.func.isRequired,
  nextButtonClicked: PropTypes.bool,
};

const SuggestedContactListWithControllerOuterWrapper = styled('div')`
  margin-top: 64px;
`;

export default RemindInviteContacts;
