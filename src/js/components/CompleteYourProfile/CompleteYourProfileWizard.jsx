import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import TagManager from 'react-gtm-module';
import Colors from '../../common/components/Style/Colors';
import normalizedImagePath from '../../common/utils/normalizedImagePath';
import CompleteYourProfileStep from './Step';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';
import VoterStore from '../../stores/VoterStore';
import lookupPageNameAndPageTypeDict from '../../utils/lookupPageNameAndPageTypeDict';
import stringContains from '../../common/utils/stringContains';
import Cookies from '../../common/utils/js-cookie/Cookies';

const crossIcon = normalizedImagePath('../../../img/global/svg-icons/cross.svg');


const CompleteYourProfileWizard = ({ steps, activeStep }) => {
  const completeYourProfileOpen = !(Cookies.get('complete_your_profile_closed'));
  const [showCompleteYourProfileWizard, setShowCompleteYourProfileWizard] = useState(completeYourProfileOpen);

  const hideCompleteYourProfileWizard = (buttonId) => {
    setShowCompleteYourProfileWizard(false);
    // Set cookie to close the wizard for 18 hours
    const { location: { origin } } = window;
    const expirationDate = new Date(new Date().getTime() + 18 * 60 * 60 * 1000); // 18 hours from now
    if (origin && stringContains('wevote.us', origin)) {
      Cookies.set('complete_your_profile_closed', '1', { expires: expirationDate, path: '/', domain: 'wevote.us' });
    } else {
      Cookies.set('complete_your_profile_closed', '1', { expires: expirationDate, path: '/' });
    }
    // console.log('CompleteYourProfileWizard props:', { steps, activeStep });
    // dataLayer tracking
    const { location: { pathname: currentPathname } } = window;
    // console.log('Current pathname:', currentPathname);
    const currentPage = lookupPageNameAndPageTypeDict(currentPathname);

    const dataLayerObject = {
      actionDetails: {
        actionType: 'closeModal',
        buttonId,
      },
      event: 'action',
      pageDetails: {
        pageName: 'CompleteYourProfileWizard',
        pageType: currentPage.pageType,
        pathname: currentPathname,
      },
      userDetails: VoterStore.getAnalyticsUserDetails(),
    };
    if (activeStep !== undefined) {
      dataLayerObject.actionDetails.activeStep = activeStep;
      // console.log('Active step when closing:', activeStep);
    }
    // console.log('DataLayer object being sent:', dataLayerObject);
    TagManager.dataLayer({ dataLayer: dataLayerObject });

    // console.log('DataLayer tracking completed for CompleteYourProfileWizard close');
  };


  return showCompleteYourProfileWizard && (
    <CompleteYourProfileContainer>
      <CompleteYourProfileHeader>
        <p>
          <span className="u-show-mobile">
            Turn your values into voting decisions!
          </span>
          <span className="u-show-desktop-tablet">
            See how to turn your values into voting decisions!
          </span>
        </p>
        <CompleteYourProfileCrossIconContainer
          id="closeCompleteYourProfileWizard"
          onClick={() => hideCompleteYourProfileWizard('closeCompleteYourProfileWizard')}
        >
          <img src={crossIcon} alt="Close" style={{ filter: 'brightness(1.9)' }} />
        </CompleteYourProfileCrossIconContainer>
      </CompleteYourProfileHeader>

      <CompleteYourProfileStepsContainer>
        {steps.map((step) => (
          <CompleteYourProfileStep
            label={step.title}
            step={step.id}
            completed={step.completed}
            active={step.id === activeStep}
            key={`completeYourProfileIndicator-${step.id}`}
            id={`completeYourProfileIndicator-${step.id}`}
            onClick={() => { step.onClick(); }}
            width={step.width}
          />
        ))}
      </CompleteYourProfileStepsContainer>
    </CompleteYourProfileContainer>
  );
};

CompleteYourProfileWizard.propTypes = {
  steps: PropTypes.array,
  activeStep: PropTypes.number,
};

const CompleteYourProfileContainer = styled('div')`
  font-family: 'Open Sans', sans-serif;
  border-radius: 10px;
  border: 1px solid ${Colors.grey};
  background: ${DesignTokenColors.primary50};
  margin-bottom: 22px;
  overflow: hidden;
`;

const CompleteYourProfileHeader = styled('div')`
  min-height: 33px;
  background: ${Colors.primary2024};
  display: flex;
  align-items: center;
  justify-content: space-between;

  p {
    color: ${Colors.white};
    font-size: 15px;
    font-style: normal;
    font-weight: 500;
    margin: 0;
    padding-left: 16px;
  }
`;

const CompleteYourProfileCrossIconContainer = styled('div')`
  padding-right: 8px;
  cursor: pointer;
`;

const CompleteYourProfileStepsContainer = styled('div')`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
`;

export default CompleteYourProfileWizard;
