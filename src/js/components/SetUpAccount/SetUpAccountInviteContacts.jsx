import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import SuggestedContactListWithController from '../Friends/SuggestedContactListWithController';
import { renderLog } from '../../common/utils/logging';
import stringContains from '../../common/utils/stringContains';
import {
  SetUpAccountContactsText,
  SetUpAccountContactsTextWrapper,
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
  }

  componentDidUpdate (prevProps) {
    // console.log('SetUpAccountInviteContacts componentDidUpdate prevProps.nextButtonClicked:', prevProps.nextButtonClicked, ', this.props.nextButtonClicked:', this.props.nextButtonClicked);
    if (prevProps.nextButtonClicked === false && this.props.nextButtonClicked === true) {
      this.props.goToNextStep();
    }
  }

  getImportContactsLink = () => {
    const { location: { pathname } } = window;
    if (stringContains('setupaccount', pathname)) {
      return '/setupaccount/importcontacts';
    } else {
      return '/findfriends/importcontacts';
    }
  }

  render () {
    renderLog('SetUpAccountInviteContacts');  // Set LOG_RENDER_EVENTS to log all renders
    return (
      <StepCenteredWrapper>
        <SetUpAccountTop>
          <SetUpAccountTitle>
            Add friends from your contacts
          </SetUpAccountTitle>
          <SetUpAccountContactsTextWrapper>
            <SetUpAccountContactsText>
              Add friends you feel comfortable discussing politics with.
            </SetUpAccountContactsText>
          </SetUpAccountContactsTextWrapper>
        </SetUpAccountTop>
        <SuggestedContactListWithControllerOuterWrapper>
          <SuggestedContactListWithController />
        </SuggestedContactListWithControllerOuterWrapper>
      </StepCenteredWrapper>
    );
  }
}
SetUpAccountInviteContacts.propTypes = {
  goToNextStep: PropTypes.func.isRequired,
  nextButtonClicked: PropTypes.bool,
};

const SuggestedContactListWithControllerOuterWrapper = styled('div')`
  margin-top: 64px;
`;

export default SetUpAccountInviteContacts;
