import React, { useState } from 'react';
import styled from 'styled-components';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';

const SettingsPoliticalParty = () => {
  const partyOptions = [
    "Democratic Party",
    "Republican Party",
    "Green Party",
    "Libertarian Party",
    "Independent",
    "Enter your own"
  ];

  const [selectedParty, setSelectedParty] = useState("");
  const [customParty, setCustomParty] = useState("");

  return (
    <Wrapper>
      <SectionTitle>Political Party</SectionTitle>

      <Label>Select your political party:</Label>

      <Select
        value={selectedParty}
        onChange={(e) => setSelectedParty(e.target.value)}
      >
        <option value="">-- Please choose an option --</option>

        {partyOptions.map((party) => (
          <option key={party} value={party}>{party}</option>
        ))}
      </Select>

      {selectedParty === "Enter your own" && (
        <CustomWrapper>
          <Label>Type your party name:</Label>
          <Input
            type="text"
            value={customParty}
            placeholder="Enter your party name"
            onChange={(e) => setCustomParty(e.target.value)}
          />
        </CustomWrapper>
      )}
    </Wrapper>
  );
};

const Wrapper = styled('div')`
  padding: 16px;
  max-width: 700px;
  color: ${DesignTokenColors.neutralUI900};
`;

const SectionTitle = styled('h2')`
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 24px;
  color: ${DesignTokenColors.neutralUI900};
`;

const Label = styled('label')`
  display: block;
  margin-top: 16px;
  margin-bottom: 8px;
  font-size: 16px;
  font-weight: 600;
`;

const Select = styled('select')`
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border-radius: 8px;
  border: 1px solid ${DesignTokenColors.neutralUI400};
  background: ${DesignTokenColors.whiteUI};
  outline: none;

  &:focus {
    border-color: ${DesignTokenColors.primary600};
  }
`;

const Input = styled('input')`
  width: 100%;
  padding: 12px;
  margin-top: 8px;
  font-size: 16px;
  border-radius: 8px;
  border: 1px solid ${DesignTokenColors.neutralUI400};
  outline: none;

  &:focus {
    border-color: ${DesignTokenColors.primary600};
  }
`;

const CustomWrapper = styled('div')`
  margin-top: 20px;
`;

export default SettingsPoliticalParty;
