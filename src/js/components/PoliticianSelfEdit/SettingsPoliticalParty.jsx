import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import TagManager from 'react-gtm-module';
import DesignTokenColors from '../../common/components/Style/DesignTokenColors';
import PoliticianActions from '../../common/actions/PoliticianActions';
import PoliticianStore from '../../common/stores/PoliticianStore';
import VoterStore from '../../stores/VoterStore';
import { getPageDetails } from '../../utils/lookupPageNameAndPageTypeDict';

const delayBeforeSavingToAPI = 1500;
const delayBeforeShowingSavedStatus = 3000;
const enterYourOwnPartyText = '-- Enter your own --';

const SettingsPoliticalParty = ({ politicianWeVoteId }) => {
  // The master list of political party options are in WeVoteServer/wevote_functions/functions.py - candidate_party_display
  const partyOptions = [
    'Democrat',
    'Republican',
    'Green',
    'Libertarian',
    'Independent',
    'Nonpartisan',
    'No Party Preference',
    'Peace and Freedom',
    'Working Families',
    'Constitution',
    'No Labels',
    enterYourOwnPartyText,
  ];

  const [customParty, setCustomParty] = useState('');
  const [savedStatus, setSavedStatus] = useState('');
  const [selectedParty, setSelectedParty] = useState('');

  const clearStatusTimer = useRef(null);
  const savingStatusTimer = useRef(null);

  const sendGTMDataLayer = ({ buttonId, actionType = 'save' }) => {
    // const destinationPage = lookupPageNameAndPageTypeDict(destinationPath);
    const dataLayerObject = {
      event: 'action',
      actionDetails: {
        actionType,
        buttonId,
      },
      userDetails: VoterStore.getAnalyticsUserDetails(),
      pageDetails: getPageDetails(),

    };
    if (politicianWeVoteId) {
      dataLayerObject.politicianDetails = PoliticianStore.getAnalyticsPoliticianDetails(politicianWeVoteId);
    }
    TagManager.dataLayer({ dataLayer: dataLayerObject });
  };


  const updatePoliticalPartyCustom = (event) => {
    const politicalPartyValue = event.target.value;
    if (event.target.name === 'politicalPartyCustom') {
      setSelectedParty(enterYourOwnPartyText);
      setCustomParty(politicalPartyValue);
      if (savingStatusTimer.current) clearTimeout(savingStatusTimer.current);
      savingStatusTimer.current = setTimeout(() => {
        // After some time, save to the API server
        setSavedStatus('Saving Political Party...');
        PoliticianActions.politicianPoliticalPartySave(politicianWeVoteId, politicalPartyValue);
      }, delayBeforeSavingToAPI);

      if (clearStatusTimer.current) clearTimeout(clearStatusTimer.current);
      clearStatusTimer.current = setTimeout(() => {
        // After some time, show that the data was saved
        setSavedStatus('Saved');
        sendGTMDataLayer({ buttonId: 'politicalPartyCustom' });
      }, delayBeforeShowingSavedStatus);
    }
  };

  const updatePoliticalPartyFromDropdown = (event) => {
    const politicalPartyValue = event.target.value;
    if (event.target.name === 'politicalParty') {
      if (politicalPartyValue === enterYourOwnPartyText) {
        setSelectedParty(politicalPartyValue);
      } else {
        setSavedStatus('Saving Political Party...');
        setSelectedParty(politicalPartyValue);
        PoliticianActions.politicianPoliticalPartySave(politicianWeVoteId, politicalPartyValue);
        // Clear any existing timeout
        if (clearStatusTimer.current) clearTimeout(clearStatusTimer.current);
        // After some time, show that the data was saved
        clearStatusTimer.current = setTimeout(() => {
          setSavedStatus('Saved');
          sendGTMDataLayer({ buttonId: 'politicalPartySelect' });
        }, delayBeforeShowingSavedStatus);
      }
    }
  };

  // Cleanup timeout on component unmount
  useEffect(() => {
    if (politicianWeVoteId && partyOptions) {
      const politicalPartyFromAPIServer = PoliticianStore.getPoliticalParty(politicianWeVoteId);
      // If politicalPartyFromAPIServer is in the array of partyOptions, update the dropdown with it
      if (politicalPartyFromAPIServer && partyOptions.some((option) => option.toLowerCase() === politicalPartyFromAPIServer.toLowerCase())) {
        setSelectedParty(politicalPartyFromAPIServer);
      } else {
        setSelectedParty(enterYourOwnPartyText);
        setCustomParty(politicalPartyFromAPIServer);
      }
    }

    // Clear the timer when the component is unmounted to prevent memory leaks
    return () => {
      if (clearStatusTimer.current) clearTimeout(clearStatusTimer.current);
      if (savingStatusTimer.current) clearTimeout(savingStatusTimer.current);
    };
  }, []);

  return (
    <SettingsPoliticalPartyWrapper>
      <HeaderContainer>
        <h1 className="h2">Political Party</h1>
      </HeaderContainer>

      <IntroductionText id="partyLabel" htmlFor="politicalPartySelect">
        Select from common political parties or choose the &quot;Enter your own&quot; option.
      </IntroductionText>

      <Select
        id="politicalPartySelect"
        name="politicalParty"
        aria-labelledby="partyLabel"
        value={selectedParty}
        onChange={updatePoliticalPartyFromDropdown}
      >

        <option value="">-- Select party --</option>
        {partyOptions.map((party) => (
          <option key={party} value={party}>
            {party}
          </option>
        ))}
      </Select>

      {/* Custom input only visible if needed */}
      {selectedParty === enterYourOwnPartyText && (
        <CustomWrapper>
          <Input
            id="politicalPartyCustom"
            name="politicalPartyCustom"
            type="text"
            value={customParty}
            placeholder="Type your party name..."
            aria-label="Type your political party name"
            onChange={updatePoliticalPartyCustom}
          />
        </CustomWrapper>
      )}
      <SavedStatus>{savedStatus}</SavedStatus>
    </SettingsPoliticalPartyWrapper>
  );
};
SettingsPoliticalParty.propTypes = {
  politicianWeVoteId: PropTypes.string,
};

const CustomWrapper = styled('div')`
  margin-top: 3px;
`;

/* Matches Official Statement header container */
const HeaderContainer = styled('div')`
  display: flex;
  align-items: center;
  margin-bottom: 4px;
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

const IntroductionText = styled('div')`
  display: block;
  margin-top: 0px;      /* Spacing between title and intro text */
  margin-bottom: 12px;  /* Same spacing as Official Statement intro text */
  font-size: 15px;
  color: ${DesignTokenColors.neutralUI700};
  font-weight: 300;
`;

const SavedStatus = styled('div')`
  display: block;
  margin-top: 12px;
  font-size: 15px;
  color: ${DesignTokenColors.neutralUI700};
  font-weight: 300;
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

const SettingsPoliticalPartyWrapper = styled('div')`
  padding: 16px;
  max-width: 700px;
  color: ${DesignTokenColors.neutralUI900};
`;

export default SettingsPoliticalParty;
