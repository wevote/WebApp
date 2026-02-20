import PropTypes from 'prop-types';
import React, { useState } from 'react';
import TagManager from 'react-gtm-module';
import styled from 'styled-components';
import DesignTokenColors from '../../Style/DesignTokenColors';
import ModalDisplayTemplateA from '../../../../components/Widgets/ModalDisplayTemplateA';
import { StepTitle } from '../../../../components/Style/ReadyIntroductionStyles';
import AppObservableStore from '../../../stores/AppObservableStore';
import VoterActions from '../../../../actions/VoterActions';
import { getPageDetails } from '../../../../utils/lookupPageNameAndPageTypeDict';
import VoterStore from '../../../../stores/VoterStore';
import PoliticianStore from '../../../stores/PoliticianStore';

function VerifyOtherWaysModal ({ politicianName, politicianWeVoteId }) {
  const [relationshipOption, setRelationshipOption] = useState(null);
  const [otherOptionText, setOtherOptionText] = useState(null);
  const [campaignEmail, setCampaignEmail] = useState('');
  const [emailNotVisibleCheckbox, setEmailNotVisibleCheckbox] = useState(false);
  const [webAddressContact, setWebAddressContact] = useState('');
  const [socialAddressContact, setSocialAddressContact] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [verifyFormSavedStatus, setVerifyFormSavedStatus] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  function sendGTMDataLayer (actionType = '', buttonId = '') {
    const dataLayerObject = {
      actionDetails: {
        actionType,
        buttonId,
      },
      event: 'action',
      pageDetails: getPageDetails(),
      userDetails: VoterStore.getAnalyticsUserDetails(),
    };
    if (politicianWeVoteId) {
      dataLayerObject.politicianDetails = PoliticianStore.getAnalyticsPoliticianDetails(politicianWeVoteId);
    }
    TagManager.dataLayer({ dataLayer: dataLayerObject });
  }

  const handleCloseVerifyOtherWaysModal = (buttonId) => {
    AppObservableStore.setShowClaimProfileWithOtherWaysModal(false);
    setFormSubmitted(false);
    sendGTMDataLayer('closeModal', buttonId);
  };

  const handleRelationshipOption = (option) => {
    setOtherOptionText('');
    setRelationshipOption((prev) => (prev === option ? null : option));
  };

  const handleOtherOptionText = (e) => {
    setOtherOptionText(e.target.value);
  };

  // build the text message (otherWaysToVerify) from Verify Other Ways Form
  const buildVerifyOtherWays = (
    relationshipOptionParam,
    otherOptionTextParam,
    campaignEmailParam,
    emailNotVisibleCheckboxParam,
    webAddressContactParam,
    socialAddressContactParam,
    additionalInfoParam,
  ) => {
    const lines = [];

    const option = relationshipOptionParam && relationshipOptionParam === 'Other' ?
      `${relationshipOptionParam} - ${otherOptionTextParam.trim()}` : relationshipOptionParam;

    lines.push(`Relationship to Candidate: ${option}`);

    if (campaignEmailParam) lines.push(`Candidate/campaign related email: ${campaignEmailParam.trim()}`);
    if (campaignEmailParam) lines.push(`Is email NOT visible on public websites: ${emailNotVisibleCheckboxParam}`);
    if (webAddressContactParam) lines.push(`Candidate contact form web address: ${webAddressContactParam.trim()}`);
    if (socialAddressContactParam) lines.push(`Candidate social media address: ${socialAddressContactParam.trim()}`);
    if (additionalInfoParam) lines.push(`Additional information:\n${additionalInfoParam.trim()}`);

    return lines.join('\n');
  };

  // handle submit button click
  const handleVerifyOtherWaysSubmit = (buttonId) => {
    const otherWaysToVerify = buildVerifyOtherWays(relationshipOption, otherOptionText, campaignEmail, emailNotVisibleCheckbox, webAddressContact, socialAddressContact, additionalInfo);
    const currentUrl = window.location.href;

    setVerifyFormSavedStatus('Saving...');
    VoterActions.voterUpdateVerifyOtherWaysSubmit(politicianWeVoteId, otherWaysToVerify, currentUrl);

    setTimeout(() => {
      setVerifyFormSavedStatus('Saved');
      setFormSubmitted(true);
    }, 2000);

    setTimeout(() => {
      setVerifyFormSavedStatus('');
    }, 4000);

    sendGTMDataLayer('save', buttonId);
  };

  const relationshipOptions = ["I'm the candidate", 'Staff member', 'Volunteer', 'Other'];

  const dialogTitleJsx = (
    <VerifyOtherWaysModalHeader>
      {formSubmitted ? 'Verification form submitted' :
        `Verify you're authorized to edit ${politicianName}'s profile`}
    </VerifyOtherWaysModalHeader>
  );

  const textFieldJsx = (
    <VerifyOtherWaysContainer>
      <VerifyStepFlexContainer>
        <VerifyStepNumber>
          1
        </VerifyStepNumber>
        <StepTitle>
          What&apos;s your relationship to the candidate?
        </StepTitle>
      </VerifyStepFlexContainer>
      <RelationshipOptionsContainer>
        {relationshipOptions.map((option) => (
          <React.Fragment key={`relationship-${option}`}>
            {option !== 'Other' ? (
              <RelationshipOptionLabel
                htmlFor={`relationship-${option}`}
              >
                <RelationshipOptionInput
                  type="radio"
                  value={option}
                  checked={relationshipOption === option}
                  onClick={() => handleRelationshipOption(option)}
                  id={`relationship-${option}`}
                />
                {option}
              </RelationshipOptionLabel>
            ) : (
              <div>
                <RelationshipOptionLabel
                  htmlFor={`relationship-${option}`}
                >
                  <RelationshipOptionInput
                    type="radio"
                    value={option}
                    checked={relationshipOption === option}
                    onClick={() => handleRelationshipOption(option)}
                    id={`relationship-${option}`}
                  />
                  {option}
                  <RelationshipOptionOtherInput
                    disabled={relationshipOption !== option}
                    onChange={handleOtherOptionText}
                    value={otherOptionText}
                  />
                </RelationshipOptionLabel>
              </div>
            )}
          </React.Fragment>
        ))}
      </RelationshipOptionsContainer>
      <VerifyStepFlexCenterContainer>
        <VerifyStepNumber>
          2
        </VerifyStepNumber>
        <StepTitle>
          How can we verify you?
        </StepTitle>
      </VerifyStepFlexCenterContainer>
      <VerifySubtitleContainer>
        For the quickest verification, enter as much information as possible.
      </VerifySubtitleContainer>
      <VerifyStepFlexTopMarginContainer>
        <VerifyStepLetter>
          a
        </VerifyStepLetter>
        <VerifyStepLabel
          htmlFor="candidate-campaign-related-email"
        >
          Your candidate/campaign related email?
        </VerifyStepLabel>
      </VerifyStepFlexTopMarginContainer>
      <VerifyFullInput
        id="candidate-campaign-related-email"
        placeholder="Email"
        type="email"
        value={campaignEmail}
        onChange={(e) => setCampaignEmail(e.target.value)}
      />
      <VerifyCheckboxContainer>
        <VerifyStepLabelSmall
          htmlFor="not-public-visible-email-checkbox"
        >
          <VerifyStepCheckbox
            type="checkbox"
            id="not-public-visible-email-checkbox"
            checked={emailNotVisibleCheckbox}
            onChange={(e) => setEmailNotVisibleCheckbox(e.target.checked)}
          />
          My email is not visible on any public websites, and can&apos;t be confirmed that way
        </VerifyStepLabelSmall>
      </VerifyCheckboxContainer>
      <VerifyStepFlexTopMarginContainer>
        <VerifyStepLetter>
          b
        </VerifyStepLetter>
        <VerifyStepLabel>
          If you have access to your candidate&apos;s contact form or social media, we will send you a verifications message/passkey there.
        </VerifyStepLabel>
      </VerifyStepFlexTopMarginContainer>
      <VerifyStepLabelSmallTopMargin
        htmlFor="candidate-contact-web-address"
      >
        Candidate contact form web address
      </VerifyStepLabelSmallTopMargin>
      <VerifyFullInput
        id="candidate-contact-web-address"
        placeholder="Web address"
        value={webAddressContact}
        onChange={(e) => setWebAddressContact(e.target.value)}
      />
      <VerifyStepLabelSmallTopMargin
        htmlFor="candidate-contact-social-media-page"
      >
        Candidate social media address
      </VerifyStepLabelSmallTopMargin>
      <VerifyFullInput
        placeholder="Social media page address"
        id="candidate-contact-social-media-page"
        value={socialAddressContact}
        onChange={(e) => setSocialAddressContact(e.target.value)}
      />
      <VerifyStepFlexTopMarginContainer>
        <VerifyStepLetter>
          c
        </VerifyStepLetter>
        <VerifyStepLabel
          htmlFor="candidate-additional-information"
        >
          Additional information to help us verify you
        </VerifyStepLabel>
      </VerifyStepFlexTopMarginContainer>
      <AdditionalInformationTextArea
        id="candidate-additional-information"
        placeholder="Additional information"
        value={additionalInfo}
        onChange={(e) => setAdditionalInfo(e.target.value)}
      />
      <VerifyButtonsContainer>
        <CancelButton
          id="cancelVerifyOtherWaysModal"
          onClick={() => handleCloseVerifyOtherWaysModal('cancelVerifyOtherWaysModal')}
          type="button"
        >
          Cancel
        </CancelButton>
        <SubmitButton
          id="submitVerifyOtherWaysModal"
          onClick={() => handleVerifyOtherWaysSubmit('submitVerifyOtherWaysModal')}
          type="button"
        >
          Submit
        </SubmitButton>
      </VerifyButtonsContainer>
      <VerifyFormSavedStatusContainer className="u-gray-mid">
        {verifyFormSavedStatus}
      </VerifyFormSavedStatusContainer>
    </VerifyOtherWaysContainer>
  );

  return (
    <ModalDisplayTemplateA
      dialogTitleJSX={dialogTitleJsx}
      toggleModal={() => handleCloseVerifyOtherWaysModal('cancelVerifyOtherWaysModal')}
      show={AppObservableStore.getShowClaimProfileWithOtherWaysModal()}
      textFieldJSX={formSubmitted ?
        (
          <SubmissionMessageContainer>
            Thank you for sharing with us other ways we can verify that you should have the right to edit this page. We will strive to get back to within 24 hours.
            Please also feel free to email us at support@wevote.us if you have any questions.
          </SubmissionMessageContainer>
        ) : (textFieldJsx)}
      tallMode
    />
  );
}

