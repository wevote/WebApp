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

      <Label htmlFor="politicalPartySelect">Select from common political parties or enter your own</Label>

      <Select
        id="politicalPartySelect"
        value={selectedParty}
        onChange={(e) => setSelectedParty(e.target.value)}
      >
        <option value="">Select party</option>
        {partyOptions.map((party) => (
          <option key={party} value={party}>
            {party}
          </option>
        ))}
      </Select>

      {/* Only show the custom input when “Enter your own” is selected */}
      {selectedParty === "Enter your own" && (
        <CustomWrapper>
          <Label htmlFor="customPartyInput"></Label>

          <Input
            id="customPartyInput"
            type="text"
            value={customParty}
            placeholder="Type your party name..."
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
  background-color: ${DesignTokenColors.whiteUI};
  color: ${DesignTokenColors.neutralUI900};

  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;

  background-image: url("data:image/svg+xml;utf8,<svg fill='%23666' height='24' width='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>");
  background-position: right 12px center;
  background-repeat: no-repeat;

  outline: none;

  &:focus {
    border-color: ${DesignTokenColors.primary600};
    box-shadow: 0 0 0 2px ${DesignTokenColors.primary200};
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
