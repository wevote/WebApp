import React, { useState } from 'react';
import styled from 'styled-components';
import AddCandidateExtensionForm from './AddCandidateExtensionForm';
import normalizedImagePath from '../../../common/utils/normalizedImagePath';
import { renderLog } from '../../../common/utils/logging';
// import voterGuidePossibilityStore from '../../../stores/VoterGuidePossibilityStore';


// https://localhost:3000/add-candidate-for-extension?candidate_name=Phil%20Ting&candidate_we_vote_id=wv02cand40131&endorsement_page_url=https%3A%2F%2Fwww.sierraclub.org%2Fcalifornia%2F2020-endorsements&candidate_specific_endorsement_url=https%3A%2F%2Fwww.philting.com%2F&show_data=1
// https://quality.wevote.us/candidate-for-extension?candidate_name=DOYLE%20CANNING&candidate_we_vote_id=wv02cand63228&endorsement_page_url=http%3A%2F%2Fclimatehawksvote.com%2Fendorsements%2Fendorsements-2020%2F&candidate_specific_endorsement_url=&voter_guide_possibility_id=

let {
  candidate_name: candidateName, candidate_specific_endorsement_url: candidateSpecificEndorsementUrl, endorsement_page_url: endorsementPageUrl, endorsement_text: endorsementText,
} = Object.fromEntries(new URLSearchParams(document.location.search));

const { show_data: showDevelopmentData } = Object.fromEntries(new URLSearchParams(document.location.search));


if (!candidateName) {
  candidateName = '';
}
if (!candidateSpecificEndorsementUrl) {
  candidateSpecificEndorsementUrl = '';
}
if (!endorsementPageUrl) {
  endorsementPageUrl = '';
}
if (!endorsementText) {
  endorsementText = '';
}
const stance = 'SUPPORT';


/**
 * Page containing a form that collects a new candidate endorsement
 * @returns {JSX.Element}
 */
export default function AddCandidateForExtension () {
  const [candidate, setCandidate] = useState({ candidateName, endorsementPageUrl, candidateSpecificEndorsementUrl, endorsementText, stance });

  renderLog('AddCandidateForExtension');  // Set LOG_RENDER_EVENTS to log all renders

  const showDevStuff = showDevelopmentData || true;
  return (
    <AddCandidateForExtensionWrapper>
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <a href="https://wevote.us" target="_blank" rel="noreferrer">
        <AddCandidateLogo src={normalizedImagePath('/img/global/svg-icons/we-vote-icon-square-color-dark.svg')} />
      </a>
      <AddCandidateHeader>Add Candidate</AddCandidateHeader>
      <IntroText>
        Please check that the following inputs contain the correct information, and fill out the candidate website and endorsement text boxes if possible.
      </IntroText>
      {showDevStuff && (
        <AddCandidateExtensionForm candidate={candidate} setCandidate={setCandidate} />
      )}
    </AddCandidateForExtensionWrapper>
  );
}

const AddCandidateForExtensionWrapper = styled('div')`
  background: white;
  height: 100vh;
  margin: 0 20px 20px 20px;
  width: 410px;
`;

const AddCandidateHeader = styled('h1')`
  font-size: 32px;
  font-weight: 500;
  margin-bottom: 5px;
  margin-top: 0;
`;

const AddCandidateLogo = styled('img')`
  display: block;
  margin: 0 auto;
  max-height: 11%;
  vertical-align: center;
  //margin-top: 20px;
`;

const IntroText = styled('div')`
  margin-bottom: 15px;
`;
