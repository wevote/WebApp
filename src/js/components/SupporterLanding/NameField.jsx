import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';

// A single rounded-rectangle text input for the first / last name entry, turning its
// border warning-orange when in an error state.
export default function NameField ({ value, onChange, placeholder, error = false }) {
  return (
    <Input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      aria-label={placeholder}
      $error={error}
    />
  );
}
NameField.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  error: PropTypes.bool,
};

const Input = styled.input`
  background: ${DesignTokenColors.whiteUI};
  border: 1px solid ${({ $error }) => ($error ? DesignTokenColors.warning900 : DesignTokenColors.neutralUI300)};
  border-radius: 8px;
  color: ${DesignTokenColors.neutral900};
  flex: 1;
  font-size: 16px;
  min-width: 0;
  padding: 7px 14px;

  &::placeholder {
    color: ${DesignTokenColors.neutral500};
  }

  &:focus {
    border-color: ${({ $error }) => ($error ? DesignTokenColors.warning900 : DesignTokenColors.primary600)};
    outline: none;
  }
`;
