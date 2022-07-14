import PropTypes from 'prop-types';
import React, { useState } from 'react';
import styled from 'styled-components';
import { TextField } from '@mui/material';
// import LoadingButton from '@mui/lab/LoadingButton';
// import SendIcon from '@mui/icons-material/Send';
import AddCandidateLoadingButton from './AddCandidateLoadingButton';
import { renderLog } from '../../../common/utils/logging';
import VoterGuidePossibilityActions from '../../../actions/VoterGuidePossibilityActions';

/**
 * A form element utilizing Material UI to collect information about a candidate endorsement
 * @param props
 * @returns {JSX.Element}
 */
export default function AddCandidateExtensionForm (props) {
  const { candidate, setCandidate } = props;
  const [loading, setLoading] = useState(false);
  const [finished, setFinished] = useState(false);

  const handleBlur = ({ target }) => {
    const { name, value } = target;
    setCandidate((prevInformation) => ({
      ...prevInformation,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // alert(JSON.stringify(candidate, null, 2));
    console.log(JSON.stringify(candidate, null, 2));
    // passing endorsementPageUrl into the retrieve function to check if the database has an ID for it already.
    VoterGuidePossibilityActions.voterGuidePossibilityRetrieve(candidate.endorsementPageUrl);
    // TODO: put this setLoading call and this setFinished call into the call to the API to set loading to true while waiting for a response
    setLoading(true);
    setTimeout(() => { setFinished(true); }, 5000);
  };

  renderLog('AddCandidateExtensionForm');  // Set LOG_RENDER_EVENTS to log all renders
  console.log('AddCandidateExtensionForm render');

  return (
    <form onSubmit={handleSubmit}>
      <CandidateForm>
        <CandidateTextField
          required
          variant="outlined"
          fullWidth
          color="primary"
          label="Candidate Name"
          name="Candidate Name"
          id="candidateName"
          value={candidate.candidateName}
          InputLabelProps={{ style: { fontFamily: 'Nunito Sans' } }}
          InputProps={{ style: { fontFamily: 'Nunito Sans' } }}
          onBlur={handleBlur}
        />
        <CandidateTextField
          required
          variant="outlined"
          fullWidth
          color="primary"
          label="Endorsement URL"
          name="Endorsement URL"
          id="endorsementURL"
          value={candidate.endorsementPageUrl}
          InputLabelProps={{ style: { fontFamily: 'Nunito Sans' } }}
          InputProps={{ style: { fontFamily: 'Nunito Sans' } }}
          onBlur={handleBlur}
        />
        <CandidateTextField
          variant="outlined"
          fullWidth
          color="primary"
          label="Candidate Website"
          name="Candidate URL"
          id="candidateURL"
          value={candidate.candidateSpecificEndorsementUrl}
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
          name="Endorsement Text"
          // id="candidateURL"
          value={candidate.endorsementText}
          InputLabelProps={{ style: { fontFamily: 'Nunito Sans' } }}
          InputProps={{ style: { fontFamily: 'Nunito Sans' } }}
          onBlur={handleBlur}
        />
      </CandidateForm>
      <ButtonWrapper>
        <AddCandidateLoadingButton loading={loading} finished={finished} />
      </ButtonWrapper>
    </form>
  );
}
AddCandidateExtensionForm.propTypes = {
  candidate: PropTypes.object,
  setCandidate: PropTypes.func,
};

const CandidateForm = styled('div')`
  width: 410px;
`;

const CandidateTextField = styled(TextField)`
  display: block;
  margin-bottom: 10px;
  font-family: "Nunito Sans", "Helvetica Neue Light", "Helvetica Neue", "Helvetica", "Arial", sans-serif;
`;

const ButtonWrapper = styled('div')`
  display: grid;
  margin: auto auto;
`;
