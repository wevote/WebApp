import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';
import NameField from './NameField';

// The "By the way, we didn't catch your name!" block: heading, explainer, first + last
// name fields, and an inline error shown when public is attempted without a name.
export default function NameEntryForm ({
  heading, text, firstName, lastName, onChangeFirst, onChangeLast,
  firstNamePlaceholder, lastNamePlaceholder, showError, errorText,
}) {
  return (
    <FormWrapper>
      <Heading>{heading}</Heading>
      <Text>{text}</Text>
      <FieldsRow>
        <NameField value={firstName} onChange={onChangeFirst} placeholder={firstNamePlaceholder} error={showError} />
        <NameField value={lastName} onChange={onChangeLast} placeholder={lastNamePlaceholder} error={showError} />
      </FieldsRow>
      {showError && <ErrorText>{errorText}</ErrorText>}
    </FormWrapper>
  );
}
NameEntryForm.propTypes = {
  heading: PropTypes.string,
  text: PropTypes.string,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  onChangeFirst: PropTypes.func,
  onChangeLast: PropTypes.func,
  firstNamePlaceholder: PropTypes.string,
  lastNamePlaceholder: PropTypes.string,
  showError: PropTypes.bool,
  errorText: PropTypes.string,
};

const ErrorText = styled.p`
  color: ${DesignTokenColors.warning900};
  font-size: 15px;
  font-weight: 600;
  margin: 4px 0 0;
`;

const FieldsRow = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 4px;

  @media (max-width: 575px) {
    flex-direction: column;
    gap: 10px;
  }
`;

const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Heading = styled.p`
  color: ${DesignTokenColors.neutral700};
  font-size: 15px;
  font-weight: 700;
  margin: 0;
`;

const Text = styled.p`
  color: ${DesignTokenColors.neutral700};
  font-size: 15px;
  line-height: 1.5;
  margin: 0;
`;
