import PropTypes from 'prop-types';
import React from 'react';
// import styled from 'styled-components';
import DownloadAppsButtons from './DownloadAppsButtons';
// import SuggestedContactListWithController from '../Friends/SuggestedContactListWithController';
import { isWebApp } from '../../common/utils/isCordovaOrWebApp';
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
            Remind 3 of your friends to vote today
          </SetUpAccountTitle>
          <SetUpAccountContactsTextWrapper>
            <SetUpAccountContactsText>
              We expect to have this feature ready in the next few days. Please come back!
              {isWebApp() && (
                <>
                  <br />
                  <br />
                  Did you know there is a
                  {' '}
                  <span className="u-no-break">
                    We Vote App
                  </span>
                  {' '}
                  in the
                  {' '}
                  <span className="u-no-break">
                    Google Play Store
                  </span>
                  {' '}
                  and the
                  {' '}
                  <span className="u-no-break">
                    Apple App Store?
                  </span>
                </>
              )}
            </SetUpAccountContactsText>
          </SetUpAccountContactsTextWrapper>
        </SetUpAccountTop>
        {/*
        <SuggestedContactListWithControllerOuterWrapper>
          <SuggestedContactListWithController remindMode />
        </SuggestedContactListWithControllerOuterWrapper>
        */}
        {isWebApp() && (
          <DownloadAppsButtons />
        )}
      </StepCenteredWrapper>
    );
  }
}
RemindAddContacts.propTypes = {
  goToNextStep: PropTypes.func.isRequired,
  nextButtonClicked: PropTypes.bool,
};

// const SuggestedContactListWithControllerOuterWrapper = styled('div')`
//   margin-top: 64px;
// `;

export default RemindAddContacts;