VerifyOtherWaysModal.propTypes = {
  politicianName: PropTypes.string,
  politicianWeVoteId: PropTypes.string,
};

const VerifyOtherWaysModalHeader = styled('h1')`
  font-size: 18px;
  margin: 0;
  padding: 0;
`;

const VerifyOtherWaysContainer = styled('div')`
  margin: 8px 0 24px 0;
`;

const VerifyStepFlexContainer = styled('div')`
  display: flex;
  margin: 0;
`;

const VerifyStepFlexTopMarginContainer = styled(VerifyStepFlexContainer)`
  margin-top: 20px;
`;

const VerifyStepFlexCenterContainer = styled(VerifyStepFlexContainer)`
  align-items: center;
`;

const VerifyStepNumber = styled('div')`
  align-items: center;
  background-color: ${DesignTokenColors.neutralUI600};
  border-radius: 50%;
  color: white;
  display: flex;
  font-size: 14px;
  height: 24px;
  justify-content: center;
  min-width: 24px;
`;

const RelationshipOptionsContainer = styled('div')`
  display: flex;
  flex-direction: column;
  margin-left: 35px;
`;

const RelationshipOptionLabel = styled('label')`
  display: flex;
  align-items: center;
  font-size: 14px;
`;

const RelationshipOptionInput = styled('input')`
  margin: 0 4px 0 0;
`;

