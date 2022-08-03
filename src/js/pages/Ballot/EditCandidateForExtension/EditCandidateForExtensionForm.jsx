import React, { useState } from 'react';
import styled from 'styled-components';
import { TextField } from '@mui/material';
import PropTypes from 'prop-types';
import AddCandidateLoadingButton from '../AddCandidateExtension/AddCandidateLoadingButton';
import VoterGuidePossibilityActions from '../../../actions/VoterGuidePossibilityActions';


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

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    console.log(JSON.stringify(candidate, null, 2));

    // saving new values that were saved from form to voterGuidePossibilityPosition
    const possibilityPositionDictionary = {
      ballot_item_name: candidate.candidateName,
      more_info_url: candidate.candidateCampaignUrl,
      statement_text: candidate.endorsementText,
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
        <CandidateTextField
          variant="outlined"
          fullWidth
          multiline
          color="primary"
          label="Endorsement Text"
          name="endorsementText"
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
