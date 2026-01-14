import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Close as CloseIcon } from '@mui/icons-material';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';
import ModalDisplayTemplateC from '../Widgets/ModalDisplayTemplateC';

export default function EnterOneByOneModal ({
  isOpen,
  onClose,
  onImport,
  notify,
}) {
  const [voters, setVoters] = useState([{ name: '', email: '', phone: '' }]);

  const emailRE = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;

  const handleAddAnother = () => {
    setVoters([...voters, { name: '', email: '', phone: '' }]);
  };

  const handleInputChange = (index, field, value) => {
    const newVoters = [...voters];
    newVoters[index][field] = value;
    setVoters(newVoters);
  };

  const handleImport = () => {
    const validVoters = voters.filter((v) => {
      const hasName = v.name.trim();
      const hasValidEmail = emailRE.test(v.email);
      return hasName && hasValidEmail;
    });

    if (validVoters.length === 0) {
      notify('Please enter at least one voter with a valid name and email.', false);
      return;
    }

    const votersToImport = validVoters.map((v) => ({
      name: v.name.trim(),
      email: v.email.trim(),
      phone: v.phone.trim(),
    }));

    setVoters([{ name: '', email: '', phone: '' }]);
    onImport(votersToImport);
    onClose();
  };

  const handleCancel = () => {
    setVoters([{ name: '', email: '', phone: '' }]);
    onClose();
  };

  const isImportDisabled = !voters.some((v) => v.name.trim() && emailRE.test(v.email));
  const validVoterCount = voters.filter((v) => v.name.trim() && emailRE.test(v.email)).length;

  const headerJSX = (
    <>
      <ModalTitle>Enter voters one-by-one</ModalTitle>
      <AddAnotherButton type="button" onClick={handleAddAnother}>
        + Add another
      </AddAnotherButton>
      <CloseButton type="button" onClick={onClose}>
        <CloseIcon fontSize="medium" />
      </CloseButton>
    </>
  );

  const bodyJSX = (
    <InputsScrollContainer>
      {voters.map((voter, index) => (
        <React.Fragment key={index}>
          <InputGroup>
            <StyledInput
              type="text"
              placeholder="First and last name"
              value={voter.name}
              onChange={(e) => handleInputChange(index, 'name', e.target.value)}
            />
            <StyledInput
              type="email"
              placeholder="Email"
              value={voter.email}
              onChange={(e) => handleInputChange(index, 'email', e.target.value)}
            />
            <StyledInput
              type="tel"
              placeholder="Mobile phone"
              value={voter.phone}
              onChange={(e) => handleInputChange(index, 'phone', e.target.value)}
            />
          </InputGroup>
          {index < voters.length - 1 && <Divider />}
        </React.Fragment>
      ))}
    </InputsScrollContainer>
  );

  const footerJSX = (
    <>
      <CancelButton onClick={handleCancel}>
        Cancel
      </CancelButton>
      <ImportButton
        onClick={handleImport}
        disabled={isImportDisabled}
      >
        Import
        {' '}
        {validVoterCount > 1 ? `${validVoterCount} voters` : 'voter'}
      </ImportButton>
    </>
  );

  return (
    <ModalDisplayTemplateC
      show={isOpen}
      toggleModal={onClose}
      headerJSX={headerJSX}
      bodyJSX={bodyJSX}
      footerJSX={footerJSX}
    />
  );
}

EnterOneByOneModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onImport: PropTypes.func.isRequired,
  notify: PropTypes.func.isRequired,
};

// Styles

const AddAnotherButton = styled.button`
  background: none;
  border: none;
  color: ${DesignTokenColors.primary600};
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  padding: 4px 12px;
  white-space: nowrap;
  margin-top: 2px;

  &:hover {
    color: ${DesignTokenColors.primary700};
    text-decoration: underline;
  }
`;

const CancelButton = styled.button`
  background: transparent;
  border-radius: 9999px;
  border: none;
  color: ${DesignTokenColors.neutralUI900};
  text-transform: none;
  font-size: 14px;
  font-weight: 500;
  padding: 6px 12px;
  min-width: auto;
  transition: background 0.2s ease;

  &:hover {
    background: ${DesignTokenColors.neutralUI50};
  }
`;

const CloseButton = styled.button`
  align-items: center;
  background: none;
  border: none;
  color: ${DesignTokenColors.neutralUI900};
  cursor: pointer;
  display: flex;
  padding: 4px;
  flex-shrink: 0;

  &:hover {
    color: black;
  }
`;

const Divider = styled.div`
  border-bottom: 2px solid ${DesignTokenColors.neutralUI100};
  margin: 6px 0;
`;

const ImportButton = styled.button`
  background: ${DesignTokenColors.primary600};
  border: none;
  border-radius: 9999px;
  color: ${DesignTokenColors.whiteUI};
  text-transform: none;
  font-size: 14px;
  font-weight: 400;
  padding: 6px 48px;
  flex: 1;

  &:hover {
    background: ${DesignTokenColors.primary700};
  }

  &:disabled {
    background: ${DesignTokenColors.neutralUI400};
    color: ${DesignTokenColors.whiteUI};
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const InputsScrollContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 15px;
  gap: 12px;
`;

const ModalTitle = styled.h2`
  color: ${DesignTokenColors.neutralUI900};
  font-size: 17px;
  font-weight: 500;
  margin: 0;
  flex: 1;
`;

const StyledInput = styled.input`
  background: ${DesignTokenColors.whiteUI};
  border: 1px solid ${DesignTokenColors.neutralUI300};
  border-radius: 10px;
  padding: 8px 12px;
  font-size: 12px;
  width: 100%;

  &::placeholder {
    color: ${DesignTokenColors.neutralUI500};
  }

  &:focus {
    outline: 1.5px solid ${DesignTokenColors.primary500};
    outline-offset: 2px;
  }
`;