const RelationshipOptionOtherInput = styled('input')`
  border: 1px solid ${DesignTokenColors.neutralUI100};
  border-radius: 4px;
  margin: 0 0 0 8px;
  padding: 0 0 0 4px;
`;

const VerifySubtitleContainer = styled('div')`
  font-size: 14px;
  margin-left: 35px;
`;

const SubmissionMessageContainer = styled('div')`
  margin: 28px 0 24px 0;
  font-size: 14px;
`;

const VerifyStepLetter = styled(VerifyStepNumber)`
  background-color: ${DesignTokenColors.neutralUI400};
  font-size: 12px;
  height: 18px;
  margin-right: 6px;
  min-width: 18px;
  width: 18px;
`;

const VerifyStepLabel = styled('label')`
  font-size: 14px;
  margin: 0;
`;

const VerifyFullInput = styled('input')`
  border: 1px solid ${DesignTokenColors.neutralUI100};
  border-radius: 4px;
  font-size: 14px;
  height: 40px;
  margin: 8px 0 0 0;
  padding: 0 8px;
  width: 100%;
`;

const VerifyCheckboxContainer = styled('div')`
  margin: 4px 0 18px 0;
`;

const VerifyStepLabelSmall = styled(VerifyStepLabel)`
  display: flex;
  font-size: 12px;
`;

const VerifyStepLabelSmallTopMargin = styled(VerifyStepLabelSmall)`
  margin: 8px 0 0 0;
`;

const VerifyStepCheckbox = styled('input')`
  border: 1px solid ${DesignTokenColors.neutralUI100};
  height: 16px;
  margin: 1px 4px 0 0;
  width: 16px;
`;

const AdditionalInformationTextArea = styled('textarea')`
  resize: none;
  border: 1px solid ${DesignTokenColors.neutralUI100};
  border-radius: 4px;
  font-size: 14px;
  margin: 8px 0;
  padding: 8px 12px;
  width: 100%;
`;

const VerifyButtonsContainer = styled('div')`
  align-items: center;
  display: flex;
  justify-content: flex-end;
  width: 100%;
`;

const VerifyFormSavedStatusContainer = styled('div')`
  align-items: center;
  display: flex;
  justify-content: flex-end;
  width: 100%;
`;

const CancelButton = styled('button')`
  background: transparent;
  border: none;
  border-radius: 22px;
  color: black;
  font-size: 14px;
  height: 44px;
  margin: 0 0 0 8px;
  width: 152px;
  padding: 0 8px;
  transition: background-color .3s;

  &:hover {
    background: ${DesignTokenColors.neutral50};
  }
`;

export const SubmitButton = styled(CancelButton)`
  background: ${DesignTokenColors.primary600};
  color: white;

  &:hover {
    background: ${DesignTokenColors.primary700};
  }
`;

export default VerifyOtherWaysModal;
