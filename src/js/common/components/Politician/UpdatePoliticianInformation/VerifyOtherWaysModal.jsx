import PropTypes from 'prop-types';
import React, { useState } from 'react';
import styled from 'styled-components';
import DesignTokenColors from '../../Style/DesignTokenColors';
import ModalDisplayTemplateA from '../../../../components/Widgets/ModalDisplayTemplateA';
import { StepTitle } from '../../../../components/Style/ReadyIntroductionStyles';
import AppObservableStore from '../../../stores/AppObservableStore';

const VerifyOtherWaysModal = ({ politicianName }) => {
  const [relationshipOption, setRelationshipOption] = useState(null);
  const [otherOptionText, setOtherOptionText] = useState(null);

  const handleCloseVerifyOtherWaysModal = () => {
    AppObservableStore.setShowClaimProfileWithOtherWaysModal(false);
  };

  const handleRelationshipOption = (option) => {
    setOtherOptionText('');
    setRelationshipOption((prev) => (prev === option ? null : option));
  };

  const handleOtherOptionText = (e) => {
    setOtherOptionText(e.target.value);
  };

  const relationshipOptions = ["I'm the candidate", 'Staff member', 'Volunteer', 'Other'];

  const dialogTitleJsx = (
    <VerifyOtherWaysModalHeader>
      Verify that you are authorized to edit
      {' '}
      {politicianName}
      &apos;s profile
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
        <VerifyStepLabelSmall
          htmlFor="candidate-campaign-related-email"
        >
          Your candidate/campaign related email?
        </VerifyStepLabelSmall>
      </VerifyStepFlexTopMarginContainer>
      <VerifyFullInput
        id="candidate-campaign-related-email"
        placeholder="Email"
        type="email"
      />
      <VerifyCheckboxContainer>
        <VerifyStepLabelSmall
          htmlFor="not-public-visible-email-checkbox"
        >
          <VerifyStepCheckbox
            type="checkbox"
            id="not-public-visible-email-checkbox"
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
      />
      <VerifyStepLabelSmallTopMargin
        htmlFor="candidate-contact-social-media-page"
      >
        Candidate social media address
      </VerifyStepLabelSmallTopMargin>
      <VerifyFullInput
        placeholder="Social media page address"
        id="candidate-contact-social-media-page"
      />
      <VerifyStepFlexTopMarginContainer>
        <VerifyStepLetter>
          c
        </VerifyStepLetter>
        <VerifyStepLabelSmall
          htmlFor="candidate-additional-information"
        >
          Additional information to help us verify you
        </VerifyStepLabelSmall>
      </VerifyStepFlexTopMarginContainer>
      <AdditionalInformationTextArea
        id="candidate-additional-information"
        placeholder="Additional information"
      />
      <VerifyButtonsContainer>
        <CancelButton
          type="button"
          onClick={handleCloseVerifyOtherWaysModal}
        >
          Cancel
        </CancelButton>
        <SubmitButton
          type="button"
        >
          Submit
        </SubmitButton>
      </VerifyButtonsContainer>
    </VerifyOtherWaysContainer>
  );

  return (
    <ModalDisplayTemplateA
      dialogTitleJSX={dialogTitleJsx}
      toggleModal={handleCloseVerifyOtherWaysModal}
      show={AppObservableStore.getShowClaimProfileWithOtherWaysModal()}
      textFieldJSX={textFieldJsx}
      tallMode
    />
  );
};

VerifyOtherWaysModal.propTypes = {
  politicianName: PropTypes.string,
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
