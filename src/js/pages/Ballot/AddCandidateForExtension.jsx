import PropTypes from 'prop-types';
import React, { useState } from 'react';
import styled from 'styled-components';
import { Button, TextField } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { renderLog } from '../../common/utils/logging';


// https://localhost:3000/add-candidate-for-extension?candidate_name=Phil%20Ting&candidate_we_vote_id=wv02cand40131&endorsement_page_url=https%3A%2F%2Fwww.sierraclub.org%2Fcalifornia%2F2020-endorsements&candidate_specific_endorsement_url=https%3A%2F%2Fwww.philting.com%2F&show_data=1
// https://quality.wevote.us/candidate-for-extension?candidate_name=DOYLE%20CANNING&candidate_we_vote_id=wv02cand63228&endorsement_page_url=http%3A%2F%2Fclimatehawksvote.com%2Fendorsements%2Fendorsements-2020%2F&candidate_specific_endorsement_url=&voter_guide_possibility_id=

const {
  candidate_name: candidateName, endorsement_page_url: endorsementPageUrl, candidate_specific_endorsement_url: candidateSpecificEndorsementUrl,
  show_data: showDevelopmentData,
} = Object.fromEntries(new URLSearchParams(document.location.search));

console.log(candidateName);

export default function AddCandidateForExtension () {
  const [candidate, setCandidate] = useState({ candidateName, endorsementPageUrl, candidateSpecificEndorsementUrl });


  const handleChange = ({ target }) => {
    const { name, value } = target;
    setCandidate((prevInformation) => ({
      ...prevInformation,
      [name]: value,
    }));
  };


  const handleSubmit = (event) => {
    event.preventDefault();
    alert(JSON.stringify(candidate, null, 2));
  };
  renderLog('AddCandidateForExtension');  // Set LOG_RENDER_EVENTS to log all renders

  // const { allCachedPositionsForThisCandidate, candidate, organizationWeVoteId, scrolledDown, candidateWeVoteId, value } = this.state;
  console.log('AddCandidateForExtension render');

  const showDevStuff = showDevelopmentData || true;
  return (
    <Wrapper style={{ margin: '20px' }}>
      <a href="https://wevote.us">
        <AddCandidateLogo src="../../../../img/global/logos/we-vote-logo-square-48x48.png" />
      </a>
      <AddCandidateHeader>Add Candidate</AddCandidateHeader>
      <IntroText>
        Please check that the following inputs contain the correct information, and fill out the candidate website box if possible.
      </IntroText>
      {showDevStuff && (
        <form onSubmit={handleSubmit}>
          <CandidateForm>
            <CandidateTextField required variant="outlined" fullWidth color="primary" label="Candidate Name" defaultValue={candidateName} name="Candidate Name" value={candidate.candidateName} InputLabelProps={{ style: { 'font-family': 'Nunito Sans' } }} InputProps={{ style: { 'font-family': 'Nunito Sans' } }} onChange={handleChange} />
            <CandidateTextField required variant="outlined" fullWidth color="primary" label="Endorsement URL" defaultValue={endorsementPageUrl} name="Endorsement URL" value={candidate.endorsementPageUrl} InputLabelProps={{ style: { 'font-family': 'Nunito Sans' } }} InputProps={{ style: { 'font-family': 'Nunito Sans' } }} onChange={handleChange} />
            <CandidateTextField variant="outlined" fullWidth color="primary" label="Candidate Website" defaultValue={candidateSpecificEndorsementUrl} name="Candidate URL" value={candidate.candidateSpecificEndorsementUrl} InputLabelProps={{ style: { 'font-family': 'Nunito Sans' } }} InputProps={{ style: { 'font-family': 'Nunito Sans' } }} onChange={handleChange} />
          </CandidateForm>
          <ButtonWrapper>
            <Button variant="contained" color="primary" endIcon={<SendIcon />} type="submit">Submit</Button>
          </ButtonWrapper>
        </form>
      )}
    </Wrapper>
  );
}
AddCandidateForExtension.propTypes = {
  location: PropTypes.object,
};

const Wrapper = styled('div')`
  height: 100vh;
  background: white;
  width: 410px;
`;

const IntroText = styled('div')`
  margin-bottom: 20px;
`;

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

const AddCandidateLogo = styled('img')`
  display: block;
  vertical-align: center;
  margin: 20px auto;
  //margin-top: 20px;
`;

const AddCandidateHeader = styled('h1')`
  font-size: 32px;
  font-weight: 500;
`;



