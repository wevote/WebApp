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
      <HeaderContainer>
        <h1 className="h2">Political Party</h1>
      </HeaderContainer>

      <Label id="partyLabel" htmlFor="politicalPartySelect">
        Select your political party or enter your own below.
      </Label>

      <Select
        id="politicalPartySelect"
        aria-labelledby="partyLabel"
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

      {/* Custom input only visible if needed */}
      {selectedParty === "Enter your own" && (
        <CustomWrapper>
          <Input
            id="customPartyInput"
            type="text"
            value={customParty}
            placeholder="Type your party name..."
            aria-label="Type your political party name"
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

/* Matches Official Statement header container */
const HeaderContainer = styled('div')`
  display: flex;
  align-items: center;
  margin-bottom: 4px;
`;

/* Uses the same spacing behavior as IntroductionWrapper in Official Statement */
const Label = styled('label')`
  display: block;
  margin-top: 8px;      /* Spacing between title and intro text */
  margin-bottom: 12px;  /* Same spacing as Official Statement intro text */
  font-size: 15px;
  color: ${DesignTokenColors.neutralUI700};
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
  background-image: url("data:image/svg+xml;utf8,<svg fill='%23666' height='24' width='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>");
  background-position: right 12px center;
  background-repeat: no-repeat;

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
