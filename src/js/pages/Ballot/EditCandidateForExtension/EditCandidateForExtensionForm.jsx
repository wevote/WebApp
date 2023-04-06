import { TextField } from '@mui/material';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import styled from 'styled-components';
import VoterGuidePossibilityActions from '../../../actions/VoterGuidePossibilityActions';
import AddCandidateLoadingButton from '../AddCandidateExtension/AddCandidateLoadingButton';


export default function EditCandidateForExtensionForm (props) {
  const { candidate, setCandidate } = props;
  const [loading, setLoading] = useState(false);
  const [finished, setFinished] = useState(false);

  const handleBlur = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    setCandidate((prevInformation) => ({
      ...prevInformation,
      [name]: value,
    }));
  };

  const onStanceChange = (event) => {
    setCandidate((prevInformation) => ({
      ...prevInformation,
      stance: event.target.value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    // console.log(JSON.stringify(candidate, null, 2));

    // saving new values that were saved from form to voterGuidePossibilityPosition
    const possibilityPositionDictionary = {
      ballot_item_name: candidate.candidateName,
      more_info_url: candidate.candidateCampaignUrl,
      statement_text: candidate.statementText,
      position_stance: candidate.stance,
    };
    VoterGuidePossibilityActions.voterGuidePossibilityPositionSave(candidate.voterGuidePossibilityID, candidate.candidatePossibilityPositionID, possibilityPositionDictionary);
    setFinished(true);
  };

  return (
    <form onSubmit={handleSubmit}>
      <CandidateForm>
        <CandidateTextField
          required
          variant="outlined"
          fullWidth
          color="primary"
          label="Candidate Name"
          name="candidateName"
          defaultValue={candidate.candidateName}
          InputLabelProps={{ style: { fontFamily: 'Nunito Sans' } }}
          InputProps={{ style: { fontFamily: 'Nunito Sans' } }}
          onBlur={handleBlur}
        />
        <CandidateTextField
          variant="outlined"
          fullWidth
          color="primary"
          label="Campaign URL"
          name="candidateCampaignUrl"
          defaultValue={candidate.candidateCampaignUrl}
          InputLabelProps={{ style: { fontFamily: 'Nunito Sans' }, shrink: true }}
          InputProps={{ style: { fontFamily: 'Nunito Sans' } }}
          onBlur={handleBlur}
        />
        <CandidateTextField
          required
          variant="outlined"
          fullWidth
          color="primary"
          label="Endorsement URL"
          name="endorsementPageUrl"
          defaultValue={candidate.endorsementPageUrl}
          InputLabelProps={{ style: { fontFamily: 'Nunito Sans' } }}
          InputProps={{ style: { fontFamily: 'Nunito Sans' } }}
          onBlur={handleBlur}
        />
        <CheckBoxArea>
          <CheckBoxContainer>
            <CheckBoxInput
              type="radio"
              name="stanceGroup"
              value="SUPPORT"
              id="support"
              checked={candidate.stance === 'SUPPORT'}
              onChange={onStanceChange}
            />
            <CheckBoxLabel htmlFor="support">Support</CheckBoxLabel>
          </CheckBoxContainer>
          <CheckBoxContainer>
            <CheckBoxInput
              type="radio"
              name="stanceGroup"
              value="OPPOSE"
              id="oppose"
              checked={candidate.stance === 'OPPOSE'}
              onChange={onStanceChange}
            />
            <CheckBoxLabel htmlFor="oppose">Oppose</CheckBoxLabel>
          </CheckBoxContainer>
          <CheckBoxContainer>
            <CheckBoxInput
              type="radio"
              name="stanceGroup"
              value="INFO_ONLY"
              id="infoOnly"
              checked={candidate.stance === 'INFO_ONLY'}
              onChange={onStanceChange}
            />
            <CheckBoxLabel htmlFor="infoOnly">Info Only</CheckBoxLabel>
          </CheckBoxContainer>
        </CheckBoxArea>
        <CandidateTextField
          variant="outlined"
          fullWidth
          multiline
          color="primary"
          label="Endorsement Text"
          name="statementText"
          defaultValue={candidate.statementText}
          InputLabelProps={{ style: { fontFamily: 'Nunito Sans' }, shrink: true }}
          InputProps={{ style: { fontFamily: 'Nunito Sans' } }}
          onBlur={handleBlur}
          rows="5"
          // maxRows="5"
        />
      </CandidateForm>
      <ButtonWrapper>
        <AddCandidateLoadingButton loading={loading} finished={finished} text="Submit Edits" />
      </ButtonWrapper>
    </form>
  );
}


EditCandidateForExtensionForm.propTypes = {
  candidate: PropTypes.object,
  setCandidate: PropTypes.func,
};

const CandidateForm = styled('div')`
  width: 410px;
`;

const CandidateTextField = styled(TextField)`
  display: block;
  font-family: "Nunito Sans", "Helvetica Neue Light", "Helvetica Neue", "Helvetica", "Arial", sans-serif;
  margin-bottom: 10px;
`;

const ButtonWrapper = styled('div')`
  display: grid;
  margin: auto auto;
`;

const CheckBoxArea  = styled('div')`
  margin: 15px 0 20px 30px;
`;

const CheckBoxContainer =  styled('span')`
  margin-right: 10px;
`;
const CheckBoxLabel =  styled('label')`
  margin: 0 12px 0 4px;
`;

const CheckBoxInput = styled('input')`
  transform: translateY(1px);
`;
